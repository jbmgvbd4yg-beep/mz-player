/* iPhone Safari 向けの補助パッチ。ローダーがゲームの index.html に自動で読み込ませます。
   ゲーム本体の js/ data/ img/ audio/ は一切書き換えません。 */
(function () {
  'use strict';

  var cfg = {};
  try { cfg = JSON.parse(localStorage.getItem('mzp.cfg') || '{}'); } catch (e) { cfg = {}; }

  var st = document.createElement('style');
  st.textContent =
    'html,body{margin:0;padding:0;width:100%;height:100%;overflow:hidden;background:#000;}' +
    'overscroll-behavior:none;touch-action:none;-webkit-touch-callout:none;' +
    '-webkit-user-select:none;user-select:none;-webkit-tap-highlight-color:transparent}' +
    '#mzp-btn{position:fixed;left:max(10px,env(safe-area-inset-left));bottom:max(10px,env(safe-area-inset-bottom));' +
    'z-index:99999;min-width:64px;height:40px;padding:0 14px;border-radius:20px;border:1px solid rgba(255,255,255,.55);' +
    'background:rgba(0,0,0,.45);color:#fff;font:600 14px/38px -apple-system,sans-serif;text-align:center;' +
    'opacity:.55;touch-action:none;-webkit-user-select:none;user-select:none}' +
    '#mzp-btn:active{opacity:1;background:rgba(255,255,255,.3)}';
  (document.head || document.documentElement).appendChild(st);

  ['gesturestart', 'gesturechange', 'gestureend', 'contextmenu', 'dragstart'].forEach(function (t) {
    document.addEventListener(t, function (e) { e.preventDefault(); }, { passive: false });
  });
  document.addEventListener('touchmove', function (e) { e.preventDefault(); }, { passive: false });

  var tries = 0;
  var timer = setInterval(function () {
    tries++;
    if (window.Graphics && Graphics._stretchHeight) {
      Graphics._stretchHeight = function () { return document.documentElement.clientHeight; };
      clearInterval(timer);
    } else if (tries > 500) {
      clearInterval(timer);
    }
  }, 10);

  try {
    if (navigator.storage && navigator.storage.persist) navigator.storage.persist().catch(function () {});
  } catch (e) { /* ignore */ }

  function sendKey(code, down) {
    if (!window.Input) return;
    var f = down ? Input._onKeyDown : Input._onKeyUp;
    if (f) f.call(Input, { keyCode: code, preventDefault: function () {} });
  }
  function tapKey(code) {
    sendKey(code, true);
    setTimeout(function () { sendKey(code, false); }, 100);
  }

  function addButton() {
    if (cfg.btn === false || document.getElementById('mzp-btn')) return;
    var b = document.createElement('div');
    b.id = 'mzp-btn';
    b.textContent = '☰ 戻る';
    function swallow(e) { e.stopPropagation(); e.preventDefault(); }
    b.addEventListener('touchstart', function (e) { swallow(e); tapKey(27); }, { passive: false });
    b.addEventListener('touchend', swallow, { passive: false });
    b.addEventListener('mousedown', function (e) { swallow(e); tapKey(27); });
    b.addEventListener('mouseup', swallow);
    document.body.appendChild(b);
  }
  if (document.body) addButton();
  else document.addEventListener('DOMContentLoaded', addButton);
})();
