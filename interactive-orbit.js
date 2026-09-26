(function(){
  'use strict';
  const orbit=document.querySelector('.orbit');
  if(!orbit)return;
  const motion=window.matchMedia('(prefers-reduced-motion: reduce)');
  const IDLE=360/46, MAX_SPEED=480, DECAY=3.4;
  let angle=0, velocity=motion.matches?0:IDLE, frame=0, lastFrame=0, gesture=null;
  let visible=true;
  const clamp=(n,min,max)=>Math.max(min,Math.min(max,n));
  const paint=()=>orbit.style.setProperty('--orbit-angle',angle+'deg');
  function wake(){if(!frame&&visible&&!document.hidden&&!motion.matches&&!gesture?.active)frame=requestAnimationFrame(tick);}
  function tick(now){
    frame=0;
    const dt=lastFrame?Math.min((now-lastFrame)/1000,.05):0;
    lastFrame=now;
    if(!gesture?.active){
      // Integrate the exponential exactly so release remains continuous at any refresh rate.
      const excess=velocity-IDLE, decay=Math.exp(-DECAY*dt);
      angle+=IDLE*dt+excess*(1-decay)/DECAY;
      velocity=IDLE+excess*decay;
      paint();
    }
    wake();
  }
  function stopFrame(){cancelAnimationFrame(frame);frame=0;lastFrame=0;}
  function finish(event,cancelled=false){
    if(!gesture||(event&&event.pointerId!==gesture.id))return;
    const old=gesture;gesture=null;orbit.removeAttribute('data-dragging');
    if(orbit.hasPointerCapture(old.id))orbit.releasePointerCapture(old.id);
    // A held-still finger should not release stale momentum.
    if(cancelled||motion.matches||performance.now()-old.time>100)velocity=motion.matches?0:IDLE;
    lastFrame=0;wake();
  }
  orbit.addEventListener('pointerdown',event=>{
    if(!event.isPrimary||event.button!==0||gesture)return;
    const width=orbit.getBoundingClientRect().width;
    gesture={id:event.pointerId,x:event.clientX,y:event.clientY,lastX:event.clientX,time:performance.now(),scale:360/(width*1.5),active:false};
  });
  orbit.addEventListener('pointermove',event=>{
    if(!gesture||event.pointerId!==gesture.id)return;
    const dx=event.clientX-gesture.x,dy=event.clientY-gesture.y;
    if(!gesture.active){
      if(Math.max(Math.abs(dx),Math.abs(dy))<6)return;
      // Yield a vertical gesture before capture. Never prevent the browser's scroll.
      if(Math.abs(dy)>Math.abs(dx)){finish(event,true);return;}
      gesture.active=true;velocity=0;stopFrame();
      orbit.setPointerCapture(event.pointerId);orbit.setAttribute('data-dragging','');
    }
    const now=performance.now(),dt=Math.max((now-gesture.time)/1000,.008);
    const delta=(event.clientX-gesture.lastX)*gesture.scale;
    angle+=delta;
    const sample=clamp(delta/dt,-MAX_SPEED,MAX_SPEED);
    velocity=clamp(velocity*.25+sample*.75,-MAX_SPEED,MAX_SPEED);
    gesture.lastX=event.clientX;gesture.time=now;paint();
  });
  orbit.addEventListener('pointerup',event=>finish(event));
  orbit.addEventListener('pointercancel',event=>finish(event,true));
  // Touch starts with implicit capture on the SVG/child under the finger. Its
  // bubbled lost-capture event during transfer to the orbit is not a cancellation.
  orbit.addEventListener('lostpointercapture',event=>{if(event.target===orbit)finish(event,true);});
  orbit.addEventListener('pointerleave',event=>{if(gesture&&!gesture.active)finish(event,true);});
  orbit.addEventListener('dragstart',event=>event.preventDefault());
  orbit.addEventListener('keydown',event=>{
    if(!['ArrowLeft','ArrowRight','Enter',' '].includes(event.key))return;
    event.preventDefault();finish(null,true);
    const direction=event.key==='ArrowLeft'?-1:1;
    angle+=direction*15;velocity=motion.matches?0:direction*120;paint();wake();
  });
  function suspend(){finish(null,true);stopFrame();}
  window.addEventListener('blur',suspend);
  window.addEventListener('resize',()=>{finish(null,true);lastFrame=0;});
  document.addEventListener('visibilitychange',()=>{if(document.hidden)suspend();else wake();});
  window.addEventListener('focus',wake);
  motion.addEventListener('change',()=>{suspend();velocity=motion.matches?0:IDLE;wake();});
  if('IntersectionObserver'in window)new IntersectionObserver(entries=>{
    visible=entries[0].isIntersecting;
    if(visible){lastFrame=0;wake();}else suspend();
  }).observe(orbit);
  orbit.setAttribute('data-interactive','');orbit.setAttribute('role','button');
  orbit.setAttribute('tabindex','0');orbit.setAttribute('aria-keyshortcuts','ArrowLeft ArrowRight Enter Space');
  paint();wake();
})();
