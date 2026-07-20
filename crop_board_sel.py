#!/usr/bin/env python3
"""
crop_board_sel.py — Detect chessboard crop values for one or more video files.

Called by the Course Builder CEP panel with video file paths as arguments.
Outputs one JSON line per video to stdout — no Premiere connection needed.

Usage (called by the panel automatically):
    python3 crop_board_sel.py /path/video1.mp4 /path/video2.mp4 ...

Output — one JSON per line:
    {"path": "...", "ok": true,  "left": 1.2, "top": 3.4, "right": 1.1, "bottom": 2.0, "clipW": 3840, "clipH": 2160}
    {"path": "...", "ok": false, "error": "board not detected"}
"""

import sys
import os
import json

_here = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, _here)

try:
    from detect_chessboard import extract_frame, detect
except ImportError as e:
    print(json.dumps({"ok": False, "error": f"cannot import detect_chessboard: {e}"}), flush=True)
    sys.exit(1)


def process(video_path: str, mode: str = 'chessbase') -> dict:
    frame_path = None
    try:
        frame_path = extract_frame(video_path, 2.0)
        result = detect(frame_path, mode=mode)
        if result:
            left, top, right, bottom, clip_w, clip_h = result
            return {
                "path": video_path, "ok": True,
                "left": left, "top": top, "right": right, "bottom": bottom,
                "clipW": clip_w, "clipH": clip_h,
            }
        return {"path": video_path, "ok": False, "error": "board not detected"}
    except Exception as e:
        return {"path": video_path, "ok": False, "error": str(e)}
    finally:
        if frame_path and os.path.exists(frame_path):
            try: os.unlink(frame_path)
            except: pass


def main():
    mode = next((a.split('=',1)[1] for a in sys.argv if a.startswith('--mode=')), 'chessbase')
    paths = [a for a in sys.argv[1:] if not a.startswith("--")]
    if not paths:
        print(json.dumps({"ok": False, "error": "no video paths provided"}), flush=True)
        sys.exit(1)

    for path in paths:
        result = process(path, mode=mode)
        print(json.dumps(result), flush=True)  # one line per clip, immediate


if __name__ == "__main__":
    main()
