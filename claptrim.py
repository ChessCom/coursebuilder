#!/usr/bin/env python3
"""
claptrim.py v1 — Detect clap onset and speech end in the original MP4 audio.

No numpy needed — uses only stdlib + ffmpeg (must be in PATH).

IN  point = clap_onset - 0.5 s   (first sharp transient in first 30 s)
OUT point = speech_end  + 0.5 s  (last silence_start before end of video)

Output per video (one JSON line to stdout):
    {"path":"...", "ok":true,  "in":2.45, "out":47.3, "clap":2.95, "speech_end":46.8}
    {"path":"...", "ok":false, "error":"clap not found in first 30s"}
"""

import sys
import os
import json
import subprocess
import array
import math
import re

VERSION = "2"

# ─── Ensure Homebrew / common bin dirs are in PATH ───────────────────────────
# CEP panels spawn processes without the user's full shell PATH.
for _p in ["/opt/homebrew/bin", "/usr/local/bin", "/usr/bin"]:
    if _p not in os.environ.get("PATH", ""):
        os.environ["PATH"] = _p + ":" + os.environ.get("PATH", "")

# Locate ffmpeg / ffprobe (full path preferred for reliability)
def _find_bin(name):
    for d in ["/opt/homebrew/bin", "/usr/local/bin", "/usr/bin"]:
        p = os.path.join(d, name)
        if os.path.isfile(p):
            return p
    return name   # fallback: rely on PATH

FFMPEG  = _find_bin("ffmpeg")
FFPROBE = _find_bin("ffprobe")

SR              = 22050    # Hz for clap analysis (first 30 s only)
CLAP_SEARCH_S   = 30       # look for clap only in first N seconds
PRE_CLAP_S      = 0.5      # in_point  = clap_time  - this
POST_SPEECH_S   = 0.5      # out_point = speech_end + this
SILENCE_DB      = "-35dB"  # ffmpeg silencedetect threshold
SILENCE_DUR     = "0.3"    # minimum silence duration (seconds)


# ─── Audio helpers ────────────────────────────────────────────────────────────

def _extract_pcm(video_path, duration=None):
    """Extract mono 16-bit PCM from video via ffmpeg pipe."""
    cmd = [FFMPEG, "-y", "-i", video_path]
    if duration:
        cmd += ["-t", str(duration)]
    cmd += ["-vn", "-ar", str(SR), "-ac", "1", "-f", "s16le", "pipe:1"]
    r = subprocess.run(cmd, capture_output=True, timeout=180)
    if r.returncode != 0 or not r.stdout:
        raise RuntimeError(r.stderr.decode(errors="replace")[:300])
    buf = array.array("h")
    buf.frombytes(r.stdout)
    return buf


def _frame_rms(buf, start, end):
    """RMS of samples[start:end] normalised to [0, 1]."""
    n = end - start
    if n <= 0:
        return 0.0
    total = sum(buf[i] * buf[i] for i in range(start, end))
    return math.sqrt(total / n) / 32768.0


# ─── Clap detection (pure Python, first 30 s only) ───────────────────────────

def find_clap(buf, frame_ms=5):
    """Return time (seconds) of first sharp transient, or None."""
    frame_n  = max(1, SR * frame_ms // 1000)
    n_frames = len(buf) // frame_n

    # Baseline: first 300 ms should be silence before the clap
    base_n   = max(1, 300 // frame_ms)
    base_sum = sum(
        _frame_rms(buf, i * frame_n, (i + 1) * frame_n)
        for i in range(min(base_n, n_frames))
    )
    baseline  = base_sum / max(1, min(base_n, n_frames))
    threshold = max(baseline * 15.0, 0.07)

    for i in range(base_n, n_frames):
        if _frame_rms(buf, i * frame_n, (i + 1) * frame_n) > threshold:
            return round(i * frame_ms / 1000.0, 3)

    return None


# ─── Speech-end detection (ffmpeg silencedetect — fast, no numpy) ─────────────

def find_speech_end(video_path):
    """Return time (seconds) at which the last silence begins (= speech end)."""
    cmd = [
        FFMPEG, "-i", video_path, "-vn",
        "-af", "silencedetect=noise=" + SILENCE_DB + ":d=" + SILENCE_DUR,
        "-f", "null", "-",
    ]
    r = subprocess.run(cmd, capture_output=True, timeout=300)
    output = r.stderr.decode(errors="replace")

    # Total duration fallback
    total_dur = 0.0
    m = re.search(r"Duration:\s*(\d+):(\d+):([\d.]+)", output)
    if m:
        total_dur = int(m.group(1)) * 3600 + int(m.group(2)) * 60 + float(m.group(3))

    starts = [float(x) for x in re.findall(r"silence_start:\s*([\d.]+)", output)]

    if starts:
        return round(starts[-1], 3)   # last silence = after speech ends

    return round(total_dur, 3)


# ─── Per-file processing ──────────────────────────────────────────────────────

def process(video_path):
    # 1. Clap detection from first CLAP_SEARCH_S seconds
    try:
        buf = _extract_pcm(video_path, duration=CLAP_SEARCH_S)
    except Exception as e:
        return {"path": video_path, "ok": False, "error": "ffmpeg (clap): " + str(e)}

    clap_time = find_clap(buf)
    if clap_time is None:
        return {"path": video_path, "ok": False, "error": "clap not found in first 30 s"}

    in_point = round(max(0.0, clap_time - PRE_CLAP_S), 3)

    # 2. Speech-end via silencedetect (full file, fast)
    try:
        speech_end = find_speech_end(video_path)
    except Exception as e:
        return {"path": video_path, "ok": False, "error": "silencedetect: " + str(e)}

    out_point = round(speech_end + POST_SPEECH_S, 3)

    return {
        "path":       video_path,
        "ok":         True,
        "in":         in_point,
        "out":        out_point,
        "clap":       clap_time,
        "speech_end": speech_end,
    }


# ─── Main ─────────────────────────────────────────────────────────────────────

def main():
    paths = [a for a in sys.argv[1:] if not a.startswith("--")]
    if not paths:
        print(json.dumps({"ok": False, "error": "no video paths provided"}), flush=True)
        sys.exit(1)
    print("claptrim v" + VERSION, flush=True)
    for path in paths:
        result = process(path)
        print(json.dumps(result), flush=True)


if __name__ == "__main__":
    main()
