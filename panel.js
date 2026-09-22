/* Course Builder Panel v112.0 — https://github.com/ChessCom/coursebuilder */
(function () {

/* ── Build HTML ──────────────────────────────────────────────────────────── */
document.getElementById('app').innerHTML = [
    '<header>',
    '  <h1>Course Builder <span id="versionTag">v112.0</span></h1>',
    '  <div class="header-status-row" style="display:flex;gap:12px;align-items:center;margin-top:3px"><span id="cepStatus" style="font-size:10px;color:#666"></span><span id="scriptStatus" style="font-size:10px;color:#666"><span style="color:#aaa">&#9679;</span> loading script...</span></div>',
    '</header>',
    '<div class="course-section">',
    '  <div class="course-label">Detected course:</div>',
    '  <div class="course-name pending" id="courseName">detecting...</div>',
    '</div>',
    '<div class="section">',
    '  <button class="btn-run" id="btnRun">&#9654; Build Course</button>',
    '  <button class="btn-test" id="btnTest">&#9654; Test (1 chapter)</button>',
    '  <div class="status" id="status"></div>',
    '</div>',
    '<div class="tool-divider">Preview Sequences <span class="tool-ver">v1.4</span></div>',
    '<div class="section">',
    '  <div class="ac-buttons">',
    '    <button class="btn-ac-sel" id="btnCreatePreviews">&#9654; Create Preview Sequences</button>',
    '    <button class="btn-ac-sel" id="btnCutPreview">&#9654; Cut Preview</button>',
    '  </div>',
    '  <div class="status" id="psStatus"></div>',
    '</div>',
    '<div class="tool-divider">AutoCut <span class="tool-ver">v0.29</span></div>',
    '<div class="path-section">',
    '  <div class="path-label">Chapter (test):</div>',
    '  <input type="text" id="acChapter" class="path-input" placeholder="e.g. Chapter 4a Part1">',
    '</div>',
    '<div class="section">',
    '  <div class="ac-buttons">',
    '    <button class="btn-ac-test" id="btnAcTest">&#9654; Test Chapter</button>',
    '    <button class="btn-ac-run"  id="btnAcRun">&#9654; Run Course</button>',
    '  </div>',
    '  <div class="status" id="acStatus"></div>',
    '</div>',
    '<div class="tool-divider">BoardCrop <span class="tool-ver">v3.5</span></div>',
    '<div class="section">',
    '  <div class="ac-buttons">',
    '    <button class="btn-ac-sel" id="btnBcSel">&#9654; BoardCrop CHESSBASE</button>',
    '    <button class="btn-ac-sel" id="btnBcChessCom">&#9654; BoardCrop CHESS.COM</button>',
    '  </div>',
    '  <div class="status" id="bcStatus"></div>',
    '</div>',
    '<div class="tool-divider">SyncClap <span class="tool-ver">v6</span></div>',
    '<div class="section">',
    '  <button class="btn-at" id="btnAt">&#9654; SyncClap (clap + speech)</button>',
    '  <button class="btn-at-test" id="btnAt5sec">5secTest</button>',
    '  <div class="status" id="atStatus"></div>',
    '</div>',
    '<div class="tool-divider">Manual Sync <span class="tool-ver">v22</span></div>',
    '<div class="path-section">',
    '  <div class="path-label">Course ID:</div>',
    '  <input type="text" id="msCourseId" class="path-input" value="424926" placeholder="424926">',
    '</div>',
    '<div class="section">',
    '  <button class="btn-run" id="btnMs">&#9654; Manual Sync</button>',
    '  <div class="status" id="msStatus"></div>',
    '</div>',
    '<div id="msChapterNav" style="display:none">',
    '  <div class="path-section">',
    '    <div class="path-label" id="msChapterLabel">Chapter 1/14</div>',
    '  </div>',
    '  <div class="section">',
    '    <button class="btn-test" id="btnMsVerify">&#9654; Verify boards</button>',
    '    <button class="btn-run"  id="btnMsFill">&#9654; Fill</button>',
    '    <button class="btn-test" id="btnMsNext">Next &#8250;</button>',
    '    <button class="btn-test" id="btnMsPrev" style="display:none">&#8249; Previous</button>',
    '    <div class="status" id="msFillStatus"></div>',
    '  </div>',
    '</div>',
    '<div class="tool-divider">Legacy Updater <span class="tool-ver">v1</span></div>',
    '<div class="section">',
    '  <div class="lu-card">',
    '    <div class="lu-card-title">Board</div>',
    '    <div class="lu-row">',
    '      <button class="btn-small" id="luTbCap1">&#9312; Capture initial</button>',
    '      <button class="btn-small" id="luTbCap2">&#9313; Capture new pos.</button>',
    '    </div>',
    '    <div class="lu-info" id="luTbInfo">&mdash;</div>',
    '  </div>',
    '  <div class="lu-card">',
    '    <div class="lu-card-title">Author</div>',
    '    <div class="lu-row">',
    '      <button class="btn-small" id="luAutorCap1">&#9312; Capture initial</button>',
    '      <button class="btn-small" id="luAutorCap2">&#9313; Capture new pos.</button>',
    '    </div>',
    '    <div class="lu-info" id="luAutorInfo">&mdash;</div>',
    '  </div>',
    '  <div class="lu-card">',
    '    <div class="lu-card-title">Background</div>',
    '    <div class="lu-row">',
    '      <button class="btn-small" id="luBgSel">Browse file...</button>',
    '    </div>',
    '    <div class="lu-info" id="luBgInfo">&mdash;</div>',
    '  </div>',
    '  <div class="lu-card">',
    '    <div class="lu-card-title">Delete clips</div>',
    '    <div class="lu-row">',
    '      <button class="btn-small" id="luDelMark">Mark selection</button>',
    '      <button class="btn-small" id="luDelClear">Clear</button>',
    '    </div>',
    '    <div class="lu-info" id="luDelInfo">&mdash;</div>',
    '  </div>',
    '  <div class="lu-row" style="margin-top:4px">',
    '    <button class="btn-lu-run" id="luBtnTest">&#9654; Test (chapter)</button>',
    '    <button class="btn-lu-run" id="luBtnRun">&#9654;&#9654; Apply to course</button>',
    '  </div>',
    '  <div class="status" id="luStatus"></div>',
    '  <div class="lu-log" id="luLog" style="display:none"></div>',
    '  <div class="lu-card" style="margin-top:6px">',
    '    <div class="lu-card-title">Export</div>',
    '    <div class="lu-row">',
    '      <button class="btn-small" id="luExportDir">Output folder...</button>',
    '    </div>',
    '    <div class="lu-info" id="luExportInfo">&mdash;</div>',
    '    <button class="btn-at" style="margin-top:6px;width:100%" id="luBtnExport">&#128270; Preview export list</button>',
    '    <button class="btn-at" style="margin-top:6px;width:100%;display:none;background:#2a7a3b" id="luBtnQueue">&#128228; Queue in Media Encoder</button>',
    '  </div>',
    '</div>',
    '<div class="tool-divider">Legacy Wistia <span class="tool-ver">v1</span></div>',
    '<div class="section">',
    '  <div style="display:grid;grid-template-columns:1fr 1fr;gap:6px;margin-bottom:6px">',
    '    <div>',
    '      <div class="lu-info" style="margin-bottom:3px"><b>Tablero</b></div>',
    '      <div style="display:flex;gap:4px;margin-bottom:3px"><input class="lw-inp" id="lwTblX" placeholder="X" style="width:100%"><input class="lw-inp" id="lwTblY" placeholder="Y" style="width:100%"></div>',
    '      <input class="lw-inp" id="lwTblScale" placeholder="Scale" style="width:100%">',
    '    </div>',
    '    <div>',
    '      <div class="lu-info" style="margin-bottom:3px"><b>Autor</b></div>',
    '      <div style="display:flex;gap:4px;margin-bottom:3px"><input class="lw-inp" id="lwAutX" placeholder="X" style="width:100%"><input class="lw-inp" id="lwAutY" placeholder="Y" style="width:100%"></div>',
    '      <input class="lw-inp" id="lwAutScale" placeholder="Scale" style="width:100%">',
    '    </div>',
    '  </div>',
    '  <button class="btn-small" id="lwBtnCapture" style="width:100%;margin-bottom:6px">&#128247; Capture from test</button>',
    '  <div style="display:flex;align-items:center;gap:6px;margin-bottom:4px">',
    '    <input type="checkbox" id="lwChkIO" checked style="margin:0">',
    '    <label for="lwChkIO" class="lu-info" style="margin:0;cursor:pointer">Add Intro-Outro at end</label>',
    '    <button class="btn-small" id="lwBtnIO" style="margin-left:auto">File...</button>',
    '  </div>',
    '  <div class="lu-info" id="lwIOInfo" style="margin-bottom:6px;font-style:italic">&mdash;</div>',
    '  <div style="display:flex;align-items:center;gap:6px;margin-bottom:6px">',
    '    <button class="btn-small" id="lwBtnBg" style="flex-shrink:0">Fondo...</button>',
    '    <div class="lu-info" id="lwBgInfo" style="margin:0;font-style:italic;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;flex:1">&mdash;</div>',
    '  </div>',
    '  <div class="lu-info" id="lwInfo" style="margin-bottom:4px">Abre la secuencia <b>test</b> activa y pulsa Apply.</div>',
    '  <button class="btn-lu-run" id="lwBtnRun" style="width:100%">&#9654;&#9654; Apply to all chapters</button>',
    '  <button class="btn-small" id="lwBtnPluginDx" style="width:100%;margin-top:6px">&#127900; Apply Plugin dx</button>',
    '  <div style="display:flex;align-items:center;gap:6px;margin-top:6px;margin-bottom:4px">',
    '    <button class="btn-small" id="lwBtnDir" style="flex-shrink:0">Carpeta...</button>',
    '    <div class="lu-info" id="lwDirInfo" style="margin:0;font-style:italic;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;flex:1">&mdash;</div>',
    '  </div>',
    '  <div style="display:flex;gap:6px;margin-top:2px">',
    '    <button class="btn-small" id="lwBtnPreview" style="flex:1">&#128203; Preview export list</button>',
    '    <button class="btn-small" id="lwBtnAME" style="flex:1">&#9654; Send to AME</button>',
    '  </div>',
    '  <div class="lu-info" id="lwStatus" style="margin-top:6px;display:none"></div>',
    '</div>',
    '<div class="tool-divider">PP26 AI Diagnostic <span class="tool-ver">v1</span></div>',
    '<div class="section">',
    '  <div class="lu-info" style="margin-bottom:6px">Detecta si PP26 expone API para background removal / object tracking.</div>',
    '  <button class="btn-at" style="width:100%" id="btnPP26Diag">&#128269; Run diagnostic</button>',
    '  <pre id="pp26DiagOut" style="margin-top:8px;font-size:9px;max-height:200px;overflow:auto;white-space:pre-wrap;display:none;background:#1a1a1a;padding:6px;border-radius:4px"></pre>',
    '</div>',
    '<div class="log-header">',
    '  <span>Log</span>',
    '  <div class="actions">',
    '    <button class="btn-small" id="btnRefresh">&#8635; Refresh</button>',
    '    <button class="btn-small" id="btnCopy">Copy</button>',
    '  </div>',
    '</div>',
    '<pre id="log">(no log)</pre>'
].join('\n');

/* ── Restore localStorage inputs ─────────────────────────────────────────── */
(function () {
    var pairs = [
        ['acChapter', 'ac_chapter'],
        ['msCourseId','ms_course_id']
    ];
    for (var i = 0; i < pairs.length; i++) {
        try {
            var el = document.getElementById(pairs[i][0]);
            var v  = localStorage.getItem(pairs[i][1]);
            if (el && v) el.value = v;
        } catch(e) {}
    }
})();

/* ── CEP bridge check ────────────────────────────────────────────────────── */
var _hasCEP = (typeof window.__adobe_cep__ !== 'undefined');
var cs = null;
try { cs = new CSInterface(); } catch (e) {}

var cepStatusEl = document.getElementById('cepStatus');
if (cepStatusEl) {
    cepStatusEl.textContent = _hasCEP ? '✓ CEP active' : '✗ CEP not detected';
    cepStatusEl.style.color  = _hasCEP ? '#4caf50'     : '#f44336';
}

/* ── Safe eval ───────────────────────────────────────────────────────────── */
function safeEvalScript(script, callback) {
    if (!_hasCEP) {
        if (typeof callback === 'function') callback('ERROR: CEP unavailable — open the panel from Premiere Pro');
        return;
    }
    try {
        window.__adobe_cep__.evalScript(script, function (result) {
            if (typeof callback === 'function') callback(result);
        });
    } catch (e) {
        if (typeof callback === 'function') callback('ERROR: ' + e.message);
    }
}


/* ── Script status bullet ────────────────────────────────────────────────── */
function setScriptStatus(text, state) {
    var color = state === 'ok' ? '#4caf50' : state === 'error' ? '#f44336' : '#aaa';
    var el = document.getElementById('scriptStatus');
    if (el) el.innerHTML = '<span style="color:' + color + '">&#9679;</span> ' + text;
}

/* ── Download from GitHub (follows redirects) ───────────────────────────── */
var GH_BASE = 'https://raw.githubusercontent.com/ChessCom/coursebuilder/main/';
var JSX_URL = GH_BASE + 'course_builder.jsx';
function jsxUrl() { return JSX_URL + '?t=' + Date.now(); }

function downloadRemote(url, tmpPath, onSuccess, onError) {
    var https = require('https');
    var http  = require('http');
    var fs    = require('fs');

    function doGet(getUrl, redirects) {
        if (redirects > 5) { onError('Too many redirects'); return; }
        var proto = getUrl.indexOf('https://') === 0 ? https : http;
        var req = proto.get(getUrl, function (res) {
            if (res.statusCode === 301 || res.statusCode === 302 || res.statusCode === 303) {
                var loc = res.headers.location;
                res.resume();
                if (!loc) { onError('Redirect with no location'); return; }
                doGet(loc, redirects + 1);
                return;
            }
            if (res.statusCode !== 200) { onError('HTTP ' + res.statusCode); return; }
            var data = '';
            res.setEncoding('utf8');
            res.on('data', function (chunk) { data += chunk; });
            res.on('end', function () {
                try { fs.writeFileSync(tmpPath, data, 'utf8'); onSuccess(tmpPath); }
                catch(e) { onError('Write error: ' + e.message); }
            });
        });
        req.on('error', function (err) { onError(err.message); });
        req.setTimeout(15000, function () { req.abort(); onError('No internet connection'); });
    }
    doGet(url, 0);
}

function downloadRemoteJsx(url, onSuccess, onError) {
    var tmpPath = require('path').join(require('os').tmpdir(), 'course_builder_online.jsx');
    downloadRemote(url, tmpPath, onSuccess, onError);
}

function downloadPy(scriptName, onSuccess, onError) {
    var tmpPath = require('path').join(require('os').tmpdir(), 'cb_' + scriptName);
    downloadRemote(GH_BASE + scriptName + '?t=' + Date.now(), tmpPath, onSuccess, onError);
}

/* Fetch on panel load — show status bullet early */
setScriptStatus('loading script...', 'loading');
downloadRemoteJsx(jsxUrl(),
    function () { setScriptStatus('script loaded', 'ok'); },
    function (e) { setScriptStatus(e, 'error'); }
);

/* ── Run (Build Course / Test) ───────────────────────────────────────────── */
function runScript(testOnly) {
    var btnRun  = document.getElementById('btnRun');
    var btnTest = document.getElementById('btnTest');
    var status  = document.getElementById('status');

    btnRun.disabled  = true;
    btnTest.disabled = true;
    if (testOnly) { btnTest.innerHTML = '⏳ Testing...'; }
    else          { btnRun.innerHTML  = '⏳ Running...'; }
    document.getElementById('log').textContent = '';
    status.textContent = 'Downloading script...';
    status.className   = 'status running';
    setScriptStatus('loading script...', 'loading');

    downloadRemoteJsx(jsxUrl(),
        function (scriptPath) {
            setScriptStatus('script loaded', 'ok');
            status.textContent = testOnly ? 'Launching (test mode)...' : 'Launching script...';

            var esc = scriptPath.replace(/\\/g, '\\\\').replace(/"/g, '\\"');
            var runCode =
                '(function(){' +
                    '$.CB_TEST_ONLY=' + (testOnly ? '1' : '0') + ';' +
                    'var f=new File("' + esc + '");' +
                    'if(!f.exists)return "ERROR: file not found: "+f.fsName;' +
                    'try{var _lf=new File(Folder.desktop.fsName+"/cb_log.txt");' +
                        'if(_lf.open("w")){_lf.encoding="UTF-8";' +
                        '_lf.write("[panel] launching: "+f.fsName+"\\n");_lf.close();}}catch(_le){}' +
                    'try{$.evalFile(f);return "ok";}' +
                    'catch(e){return "ERROR: "+e.message;}' +
                '})()';

            var _pollTimer = setInterval(refreshLog, 3000);
            safeEvalScript(runCode, function (result) {
                clearInterval(_pollTimer);
                btnRun.disabled  = false;
                btnTest.disabled = false;
                btnRun.innerHTML  = '&#9654; Build Course';
                btnTest.innerHTML = '&#9654; Test (1 chapter)';
                if (!result || result.indexOf('ERROR') === 0) {
                    status.textContent = result || 'Unknown error';
                    status.className   = 'status error';
                } else {
                    status.textContent = testOnly ? 'Test completed.' : 'Completed.';
                    status.className   = 'status done';
                }
                refreshLog();
            });
        },
        function (err) {
            btnRun.disabled  = false;
            btnTest.disabled = false;
            btnRun.innerHTML  = '&#9654; Build Course';
            btnTest.innerHTML = '&#9654; Test (1 chapter)';
            status.textContent = 'ERROR: ' + err;
            status.className   = 'status error';
            setScriptStatus(err, 'error');
        }
    );
}

document.getElementById('btnRun').addEventListener('click',  function () { runScript(false); });
document.getElementById('btnTest').addEventListener('click', function () { runScript(true);  });

/* ── Refresh log ─────────────────────────────────────────────────────────── */
function refreshLog() {
    safeEvalScript(
        '(function(){' +
            'try{' +
                'var f=new File(Folder.desktop.fsName+"/cb_log.txt");' +
                'if(!f.exists)return "(empty log)";' +
                'f.encoding="UTF-8";' +
                'if(!f.open("r"))return "(cannot read log)";' +
                'var s=f.read();f.close();return s;' +
            '}catch(e){return "Error reading log: "+e.message;}' +
        '})()',
        function (content) {
            var el = document.getElementById('log');
            if (!content) { el.textContent = '(no log)'; return; }
            if (content.indexOf('ERROR:') === 0) { el.textContent = content; return; }
            el.textContent = content;
            el.scrollTop   = el.scrollHeight;
        }
    );
}

document.getElementById('btnRefresh').addEventListener('click', refreshLog);

document.getElementById('btnCopy').addEventListener('click', function () {
    var text = document.getElementById('log').textContent;
    var ta   = document.createElement('textarea');
    ta.value = text;
    document.body.appendChild(ta);
    ta.select();
    document.execCommand('copy');
    document.body.removeChild(ta);
    var btn = document.getElementById('btnCopy');
    btn.textContent = '✓ Copied';
    setTimeout(function () { btn.textContent = 'Copy'; }, 1500);
});

/* ── Detect course ───────────────────────────────────────────────────────── */
function detectCourse() {
    var el = document.getElementById('courseName');
    if (!el) return;
    if (!_hasCEP) {
        el.textContent = '(requires Premiere Pro)';
        el.className   = 'course-name pending';
        return;
    }
    el.textContent = 'detecting...';
    el.className   = 'course-name pending';

    safeEvalScript(
        '(function(){' +
            'try{' +
                'var s=null;' +
                'for(var i=0;i<app.project.sequences.numSequences;i++){' +
                    'if(app.project.sequences[i].name==="test2"){s=app.project.sequences[i];break;}' +
                '}' +
                'if(!s)return "(test2 not found)";' +
                'function findPath(seq,depth){' +
                    'if(!seq||depth>2)return "";' +
                    'for(var vi=0;vi<seq.videoTracks.numTracks;vi++){' +
                        'var vt=seq.videoTracks[vi];' +
                        'for(var ci=0;ci<vt.clips.numItems;ci++){' +
                            'if(!vt.clips[ci]||!vt.clips[ci].projectItem)continue;' +
                            'var mp="";' +
                            'try{mp=vt.clips[ci].projectItem.getMediaPath();}catch(e){}' +
                            'if(mp&&/\\.(mp4|mov|avi|mxf|mkv|m4v|wmv|r3d|braw)$/i.test(mp))return mp;' +
                            'if(!mp){' +
                                'var iname=vt.clips[ci].projectItem.name;' +
                                'for(var si2=0;si2<app.project.sequences.numSequences;si2++){' +
                                    'if(app.project.sequences[si2].name===iname){' +
                                        'var r=findPath(app.project.sequences[si2],depth+1);' +
                                        'if(r)return r;' +
                                        'break;' +
                                    '}' +
                                '}' +
                            '}' +
                        '}' +
                    '}' +
                    'return "";' +
                '}' +
                'var mp=findPath(s,0);' +
                'if(!mp)return "(no mediaPath in test2 or its nested)";' +
                'var dir=new File(mp).parent;' +
                'for(var d=0;d<15;d++){' +
                    'if(!dir||!dir.exists)break;' +
                    'if(new Folder(dir.fsName+"/1_Chapters").exists){' +
                        'var p=dir.parent;' +
                        'return (p&&p.exists)?p.name:dir.name;' +
                    '}' +
                    'dir=dir.parent;' +
                '}' +
                'return "(1_Chapters not found)";' +
            '}catch(e){return "ERR: "+e.message;}' +
        '})()',
        function (result) {
            if (!result) {
                el.textContent = '(no result)';
                el.className   = 'course-name pending';
            } else if (result.indexOf('ERR:') === 0 || result.charAt(0) === '(') {
                el.textContent = result;
                el.className   = 'course-name error';
            } else {
                try { result = decodeURIComponent(result); } catch(e) {}
                el.textContent = result;
                el.className   = 'course-name';
            }
        }
    );
}

refreshLog();
detectCourse();

/* ═══════════════════════════════════════════════════════════════════════════
   AutoCut
═══════════════════════════════════════════════════════════════════════════ */
var acChapterInput = document.getElementById('acChapter');
acChapterInput.addEventListener('change', function () {
    try { localStorage.setItem('ac_chapter', acChapterInput.value.trim()); } catch(e) {}
});

function runAutocut(singleChapter) {
    var btnAcTest = document.getElementById('btnAcTest');
    var btnAcRun  = document.getElementById('btnAcRun');
    var acStatus  = document.getElementById('acStatus');
    var logEl     = document.getElementById('log');
    var chapter   = acChapterInput.value.trim();

    if (singleChapter && !chapter) { acStatus.textContent = 'ERROR: enter the chapter name'; acStatus.className = 'status error'; return; }
    var cp;
    try { cp = require('child_process'); } catch(e) {
        acStatus.textContent = 'ERROR: Node.js unavailable'; acStatus.className = 'status error'; return;
    }

    btnAcTest.disabled   = true;
    btnAcRun.disabled    = true;
    btnAcTest.textContent = singleChapter ? '⏳ Downloading…' : '▶ Test Chapter';
    btnAcRun.textContent  = singleChapter ? '▶ Run Course'   : '⏳ Downloading…';
    acStatus.textContent  = 'Downloading autocut.py…';
    acStatus.className    = 'status running';
    logEl.textContent     = '';

    function appendLine(text) { logEl.textContent += text; logEl.scrollTop = logEl.scrollHeight; }

    downloadPy('autocut.py', function (pyPath) {
        acStatus.textContent  = singleChapter ? 'AutoCut: testing "' + chapter + '"…' : 'AutoCut: processing full course…';
        btnAcTest.textContent = singleChapter ? '⏳ Testing…'  : '▶ Test Chapter';
        btnAcRun.textContent  = singleChapter ? '▶ Run Course' : '⏳ Running…';

        var args = singleChapter ? [pyPath, chapter] : [pyPath];
        var proc = cp.spawn('python3', args);
        var buf = '';
        proc.stdout.on('data', function (chunk) {
            buf += chunk.toString();
            var lines = buf.split('\n'); buf = lines.pop();
            for (var i = 0; i < lines.length; i++) appendLine(lines[i] + '\n');
        });
        proc.stderr.on('data', function (chunk) { appendLine('ERR: ' + chunk.toString()); });
        proc.on('close', function (code) {
            if (buf) appendLine(buf + '\n');
            btnAcTest.disabled = false; btnAcRun.disabled = false;
            btnAcTest.textContent = '▶ Test Chapter'; btnAcRun.textContent = '▶ Run Course';
            acStatus.textContent = code === 0 ? (singleChapter ? 'Test completed.' : 'Course completed.') : 'AutoCut finished with code ' + code;
            acStatus.className   = code === 0 ? 'status done' : 'status error';
        });
        proc.on('error', function (err) {
            btnAcTest.disabled = false; btnAcRun.disabled = false;
            btnAcTest.textContent = '▶ Test Chapter'; btnAcRun.textContent = '▶ Run Course';
            acStatus.textContent = 'ERROR launching python3: ' + err.message;
            acStatus.className   = 'status error';
        });
    }, function (err) {
        btnAcTest.disabled = false; btnAcRun.disabled = false;
        btnAcTest.textContent = '▶ Test Chapter'; btnAcRun.textContent = '▶ Run Course';
        acStatus.textContent = 'ERROR downloading autocut.py: ' + err;
        acStatus.className   = 'status error';
    });
}

document.getElementById('btnAcTest').addEventListener('click', function () { runAutocut(true);  });
document.getElementById('btnAcRun').addEventListener('click',  function () { runAutocut(false); });

/* ═══════════════════════════════════════════════════════════════════════════
   BoardCrop
═══════════════════════════════════════════════════════════════════════════ */
var _BC_GET_CLIPS_JSX =
    '(function(){' +
        'var seq=app.project.activeSequence;' +
        'if(!seq)return JSON.stringify({error:"no active sequence",clips:[]});' +
        'var clips=[];' +
        'for(var vi=0;vi<seq.videoTracks.numTracks;vi++){' +
            'var tr=seq.videoTracks[vi];' +
            'for(var ci=0;ci<tr.clips.numItems;ci++){' +
                'var cl=tr.clips[ci];' +
                'var sel=false;try{sel=cl.isSelected();}catch(e){}' +
                'if(!sel)continue;' +
                'var mp="";try{mp=cl.projectItem.getMediaPath();}catch(e){}' +
                'if(!mp)continue;' +
                'clips.push({ti:vi,ci:ci,mp:mp,name:cl.name||""});' +
            '}' +
        '}' +
        'return JSON.stringify({error:"",clips:clips});' +
    '})()';

function _bcApplyJsx(ti, ci, mp, left, top, right, bottom, clipW, clipH, mode) {
    mode = mode || 'chessbase';
    var mpE = mp.replace(/\\/g,'\\\\').replace(/"/g,'\\"');
    var BOX_X1=953,BOX_Y1=55,BOX_X2=1865,BOX_Y2=967;
    var DX=0,DY=2;
    var IL=0.15,IR=0.20,IT=0.00,IB=0.95,SB=1.010;
    var isCC = (mode === 'chesscom');
    return '(function(){' +
        'var seq=app.project.activeSequence;' +
        'if(!seq)return "error:no seq";' +
        'var tr=seq.videoTracks['+ti+'];if(!tr)return "error:no track";' +
        'var cl=tr.clips['+ci+'];if(!cl)return "error:no clip";' +
        'var mp2="";try{mp2=cl.projectItem.getMediaPath();}catch(e){}' +
        'if(mp2!=="'+mpE+'")return "error:clip mismatch";' +
        'var seqW=seq.frameSizeHorizontal,seqH=seq.frameSizeVertical;' +
        'var compNames=[];for(var di=0;di<cl.components.numItems;di++)compNames.push(cl.components[di].displayName);' +
        'var mo=null;' +
        'for(var i=0;i<cl.components.numItems;i++){if(cl.components[i].displayName==="Motion"){mo=cl.components[i];break;}}' +
        'if(!mo)return "error:no Motion comps="+compNames.join(",");' +
        'for(var ri=0;ri<mo.properties.numItems;ri++){' +
            'var rp=mo.properties[ri],rn=rp.displayName;' +
            'try{var rkc=rp.keyframeCount;for(var rki=rkc-1;rki>=0;rki--)try{rp.removeKey(rki);}catch(e){}' +
                'if(rn==="Scale")rp.setValue(100,true);' +
                'else if(rn==="Uniform Scale")rp.setValue(1,true);' +
                'else if(rn==="Position")rp.setValue([0.5,0.5],false);' +
                'else if(rn==="Rotation")rp.setValue(0,true);}catch(e){}' +
        '}' +
        'for(var ri3=0;ri3<cl.components.numItems;ri3++){' +
            'if(cl.components[ri3].displayName==="Motion")continue;' +
            'var rc=cl.components[ri3];' +
            'for(var ri4=0;ri4<rc.properties.numItems;ri4++){' +
                'var rn4=rc.properties[ri4].displayName;' +
                'if(rn4==="Left"||rn4==="Crop Left"||rn4==="Top"||rn4==="Crop Top"||' +
                'rn4==="Right"||rn4==="Crop Right"||rn4==="Bottom"||rn4==="Crop Bottom")' +
                '{try{rc.properties[ri4].setValue(0,true);}catch(e){}}' +
            '}' +
        '}' +
        '$.sleep(120);' +
        'var left='+left+',top='+top+',right='+right+',bottom='+bottom+';' +
        'var clipW='+clipW+',clipH='+clipH+';' +
        'var bwp=100-left-right,bhp=100-top-bottom;' +
        'var bw=bwp/100*clipW,bh=bhp/100*clipH;' +
        'var bcx=(left+bwp/2)/100*clipW,bcy=(top+bhp/2)/100*clipH;' +
        (isCC ?
            'var s=Math.min(seqW/bw,seqH/bh);' +
            'var rawPx=seqW/2-(bcx-clipW/2)*s,rawPy=seqH/2-(bcy-clipH/2)*s;' +
            'var hwCC=clipW*s/2,hhCC=clipH*s/2;' +
            'var px=(2*hwCC>=seqW)?Math.max(seqW-hwCC,Math.min(hwCC,rawPx)):Math.max(hwCC,Math.min(seqW-hwCC,rawPx));' +
            'var py=(2*hhCC>=seqH)?Math.max(seqH-hhCC,Math.min(hhCC,rawPy)):Math.max(hhCC,Math.min(seqH-hhCC,rawPy));' :
            'var isWide=(left>25);' +
            'var s,px,py;' +
            'if(isWide){' +
                's=Math.min(seqW/bw,seqH/bh);' +
                'var rwPx=seqW/2-(bcx-clipW/2)*s,rwPy=seqH/2-(bcy-clipH/2)*s;' +
                'var hwW=clipW*s/2,hhW=clipH*s/2;' +
                'px=(2*hwW>=seqW)?Math.max(seqW-hwW,Math.min(hwW,rwPx)):Math.max(hwW,Math.min(seqW-hwW,rwPx));' +
                'py=(2*hhW>=seqH)?Math.max(seqH-hhW,Math.min(hhW,rwPy)):Math.max(hhW,Math.min(seqH-hhW,rwPy));' +
            '}else{' +
                'var boxW='+BOX_X2+'-'+BOX_X1+',boxH='+BOX_Y2+'-'+BOX_Y1+';' +
                'var boxCX=('+BOX_X1+'+'+BOX_X2+')/2+'+DX+',boxCY=('+BOX_Y1+'+'+BOX_Y2+')/2+'+DY+';' +
                's=Math.min(boxW/bw,boxH/bh)*'+SB+';' +
                'px=boxCX-(bcx-clipW/2)*s;py=boxCY-(bcy-clipH/2)*s;' +
            '}'
        ) +
        'var sc=s*100;var nx=px/seqW,ny=py/seqH;' +
        (isCC ? 'var cL=left,cR=right,cT=top,cB=bottom;' :
                'var cL=isWide?left:left+'+IL+';var cR=isWide?right:right+'+IR+';' +
                'var cT=isWide?top:top+'+IT+';var cB=isWide?bottom:bottom+'+IB+';') +
        'var log=["comps="+compNames.join(",")];' +
        'for(var pi=0;pi<mo.properties.numItems;pi++){' +
            'var p=mo.properties[pi],n=p.displayName;' +
            'try{if(n==="Scale"){p.setValue(sc,true);log.push("scale="+Math.round(sc*10)/10+"%");}' +
                'else if(n==="Uniform Scale")p.setValue(1,true);' +
                'else if(n==="Position"){p.setValue([nx,ny],false);log.push("pos=("+Math.round(px)+","+Math.round(py)+")");}' +
                'else if(n==="Rotation")p.setValue(0,true);}catch(e){log.push(n+":ERR="+e.message);}' +
        '}' +
        'var cropComp=null;' +
        'for(var dci=0;dci<cl.components.numItems;dci++){' +
            'var dcn=cl.components[dci].displayName;' +
            'if(dcn==="Crop"||dcn==="Recortar"){cropComp=cl.components[dci];break;}' +
        '}' +
        'if(!cropComp){' +
            'try{if(typeof app.enableQE==="function")app.enableQE();' +
                'var qeSeq2=qe.project.getActiveSequence();' +
                'var qeTrk=qeSeq2.getVideoTrackAt('+ti+');' +
                'var qeCI=qeTrk.getItemAt('+ci+');' +
                'var efNames=["ADBE Crop","Crop","Recortar"],efAdded=false;' +
                'for(var ei=0;ei<efNames.length&&!efAdded;ei++){' +
                    'try{qeCI.addVideoEffect(efNames[ei]);efAdded=true;log.push("qeAdd:"+efNames[ei]);}catch(ex){}' +
                '}' +
                'if(efAdded){$.sleep(500);' +
                    'for(var dci2=0;dci2<cl.components.numItems;dci2++){' +
                        'var dcn2=cl.components[dci2].displayName;' +
                        'if(dcn2==="Crop"||dcn2==="Recortar"){cropComp=cl.components[dci2];log.push("cropGot:"+dcn2);break;}' +
                    '}' +
                '}else log.push("qeAdd:allFailed");' +
            '}catch(eqe){log.push("qe:ERR="+eqe.message);}' +
        '}' +
        'if(cropComp){' +
            'for(var pi2=0;pi2<cropComp.properties.numItems;pi2++){' +
                'var p2=cropComp.properties[pi2],n2=p2.displayName;' +
                'try{if(n2==="Left"||n2==="Crop Left")p2.setValue(cL,true);' +
                    'else if(n2==="Top"||n2==="Crop Top")p2.setValue(cT,true);' +
                    'else if(n2==="Right"||n2==="Crop Right")p2.setValue(cR,true);' +
                    'else if(n2==="Bottom"||n2==="Crop Bottom"){p2.setValue(cB,true);log.push("crop:"+cL.toFixed(0)+","+cT.toFixed(0)+","+cR.toFixed(0)+","+cB.toFixed(0));}}catch(e){}' +
            '}' +
        '}else log.push("cropNOT_FOUND:"+compNames.join(","));' +
        'return "ok: "+log.join(" | ");' +
    '})()';
}

function runBoardCrop(mode) {
    mode = mode || 'chessbase';
    var label    = mode === 'chesscom' ? 'CHESS.COM' : 'CHESSBASE';
    var btnId    = mode === 'chesscom' ? 'btnBcChessCom' : 'btnBcSel';
    var btnEl    = document.getElementById(btnId);
    var bcStatus = document.getElementById('bcStatus');
    var logEl    = document.getElementById('log');

    var cp;
    try { cp = require('child_process'); } catch(e) { bcStatus.textContent = 'ERROR: Node.js unavailable'; bcStatus.className = 'status error'; return; }

    btnEl.disabled       = true;
    btnEl.textContent    = '⏳ Downloading…';
    bcStatus.textContent = 'Downloading crop_board_sel.py…';
    bcStatus.className   = 'status running';
    logEl.textContent    = '';

    function log(msg) { logEl.textContent += msg + '\n'; logEl.scrollTop = logEl.scrollHeight; }
    function done(msg, isErr) {
        btnEl.disabled = false; btnEl.textContent = '▶ BoardCrop ' + label;
        bcStatus.textContent = msg; bcStatus.className = isErr ? 'status error' : 'status done';
    }

    downloadPy('crop_board_sel.py', function (pyPath) {
        btnEl.textContent    = '⏳ Getting selection…';
        bcStatus.textContent = 'BoardCrop ' + label + ': reading PP selection…';

        safeEvalScript(_BC_GET_CLIPS_JSX, function (raw) {
            var data;
            try { data = JSON.parse(raw); } catch(e) { done('ERROR: unexpected response from PP', true); return; }
            if (data.error) { done('ERROR: ' + data.error, true); return; }
            var clips = data.clips;
            if (!clips || !clips.length) { done('ERROR: no clips selected in timeline', true); return; }

            log('Selected clips: ' + clips.length);
            var clipMap = {}, paths = [];
            for (var i = 0; i < clips.length; i++) {
                clipMap[clips[i].mp] = clips[i];
                paths.push(clips[i].mp);
                log('  [' + (clips[i].name || clips[i].mp) + ']');
            }

            btnEl.textContent    = '⏳ Detecting…';
            bcStatus.textContent = 'BoardCrop ' + label + ': detecting board…';

            var bcEnv = JSON.parse(JSON.stringify(process.env));
            bcEnv.PATH = '/opt/homebrew/bin:/usr/local/bin:/usr/bin:' + (bcEnv.PATH || '');
            var proc = cp.spawn('python3', [pyPath, '--mode=' + mode].concat(paths), { env: bcEnv });
            var buf = '';
            proc.stdout.on('data', function (chunk) {
                buf += chunk.toString();
                var lines = buf.split('\n'); buf = lines.pop();
                for (var li = 0; li < lines.length; li++) {
                    var line = lines[li].trim(); if (!line) continue;
                    var res = null; try { res = JSON.parse(line); } catch(e) {}
                    if (res && typeof res.ok !== 'undefined') {
                        if (res.ok && clipMap[res.path]) {
                            var c = clipMap[res.path];
                            log('  detect OK → ' + (c.name || res.path));
                            var jsx = _bcApplyJsx(c.ti, c.ci, res.path, res.left, res.top, res.right, res.bottom, res.clipW, res.clipH, mode);
                            (function (clipName) {
                                safeEvalScript(jsx, function (applyRes) { log('  apply [' + clipName + ']: ' + applyRes); });
                            })(c.name || res.path);
                        } else { log('  detect FAIL: ' + (res.error || 'unknown')); }
                    } else { log(line); }
                }
            });
            proc.stderr.on('data', function (chunk) { log('ERR: ' + chunk.toString()); });
            proc.on('close', function (code) {
                if (buf.trim()) log(buf);
                done(code === 0 ? 'BoardCrop completed.' : 'Finished with code ' + code, code !== 0);
            });
            proc.on('error', function (err) { done('ERROR python3: ' + err.message, true); });
        });
    }, function (err) {
        done('ERROR downloading crop_board_sel.py: ' + err, true);
    });
}

document.getElementById('btnBcSel').addEventListener('click',     function () { runBoardCrop('chessbase'); });
document.getElementById('btnBcChessCom').addEventListener('click', function () { runBoardCrop('chesscom');  });

/* ═══════════════════════════════════════════════════════════════════════════
   SyncClap
═══════════════════════════════════════════════════════════════════════════ */

var _AT_GET_CLIPS_JSX =
    '(function(){' +
        'var seq=app.project.activeSequence;' +
        'if(!seq)return JSON.stringify({error:"no active sequence",clips:[]});' +
        'var skip=["fade_in","fade_out","fade in","fade out","intro-outro","intro_outro","_no_audio","bg_chapters","background"];' +
        'function shouldSkip(n){var nl=n.toLowerCase();for(var si=0;si<skip.length;si++)if(nl.indexOf(skip[si])>=0)return true;return false;}' +
        'var videoExts=["mp4","mov","avi","mxf","mkv","m4v","wmv","r3d","braw"];' +
        'var clips=[];' +
        'for(var vi=0;vi<seq.videoTracks.numTracks;vi++){' +
            'var tr=seq.videoTracks[vi];' +
            'for(var ci=0;ci<tr.clips.numItems;ci++){' +
                'var cl=tr.clips[ci];var mp="";try{mp=cl.projectItem.getMediaPath();}catch(e){}' +
                'if(!mp)continue;' +
                'var ext=mp.split(".").pop().toLowerCase();var isVid=false;' +
                'for(var ei=0;ei<videoExts.length;ei++)if(videoExts[ei]===ext)isVid=true;' +
                'if(!isVid)continue;' +
                'var cname=cl.name||"";if(shouldSkip(cname)||shouldSkip(mp))continue;' +
                'clips.push({ti:vi,ci:ci,mp:mp,name:cname});' +
            '}' +
        '}' +
        'return JSON.stringify({error:"",clips:clips});' +
    '})()';

function _atApplyJsx(ti, ci, mp, inSec, outSec) {
    var mpE = mp.replace(/\\/g, '\\\\').replace(/"/g, '\\"');
    var dur = outSec - inSec;
    return '(function(){' +
        'var seq=app.project.activeSequence;if(!seq)return "error:no seq";' +
        'try{app.project.activeSequence=seq;}catch(e){}' +
        'var tr=seq.videoTracks[' + ti + '];if(!tr)return "error:no track";' +
        'var cl=tr.clips[' + ci + '];if(!cl)return "error:no clip";' +
        'var mp2="";try{mp2=cl.projectItem.getMediaPath();}catch(e){}' +
        'if(mp2!=="' + mpE + '")return "error:clip mismatch";' +
        'var seqSt=cl.start.seconds;' +
        'var before="inPt="+cl.inPoint.seconds.toFixed(3)+" seqEnd="+cl.end.seconds.toFixed(3);' +
        'try{var inT=new Time();inT.seconds=' + inSec + ';cl.inPoint=inT;}catch(e){}' +
        'try{var endT=new Time();endT.seconds=seqSt+' + dur + ';cl.end=endT;}catch(e){}' +
        'var after="inPt="+cl.inPoint.seconds.toFixed(3)+" seqEnd="+cl.end.seconds.toFixed(3);' +
        'return "before("+before+") after("+after+")";' +
    '})()';
}

function runSyncClap() {
    var btnAt    = document.getElementById('btnAt');
    var atStatus = document.getElementById('atStatus');
    var logEl    = document.getElementById('log');

    var cp;
    try { cp = require('child_process'); } catch(e) { atStatus.textContent = 'ERROR: Node.js unavailable'; atStatus.className = 'status error'; return; }

    btnAt.disabled       = true;
    btnAt.textContent    = '⏳ Downloading…';
    atStatus.textContent = 'Downloading claptrim.py…';
    atStatus.className   = 'status running';
    logEl.textContent    = '';

    function log(msg) { logEl.textContent += msg + '\n'; logEl.scrollTop = logEl.scrollHeight; }
    log('[SyncClap JS v6b | panel v110.20]');
    function done(msg, isErr) {
        btnAt.disabled = false; btnAt.textContent = '▶ SyncClap (clap + speech)';
        atStatus.textContent = msg; atStatus.className = isErr ? 'status error' : 'status done';
    }

    downloadPy('claptrim.py', function (pyPath) {
        btnAt.textContent    = '⏳ Reading sequence…';
        atStatus.textContent = 'SyncClap: getting clips…';

        safeEvalScript(_AT_GET_CLIPS_JSX, function (raw) {
            var data;
            try { data = JSON.parse(raw); } catch(e) { done('ERROR: unexpected response from PP', true); return; }
            if (data.error) { done('ERROR: ' + data.error, true); return; }
            var clips = data.clips;
            if (!clips || !clips.length) { done('ERROR: no video clips in active sequence', true); return; }

            log('Clips found: ' + clips.length);
            var clipMap = {}, paths = [];
            for (var i = 0; i < clips.length; i++) {
                clipMap[clips[i].mp] = clips[i]; paths.push(clips[i].mp);
                log('  [' + (clips[i].name || clips[i].mp) + ']');
            }

            btnAt.textContent    = '⏳ Analyzing audio…';
            atStatus.textContent = 'SyncClap: detecting clap and speech end…';

            var env = JSON.parse(JSON.stringify(process.env));
            env.PATH = '/opt/homebrew/bin:/usr/local/bin:/usr/bin:' + (env.PATH || '');
            var proc = cp.spawn('python3', [pyPath].concat(paths), { env: env });
            var buf = '';

            proc.stdout.on('data', function (chunk) {
                buf += chunk.toString();
                var lines = buf.split('\n'); buf = lines.pop();
                for (var li = 0; li < lines.length; li++) {
                    var line = lines[li].trim(); if (!line) continue;
                    var res = null; try { res = JSON.parse(line); } catch(e) {}
                    if (res && typeof res.ok !== 'undefined') {
                        if (res.ok && clipMap[res.path]) {
                            var c = clipMap[res.path];
                            log('  clap=' + res.clap + 's  speech_end=' + res.speech_end + 's');
                            log('  → in=' + res['in'] + 's  out=' + res.out + 's');
                            var jsx = _atApplyJsx(c.ti, c.ci, res.path, res['in'], res.out);
                            (function (clipName) {
                                safeEvalScript(jsx, function (applyRes) { log('  apply [' + clipName + ']: ' + applyRes); });
                            })(c.name || res.path);
                        } else { log('  FAIL [' + (res.path || '?') + ']: ' + (res.error || 'unknown')); }
                    } else { log(line); }
                }
            });
            proc.stderr.on('data', function (chunk) { log('ERR: ' + chunk.toString()); });
            proc.on('close', function (code) {
                if (buf.trim()) log(buf);
                done(code === 0 ? 'SyncClap completed.' : 'Finished with code ' + code, code !== 0);
            });
            proc.on('error', function (err) { done('ERROR python3: ' + err.message, true); });
        });
    }, function (err) {
        done('ERROR downloading claptrim.py: ' + err, true);
    });
}

document.getElementById('btnAt').addEventListener('click', runSyncClap);

/* ═══════════════════════════════════════════════════════════════════════════
   Manual Sync v22
═══════════════════════════════════════════════════════════════════════════ */
(function () {

var HOME         = require('os').homedir();
var MS_JSON_PATH = require('path').join(require('os').tmpdir(), 'manual_sync_data.json');
var SESSION_FILE = HOME + '/.chessable_session.json';
var COURSE_JSON  = function (id) { return HOME + '/.chessable_course_' + id + '.json'; };

function msStatus(msg, isErr) {
    var el = document.getElementById('msStatus');
    el.textContent = msg; el.className = 'status' + (isErr ? ' error' : '');
}

var _msChapters  = [];
var _msCurrentCh = 0;

function msNavShow(show) { document.getElementById('msChapterNav').style.display = show ? 'block' : 'none'; }

function msUpdateNav() {
    var total = _msChapters.length, cur = _msCurrentCh;
    document.getElementById('msChapterLabel').textContent =
        'Ch. ' + (cur+1) + '/' + total + ': ' + (_msChapters[cur] ? _msChapters[cur].chapter_name : '');
    document.getElementById('btnMsPrev').style.display = cur > 0         ? 'inline-block' : 'none';
    document.getElementById('btnMsNext').style.display = cur < total - 1 ? 'inline-block' : 'none';
    document.getElementById('msFillStatus').textContent = '';
    msOpenChapterPreview(cur);
}

function msOpenChapterPreview(idx) {
    var fs, os, path, cp;
    try { fs=require('fs'); os=require('os'); path=require('path'); cp=require('child_process'); } catch(e) { return; }
    var html = buildChapterHTML(_msChapters[idx], idx);
    var htmlPath = path.join(os.tmpdir(), 'ms_chapter_preview.html');
    try { fs.writeFileSync(htmlPath, html, 'utf8'); cp.exec('open "' + htmlPath + '"'); } catch(e) {}
}

function loadChessableJSON(courseId, cb) {
    var fs; try { fs = require('fs'); } catch(e) { cb('Node unavailable'); return; }
    var p = COURSE_JSON(courseId);
    if (!fs.existsSync(p)) { cb('Not found: ' + p + '\nRun: python3 /tmp/get_chessable_data.py'); return; }
    try { var data = JSON.parse(fs.readFileSync(p, 'utf8')); cb(null, data.chapters || []); }
    catch(e) { cb('Error reading JSON: ' + e.message); }
}

var READ_TIMECODES_JSX = [
  '(function(){',
  '  var TRACK = 2;',
  '  var ticks = 254016000000;',
  '  var chapters = [];',
  '  var n = app.project.sequences.numSequences;',
  '  var seqMap = {};',
  '  for (var s = 0; s < n; s++) {',
  '    var sq = app.project.sequences[s];',
  '    var nV2 = sq.videoTracks.numTracks > 1 ? sq.videoTracks[1].clips.numItems : 0;',
  '    var prev = seqMap[sq.name];',
  '    var prevN = prev && prev.videoTracks.numTracks > 1 ? prev.videoTracks[1].clips.numItems : 0;',
  '    if (!prev || nV2 > prevN) seqMap[sq.name] = sq;',
  '  }',
  '  for (var name in seqMap) {',
  '    var seq = seqMap[name];',
  '    var fps = ticks / seq.timebase;',
  '    var ntr = seq.videoTracks.numTracks;',
  '    var ti  = (TRACK < ntr) ? TRACK : ntr - 1;',
  '    var track = seq.videoTracks[ti];',
  '    var clips = [];',
  '    var trackCuts  = seq.videoTracks.numTracks > 1 ? seq.videoTracks[1] : track;',
  '    var trackBoard = track;',
  '    var nClips = trackCuts ? trackCuts.clips.numItems : 0;',
  '    for (var c = 0; c < nClips; c++) {',
  '      var cl = trackCuts.clips[c];',
  '      var ss = cl.start.ticks / ticks;',
  '      var ts = Math.floor(ss);',
  '      var hh = Math.floor(ts / 3600);',
  '      var mm = Math.floor((ts % 3600) / 60);',
  '      var sc = ts % 60;',
  '      var h2 = hh < 10 ? "0"+hh : ""+hh;',
  '      var m2 = mm < 10 ? "0"+mm : ""+mm;',
  '      var s2 = sc < 10 ? "0"+sc : ""+sc;',
  '      var srcPath = ""; var srcV3 = "";',
  '      try { srcPath = cl.projectItem.getMediaPath(); } catch(e) {}',
  '      try { if(trackBoard && trackBoard.clips.numItems > c) srcV3 = trackBoard.clips[c].projectItem.getMediaPath(); } catch(e) {}',
  '      if(!srcV3) srcV3 = srcPath;',
  '      var inPt = cl.inPoint ? cl.inPoint.seconds : 0;',
  '      clips.push({index:c+1, name:cl.name, timecode:h2+":"+m2+":"+s2, seconds:ss, src:srcPath, srcV3:srcV3, inPoint:inPt});',
  '    }',
  '    var seq_end = seq.end ? seq.end.ticks / ticks : 0;',
  '    chapters.push({chapter_name: seq.name, fps: fps, clips: clips, seq_end: seq_end});',
  '  }',
  '  chapters.sort(function(a,b){',
  '    var na = parseInt(a.chapter_name) || 0;',
  '    var nb = parseInt(b.chapter_name) || 0;',
  '    return na - nb;',
  '  });',
  '  return JSON.stringify({chapters: chapters, total: n});',
  '})()'
].join('\n');

function matchAndCompute(chessChapters, pmChapters) {
    var pmMap = {};
    pmChapters.forEach(function (pm) { pmMap[normName(pm.chapter_name)] = pm; });
    var out = [];
    chessChapters.forEach(function (ch) {
        var key = normName(ch.chapter_name);
        var pm  = pmMap[key] || null;
        if (!pm) {
            var chessNum = (ch.chapter_name.match(/^\d+/) || [''])[0];
            if (chessNum) Object.keys(pmMap).forEach(function (k) { if (!pm && k.indexOf(chessNum) === 0) pm = pmMap[k]; });
        }
        var fps = pm ? (pm.fps || 25) : 25, frame = 1 / fps, clips = pm ? pm.clips : [];
        var vars = [];
        (ch.variations || []).forEach(function (v, vi) {
            var clipIdx = vi > 0 ? vi - 1 : -1;
            var clip = clipIdx >= 0 ? (clips[clipIdx] || null) : null;
            var nextClip = clipIdx >= 0 ? (clips[clipIdx+1] || null) : null;
            vars.push({ id: v.id, name: v.name, fen: v.fen || '', url: v.url,
                chapter_index: ch.chapter_index,
                timecode_start: clip     ? clip.timecode : null,
                seconds_start:  clip     ? clip.seconds  : null,
                timecode_end:   nextClip ? nextClip.timecode : null,
                seconds_end:    nextClip ? Math.max(0, nextClip.seconds - frame) : null,
                clip_name:      clip     ? clip.name : '' });
        });
        out.push({ chapter_name: ch.chapter_name, chapter_index: ch.chapter_index,
            premiere_name: pm ? pm.chapter_name : null, variations: vars });
    });
    return out;
}

function normName(s) { return (s || '').toLowerCase().replace(/[^a-z0-9]/g, ''); }
function formatHMS(s) {
    s = Math.floor(s);
    return ('0'+Math.floor(s/3600)).slice(-2)+':'+('0'+Math.floor((s%3600)/60)).slice(-2)+':'+('0'+(s%60)).slice(-2);
}

function buildChapterHTML(ch, idx) {
    if (!ch) return '<html><body style="background:#111;color:#f88;padding:20px">Error: chapter not found</body></html>';
    var total = _msChapters.length;
    var synced = (ch.variations||[]).filter(function (v) { return v.seconds_start !== null; }).length;
    var rows = '';
    for (var vi = 0; vi < ch.variations.length; vi++) {
        var v = ch.variations[vi];
        var hasTc = v.seconds_start !== null && vi > 0;
        var boardHtml = '<span style="color:#555;font-size:.7rem">no FEN</span>';
        if (v.fen) {
            var fe = encodeURIComponent(v.fen);
            boardHtml = '<img src="https://fen2image.chessvision.ai/'+fe+'?size=140" ' +
                        'onerror="this.src=\'https://www.chess.com/dynboard?fen='+fe+'&size=2\'" alt="">';
        }
        rows += '<div class="row '+(hasTc?'ok':'skip')+'">' +
            '<div class="idx">'+(vi+1)+'</div>' +
            '<div class="tc">'+(hasTc ? '<b>'+v.timecode_start+'</b><br><small style="color:#aaa">→ '+(v.timecode_end||'?')+'</small>' : '<span style="color:#555">—</span>')+'</div>' +
            '<div class="inf"><div class="vn">'+(v.name||'(no name)')+'</div>' +
                '<div class="vid">ID: '+v.id+'</div>' +
                (v.moves?'<div class="mv">'+v.moves.slice(0,90)+(v.moves.length>90?'…':'')+'</div>':'')+
                '<a href="'+v.url+'" target="_blank" class="vlink">Open ↗</a></div>' +
            '<div class="board">'+boardHtml+'</div></div>';
    }
    return '<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><title>'+ch.chapter_name+'</title><style>' +
        '*{box-sizing:border-box;margin:0;padding:0}body{font:13px system-ui;background:#111;color:#ddd;padding:14px}' +
        'h1{color:#e94560;font-size:.95rem;margin-bottom:3px}.meta{font-size:.75rem;color:#555;margin-bottom:12px}' +
        '.row{display:grid;grid-template-columns:32px 155px 1fr 148px;gap:8px;align-items:center;' +
            'background:#1a1a2e;border-radius:4px;padding:8px 10px;margin-bottom:4px;border-left:3px solid #333}' +
        '.row.ok{border-left-color:#2ecc71}.row.skip{opacity:.35}' +
        '.idx{font-weight:700;color:#e94560;text-align:center}' +
        '.tc{font-family:monospace;font-size:.82rem;color:#2ecc71;word-break:break-all}' +
        '.vn{font-size:.8rem;color:#ccc}.vid,.mv{font-size:.66rem;color:#555;margin-top:2px}' +
        '.vlink{font-size:.66rem;color:#4fc3f7;text-decoration:none}.board img{max-width:140px;border-radius:3px}' +
        '</style></head><body><h1>&#9822; '+ch.chapter_name+'</h1>' +
        '<div class="meta">Chapter '+(idx+1)+' of '+total+' &nbsp;·&nbsp; '+synced+'/'+ch.variations.length+' with timestamp</div>' +
        rows + '</body></html>';
}

var READ_ACTIVE_SEQ_JSX = '(function(){' +
    'var TRACK=2;var seq=app.project.activeSequence;' +
    'if(!seq)return JSON.stringify({error:"No active sequence"});' +
    'var ticks=254016000000;var fps=ticks/seq.timebase;' +
    'var track=seq.videoTracks.numTracks>TRACK?seq.videoTracks[TRACK]:seq.videoTracks[0];' +
    'if(!track||track.clips.numItems===0)return JSON.stringify({error:"No clips in V3"});' +
    'var clips=[];' +
    'for(var i=0;i<track.clips.numItems;i++){' +
        'var cl=track.clips[i];var ss=cl.start.ticks/ticks;' +
        'var ts=Math.floor(ss);var hh=Math.floor(ts/3600);var mm=Math.floor((ts%3600)/60);var sc=ts%60;' +
        'function p2(n){return n<10?"0"+n:""+n;}' +
        'clips.push({index:i+1,name:cl.name,timecode:p2(hh)+":"+p2(mm)+":"+p2(sc),seconds:ss});' +
    '}' +
    'return JSON.stringify({sequence:seq.name,fps:fps,clips:clips});' +
'})()';

document.getElementById('btnMs').addEventListener('click', function () {
    var courseId = (document.getElementById('msCourseId').value || '424926').trim();
    msNavShow(false);
    msStatus('Reading bin 1_Chapters (V3)…');

    safeEvalScript(READ_TIMECODES_JSX, function (raw) {
        document.getElementById('log').textContent = '[JSX raw]\n' + (raw || '(empty)').slice(0, 500);
        var pmData;
        try { pmData = JSON.parse(raw); } catch(e) { msStatus('Parse error: '+raw.slice(0,120), true); return; }
        if (pmData.error) { msStatus('JSX error: '+pmData.error, true); return; }
        var pmChapters = pmData.chapters || [];
        msStatus('Premiere: ' + pmChapters.length + ' chapters. Matching Chessable…');

        loadChessableJSON(courseId, function (err, chessChapters) {
            if (err) { msStatus(err, true); return; }
            var fs; try { fs = require('fs'); } catch(e) { msStatus('Node unavailable', true); return; }
            var chapters = matchAndCompute(chessChapters, pmChapters);
            fs.writeFileSync('/tmp/ms_timestamps.json',
                JSON.stringify({ course_id: courseId, chapters: chapters, premiere_chapters: pmChapters }, null, 2), 'utf8');
            _msChapters  = chapters.filter(function (c) { return c.premiere_name !== null; });
            _msCurrentCh = 0;
            var logEl = document.getElementById('log');
            logEl.textContent = '[Manual Sync]\n';
            logEl.textContent += 'Premiere chapters: ' + pmChapters.map(function (p) { return p.chapter_name; }).join(', ') + '\n\n';
            chapters.forEach(function (c) {
                logEl.textContent += (c.premiere_name ? '✓' : '✗') + ' [' + c.chapter_index + '] ' + c.chapter_name +
                    (c.premiere_name ? ' ← ' + c.premiere_name : ' (no match)') +
                    ' — ' + c.variations.filter(function (v) { return v.seconds_start !== null; }).length + '/' + c.variations.length + ' clips\n';
            });
            if (_msChapters.length === 0) { msStatus('⚠ No Premiere chapters match Chessable. See log.', true); return; }
            msNavShow(true);
            msUpdateNav();
            msStatus('✓ ' + _msChapters.length + ' chapters ready.');
        });
    });
});

document.getElementById('btnMsVerify').addEventListener('click', function () {
    var cp; try { cp = require('child_process'); } catch(e) { return; }
    var ch = _msChapters[_msCurrentCh]; if (!ch) return;
    var fillStatus = document.getElementById('msFillStatus');
    fillStatus.textContent = 'Extracting frames and comparing boards…'; fillStatus.className = 'status';
    var SCRIPT = '/Users/raulmartinez/Desktop/chess.com/AI/ChessTools/ManualSync/board_sync.py';
    var cmd = HOME + '/msenv/bin/python3 "' + SCRIPT + '" --course 424926 --chapter-index ' + ch.chapter_index + ' 2>&1';
    cp.exec(cmd, {timeout: 300000}, function (err, stdout) {
        document.getElementById('log').textContent = '[Verify ch'+ch.chapter_index+']\n'+(stdout||'');
        fillStatus.textContent = err ? '✗ Error — see log' : '✓ Verification opened in browser';
        fillStatus.className   = 'status' + (err ? ' error' : '');
    });
});

document.getElementById('btnMsFill').addEventListener('click', function () {
    var cp; try { cp = require('child_process'); } catch(e) { return; }
    var ch = _msChapters[_msCurrentCh]; if (!ch) return;
    var fillStatus = document.getElementById('msFillStatus');
    fillStatus.textContent = 'Filling "' + ch.chapter_name + '"…'; fillStatus.className = 'status';
    var courseId = (document.getElementById('msCourseId').value || '424926').trim();
    var cmd = HOME + '/msenv/bin/python3 /Users/raulmartinez/Desktop/chess.com/AI/ChessTools/ManualSync/board_sync.py' +
              ' --course ' + courseId + ' --chapter-index ' + ch.chapter_index + ' --fill 2>&1';
    cp.exec(cmd, function (err, stdout) {
        var out = stdout || '';
        var logEl = document.getElementById('log');
        logEl.textContent = '[ManualSync Fill ch.'+ (_msCurrentCh+1) +']\n' + out;
        logEl.scrollTop = logEl.scrollHeight;
        var m2 = out.match(/Total: ([^\n]+)/);
        fillStatus.textContent = m2 ? '✓ ' + m2[1] : (err ? '✗ Error — see log' : '✓ Done');
        fillStatus.className   = 'status' + (err && !m2 ? ' error' : '');
    });
});

document.getElementById('btnMsNext').addEventListener('click', function () {
    if (_msCurrentCh < _msChapters.length - 1) { _msCurrentCh++; msUpdateNav(); }
});
document.getElementById('btnMsPrev').addEventListener('click', function () {
    if (_msCurrentCh > 0) { _msCurrentCh--; msUpdateNav(); }
});

})(); // end Manual Sync IIFE

/* ── 5secTest ────────────────────────────────────────────────────────────── */
document.getElementById('btnAt5sec').addEventListener('click', function () {
    var logEl = document.getElementById('log');
    logEl.textContent = '[5secTest]\n';
    safeEvalScript(
        '(function(){' +
            'var seq=app.project.activeSequence;if(!seq)return "error:no seq";' +
            'var out=[];' +
            'for(var vi=0;vi<seq.videoTracks.numTracks;vi++){' +
                'var tr=seq.videoTracks[vi];' +
                'for(var ci=0;ci<tr.clips.numItems;ci++){' +
                    'var cl=tr.clips[ci];var mp="";try{mp=cl.projectItem.getMediaPath();}catch(e){}' +
                    'if(!mp)continue;' +
                    'var bIn=cl.inPoint.seconds.toFixed(2);var origDur=cl.end.seconds-cl.start.seconds;' +
                    'var t=new Time();t.seconds=5;cl.inPoint=t;' +
                    'var ne=new Time();ne.seconds=cl.start.seconds+Math.max(0,origDur-5);cl.end=ne;' +
                    'out.push("V"+(vi+1)+" "+cl.name+": inPt "+bIn+"->"+cl.inPoint.seconds.toFixed(2)+" seqEnd "+cl.end.seconds.toFixed(2));' +
                '}' +
            '}' +
            'return out.length?out.join("|"):"no direct clip found";' +
        '})()',
        function (res) { logEl.textContent += res + '\n'; logEl.scrollTop = logEl.scrollHeight; }
    );
});

/* ── Preview Sequences ───────────────────────────────────────────────────── */
document.getElementById('btnCreatePreviews').addEventListener('click', function () {
    var logEl = document.getElementById('log'), psStatus = document.getElementById('psStatus');
    var btn   = document.getElementById('btnCreatePreviews');
    btn.disabled = true; psStatus.textContent = 'Creating preview sequences…'; psStatus.className = 'status';

    safeEvalScript(
        '(function(){' +
            'var SUFFIX="_preview";var created=[],skipped=[],errors=[];' +
            'function findParentBin(bin,nodeId){if(!bin.children)return null;' +
                'for(var i=0;i<bin.children.numItems;i++){var c=bin.children[i];' +
                    'try{if(c.nodeId===nodeId)return bin;}catch(e){}' +
                    'if(c.type===2){var r=findParentBin(c,nodeId);if(r)return r;}}return null;}' +
            'var snap=[];' +
            'for(var si=0;si<app.project.sequences.numSequences;si++){' +
                'var s=app.project.sequences[si];var nid=null;try{nid=s.projectItem.nodeId;}catch(e){}' +
                'snap.push({seq:s,nm:s.name,nodeId:nid});}' +
            'var existingNames={};for(var ei=0;ei<snap.length;ei++) existingNames[snap[ei].nm]=1;' +
            'for(var si=0;si<snap.length;si++){' +
                'var seq=snap[si].seq,nm=snap[si].nm,nodeId=snap[si].nodeId;' +
                'var nmLow=nm.toLowerCase();var previewNm=nm+SUFFIX;' +
                'if(nm.length>=SUFFIX.length&&nm.substr(nm.length-SUFFIX.length)===SUFFIX)continue;' +
                'if(existingNames[previewNm]){skipped.push(nm+" (already exists)");continue;}' +
                'if(nmLow.indexOf("webcam_")===0||nmLow.indexOf("nested")>=0||nm==="void"||nm==="test2"||nm==="test"){skipped.push(nm);continue;}' +
                'var parentBin=nodeId?findParentBin(app.project.rootItem,nodeId):null;' +
                'if(parentBin&&parentBin.name.toLowerCase().indexOf("peek inside")>=0){skipped.push(nm);continue;}' +
                'try{' +
                    'var before={};for(var bi=0;bi<app.project.sequences.numSequences;bi++)before[app.project.sequences[bi].name]=1;' +
                    'var cloned=null;try{cloned=seq.clone();}catch(ce){errors.push(nm+": clone: "+ce.message);continue;}' +
                    '$.sleep(500);' +
                    'var newSeq=null;if(cloned&&typeof cloned.name!=="undefined")newSeq=cloned;' +
                    'if(!newSeq){for(var fi=0;fi<app.project.sequences.numSequences;fi++){var fs=app.project.sequences[fi];if(!before[fs.name]){newSeq=fs;break;}}}' +
                    'if(!newSeq){errors.push(nm+": not found after clone");continue;}' +
                    'try{newSeq.name=previewNm;}catch(e){}' +
                    'try{if(newSeq.projectItem)newSeq.projectItem.name=previewNm;}catch(e){}' +
                    'if(parentBin){try{newSeq.projectItem.moveBin(parentBin);}catch(e){errors.push(previewNm+": moveBin: "+e.message);}}' +
                    'else{errors.push(previewNm+": parentBin not found (nodeId="+nodeId+")");}' +
                    'created.push(previewNm);' +
                '}catch(e){errors.push(nm+": "+e.message);}' +
            '}' +
            'var msg="ok: created="+created.length;' +
            'if(skipped.length)msg+=" | skipped="+skipped.length;' +
            'if(errors.length)msg+=" | ERRORS: "+errors.join("; ");' +
            'return msg;' +
        '})()',
        function (res) {
            btn.disabled = false;
            var ok = res && res.indexOf('ok:') === 0;
            psStatus.textContent = ok ? res : ('ERROR: ' + res);
            psStatus.className   = 'status ' + (ok ? 'success' : 'error');
            logEl.textContent    = '[PreviewSeqs]\n' + res + '\n';
            logEl.scrollTop      = logEl.scrollHeight;
        }
    );
});

/* ── Cut Preview ─────────────────────────────────────────────────────────── */
document.getElementById('btnCutPreview').addEventListener('click', function () {
    var logEl = document.getElementById('log'), psStatus = document.getElementById('psStatus');
    var btn   = document.getElementById('btnCutPreview');
    btn.disabled = true; psStatus.textContent = 'Cutting…'; psStatus.className = 'status';

    safeEvalScript(
        '(function(){' +
            'var seq=app.project.activeSequence;if(!seq)return "error: no active sequence";' +
            'var pos=seq.getPlayerPosition();if(!pos)return "error: cannot get player position";' +
            'var cutSec=pos.seconds;' +
            'if(cutSec<0.5)return "error: playhead too close to the start ("+cutSec.toFixed(2)+"s)";' +
            'var log=["cut@"+cutSec.toFixed(2)+"s"];' +
            'function findFadeOut(item){if(!item)return null;' +
                'if(item.name&&item.name.toLowerCase().indexOf("fade_out")>=0&&item.type!==2)return item;' +
                'try{if(item.children)for(var i=0;i<item.children.numItems;i++){var r=findFadeOut(item.children[i]);if(r)return r;}}catch(e){}' +
                'return null;}' +
            'var fadeOutItem=findFadeOut(app.project.rootItem);' +
            'for(var vi=0;vi<seq.videoTracks.numTracks;vi++){' +
                'var vtr=seq.videoTracks[vi],vDel=[];' +
                'for(var vci=0;vci<vtr.clips.numItems;vci++){var vcl=vtr.clips[vci];' +
                    'if(vcl.start.seconds>=cutSec)vDel.push(vci);' +
                    'else if(vcl.end.seconds>cutSec){try{var vt=new Time();vt.seconds=cutSec;vcl.end=vt;}catch(e){log.push("trimV"+(vi+1)+":"+e.message);}}}' +
                'for(var vri=vDel.length-1;vri>=0;vri--)try{vtr.clips[vDel[vri]].remove(false,false);}catch(e){log.push("delV"+(vi+1)+":"+e.message);}' +
            '}' +
            'for(var ai=0;ai<seq.audioTracks.numTracks;ai++){' +
                'var atr=seq.audioTracks[ai],aDel=[];' +
                'for(var aci=0;aci<atr.clips.numItems;aci++){var acl=atr.clips[aci];' +
                    'if(acl.start.seconds>=cutSec)aDel.push(aci);' +
                    'else if(acl.end.seconds>cutSec){try{var at=new Time();at.seconds=cutSec;acl.end=at;}catch(e){}}}' +
                'for(var ari=aDel.length-1;ari>=0;ari--)try{atr.clips[aDel[ari]].remove(false,false);}catch(e){}' +
            '}' +
            'if(fadeOutItem){' +
                'var topTrack=seq.videoTracks.numTracks>=4?seq.videoTracks[3]:null;' +
                'if(!topTrack){try{if(typeof app.enableQE==="function")app.enableQE();var qs=qe.project.getActiveSequence();if(qs&&typeof qs.addTracks==="function"){qs.addTracks(1,0);$.sleep(400);}}catch(e){}' +
                    'topTrack=seq.videoTracks.numTracks>=4?seq.videoTracks[3]:seq.videoTracks[seq.videoTracks.numTracks-1];log.push("V="+seq.videoTracks.numTracks);}' +
                'var fadeStart=Math.max(0,cutSec-0.7);var ft=new Time();ft.seconds=fadeStart;' +
                'try{topTrack.overwriteClip(fadeOutItem,ft);$.sleep(200);' +
                    'for(var fci=topTrack.clips.numItems-1;fci>=0;fci--){var fcl=topTrack.clips[fci];' +
                        'if(Math.abs(fcl.start.seconds-fadeStart)<0.15){try{var fet=new Time();fet.seconds=cutSec;fcl.end=fet;}catch(e){}' +
                            'log.push("fade@"+fadeStart.toFixed(2)+"→"+cutSec.toFixed(2)+"s ✓");break;}}' +
                '}catch(e){log.push("fadeERR:"+e.message);}' +
            '}else log.push("WARN: fade_out not found");' +
            'return "ok: "+log.join(" | ");' +
        '})()',
        function (res) {
            btn.disabled = false;
            var ok = res && res.indexOf('ok:') === 0;
            psStatus.textContent = ok ? res : ('ERROR: ' + res);
            psStatus.className   = 'status ' + (ok ? 'success' : 'error');
            logEl.textContent    = '[CutPreview]\n' + res + '\n';
            logEl.scrollTop      = logEl.scrollHeight;
        }
    );
});



/* ── Legacy Updater ─────────────────────────────────────────────────────── */
(function () {
    var luState = {
        autor:    { before: null, after: null, delta: null, trackIdx: -1, name: '' },
        tablero:  { before: null, after: null, delta: null, trackIdx: -1, name: '' },
        fondo:    { path: '' },
        toDelete: [],
        exportDir: ''
    };

    /* Restore persisted paths */
    try { var _lsBg = localStorage.getItem('lu_bg_path');    if (_lsBg) { luState.fondo.path = _lsBg;   document.getElementById('luBgInfo').textContent     = _lsBg.split('/').pop();  } } catch(e) {}
    try { var _lsEx = localStorage.getItem('lu_export_dir'); if (_lsEx) { luState.exportDir  = _lsEx;   document.getElementById('luExportInfo').textContent = _lsEx.split('/').pop(); } } catch(e) {}

    function luR(v) { return Math.round(v * 100) / 100; }

    function luLog(msg) {
        var el = document.getElementById('log');
        if (el) { el.textContent = '[LU] ' + msg + (el.textContent !== '(no log)' ? '\n' + el.textContent : ''); }
    }

    function luInfoText(state) {
        if (!state.before) return '-';
        var t = 'V' + (state.trackIdx + 1) + ' | ' + state.name + '\n';
        var bc = state.before.crop || { l:0, t:0, r:0, b:0 };
        t += 'Before:  ' + luR(state.before.pos.x) + ', ' + luR(state.before.pos.y) + '  ' + luR(state.before.scl) + '%';
        if (bc.l||bc.t||bc.r||bc.b) t += '  crop:' + luR(bc.l) + '/' + luR(bc.t) + '/' + luR(bc.r) + '/' + luR(bc.b);
        if (state.after) {
            var ac = state.after.crop || { l:0, t:0, r:0, b:0 };
            t += '\nAfter:   ' + luR(state.after.pos.x) + ', ' + luR(state.after.pos.y) + '  ' + luR(state.after.scl) + '%';
            if (ac.l||ac.t||ac.r||ac.b) t += '  crop:' + luR(ac.l) + '/' + luR(ac.t) + '/' + luR(ac.r) + '/' + luR(ac.b);
            if (state.delta) {
                var dx = luR(state.delta.dx), dy = luR(state.delta.dy), ds = luR(state.delta.ds);
                t += '\nDelta: (' + (dx >= 0 ? '+' : '') + dx + ', ' + (dy >= 0 ? '+' : '') + dy + ')  scl ' + (ds >= 0 ? '+' : '') + ds + '%';
                var dd = state.delta;
                if (dd.dcl||dd.dct||dd.dcr||dd.dcb) {
                    t += '  crop:' + (dd.dcl>=0?'+':'')+luR(dd.dcl)+'/'+
                        (dd.dct>=0?'+':'')+luR(dd.dct)+'/'+
                        (dd.dcr>=0?'+':'')+luR(dd.dcr)+'/'+
                        (dd.dcb>=0?'+':'')+luR(dd.dcb);
                }
            }
        }
        return t;
    }

    /* Capture: returns pipe-separated values — no JSON (not available in ExtendScript ES3) */
    var LU_CAP_JSX = '(function(){try{' +
        'var seq=app.project.activeSequence;' +
        'if(!seq)return "ERR: no active sequence";' +
        'var sel=null,ti=-1;' +
        'for(var vi=0;vi<seq.videoTracks.numTracks;vi++){' +
            'var vt=seq.videoTracks[vi];' +
            'for(var ci=0;ci<vt.clips.numItems;ci++){' +
                'var c2=vt.clips[ci];var ok=false;' +
                'try{ok=c2.isSelected();}catch(e1){}' +
                'if(!ok)try{ok=(c2.selected===true);}catch(e2){}' +
                'if(ok){sel=c2;ti=vi;break;}' +
            '}' +
            'if(sel)break;' +
        '}' +
        'if(!sel)return "ERR: no clip selected";' +
        'var nm=sel.projectItem?sel.projectItem.name:"?";' +
        'var px=960,py=540,sc=100,cl=0,ct=0,cr=0,cb=0;' +
        'var dbg="";' +
        'try{' +
            'var comps=sel.components;dbg="n="+comps.numItems;' +
            'for(var _ci=0;_ci<comps.numItems;_ci++){' +
                'var comp=comps[_ci],cdn=comp.displayName;dbg+="|"+cdn;' +
                'if(cdn.indexOf("Motion")>=0||cdn.indexOf("Movimiento")>=0){' +
                    'for(var _pi=0;_pi<comp.properties.numItems;_pi++){' +
                        'var _p=comp.properties[_pi],_pn=_p.displayName;' +
                        'var _rv=null;try{_rv=_p.getValue();}catch(_ge){try{_rv=_p.value;}catch(_ve){}}' +
                        'if(_pn.indexOf("Pos")===0){dbg+=" pos=["+_rv+"]";' +
                            'if(_rv&&_rv.length>=2){px=parseFloat(_rv[0]);py=parseFloat(_rv[1]);}' +
                            'else if(_rv&&_rv.x!==undefined){px=parseFloat(_rv.x);py=parseFloat(_rv.y);}}' +
                        'if((_pn==="Scale"||_pn==="Escala")&&_rv!==null){dbg+=" sc=["+_rv+"]";sc=parseFloat(_rv)||100;}' +
                        'if(_pn==="Crop Left"||_pn==="Crop Top"||_pn==="Crop Right"||_pn==="Crop Bottom"){' +
                            'var _mcv=parseFloat(_rv)||0;' +
                            'if(_pn==="Crop Left"&&_mcv>cl)cl=_mcv;' +
                            'else if(_pn==="Crop Top"&&_mcv>ct)ct=_mcv;' +
                            'else if(_pn==="Crop Right"&&_mcv>cr)cr=_mcv;' +
                            'else if(_pn==="Crop Bottom"&&_mcv>cb)cb=_mcv;}' +
                    '}' +
                '}' +
                'if(cdn==="Crop"||cdn==="Recortar"){' +
                    'for(var _pi2=0;_pi2<comp.properties.numItems;_pi2++){' +
                        'var _p2=comp.properties[_pi2],_pn2=_p2.displayName;' +
                        'var _rv2=null;try{_rv2=_p2.getValue();}catch(_ge2){try{_rv2=_p2.value;}catch(_ve2){}}' +
                        'var _cfv=parseFloat(_rv2)||0;' +
                        'if(_pn2.indexOf("Left")>=0&&_cfv>cl)cl=_cfv;' +
                        'else if(_pn2.indexOf("Top")>=0&&_cfv>ct)ct=_cfv;' +
                        'else if(_pn2.indexOf("Right")>=0&&_cfv>cr)cr=_cfv;' +
                        'else if(_pn2.indexOf("Bot")>=0&&_cfv>cb)cb=_cfv;' +
                    '}' +
                '}' +
            '}' +
        '}catch(em){dbg="compERR:"+em.message;}' +
        'return nm+"|||"+ti+"|||"+px+"|||"+py+"|||"+sc+"|||"+cl+"|||"+ct+"|||"+cr+"|||"+cb+"|||"+dbg;' +
    '}catch(e){return "ERR: "+e.message;}})()';

    function luCapture(which, step) {
        var infoId = which === 'autor' ? 'luAutorInfo' : 'luTbInfo';
        safeEvalScript(LU_CAP_JSX, function (res) {
            luLog('capture(' + which + ' step' + step + '): ' + res);
            if (!res || res.indexOf('ERR:') === 0) {
                document.getElementById(infoId).textContent = res || 'No response';
                return;
            }
            var parts = res.split('|||');
            if (parts[0] === 'DBG') {
                var dbgText = parts[1] + '\n' + parts[2];
                luLog('DBG: ' + dbgText);
                document.getElementById(infoId).textContent = dbgText;
                return;
            }
            if (parts.length < 5) {
                document.getElementById(infoId).textContent = 'ERR: bad response: ' + res;
                return;
            }
            if (parts[9]) { luLog('DBG: ' + parts[9]); }
            var d = {
                n:  parts[0], t: parseInt(parts[1], 10),
                x:  parseFloat(parts[2]), y: parseFloat(parts[3]), s: parseFloat(parts[4]),
                cl: parseFloat(parts[5] || 0), ct: parseFloat(parts[6] || 0),
                cr: parseFloat(parts[7] || 0), cb: parseFloat(parts[8] || 0)
            };
            var st = luState[which];
            if (step === 1) {
                st.before   = { pos: { x: d.x, y: d.y }, scl: d.s, crop: { l: d.cl, t: d.ct, r: d.cr, b: d.cb } };
                st.after    = null;
                st.delta    = null;
                st.trackIdx = d.t;
                st.name     = d.n;
            } else {
                st.after = { pos: { x: d.x, y: d.y }, scl: d.s, crop: { l: d.cl, t: d.ct, r: d.cr, b: d.cb } };
                if (st.before) {
                    st.delta = {
                        dx:  d.x  - st.before.pos.x,
                        dy:  d.y  - st.before.pos.y,
                        ds:  d.s  - st.before.scl,
                        dcl: d.cl - st.before.crop.l,
                        dct: d.ct - st.before.crop.t,
                        dcr: d.cr - st.before.crop.r,
                        dcb: d.cb - st.before.crop.b
                    };
                }
            }
            document.getElementById(infoId).textContent = luInfoText(st);
        });
    }

    document.getElementById('luAutorCap1').addEventListener('click', function () { luCapture('autor',   1); });
    document.getElementById('luAutorCap2').addEventListener('click', function () { luCapture('autor',   2); });
    document.getElementById('luTbCap1'   ).addEventListener('click', function () { luCapture('tablero', 1); });
    document.getElementById('luTbCap2'   ).addEventListener('click', function () { luCapture('tablero', 2); });

    document.getElementById('luBgSel').addEventListener('click', function () {
        safeEvalScript(
            '(function(){try{var f=File.openDialog("Select background","Video files:*.mp4;*.mov;*.png;*.jpg",false);return f?f.fsName:"cancelled";}catch(e){return "ERR: "+e.message;}})();',
            function (res) {
                luLog('bg: ' + res);
                if (!res || res === 'cancelled' || res.indexOf('ERR') === 0) return;
                luState.fondo.path = res;
                try { localStorage.setItem('lu_bg_path', res); } catch(e) {}
                document.getElementById('luBgInfo').textContent = res.split('/').pop() || res;
            }
        );
    });

    document.getElementById('luDelMark').addEventListener('click', function () {
        safeEvalScript(
            '(function(){try{' +
            'var seq=app.project.activeSequence;if(!seq)return "ERR: no sequence";var names=[];' +
            'for(var vi=0;vi<seq.videoTracks.numTracks;vi++){' +
                'var vt=seq.videoTracks[vi];' +
                'for(var ci=0;ci<vt.clips.numItems;ci++){' +
                    'var c2=vt.clips[ci];var ok=false;' +
                    'try{ok=c2.isSelected();}catch(e1){}' +
                    'if(!ok)try{ok=(c2.selected===true);}catch(e2){}' +
                    'if(ok&&c2.projectItem)names.push(c2.projectItem.name);' +
                '}' +
            '}' +
            'return names.join("|||");' +
            '}catch(e){return "ERR: "+e.message;}})()',
            function (res) {
                luLog('mark: ' + res);
                if (res && res.indexOf('ERR:') === 0) {
                    document.getElementById('luDelInfo').textContent = res;
                    return;
                }
                var arr = (res && res.length) ? res.split('|||').filter(function(x) { return x.length > 0; }) : [];
                for (var i = 0; i < arr.length; i++) {
                    if (luState.toDelete.indexOf(arr[i]) < 0) luState.toDelete.push(arr[i]);
                }
                document.getElementById('luDelInfo').textContent =
                    luState.toDelete.length ? luState.toDelete.length + ' clip(s): ' + luState.toDelete.join(', ') : 'none marked';
            }
        );
    });

    document.getElementById('luDelClear').addEventListener('click', function () {
        luState.toDelete = [];
        document.getElementById('luDelInfo').textContent = '-';
    });

    document.getElementById('luExportDir').addEventListener('click', function () {
        safeEvalScript(
            '(function(){try{var f=Folder.selectDialog("Output folder");return f?f.fsName:"cancelled";}catch(e){return "ERR: "+e.message;}})();',
            function (res) {
                luLog('exportDir: ' + res);
                if (!res || res === 'cancelled' || res.indexOf('ERR') === 0) return;
                luState.exportDir = res;
                try { localStorage.setItem('lu_export_dir', res); } catch(e) {}
                document.getElementById('luExportInfo').textContent = res.split('/').pop() || res;
            }
        );
    });

    function luEscJSX(str) {
        return str.replace(/[^\x00-\x7F]/g, function(ch) {
            return '\\u' + ('0000' + ch.charCodeAt(0).toString(16)).slice(-4);
        });
    }

    function luBuildApplyJSX(singleSeq) {
        var a   = luState.autor;
        var tb  = luState.tablero;
        var delJson = luEscJSX(JSON.stringify(luState.toDelete));
        var bgPath  = luEscJSX((luState.fondo.path || '').replace(/\\/g, '/').replace(/"/g, '\\"'));

        var jsx = '(function(){try{var results=[];var seqs=[];';

        if (singleSeq) {
            jsx += 'var _as=app.project.activeSequence;if(_as)seqs.push(_as);';
        } else {
            jsx += 'try{var _allS=app.project.sequences;' +
                'if(_allS&&_allS.numSequences>0){results.push("api:n="+_allS.numSequences);' +
                    'for(var _qi=0;_qi<_allS.numSequences;_qi++){var _qs=_allS[_qi];if(!_qs)continue;' +
                        'var _qnm=_qs.name.toLowerCase();' +
                        'if(_qnm.indexOf("webcam")<0&&_qnm.indexOf("nested")<0&&_qnm.indexOf(" copy")<0&&_qnm.indexOf("test")<0&&_qnm.indexOf("preview")<0&&_qnm.indexOf("s&s")<0&&_qnm.indexOf("short and sweet")<0&&_qnm.indexOf("short&sweet")<0)' +
                            'seqs.push(_qs);}' +
                'results.push("seqs:n="+seqs.length);' +
                '}}catch(_qe){results.push("seqsAPIerr:"+_qe.message);}' +
                'if(!seqs.length){' +
                    'function collectSeqs(item,arr){' +
                        'try{var s=item.getSequence();if(s){var nm=item.name.toLowerCase();' +
                            'if(nm.indexOf("webcam")<0&&nm.indexOf("nested")<0&&nm.indexOf(" copy")<0&&nm.indexOf("test")<0)arr.push(s);}}catch(e){}' +
                        'try{var ch=item.children;for(var k=0;k<ch.numItems;k++)collectSeqs(ch[k],arr);}catch(e){}' +
                    '}collectSeqs(app.project.rootItem,seqs);' +
                    'results.push("rootFallback:n="+seqs.length);' +
                '}';
        }

        jsx += 'if(!seqs.length)return "ERR: no sequences found";';

        if (bgPath) {
            jsx += 'var bgItem=null;var _bgp="' + bgPath + '";' +
                'function findBg(){' +
                    'try{var _sAll=app.project.sequences;' +
                    'for(var _sbi=0;_sbi<_sAll.numSequences;_sbi++){var _sbS=_sAll[_sbi];if(!_sbS)continue;' +
                        'for(var _sbvi=0;_sbvi<_sbS.videoTracks.numTracks;_sbvi++){var _sbvt=_sbS.videoTracks[_sbvi];' +
                            'for(var _sbci=0;_sbci<_sbvt.clips.numItems;_sbci++){var _sbcl=_sbvt.clips[_sbci];' +
                                'if(!_sbcl.projectItem)continue;' +
                                'try{if(_sbcl.projectItem.getMediaPath()===_bgp)return _sbcl.projectItem;}catch(_sbe){}' +
                            '}}}' +
                    '}catch(_sbe2){}return null;}' +
                'bgItem=findBg();' +
                'if(!bgItem)results.push("WARN: bg not in project");';
        }

        jsx += 'var delNames=' + delJson + ';';

        /* Helper: find component by displayName substring in clip.components */
        /* applyMot: apply pos/scale delta to Motion component; apply crop delta to Crop component */
        jsx += 'function getRV(p){var v=null;try{v=p.getValue();}catch(e){try{v=p.value;}catch(e2){}}return v;}' +
            'function applyMot(clip,px,py,sc,cl,ct,cr,cb){' +
                'try{var _comps=clip.components;var _cropFound=false;' +
                'for(var _ci=0;_ci<_comps.numItems;_ci++){var _comp=_comps[_ci],_cdn=_comp.displayName;' +
                    'if(_cdn.indexOf("Motion")>=0||_cdn.indexOf("Movimiento")>=0){' +
                        'for(var _pi=0;_pi<_comp.properties.numItems;_pi++){var _p=_comp.properties[_pi],_pn=_p.displayName;' +
                            'if(_pn.indexOf("Pos")===0){' +
                                'var _pBefore=getRV(_p);' +
                                'try{_p.setValue([px,py]);}catch(e){results.push("setPosERR:"+e.message);}' +
                                'var _pAfter=getRV(_p);' +
                                'results.push("pos:want=["+px+","+py+"]|was="+JSON.stringify(_pBefore)+"|now="+JSON.stringify(_pAfter));' +
                            '}' +
                            'if(_pn==="Scale"||_pn==="Escala"){' +
                                'var _sBefore=getRV(_p);' +
                                'try{_p.setValue(sc);}catch(e){results.push("setScERR:"+e.message);}' +
                                'var _sAfter=getRV(_p);' +
                                'results.push("sc:want="+sc+"|was="+_sBefore+"|now="+_sAfter);' +
                            '}' +
                        '}' +
                    '}' +
                    'if(_cdn==="Crop"||_cdn==="Recortar"){_cropFound=true;' +
                        'for(var _pi2=0;_pi2<_comp.properties.numItems;_pi2++){var _p2=_comp.properties[_pi2],_pn2=_p2.displayName;' +
                            'if(_pn2.indexOf("Left")>=0){try{_p2.setValue(cl);}catch(e){results.push("setCropERR:"+e.message);}}' +
                            'else if(_pn2.indexOf("Top")>=0){try{_p2.setValue(ct);}catch(e){}}' +
                            'else if(_pn2.indexOf("Right")>=0){try{_p2.setValue(cr);}catch(e){}}' +
                            'else if(_pn2.indexOf("Bot")>=0){try{_p2.setValue(cb);}catch(e){}}' +
                        '}' +
                    '}' +
                '}' +
                'if(!_cropFound){' +
                    'for(var _ci2=0;_ci2<_comps.numItems;_ci2++){var _comp2=_comps[_ci2];' +
                        'if(_comp2.displayName.indexOf("Motion")>=0||_comp2.displayName.indexOf("Movimiento")>=0){' +
                            'for(var _pi3=0;_pi3<_comp2.properties.numItems;_pi3++){var _p3=_comp2.properties[_pi3],_pn3=_p3.displayName;' +
                                'if(_pn3==="Crop Left"){try{_p3.setValue(cl);}catch(e){}}' +
                                'else if(_pn3==="Crop Top"){try{_p3.setValue(ct);}catch(e){}}' +
                                'else if(_pn3==="Crop Right"){try{_p3.setValue(cr);}catch(e){}}' +
                                'else if(_pn3==="Crop Bottom"){try{_p3.setValue(cb);}catch(e){}}' +
                            '}' +
                        '}' +
                    '}' +
                '}' +
                '}catch(_me){results.push("motERR:"+_me.message);}}';

        jsx += 'function findSeqByName(nm){' +
            'try{var _sAll=app.project.sequences;' +
                'for(var _sfi=0;_sfi<_sAll.numSequences;_sfi++){if(_sAll[_sfi]&&_sAll[_sfi].name===nm)return _sAll[_sfi];}' +
            '}catch(_sfe){}return null;}' +
            'function findProjItem(nm,path){' +
                'function _spi(item){if(!item)return null;if(item.name===nm&&item.type!==2)return item;' +
                    'try{if(item.children)for(var _i=0;_i<item.children.numItems;_i++){var _r=_spi(item.children[_i]);if(_r)return _r;}}catch(e){}return null;}' +
                'var _it=_spi(app.project.rootItem);' +
                'if(!_it&&path){try{app.project.importFiles([path],true,app.project.rootItem,false);_it=_spi(app.project.rootItem);}catch(e){}}' +
                'return _it;}' +
            'var _luFiItem=findProjItem("fade_in.mov","/Users/raulmartinez/Desktop/chess.com/AI/Video Editing Assets IA/fade_in.mov");' +
            'var _luFoItem=findProjItem("fade_out.mov","/Users/raulmartinez/Desktop/chess.com/AI/Video Editing Assets IA/fade_out.mov");' +
            'var _luIoItem=findProjItem("Intro-Outro (powered by Chessbase)_no_audio.mp4",null);' +
            'results.push("fades:fi="+(_luFiItem?"ok":"notFound")+",fo="+(_luFoItem?"ok":"notFound")+",io="+(_luIoItem?"ok":"notFound"));' +
            'function copyComps(src,dst){' +
                'try{var _sC2=src.components,_dC2=dst.components;' +
                'for(var _sci=0;_sci<_sC2.numItems;_sci++){var _sComp=_sC2[_sci];var _dComp=null;' +
                    'for(var _dci=0;_dci<_dC2.numItems;_dci++){if(_dC2[_dci].displayName===_sComp.displayName){_dComp=_dC2[_dci];break;}}' +
                    'if(!_dComp)continue;' +
                    'for(var _spi=0;_spi<_sComp.properties.numItems&&_spi<_dComp.properties.numItems;_spi++){' +
                        'try{var _sprop=_sComp.properties[_spi],_dprop=_dComp.properties[_spi];' +
                            'var _sv=getRV(_sprop);if(_sv!==null&&_sv!==undefined){try{_dprop.setValue(_sv);}catch(_pse){}}' +
                        '}catch(_pe){}' +
                    '}' +
                '}}catch(_cce){}}';


        jsx += 'for(var _si=0;_si<seqs.length;_si++){var _oSeq=seqs[_si];if(!_oSeq)continue;' +
            'var _onm=_oSeq.name.toLowerCase();' +
            'if(_onm==="2026"||_onm.indexOf("_2026")>=0||_onm.indexOf(" copy")>=0||_onm.indexOf("preview")>=0||_onm.indexOf("s&s")>=0||_onm.indexOf("short and sweet")>=0||_onm.indexOf("short&sweet")>=0){results.push("skip:"+_oSeq.name);continue;}' +
            'var _cpNm=_oSeq.name+"_2026";' +
            'var seq=findSeqByName(_cpNm);' +
            'if(!seq){' +
                'var _dupOk=false;' +
                // Method 1: clone() — captures all effects; find new seq by before/after scan
                'if(!_dupOk){try{if(typeof _oSeq.clone==="function"){' +
                    'var _nmsBefore=[];var _allSC=app.project.sequences;' +
                    'for(var _bi=0;_bi<_allSC.numSequences;_bi++){if(_allSC[_bi])_nmsBefore.push(_allSC[_bi].name);}' +
                    'var _cs=_oSeq.clone();' +
                    'if(_cs){' +
                        'try{_cs.projectItem.name=_cpNm;}catch(_cn){}' +
                        'try{_cs.name=_cpNm;}catch(_cn2){}' +
                        'seq=findSeqByName(_cpNm);' +
                        'if(!seq){' +
                            'var _allSA=app.project.sequences;' +
                            'for(var _ai=0;_ai<_allSA.numSequences;_ai++){if(!_allSA[_ai])continue;' +
                                'var _found=false;for(var _bi2=0;_bi2<_nmsBefore.length;_bi2++){if(_nmsBefore[_bi2]===_allSA[_ai].name){_found=true;break;}}' +
                                'if(!_found){seq=_allSA[_ai];' +
                                    'try{seq.projectItem.name=_cpNm;}catch(_cn3){}' +
                                    'try{seq.name=_cpNm;}catch(_cn4){};break;}}' +
                        '}' +
                        'if(seq){results.push("dup(clone):"+seq.name+">"+_cpNm);_dupOk=true;}' +
                    '}' +
                '}}catch(_ce){results.push("cloneERR:"+_ce.message);}}' +
                // Method 3: createNewSequence with preset file path (no dialog)
                'if(!_dupOk){try{' +
                    'var _frT2=10594584000;try{var _vfr=_oSeq.videoFrameRate;if(_vfr&&_vfr.ticks)_frT2=_vfr.ticks;}catch(_fre){}' +
                    'var _sqDir="/Applications/Adobe Premiere Pro 2025/Adobe Premiere Pro 2025.app/Contents/Settings/SequencePresets/HD 1080p/HD 1080p ";' +
                    'var _sqSuf;' +
                    'if(_frT2===10160640000)_sqSuf="25 fps.sqpreset";' +
                    'else if(_frT2===10594584000)_sqSuf="23.976 fps.sqpreset";' +
                    'else if(_frT2>=8480000000&&_frT2<=8490000000)_sqSuf="29.97 fps.sqpreset";' +
                    'else if(_frT2===5080320000)_sqSuf="50 fps.sqpreset";' +
                    'else _sqSuf="23.976 fps.sqpreset";' +
                    'var _sqP=_sqDir+_sqSuf;' +
                    'var _ns=app.project.createNewSequence(_cpNm,_sqP);if(_ns){' +
                    'var _onVT=_oSeq.videoTracks.numTracks,_onAT=_oSeq.audioTracks.numTracks;' +
                    'for(var _vti=0;_vti<_onVT&&_vti<_ns.videoTracks.numTracks;_vti++){var _ovt=_oSeq.videoTracks[_vti],_nvt=_ns.videoTracks[_vti];' +
                        'for(var _ci2=0;_ci2<_ovt.clips.numItems;_ci2++){var _oc=_ovt.clips[_ci2];if(!_oc.projectItem)continue;' +
                            'try{var _nc2=_nvt.overwriteClip(_oc.projectItem,_oc.start);if(_nc2){try{_nc2.end=_oc.end;}catch(_ee2){};copyComps(_oc,_nc2);}}catch(_ce2){}' +
                        '}' +
                    '}' +
                    'for(var _ati=0;_ati<_onAT&&_ati<_ns.audioTracks.numTracks;_ati++){var _oat=_oSeq.audioTracks[_ati],_nat=_ns.audioTracks[_ati];' +
                        'for(var _aci2=0;_aci2<_oat.clips.numItems;_aci2++){var _oac=_oat.clips[_aci2];if(!_oac.projectItem)continue;' +
                            'try{var _nac2=_nat.overwriteClip(_oac.projectItem,_oac.start);if(_nac2){try{_nac2.end=_oac.end;}catch(_eea){}}}catch(_ace2){}' +
                        '}' +
                    '}' +
                    'seq=_ns;results.push("dup(new):"+_cpNm);_dupOk=true;}' +
                '}catch(_ne){results.push("newSeqERR:"+_ne.message);}}' +
                'if(!_dupOk){results.push("noMethod:"+_oSeq.name+"|clone="+typeof _oSeq.clone+"|projDup="+typeof app.project.duplicateSequence+"|createNewSeq="+typeof app.project.createNewSequence);}' +
            '}else results.push("exists:"+_cpNm);' +
            'if(!seq){results.push("skip:"+_oSeq.name);continue;}' +
            // Move seq to root bin "_2026"
            'if(seq&&seq.projectItem){try{' +
                'var _b26=null;var _ri=app.project.rootItem;' +
                'for(var _bi=0;_bi<_ri.children.numItems;_bi++){var _bc=_ri.children[_bi];' +
                    'try{if(_bc.name==="_2026"&&_bc.children!==undefined){_b26=_bc;break;}}catch(_bce){}}' +
                'if(!_b26){try{_b26=_ri.createBin("_2026");results.push("bin2026:created");}catch(_bce2){results.push("bin2026ERR:"+_bce2.message);}}' +
                'if(_b26){try{seq.projectItem.moveBin(_b26);results.push("bin2026:moved:"+seq.name);}catch(_mbe){results.push("moveBin2026ERR:"+_mbe.message);}}' +
            '}catch(_bie){results.push("bin2026ERR:"+_bie.message);}}' +
            'results.push("---"+seq.name);' +
            'var _dbgS="nT="+seq.videoTracks.numTracks;' +
            'for(var _dbvi=0;_dbvi<seq.videoTracks.numTracks;_dbvi++){var _dbvt=seq.videoTracks[_dbvi];' +
                '_dbgS+="|V"+(_dbvi+1)+"="+_dbvt.clips.numItems;' +
                'for(var _dbci=0;_dbci<_dbvt.clips.numItems;_dbci++){var _dbc=_dbvt.clips[_dbci];' +
                    'if(_dbc.projectItem)_dbgS+="["+_dbc.projectItem.name+"]";' +
                '}' +
            '}results.push("SEQMAP:"+_dbgS);';

        if (a.delta) {
            var adx=luR(a.delta.dx),ady=luR(a.delta.dy),ads=luR(a.delta.ds);
            var a2cl=luR(a.after&&a.after.crop?a.after.crop.l:0),a2ct=luR(a.after&&a.after.crop?a.after.crop.t:0);
            var a2cr=luR(a.after&&a.after.crop?a.after.crop.r:0),a2cb=luR(a.after&&a.after.crop?a.after.crop.b:0);
            jsx += 'results.push("AUTOR:track=' + a.trackIdx + ',dx=' + adx + ',ds=' + ads + '");' +
                'if(' + a.trackIdx + '<seq.videoTracks.numTracks){var _aTrk=seq.videoTracks[' + a.trackIdx + '];' +
                'for(var _ai=0;_ai<_aTrk.clips.numItems;_ai++){var _ac=_aTrk.clips[_ai];if(!_ac.projectItem)continue;' +
                    'try{var _ax=960,_ay=540,_asc=100,_acl=0,_act=0,_acr=0,_acb=0;' +
                    'var _acomps=_ac.components;' +
                    'for(var _aci=0;_aci<_acomps.numItems;_aci++){var _acomp=_acomps[_aci],_acdn=_acomp.displayName;' +
                        'if(_acdn.indexOf("Motion")>=0||_acdn.indexOf("Movimiento")>=0){' +
                            'for(var _api=0;_api<_acomp.properties.numItems;_api++){var _ap=_acomp.properties[_api],_apn=_ap.displayName;' +
                                'var _arv=getRV(_ap);' +
                                'if(_apn.indexOf("Pos")===0&&_arv){if(_arv.length>=2){_ax=parseFloat(_arv[0]);_ay=parseFloat(_arv[1]);}else if(_arv.x!==undefined){_ax=parseFloat(_arv.x);_ay=parseFloat(_arv.y);}}' +
                                'if((_apn==="Scale"||_apn==="Escala")&&_arv!==null)_asc=parseFloat(_arv)||100;' +
                            '}' +
                        '}' +
                        'if(_acdn==="Crop"){' +
                            'for(var _api2=0;_api2<_acomp.properties.numItems;_api2++){var _ap2=_acomp.properties[_api2],_apn2=_ap2.displayName;' +
                                'var _arv2=getRV(_ap2);var _acfv=parseFloat(_arv2)||0;' +
                                'if(_apn2.indexOf("Left")>=0)_acl=_acfv;' +
                                'else if(_apn2.indexOf("Top")>=0)_act=_acfv;' +
                                'else if(_apn2.indexOf("Right")>=0)_acr=_acfv;' +
                                'else if(_apn2.indexOf("Bot")>=0)_acb=_acfv;' +
                            '}' +
                        '}' +
                    '}' +
                    'applyMot(_ac,_ax+(' + adx + '),_ay+(' + ady + '),_asc+(' + ads + '),' +
                        a2cl + ',' + a2ct + ',' + a2cr + ',' + a2cb + ');' +
                    'results.push("author[V' + (a.trackIdx+1) + ']:"+_ac.projectItem.name);' +
                    '}catch(_ae){results.push("authorERR:"+_ae.message);}' +
                '}}';
        }

        if (tb.delta) {
            var tdx=luR(tb.delta.dx),tdy=luR(tb.delta.dy),tds=luR(tb.delta.ds);
            var tb2cl=luR(tb.after&&tb.after.crop?tb.after.crop.l:0),tb2ct=luR(tb.after&&tb.after.crop?tb.after.crop.t:0);
            var tb2cr=luR(tb.after&&tb.after.crop?tb.after.crop.r:0),tb2cb=luR(tb.after&&tb.after.crop?tb.after.crop.b:0);
            jsx += 'results.push("BOARD:track=' + tb.trackIdx + ',dx=' + tdx + ',ds=' + tds + '");' +
                'if(' + tb.trackIdx + '<seq.videoTracks.numTracks){var _tTrk=seq.videoTracks[' + tb.trackIdx + '];' +
                'for(var _ti=0;_ti<_tTrk.clips.numItems;_ti++){var _tc=_tTrk.clips[_ti];if(!_tc.projectItem)continue;' +
                    'try{var _tx=960,_ty=540,_tsc=100,_tcl=0,_tct=0,_tcr=0,_tcb=0;' +
                    'var _tcomps=_tc.components;' +
                    'for(var _tci=0;_tci<_tcomps.numItems;_tci++){var _tcomp=_tcomps[_tci],_tcdn=_tcomp.displayName;' +
                        'if(_tcdn.indexOf("Motion")>=0||_tcdn.indexOf("Movimiento")>=0){' +
                            'for(var _tpi=0;_tpi<_tcomp.properties.numItems;_tpi++){var _tp=_tcomp.properties[_tpi],_tpn=_tp.displayName;' +
                                'var _trv=getRV(_tp);' +
                                'if(_tpn.indexOf("Pos")===0&&_trv){if(_trv.length>=2){_tx=parseFloat(_trv[0]);_ty=parseFloat(_trv[1]);}else if(_trv.x!==undefined){_tx=parseFloat(_trv.x);_ty=parseFloat(_trv.y);}}' +
                                'if((_tpn==="Scale"||_tpn==="Escala")&&_trv!==null)_tsc=parseFloat(_trv)||100;' +
                            '}' +
                        '}' +
                        'if(_tcdn==="Crop"){' +
                            'for(var _tpi2=0;_tpi2<_tcomp.properties.numItems;_tpi2++){var _tp2=_tcomp.properties[_tpi2],_tpn2=_tp2.displayName;' +
                                'var _trv2=getRV(_tp2);var _tcfv=parseFloat(_trv2)||0;' +
                                'if(_tpn2.indexOf("Left")>=0)_tcl=_tcfv;' +
                                'else if(_tpn2.indexOf("Top")>=0)_tct=_tcfv;' +
                                'else if(_tpn2.indexOf("Right")>=0)_tcr=_tcfv;' +
                                'else if(_tpn2.indexOf("Bot")>=0)_tcb=_tcfv;' +
                            '}' +
                        '}' +
                    '}' +
                    'applyMot(_tc,_tx+(' + tdx + '),_ty+(' + tdy + '),_tsc+(' + tds + '),' +
                        tb2cl + ',' + tb2ct + ',' + tb2cr + ',' + tb2cb + ');' +
                    'results.push("board[V' + (tb.trackIdx+1) + ']:"+_tc.projectItem.name);' +
                    '}catch(_te){results.push("boardERR:"+_te.message);}' +
                '}}';
        }

        jsx += 'if(delNames.length){for(var _dvi=0;_dvi<seq.videoTracks.numTracks;_dvi++){' +
            'var _dvt=seq.videoTracks[_dvi];var _dDel=[];' +
            'for(var _dci=0;_dci<_dvt.clips.numItems;_dci++){var _dcl=_dvt.clips[_dci];' +
                'if(_dcl.projectItem&&delNames.indexOf(_dcl.projectItem.name)>=0)_dDel.push(_dci);}' +
            'for(var _dri=_dDel.length-1;_dri>=0;_dri--){' +
                'try{_dvt.clips[_dDel[_dri]].remove(false,false);results.push("del V"+(_dvi+1));}' +
                'catch(e){results.push("delERR:"+e.message);}}}}';

        if (bgPath) {
            jsx += 'if(bgItem){var _bgTrk=seq.videoTracks[0];' +
                'for(var _brci=_bgTrk.clips.numItems-1;_brci>=0;_brci--){try{_bgTrk.clips[_brci].remove(false,false);}catch(e){}}' +
                'try{var _bgT=new Time();_bgT.ticks=0;_bgTrk.overwriteClip(bgItem,_bgT);' +
                    'var _bgC=_bgTrk.clips[0];if(_bgC){var _bgEnd=new Time();_bgEnd.seconds=seq.end.seconds;try{_bgC.end=_bgEnd;}catch(e){}}' +
                    'results.push("bg:replaced V1");}catch(e){results.push("bgERR:"+e.message);}}';
        }

        // Delete unwanted clips from video tracks (Intro-Outro Chessable, Overlay, and ALL adjustment layers)
        jsx += 'for(var _ovi=0;_ovi<seq.videoTracks.numTracks;_ovi++){var _ovt=seq.videoTracks[_ovi];var _oDel=[];' +
            'for(var _oci=0;_oci<_ovt.clips.numItems;_oci++){var _ocl=_ovt.clips[_oci];' +
                'if(!_ocl.projectItem)continue;var _ocn=_ocl.projectItem.name;var _ocnL=_ocn.toLowerCase();' +
                'if(_ocn==="Overlay 1080p (Previews).mov"' +
                    '||(_ocn.indexOf("Intro-Outro")>=0&&_ocn.indexOf("powered")<0)' +
                    '||_ocnL.indexOf("capa de ajuste")>=0||_ocnL.indexOf("adjustment layer")>=0' +
                ')_oDel.push({i:_oci,n:_ocn});}' +
            'for(var _ori=_oDel.length-1;_ori>=0;_ori--){' +
                'try{_ovt.clips[_oDel[_ori].i].remove(false,false);results.push("del:"+_oDel[_ori].n);}' +
                'catch(_oe){results.push("delERR:"+_oe.message);}}}';
        // Delete transition_cuts.wav from audio tracks
        jsx += 'for(var _axi=0;_axi<seq.audioTracks.numTracks;_axi++){var _axt=seq.audioTracks[_axi];var _axDel=[];' +
            'for(var _axci=0;_axci<_axt.clips.numItems;_axci++){var _axcl=_axt.clips[_axci];' +
                'if(!_axcl.projectItem)continue;' +
                'if(_axcl.projectItem.name==="transition_cuts.wav")_axDel.push({i:_axci,n:_axcl.projectItem.name});}' +
            'for(var _axri=_axDel.length-1;_axri>=0;_axri--){' +
                'try{_axt.clips[_axDel[_axri].i].remove(false,false);results.push("del:"+_axDel[_axri].n);}' +
                'catch(_axe){results.push("delERR:"+_axe.message);}}}';

        // Find first content clip start, delete pre-content clips, then move all clips left to frame 0
        var inTrkIdx = (luState.autor && luState.autor.trackIdx !== undefined) ? luState.autor.trackIdx : 1;
        jsx += 'try{var _inTrk=seq.videoTracks[' + inTrkIdx + '];if(_inTrk&&_inTrk.clips.numItems>0){' +
            'var _minT=parseFloat(_inTrk.clips[0].start.ticks)||0;' +
            'for(var _fci=1;_fci<_inTrk.clips.numItems;_fci++){var _fcs=parseFloat(_inTrk.clips[_fci].start.ticks)||0;if(_fcs<_minT)_minT=_fcs;}' +
            'results.push("minT:"+_minT);' +
            // Delete pre-content clips on all video tracks (those ending at or before content start)
            'for(var _pvi=0;_pvi<seq.videoTracks.numTracks;_pvi++){var _pvt=seq.videoTracks[_pvi];var _pDel=[];' +
                'for(var _pci=0;_pci<_pvt.clips.numItems;_pci++){var _pcl=_pvt.clips[_pci];' +
                    'if(parseFloat(_pcl.end.ticks)<=_minT)_pDel.push(_pci);}' +
                'for(var _pri=_pDel.length-1;_pri>=0;_pri--){' +
                    'try{_pvt.clips[_pDel[_pri]].remove(false,false);results.push("delPre");}catch(_pe){}}}' +
            // Move all clips left by _minT (skip Intro-Outro — has inPoint=0 and would stretch)
            'if(_minT>0){' +
                'var _mvTrks=[];' +
                'for(var _mvi=0;_mvi<seq.videoTracks.numTracks;_mvi++)_mvTrks.push(seq.videoTracks[_mvi]);' +
                'for(var _mai=0;_mai<seq.audioTracks.numTracks;_mai++)_mvTrks.push(seq.audioTracks[_mai]);' +
                'var _mvOk=0,_mvErr=0;' +
                'for(var _mti=0;_mti<_mvTrks.length;_mti++){var _mtrk=_mvTrks[_mti];' +
                    'var _mca=[];for(var _mci=0;_mci<_mtrk.clips.numItems;_mci++){' +
                        'var _mc=_mtrk.clips[_mci];_mca.push({c:_mc,s:parseFloat(_mc.start.ticks)||0,n:(_mc.projectItem?_mc.projectItem.name:"")});}' +
                    '_mca.sort(function(a,b){return a.s-b.s;});' +
                    'for(var _mci2=0;_mci2<_mca.length;_mci2++){' +
                        'var _mstart=_mca[_mci2].s;' +
                        'if(_mstart<_minT)continue;' +
                        'if(_mca[_mci2].n.indexOf("Intro-Outro")>=0)continue;' + // skip: inPoint=0 → would stretch
                        'var _mns=_mstart-_minT;' +
                        'var _mOldEnd=parseFloat(_mca[_mci2].c.end.ticks)||0;' +
                        'var _mne=_mOldEnd-_minT;' +
                        'try{' +
                            'var _mnet=new Time();_mnet.ticks=String(_mne);_mca[_mci2].c.end=_mnet;' + // trim end first (preserves source out-point)
                            'var _mnt=new Time();_mnt.ticks=String(_mns);_mca[_mci2].c.start=_mnt;' + // then move start
                            '_mvOk++;' +
                        '}catch(_mce){_mvErr++;}}' +
                '}' +
                'results.push("moveClips:ok="+_mvOk+",err="+_mvErr);' +
            '}' +
            'try{var _inPt=new Time();_inPt.ticks="0";seq.inPoint=_inPt;results.push("inPoint:0");}catch(_ie2){}' +
        '}}catch(_ie){results.push("moveERR:"+_ie.message);}';

        // Fade_out: find Intro-Outro (powered) start, place fade_out ENDING there
        jsx +=
            'var _fdTrk=seq.videoTracks[seq.videoTracks.numTracks-1];' +
            'var _ioStart=-1;' +
            'for(var _iovti=0;_iovti<seq.videoTracks.numTracks;_iovti++){' +
                'var _iovt=seq.videoTracks[_iovti];' +
                'for(var _ioci=0;_ioci<_iovt.clips.numItems;_ioci++){' +
                    'var _iocl=_iovt.clips[_ioci];' +
                    'if(_iocl.projectItem){var _ionm=_iocl.projectItem.name;' +
                        'if(_ionm.indexOf("Intro-Outro")>=0&&_ionm.indexOf("powered")>=0){' +
                            '_ioStart=parseFloat(_iocl.start.ticks)||0;break;}}' +
                '}if(_ioStart>=0)break;}' +
            'results.push("ioStart:"+_ioStart);' +
            'var _ioJustAdded=false;' +
            // Compute recording end (post-movement) from autor track
            'var _ioRecEnd=0;' +
            'try{var _ioRTrk2=seq.videoTracks[' + inTrkIdx + '];' +
                'for(var _iorfi2=0;_iorfi2<_ioRTrk2.clips.numItems;_iorfi2++){var _iorfe2=parseFloat(_ioRTrk2.clips[_iorfi2].end.ticks)||0;if(_iorfe2>_ioRecEnd)_ioRecEnd=_iorfe2;}' +
            '}catch(_irfe){}' +
            // Case A: no Intro-Outro found → add it at recording end
            'if(_ioStart<0&&_luIoItem&&_ioRecEnd>0){try{' +
                'var _ioFbTrk=seq.videoTracks.numTracks>3?seq.videoTracks[3]:seq.videoTracks[seq.videoTracks.numTracks-1];' +
                'var _ioPlT=new Time();_ioPlT.ticks=String(_ioRecEnd);' +
                '_ioFbTrk.overwriteClip(_luIoItem,_ioPlT);' +
                '_ioStart=_ioRecEnd;_ioJustAdded=true;results.push("ioAdded@"+_ioRecEnd);' +
            '}catch(_iofbe){results.push("ioAddErr:"+_iofbe.message);}}' +
            // Case B: Intro-Outro found at its original (pre-movement) position → re-place it at recording end
            'if(_ioStart>=0&&!_ioJustAdded&&_ioRecEnd>0&&_ioStart!==_ioRecEnd){try{' +
                'var _ioMvDone=false;' +
                'for(var _ioMvTi=0;_ioMvTi<seq.videoTracks.numTracks&&!_ioMvDone;_ioMvTi++){' +
                    'var _ioMvTrk=seq.videoTracks[_ioMvTi];' +
                    'for(var _ioMvCi=_ioMvTrk.clips.numItems-1;_ioMvCi>=0&&!_ioMvDone;_ioMvCi--){' +
                        'var _ioMvCl=_ioMvTrk.clips[_ioMvCi];' +
                        'if(_ioMvCl.projectItem&&_ioMvCl.projectItem.name.indexOf("Intro-Outro")>=0&&_ioMvCl.projectItem.name.indexOf("powered")>=0){' +
                            'var _ioMvItem=_ioMvCl.projectItem;' +
                            'try{_ioMvCl.remove(false,false);' +
                                'var _ioMvT=new Time();_ioMvT.ticks=String(_ioRecEnd);' +
                                '_ioMvTrk.overwriteClip(_ioMvItem,_ioMvT);' +
                                '_ioStart=_ioRecEnd;_ioMvDone=true;results.push("ioMoved@"+_ioRecEnd);' +
                            '}catch(_ioMe){results.push("ioMoveErr:"+_ioMe.message);}' +
                        '}' +
                    '}' +
                '}' +
            '}catch(_ioMvE){results.push("ioMvOuterErr:"+_ioMvE.message);}}' +
            // Place fade_out ending at _ioStart (natural duration, no extension)
            'if(_luFoItem&&_fdTrk&&_ioStart>=0){try{' +
                'var _foDur=0;' +
                'try{_foDur=parseFloat(_luFoItem.getOutPoint().ticks)-parseFloat(_luFoItem.getInPoint().ticks);}catch(_fde){' +
                    'try{_foDur=parseFloat(_luFoItem.duration.ticks);}catch(_fde2){_foDur=254016000000;}}' +
                'var _foSt=_ioStart-_foDur;if(_foSt<0)_foSt=0;' +
                'var _foT=new Time();_foT.ticks=String(_foSt);' +
                '_fdTrk.overwriteClip(_luFoItem,_foT);' +
                'results.push("fo:ok@"+_foSt+"/ioStart:"+_ioStart+"/dur:"+_foDur);' +
            '}catch(_foe){results.push("foERR:"+_foe.message);}}' +
            // Fade_in: place at position 0 on topmost track
            'if(_luFiItem&&_fdTrk){try{' +
                'var _fiT=new Time();_fiT.ticks="0";' +
                '_fdTrk.overwriteClip(_luFiItem,_fiT);results.push("fi:ok@0");' +
            '}catch(_fie){results.push("fiERR:"+_fie.message);}}';

        jsx += '}return "ok|"+results.join("|");}catch(e){return "ERR: "+e.message;}})()';
        return jsx;
    }

    function luRun(singleSeq) {
        var luStatus = document.getElementById('luStatus');
        var luLogEl  = document.getElementById('luLog');
        var btnTest  = document.getElementById('luBtnTest');
        var btnRun   = document.getElementById('luBtnRun');

        var hasAction = luState.autor.delta || luState.tablero.delta ||
                        luState.toDelete.length || luState.fondo.path;
        if (!hasAction) {
            luStatus.textContent = 'Nothing configured. Capture a position or select a background.';
            luStatus.className   = 'status error';
            return;
        }

        btnTest.disabled = true;
        btnRun.disabled  = true;
        luStatus.textContent = singleSeq ? 'Applying to active chapter...' : 'Applying to full course...';
        luStatus.className   = 'status running';
        luLogEl.style.display = 'none';

        safeEvalScript(luBuildApplyJSX(singleSeq), function (res) {
            btnTest.disabled = false;
            btnRun.disabled  = false;
            var ok = res && res.indexOf('ok|') === 0;
            luStatus.textContent = ok ? 'Done' : ('ERROR: ' + (res || 'no response'));
            luStatus.className   = 'status ' + (ok ? 'done' : 'error');
            luLogEl.textContent  = (res || '').replace(/\|/g, '\n');
            luLogEl.style.display = 'block';
            luLog((singleSeq ? 'test' : 'apply') + ': ' + res);
        });
    }

    document.getElementById('luBtnTest').addEventListener('click', function () { luRun(true);  });
    document.getElementById('luBtnRun' ).addEventListener('click', function () { luRun(false); });

    var LU_PRESET = '/Users/raulmartinez/Desktop/chess.com/Chessable Vimeo Export.epr';

    // --- EXPORT: Step 1 — Preview list ---
    document.getElementById('luBtnExport').addEventListener('click', function () {
        var luStatus = document.getElementById('luStatus');
        var luLogEl  = document.getElementById('luLog');
        var btnQueue = document.getElementById('luBtnQueue');
        if (!luState.exportDir) {
            luStatus.textContent = 'Select output folder first.';
            luStatus.className   = 'status error';
            return;
        }
        var btn = this;
        btn.disabled = true;
        btnQueue.style.display = 'none';
        luStatus.textContent = 'Collecting _2026 sequences...';
        luStatus.className   = 'status running';

        safeEvalScript(
            '(function(){try{var results=[];var seqs=app.project.sequences;' +
            'for(var i=0;i<seqs.numSequences;i++){var s=seqs[i];if(!s)continue;' +
                'var nm=s.name;var nml=nm.toLowerCase();' +
                'if(nml.indexOf("_2026")<0)continue;' +
                'if(nml.indexOf("webcam")>=0||nml.indexOf("nested")>=0||nml.indexOf("_preview")>=0||nml.indexOf("test")>=0)continue;' +
                'results.push(nm);' +
            '}return "ok|"+results.length+" sequences|"+results.join("|");' +
            '}catch(e){return "ERR: "+e.message;}})()',
            function (res) {
                btn.disabled = false;
                var ok = res && res.indexOf('ok|') === 0;
                if (!ok) {
                    luStatus.textContent = 'ERROR: ' + (res || 'no response');
                    luStatus.className   = 'status error';
                    luLogEl.textContent  = res || '';
                    luLogEl.style.display = 'block';
                    return;
                }
                var parts = res.split('|');
                var count = parts[1] || '';
                var names = parts.slice(2);
                luStatus.textContent = count + ' ready to export';
                luStatus.className   = 'status done';
                luLogEl.textContent  = 'Will export:\n' + names.join('\n');
                luLogEl.style.display = 'block';
                if (names.length > 0) {
                    btnQueue.style.display = '';
                    btnQueue.disabled = false;
                }
                luLog('export-preview: ' + res);
            }
        );
    });

    // --- EXPORT: Step 2 — Queue in Media Encoder ---
    document.getElementById('luBtnQueue').addEventListener('click', function () {
        var luStatus = document.getElementById('luStatus');
        var luLogEl  = document.getElementById('luLog');
        var btn = this;
        btn.disabled = true;
        luStatus.textContent = 'Queuing in Media Encoder...';
        luStatus.className   = 'status running';

        var exportDir  = luEscJSX(luState.exportDir.replace(/\\/g, '/').replace(/"/g, '\\"'));
        var presetPath = luEscJSX(LU_PRESET.replace(/"/g, '\\"'));

        safeEvalScript(
            '(function(){' +
            'try{' +
            'var r=[];' +
            'var p="' + presetPath + '";' +
            'var d="' + exportDir + '";' +
            'try{app.encoder.bind();}catch(_b){}' +
            'var ss=app.project.sequences;' +
            'for(var i=0;i<ss.numSequences;i++){' +
                'var s=ss[i];if(!s)continue;' +
                'var nml=s.name.toLowerCase();' +
                'if(nml.indexOf("_2026")<0||nml.indexOf("webcam")>=0||nml.indexOf("nested")>=0||nml.indexOf("test")>=0||nml.indexOf("preview")>=0||nml.indexOf("s&s")>=0||nml.indexOf("short and sweet")>=0||nml.indexOf("short&sweet")>=0)continue;' +
                'var out=d+"/"+s.name+".mp4";' +
                'var _ok=false;' +
                'try{app.encoder.encodeSequence(s,out,p,0,false);_ok=true;}catch(_e1){' +
                    'try{s.exportAsMediaDirect(out,p,0);_ok=true;}catch(_e2){r.push("E:"+s.name+":"+_e2.message);}' +
                '}' +
                'if(_ok)r.push("q:"+s.name);' +
            '}' +
            'return "ok|"+r.length+"|"+r.join("|");' +
            '}catch(e){return "ERR:"+e.message;}' +
            '})()',
            function (res) {
                btn.disabled = false;
                var ok = res && res.indexOf('ok|') === 0;
                var parts = ok ? res.split('|') : null;
                luStatus.textContent = ok ? (parts[1] || 'Done') : ('ERROR: ' + (res || 'no response'));
                luStatus.className   = 'status ' + (ok ? 'done' : 'error');
                luLogEl.textContent  = (res || '').replace(/\|/g, '\n');
                luLogEl.style.display = 'block';
                luLog('export-queue: ' + res);
            }
        );
    });
})(); // end Legacy Updater

/* ── Legacy Wistia ──────────────────────────────────────────────────────── */
(function () {
    var lwBtn     = document.getElementById('lwBtnRun');
    var lwCapture = document.getElementById('lwBtnCapture');
    var lwStatus  = document.getElementById('lwStatus');
    if (!lwBtn) return;

    // inputs
    var lwInps = {
        tblX:  document.getElementById('lwTblX'),
        tblY:  document.getElementById('lwTblY'),
        tblS:  document.getElementById('lwTblScale'),
        autX:  document.getElementById('lwAutX'),
        autY:  document.getElementById('lwAutY'),
        autS:  document.getElementById('lwAutScale')
    };

    var lwChkIO  = document.getElementById('lwChkIO');
    var lwBtnIO  = document.getElementById('lwBtnIO');
    var lwIOInfo = document.getElementById('lwIOInfo');

    // persist in localStorage
    var LW_KEY = 'lw_motion_v1';
    var lwIOPath = '';
    try {
        var _saved = JSON.parse(localStorage.getItem(LW_KEY) || '{}');
        if (_saved.tblX) lwInps.tblX.value = _saved.tblX;
        if (_saved.tblY) lwInps.tblY.value = _saved.tblY;
        if (_saved.tblS) lwInps.tblS.value = _saved.tblS;
        if (_saved.autX) lwInps.autX.value = _saved.autX;
        if (_saved.autY) lwInps.autY.value = _saved.autY;
        if (_saved.autS) lwInps.autS.value = _saved.autS;
        if (_saved.ioPath) { lwIOPath = _saved.ioPath; lwIOInfo.textContent = lwIOPath.split('/').pop(); }
        if (_saved.ioEnabled === false) lwChkIO.checked = false;
    } catch(e) {}

    function lwSave() {
        try { localStorage.setItem(LW_KEY, JSON.stringify({
            tblX: lwInps.tblX.value, tblY: lwInps.tblY.value, tblS: lwInps.tblS.value,
            autX: lwInps.autX.value, autY: lwInps.autY.value, autS: lwInps.autS.value,
            ioPath: lwIOPath, ioEnabled: lwChkIO.checked
        })); } catch(e) {}
    }
    Object.keys(lwInps).forEach(function(k){ lwInps[k].addEventListener('change', lwSave); });
    lwChkIO.addEventListener('change', lwSave);

    // Intro-Outro file picker
    lwBtnIO.addEventListener('click', function () {
        var jsx = 'var _f=File.openDialog("Selecciona Intro-Outro","*.mp4,*.mov");_f?_f.fsName:"";';
        window.__adobe_cep__.evalScript(jsx, function(res) {
            if (res && res !== 'undefined' && res !== '') {
                lwIOPath = res;
                lwIOInfo.textContent = res.split('/').pop();
                lwSave();
            }
        });
    });

    // Background (fondo) file picker — independent of Legacy Updater
    var lwBgPath = '';
    var lwBgInfo = document.getElementById('lwBgInfo');
    try { var _savedLwBg = localStorage.getItem('lw_bg_path'); if (_savedLwBg) { lwBgPath = _savedLwBg; lwBgInfo.textContent = _savedLwBg.split('/').pop(); } } catch(e) {}
    var lwBtnBg = document.getElementById('lwBtnBg');
    if (lwBtnBg) {
        lwBtnBg.addEventListener('click', function () {
            var jsx = 'var _f=File.openDialog("Selecciona fondo","*.mp4,*.mov,*.png,*.jpg");_f?_f.fsName:"";';
            window.__adobe_cep__.evalScript(jsx, function(res) {
                if (res && res !== 'undefined' && res !== '') {
                    lwBgPath = res;
                    lwBgInfo.textContent = res.split('/').pop();
                    try { localStorage.setItem('lw_bg_path', res); } catch(e) {}
                }
            });
        });
    }

    function lwLog(msg) {
        lwStatus.style.display = 'block';
        lwStatus.innerHTML = msg;
    }

    // ── Capture motion from test sequence ──────────────────────────────────
    lwCapture.addEventListener('click', function () {
        lwCapture.disabled = true;
        var jsx =
            'var _r={ok:false,err:"",tbl:{x:0,y:0,s:100},aut:{x:0,y:0,s:100}};' +
            'try{var _sq=app.project.activeSequence;if(!_sq)throw new Error("No active sequence");' +
            // find the two tracks with video clips (skip bg = PNG/JPG)
            'var _vTracks=[];' +
            'for(var _ti=0;_ti<_sq.videoTracks.numTracks;_ti++){' +
                'var _vt=_sq.videoTracks[_ti];if(_vt.clips.numItems===0)continue;' +
                'var _cl=_vt.clips[0];if(!_cl.projectItem)continue;' +
                'try{var _mp=_cl.projectItem.getMediaPath();if(/\\.png$|\\.jpg$/i.test(_mp))continue;}catch(_mpe){}' +
                '_vTracks.push({idx:_ti,clip:_cl});' +
            '}' +
            'function _getMotion(clip){var _m={x:0,y:0,s:100};' +
                'try{for(var _ci=0;_ci<clip.components.numItems;_ci++){' +
                    'var _co=clip.components[_ci];if(_co.displayName!=="Motion")continue;' +
                    'for(var _pi=0;_pi<_co.properties.numItems;_pi++){' +
                        'var _pp=_co.properties[_pi];var _v=_pp.getValue();' +
                        'if(_pp.displayName==="Position"){_m.x=_v[0];_m.y=_v[1];}' +
                        'if(_pp.displayName==="Scale")_m.s=_v;' +
                    '}' +
                '}}catch(_e){}return _m;}' +
            'if(_vTracks.length>=1)_r.tbl=_getMotion(_vTracks[0].clip);' +
            'if(_vTracks.length>=2)_r.aut=_getMotion(_vTracks[1].clip);' +
            '_r.ok=true;}catch(_e){_r.err=_e.message;}' +
            'JSON.stringify(_r);';
        window.__adobe_cep__.evalScript(jsx, function(res) {
            lwCapture.disabled = false;
            try {
                var d = JSON.parse(res);
                if (!d.ok) { lwLog('Capture error: ' + d.err); return; }
                var _w = d.w || 1920, _h = d.h || 1080;
                lwInps.tblX.value = Math.round(d.tbl.x * _w * 10) / 10;
                lwInps.tblY.value = Math.round(d.tbl.y * _h * 10) / 10;
                lwInps.tblS.value = Math.round(d.tbl.s * 10) / 10;
                lwInps.autX.value = Math.round(d.aut.x * _w * 10) / 10;
                lwInps.autY.value = Math.round(d.aut.y * _h * 10) / 10;
                lwInps.autS.value = Math.round(d.aut.s * 10) / 10;
                lwSave();
                lwLog('Capturado: Tablero (' + lwInps.tblX.value + ', ' + lwInps.tblY.value + ') s=' + lwInps.tblS.value +
                      ' | Autor (' + lwInps.autX.value + ', ' + lwInps.autY.value + ') s=' + lwInps.autS.value);
            } catch(e) { lwLog('Parse error: ' + res); }
        });
    });

    lwBtn.addEventListener('click', function () {
        lwBtn.disabled = true;
        lwLog('Leyendo secuencia test...');

        // ── Phase 1: read test sequence ──────────────────────────────────
        var jsx1 =
            'var _r={ok:false,err:"",cutStartT:0,cutEndT:0,fps:0,w:0,h:0,testChapPath:"",tracks:[]};' +
            'try{' +
                'var _sq=app.project.activeSequence;' +
                'if(!_sq)throw new Error("No hay secuencia activa");' +
                '_r.seqName=_sq.name;' +
                '_r.fps=_sq.timebase;' +
                '_r.w=_sq.frameSizeHorizontal;' +
                '_r.h=_sq.frameSizeVertical;' +

                // ── helper: read all component params from a TrackItem ──
                'function _readComps(clip){' +
                    'var out=[];' +
                    'try{for(var i=0;i<clip.components.numItems;i++){' +
                        'var co=clip.components[i];' +
                        'var coInfo={name:co.displayName,params:[]};' +
                        'try{for(var j=0;j<co.properties.numItems;j++){' +
                            'var pp=co.properties[j];' +
                            'try{coInfo.params.push({name:pp.displayName,val:pp.getValue()});}catch(e){}' +
                        '}}catch(e){}' +
                        'out.push(coInfo);' +
                    '}}catch(e){}' +
                    'return out;}' +

                // ── read video tracks ──
                'for(var _vti=0;_vti<_sq.videoTracks.numTracks;_vti++){' +
                    'var _vt=_sq.videoTracks[_vti];' +
                    'if(_vt.clips.numItems===0)continue;' +
                    'var _tinfo={idx:_vti,type:"video",isChapter:false,clips:[]};' +
                    'for(var _vci=0;_vci<_vt.clips.numItems;_vci++){' +
                        'var _vc=_vt.clips[_vci];' +
                        'var _ci={startT:parseFloat(_vc.start.ticks)||0,endT:parseFloat(_vc.end.ticks)||0,' +
                            'inPtT:parseFloat(_vc.inPoint.ticks)||0,name:_vc.projectItem?_vc.projectItem.name:"",' +
                            'mediaPath:""};' +
                        'try{_ci.mediaPath=_vc.projectItem.getMediaPath();}catch(e){}' +
                        '_ci.clipDurT=parseFloat(_vc.end.ticks)-parseFloat(_vc.start.ticks);' +
                        '_ci.comps=_readComps(_vc);' +
                        '_tinfo.clips.push(_ci);' +
                    '}' +
                    '_r.tracks.push(_tinfo);' +
                '}' +

                // ── read audio tracks ──
                'for(var _ati=0;_ati<_sq.audioTracks.numTracks;_ati++){' +
                    'var _at=_sq.audioTracks[_ati];' +
                    'if(_at.clips.numItems===0)continue;' +
                    'var _atinfo={idx:_ati,type:"audio",isChapter:false,clips:[]};' +
                    'for(var _aci=0;_aci<_at.clips.numItems;_aci++){' +
                        'var _ac=_at.clips[_aci];' +
                        'var _aMediaPath="";try{_aMediaPath=_ac.projectItem.getMediaPath();}catch(e){}' +
                        '_atinfo.clips.push({startT:parseFloat(_ac.start.ticks)||0,endT:parseFloat(_ac.end.ticks)||0,mediaPath:_aMediaPath,comps:_readComps(_ac)});' +
                    '}' +
                    '_r.tracks.push(_atinfo);' +
                '}' +

                // ── find testChapPath: path of the chapter mp4 in the test ──
                // It's the first mp4/mov file found on the first video track with mp4 clips
                'var _testChapPath="";' +
                'for(var _ti=0;_ti<_r.tracks.length&&!_testChapPath;_ti++){' +
                    'var _t=_r.tracks[_ti];' +
                    'if(_t.type!=="video")continue;' +
                    'for(var _ci2=0;_ci2<_t.clips.length;_ci2++){' +
                        'var _cp=_t.clips[_ci2].mediaPath;' +
                        'if(_cp&&/\\.mp4$|\\.mov$/i.test(_cp)){_testChapPath=_cp;break;}' +
                    '}' +
                '}' +
                '_r.testChapPath=_testChapPath;' +

                // ── mark each track: isChapter = has clips whose path matches testChapPath ──
                'for(var _ti2=0;_ti2<_r.tracks.length;_ti2++){' +
                    'var _t2=_r.tracks[_ti2];' +
                    'for(var _ci3=0;_ci3<_t2.clips.length;_ci3++){' +
                        'if(_t2.clips[_ci3].mediaPath===_testChapPath){_t2.isChapter=true;break;}' +
                    '}' +
                '}' +

                // ── compute cutStart/cutEnd from the FIRST chapter video track ──
                // Collects all clips on chapter video tracks, ordered by sequence start time
                'var _chapVClips=[];' +
                'for(var _vti2=0;_vti2<_sq.videoTracks.numTracks;_vti2++){' +
                    'var _vt2=_sq.videoTracks[_vti2];' +
                    'for(var _vci2=0;_vci2<_vt2.clips.numItems;_vci2++){' +
                        'var _vc2=_vt2.clips[_vci2];' +
                        'if(!_vc2.projectItem)continue;' +
                        'var _vmp="";try{_vmp=_vc2.projectItem.getMediaPath();}catch(e){}' +
                        'if(_vmp!==_testChapPath)continue;' +
                        '_chapVClips.push(_vc2);' +
                        'break;' + // only first clip per track for ordering
                    '}' +
                '}' +
                'if(_chapVClips.length===0)throw new Error("No hay clips del capítulo test");' +
                // Sort by sequence start time to find intro (earliest) and outro (latest)
                '_chapVClips.sort(function(a,b){return parseFloat(a.start.ticks)-parseFloat(b.start.ticks);});' +
                // Use first video track with chapter clips to get per-track clip list (in time order)
                'var _firstChapTrackClips=[];' +
                'for(var _vti3=0;_vti3<_sq.videoTracks.numTracks;_vti3++){' +
                    'var _vt3=_sq.videoTracks[_vti3];' +
                    'var _fcClips=[];' +
                    'for(var _vci3=0;_vci3<_vt3.clips.numItems;_vci3++){' +
                        'var _vc3=_vt3.clips[_vci3];' +
                        'if(!_vc3.projectItem)continue;' +
                        'var _vmp3="";try{_vmp3=_vc3.projectItem.getMediaPath();}catch(e){}' +
                        'if(_vmp3!==_testChapPath)continue;' +
                        '_fcClips.push(_vc3);' +
                    '}' +
                    'if(_fcClips.length>0){_firstChapTrackClips=_fcClips;break;}' +
                '}' +
                '_firstChapTrackClips.sort(function(a,b){return parseFloat(a.start.ticks)-parseFloat(b.start.ticks);});' +

                // cutStart = duration of the INTRO clip (first clip in time) = how many ticks to trim from start
                // cutEnd = duration of the OUTRO clip (last clip in time) = how many ticks to trim from end
                'var _fcFirst=_firstChapTrackClips[0];' +
                'var _fcLast=_firstChapTrackClips[_firstChapTrackClips.length-1];' +
                'if(_firstChapTrackClips.length>=3){' +
                    // 3-clip structure: intro | main | outro
                    '_r.cutStartT=parseFloat(_fcFirst.end.ticks)-parseFloat(_fcFirst.start.ticks);' +
                    '_r.cutEndT=parseFloat(_fcLast.end.ticks)-parseFloat(_fcLast.start.ticks);' +
                '}else{' +
                    // Single or 2-clip: use clip source in/out points
                    '_r.cutStartT=parseFloat(_fcFirst.inPoint.ticks)||0;' +
                    'var _lastSrcDur=0;' +
                    'try{_lastSrcDur=parseFloat(_fcLast.projectItem.getOutPoint().ticks)-parseFloat(_fcLast.projectItem.getInPoint().ticks);}catch(e){' +
                        'try{_lastSrcDur=parseFloat(_fcLast.projectItem.duration.ticks);}catch(e2){}}' +
                    'var _lastOutPt=parseFloat(_fcLast.inPoint.ticks)+(parseFloat(_fcLast.end.ticks)-parseFloat(_fcLast.start.ticks));' +
                    '_r.cutEndT=Math.max(0,_lastSrcDur-_lastOutPt);' +
                '}' +

                '_r.ok=true;' +
            '}catch(_e){_r.err=_e.message;}' +
            'JSON.stringify(_r);';

        window.__adobe_cep__.evalScript(jsx1, function (res1) {
            var data;
            try { data = JSON.parse(res1); } catch(e) { lwLog('Error JSON: ' + res1); lwBtn.disabled = false; return; }
            if (!data.ok) { lwLog('Error: ' + data.err); lwBtn.disabled = false; return; }

            var cutStartT = data.cutStartT;
            var cutEndT   = data.cutEndT;
            var cutStartS = (cutStartT / 254016000000).toFixed(2);
            var cutEndS   = (cutEndT   / 254016000000).toFixed(2);
            lwLog('Test leído: corte inicio=' + cutStartS + 's, fin=' + cutEndS + 's<br>Buscando capítulos...');

            // ── Phase 2: find all chapter project items (video, no PREVIEW) ──
            var jsx2 =
                'var _items=[];' +
                'function _scan(node){' +
                    'if(!node||!node.children)return;' +
                    'for(var _i=0;_i<node.children.numItems;_i++){' +
                        'var _ch=node.children[_i];' +
                        'if(_ch.type===ProjectItemType.CLIP){' +
                            'try{var _mp=_ch.getMediaPath();' +
                            'if(!_mp||!/\\.mp4$|\\.mov$/i.test(_mp))continue;' +
                            'if(/preview/i.test(_ch.name))continue;' +
                            '_items.push({name:_ch.name,path:_mp});}catch(_e){}' +
                        '}else{_scan(_ch);}' +
                    '}' +
                '}' +
                '_scan(app.project.rootItem);' +
                'JSON.stringify(_items);';

            window.__adobe_cep__.evalScript(jsx2, function (res2) {
                var chapters;
                try { chapters = JSON.parse(res2); } catch(e) { lwLog('Error capítulos: ' + res2); lwBtn.disabled = false; return; }
                if (!chapters.length) { lwLog('No se encontraron capítulos (mp4/mov sin PREVIEW) en el proyecto.'); lwBtn.disabled = false; return; }

                lwLog('Capítulos encontrados: ' + chapters.length + '<br>Procesando...');

                // ── Phase 3: for each chapter create sequence ──────────────
                var tracksJSON  = JSON.stringify(data.tracks);
                var chapJSON    = JSON.stringify(chapters);

                var tblX = parseFloat(lwInps.tblX.value) || 960;
                var tblY = parseFloat(lwInps.tblY.value) || 540;
                var tblS = parseFloat(lwInps.tblS.value) || 100;
                var autX = parseFloat(lwInps.autX.value) || 960;
                var autY = parseFloat(lwInps.autY.value) || 540;
                var autS = parseFloat(lwInps.autS.value) || 100;
                var doIO   = lwChkIO.checked && !!lwIOPath;
                var ioPath = lwIOPath;

                var _bgPathJS = (lwBgPath || '').replace(/\\/g, '/').replace(/"/g, '\\"');
                var _ioPathJS = (doIO && ioPath) ? ioPath.replace(/\\/g, '/').replace(/"/g, '\\"') : '';

                var jsx3 =
                    'var _OUT=[];' +
                    'try{' +

                    'var _chaps=' + chapJSON + ';' +
                    'var _tracks=' + tracksJSON + ';' +
                    'var _cutST=' + cutStartT + ';' +
                    'var _cutET=' + cutEndT + ';' +
                    'var _bgPath="' + _bgPathJS + '";' +
                    'var _ioPath="' + _ioPathJS + '";' +
                    'var _testSeq=app.project.activeSequence;' +
                    'if(!_testSeq)throw new Error("no active sequence");' +

                    // ── helper: find ProjectItem by file path ──
                    'function _findByPath(path,node){' +
                        'if(!node)node=app.project.rootItem;' +
                        'try{if(node.getMediaPath&&node.getMediaPath()===path)return node;}catch(e){}' +
                        'try{for(var i=0;i<node.children.numItems;i++){var f=_findByPath(path,node.children[i]);if(f)return f;}}catch(e2){}' +
                        'return null;}' +

                    // ── helper: copy ALL component params from test data onto a clip ──
                    // Iterates existing components on the new clip and sets params from test data
                    'function _applyComps(newClip,compsData){' +
                        'var log=[];' +
                        'try{for(var ci=0;ci<newClip.components.numItems;ci++){' +
                            'var co=newClip.components[ci];' +
                            // Find matching component in test data
                            'var srcCo=null;' +
                            'for(var di=0;di<compsData.length;di++){if(compsData[di].name===co.displayName){srcCo=compsData[di];break;}}' +
                            'if(!srcCo)continue;' +
                            // Set each param
                            'for(var pi=0;pi<co.properties.numItems;pi++){' +
                                'var pp=co.properties[pi];' +
                                'var srcP=null;' +
                                'for(var dpi=0;dpi<srcCo.params.length;dpi++){if(srcCo.params[dpi].name===pp.displayName){srcP=srcCo.params[dpi];break;}}' +
                                'if(!srcP)continue;' +
                                'try{pp.setValue(srcP.val,true);}catch(e){}' +
                            '}' +
                            'log.push(co.displayName);' +
                        '}}catch(e){log.push("err:"+e.message);}' +
                        'return log.join(",");}' +

                    'var _t0=new Time();_t0.ticks="0";' +

                    'for(var _chi=0;_chi<_chaps.length;_chi++){' +
                        'var _chap=_chaps[_chi];var _step="find";' +
                        'try{' +

                            // 1. Find chapter ProjectItem
                            'var _chapItem=_findByPath(_chap.path);' +
                            'if(!_chapItem){_OUT.push("SKIP-notfound:"+_chap.name);continue;}' +
                            // Skip if a sequence with this name already exists
                            'var _seqNameCheck=_chap.name.replace(/\\.mp4$|\\.mov$/i,"");' +
                            'var _alreadyExists=false;' +
                            'for(var _aei=0;_aei<app.project.sequences.numSequences;_aei++){try{var _aes=app.project.sequences[_aei];if(_aes&&_aes.name===_seqNameCheck){_alreadyExists=true;break;}}catch(e){}}' +
                            'if(_alreadyExists){_OUT.push("SKIP-exists:"+_seqNameCheck);continue;}' +

                            // 2. Try to reset corrupted in/out, then read TRUE srcDur
                            '_step="srcDur";' +
                            // Attempt to clear any previously-set in/out (PP 27 may or may not have these methods)
                            'try{_chapItem.clearInPoint(1);}catch(e){}' +
                            'try{_chapItem.clearOutPoint(1);}catch(e){}' +
                            'var _srcDur=0;' +
                            'try{_srcDur=parseFloat(_chapItem.getOutPoint().ticks)-parseFloat(_chapItem.getInPoint().ticks);}catch(e){}' +
                            'var _4H=254016000000*14400;' + // 4 hours sanity ceiling
                            'if(_srcDur<=0||_srcDur>_4H){' +
                                '_OUT.push("SKIP-corrupt:"+_chap.name+" — Clear in/out: Project panel → right-click → Modify → Interpret Footage or press D/G in Source Monitor");' +
                                'continue;' +
                            '}' +
                            'var _chapOutT=_srcDur-_cutET;' +
                            'if((_chapOutT-_cutST)<=0){_OUT.push("SKIP-tooshort:"+_chap.name);continue;}' +

                            // 3. Reset in-point ONLY to 0 so overwriteClip places at seq 0
                            // DO NOT touch outPoint — already confirmed valid above
                            '_step="resetPI";' +
                            'var _piZero=new Time();_piZero.ticks="0";' +
                            'try{_chapItem.setInPoint(_piZero,1);}catch(e){}' +

                            // 4. Clone test sequence and locate the new sequence by ID
                            '_step="clone";' +
                            'var _existIds={};' +
                            'for(var _ei=0;_ei<app.project.sequences.numSequences;_ei++){' +
                                'try{var _es=app.project.sequences[_ei];if(_es&&_es.sequenceID)_existIds[_es.sequenceID]=1;}catch(e){}}' +
                            'for(var _ei2=1;_ei2<=app.project.sequences.numSequences;_ei2++){' +
                                'try{var _es2=app.project.sequences[_ei2];if(_es2&&_es2.sequenceID)_existIds[_es2.sequenceID]=1;}catch(e){}}' +
                            '_testSeq.clone();$.sleep(500);' +
                            'var _newSeq=null;' +
                            'for(var _fi=app.project.sequences.numSequences-1;_fi>=0;_fi--){' +
                                'try{var _fs=app.project.sequences[_fi];' +
                                'if(_fs&&_fs.sequenceID&&!_existIds[_fs.sequenceID]){_newSeq=_fs;break;}}catch(e){}}' +
                            'if(!_newSeq)for(var _fi2=app.project.sequences.numSequences;_fi2>=1;_fi2--){' +
                                'try{var _fs2=app.project.sequences[_fi2];' +
                                'if(_fs2&&_fs2.sequenceID&&!_existIds[_fs2.sequenceID]){_newSeq=_fs2;break;}}catch(e){}}' +
                            'if(!_newSeq)throw new Error("clone not found");' +

                            // 5. Rename
                            '_step="rename";' +
                            'var _seqName=_chap.name.replace(/\\.mp4$|\\.mov$/i,"");' +
                            'try{_newSeq.name=_seqName;}catch(e){}' +
                            'try{_newSeq.projectItem.name=_seqName;}catch(e){}' +
                            '_OUT.push("seq:"+_seqName);' +

                            // 6. For each CHAPTER track: clear clips, place chapter, copy all comps
                            '_step="replace";' +
                            'var _placed=0;' +
                            'for(var _ti=0;_ti<_tracks.length;_ti++){' +
                                'var _td=_tracks[_ti];' +
                                'if(!_td.isChapter)continue;' + // skip background / Intro-Outro tracks
                                'var _tk=null;' +
                                'try{_tk=(_td.type==="video")?_newSeq.videoTracks[_td.idx]:_newSeq.audioTracks[_td.idx];}catch(e){}' +
                                'if(!_tk){_OUT.push("notrk:"+_td.type+_td.idx);continue;}' +

                                // Clear all existing clips (last→first, handle 0- and 1-indexed)
                                'var _nc=_tk.clips.numItems;' +
                                'for(var _ri=_nc-1;_ri>=0;_ri--){try{_tk.clips[_ri].remove(false,false);}catch(e){}}' +
                                'for(var _ri2=_tk.clips.numItems;_ri2>=1;_ri2--){try{_tk.clips[_ri2].remove(false,false);}catch(e){}}' +

                                // Place chapter clip at sequence time 0
                                'try{_tk.overwriteClip(_chapItem,_t0);}catch(owe){_OUT.push("ow-err:"+_td.type+_td.idx+":"+owe.message);continue;}' +
                                '_placed++;' +

                                // Trim placed clip: set source in-point (start cut) + source out-point / seq end (end cut)
                                'var _pc=_tk.clips[0];if(!_pc)_pc=_tk.clips[1];' +
                                'if(_pc){' +
                                    // Trim start: advance source in-point
                                    'var _pcIn=new Time();_pcIn.ticks=String(_cutST);' +
                                    'try{_pc.inPoint=_pcIn;}catch(e){}' +
                                    // Trim end A: set source out-point
                                    'var _pcOut=new Time();_pcOut.ticks=String(_chapOutT);' +
                                    'var _eA="?";try{_pc.outPoint=_pcOut;_eA="ok";}catch(eA){_eA="fail:"+eA.message;}' +
                                    // Trim end B: set sequence end position
                                    'var _desiredDur=_srcDur-_cutST-_cutET;' +
                                    'var _pcEnd=new Time();_pcEnd.ticks=String(_desiredDur);' +
                                    'var _eB="?";try{_pc.end=_pcEnd;_eB="ok";}catch(eB){_eB="fail:"+eB.message;}' +
                                    '_OUT.push("trim:in="+(parseFloat(_cutST)/254016000000).toFixed(2)+"s|outA="+_eA+"|endB="+_eB+"|dur="+(parseFloat(_desiredDur)/254016000000).toFixed(2)+"s");' +
                                '}' +

                                // Copy ALL component params from test data (Motion, Crop, Opacity, plugins, etc.)
                                'if(_td.clips.length>0){' +
                                    'var _clip=_tk.clips[0];if(!_clip)_clip=_tk.clips[1];' +
                                    'if(_clip&&_td.clips[0].comps&&_td.clips[0].comps.length>0){' +
                                        'var _compsSet=_applyComps(_clip,_td.clips[0].comps);' +
                                        '_OUT.push(_td.type[0].toUpperCase()+_td.idx+":comps=["+_compsSet+"]");' +
                                    '}' +
                                '}' +
                            '}' +

                            // 7. Unlink all clips so tracks can be edited independently
                            '_step="unlink";' +
                            'try{' +
                                'for(var _ulvi=0;_ulvi<_newSeq.videoTracks.numTracks;_ulvi++){' +
                                    'var _ulvt=_newSeq.videoTracks[_ulvi];' +
                                    'for(var _ulvc=0;_ulvc<_ulvt.clips.numItems;_ulvc++){' +
                                        'try{_ulvt.clips[_ulvc].unlinkAll();}catch(e){' +
                                        'try{_ulvt.clips[_ulvc].linked=false;}catch(e2){}}' +
                                    '}' +
                                '}' +
                                'for(var _ulai=0;_ulai<_newSeq.audioTracks.numTracks;_ulai++){' +
                                    'var _ulat=_newSeq.audioTracks[_ulai];' +
                                    'for(var _ulac=0;_ulac<_ulat.clips.numItems;_ulac++){' +
                                        'try{_ulat.clips[_ulac].unlinkAll();}catch(e){' +
                                        'try{_ulat.clips[_ulac].linked=false;}catch(e2){}}' +
                                    '}' +
                                '}' +
                            '}catch(e){_OUT.push("unlink-err:"+e.message);}' +

                            // 8. Clear V1 (videoTracks[0]) — will receive the background
                            '_step="clearV1";' +
                            'try{' +
                                'var _v1trk=_newSeq.videoTracks[0];' +
                                'var _v1n=_v1trk.clips.numItems;' +
                                'for(var _v1ri=_v1n-1;_v1ri>=0;_v1ri--){try{_v1trk.clips[_v1ri].remove(false,false);}catch(e){}}' +
                                'for(var _v1ri2=_v1trk.clips.numItems;_v1ri2>=1;_v1ri2--){try{_v1trk.clips[_v1ri2].remove(false,false);}catch(e){}}' +
                            '}catch(e){_OUT.push("clearV1-err:"+e.message);}' +

                            // 9. Place Intro-Outro at chapter end (before clearing A2/A3 so auto-route goes there and is then cleaned)
                            '_step="placeIO";' +
                            'if(_ioPath){' +
                                'try{' +
                                    'var _ioItem=_findByPath(_ioPath);' +
                                    'if(!_ioItem){' +
                                        'try{app.project.importFiles([_ioPath],true,app.project.rootItem,false);}catch(e){}' +
                                        '_ioItem=_findByPath(_ioPath);' +
                                    '}' +
                                    'if(_ioItem){' +
                                        'var _ioSeqT=new Time();_ioSeqT.ticks=String(Math.round(_srcDur-_cutST-_cutET));' +
                                        'for(var _ioti=0;_ioti<_tracks.length;_ioti++){' +
                                            'var _iotd=_tracks[_ioti];' +
                                            'if(!_iotd.isChapter)continue;' +
                                            'var _iotrk=null;' +
                                            'try{_iotrk=(_iotd.type==="video")?_newSeq.videoTracks[_iotd.idx]:_newSeq.audioTracks[_iotd.idx];}catch(e){}' +
                                            'if(_iotrk){try{_iotrk.overwriteClip(_ioItem,_ioSeqT);}catch(e){}}' +
                                        '}' +
                                        '_OUT.push("IO:OK");' +
                                    '}else{_OUT.push("IO:item-not-found");}' +
                                '}catch(e){_OUT.push("IO-ERR:"+e.message);}' +
                            '}' +

                            // 10. Clear A2 (audioTracks[1]) and A3 (audioTracks[2])
                            //     Removes auto-routed audio from chapter MP4 and IO clip placements on video tracks
                            '_step="clearA23";' +
                            'for(var _a23i=1;_a23i<=2;_a23i++){' +
                                'try{' +
                                    'var _a23trk=_newSeq.audioTracks[_a23i];' +
                                    'var _a23n=_a23trk.clips.numItems;' +
                                    'for(var _a23ri=_a23n-1;_a23ri>=0;_a23ri--){try{_a23trk.clips[_a23ri].remove(false,false);}catch(e){}}' +
                                    'for(var _a23ri2=_a23trk.clips.numItems;_a23ri2>=1;_a23ri2--){try{_a23trk.clips[_a23ri2].remove(false,false);}catch(e){}}' +
                                '}catch(e){_OUT.push("clearA"+(_a23i+1)+"-err:"+e.message);}' +
                            '}' +

                            // 11. Place background on V1
                            '_step="placeBg";' +
                            'if(_bgPath){' +
                                'try{' +
                                    'var _bgItem=_findByPath(_bgPath);' +
                                    'if(!_bgItem){' +
                                        'try{app.project.importFiles([_bgPath],true,app.project.rootItem,false);}catch(e){}' +
                                        '_bgItem=_findByPath(_bgPath);' +
                                    '}' +
                                    'if(_bgItem){' +
                                        'var _seqEndT=parseFloat(_newSeq.end.ticks);' +
                                        'var _bgDurT=new Time();_bgDurT.ticks=String(_seqEndT);' +
                                        // type=1 (clip time) — type=0 resets still images to 1 frame
                                        'try{_bgItem.setOutPoint(_bgDurT,1);}catch(e){_OUT.push("bg-setOP-err:"+e.message);}' +
                                        '_newSeq.videoTracks[0].overwriteClip(_bgItem,_t0);' +
                                        'try{var _bgC=_newSeq.videoTracks[0].clips[0];if(!_bgC)_bgC=_newSeq.videoTracks[0].clips[1];' +
                                            'if(_bgC){_OUT.push("bg-dur:"+Math.round(parseFloat(_bgC.end.ticks)/254016000000)+"s/target:"+Math.round(_seqEndT/254016000000)+"s");}}catch(e){}' +
                                        '_OUT.push("bg:OK");' +
                                    '}else{_OUT.push("bg:item-not-found");}' +
                                '}catch(e){_OUT.push("bgERR:"+e.message);}' +
                            '}else{_OUT.push("bg:no-path");}' +

                            // Mute all audio tracks except the first (index 0)
                            'for(var _muteI=1;_muteI<_newSeq.audioTracks.numTracks;_muteI++){' +
                                'try{_newSeq.audioTracks[_muteI].setMute(1);}catch(e){}' +
                            '}' +

                            '_OUT.push("OK:"+_seqName+"/placed="+_placed);' +

                        '}catch(_err){_OUT.push("ERR["+_step+"]:"+_chap.name+":"+_err.message);}' +
                    '}' +

                    '}catch(_top){_OUT.push("FATAL:"+_top.message);}' +
                    '_OUT.join("|");';

                window.__adobe_cep__.evalScript(jsx3, function (res3) {
                    lwBtn.disabled = false;
                    var lines = (res3 || '').split('|');
                    var ok  = lines.filter(function(l){ return l.indexOf('OK') === 0; }).length;
                    var err = lines.filter(function(l){ return l.indexOf('SKIP') === 0 || l.indexOf('ERR') === 0; }).length;
                    try {
                        var _logPath = cep.fs.getHomePath() + '/Desktop/lw_log.txt';
                        cep.fs.writeFile(_logPath, lines.join('\n'), cep.encoding.UTF8);
                    } catch(logE) {
                        try { cep.fs.writeFile('/Users/raulmartinez/Desktop/lw_log.txt', lines.join('\n'), cep.encoding.UTF8); } catch(e2) {}
                    }
                    lwLog('Listo: ' + ok + ' secuencias creadas, ' + err + ' omitidas.<br><small>' + lines.join('<br>') + '</small>');
                });
            });
        });
    });

    // ── Apply Plugin dx ──────────────────────────────────────────────────────
    var lwBtnPluginDx = document.getElementById('lwBtnPluginDx');
    if (lwBtnPluginDx) {
        lwBtnPluginDx.addEventListener('click', function () {
            lwBtnPluginDx.disabled = true;
            lwLog('Leyendo plugins de audio del test...');

            // Phase 1: capture audio comps from active test sequence
            var jsx1 =
                'var _r={ok:false,err:"",audioTracks:[]};' +
                'try{' +
                    'var _sq=app.project.activeSequence;' +
                    'if(!_sq)throw new Error("No hay secuencia activa");' +
                    'function _readComps(clip){' +
                        'var out=[];' +
                        'try{for(var i=0;i<clip.components.numItems;i++){' +
                            'var co=clip.components[i];' +
                            'var coInfo={name:co.displayName,params:[]};' +
                            'try{for(var j=0;j<co.properties.numItems;j++){' +
                                'var pp=co.properties[j];' +
                                'try{coInfo.params.push({name:pp.displayName,val:pp.getValue()});}catch(e){}' +
                            '}}catch(e){}' +
                            'out.push(coInfo);' +
                        '}}catch(e){}' +
                        'return out;}' +
                    'for(var _ati=0;_ati<_sq.audioTracks.numTracks;_ati++){' +
                        'var _at=_sq.audioTracks[_ati];' +
                        'if(_at.clips.numItems===0)continue;' +
                        'var _ac=_at.clips[0];if(!_ac)_ac=_at.clips[1];' +
                        'if(!_ac)continue;' +
                        '_r.audioTracks.push({idx:_ati,comps:_readComps(_ac)});' +
                    '}' +
                    '_r.ok=true;' +
                '}catch(e){_r.err=e.message;}' +
                'JSON.stringify(_r);';

            window.__adobe_cep__.evalScript(jsx1, function (res1) {
                var data;
                try { data = JSON.parse(res1); } catch(e) { lwLog('Error JSON: ' + res1); lwBtnPluginDx.disabled = false; return; }
                if (!data.ok) { lwLog('Error capturando plugins: ' + data.err); lwBtnPluginDx.disabled = false; return; }
                if (!data.audioTracks.length) { lwLog('No se encontraron pistas de audio en la secuencia test.'); lwBtnPluginDx.disabled = false; return; }
                lwLog('Audio tracks capturados: ' + data.audioTracks.length + '. Aplicando a capítulos...');

                // Phase 2: apply to all chapter sequences
                var jsx2 =
                    'var _OUT=[];' +
                    'var _audioTracks=' + JSON.stringify(data.audioTracks) + ';' +
                    'function _applyComps(newClip,compsData){' +
                        'var log=[];' +
                        'try{for(var ci=0;ci<newClip.components.numItems;ci++){' +
                            'var co=newClip.components[ci];' +
                            'var srcCo=null;' +
                            'for(var di=0;di<compsData.length;di++){if(compsData[di].name===co.displayName){srcCo=compsData[di];break;}}' +
                            'if(!srcCo)continue;' +
                            'for(var pi=0;pi<co.properties.numItems;pi++){' +
                                'var pp=co.properties[pi];' +
                                'var srcP=null;' +
                                'for(var dpi=0;dpi<srcCo.params.length;dpi++){if(srcCo.params[dpi].name===pp.displayName){srcP=srcCo.params[dpi];break;}}' +
                                'if(!srcP)continue;' +
                                'try{pp.setValue(srcP.val,true);}catch(e){}' +
                            '}' +
                            'log.push(co.displayName);' +
                        '}}catch(e){log.push("err:"+e.message);}' +
                        'return log.join(",");}' +
                    'function _skip(n){var nl=n.toLowerCase();return nl==="test"||nl.indexOf("test")===0||nl.indexOf("nested sequence")===0||n.indexOf("PREVIEW")>=0;}' +
                    'for(var _si=0;_si<app.project.sequences.numSequences;_si++){' +
                        'try{' +
                            'var _seq=app.project.sequences[_si];' +
                            'if(!_seq||_skip(_seq.name))continue;' +
                            'var _applied=[];' +
                            'for(var _ti=0;_ti<_audioTracks.length;_ti++){' +
                                'var _td=_audioTracks[_ti];' +
                                'if(!_td.comps||_td.comps.length===0)continue;' +
                                'var _tk=null;' +
                                'try{_tk=_seq.audioTracks[_td.idx];}catch(e){}' +
                                'if(!_tk||_tk.clips.numItems===0)continue;' +
                                'var _ac=_tk.clips[0];if(!_ac)_ac=_tk.clips[1];' +
                                'if(!_ac)continue;' +
                                'var _res=_applyComps(_ac,_td.comps);' +
                                '_applied.push("A"+_td.idx+":["+_res+"]");' +
                            '}' +
                            'if(_applied.length)_OUT.push(_seq.name+": "+_applied.join(" "));' +
                        '}catch(e){_OUT.push("err-seq:"+e.message);}' +
                    '}' +
                    '_OUT.join("|");';

                window.__adobe_cep__.evalScript(jsx2, function (res2) {
                    lwBtnPluginDx.disabled = false;
                    var lines = (res2 || '').split('|').filter(function(l){ return l.trim(); });
                    lwLog('Plugin dx aplicado a ' + lines.length + ' secuencias.<br><small>' + lines.join('<br>') + '</small>');
                });
            });
        });
    }

    // ── Preview export list ──────────────────────────────────────────────────
    var lwBtnPreview = document.getElementById('lwBtnPreview');
    if (lwBtnPreview) {
        lwBtnPreview.addEventListener('click', function () {
            lwBtnPreview.disabled = true;
            var jsx =
                'var _r=[];' +
                'try{' +
                    'var ss=app.project.sequences;' +
                    'var _seen={};var _found=[];var _skipped=[];' +
                    'function _skip(n){var nl=n.toLowerCase();return n==="test"||nl.indexOf("test")===0||nl.indexOf("nested sequence")===0;}' +
                    '_r.push("total-seqs:"+ss.numSequences);' +
                    'for(var i=0;i<ss.numSequences;i++){' +
                        'try{var s=ss[i];if(!s||!s.name||!s.sequenceID){_skipped.push("["+i+"] null/no-id");continue;}' +
                        'if(_skip(s.name)){_skipped.push("["+i+"] SKIP:"+s.name);continue;}' +
                        'if(_seen[s.sequenceID]){_skipped.push("["+i+"] DUP:"+s.name);continue;}' +
                        '_seen[s.sequenceID]=1;_found.push(s.name);}catch(e){_skipped.push("["+i+"] ERR:"+e.message);}' +
                    '}' +
                    '_found.sort(function(a,b){var na=parseInt(a)||0,nb=parseInt(b)||0;return na!==nb?na-nb:a.localeCompare(b);});' +
                    '_r.push("Secuencias a exportar ("+_found.length+"):");' +
                    'for(var k=0;k<_found.length;k++){_r.push((k+1)+". "+_found[k]);}' +
                    'if(_skipped.length){_r.push("---OMITIDAS("+_skipped.length+"):");for(var sk=0;sk<_skipped.length;sk++){_r.push(_skipped[sk]);}}' +
                '}catch(e){_r.push("ERROR: "+e.message);}' +
                '_r.join("|")';
            window.__adobe_cep__.evalScript(jsx, function (res) {
                lwBtnPreview.disabled = false;
                lwLog((res || 'sin respuesta').replace(/\|/g, '<br>'));
            });
        });
    }

    // ── Export dir picker for LW section ─────────────────────────────────────
    var lwExportDir = '';
    var lwDirInfo = document.getElementById('lwDirInfo');
    try { var _lsLwDir = localStorage.getItem('lw_export_dir'); if (_lsLwDir) { lwExportDir = _lsLwDir; if (lwDirInfo) lwDirInfo.textContent = _lsLwDir.split('/').pop() || _lsLwDir; } } catch(e) {}
    var _lwHomeDir = (function(){ try { return require('os').homedir(); } catch(e){ return '/Users/raulmartinez'; } })();
    var lwBtnDir = document.getElementById('lwBtnDir');
    if (lwBtnDir) {
        lwBtnDir.addEventListener('click', function () {
            try {
                var _dlg = cep.fs.showOpenDialog(false, true, 'Carpeta de destino para los MP4', lwExportDir || (_lwHomeDir + '/Desktop'), null);
                if (_dlg && _dlg.err === 0 && _dlg.data && _dlg.data[0]) {
                    var _raw = _dlg.data[0];
                    // CEP returns file:// URI — convert to plain path
                    if (_raw.indexOf('file://') === 0) { _raw = _raw.slice('file://'.length); }
                    _raw = decodeURIComponent(_raw).replace(/\/+$/, ''); // decode + strip trailing slashes
                    lwExportDir = _raw;
                    if (lwDirInfo) lwDirInfo.textContent = lwExportDir.split('/').pop() || lwExportDir;
                    try { localStorage.setItem('lw_export_dir', lwExportDir); } catch(e) {}
                }
            } catch (_de) { lwLog('Error abriendo selector de carpeta: ' + _de.message); }
        });
    }

    // ── Send to AME ──────────────────────────────────────────────────────────
    var lwBtnAME = document.getElementById('lwBtnAME');
    var LW_PRESET = '/Users/raulmartinez/Desktop/chess.com/Chessable Vimeo Export.epr';
    if (lwBtnAME) {
        lwBtnAME.addEventListener('click', function () {
            if (!lwExportDir) { lwLog('AME: primero selecciona la carpeta de destino (botón Carpeta...).'); return; }
            var exportDir = lwExportDir;
            lwBtnAME.disabled = true;
            lwLog('AME: enviando a Media Encoder...');
            var dirEsc = exportDir.replace(/\\/g, '/').replace(/"/g, '\\"');
            var preEsc = LW_PRESET.replace(/"/g, '\\"');
            var jsx =
                'var _r=[];' +
                'try{' +
                    // Diagnostic: PP version and encoder availability
                    '_r.push("PP:"+app.version);' +
                    '_r.push("enc-type:"+(typeof app.encoder));' +
                    'try{_r.push("enc-bind:"+(typeof app.encoder.bind));}catch(ed){_r.push("enc-bind-err:"+ed.message);}' +
                    'try{_r.push("enc-encSeq:"+(typeof app.encoder.encodeSequence));}catch(ed2){_r.push("enc-encSeq-err:"+ed2.message);}' +
                    'var p="' + preEsc + '";' +
                    'var d="' + dirEsc + '";' +
                    'var _pf=new File(p);' +
                    '_r.push("preset-exists:"+_pf.exists);' +
                    'if(!_pf.exists){_r.push("FATAL:preset no encontrado");}else{' +
                    'try{app.encoder.bind();}catch(_b){_r.push("bind-err:"+_b.message);}' +
                    'var ss=app.project.sequences;' +
                    'var _seen={};var _all=[];' +
                    'for(var i=0;i<ss.numSequences;i++){try{var s=ss[i];if(s&&s.sequenceID&&!_seen[s.sequenceID]){_seen[s.sequenceID]=1;_all.push(s);}}catch(e){}}' +
                    'for(var i2=1;i2<=ss.numSequences;i2++){try{var s2=ss[i2];if(s2&&s2.sequenceID&&!_seen[s2.sequenceID]){_seen[s2.sequenceID]=1;_all.push(s2);}}catch(e){}}' +
                    '_r.push("seqs-found:"+_all.length);' +
                    'for(var k=0;k<_all.length;k++){' +
                        'var sq=_all[k];var sn=sq.name||"";' +
                        'if(!sn||sn==="test"||sn.toLowerCase().indexOf("test")===0)continue;' +
                        'if(sn.toLowerCase().indexOf("nested sequence")===0)continue;' +
                        'var out=d+"/"+sn+".mp4";' +
                        'var _ok=false;' +
                        'try{app.encoder.encodeSequence(sq,out,p,0,0);_ok=true;}catch(_e1){' +
                            '_r.push("enc-err:"+sn+":"+_e1.message);' +
                        '}' +
                        'if(_ok)_r.push("q:"+sn);' +
                    '}' +
                    '}' +
                '}catch(e){_r.push("FATAL:"+e.message);}' +
                '_r.join("|")';
            window.__adobe_cep__.evalScript(jsx, function (res) {
                lwBtnAME.disabled = false;
                var lines = (res || 'sin-respuesta').split('|');
                var queued = lines.filter(function(l){ return l.indexOf('q:') === 0; }).length;
                lwLog('AME resultado (' + queued + ' en cola):<br><small>' + lines.join('<br>') + '</small>');
            });
        });
    }
})();

/* ── PP26 AI Diagnostic ─────────────────────────────────────────────────── */
(function () {
    var btn = document.getElementById('btnPP26Diag');
    var out = document.getElementById('pp26DiagOut');
    if (!btn) return;
    btn.addEventListener('click', function () {
        btn.disabled = true;
        btn.textContent = 'Running...';
        out.style.display = 'none';
        var jsx =
            'var _r=[];' +
            '_r.push("PP version: "+app.version);' +
            'var _seq=app.project.activeSequence;' +
            'if(!_seq){_r.push("ERROR: no active sequence");}else{' +
                'var _cl=null;' +
                'for(var _ti=0;_ti<_seq.videoTracks.numTracks&&!_cl;_ti++){' +
                    'var _tr=_seq.videoTracks[_ti];' +
                    'for(var _ci=0;_ci<_tr.clips.numItems&&!_cl;_ci++){' +
                        'var _cand=_tr.clips[_ci];' +
                        'if(_cand.projectItem){try{var _mp=_cand.projectItem.getMediaPath();if(_mp&&/\\.mp4$|\\.mov$|\\.avi$|\\.mxf$/i.test(_mp))_cl=_cand;}catch(_mpe){}}' +
                    '}' +
                '}' +
                'if(!_cl){for(var _ti2=0;_ti2<_seq.videoTracks.numTracks&&!_cl;_ti2++){var _tr2=_seq.videoTracks[_ti2];for(var _ci2b=0;_ci2b<_tr2.clips.numItems&&!_cl;_ci2b++){if(_tr2.clips[_ci2b].projectItem)_cl=_tr2.clips[_ci2b];}}}' +
                'if(_cl){' +
                    '_r.push("Clip: "+_cl.projectItem.name);' +
                    'var _aiM=["removeBackground","aiBackground","backgroundRemoval","trackSubject","trackMask","aiMask","aiTracking","objectTracking","subjectSelect","maskWithAI","applyAIEffect"];' +
                    'for(var _i=0;_i<_aiM.length;_i++){try{_r.push("clip."+_aiM[_i]+"="+typeof _cl[_aiM[_i]]);}catch(_e){}}' +
                    'try{' +
                        '_r.push("\\n-- Components ("+_cl.components.numItems+"):");' +
                        'for(var _ci2=0;_ci2<_cl.components.numItems;_ci2++){' +
                            'var _c=_cl.components[_ci2];_r.push("  "+_c.displayName);' +
                            'try{for(var _pi=0;_pi<_c.properties.numItems;_pi++){' +
                                'var _p=_c.properties[_pi];' +
                                'if(/ai|mask|track|background|subject|remove/i.test(_p.displayName))_r.push("    param: "+_p.displayName);' +
                            '}}catch(_pe){}' +
                        '}' +
                    '}catch(_ce){_r.push("components err: "+_ce.message);}' +
                '}else{_r.push("No clip found in sequence");}' +
                'try{' +
                    'var _qe=qeApp;var _qeM=["removeBackground","aiTracking","trackSubject","maskWithAI","subjectSelect","backgroundRemoval","objectTracking"];' +
                    '_r.push("\\n-- qeApp:");' +
                    'for(var _qi=0;_qi<_qeM.length;_qi++){try{_r.push("  qeApp."+_qeM[_qi]+"="+typeof _qe[_qeM[_qi]]);}catch(_qe2){}}' +
                    'var _qseq=qeApp.getActiveSequence();' +
                    'var _qcl=_qseq.getVideoTrackAt(0).getItemAt(0);' +
                    '_r.push("\\n-- qeClip:");' +
                    'var _qcM=["removeBackground","aiBackground","trackSubject","addEffect","getEffects","applyPreset","maskWithAI","removeBackgroundAI"];' +
                    'for(var _qci=0;_qci<_qcM.length;_qci++){try{_r.push("  qeClip."+_qcM[_qci]+"="+typeof _qcl[_qcM[_qci]]);}catch(_qce){}}' +
                '}catch(_qerr){_r.push("qeApp err: "+_qerr.message);}' +
                'try{var _f=new File(Folder.desktop+"/pp26_ai_diag.txt");_f.open("w");_f.write(_r.join("\\n"));_f.close();_r.push("\\nGuardado en Escritorio: pp26_ai_diag.txt");}catch(_fe){}' +
            '}' +
            '_r.join("\\n");';
        window.__adobe_cep__.evalScript(jsx, function (res) {
            btn.disabled = false;
            btn.textContent = '🔍 Run diagnostic';
            out.textContent = res || '(sin resultado)';
            out.style.display = 'block';
        });
    });
})();

})(); // end panel IIFE
