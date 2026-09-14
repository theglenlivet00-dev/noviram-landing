/* Presentation only: iOS keyboards resize the visual viewport, not always dvh.
   Never change viewport scale; pinch zoom remains owned by the browser. */
(function () {
  'use strict';
  const viewport = window.visualViewport;
  const shell = document.querySelector('.noviram-ai-shell');
  if (!viewport || !shell) return;
  function fitVisibleViewport() {
    if (Math.abs(viewport.scale - 1) > 0.01) return;
    shell.style.setProperty('--chat-visible-top', (viewport.offsetTop + viewport.height * 0.12) + 'px');
    shell.style.setProperty('--chat-visible-height', (viewport.height * 0.88) + 'px');
  }
  viewport.addEventListener('resize', fitVisibleViewport, { passive: true });
  viewport.addEventListener('scroll', fitVisibleViewport, { passive: true });
  fitVisibleViewport();
})();
