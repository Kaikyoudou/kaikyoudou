// Simple JS: mobile menu toggle + basic image-protection deterrents
document.addEventListener('DOMContentLoaded', function () {
  // Mobile menu toggle
  var btn = document.querySelector('.menu-toggle');
  var nav = document.querySelector('.main-nav');
  if (btn && nav) {
    btn.addEventListener('click', function () {
      if (nav.style.display === 'block') {
        nav.style.display = '';
      } else {
        nav.style.display = 'block';
      }
    });
  }

  // Basic image protection deterrents
// Inject display watermark overlays onto images with class 'protect-img'
function injectImageWatermarks(text) {
  const targets = document.querySelectorAll('img.protect-img');
  targets.forEach(img => {
    // ensure the parent is positioned
    const wrapper = img.parentElement;
    if (!wrapper) return;
    if (getComputedStyle(wrapper).position === 'static') wrapper.style.position = 'relative';

    // avoid inserting multiple overlays
    if (wrapper.querySelector('.img-watermark-overlay')) return;

    const overlay = document.createElement('div');
    overlay.className = 'img-watermark-overlay';
    overlay.textContent = text || '海峡堂';
    wrapper.appendChild(overlay);
  });
}

// Run watermark injection on load and when new images are added
function setupWatermarking() {
  injectImageWatermarks('海峡堂');
  const obs = new MutationObserver(mutations => {
    for (const m of mutations) {
      if (m.type === 'childList') {
        injectImageWatermarks('海峡堂');
      }
    }
  });
  obs.observe(document.body, {childList:true, subtree:true});
}

document.addEventListener('DOMContentLoaded', () => {
  try{ setupWatermarking(); }catch(e){}
});

  // NOTE: These are client-side deterrents only. They make casual saving harder
  // (right-click / drag blocked, transparent overlay), but cannot fully prevent
  // determined users from capturing images (screenshots or devtools).
  function protectImages() {
    var imgs = document.querySelectorAll('img');
    imgs.forEach(function (img) {
      // disable dragging of images
      img.addEventListener('dragstart', function (e) { e.preventDefault(); });
      // disable context menu on images
      img.addEventListener('contextmenu', function (e) { e.preventDefault(); });
      // CSS hints to disable selection/dragging
      img.style.userSelect = 'none';
      img.style.webkitUserDrag = 'none';
      img.setAttribute('draggable', 'false');

      // Add a transparent overlay to intercept long-press / right-click on touch
      try {
        var wrapper = img.parentElement;
        // Only add overlay when parent is a block element and not already processed
        if (wrapper && !wrapper.classList.contains('img-protect-wrap')) {
          // make wrapper positioned so overlay can cover it
          var computed = window.getComputedStyle(wrapper);
          if (computed.position === 'static') {
            wrapper.style.position = 'relative';
          }
          wrapper.classList.add('img-protect-wrap');
          var ov = document.createElement('div');
          ov.className = 'img-overlay';
          // make overlay non-focusable and hidden from assistive tech
          ov.setAttribute('aria-hidden', 'true');
          ov.style.position = 'absolute';
          ov.style.zIndex = '10';
          ov.style.background = 'transparent';

          // Position & size overlay to cover the image only (not entire wrapper)
          function positionOverlay() {
            try {
              var top = img.offsetTop || 0;
              var left = img.offsetLeft || 0;
              var w = img.offsetWidth || img.clientWidth || img.naturalWidth || 0;
              var h = img.offsetHeight || img.clientHeight || img.naturalHeight || 0;
              ov.style.top = top + 'px';
              ov.style.left = left + 'px';
              ov.style.width = w + 'px';
              ov.style.height = h + 'px';
              // Do not block pointer events; we already disable right-click/drag on images.
              // Keep overlay visible but let clicks pass through so links/buttons remain usable.
              ov.style.pointerEvents = 'none';
              // copy image border radius when possible
              try { ov.style.borderRadius = window.getComputedStyle(img).borderRadius; } catch(e){}
            } catch (e) {
              // ignore
            }
          }

          wrapper.appendChild(ov);
          positionOverlay();
          img.addEventListener('load', positionOverlay);
          window.addEventListener('resize', positionOverlay);
        }
      } catch (e) {
        // ignore
      }
    });
  }

  protectImages();
  // Re-run protection if DOM changes (e.g., dynamic content)
  var ro = new MutationObserver(function () { protectImages(); });
  ro.observe(document.body, { childList: true, subtree: true });
});

