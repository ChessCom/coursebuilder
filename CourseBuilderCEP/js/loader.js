/* Course Builder — local loader (never needs updating)
   1. If panel_local.js exists next to index.html → use it (dev/testing)
   2. Otherwise → fetch panel.js from GitHub and eval it               */
(function () {
    var https = require('https');
    var http  = require('http');
    var fs    = require('fs');
    var path  = require('path');

    var PANEL_URL = 'https://raw.githubusercontent.com/ChessCom/coursebuilder/main/panel.js';

    /* ── Local override ── */
    try {
        var _loc   = decodeURIComponent(window.location.href);
        var _html  = _loc.replace(/^file:\/\/\//, '/').replace(/^\/([A-Za-z]:)/, '$1').replace(/\/index\.html.*$/, '');
        var _real  = fs.realpathSync(_html);
        var _local = path.join(_real, 'panel_local.js');
        if (fs.existsSync(_local)) {
            eval(fs.readFileSync(_local, 'utf8'));  /* jshint ignore:line */
            return;
        }
    } catch (e) {}

    /* ── Fetch from GitHub ── */
    function doGet(url, redirects) {
        if (redirects > 5) {
            document.getElementById('app').innerHTML = '<p style="color:#f44336;padding:10px">Error: too many redirects</p>';
            return;
        }
        var proto = url.indexOf('https://') === 0 ? https : http;
        proto.get(url, function (res) {
            if (res.statusCode === 301 || res.statusCode === 302 || res.statusCode === 303) {
                res.resume();
                doGet(res.headers.location, redirects + 1);
                return;
            }
            if (res.statusCode !== 200) {
                document.getElementById('app').innerHTML = '<p style="color:#f44336;padding:10px">Error loading panel: HTTP ' + res.statusCode + '</p>';
                return;
            }
            var data = '';
            res.setEncoding('utf8');
            res.on('data', function (c) { data += c; });
            res.on('end', function () {
                try { eval(data); }  /* jshint ignore:line */
                catch (e) {
                    document.getElementById('app').innerHTML = '<p style="color:#f44336;padding:10px">Panel error: ' + e.message + '</p>';
                }
            });
        }).on('error', function () {
            document.getElementById('app').innerHTML = '<p style="color:#f44336;padding:10px">No internet connection</p>';
        });
    }
    doGet(PANEL_URL + '?t=' + Date.now(), 0);
})();
