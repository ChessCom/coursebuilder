/* Course Builder Panel v110.20 — https://github.com/raulmartinezchessable/course-builder */
(function () {

/* ── Build HTML ──────────────────────────────────────────────────────────── */
document.getElementById('app').innerHTML = [
    '<header>',
    '  <h1>Course Builder <span id="versionTag">v110.20</span></h1>',
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
    '<div class="tool-divider">AutoTrim <span class="tool-ver">v6</span></div>',
    '<div class="section">',
    '  <button class="btn-at" id="btnAt">&#9654; AutoTrim (clap + speech)</button>',
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
    '<div class="tool-divider">Color Code <span class="tool-ver">v1</span></div>',
    '<div class="section">',
    '  <button class="btn-run" id="btnColorCode">&#9654; Color Code Project</button>',
    '  <div class="status" id="ccStatus"></div>',
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
var GH_BASE = 'https://raw.githubusercontent.com/raulmartinezchessable/course-builder/main/';
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
   AutoTrim
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

function runAutoTrim() {
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
    log('[AutoTrim JS v6b | panel v110.20]');
    function done(msg, isErr) {
        btnAt.disabled = false; btnAt.textContent = '▶ AutoTrim (clap + speech)';
        atStatus.textContent = msg; atStatus.className = isErr ? 'status error' : 'status done';
    }

    downloadPy('claptrim.py', function (pyPath) {
        btnAt.textContent    = '⏳ Reading sequence…';
        atStatus.textContent = 'AutoTrim: getting clips…';

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
            atStatus.textContent = 'AutoTrim: detecting clap and speech end…';

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
                done(code === 0 ? 'AutoTrim completed.' : 'Finished with code ' + code, code !== 0);
            });
            proc.on('error', function (err) { done('ERROR python3: ' + err.message, true); });
        });
    }, function (err) {
        done('ERROR downloading claptrim.py: ' + err, true);
    });
}

document.getElementById('btnAt').addEventListener('click', runAutoTrim);

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

/* ── Color Code ──────────────────────────────────────────────────────────── */
document.getElementById('btnColorCode').addEventListener('click', function () {
    var logEl = document.getElementById('log'), ccStatus = document.getElementById('ccStatus');
    var btn   = document.getElementById('btnColorCode');
    btn.disabled = true; ccStatus.textContent = 'Coloring…'; ccStatus.className = 'status';

    safeEvalScript(
        '(function(){' +
            'var SEQ_COL=16,CAM_COL=5;var BIN_COLS=[8,3,7,6,12,4,14,11];' +
            'var seqCount=0,camCount=0,binCount=0;' +
            'function colorSeqs(item){if(!item.children)return;' +
                'for(var i=0;i<item.children.numItems;i++){var c=item.children[i];' +
                    'if(c.type===2){colorSeqs(c);continue;}var nm=c.name;' +
                    'var isWC=(nm.length>=7&&nm.substr(0,7)==="webcam_");' +
                    'try{c.label=isWC?CAM_COL:SEQ_COL;if(isWC)camCount++;else seqCount++;}catch(e){}}}' +
            'colorSeqs(app.project.rootItem);' +
            'function findBin(parent,name){if(!parent.children)return null;' +
                'for(var i=0;i<parent.children.numItems;i++){var c=parent.children[i];' +
                    'if(c.type===2&&c.name===name)return c;' +
                    'if(c.type===2){var r=findBin(c,name);if(r)return r;}}return null;}' +
            'var course=findBin(app.project.rootItem,"03_Course");' +
            'if(course){for(var i=0;i<course.children.numItems;i++){var child=course.children[i];' +
                'if(child.type===2){try{child.label=BIN_COLS[binCount%BIN_COLS.length];binCount++;}catch(e){}}}}' +
            'return "ok: seqs="+seqCount+" webcam="+camCount+" bins="+binCount+(course?"":" (03_Course not found)");' +
        '})()',
        function (res) {
            btn.disabled = false;
            var ok = res && res.indexOf('ok:') === 0;
            ccStatus.textContent = ok ? res : ('ERROR: ' + res);
            ccStatus.className   = 'status ' + (ok ? 'success' : 'error');
            logEl.textContent    = '[ColorCode]\n' + res + '\n';
            logEl.scrollTop      = logEl.scrollHeight;
        }
    );
});

})(); // end panel IIFE
