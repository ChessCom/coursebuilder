/**
 * Course Builder v106 – Premiere Pro ExtendScript
 *
 * ── CHANGELOG ────────────────────────────────────────────────────────────────
 *
 * v26  (base)
 *   - Direct mode: UltraKey + Lumetri effects applied by script clip by clip.
 *   - Creates per-chapter sequences by cloning "void" (avoids PP dialog).
 *   - Places video on V1 (webcam), board on V3, BG image on V4.
 *
 * v27  Webcam nested sequence
 *   - V2 now uses nested sequences: for each video the "webcam" sequence
 *     (which already has UltraKey + Lumetri/HSL applied) is cloned and its
 *     internal clip is replaced with the chapter video.
 *   - Falls back to direct mode if no "webcam" sequence exists in the project.
 *   - Clones are placed in a "NestedSeq" bin inside each chapter bin.
 *
 * v40  External WAV support
 *   - If a .wav with the same base name exists next to the video, it is
 *     imported and placed on A1 (overwriteClip), replacing the mp4 linked audio.
 *   - The mp4 linked audio on A2+ is detected and removed to avoid duplicates.
 *
 * v48  Automatic audio offset detection
 *   - Reads the offset of the first audio clip in the "webcam" sequence to
 *     sync the WAV to the same point as the template, eliminating the need
 *     to configure AUDIO_OFFSET_SEC manually.
 *
 * v50  Motion read from template (readTemplateInfo)
 *   - Reads Motion properties (Position, Scale, Rotation…) from the test
 *     clip once at startup and stores them as a plain JS object.
 *   - Applies them to each generated clip via applyMotionSaved().
 *   - Avoids stale clip object references that PP invalidates after cloning.
 *
 * v54  Fix position stuck at 32767 (PP sentinel value)
 *   - scaleMotionVal no longer converts Position from normalized to pixels.
 *     getValue()/setValue() use the same coordinate system (normalized [0,1]).
 *     Converting to pixels before setValue() threw a silent exception and PP
 *     left the position at 32767 (0x7FFF = uninitialized).
 *   - isMotionSentinel() filters out 32767 / 32000 before applying values.
 *
 * v55  Fix multiple video layers in nested clone
 *   - replaceVideoInWebcamClone was removing extra clips on V2+ with a single
 *     remove() call that could fail silently. Now uses a fallback chain:
 *     remove(false,false) → remove() → remove(true,false), with logged result.
 *
 * v56  Fix Motion not applied to outer clip in nested mode
 *   - readTemplateInfo only read v2MotionSaved when the clip had a mediaPath
 *     (direct clip). In nested mode the clip is a sequence with no mediaPath,
 *     so the read was skipped and v2MotionSaved was always empty.
 *   - Guard removed; Motion is now always read from the V2 test clip.
 *   - In buildSequence, nested branch: applyMotionSaved() is now called on
 *     the outer V2 clip in the main sequence (previously only logged, never applied).
 *
 * v57  CEP panel: version label + Test button; WAV fuzzy matching
 *   - CEP: version number shown in the panel title.
 *   - CEP: "Test (1 seq)" button — processes only the first chapter via
 *     $.CB_TEST_ONLY=1 prepended before $.evalFile(), no JSX changes needed.
 *   - findAndAddWav: if the exact .wav is not found, searches the same
 *     directory for any .wav whose name starts with the video base name
 *     (covers suffixes like -001). Second pass: name contains the base name
 *     anywhere (covers prefixed names).
 *
 * v58  Fix WAV fuzzy search never running in nested mode
 *   - replaceVideoInWebcamClone had an if(wavFileC&&wavFileC.exists) guard
 *     before calling findAndAddWav. If the exact WAV did not exist, the
 *     fuzzy search inside findAndAddWav was never reached.
 *   - findAndAddWav is now always called when a base path exists (wavPathC);
 *     its return value (true/false) determines whether the mp4 audio fallback
 *     is used.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 */
(function () {

    /* ── Config ──────────────────────────────────────────────────────── */
    var TEMPLATE_NAME   = 'test2';
    var VOID_SEQ_NAME   = 'void';
    var WEBCAM_SEQ_NAME = 'Nested';
    /* true = modo nested (clonar webcam seq, efectos vía AL interna)
       false = modo directo (clip presentador en V2 con preset + efectos directo) */
    var USE_NESTED      = true;
    var OUTRO_SUBSTR    = 'Intro-Outro (powered by Chessbase)';
    var FADE_IN_SUBSTR  = 'fade_in';
    var FADE_OUT_SUBSTR = 'fade_out';
    var BG_SUBSTR       = 'BG_CHAPTERS';
    var ASSETS_PATH     = (function(){
        /* Auto-detectar buscando BG_CHAPTERS_2025.png en el proyecto.
           Está en <ASSETS_PATH>/Backgrounds/BG_CHAPTERS_2025.png → subir 2 niveles. */
        function findBG(item){
            if(!item) return null;
            if(item.name==='BG_CHAPTERS_2025.png'){
                try{
                    var mp=item.getMediaPath();
                    if(mp&&mp.length>0){
                        var f=new File(mp);
                        return f.parent&&f.parent.parent?f.parent.parent.fsName:null;
                    }
                }catch(e){}
            }
            try{
                if(item.children){
                    for(var ci=0;ci<item.children.numItems;ci++){
                        var r=findBG(item.children[ci]);
                        if(r) return r;
                    }
                }
            }catch(e){}
            return null;
        }
        var detected=findBG(app.project.rootItem);
        return detected||'/Users/raulmartinez/Desktop/chess.com/AI/Video Editing Assets IA';
    })();
    /* Folder names containing any of these substrings (case-insensitive) are
       skipped entirely — useful for "not used", "delete", "old takes", etc.
       Add or remove keywords here as needed. */
    var SKIP_KEYWORDS   = ['delete','not used','not_used','unused','skip','ignore','old take','bad take','descarte'];
    var PRESET_FILENAME  = 'KeyColor_HSL.prfpset';
    var FIX_PY_FILENAME  = 'fix_keycolor.py';
    var LOG_FILE         = Folder.desktop.fsName + '/cb_log.txt';
    /* Offset manual del audio en segundos. 0 = auto-detectar desde "webcam".
       Si el auto no funciona (log muestra "audioOffset: no clips") ponlo aquí.
       Ejemplo: var AUDIO_OFFSET_SEC = 0.1; */
    var AUDIO_OFFSET_SEC = 0;
    var FADE_SEC        = 0.7;
    var VIDEO_EXTS      = ['mp4','mov','avi','mxf','mkv','m4v','wmv','r3d','braw'];
    var MEDIA_EXTS      = VIDEO_EXTS.concat(['png','jpg','jpeg','psd','tiff','tif','bmp']);

    var INTRINSIC_NAMES = { 'Motion':1, 'Opacity':1, 'Time Remapping':1,
                             'Movimiento':1, 'Opacidad':1, 'Reasignación de tiempo':1 };

    /* ── Log ─────────────────────────────────────────────────────────── */
    var LOG = [];
    function log(msg){ LOG.push(String(msg)); $.writeln(String(msg)); }
    function saveLog(){
        try{ var f=new File(LOG_FILE); if(f.open('w')){ f.encoding='UTF-8'; f.write(LOG.join('\n')); f.close(); } }
        catch(e){}
    }

    /* ── Helpers ─────────────────────────────────────────────────────── */
    function cleanName(s){ try{ s=decodeURIComponent(s); }catch(e){ s=s.replace(/%20/g,' '); } return s.replace(/\s+$/,''); }
    function hasExt(f,exts){ if(!(f instanceof File)) return false; var e=f.name.split('.').pop().toLowerCase(); for(var i=0;i<exts.length;i++) if(exts[i]===e) return true; return false; }
    /* Natural (numeric-aware) sort: "Chapter 2" < "Chapter 10" */
    function _natChunks(s){
        var parts=[],re=/(\d+)/g,last=0,m;
        while((m=re.exec(s))!==null){
            if(m.index>last) parts.push({t:s.substring(last,m.index),n:-1});
            parts.push({t:'',n:parseInt(m[0],10)});
            last=m.index+m[0].length;
        }
        if(last<s.length) parts.push({t:s.substring(last),n:-1});
        return parts;
    }
    function sortedByName(arr){
        return arr.sort(function(a,b){
            var na=cleanName(a.name).toLowerCase(), nb=cleanName(b.name).toLowerCase();
            var pa=_natChunks(na), pb=_natChunks(nb);
            for(var i=0;i<Math.min(pa.length,pb.length);i++){
                var ca=pa[i],cb=pb[i];
                var d=(ca.n>=0&&cb.n>=0)?(ca.n-cb.n):ca.t.localeCompare(cb.t);
                if(d!==0) return d;
            }
            return pa.length-pb.length;
        });
    }
    function getVideos(folder){ var all=folder.getFiles(),out=[]; for(var i=0;i<all.length;i++) if(hasExt(all[i],VIDEO_EXTS)) out.push(all[i]); return sortedByName(out); }
    function getOrCreateBin(parent,name){ name=cleanName(name); for(var i=0;i<parent.children.numItems;i++){ var c=parent.children[i]; if(c.name===name&&c.type===ProjectItemType.BIN) return c; } return parent.createBin(name); }
    /* Returns true if a sequence with this exact name already exists in the project */
    function seqExists(name){ for(var _si=0;_si<app.project.sequences.numSequences;_si++){ if(app.project.sequences[_si].name===name) return true; } return false; }
    /* Returns true if the folder name matches any skip keyword */
    function shouldSkipFolder(name){
        var n=name.toLowerCase();
        for(var _ki=0;_ki<SKIP_KEYWORDS.length;_ki++){
            if(n.indexOf(SKIP_KEYWORDS[_ki])>=0) return true;
        }
        return false;
    }
    function makeTime(sec){ var t=new Time(); t.seconds=sec; return t; }

    /* Devuelve true si root contiene EXACTAMENTE una carpeta llamada
       1_Chapters o 1_Capítulos (sin fallback genérico).
       Usado por el auto-detect para no parar antes de tiempo. */
    function hasCandidateChaptersFolder(root){
        var candidates=['1_Chapters','1_Capítulos'];
        for(var i=0;i<candidates.length;i++){
            if(new Folder(root.fsName+'/'+candidates[i]).exists) return true;
        }
        return false;
    }

    /* Busca la carpeta de capítulos dentro de root, en este orden:
       1. 1_Chapters   2. 1_Capítulos   3. cualquier subfolder con vídeos.
       Devuelve la carpeta encontrada o null. */
    function findChaptersFolder(root){
        var candidates=['1_Chapters','1_Capítulos'];
        var i, f;
        for(i=0;i<candidates.length;i++){
            f=new Folder(root.fsName+'/'+candidates[i]);
            if(f.exists) return f;
        }
        /* Fallback: subfolder que contenga al menos un vídeo directamente */
        var subs=root.getFiles(function(x){return x instanceof Folder;});
        for(i=0;i<subs.length;i++){
            if(shouldSkipFolder(subs[i].name)) continue;
            var vids=getVideos(subs[i]);
            if(vids.length>0) return subs[i];
        }
        return null;
    }
    function truncate(s,n){ s=String(s); return s.length>n?s.substr(0,n)+'…':s; }

    /* JSON.stringify polyfill — ExtendScript ES3 puede no tener JSON global */
    function jStr(v){
        if(v===null||v===undefined) return String(v);
        var t=typeof v;
        if(t==='number'||t==='boolean') return String(v);
        if(t==='string') return '"'+v.replace(/\\/g,'\\\\').replace(/"/g,'\\"')+'"';
        if(t==='object'&&typeof v.length==='number'){
            var arr=[];
            for(var _i=0;_i<v.length;_i++) arr.push(jStr(v[_i]));
            return '['+arr.join(',')+']';
        }
        if(t==='object'){
            var obj=[];
            for(var _k in v){ if(v.hasOwnProperty(_k)) obj.push('"'+_k+'":'+jStr(v[_k])); }
            return '{'+obj.join(',')+'}';
        }
        return '"'+String(v)+'"';
    }

    /* ── Import ──────────────────────────────────────────────────────── */
    function importFilesToBin(paths,bin){
        if(!paths.length) return [];
        app.project.importFiles(paths,true,bin,false);
        var out=[];
        for(var j=0;j<bin.children.numItems;j++){ var item=bin.children[j]; if(item.type===ProjectItemType.CLIP) out.push(item); }
        log('    importados: '+out.length);
        return sortedByName(out);
    }

    function importFolderRecursive(folder,bin){
        var all=folder.getFiles(),paths=[],subs=[];
        for(var i=0;i<all.length;i++){
            if(all[i] instanceof File&&hasExt(all[i],MEDIA_EXTS)) paths.push(all[i].fsName);
            if(all[i] instanceof Folder) subs.push(all[i]);
        }
        if(paths.length) app.project.importFiles(paths,true,bin,false);
        for(var j=0;j<subs.length;j++) importFolderRecursive(subs[j],getOrCreateBin(bin,subs[j].name));
    }

    function findByNameSubstr(bin,substr){
        for(var i=0;i<bin.children.numItems;i++){
            var c=bin.children[i];
            if(c.name&&c.name.indexOf(substr)>=0) return c;
            if(c.type===ProjectItemType.BIN){ var f=findByNameSubstr(c,substr); if(f) return f; }
        }
        return null;
    }
    function findSequenceByName(name){ for(var i=0;i<app.project.sequences.numSequences;i++) if(app.project.sequences[i].name===name) return app.project.sequences[i]; return null; }

    /* ── Template ────────────────────────────────────────────────────── */
    function readTemplateInfo(seq){
        var info={bgItem:null,outroItem:null,fadeInItem:null,fadeOutItem:null,
                  v2EffectClip:null,v3EffectClip:null,fadeSec:FADE_SEC,audioOffsetSec:0,
                  v3MotionByName:{}};
        if(!seq) return info;
        var n=seq.videoTracks.numTracks;
        if(n>=1&&seq.videoTracks[0].clips.numItems>0) info.bgItem=seq.videoTracks[0].clips[0].projectItem;
        if(n>=2&&seq.videoTracks[1].clips.numItems>0){
            info.v2EffectClip=seq.videoTracks[1].clips[0];
            var last=seq.videoTracks[1].clips[seq.videoTracks[1].clips.numItems-1];
            if(last.projectItem.name.indexOf(OUTRO_SUBSTR)>=0) info.outroItem=last.projectItem;
        }
        if(n>=3&&seq.videoTracks[2].clips.numItems>0){
            info.v3EffectClip=seq.videoTracks[2].clips[0];
            /* Mapa nombre→Motion para todos los clips de V3 del test */
            var v3t=seq.videoTracks[2];
            for(var tci=0;tci<v3t.clips.numItems;tci++){
                var tc=v3t.clips[tci];
                if(!tc||!tc.projectItem) continue;
                var tName=tc.projectItem.name;
                var motionVals={};
                var tMotion=getMotionComp(tc);
                if(tMotion){
                    for(var tpi=0;tpi<tMotion.properties.numItems;tpi++){
                        var tp=tMotion.properties[tpi];
                        if(tp&&tp.displayName){ try{ motionVals[tp.displayName]=tp.getValue(); }catch(e){} }
                    }
                }
                var hasM=false; for(var mk in motionVals){ hasM=true; break; }
                if(hasM) info.v3MotionByName[tName]=motionVals;
            }
        }
        if(!info.outroItem) info.outroItem=findByNameSubstr(app.project.rootItem,OUTRO_SUBSTR);

        /* audioOffset: 4 intentos en orden de fiabilidad */
        if(info.v2EffectClip){
            var vSec=info.v2EffectClip.start.seconds;
            var vName=info.v2EffectClip.projectItem.name;

            /* 0) A1 de test2: WAV/mp3/aac del presentador puesto a mano en la pista 1.
               El offset de ese clip respecto a V2 ES el audio sync offset.
               Para configurarlo: pon el WAV del presentador en A1 de test2 en la
               posicion correcta y el script lo detecta automaticamente. */
            if(info.audioOffsetSec===0){
                var a1=seq.audioTracks[0];
                if(a1){
                    for(var a1i=0;a1i<a1.clips.numItems;a1i++){
                        var a1c=a1.clips[a1i];
                        if(!a1c||!a1c.projectItem) continue;
                        var a1n=a1c.projectItem.name||'';
                        var a1p=''; try{ a1p=a1c.projectItem.getMediaPath(); }catch(e){}
                        var isAudioClip=/\.(wav|mp3|aac|m4a|aiff?|ogg|flac|wma)$/i.test(a1n)||
                                        /\.(wav|mp3|aac|m4a|aiff?|ogg|flac|wma)$/i.test(a1p);
                        if(!isAudioClip) continue;
                        var a1Start=-1; try{ a1Start=a1c.start.seconds; }catch(e){}
                        if(a1Start<0) continue;
                        if(a1n.indexOf(OUTRO_SUBSTR)>=0||a1n.indexOf(FADE_IN_SUBSTR)>=0||a1n.indexOf(FADE_OUT_SUBSTR)>=0) continue;
                        info.audioOffsetSec=a1Start-vSec;
                        log('  audioOffset (A1 test2 "'+a1n+'"): '+info.audioOffsetSec.toFixed(3)+'s');
                        break;
                    }
                }
            }

            /* 1) Nombre exacto del clip de V2 en pistas de audio del template
               (solo si tiene offset real, no el linked audio del nested a t=0) */
            if(info.audioOffsetSec===0)
            outerA: for(var ai=0;ai<seq.audioTracks.numTracks;ai++)
                for(var aj=0;aj<seq.audioTracks[ai].clips.numItems;aj++){
                    var ac=seq.audioTracks[ai].clips[aj];
                    if(ac.projectItem&&ac.projectItem.name===vName){
                        var namedOff=ac.start.seconds-vSec;
                        if(Math.abs(namedOff)>0.033){
                            info.audioOffsetSec=namedOff;
                            log('  audioOffset (nombre "'+vName+'"): '+info.audioOffsetSec.toFixed(3)+'s');
                            break outerA;
                        }
                    }
                }

            /* 2) Si V2 es nested: buscar audio dentro de la secuencia interna */
            if(info.audioOffsetSec===0){
                var npath2=''; try{ npath2=info.v2EffectClip.projectItem.getMediaPath(); }catch(e){}
                if(!npath2){
                    var innerSeq=findSequenceByName(vName);
                    if(innerSeq){
                        outerInner: for(var ivi=0;ivi<innerSeq.videoTracks.numTracks;ivi++){
                            var ivt=innerSeq.videoTracks[ivi];
                            for(var ici=0;ici<ivt.clips.numItems;ici++){
                                var ic=ivt.clips[ici];
                                if(!ic||!ic.projectItem) continue;
                                var ipath=''; try{ ipath=ic.projectItem.getMediaPath(); }catch(e){}
                                if(!ipath) continue;
                                var iName=ic.projectItem.name, iSec=ic.start.seconds;
                                for(var iai=0;iai<innerSeq.audioTracks.numTracks;iai++)
                                    for(var iaj=0;iaj<innerSeq.audioTracks[iai].clips.numItems;iaj++){
                                        var iac=innerSeq.audioTracks[iai].clips[iaj];
                                        if(iac.projectItem&&iac.projectItem.name===iName){
                                            info.audioOffsetSec=iac.start.seconds-iSec;
                                            log('  audioOffset (nested "'+innerSeq.name+'"): '+info.audioOffsetSec.toFixed(3)+'s');
                                            break outerInner;
                                        }
                                    }
                                break outerInner;
                            }
                        }
                    }
                }
            }

            /* 3) Scan posicional: cualquier audio en el template que empiece
               a un offset distinto de 0 respecto al inicio de V2.
               Cubre el caso de nested cuyo audio PP no expone por nombre. */
            if(info.audioOffsetSec===0){
                log('  audioOffset scan posicional de "'+seq.name+'" ('+seq.audioTracks.numTracks+' pistas):');
                outerScan: for(var si=0;si<seq.audioTracks.numTracks;si++){
                    var sTr=seq.audioTracks[si];
                    for(var sj=0;sj<sTr.clips.numItems;sj++){
                        var sC=sTr.clips[sj];
                        if(!sC) continue;
                        var sCName=''; try{ sCName=sC.projectItem?sC.projectItem.name:'(null)'; }catch(e){}
                        var sCStart=-1; try{ sCStart=sC.start.seconds; }catch(e){}
                        log('    A'+(si+1)+'['+sj+']: "'+sCName+'" @'+sCStart.toFixed(3)+'s');
                        if(sCStart<0) continue;
                        /* Ignorar outro, fades, clips muy lejos del inicio de V2 */
                        if(sCName.indexOf(OUTRO_SUBSTR)>=0||sCName.indexOf(FADE_IN_SUBSTR)>=0||sCName.indexOf(FADE_OUT_SUBSTR)>=0) continue;
                        if(sCStart>vSec+120) continue;
                        /* Si tiene offset real (>1 frame a 25fps = 0.04s) lo usamos */
                        var sCOffset=sCStart-vSec;
                        if(Math.abs(sCOffset)>0.033){
                            info.audioOffsetSec=sCOffset;
                            log('  audioOffset (posicional A'+(si+1)+'): '+sCOffset.toFixed(3)+'s');
                            break outerScan;
                        }
                    }
                }
            }

            if(info.audioOffsetSec===0) log('  audioOffset: no detectado en template (usa AUDIO_OFFSET_SEC en config)');
        }

        /* Pre-leer Motion de los clips de efecto para evitar re-leer desde objetos
           potencialmente obsoletos más tarde. readMotionFromClip usa hoisting. */
        info.v2MotionSaved = {};
        info.v3MotionSaved = {};
        /* V2: leer Motion del clip del test (sea directo o nested sequence) */
        if(info.v2EffectClip){
            info.v2MotionSaved=readMotionFromClip(info.v2EffectClip);
            var _v2mk=''; for(var _v2k in info.v2MotionSaved) _v2mk+=_v2k+' ';
            log('  v2MotionSaved: '+(_v2mk.replace(/\s+$/,'')||'(vacío)'));
        }
        /* V3: tablero */
        if(info.v3EffectClip){
            info.v3MotionSaved=readMotionFromClip(info.v3EffectClip);
            var _v3mk=''; for(var _v3k in info.v3MotionSaved) _v3mk+=_v3k+' ';
            log('  v3MotionSaved: '+(_v3mk.replace(/\s+$/,'')||'(vacío)'));
        }

        return info;
    }

    /* ══ Efectos desde test ═══════════════════════════════════════════ */
    function getNonIntrinsicComps(clip){
        var result=[];
        if(!clip||!clip.components) return result;
        for(var ci=0;ci<clip.components.numItems;ci++){
            var comp=clip.components[ci];
            if(comp&&comp.displayName&&!INTRINSIC_NAMES[comp.displayName]) result.push(comp);
        }
        return result;
    }

    function copyPropsRecursive(srcComp, dstComp, verbose){
        if(!srcComp||!dstComp) return;
        var numProps=0;
        try{ numProps=srcComp.properties?srcComp.properties.numItems:0; }catch(e){ return; }
        for(var pi=0;pi<numProps;pi++){
            var sp=null,dp=null;
            try{ sp=srcComp.properties[pi]; }catch(e){ continue; }
            try{ dp=dstComp.properties[pi]; }catch(e){ continue; }
            if(!sp||!dp) continue;
            var dn=''; try{ dn=sp.displayName||''; }catch(e){}
            if(dn.replace(/\s+/g,'')==='') continue;
            var hasChildren=false;
            try{ hasChildren=(sp.properties&&sp.properties.numItems>0); }catch(e){}
            if(hasChildren){
                copyPropsRecursive(sp,dp,verbose);
            } else {
                try{
                    var val=sp.getValue();
                    if(typeof val==='string'&&val.length>0&&val.charCodeAt(0)>127&&dn!=='Blob'){
                        if(verbose) log('        SKIP [binary] "'+dn+'"');
                        continue;
                    }
                    var norm=true;
                    try{ if(typeof val==='number'&&(val>4294967296||val<-4294967296)) norm=false; }catch(ne){}
                    dp.setValue(val,norm);
                    if(verbose) log('        SET "'+dn+'" = '+truncate(jStr(val),60)+(norm?'':' [raw]'));
                }catch(e){
                    if(verbose) log('        SET ERR "'+dn+'": '+e.message);
                }
            }
        }
    }

    /* ── QE helpers ──────────────────────────────────────────────────── */
    function qeGetEffect(displayName){
        try{ var ef=qe.project.getVideoEffectByName(displayName); if(ef) return ef; }
        catch(e){ log('      qeGetEffect("'+displayName+'"): '+e.message); }
        return null;
    }

    function findQEClipAtTime(qeTrack,startSec){
        if(!qeTrack) return null;
        var n=0;
        try{ n=qeTrack.numItems; }catch(e){ try{ n=qeTrack.numClips; }catch(e2){ n=300; } }
        for(var i=0;i<n;i++){
            try{
                var item=qeTrack.getItemAt(i);
                if(!item) continue;
                var s=-1;
                try{ s=item.start.secs; }catch(e){}
                if(s<0) try{ s=item.start.seconds; }catch(e){}
                if(s>=0&&Math.abs(s-startSec)<0.15) return item;
            }catch(ie){ if(i>150) break; }
        }
        return null;
    }

    /* ══ APPLY PRESET ══════════════════════════════════════════════════ */
    function applyPresetToQEClip(qeClip, presetPath, verbose){
        var pf=new File(presetPath);
        if(!pf.exists){ log('      preset no encontrado: '+presetPath); return false; }

        /* Intentar applyPreset y nombres alternativos conocidos */
        var altNames=['applyPreset','applyEffectPreset','setPreset','loadPreset','applyVideoPreset','importPreset'];
        for(var ai=0;ai<altNames.length;ai++){
            if(typeof qeClip[altNames[ai]]==='function'){
                try{
                    qeClip[altNames[ai]](presetPath);
                    $.sleep(400);
                    log('      '+altNames[ai]+' ✓  ('+new File(presetPath).name+')');
                    return true;
                }catch(e){
                    log('      '+altNames[ai]+' ERR: '+e.message);
                }
            }
        }
        /* Si nada funciona, enumerar métodos del qeClip para diagnóstico */
        var methods=[];
        for(var m in qeClip){ try{ if(typeof qeClip[m]==='function') methods.push(m); }catch(e2){} }
        log('      qeClip methods: '+(methods.length?methods.join(', '):'(ninguno)'));
        return false;
    }

    /* ══ applyEffectsFromTemplate ══════════════════════════════════════ */
    function applyEffectsFromTemplate(templateClip, newClip, seq, trackIdx, verbose){
        if(!templateClip||!newClip||!newClip.projectItem) return;
        var startSec=newClip.start.seconds;
        var tmplComps=getNonIntrinsicComps(templateClip);
        if(!tmplComps.length){ log('    [FX] sin efectos en template'); return; }

        log('    [FX fallback] "'+newClip.projectItem.name+'" track='+trackIdx
            +' – '+tmplComps.length+' efectos'+(verbose?' [VERBOSE]':''));

        var qeClip=null;
        try{
            app.project.activeSequence=seq;
            var qeSeq=qe.project.getActiveSequence();
            if(qeSeq){
                var qeTrack=qeSeq.getVideoTrackAt(trackIdx);
                qeClip=findQEClipAtTime(qeTrack,startSec);
                if(!qeClip) log('      QE clip not found');
            }
        }catch(e){ log('      QE ERR: '+e.message); }

        if(qeClip){
            for(var ei=0;ei<tmplComps.length;ei++){
                var eName=tmplComps[ei].displayName;
                var efObj=qeGetEffect(eName);
                if(efObj){ try{ qeClip.addVideoEffect(efObj); }catch(e){} }
            }
        }

        $.sleep(300);

        var newComps=getNonIntrinsicComps(newClip);
        var copied=0;
        for(var mi=0;mi<tmplComps.length;mi++){
            var tComp=tmplComps[mi];
            var tName=tComp.displayName;
            /* Buscar por nombre — PP puede reordenar efectos respecto al template */
            var matched=false;
            for(var ni=0;ni<newComps.length;ni++){
                if(newComps[ni].displayName===tName){
                    copyPropsRecursive(tComp,newComps[ni],verbose);
                    log('      FX "'+tName+'" ✓');
                    copied++; matched=true; break;
                }
            }
            if(!matched) log('      FX "'+tName+'" no encontrado en nuevo clip');
        }
        log('    [FX] done: '+copied+'/'+tmplComps.length);
    }

    /* ══ FX para V2 ════════════════════════════════════════════════════ */
    function applyV2Effects(tmplClip, newClip, seq, presetPath, verbose){
        if(!tmplClip||!newClip||!newClip.projectItem) return;
        var startSec=newClip.start.seconds;

        var qeClip=null;
        try{
            app.project.activeSequence=seq;
            var qeSeq=qe.project.getActiveSequence();
            if(qeSeq){
                var qeTrack=qeSeq.getVideoTrackAt(1);
                qeClip=findQEClipAtTime(qeTrack,startSec);
            }
        }catch(e){ log('      QE ERR: '+e.message); }

        var presetOk=false;
        if(qeClip&&presetPath){
            presetOk=applyPresetToQEClip(qeClip,presetPath,verbose);
        }

        if(!presetOk){
            log('    → fallback applyEffectsFromTemplate');
            applyEffectsFromTemplate(tmplClip,newClip,seq,1,verbose);
            return;
        }

        var tmplComps=getNonIntrinsicComps(tmplClip);
        $.sleep(300);
        var newComps=getNonIntrinsicComps(newClip);
        log('      después del preset: '+newComps.length+' efectos / tmpl tiene '+tmplComps.length);

        if(newComps.length<tmplComps.length&&qeClip){
            for(var ei=newComps.length;ei<tmplComps.length;ei++){
                var eName=tmplComps[ei].displayName;
                var efObj=qeGetEffect(eName);
                if(efObj){
                    try{ qeClip.addVideoEffect(efObj); log('      add extra "'+eName+'" OK'); }
                    catch(e){ log('      add extra "'+eName+'": '+e.message); }
                }
            }
            $.sleep(300);
            newComps=getNonIntrinsicComps(newClip);
        }

        var presetEffectCount=2;
        for(var mi=presetEffectCount;mi<Math.min(tmplComps.length,newComps.length);mi++){
            if(tmplComps[mi].displayName===newComps[mi].displayName){
                copyPropsRecursive(tmplComps[mi],newComps[mi],verbose);
                log('      FX extra['+mi+'] "'+tmplComps[mi].displayName+'" ✓');
            } else {
                log('      FX extra['+mi+'] MISMATCH tmpl="'+tmplComps[mi].displayName+'" new="'+newComps[mi].displayName+'"');
            }
        }
    }

    /* ══ Motion ══════════════════════════════════════════════════════ */

    /* getMotionComp: devuelve el componente Motion de un clip SIN depender
       del idioma de PP (displayName varía: 'Motion', 'Movimiento', etc.).
       Estrategia: 1) matchName independiente del idioma  2) variantes conocidas
       3) fallback: components[0] (siempre es Motion en PP). */
    function getMotionComp(clip){
        if(!clip||!clip.components) return null;
        var n=clip.components.numItems;
        for(var i=0;i<n;i++){
            var c=clip.components[i]; if(!c) continue;
            /* matchName es locale-independent cuando existe */
            try{ var mn=c.matchName||''; if(mn&&(mn==='AE.ADBE Motion'||mn==='Motion'||mn.indexOf('Motion')>=0)) return c; }catch(e){}
            /* displayName en distintos idiomas */
            var dn=c.displayName||'';
            if(dn==='Motion'||dn==='Movimiento'||dn==='Mouvement'||dn==='Bewegung'||dn==='Movimento') return c;
        }
        /* Fallback: primer componente = siempre Motion en PP */
        return n>0?clip.components[0]:null;
    }

    /* scaleMotionVal: PP devuelve Position normalizado [0-1] en lugar de píxeles.
       Detecta si el valor está normalizado (ambos componentes ≤ 2.0) y lo escala. */
    /* isMotionSentinel: PP usa 32767 (0x7FFF) para propiedades no inicializadas
       en clips de secuencias recién clonadas. Detecta ese valor para saltarlo. */
    function isMotionSentinel(val){
        if(val===32767||val===-32767) return true;
        if(val instanceof Array){
            for(var _i=0;_i<val.length;_i++) if(val[_i]===32767||val[_i]===-32767) return true;
        }
        return false;
    }

    /* scaleMotionVal: filtra sentinels y pasa el valor TAL CUAL.
       getValue() y setValue() usan el mismo sistema de coordenadas (los dos
       devuelven/esperan valores normalizados 0-1 en PP 2024+).
       Convertir normalizado → píxeles hacía que setValue() lanzara excepción
       (valor fuera de rango) y la posición se quedara en 32767 sin tocar. */
    function scaleMotionVal(dn, val, fw, fh){
        if(!dn||val===undefined||val===null) return val;
        /* Sentinel exacto PP: 32767 / -32767 */
        if(isMotionSentinel(val)){
            log('      SKIP "'+dn+'": sentinel ('+jStr(val)+')');
            return null;
        }
        /* Sentinel alternativo: valor de posición absurdamente grande */
        var lcdn=dn.toLowerCase();
        var isPos=(lcdn==='position'||lcdn.indexOf('posit')>=0||
                   lcdn.indexOf('posic')>=0||lcdn.indexOf('posiz')>=0);
        if(isPos && val instanceof Array && val.length>=2){
            /* Cualquier componente mayor de 100 en un sistema [0,1] es imposible */
            if(Math.abs(val[0])>100||Math.abs(val[1])>100){
                log('      SKIP "'+dn+'": valor fuera de rango ('+jStr(val)+')');
                return null;
            }
        }
        /* Pasar tal cual: mismo sistema de coordenadas en getValue/setValue */
        log('      OK  "'+dn+'" = '+jStr(val));
        return val;
    }
    function getSeqDims(){
        var fw=1920, fh=1080;
        try{
            var as=app.project.activeSequence;
            if(as){ fw=as.frameSizeHorizontal||1920; fh=as.frameSizeVertical||1080; }
        }catch(e){}
        return {w:fw, h:fh};
    }

    function copyMotionFromTestClip(srcClip,dstClip){
        var srcMotion=getMotionComp(srcClip);
        var dstMotion=getMotionComp(dstClip);
        if(!srcMotion||!dstMotion){ log('      Motion: src o dst null'); return; }
        var dims=getSeqDims();
        var copied=0;
        for(var pi=0;pi<srcMotion.properties.numItems;pi++){
            var sp=srcMotion.properties[pi]; if(!sp||!sp.displayName) continue;
            for(var di=0;di<dstMotion.properties.numItems;di++){
                if(dstMotion.properties[di].displayName===sp.displayName){
                    try{
                        var val=scaleMotionVal(sp.displayName,sp.getValue(),dims.w,dims.h);
                        if(val===null){ break; } /* sentinel detectado – saltar */
                        dstMotion.properties[di].setValue(val,true); copied++;
                    }
                    catch(e){ log('      Motion "'+sp.displayName+'" FAIL: '+e.message); }
                    break;
                }
            }
        }
        log('      Motion: '+copied+' props copiadas (src="'+(srcMotion.displayName||'?')+'" dst="'+(dstMotion.displayName||'?')+'")');
    }

    /* applyMotionSaved: aplica un diccionario {displayName→valor} al Motion de un clip.
       Más robusto que copyMotionFromTestClip porque trabaja con valores JS planos
       previamente filtrados de sentinels, no con objetos clip en tiempo real. */
    /* findMotionProp: busca propiedad por displayName.
       Alias automático Scale Height ↔ Scale: cubre el caso en que el template
       usa escala no-uniforme pero el clip destino usa uniforme (y viceversa). */
    var _SCALE_ALIAS={'Scale Height':'Scale','Scale':'Scale Height'};
    function findMotionProp(mc,name){
        for(var _fi=0;_fi<mc.properties.numItems;_fi++){
            var _fp=mc.properties[_fi];
            if(_fp&&_fp.displayName===name) return _fp;
        }
        var _al=_SCALE_ALIAS[name];
        if(_al){
            for(var _fi2=0;_fi2<mc.properties.numItems;_fi2++){
                var _fp2=mc.properties[_fi2];
                if(_fp2&&_fp2.displayName===_al) return _fp2;
            }
        }
        return null;
    }

    function applyMotionSaved(motionSaved, dstClip, dims){
        var hasM=false; for(var _mk in motionSaved){ hasM=true; break; }
        if(!hasM){ log('      applyMotionSaved: sin valores guardados'); return 0; }
        var mc=getMotionComp(dstClip);
        if(!mc){ log('      applyMotionSaved: sin Motion comp en dst'); return 0; }
        var copied=0;

        /* Iterar claves guardadas. findMotionProp resuelve alias Scale Height ↔ Scale. */
        for(var _dk in motionSaved){
            var _dp=findMotionProp(mc,_dk);
            if(!_dp) continue;
            try{
                var _mv=scaleMotionVal(_dk,motionSaved[_dk],dims.w,dims.h);
                if(_mv===null){ log('      applyMotionSaved SKIP "'+_dk+'": filtrado'); continue; }
                _dp.setValue(_mv,true);
                try{
                    var _vback=_dp.getValue();
                    log('      applyMotionSaved "'+_dk+'" (->'+_dp.displayName+'): set='+jStr(_mv)+' readback='+jStr(_vback));
                }catch(_eb){ log('      applyMotionSaved "'+_dk+'": set='+jStr(_mv)+' (readback FAIL)'); }
                copied++;
            }catch(_e){ log('      applyMotionSaved "'+_dk+'" setValue FAIL: '+_e.message); }
        }
        log('      applyMotionSaved: '+copied+' props aplicadas');
        return copied;
    }

    /* readMotionFromClip: lee el Motion de un clip a un diccionario JS plano.
       Filtra valores sentinel. Usable desde readTemplateInfo (hoisting). */
    function readMotionFromClip(clip){
        var result={};
        if(!clip) return result;
        var mc=getMotionComp(clip);
        if(!mc){ log('    readMotionFromClip: sin Motion comp'); return result; }
        log('    readMotionFromClip: '+mc.properties.numItems+' props en "'+
            (clip.projectItem?clip.projectItem.name:'?')+'"');
        for(var _rpi=0;_rpi<mc.properties.numItems;_rpi++){
            var _rp=mc.properties[_rpi];
            if(_rp&&_rp.displayName){
                try{
                    var _rv=_rp.getValue();
                    log('      prop "'+_rp.displayName+'" RAW='+jStr(_rv));
                    if(!isMotionSentinel(_rv)) result[_rp.displayName]=_rv;
                    else log('      → SKIP sentinel');
                }catch(_re){ log('      → ERR getValue: '+_re.message); }
            }
        }
        return result;
    }

    /* ── Audio offset ────────────────────────────────────────────────── */
    /* NOTA: aC.start=... falla silenciosamente en PP ExtendScript.
       Siempre usar remove + overwriteClip. */
    function applyAudioOffset(seq,vClip,audioOffsetSec){
        if(Math.abs(audioOffsetSec)<0.0001||!vClip||!vClip.projectItem) return;
        var vName=vClip.projectItem.name, vStart=vClip.start.seconds;
        var targetSec=vStart+audioOffsetSec;
        var found=false;
        for(var ai=0;ai<seq.audioTracks.numTracks;ai++){
            var aTrack=seq.audioTracks[ai];
            for(var aj=aTrack.clips.numItems-1;aj>=0;aj--){
                var aC=aTrack.clips[aj];
                if(aC.projectItem&&aC.projectItem.name===vName&&Math.abs(aC.start.seconds-vStart)<0.5){
                    found=true;
                    var aItem=aC.projectItem;
                    try{
                        /* Registrar clips de vídeo existentes ANTES del overwriteClip */
                        var preVClips={};
                        for(var xvi=0;xvi<seq.videoTracks.numTracks;xvi++){
                            var xvt=seq.videoTracks[xvi];
                            for(var xvj=0;xvj<xvt.clips.numItems;xvj++)
                                preVClips[xvi+'_'+xvt.clips[xvj].start.seconds.toFixed(4)]=1;
                        }
                        aC.remove(false,false);
                        aTrack.overwriteClip(aItem,makeTime(targetSec));
                        log('    audioOffset OK → '+targetSec.toFixed(3)+'s');
                        /* Borrar sólo los clips de vídeo NUEVOS que PP añadió */
                        for(var xvi2=0;xvi2<seq.videoTracks.numTracks;xvi2++){
                            var xvt2=seq.videoTracks[xvi2];
                            for(var xvj2=xvt2.clips.numItems-1;xvj2>=0;xvj2--){
                                var xvc2=xvt2.clips[xvj2];
                                var xk=xvi2+'_'+xvc2.start.seconds.toFixed(4);
                                if(!preVClips[xk]) try{ xvc2.remove(false,false); }catch(e2){}
                            }
                        }
                    }catch(e){ log('    audioOffset FAIL: '+e.message); }
                    return;
                }
            }
        }
        if(!found) log('    audioOffset: clip "'+vName+'" no encontrado en "'+seq.name+'"');
    }

    /* ── Audio offset SIN snapshot (para uso dentro de clones de webcam) ── */
    /* overwriteClip(mp4, offset) parte V1 en dos clips adyacentes que se
       reproducen continuo; el snapshot los eliminaría dejando sólo 0→offset. */
    function applyAudioOffsetInClone(seq,vClip,audioOffsetSec){
        if(Math.abs(audioOffsetSec)<0.0001||!vClip||!vClip.projectItem) return;
        var vName=vClip.projectItem.name, vStart=vClip.start.seconds;
        var targetSec=vStart+audioOffsetSec;
        var found=false;
        for(var ai=0;ai<seq.audioTracks.numTracks;ai++){
            var aTrack=seq.audioTracks[ai];
            for(var aj=aTrack.clips.numItems-1;aj>=0;aj--){
                var aC=aTrack.clips[aj];
                if(aC.projectItem&&aC.projectItem.name===vName&&Math.abs(aC.start.seconds-vStart)<0.5){
                    found=true;
                    var aItem=aC.projectItem;
                    try{
                        aC.remove(false,false);
                        aTrack.overwriteClip(aItem,makeTime(targetSec));
                        log('    audioOffset OK → '+targetSec.toFixed(3)+'s');
                    }catch(e){ log('    audioOffset FAIL: '+e.message); }
                    return;
                }
            }
        }
        if(!found) log('    audioOffset: clip "'+vName+'" no encontrado en "'+seq.name+'"');
    }

    /* ── Eliminar audio tablero ──────────────────────────────────────── */
    function removeTablerAudio(seq,v3Clips){
        for(var ci=0;ci<v3Clips.length;ci++){
            var vc=v3Clips[ci]; if(!vc||!vc.projectItem) continue;
            var vName=vc.projectItem.name, vStart=vc.start.seconds;
            for(var ai=0;ai<seq.audioTracks.numTracks;ai++){
                var aTrack=seq.audioTracks[ai];
                for(var aj=aTrack.clips.numItems-1;aj>=0;aj--){
                    var aC=aTrack.clips[aj];
                    if(aC.projectItem&&aC.projectItem.name===vName&&Math.abs(aC.start.seconds-vStart)<0.04){
                        try{ aC.remove(false,false); log('    tablero audio removed: "'+vName+'"'); }catch(e){}
                        break;
                    }
                }
            }
        }
    }

    /* ── WAV externo con el mismo nombre que el vídeo ───────────────────── */
    /* Si existe <nombre_sin_ext>.wav junto al vídeo, lo importa en el bin,
       elimina el audio original del clip de vídeo y añade el WAV en A1. */
    function findAndAddWav(videoItem, insertSec, seq, bin, maxEndSec) {
        var mediaPath = '';
        try { mediaPath = videoItem.getMediaPath(); } catch(e) {}
        if (!mediaPath) return false;

        var dotIdx = mediaPath.lastIndexOf('.');
        var basePath = (dotIdx > 0 ? mediaPath.substr(0, dotIdx) : mediaPath);
        var wavPath = basePath + '.wav';
        var wavFile = new File(wavPath);

        /* Si no existe el nombre exacto, buscar en el mismo directorio con
           coincidencia fuzzy progresiva:
           1. WAV empieza por el nombre base del vídeo  (sufijo -001, etc.)
           2. WAV contiene el nombre base del vídeo     (prefijo extra)
           3. Coincidencia normalizada: quitar puntuación/espacios y comparar
              (cubre casos como "4...Bg4 & 4...Bf5 Part 2.mp4" ↔
               "4...Bf5 and 4...Bg4 Part 2.wav" donde cambia el orden y &/and) */
        if (!wavFile.exists) {
            var baseNameForSearch = wavFile.name.replace(/\.wav$/i, '');
            var dir = wavFile.parent;
            if (dir && dir.exists) {
                var allWavs = dir.getFiles('*.wav');
                var wi;

                /* Paso 1: WAV empieza por baseName */
                for (wi = 0; wi < allWavs.length; wi++) {
                    var wn = allWavs[wi].name.replace(/\.wav$/i, '');
                    if (wn.indexOf(baseNameForSearch) === 0) {
                        wavFile = allWavs[wi]; wavPath = wavFile.fsName;
                        log('    WAV fuzzy (sufijo): "' + wavFile.name + '"');
                        break;
                    }
                }

                /* Paso 2: WAV contiene baseName */
                if (!wavFile.exists) {
                    for (wi = 0; wi < allWavs.length; wi++) {
                        var wn2 = allWavs[wi].name.replace(/\.wav$/i, '');
                        if (wn2.indexOf(baseNameForSearch) >= 0) {
                            wavFile = allWavs[wi]; wavPath = wavFile.fsName;
                            log('    WAV fuzzy (contiene): "' + wavFile.name + '"');
                            break;
                        }
                    }
                }

                /* Paso 3: quitar prefijo de capítulo del nombre del vídeo y reintentar.
                   Cubre: "2.1) 4...Nc6 5.Be2 Alternative FULL.mp4"
                        ↔ "4...Nc6 5.Be2 Alternative FULL.wav"
                   El prefijo es cualquier secuencia inicial de dígitos, puntos,
                   paréntesis y espacios antes del contenido real. */
                if (!wavFile.exists) {
                    var strippedBase = baseNameForSearch.replace(/^[\d\s.)]+/, '');
                    if (strippedBase && strippedBase !== baseNameForSearch) {
                        /* 3a: WAV empieza por nombre sin prefijo */
                        for (wi = 0; wi < allWavs.length; wi++) {
                            var wn3a = allWavs[wi].name.replace(/\.wav$/i, '');
                            if (wn3a.indexOf(strippedBase) === 0) {
                                wavFile = allWavs[wi]; wavPath = wavFile.fsName;
                                log('    WAV fuzzy (sin prefijo, empieza): "' + wavFile.name + '"');
                                break;
                            }
                        }
                        /* 3b: WAV contiene nombre sin prefijo */
                        if (!wavFile.exists) {
                            for (wi = 0; wi < allWavs.length; wi++) {
                                var wn3b = allWavs[wi].name.replace(/\.wav$/i, '');
                                if (wn3b.indexOf(strippedBase) >= 0) {
                                    wavFile = allWavs[wi]; wavPath = wavFile.fsName;
                                    log('    WAV fuzzy (sin prefijo, contiene): "' + wavFile.name + '"');
                                    break;
                                }
                            }
                        }
                    }
                }

                /* Paso 4: coincidencia por número de Part / Parte / número final.
                   Cubre: "4...Bg4 & 4...Bf5 Part 2.mp4" ↔ "4...Bf5 and 4...Bg4 Part 2.wav" */
                if (!wavFile.exists) {
                    function _extractPartNum(s) {
                        var m = s.match(/part[e]?\s*(\d+)/i);
                        if (m) return m[1];
                        var m2 = s.match(/(\d+)\s*$/);
                        if (m2) return m2[1];
                        return '';
                    }
                    var partBase = _extractPartNum(baseNameForSearch);
                    if (partBase) {
                        for (wi = 0; wi < allWavs.length; wi++) {
                            var wn4 = allWavs[wi].name.replace(/\.wav$/i, '');
                            if (_extractPartNum(wn4) === partBase) {
                                wavFile = allWavs[wi]; wavPath = wavFile.fsName;
                                log('    WAV fuzzy (part ' + partBase + '): "' + wavFile.name + '"');
                                break;
                            }
                        }
                    }
                }
            }
        }
        if (!wavFile.exists) return false;

        log('    WAV encontrado: "' + wavFile.name + '"');

        /* PP a veces muestra ProjectItem.name sin extensión → buscar por nombre
           con extensión, sin extensión, y como último recurso por getMediaPath(). */
        var wavNameNoExt = wavFile.name.replace(/\.[^.]+$/, '');
        function findWavInBin(b){
            for(var bi=0;bi<b.children.numItems;bi++){
                var bc=b.children[bi];
                if(bc.type!==ProjectItemType.CLIP) continue;
                if(bc.name===wavFile.name||bc.name===wavNameNoExt) return bc;
                try{ var bp=bc.getMediaPath(); if(bp&&bp===wavPath) return bc; }catch(e2){}
            }
            return null;
        }

        var wavItem = findWavInBin(bin);
        if (!wavItem) {
            app.project.importFiles([wavPath], true, bin, false);
            $.sleep(400);
            wavItem = findWavInBin(bin);
        }
        if (!wavItem) { log('    WAV: import fallido (buscado "'+wavFile.name+'" / "'+wavNameNoExt+'")'); return false; }

        /* Insertar WAV en A1 (overwriteClip corta lo que haya en esa posición;
           NO borrar el audio del mp4 — remove() mata el video linked) */
        try {
            seq.audioTracks[0].overwriteClip(wavItem, makeTime(insertSec));
            /* Localizar el clip recién insertado y recortarlo a maxEndSec.
               Sin esto, si el WAV es más largo que el clip de vídeo (p.ej. grabación
               sin cortar), el clip de audio se extiende mucho más allá del vídeo y
               se superpone con el audio de los capítulos siguientes. */
            try {
                var _a1t = seq.audioTracks[0];
                var _wavClip = null;
                for (var _wi = 0; _wi < _a1t.clips.numItems; _wi++) {
                    if (Math.abs(_a1t.clips[_wi].start.seconds - insertSec) < 0.1) {
                        _wavClip = _a1t.clips[_wi]; break;
                    }
                }
                if (!_wavClip) _wavClip = _a1t.clips[_a1t.clips.numItems - 1];
                if (_wavClip) {
                    var _origEnd = _wavClip.end.seconds;
                    if (maxEndSec && _origEnd > maxEndSec + 0.1) {
                        /* 1er intento: clip.end = Time (a veces falla silenciosamente en PP2025) */
                        var _tE = new Time(); _tE.seconds = maxEndSec;
                        try { _wavClip.end = _tE; } catch(_te) {}
                        /* Verificar que funcionó; si no, usar clip.outPoint como fallback */
                        var _afterEnd = _wavClip.end.seconds;
                        if (_afterEnd > maxEndSec + 0.5) {
                            /* clip.end no funcionó → calcular nuevo outPoint */
                            var _newDur = maxEndSec - _wavClip.start.seconds;
                            var _newOP  = _wavClip.inPoint.seconds + _newDur;
                            try { var _opT = new Time(); _opT.seconds = _newOP; _wavClip.outPoint = _opT; } catch(_te2) {}
                            _afterEnd = _wavClip.end.seconds;
                            log('    WAV @' + insertSec.toFixed(2) + 's → A1 ✓  (trimmed via outPoint: ' + _origEnd.toFixed(2) + 's → ' + _afterEnd.toFixed(2) + 's, target=' + maxEndSec.toFixed(2) + 's)');
                        } else {
                            log('    WAV @' + insertSec.toFixed(2) + 's → A1 ✓  (trimmed: ' + _origEnd.toFixed(2) + 's → ' + _afterEnd.toFixed(2) + 's)');
                        }
                    } else {
                        var _wdur = (_origEnd - _wavClip.start.seconds).toFixed(2);
                        log('    WAV @' + insertSec.toFixed(2) + 's → A1 ✓  (clip: ' + _wavClip.start.seconds.toFixed(2) + 's–' + _origEnd.toFixed(2) + 's, dur=' + _wdur + 's)');
                    }
                }
            } catch(_we) { log('    WAV @' + insertSec.toFixed(2) + 's → A1 ✓  (trim err: ' + _we.message + ')'); }
            return true;
        } catch(e) {
            log('    WAV insert FAIL: ' + e.message);
            return false;
        }
    }

    /* ── Insert clip ─────────────────────────────────────────────────── */
    function tryInsert(track,item,sec){
        var t=makeTime(sec), numBefore=track.clips.numItems;
        log('    insert "'+item.name+'" @'+sec.toFixed(3)+'s  numBefore='+numBefore);
        try{
            track.overwriteClip(item,t);
            var numAfterOW=track.clips.numItems;
            log('      overwriteClip: numAfter='+numAfterOW);
            for(var _dk=0;_dk<numAfterOW;_dk++){
                var _dc=track.clips[_dk];
                log('      clips['+_dk+'] start='+(_dc?_dc.start.seconds.toFixed(3):'?')+'s end='+(_dc?_dc.end.seconds.toFixed(3):'?')+'s name='+(_dc&&_dc.projectItem?_dc.projectItem.name:'?'));
            }
            if(numAfterOW>numBefore){
                for(var k=numAfterOW-1;k>=0;k--)
                    if(Math.abs(track.clips[k].start.seconds-sec)<0.15) return track.clips[k];
                return track.clips[numAfterOW-1];
            }
        }catch(e1){ log('      overwriteClip ERR: '+e1.message); }
        try{
            track.insertClip(item,t.ticks);
            if(track.clips.numItems>numBefore) return track.clips[track.clips.numItems-1];
        }catch(e2){ log('      insertClip: '+e2.message); }
        log('      → FALLÓ'); return null;
    }

    /* ── Duplicar secuencia void ─────────────────────────────────────── */
    function duplicateVoidSeq(voidSeq, newName, targetBin){
        /* Registrar nombres existentes antes de clonar */
        var beforeNames={};
        for(var si=0;si<app.project.sequences.numSequences;si++)
            beforeNames[app.project.sequences[si].name]=1;

        /* Sequence.clone() es el método correcto en la API de PP */
        var cloneResult=null;
        try{ cloneResult=voidSeq.clone(); }
        catch(e){ log('  clone() ERR: '+e.message); return null; }
        $.sleep(500);

        /* clone() puede devolver la nueva secuencia directamente, o null */
        var newSeq=null;
        if(cloneResult&&typeof cloneResult.name!=='undefined'){
            newSeq=cloneResult;
            log('  clone() devolvió secuencia: "'+newSeq.name+'"');
        } else {
            /* Buscar por nombre: la que no estaba antes */
            for(var si2=0;si2<app.project.sequences.numSequences;si2++){
                var s=app.project.sequences[si2];
                if(!beforeNames[s.name]){ newSeq=s; break; }
            }
        }
        if(!newSeq){ log('  clone: nueva secuencia no encontrada'); return null; }
        log('  cloned "'+voidSeq.name+'" → "'+newSeq.name+'"');

        /* Renombrar */
        try{ newSeq.name=newName; log('  renamed → "'+newName+'"'); }
        catch(e){ log('  rename FAIL: '+e.message); }

        /* Mover al bin destino */
        if(targetBin&&newSeq.projectItem){
            try{ newSeq.projectItem.moveBin(targetBin); log('  moveBin → "'+targetBin.name+'"'); }
            catch(e){ log('  moveBin FAIL: '+e.message); }
        }
        return newSeq;
    }

    /* ── Reemplazar vídeo en clon de webcam ──────────────────────────── */
    function replaceVideoInWebcamClone(cloneSeq, newVideoItem, audioOffsetSec, chapterBin, verbose, webcamMotionOverride, v2EffectClip, motionOut){
        if(!cloneSeq||!newVideoItem) return false;
        log('  [replaceVideo] "'+newVideoItem.name+'" → "'+cloneSeq.name+'"');
        try{ app.project.activeSequence=cloneSeq; }catch(e){}

        /* Helper: ¿es este clip un medio real (no adjustment layer)?
           Prueba getMediaPath() y como fallback el nombre de archivo. */
        function isRealClip(c){
            if(!c||!c.projectItem) return false;
            var n=c.projectItem.name||'';
            /* Excluir imágenes estáticas */
            if(/\.(png|jpe?g|bmp|tiff?|gif|psd|ai|eps|tga)$/i.test(n)) return false;
            var mp='';
            try{ mp=c.projectItem.getMediaPath(); }catch(e){}
            if(mp&&mp.length>0){
                if(/\.(png|jpe?g|bmp|tiff?|gif|psd|ai|eps|tga)$/i.test(mp)) return false;
                /* Solo es real si la ruta apunta a un vídeo conocido */
                return /\.(mp4|mov|avi|mxf|mkv|wmv|m4v|r3d|braw|arw)$/i.test(mp);
            }
            /* Sin ruta de medio: adjustment layer, solid, nested sequence, etc.
               Solo eliminar si el nombre termina en extensión de vídeo. */
            return /\.(mp4|mov|avi|mxf|mkv|wmv|m4v|r3d|braw|arw)$/i.test(n);
        }

        /* Diagnóstico: contenido del clon antes de modificarlo */
        log('  clon V tracks: '+cloneSeq.videoTracks.numTracks);
        for(var _dvi=0;_dvi<cloneSeq.videoTracks.numTracks;_dvi++){
            var _dvt=cloneSeq.videoTracks[_dvi]; var _dvc=_dvt.clips.numItems;
            for(var _dci=0;_dci<_dvc;_dci++){
                var _dc=_dvt.clips[_dci]; if(!_dc||!_dc.projectItem) continue;
                var _dmp=''; try{_dmp=_dc.projectItem.getMediaPath();}catch(e){}
                log('    V'+(_dvi+1)+'['+_dci+']: "'+_dc.projectItem.name+'" real='+isRealClip(_dc)+' mp='+((_dmp&&_dmp.length>0)?_dmp:'(vacío)'));
            }
            if(_dvc===0) log('    V'+(_dvi+1)+': (vacío)');
        }

        /* Buscar el PRIMER clip real para: pista de destino, origStart y Motion. */
        var origClip=null, origTrackIdx=0, origStart=0;
        for(var vi=0;vi<cloneSeq.videoTracks.numTracks&&!origClip;vi++){
            var vt=cloneSeq.videoTracks[vi];
            for(var ci=0;ci<vt.clips.numItems;ci++){
                if(isRealClip(vt.clips[ci])){ origClip=vt.clips[ci]; origTrackIdx=vi; origStart=vt.clips[ci].start.seconds; break; }
            }
        }
        log('  orig: '+(origClip?'"'+origClip.projectItem.name+'" en V'+(origTrackIdx+1)+' @'+origStart.toFixed(3)+'s':'no encontrado'));

        /* Guardar Motion: primero usar el override pre-leído desde buildSequence
           (más fiable porque se lee antes de cualquier clonado). Si está vacío,
           intentar leer desde el template original (webcam). */
        var savedMotion={};
        (function(){
            /* Prioridad 1: override pre-leído (webcamMotionSaved pasado desde buildSequence) */
            var overrideOk=false;
            if(webcamMotionOverride){
                var _ovk=''; for(var _ok in webcamMotionOverride){ _ovk+=_ok+' '; overrideOk=true; }
                if(overrideOk){
                    savedMotion=webcamMotionOverride;
                    log('  motion src: override pre-leído ('+_ovk.replace(/\s+$/,'')+')');
                    return;
                }
            }
            /* Prioridad 2: leer en tiempo real desde el template webcam */
            var srcClip=null;
            var tmplSeq=findSequenceByName(WEBCAM_SEQ_NAME);
            if(tmplSeq&&origTrackIdx<tmplSeq.videoTracks.numTracks){
                var tTrk=tmplSeq.videoTracks[origTrackIdx];
                for(var tki=0;tki<tTrk.clips.numItems;tki++){
                    if(isRealClip(tTrk.clips[tki])){ srcClip=tTrk.clips[tki]; break; }
                }
            }
            if(!srcClip) srcClip=origClip; /* fallback: usar el del clon */
            if(!srcClip) return;
            var fromTmpl=(tmplSeq&&srcClip!==origClip);
            log('  motion src: "'+(srcClip.projectItem?srcClip.projectItem.name:'?')+'"'+(fromTmpl?' (template)':' (clon – puede tener sentinel)'));
            var mComp=getMotionComp(srcClip);
            if(!mComp) return;
            var pii,propi;
            for(pii=0;pii<mComp.properties.numItems;pii++){
                propi=mComp.properties[pii];
                if(propi&&propi.displayName){
                    try{
                        var v=propi.getValue();
                        if(!isMotionSentinel(v)) savedMotion[propi.displayName]=v;
                        else log('  motion SKIP "'+propi.displayName+'": sentinel');
                    }catch(e){}
                }
            }
            if(verbose){ var mk=''; for(var k in savedMotion) mk+=k+' '; log('  motion guardado: '+(mk.replace(/\s+$/,'')||'(ninguno)')); }
        })();

        var origName=origClip?origClip.projectItem.name:'';
        /* origStart ya asignado arriba (0 si no se encontró clip) */

        /* Detectar offset REAL del audio desde el clon de webcam.
           Busca el primer clip de audio que haya (sin requerir projectItem). */
        var detectedOffset=AUDIO_OFFSET_SEC||audioOffsetSec||0;
        log('  audio tracks en clon: '+cloneSeq.audioTracks.numTracks);
        outerDAO: for(var dao=0;dao<cloneSeq.audioTracks.numTracks;dao++){
            var daTrack=cloneSeq.audioTracks[dao];
            log('  A'+(dao+1)+' clips: '+daTrack.clips.numItems);
            for(var daj=0;daj<daTrack.clips.numItems;daj++){
                var daC=daTrack.clips[daj];
                if(daC){
                    var daCName=daC.projectItem?daC.projectItem.name:'(sin projectItem)';
                    detectedOffset=daC.start.seconds-origStart;
                    log('  audioOffset (webcam): '+detectedOffset.toFixed(3)+'s clip="'+daCName+'"');
                    break outerDAO;
                }
            }
        }
        if(detectedOffset===0&&AUDIO_OFFSET_SEC===0) log('  audioOffset: no clips en webcam clone – usa AUDIO_OFFSET_SEC en config');

        /* Borrar TODOS los clips de vídeo real de TODAS las pistas
           (el test clip puede estar en V1, V2 o cualquier pista según el template). */
        for(var viDel=0;viDel<cloneSeq.videoTracks.numTracks;viDel++){
            var vtDel=cloneSeq.videoTracks[viDel];
            for(var ciDel=vtDel.clips.numItems-1;ciDel>=0;ciDel--){
                var cDel=vtDel.clips[ciDel];
                if(!isRealClip(cDel)) continue;
                var cDelName='?';
                try{ cDelName=cDel.projectItem.name; }catch(e){}
                /* Intentar remove con varias firmas (la API varía entre versiones PP) */
                var delOk=false;
                try{ cDel.remove(false,false); delOk=true; }catch(e1){
                    try{ cDel.remove(); delOk=true; }catch(e2){
                        try{ cDel.remove(true,false); delOk=true; }catch(e3){
                            log('  remove V'+(viDel+1)+' "'+cDelName+'" FAIL: '+e1.message);
                        }
                    }
                }
                if(delOk) log('  removed V'+(viDel+1)+' "'+cDelName+'"');
                else      log('  WARN: no se pudo borrar V'+(viDel+1)+' "'+cDelName+'"');
            }
        }

        /* Borrar TODO el audio del clon (pertenecía al template; lo reemplazamos) */
        for(var ai=0;ai<cloneSeq.audioTracks.numTracks;ai++){
            var aTrack=cloneSeq.audioTracks[ai];
            for(var aj=aTrack.clips.numItems-1;aj>=0;aj--){
                try{ aTrack.clips[aj].remove(false,false); }catch(e){}
            }
        }

        /* Insertar nuevo vídeo en la MISMA pista que tenía el original (o V1 si no encontrado) */
        var tgtIdx=origTrackIdx>=0?origTrackIdx:0;
        var tgtTrack=cloneSeq.videoTracks[tgtIdx];
        var newClip=tryInsert(tgtTrack,newVideoItem,0);
        if(!newClip){ log('  replaceVideo: insert FAIL'); return false; }
        var newEndSec=newClip.end.seconds;
        log('  replaceVideo OK: V'+(tgtIdx+1)+' duración='+newEndSec.toFixed(2)+'s');

        /* ── Adjustment Layer en V2 del clon ─────────────────────────────────────────
           Sequence.clone() copia la AL si existe en la fuente (el caso al clonar "Nested").
           Si ya está → solo extender a la duración del nuevo clip, NO sobreescribir efectos
           (el clone() los copió exactamente incluyendo Key Color).
           Si no está → insertar desde template y copiar efectos. */
        var adjLayerInserted=false;
        (function(){
            if(cloneSeq.videoTracks.numTracks<2) return;
            var adjTgt=cloneSeq.videoTracks[1];

            /* ¿Ya hay AL en el clon (heredada del clone())? */
            for(var exi=0;exi<adjTgt.clips.numItems;exi++){
                var exc=adjTgt.clips[exi];
                if(!exc||!exc.projectItem||isRealClip(exc)) continue;
                /* AL encontrada – solo extender, NO tocar efectos (Key Color correcto) */
                var alEnd=0; try{alEnd=exc.end.seconds;}catch(e){}
                if(alEnd<newEndSec-0.1){
                    try{ var tEx=new Time(); tEx.seconds=newEndSec; exc.end=tEx; }catch(e){
                        log('  WARN: AL extend ERR: '+e.message);
                    }
                }
                log('  AL heredada de clone() ✓ – efectos intactos ("'+exc.projectItem.name+'", '+newEndSec.toFixed(2)+'s)');
                adjLayerInserted=true;
                return; /* no sobreescribir */
            }

            /* AL no encontrada: insertarla desde el template y copiar efectos */
            var tmplWc=findSequenceByName(WEBCAM_SEQ_NAME);
            if(!tmplWc||tmplWc.videoTracks.numTracks<2) return;
            var adjSrcT=tmplWc.videoTracks[1];
            for(var ai=0;ai<adjSrcT.clips.numItems;ai++){
                var ac=adjSrcT.clips[ai];
                if(!ac||!ac.projectItem||isRealClip(ac)) continue;
                try{ adjTgt.overwriteClip(ac.projectItem,makeTime(0)); $.sleep(200); }
                catch(e){ log('  WARN: AL overwriteClip ERR: '+e.message); return; }
                if(adjTgt.clips.numItems>0){
                    var adjNew=adjTgt.clips[0];
                    try{ var tE=new Time(); tE.seconds=newEndSec; adjNew.end=tE; }
                    catch(e){ log('  WARN: AL end set ERR: '+e.message); }
                    log('  AL insertada desde template ✓ ('+newEndSec.toFixed(2)+'s) – copiando FX...');
                    applyEffectsFromTemplate(ac,adjNew,cloneSeq,1,verbose);
                    adjLayerInserted=true;
                } else { log('  WARN: AL insertada pero no visible en V2'); }
                return;
            }
            log('  WARN: no se encontró AL en webcam.V2');
        })();

        /* ── Efectos al clip presentador: solo como fallback si no hay AL ── */
        if(v2EffectClip&&newClip&&!adjLayerInserted){
            log('  FX al clip V1 (fallback – sin AL)...');
            applyEffectsFromTemplate(v2EffectClip,newClip,cloneSeq,tgtIdx,verbose);
        } else if(adjLayerInserted){
            log('  FX en AL – sin duplicar en V1');
        }

        /* ── Motion del clip V1 (post-AL) ────────────────────────────────────
           Se aplica DESPUÉS de la sección de AL por dos razones:
           1) PP necesita tiempo para inicializar las propiedades del clip
              recién insertado; el sleep aquí equivale al $.sleep(300) que
              applyEffectsFromTemplate incluía en el camino de fallback de v99.
           2) applyMotionSaved registra en log sin depender de verbose, lo que
              facilita el diagnóstico en caso de fallo.
           Si savedMotion está vacío (p.ej. sentinel en la secuencia template),
           se reintenta leyendo directamente desde v2EffectClip. */
        $.sleep(200);
        (function(){
            var hasM=false; for(var _pmK in savedMotion){ hasM=true; break; }
            var motSrc=savedMotion;
            if(!hasM&&v2EffectClip){
                motSrc=readMotionFromClip(v2EffectClip);
                hasM=false; for(var _pmK2 in motSrc){ hasM=true; break; }
                if(hasM) log('  Motion V1: savedMotion vacío → leído desde v2EffectClip');
            }
            if(!hasM){ log('  Motion V1: sin Motion disponible'); return; }
            /* PP2025 bug: setValue en nested sequences no persiste si la nested
               es la secuencia activa. Guardamos clip+motion para reintento
               post-inserción desde buildSequence (con seq del capítulo activa). */
            if(motionOut){ motionOut.clip=newClip; motionOut.motion=motSrc; }
            log('  Motion V1 (1er intento):');
            applyMotionSaved(motSrc,newClip,getSeqDims());
        })();

        /* ── Audio: WAV con offset o mp4 movido ─────────────────────────── */
        var wavPathC='';
        try{ var mp4pC=newVideoItem.getMediaPath(); if(mp4pC) wavPathC=mp4pC.replace(/\.[^.]+$/,'.wav'); }catch(e){}
        var wavFileC=wavPathC?new File(wavPathC):null;

        /* Helper: ¿es este clip el audio linked del mp4 (no el WAV)?
           Compara por nombre sin extensión para cubrir el caso en que PP
           muestra ProjectItem.name sin extensión. */
        var mp4BaseName=newVideoItem.name.replace(/\.[^.]+$/,''); /* "foo.mp4" → "foo" */
        function isLinkedMp4Audio(clip){
            if(!clip||!clip.projectItem) return false;
            var cn=clip.projectItem.name;
            var cnBase=cn.replace(/\.[^.]+$/,'');
            /* Mismo nombre base Y no es un .wav (evita borrar el WAV si PP omite extensión) */
            if(cnBase!==mp4BaseName) return false;
            var ext=cn.split('.').pop().toLowerCase();
            return ext!=='wav'; /* sólo borrar si NO es wav */
        }

        /* Intentar WAV siempre que haya una ruta base; findAndAddWav hace búsqueda
           fuzzy interna para nombres con sufijo (-001, etc.) y devuelve true/false. */
        var wavFound=false;
        if(wavPathC){
            log('  WAV → findAndAddWav @'+detectedOffset.toFixed(3)+'s');
            wavFound=findAndAddWav(newVideoItem,detectedOffset,cloneSeq,chapterBin||app.project.rootItem,newEndSec);
            if(wavFound){
                /* PP puede añadir el audio linked del mp4 en A2+; borrar por nombre base
                   (no A1 = índice 0, que tiene el WAV). */
                log('  A1 clips tras WAV: '+cloneSeq.audioTracks[0].clips.numItems);
                for(var xai=1;xai<cloneSeq.audioTracks.numTracks;xai++){
                    var xaT=cloneSeq.audioTracks[xai];
                    for(var xaj=xaT.clips.numItems-1;xaj>=0;xaj--){
                        if(isLinkedMp4Audio(xaT.clips[xaj]))
                            try{ xaT.clips[xaj].remove(false,false); log('    A'+(xai+1)+' mp4 audio removed'); }catch(e){}
                    }
                }
            }
        }
        if(!wavFound){
            /* Sin WAV: mp4 audio al offset detectado.
               IMPORTANTE: overwriteClip en pista de audio puede insertar también
               el linked video en una pista de vídeo → snapshot antes para limpiar. */
            log('  sin wav → mp4 audio @'+detectedOffset.toFixed(3)+'s');
            var preAudioV={};
            for(var pavi=0;pavi<cloneSeq.videoTracks.numTracks;pavi++){
                var pavt=cloneSeq.videoTracks[pavi];
                for(var pavci=0;pavci<pavt.clips.numItems;pavci++)
                    preAudioV[pavi+'_'+pavt.clips[pavci].start.seconds.toFixed(4)]=1;
            }
            try{
                cloneSeq.audioTracks[0].overwriteClip(newVideoItem,makeTime(detectedOffset));
                log('    mp4 @'+detectedOffset.toFixed(2)+'s → A1 ✓');
            }catch(e){ log('    mp4 audio insert FAIL: '+e.message); }
            /* Eliminar vídeo linked que PP añadió automáticamente */
            for(var ravi=0;ravi<cloneSeq.videoTracks.numTracks;ravi++){
                var ravt=cloneSeq.videoTracks[ravi];
                for(var ravci=ravt.clips.numItems-1;ravci>=0;ravci--){
                    var rk=ravi+'_'+ravt.clips[ravci].start.seconds.toFixed(4);
                    if(!preAudioV[rk])
                        try{ ravt.clips[ravci].remove(false,false); log('    linked V'+(ravi+1)+' eliminado'); }catch(e){}
                }
            }
            for(var xai2=1;xai2<cloneSeq.audioTracks.numTracks;xai2++){
                var xaT2=cloneSeq.audioTracks[xai2];
                for(var xaj2=xaT2.clips.numItems-1;xaj2>=0;xaj2--){
                    if(isLinkedMp4Audio(xaT2.clips[xaj2]))
                        try{ xaT2.clips[xaj2].remove(false,false); log('    A'+(xai2+1)+' mp4 audio removed'); }catch(e){}
                }
            }
        }

        /* Extender las OTRAS pistas (BG image, adjustment layers…) a la nueva duración.
           También moverlas a position 0 si están desplazadas: si un clip de otra pista
           empieza en e.g. 152s, PP usa ese offset al insertar el nested en la secuencia
           principal, desplazando todo el nested hacia la derecha. */
        for(var vi2=0;vi2<cloneSeq.videoTracks.numTracks;vi2++){
            if(vi2===tgtIdx) continue;
            var vt2=cloneSeq.videoTracks[vi2];
            for(var ci2=0;ci2<vt2.clips.numItems;ci2++){
                var _vc2=vt2.clips[ci2];
                /* Mover a 0 si el clip no empieza al inicio de la secuencia */
                if(_vc2.start.seconds>0.5){
                    log('    V'+(vi2+1)+'['+ci2+'] start='+_vc2.start.seconds.toFixed(2)+'s → moviendo a 0');
                    try{ _vc2.start=makeTime(0); }catch(e){ log('    mover V'+(vi2+1)+'['+ci2+'] FAIL: '+e.message); }
                }
                try{ _vc2.end=makeTime(newEndSec); log('    extendido V'+(vi2+1)+'['+ci2+'] → '+newEndSec.toFixed(2)+'s'); }
                catch(e){ log('    extender V'+(vi2+1)+'['+ci2+'] FAIL: '+e.message); }
            }
        }

        /* Dar tiempo a PP para recalcular la duración del clon.
           Sin esta pausa, secuencias largas se insertan con la duración del template. */
        $.sleep(400);
        var cloneFinalEnd=newEndSec; /* fallback = duración del clip de vídeo */
        try{
            var ce=cloneSeq.end.seconds;
            /* Aceptar el valor del clon si es razonable (≥ esperado − 1 s) */
            if(ce>=newEndSec-1.0) cloneFinalEnd=ce;
            else log('  AVISO: cloneSeq.end='+ce.toFixed(2)+'s < esperado='+newEndSec.toFixed(2)+'s → usando duración del clip');
        }catch(e){}
        $.CB_LAST_CLONE_DUR=cloneFinalEnd;
        log('  clon listo: dur='+cloneFinalEnd.toFixed(2)+'s');
        return true;
    }

    /* ── Crear secuencia ─────────────────────────────────────────────── */
    /* Elimina todos los clips de todas las pistas de una secuencia (para
       usarla como plantilla vacía cuando "void" no existe). */
    function clearAllClips(seq){
        var vi,ci,cl;
        for(vi=0;vi<seq.videoTracks.numTracks;vi++){
            var vt=seq.videoTracks[vi];
            for(ci=vt.clips.numItems-1;ci>=0;ci--){
                cl=vt.clips[ci];
                try{ cl.remove(false,false); }catch(e1){
                    try{ cl.remove(); }catch(e2){}
                }
            }
        }
        for(vi=0;vi<seq.audioTracks.numTracks;vi++){
            var at=seq.audioTracks[vi];
            for(ci=at.clips.numItems-1;ci>=0;ci--){
                cl=at.clips[ci];
                try{ cl.remove(false,false); }catch(e1){
                    try{ cl.remove(); }catch(e2){}
                }
            }
        }
    }

    function createSeq(seqName, testSeq, targetBin){
        var seq=null;

        /* Prioridad 1: clonar "void" (secuencia vacía) — sin diálogo */
        var voidSeq=findSequenceByName(VOID_SEQ_NAME);
        if(voidSeq){
            log('  clonando "'+VOID_SEQ_NAME+'" → "'+seqName+'"');
            seq=duplicateVoidSeq(voidSeq, seqName, targetBin);
            if(seq) log('  clone OK: V='+seq.videoTracks.numTracks+' A='+seq.audioTracks.numTracks);
        }

        /* Prioridad 2: clonar "test2" y vaciarla — evita el diálogo aunque
           "void" no exista. Las pistas y settings quedan idénticos al template. */
        if(!seq && testSeq){
            log('  "'+VOID_SEQ_NAME+'" no encontrada → clonando "'+testSeq.name+'" y vaciando');
            seq=duplicateVoidSeq(testSeq, seqName, targetBin);
            if(seq){
                clearAllClips(seq);
                log('  clone+clear OK: V='+seq.videoTracks.numTracks+' A='+seq.audioTracks.numTracks);
            }
        }

        /* Prioridad 3: createNewSequence — puede mostrar diálogo en PP 2025+ */
        if(!seq){
            log('  AVISO: clone fallido → createNewSequence (puede aparecer diálogo)');
            var uid='cb_'+(new Date()).getTime();
            var origUI=null;
            try{ origUI=app.project.suppressUI; app.project.suppressUI=true; }catch(e){}
            try{ app.project.activeSequence=testSeq; seq=app.project.createNewSequence(seqName,uid); }
            catch(e){ log('  createNewSeq FAIL: '+e.message); }
            try{ if(origUI!==null) app.project.suppressUI=origUI; }catch(e){}
            if(!seq){ log('  seq null'); return null; }
            if(targetBin&&seq.projectItem){
                try{ seq.projectItem.moveBin(targetBin); }catch(e){}
            }
            try{ seq.setSettings(testSeq.getSettings()); }catch(e){ log('  setSettings FAIL: '+e.message); }
        }

        log('  pistas V='+seq.videoTracks.numTracks+' A='+seq.audioTracks.numTracks);

        /* Asegurar al menos 4 pistas de vídeo */
        var loopLimit=0;
        while(seq.videoTracks.numTracks<4&&loopLimit<6){
            loopLimit++;
            try{
                app.project.activeSequence=seq;
                $.sleep(250);
                if(typeof app.enableQE==='function') app.enableQE();
                var qs=qe.project.getActiveSequence();
                if(qs&&typeof qs.addTracks==='function'){ qs.addTracks(1,0); $.sleep(800); }
                else break;
            }catch(e){ log('  addTracks ERR['+loopLimit+']: '+e.message); break; }
        }
        log('  pistas finales V='+seq.videoTracks.numTracks);
        return seq;
    }

    /* ══ BUILD SEQUENCE ══════════════════════════════════════════════════ */
    function buildSequence(mainClips,tmplInfo,testSeq,seqName,targetBin,firstSeq,presetPath){
        log('\n[BUILD] "'+seqName+'" – '+mainClips.length+' clips');
        if(!mainClips.length){ log('  0 clips → skip'); return null; }

        var seq=createSeq(seqName,testSeq,targetBin);
        if(!seq) return null;
        try{ app.project.activeSequence=seq; }catch(e){}

        var numV=seq.videoTracks.numTracks;
        var v1=numV>=1?seq.videoTracks[0]:null;
        var v2=numV>=2?seq.videoTracks[1]:null;
        var v3=numV>=3?seq.videoTracks[2]:null;
        var v4=numV>=4?seq.videoTracks[3]:null;
        log('  tracks: v1='+(v1?'OK':'null')+' v2='+(v2?'OK':'null')
            +' v3='+(v3?'OK':'null')+' v4='+(v4?'OK':'null'));
        if(!v2){ log('  ERROR: sin V2'); return null; }

        /* ── V2: autor (webcam nested o directo) ───────────────────────── */
        log('  == V2 (autor) ==');
        var webcamSeq=USE_NESTED?findSequenceByName(WEBCAM_SEQ_NAME):null;
        if(webcamSeq) log('  webcam encontrada → modo nested');
        else          log('  modo directo (USE_NESTED=false) → efectos+preset en clip V2');
        var nestedBin=webcamSeq?getOrCreateBin(targetBin,'NestedSeq'):null;

        /* Pre-leer Motion Y guardar referencia al clip interno del template webcam.
           webcamInnerClip es el mp4 con UltraKey/Lumetri — fuente de efectos. */
        var webcamMotionSaved={};
        var webcamInnerClip=null;
        if(webcamSeq){
            outerWM: for(var _wmvi=0;_wmvi<webcamSeq.videoTracks.numTracks;_wmvi++){
                var _wmvt=webcamSeq.videoTracks[_wmvi];
                for(var _wmci=0;_wmci<_wmvt.clips.numItems;_wmci++){
                    var _wmc=_wmvt.clips[_wmci];
                    if(!_wmc||!_wmc.projectItem) continue;
                    var _wmn=_wmc.projectItem.name||'';
                    if(/adjustment/i.test(_wmn)) continue;
                    var _wmmp=''; try{ _wmmp=_wmc.projectItem.getMediaPath(); }catch(e){}
                    if(_wmmp&&/\.(mp4|mov|avi|mxf|mkv|m4v|wmv|r3d|braw)$/i.test(_wmmp)){
                        webcamMotionSaved=readMotionFromClip(_wmc);
                        webcamInnerClip=_wmc;   /* ← clip con UltraKey/Lumetri */
                        break outerWM;
                    }
                }
            }
            var _wmmk=''; for(var _wmk in webcamMotionSaved) _wmmk+=_wmk+' ';
            log('  webcamMotionSaved: '+(_wmmk.replace(/\s+$/,'')||'(vacío – se leerá desde clon)'));
            log('  webcamInnerClip: '+(webcamInnerClip?webcamInnerClip.projectItem.name:'(no encontrado)'));
        }

        var posV2=0, v2Clips=[], usedNested=[];
        for(var i=0;i<mainClips.length;i++){
            var insertItem=null, nestedOk=false, wmOut={};
            if(webcamSeq&&nestedBin){
                var nn='webcam_'+seqName+(mainClips.length>1?'_'+(i+1):'');
                var wClone=duplicateVoidSeq(webcamSeq,nn,nestedBin);
                if(wClone){
                    nestedOk=replaceVideoInWebcamClone(wClone,mainClips[i],tmplInfo.audioOffsetSec,targetBin,firstSeq&&i===0,webcamMotionSaved,webcamInnerClip,wmOut);
                    if(nestedOk) insertItem=wClone.projectItem;
                }
            }
            if(!insertItem) insertItem=mainClips[i]; /* fallback: vídeo directo */

            /* Resetear el in-point del project item del nested clone.
               Si la secuencia webcam (o su clon) tiene un in-point guardado
               (e.g. 152.4s), PP lo usa como offset al insertar con overwriteClip,
               desplazando el nested en la secuencia principal. */
            if(nestedOk&&insertItem){
                try{
                    var _nipCur=null;
                    try{ _nipCur=insertItem.getInPoint(); }catch(e){}
                    if(_nipCur) log('    nested inPoint antes: '+_nipCur.seconds.toFixed(3)+'s');
                    insertItem.setInPoint(makeTime(0),1);
                    log('    nested inPoint reseteado a 0');
                }catch(_nipe){ log('    nested inPoint reset FAIL: '+_nipe.message); }
            }

            /* Pausa antes de insertar el nested: da tiempo a PP para registrar la
               duración correcta del clon (crucial en vídeos largos). */
            if(nestedOk) $.sleep(300);
            var c2=tryInsert(v2,insertItem,posV2);
            if(c2){
                /* Verificar que el nested quedó en posV2. Si no, moverlo.
                   Nota: mover c2.start ajusta el inPoint en PP, por lo que el contenido
                   se desplaza también. Esta corrección sólo aplica como último recurso
                   si la solución en replaceVideoInWebcamClone (mover clips de otras pistas
                   a 0) no fue suficiente. */
                if(nestedOk&&Math.abs(c2.start.seconds-posV2)>0.5){
                    log('    AVISO: nested aún en pos incorrecta ('+c2.start.seconds.toFixed(2)+'s) tras fix de tracks');
                }
                /* Extender nested clip si PP reporta la duración antigua del template
                   en lugar de la del nuevo vídeo insertado dentro del clon. */
                if(nestedOk&&typeof $.CB_LAST_CLONE_DUR==='number'&&$.CB_LAST_CLONE_DUR>0.5){
                    var nestedTarget=posV2+$.CB_LAST_CLONE_DUR;
                    log('    nested inserido: end='+c2.end.seconds.toFixed(2)+'s target='+nestedTarget.toFixed(2)+'s');
                    if(nestedTarget>c2.end.seconds+0.5){
                        log('    extend nested: '+c2.end.seconds.toFixed(2)+'s → '+nestedTarget.toFixed(2)+'s');
                        log('    before extend: inPt='+c2.inPoint.seconds.toFixed(3)+' outPt='+c2.outPoint.seconds.toFixed(3));
                        try{ c2.end=makeTime(nestedTarget); }
                        catch(e){ log('    extend nested FAIL: '+e.message); }
                        log('    after extend:  inPt='+c2.inPoint.seconds.toFixed(3)+' outPt='+c2.outPoint.seconds.toFixed(3)+' end='+c2.end.seconds.toFixed(3));
                        /* Reintento: PP a veces ignora la primera extensión en secuencias largas */
                        if(c2.end.seconds<nestedTarget-0.5){
                            log('    extend nested: reintentando (actual='+c2.end.seconds.toFixed(2)+'s)...');
                            $.sleep(700);
                            try{ app.project.activeSequence=seq; }catch(e){}
                            try{ c2.end=makeTime(nestedTarget);
                                 log('    extend nested retry: '+c2.end.seconds.toFixed(2)+'s'); }
                            catch(e2){ log('    extend nested retry FAIL: '+e2.message); }
                        }
                    }
                    /* Fix outPoint y A2 audio: siempre, independientemente de si se
                       extendió el clip. En algunas versiones de PP el nested se coloca
                       con la duración correcta y el extend no se dispara, pero el outPt
                       y el audio linked siguen necesitando corrección. */
                    var _cloneDur=$.CB_LAST_CLONE_DUR; /* duración fuente del clon (no posición en timeline) */
                    if(Math.abs(c2.outPoint.seconds-_cloneDur)>0.5){
                        log('    outPt fix: '+c2.outPoint.seconds.toFixed(2)+'s → '+_cloneDur.toFixed(2)+'s');
                        try{ c2.outPoint=makeTime(_cloneDur); }catch(e){ log('    outPt FAIL: '+e.message); }
                    }
                    var _nestedName=insertItem.name||'';
                    for(var _nai=0;_nai<seq.audioTracks.numTracks;_nai++){
                        var _nat=seq.audioTracks[_nai];
                        for(var _naci=0;_naci<_nat.clips.numItems;_naci++){
                            var _nc=_nat.clips[_naci];
                            var _ncn='';
                            try{ _ncn=_nc.projectItem?_nc.projectItem.name:(_nc.name||''); }catch(e){}
                            if(_ncn===_nestedName||_nc.name===_nestedName){
                                log('    A'+(_nai+1)+' nested audio fix: '+_nc.start.seconds.toFixed(2)+'–'+_nc.end.seconds.toFixed(2)+'s');
                                try{ _nc.inPoint=makeTime(0); }catch(e){}
                                try{ _nc.start=makeTime(posV2); }catch(e){}
                                try{ _nc.end=makeTime(nestedTarget); }catch(e){}    /* nestedTarget = posV2+cloneDur */
                                try{ _nc.outPoint=makeTime(_cloneDur); }catch(e){}  /* duración fuente, no posición */
                                try{ _nc.inPoint=makeTime(0); }catch(e){}
                                log('    A'+(_nai+1)+' after fix: start='+_nc.start.seconds.toFixed(2)+' end='+_nc.end.seconds.toFixed(2)+' inPt='+_nc.inPoint.seconds.toFixed(2)+' outPt='+_nc.outPoint.seconds.toFixed(2));
                            }
                        }
                    }
                }
                v2Clips.push(c2);
                /* PP2025 bug: setValue no persiste en clips de nested sequences
                   cuando la nested era la secuencia activa durante el primer intento.
                   Reintentar ahora que el nested ya está insertado en la secuencia
                   del capítulo y esa secuencia es la activa. */
                if(nestedOk&&wmOut.clip&&wmOut.motion){
                    var _wmHas=false; for(var _wmk2 in wmOut.motion){ _wmHas=true; break; }
                    if(_wmHas){
                        try{ app.project.activeSequence=seq; }catch(e){}
                        $.sleep(300);
                        log('  Motion V1 (reintento post-insert, seq=capítulo):');
                        applyMotionSaved(wmOut.motion,wmOut.clip,getSeqDims());
                    }
                }
                usedNested.push(nestedOk);
                /* Audio offset solo en modo directo; en nested el audio va dentro */
                if(!nestedOk&&tmplInfo.audioOffsetSec!==0) applyAudioOffset(seq,c2,tmplInfo.audioOffsetSec);
                posV2=c2.end.seconds;
                try{ app.project.activeSequence=seq; }catch(e){}
            }
        }
        var mainEndSec=posV2;
        log('  V2: '+v2Clips.length+'/'+mainClips.length+'  end='+mainEndSec.toFixed(2)+'s');

        /* ── FX en V2 (solo clips directos; nested ya llevan efectos) ─── */
        if(tmplInfo.v2EffectClip){
            /* LOG diagnóstico: qué clip es la fuente de Motion para V2 */
            var tmplV2Pos='?';
            try{
                var tmplV2MC=getMotionComp(tmplInfo.v2EffectClip);
                if(tmplV2MC){
                    for(var tmpi=0;tmpi<tmplV2MC.properties.numItems;tmpi++){
                        var tmProp=tmplV2MC.properties[tmpi];
                        if(tmProp&&(tmProp.displayName==='Position'||/posici/i.test(tmProp.displayName))){
                            tmplV2Pos=jStr(tmProp.getValue()); break;
                        }
                    }
                }
            }catch(e){}
            log('  tmplV2EffectClip="'+tmplInfo.v2EffectClip.projectItem.name+'" pos='+tmplV2Pos);

            /* Modo directo: usar la AL de Nested.V2 como fuente de efectos.
               La secuencia "Nested" como clip no tiene Ultra Key/Lumetri en sí misma;
               los efectos reales (con Key Color correcto) están en su Adjustment Layer. */
            var v2DirectEffSrc=tmplInfo.v2EffectClip; /* default – secuencia clip */
            if(!webcamSeq){
                var _nseq=findSequenceByName(WEBCAM_SEQ_NAME);
                if(_nseq&&_nseq.videoTracks.numTracks>=2){
                    var _alTrk=_nseq.videoTracks[1];
                    for(var _alI=0;_alI<_alTrk.clips.numItems;_alI++){
                        var _alC=_alTrk.clips[_alI]; if(!_alC||!_alC.projectItem) continue;
                        var _alMp=''; try{_alMp=_alC.projectItem.getMediaPath();}catch(e){}
                        if(!_alMp||!/\.(mp4|mov|avi|mxf|mkv|wmv|m4v)$/i.test(_alMp)){
                            v2DirectEffSrc=_alC;
                            log('  v2DirectEffSrc: "'+_alC.projectItem.name+'" (AL de Nested.V2)');
                            break;
                        }
                    }
                }
                if(v2DirectEffSrc===tmplInfo.v2EffectClip) log('  WARN: AL no encontrada en Nested.V2 – usando secuencia clip');
            }

            log('  == FX autor ==');
            for(var fi=0;fi<v2Clips.length;fi++){
                var verbose=(firstSeq&&fi===0);
                if(usedNested[fi]){
                    /* El nested ya tiene Motion correcto DENTRO.
                       El clip EXTERIOR en V2 del timeline principal también debe tener
                       la posición del clip nested del test (v2EffectClip). */
                    log('    clip['+fi+']: nested → aplicar Motion exterior desde test');
                    applyMotionSaved(tmplInfo.v2MotionSaved,v2Clips[fi],getSeqDims());
                } else {
                    log('    clip['+fi+']: "'+v2Clips[fi].projectItem.name+'" (directo)');
                    applyV2Effects(v2DirectEffSrc,v2Clips[fi],seq,presetPath,verbose);
                    applyMotionSaved(tmplInfo.v2MotionSaved,v2Clips[fi],getSeqDims());
                    try{ app.project.activeSequence=seq; }catch(e){}
                }
            }
        }

        /* ── V3: tablero ───────────────────────────────────────────────── */
        if(v3){
            log('  == V3 (tablero) ==');
            var posV3=0, v3Clips=[], v3Sources=[];
            for(var i3=0;i3<mainClips.length;i3++){
                var c3=tryInsert(v3,mainClips[i3],posV3);
                if(c3){ v3Clips.push(c3); v3Sources.push(mainClips[i3]); posV3=c3.end.seconds; }
            }
            log('  V3: '+v3Clips.length);
            removeTablerAudio(seq,v3Clips);

            /* WAV: sólo en modo directo (sin nested). En modo nested el wav
               va dentro de cada clon de webcam, no en la secuencia principal. */
            if(!webcamSeq){
                log('  == WAV (modo directo) ==');
                for(var wi=0;wi<v3Sources.length;wi++){
                    findAndAddWav(v3Sources[wi], v3Clips[wi].start.seconds, seq, targetBin, v3Clips[wi].end.seconds);
                }
            }

            if(tmplInfo.v3EffectClip){
                log('  == FX tablero ==');
                try{ app.project.activeSequence=seq; }catch(e){}
                for(var fi3=0;fi3<v3Clips.length;fi3++){
                    /* PP2025: setValue falla silenciosamente en clips recién insertados
                       cuando PP aún no ha inicializado sus componentes Motion. Con muchos
                       capítulos el sleep único previo al loop no es suficiente; se necesita
                       una pausa POR CLIP para garantizar que cada uno esté listo. */
                    $.sleep(300);
                    try{ app.project.activeSequence=seq; }catch(e){}
                    applyEffectsFromTemplate(tmplInfo.v3EffectClip,v3Clips[fi3],seq,2,false);
                    /* Motion: applyMotionSaved usa valores pre-leídos (más fiable que leer
                       desde objetos clip en tiempo real). v3MotionByName sólo si coincide
                       el nombre exacto del clip con un clip del test. */
                    var srcName3=v3Sources[fi3]?v3Sources[fi3].name:'';
                    var _dims3=getSeqDims();
                    if(srcName3&&tmplInfo.v3MotionByName[srcName3]){
                        log('    clip['+fi3+']: Motion específico "'+srcName3+'"');
                        applyMotionSaved(tmplInfo.v3MotionByName[srcName3],v3Clips[fi3],_dims3);
                    } else {
                        log('    clip['+fi3+']: Motion desde v3MotionSaved');
                        applyMotionSaved(tmplInfo.v3MotionSaved,v3Clips[fi3],_dims3);
                    }
                    try{ app.project.activeSequence=seq; }catch(e){}
                }
            }
            /* outro sólo en V2 (no en V3) */
        }

        /* ── Outro V2 ──────────────────────────────────────────────────── */
        if(tmplInfo.outroItem){
            log('  == Outro ==');
            var ov2=tryInsert(v2,tmplInfo.outroItem,posV2);
            if(ov2) posV2=ov2.end.seconds;
        }

        /* ── V1: BG PNG ────────────────────────────────────────────────── */
        if(v1&&tmplInfo.bgItem){
            var bg=tryInsert(v1,tmplInfo.bgItem,0);
            if(bg){ try{ bg.end=makeTime(posV2); }catch(e){} }
        }

        /* ── V4: Fade vídeos con alpha ─────────────────────────────────── */
        /* Re-read V4: numTracks may have grown after addTracks completed */
        var bfTrack=seq.videoTracks.numTracks>=4?seq.videoTracks[3]:null;
        if(!bfTrack){
            /* Last attempt before giving up */
            try{
                app.project.activeSequence=seq;
                $.sleep(300);
                if(typeof app.enableQE==='function') app.enableQE();
                var qsF=qe.project.getActiveSequence();
                if(qsF&&typeof qsF.addTracks==='function'){ qsF.addTracks(1,0); $.sleep(1000); }
            }catch(eF){ log('  V4 addTracks final ERR: '+eF.message); }
            bfTrack=seq.videoTracks.numTracks>=4?seq.videoTracks[3]:null;
            if(bfTrack){
                log('  V4 retry → OK');
            } else {
                /* Fallback: use highest existing track so fades are always placed */
                bfTrack=seq.videoTracks.numTracks>0?seq.videoTracks[seq.videoTracks.numTracks-1]:null;
                log('  V4 no creada → fade en V'+seq.videoTracks.numTracks+' (fallback)');
            }
        }
        if(bfTrack&&mainEndSec>0){
            log('  == V4 fade vídeos ==');
            var fs=Math.min(FADE_SEC, mainEndSec*0.45);

            if(tmplInfo.fadeInItem){
                var bfi=tryInsert(bfTrack,tmplInfo.fadeInItem,0);
                if(bfi){ try{ bfi.end=makeTime(fs); }catch(e){} log('    fade_in @0→'+fs.toFixed(2)+'s ✓'); }
            } else { log('    fadeInItem NULL – ejecuta create_fade_videos.py'); }

            if(tmplInfo.fadeOutItem&&mainEndSec>fs){
                var bfoStart=Math.max(fs+0.1, mainEndSec-fs);
                var bfo=tryInsert(bfTrack,tmplInfo.fadeOutItem,bfoStart);
                if(bfo){ try{ bfo.end=makeTime(mainEndSec); }catch(e){} log('    fade_out @'+bfoStart.toFixed(2)+'→'+mainEndSec.toFixed(2)+'s ✓'); }
            } else if(!tmplInfo.fadeOutItem){ log('    fadeOutItem NULL – ejecuta create_fade_videos.py'); }
        }

        return seq;
    }

    /* ── Sección ─────────────────────────────────────────────────────── */
    var _firstSeq=true;
    function processSection(dir,bin,seqName,tmplInfo,testSeq,presetPath){
        log('\n[SECTION] '+seqName);
        if(!dir.exists){ log('  no existe'); return; }
        var vids=getVideos(dir);
        if(!vids.length){ log('  sin vídeos'); return; }
        var paths=[]; for(var i=0;i<vids.length;i++) paths.push(vids[i].fsName);
        var clips=importFilesToBin(paths,bin);
        buildSequence(clips,tmplInfo,testSeq,seqName,bin,_firstSeq,presetPath);
        _firstSeq=false;
        saveLog();
    }

    /* ══ MAIN ════════════════════════════════════════════════════════════ */
    if(!app||!app.project){ alert('Abre un proyecto primero.'); return; }
    log('=== Course Builder v106 ===');
    log('LOG: '+LOG_FILE);
    saveLog();
    try{ app.enableQE(); log('QE: enabled'); }catch(e){ log('QE FAIL: '+e.message); }

    var testSeq=findSequenceByName(TEMPLATE_NAME);
    if(!testSeq){ alert('No se encontró "'+TEMPLATE_NAME+'".'); saveLog(); return; }

    var voidSeqCheck=findSequenceByName(VOID_SEQ_NAME);
    log('void seq:     '+(voidSeqCheck?'"'+VOID_SEQ_NAME+'" encontrada':'NO encontrada – se usará createNewSequence'));

    var tmplInfo=readTemplateInfo(testSeq);
    log('BG:           '+(tmplInfo.bgItem?tmplInfo.bgItem.name:'NULL'));
    log('Outro:        '+(tmplInfo.outroItem?tmplInfo.outroItem.name:'NULL'));
    log('audioOffset:  '+tmplInfo.audioOffsetSec+'s');
    log('v2EffectClip: '+(tmplInfo.v2EffectClip?tmplInfo.v2EffectClip.projectItem.name:'NULL'));
    log('v3EffectClip: '+(tmplInfo.v3EffectClip?tmplInfo.v3EffectClip.projectItem.name:'NULL'));

    /* ── DIAGNÓSTICO Motion ──────────────────────────────────────────────
       Muestra en el log exactamente qué devuelve getValue() para cada
       propiedad Motion de los clips del template. CRÍTICO para depurar
       problemas de posición (32767 sentinel, normalizado vs píxeles, etc.) */
    log('\n=== DIAGNÓSTICO MOTION ===');
    (function(){
        function diagMotion(label, clip){
            if(!clip){ log(label+': clip NULL'); return; }
            var mc=getMotionComp(clip);
            if(!mc){ log(label+': sin Motion comp'); return; }
            log(label+' ("'+(clip.projectItem?clip.projectItem.name:'?')+'"): '+mc.properties.numItems+' props');
            for(var _di=0;_di<mc.properties.numItems;_di++){
                var _dp=mc.properties[_di];
                if(!_dp||!_dp.displayName) continue;
                try{
                    var _dv=_dp.getValue();
                    log('  "'+_dp.displayName+'" = '+jStr(_dv)+'  (sentinel='+isMotionSentinel(_dv)+')');
                }catch(_de){ log('  "'+_dp.displayName+'" getValue() ERR: '+_de.message); }
            }
        }
        diagMotion('v2EffectClip', tmplInfo.v2EffectClip);
        diagMotion('v3EffectClip', tmplInfo.v3EffectClip);
        /* Webcam template */
        var _wseq=findSequenceByName(WEBCAM_SEQ_NAME);
        if(_wseq){
            for(var _wvi=0;_wvi<_wseq.videoTracks.numTracks;_wvi++){
                var _wvt=_wseq.videoTracks[_wvi];
                for(var _wci=0;_wci<_wvt.clips.numItems;_wci++){
                    var _wc=_wvt.clips[_wci];
                    if(!_wc||!_wc.projectItem) continue;
                    var _wmp=''; try{_wmp=_wc.projectItem.getMediaPath();}catch(e){}
                    if(_wmp&&/\.(mp4|mov|avi|mxf|mkv|m4v|wmv|r3d|braw)$/i.test(_wmp)){
                        diagMotion('webcam V'+(1+_wvi)+'['+_wci+']', _wc);
                        break;
                    }
                }
            }
        } else { log('webcam "'+WEBCAM_SEQ_NAME+'": NO encontrada'); }
    })();
    log('=== FIN DIAGNÓSTICO ===\n');
    saveLog();

    /* Ruta del preset */
    var presetPath=ASSETS_PATH+'/'+PRESET_FILENAME;
    if(!new File(presetPath).exists){
        try{
            var scriptDir=new File($.fileName).parent.fsName;
            presetPath=scriptDir+'/'+PRESET_FILENAME;
        }catch(e){}
    }
    if(new File(presetPath).exists){
        log('preset:       '+presetPath);
    } else {
        log('preset:       NO ENCONTRADO');
        presetPath=null;
    }

    saveLog();

    /* ── Auto-detectar courseRoot desde la ruta del clip de prueba ────── */
    var courseRoot=null, selectedFolder=null;
    (function(){
        /* Busca la ruta de un vídeo real en una secuencia.
           Si el clip es un nested sequence (sin mediaPath), entra dentro. depth≤2. */
        function findVideoMediaPath(seq, depth){
            if(!seq||depth>2) return '';
            for(var vi=0;vi<seq.videoTracks.numTracks;vi++){
                var vt=seq.videoTracks[vi];
                for(var ci=0;ci<vt.clips.numItems;ci++){
                    var clip=vt.clips[ci];
                    if(!clip||!clip.projectItem) continue;
                    var mp='';
                    try{ mp=clip.projectItem.getMediaPath(); }catch(e){}
                    if(mp&&/\.(mp4|mov|avi|mxf|mkv|m4v|wmv|r3d|braw)$/i.test(mp)) return mp;
                    /* Sin mediaPath → puede ser nested sequence; buscar dentro */
                    if(!mp){
                        var inner=findSequenceByName(clip.projectItem.name);
                        if(inner){
                            var r=findVideoMediaPath(inner,depth+1);
                            if(r) return r;
                        }
                    }
                }
            }
            return '';
        }

        var mp=findVideoMediaPath(testSeq,0);
        if(!mp){ log('  auto-detect: sin mediaPath en template ni en sus nested'); return; }
        log('  auto-detect desde: "'+mp+'"');
        /* Subir por el árbol hasta encontrar un directorio que contenga
           EXACTAMENTE 1_Chapters o 1_Capítulos (sin fallback genérico, para
           no parar dentro de 1_Chapters y confundirla con la raíz del curso). */
        var dir=new File(mp).parent;
        for(var d=0;d<15;d++){
            if(!dir||!dir.exists) break;
            if(hasCandidateChaptersFolder(new Folder(dir.fsName))){
                courseRoot=new Folder(dir.fsName);
                selectedFolder=new Folder(dir.fsName); /* mismo nivel = bin raíz del curso */
                log('  auto-detect OK: courseRoot="'+courseRoot.fsName+'"');
                log('  auto-detect OK: binName="'+selectedFolder.name+'"');
                return;
            }
            dir=dir.parent;
        }
        log('  auto-detect: carpeta de capítulos no encontrada en el árbol de "'+mp+'"');
    })();

    if(!courseRoot){
        /* Fallback: pedir carpeta al usuario */
        log('  fallback → diálogo de selección de carpeta');
        selectedFolder=Folder.selectDialog('Selecciona la carpeta raíz del curso');
        if(!selectedFolder||!selectedFolder.exists){ saveLog(); return; }
        courseRoot=selectedFolder;
        if(!findChaptersFolder(selectedFolder)){
            /* Intentar un nivel más abajo */
            var topSubs=sortedByName(selectedFolder.getFiles(function(f){return f instanceof Folder;}));
            for(var si=0;si<topSubs.length;si++){
                if(findChaptersFolder(topSubs[si])){ courseRoot=topSubs[si]; break; }
            }
            if(courseRoot===selectedFolder){ alert('No se encontró carpeta de capítulos (1_Chapters / 1_Capítulos).'); saveLog(); return; }
        }
    }
    log('courseRoot: '+courseRoot.fsName);

    /* Assets */
    var courseBin=getOrCreateBin(app.project.rootItem,cleanName(selectedFolder.name));
    var assetsFolder=new Folder(ASSETS_PATH);

    if(!tmplInfo.bgItem)      tmplInfo.bgItem      =findByNameSubstr(app.project.rootItem,BG_SUBSTR);
    if(!tmplInfo.outroItem)   tmplInfo.outroItem   =findByNameSubstr(app.project.rootItem,OUTRO_SUBSTR);
    if(!tmplInfo.fadeInItem)  tmplInfo.fadeInItem  =findByNameSubstr(app.project.rootItem,FADE_IN_SUBSTR);
    if(!tmplInfo.fadeOutItem) tmplInfo.fadeOutItem =findByNameSubstr(app.project.rootItem,FADE_OUT_SUBSTR);

    var missingItems=(!tmplInfo.bgItem||!tmplInfo.outroItem||!tmplInfo.fadeInItem||!tmplInfo.fadeOutItem);
    if(missingItems&&assetsFolder.exists){
        log('Importando assets faltantes...');
        var assetsBin=getOrCreateBin(courseBin,'Video Editing Assets IA');
        importFolderRecursive(assetsFolder,assetsBin);
        if(!tmplInfo.bgItem)      tmplInfo.bgItem      =findByNameSubstr(assetsBin,BG_SUBSTR);
        if(!tmplInfo.outroItem)   tmplInfo.outroItem   =findByNameSubstr(assetsBin,OUTRO_SUBSTR);
        if(!tmplInfo.fadeInItem)  tmplInfo.fadeInItem  =findByNameSubstr(assetsBin,FADE_IN_SUBSTR);
        if(!tmplInfo.fadeOutItem) tmplInfo.fadeOutItem =findByNameSubstr(assetsBin,FADE_OUT_SUBSTR);
    }

    log('BG final:     '+(tmplInfo.bgItem?tmplInfo.bgItem.name:'NULL'));
    log('fadeInItem:   '+(tmplInfo.fadeInItem?tmplInfo.fadeInItem.name:'NULL – ejecuta create_fade_videos.py'));
    log('fadeOutItem:  '+(tmplInfo.fadeOutItem?tmplInfo.fadeOutItem.name:'NULL – ejecuta create_fade_videos.py'));
    saveLog();

    /* ── Carpeta de capítulos (1_Chapters / 1_Capítulos / fallback) ──── */
    var chapDir=findChaptersFolder(courseRoot);
    if(chapDir&&chapDir.exists){
        var chapBin=getOrCreateBin(courseBin,chapDir.name);
        var chapSubs=sortedByName(chapDir.getFiles(function(f){return f instanceof Folder;}));
        log('\n=== '+chapSubs.length+' capítulos ===');
        for(var ci2=0;ci2<chapSubs.length;ci2++){
            try{
                var cf=chapSubs[ci2], cfName=cleanName(cf.name);
                log('\n--- [CH '+(ci2+1)+'/'+chapSubs.length+'] "'+cfName+'" ---');
                /* Skip folders marked as deleted/unused */
                if(shouldSkipFolder(cfName)){ log('  → carpeta marcada para omitir, skip'); continue; }
                /* Skip chapters that already have a sequence in the project */
                if(seqExists(cfName)){ log('  → secuencia ya existe, skip'); continue; }
                var cBin=getOrCreateBin(chapBin,cfName);
                var vids2=getVideos(cf);
                if(!vids2.length){ log('  skip (sin vídeos)'); continue; }
                var paths2=[]; for(var fii=0;fii<vids2.length;fii++) paths2.push(vids2[fii].fsName);
                var clips2=importFilesToBin(paths2,cBin);
                buildSequence(clips2,tmplInfo,testSeq,cfName,cBin,_firstSeq,presetPath);
                _firstSeq=false;
            }catch(err){ log('[CH '+(ci2+1)+'] ERR: '+err.message); }
            saveLog();
            /* Modo test: parar tras la primera secuencia */
            if($.CB_TEST_ONLY){ log('\n[TEST MODE] Detenido tras la primera secuencia.'); saveLog(); return; }
        }
    }

    /* Modo test: no procesar secciones extra */
    if($.CB_TEST_ONLY){ log('\n[TEST MODE] Sin procesar secciones extra.'); saveLog(); return; }

    /* ── Resto de secciones (cualquier subfolder con vídeos excepto 1_Chapters) ── */
    var allCourseSubs=sortedByName(courseRoot.getFiles(function(f){return f instanceof Folder;}));
    for(var si2=0;si2<allCourseSubs.length;si2++){
        var sf=allCourseSubs[si2], sfName=cleanName(sf.name);
        if(chapDir&&sfName===chapDir.name) continue;  /* ya procesado */
        if(sfName.charAt(0)==='-') continue;          /* carpetas internas como -audio exports */
        if(shouldSkipFolder(sfName)){ log('\n[SECTION] '+sfName+' → marcada para omitir, skip'); continue; }
        if(seqExists(sfName)){ log('\n[SECTION] '+sfName+' → ya existe, skip'); continue; }
        var sfVids=getVideos(sf);
        if(!sfVids.length) continue;                  /* sin vídeos → skip */
        log('\n[SECTION] '+sfName+' ('+sfVids.length+' vídeos)');
        processSection(sf,getOrCreateBin(courseBin,sfName),sfName,tmplInfo,testSeq,presetPath);
        saveLog();
    }

    log('\n=== DONE ===');
    saveLog();

})();
