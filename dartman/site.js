/* DARTMAN — site.js · motion + interactions (GSAP 3 + ScrollTrigger + SplitText, Lenis) */
(()=>{
const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
const $=(s,c=document)=>c.querySelector(s),$$=(s,c=document)=>[...c.querySelectorAll(s)];
gsap.registerPlugin(ScrollTrigger,SplitText);

/* smooth scroll */
let lenis=null;
if(!reduce&&matchMedia('(pointer:fine)').matches){
  lenis=new Lenis({lerp:.09,wheelMultiplier:.95,smoothWheel:true});
  lenis.on('scroll',ScrollTrigger.update);
  gsap.ticker.add(t=>lenis.raf(t*1000));gsap.ticker.lagSmoothing(0);
  $$('a[href^="#"]').forEach(a=>a.addEventListener('click',e=>{const id=a.getAttribute('href');if(id.length>1&&$(id)){e.preventDefault();lenis.scrollTo(id,{offset:-90});}}));
}

/* nav */
const nav=$('.nav');const onScroll=()=>nav&&nav.classList.toggle('solid',scrollY>40);onScroll();addEventListener('scroll',onScroll,{passive:true});
const burger=$('.burger'),mnav=$('.mnav');
burger&&burger.addEventListener('click',()=>{const open=!mnav.classList.contains('open');mnav.classList.toggle('open',open);document.body.classList.toggle('menu-open',open);burger.setAttribute('aria-expanded',open);lenis&&(open?lenis.stop():lenis.start());});

/* cursor */
if(matchMedia('(pointer:fine)').matches&&!reduce){
  const cur=document.createElement('div');cur.className='cur';document.body.appendChild(cur);
  let x=innerWidth/2,y=innerHeight/2,cx=x,cy=y;addEventListener('pointermove',e=>{x=e.clientX;y=e.clientY});
  gsap.ticker.add(()=>{cx+=(x-cx)*.22;cy+=(y-cy)*.22;cur.style.transform=`translate(${cx}px,${cy}px) translate(-50%,-50%)`;});
  $$('a,button,.sw,.tile,label,input,.ba').forEach(el=>{el.addEventListener('pointerenter',()=>document.body.classList.add('cur-link'));el.addEventListener('pointerleave',()=>document.body.classList.remove('cur-link'));});
}

/* magnetic buttons */
if(matchMedia('(pointer:fine)').matches&&!reduce)$$('.btn').forEach(b=>{b.classList.add('magnetic');b.addEventListener('pointermove',e=>{const r=b.getBoundingClientRect();gsap.to(b,{x:(e.clientX-r.left-r.width/2)*.18,y:(e.clientY-r.top-r.height/2)*.28,duration:.5,ease:'power3.out'});});b.addEventListener('pointerleave',()=>gsap.to(b,{x:0,y:0,duration:.7,ease:'elastic.out(1,.4)'}));});

/* reveals */
$$('.rv').forEach(el=>ScrollTrigger.create({trigger:el,start:'top 88%',once:true,onEnter:()=>el.classList.add('in')}));
/* split headings */
if(!reduce){
  $$('[data-split]').forEach(h=>{
    const type=h.dataset.split||'lines';
    const st=new SplitText(h,{type:type==='chars'?'chars,words':'lines',linesClass:'line',wordsClass:'word',charsClass:'ch'});
    const targets=type==='chars'?st.chars:st.lines;
    gsap.set(targets,{yPercent:type==='chars'?110:100,opacity:type==='chars'?1:0});
    ScrollTrigger.create({trigger:h,start:'top 85%',once:true,onEnter:()=>gsap.to(targets,{yPercent:0,opacity:1,duration:type==='chars'?.9:1.1,stagger:type==='chars'?.018:.09,ease:'expo.out',delay:+(h.dataset.delay||0)})});
  });
}else{$$('[data-split]').forEach(h=>h.style.opacity=1);}
/* counters */
$$('[data-count]').forEach(el=>{const to=parseFloat(el.dataset.count),dec=(el.dataset.dec|0),suf=el.dataset.suf||'';el.textContent=(0).toFixed(dec)+suf;
  ScrollTrigger.create({trigger:el,start:'top 88%',once:true,onEnter:()=>{const o={v:0};gsap.to(o,{v:to,duration:1.6,ease:'power3.out',onUpdate:()=>el.textContent=(el.dataset.plain!==undefined?o.v.toFixed(dec):o.v.toFixed(dec).replace(/\B(?=(\d{3})+(?!\d))/g,','))+suf});}});});
/* bars */
$$('.bar').forEach(b=>ScrollTrigger.create({trigger:b,start:'top 90%',once:true,onEnter:()=>b.querySelector('i').style.setProperty('--w',b.dataset.w+'%')}));
/* parallax images */
if(!reduce)$$('[data-plx]').forEach(el=>gsap.to(el,{yPercent:+(el.dataset.plx||-10),ease:'none',scrollTrigger:{trigger:el.parentElement,start:'top bottom',end:'bottom top',scrub:true}}));

/* story (pinned media + steps) */
$$('.story').forEach(s=>{const imgs=$$('.media img',s),steps=$$('.step',s),cap=$('.media .cap',s),idx=$('.media .idx',s);
  const show=i=>{imgs.forEach((im,k)=>im.classList.toggle('on',k===i));cap&&(cap.textContent=steps[i].dataset.cap||'');idx&&(idx.textContent=String(i+1).padStart(2,'0'));};show(0);
  steps.forEach((st,i)=>ScrollTrigger.create({trigger:st,start:'top 60%',end:'bottom 40%',onEnter:()=>show(i),onEnterBack:()=>show(i)}));});

/* 3D — lazy: hero only on desktop after load+idle; viewers when scrolled into view */
const lite=matchMedia('(max-width:900px)').matches||(navigator.connection&&navigator.connection.saveData);
let mod3d=null;const load3d=async()=>mod3d||(mod3d=await import('/dartman/edmini3d.js'));
async function mountOne(c){if(c.__edmini||c.__busy)return;c.__busy=1;const mod=await load3d();
  const api=await mod.mount(c,{finish:c.dataset.finish||'black',camera:c.dataset.camera||'hero',interactive:c.dataset.interactive!=='false',baseRotY:parseFloat(c.dataset.rot||'-0.42'),offsetX:parseFloat(c.dataset.offset||'0')});
  c.classList.add('ready');
  if(c.dataset.scrub&&!reduce){ScrollTrigger.create({trigger:c.closest('section')||c.parentElement,start:'top top',end:'bottom top',scrub:true,onUpdate:st=>api.setProgress(st.progress)});}
  const root=c.closest('[data-config]')||document;
  $$('.sw',root).forEach(b=>b.addEventListener('click',()=>{api.setFinish(b.dataset.finish);$$('.sw',root).forEach(x=>x.classList.toggle('on',x===b));const nm=$('.fin-name b',root);nm&&(nm.textContent=mod.FINISHES[b.dataset.finish].name);const photo=$('[data-variant-photo]',root);photo&&(photo.src=`/assets/gen/dm-finish-${b.dataset.finish}.webp`);}));
  const fx=$('[data-ledfx]',root);fx&&fx.addEventListener('click',()=>{const on=!fx.classList.contains('on');fx.classList.toggle('on',on);api.setLedFx(on);});}
(()=>{const canv=$$('canvas[data-edmini]');if(!canv.length)return;if(!('WebGLRenderingContext' in window)){canv.forEach(c=>c.parentElement.classList.add('static'));return;}
  canv.forEach(c=>{const isHero=c.dataset.camera==='hero';
    if(isHero&&lite){c.parentElement.classList.add('static');return;}
    if(isHero){const go=()=>('requestIdleCallback' in window?requestIdleCallback(()=>mountOne(c),{timeout:2500}):setTimeout(()=>mountOne(c),600));if(document.readyState==='complete')go();else addEventListener('load',go);}
    else{new IntersectionObserver((es,ob)=>{es.forEach(e=>{if(e.isIntersecting){ob.disconnect();mountOne(c);}})},{rootMargin:'300px'}).observe(c);}
  });})();

/* scroll-scrubbed frame sequence */
$$('[data-seq]').forEach(sec=>{const tpl=sec.dataset.seq,N=+sec.dataset.n,c=$('canvas',sec),x=c.getContext('2d'),caps=$$('.cap',sec),prog=$('.prog i',sec);const imgs=new Array(N);let cur=-1,loaded=0;
  const url=i=>tpl.replace('{i}',String(i).padStart(3,'0'));
  const load=i=>new Promise(r=>{if(imgs[i])return r(imgs[i]);const im=new Image();im.onload=()=>{imgs[i]=im;loaded++;r(im)};im.onerror=()=>r(null);im.src=url(i);});
  const draw=i=>{const im=imgs[i];if(!im)return;const W=c.width,H=c.height,s=Math.max(W/im.width,H/im.height),w=im.width*s,h=im.height*s;x.clearRect(0,0,W,H);x.drawImage(im,(W-w)/2,(H-h)/2,w,h);cur=i;};
  const size=()=>{const r=c.getBoundingClientRect();const d=Math.min(devicePixelRatio,2);c.width=r.width*d;c.height=r.height*d;if(cur>=0)draw(cur);};addEventListener('resize',size);size();
  (async()=>{await load(0);draw(0);for(let i=1;i<N;i+=6)await load(i);for(let i=1;i<N;i++)load(i);})();
  const show=p=>{const i=Math.min(N-1,Math.max(0,Math.round(p*(N-1))));if(imgs[i])draw(i);else{load(i).then(()=>{if(Math.abs(cur-i)<=6||cur<0)draw(i)});let k=i;while(k>0&&!imgs[k])k--;if(imgs[k]&&cur!==k)draw(k);}
    caps.forEach(cp=>cp.classList.toggle('on',p>=+cp.dataset.from&&p<+cp.dataset.to));prog&&prog.style.setProperty('--p',(p*100)+'%');};
  ScrollTrigger.create({trigger:sec,start:'top top',end:'bottom bottom',scrub:true,onUpdate:st=>show(st.progress)});show(0);});
/* ROI mini */
$$('[data-roi]').forEach(r=>{
  const g=k=>$(`[name=${k}]`,r),outs=k=>$(`[data-out=${k}]`,r),fmt=n=>(n<0?'−':'')+'$'+Math.abs(Math.round(n)).toLocaleString();
  const calc=()=>{const price=+g('price').value,games=+g('games').value,fee=+g('fee').value,days=+g('days').value,machines=+g('machines').value,drinks=+g('drinks').value,perGame=+g('pergame').value;
    const gross=games*fee*days*machines*(52/12);const uplift=games*perGame*drinks*days*machines*(52/12);const monthly=gross+uplift;const pay=monthly>0?(price*machines)/monthly:0;
    $$('output',r).forEach(o=>{const inp=g(o.dataset.for);if(inp)o.textContent=(o.dataset.pre||'')+(+inp.value).toLocaleString()+(o.dataset.suf||'');});
    outs('monthly').textContent=fmt(monthly);outs('year').textContent=fmt(monthly*12-price*machines);outs('pay').textContent=pay?pay.toFixed(1)+' mo':'—';outs('games').textContent=Math.round(games*days*machines*(52/12)).toLocaleString();
    drawChart(r,price*machines,monthly);};
  $$('input',r).forEach(i=>i.addEventListener('input',calc));calc();
});
function drawChart(r,cost,monthly){const c=$('canvas',r);if(!c)return;const dpr=Math.min(devicePixelRatio,2);const W=c.clientWidth,H=c.clientHeight;c.width=W*dpr;c.height=H*dpr;const x=c.getContext('2d');x.scale(dpr,dpr);x.clearRect(0,0,W,H);
  const months=24,vals=[];for(let m=0;m<=months;m++)vals.push(monthly*m-cost);const mn=Math.min(...vals),mx=Math.max(...vals),pad={l:14,r:14,t:18,b:26};const X=m=>pad.l+(W-pad.l-pad.r)*m/months,Y=v=>pad.t+(H-pad.t-pad.b)*(1-(v-mn)/((mx-mn)||1));
  x.strokeStyle='rgba(255,255,255,.08)';x.lineWidth=1;for(let m=0;m<=months;m+=6){x.beginPath();x.moveTo(X(m),pad.t);x.lineTo(X(m),H-pad.b);x.stroke();}
  x.strokeStyle='rgba(255,255,255,.25)';x.setLineDash([4,4]);x.beginPath();x.moveTo(pad.l,Y(0));x.lineTo(W-pad.r,Y(0));x.stroke();x.setLineDash([]);
  const grd=x.createLinearGradient(0,pad.t,0,H-pad.b);grd.addColorStop(0,'rgba(200,150,62,.35)');grd.addColorStop(1,'rgba(200,150,62,0)');
  x.beginPath();x.moveTo(X(0),Y(0));vals.forEach((v,m)=>x.lineTo(X(m),Y(v)));x.lineTo(X(months),Y(0));x.closePath();x.fillStyle=grd;x.fill();
  x.beginPath();vals.forEach((v,m)=>m?x.lineTo(X(m),Y(v)):x.moveTo(X(m),Y(v)));x.strokeStyle='#C8963E';x.lineWidth=2.5;x.stroke();
  const be=monthly>0?cost/monthly:null;if(be!=null&&be<=months){x.fillStyle='#35E0FF';x.beginPath();x.arc(X(be),Y(0),5,0,7);x.fill();x.fillStyle='#F4F1EA';x.font='600 12px Barlow';x.textAlign='center';x.fillText('break-even · month '+be.toFixed(1),Math.min(Math.max(X(be),70),W-80),Y(0)-12);}
  x.fillStyle='rgba(244,241,234,.5)';x.font='11px "IBM Plex Mono",monospace';x.textAlign='left';x.fillText('0',pad.l,H-8);x.textAlign='right';x.fillText('24 months',W-pad.r,H-8);}

/* before/after */
$$('.ba').forEach(b=>{const inp=$('input',b);const set=v=>b.style.setProperty('--x',v+'%');inp.addEventListener('input',()=>set(inp.value));set(inp.value);
  if(!reduce)ScrollTrigger.create({trigger:b,start:'top 70%',once:true,onEnter:()=>{const o={v:100};gsap.to(o,{v:50,duration:1.8,ease:'expo.inOut',onUpdate:()=>{set(o.v);inp.value=o.v}})}});});

/* forms — inert demo: validate, then toast */
$$('form[data-demo]').forEach(f=>f.addEventListener('submit',e=>{e.preventDefault();let ok=true;$$('[required]',f).forEach(i=>{const bad=!i.value.trim()||(i.type==='email'&&!/^\S+@\S+\.\S+$/.test(i.value));i.closest('label')?.classList.toggle('invalid',bad);if(bad)ok=false;});
  if(!ok)return toast('Please complete the highlighted fields.');toast(f.dataset.demo||'Thanks — this is a design preview. Nothing was sent.');f.reset();}));
function toast(m){let t=$('.toast');if(!t){t=document.createElement('div');t.className='toast';document.body.appendChild(t);}t.textContent=m;t.classList.add('show');clearTimeout(t._t);t._t=setTimeout(()=>t.classList.remove('show'),3600);}
window.toast=toast;

/* multi-step form */
$$('[data-steps]').forEach(w=>{const steps=$$('.fstep',w),bar=$$('.steps-bar i',w);let i=0;const show=()=>{steps.forEach((s,k)=>s.classList.toggle('on',k===i));bar.forEach((b,k)=>b.classList.toggle('on',k<=i));w.querySelector('[data-prev]').style.visibility=i?'visible':'hidden';const nx=w.querySelector('[data-next]');nx.textContent=i===steps.length-1?(nx.dataset.last||'Submit'):'Continue';};
  w.querySelector('[data-next]').addEventListener('click',()=>{const req=$$('[required]',steps[i]);let ok=true;req.forEach(r=>{const bad=!r.value.trim();r.closest('label')?.classList.toggle('invalid',bad);if(bad)ok=false;});const tiles=$$('.tile',steps[i]);if(tiles.length&&!tiles.some(t=>t.classList.contains('on')))ok=false,toast('Pick one option to continue.');if(!ok)return;
    if(i<steps.length-1){i++;show();}else{toast(w.dataset.steps||'Application received — design preview, nothing was sent.');i=0;show();$$('.tile.on',w).forEach(t=>t.classList.remove('on'));$$('input,select,textarea',w).forEach(x=>x.value='');}});
  w.querySelector('[data-prev]').addEventListener('click',()=>{if(i>0){i--;show();}});
  $$('.tile',w).forEach(t=>t.addEventListener('click',()=>{$$('.tile',t.parentElement).forEach(x=>x.classList.toggle('on',x===t));}));show();});

/* lightbox */
const lb=document.createElement('div');lb.className='lb';lb.innerHTML='<img alt="">';document.body.appendChild(lb);lb.addEventListener('click',()=>lb.classList.remove('open'));
$$('.gallery figure, [data-zoom]').forEach(f=>f.addEventListener('click',()=>{const im=f.tagName==='IMG'?f:$('img',f);lb.querySelector('img').src=im.currentSrc||im.src;lb.classList.add('open');}));

/* lazy videos */
$$('video[data-src]').forEach(v=>{if(v.classList.contains('fallback-video')&&!v.parentElement.classList.contains('static'))return;const go=()=>{if(v.src)return;v.src=v.dataset.src;v.load();v.play().catch(()=>{});v.classList.add('on');};new IntersectionObserver((es,ob)=>{es.forEach(e=>{if(e.isIntersecting){ob.disconnect();('requestIdleCallback' in window?requestIdleCallback(go,{timeout:1500}):setTimeout(go,300));}})},{rootMargin:'200px'}).observe(v);});
/* ticker duplicate */
$$('.ticker .track').forEach(t=>{t.innerHTML+=t.innerHTML;});

/* year */
$$('[data-year]').forEach(e=>e.textContent=new Date().getFullYear());
})();

/* ===== v4 shop-style home (dartshopper structure) ===== */
(()=>{
const $=(s,c=document)=>c.querySelector(s),$$=(s,c=document)=>[...c.querySelectorAll(s)];
const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
/* toast */
function toast(m){let t=$('.toast');if(!t){t=document.createElement('div');t.className='toast';document.body.appendChild(t);}t.textContent=m;t.classList.add('show');clearTimeout(t._t);t._t=setTimeout(()=>t.classList.remove('show'),2600);}
/* hero slider */
const sl=$('[data-slider]');if(sl){const slides=$$('.slide',sl),dots=$$('.dots button',sl);let i=0,t;const go=n=>{i=(n+slides.length)%slides.length;slides.forEach((s,k)=>s.classList.toggle('on',k===i));dots.forEach((d,k)=>d.classList.toggle('on',k===i));};
  const arm=()=>{clearInterval(t);if(!reduce)t=setInterval(()=>go(i+1),5500);};dots.forEach((d,k)=>d.addEventListener('click',()=>{go(k);arm();}));arm();
  let x0=null;sl.addEventListener('pointerdown',e=>x0=e.clientX);sl.addEventListener('pointerup',e=>{if(x0===null)return;const dx=e.clientX-x0;x0=null;if(Math.abs(dx)>40){go(i+(dx<0?1:-1));arm();}});}
/* product rows */
$$('[data-row]').forEach(row=>{const blk=row.closest('.blk');const step=()=>row.firstElementChild?row.firstElementChild.getBoundingClientRect().width+14:300;
  $('[data-prev]',blk)?.addEventListener('click',()=>row.scrollBy({left:-step()*2,behavior:'smooth'}));$('[data-next]',blk)?.addEventListener('click',()=>row.scrollBy({left:step()*2,behavior:'smooth'}));});
/* wishlist + cart counters (demo) */
let wish=0,cart=0;const wc=$('[data-wish-count] b'),cc=$('[data-cart-count]');
$$('[data-wish]').forEach(b=>b.addEventListener('click',e=>{e.preventDefault();e.stopPropagation();const on=b.classList.toggle('on');wish+=on?1:-1;if(wc)wc.textContent=wish;toast(on?'Saved to wishlist':'Removed from wishlist');}));
$$('[data-add]').forEach(b=>b.addEventListener('click',e=>{e.preventDefault();const q=b.textContent.trim()==='Quote';if(q){location.href='/dartman/contact/#quote';return;}cart++;if(cc)cc.textContent=cart;toast(`${b.dataset.add} added to cart (demo)`);}));
$$('[data-open-cart]').forEach(a=>a.addEventListener('click',e=>{e.preventDefault();toast(cart?`${cart} item${cart>1?'s':''} in cart — demo, checkout lives on the DAYIN Sport store`:'Your cart is empty (demo)');}));
$$('form[data-demo]').forEach(f=>f.addEventListener('submit',e=>{e.preventDefault();toast(f.dataset.demo);f.reset();}));
$$('[data-year]').forEach(e=>e.textContent=new Date().getFullYear());
/* mega menu: keyboard + touch */
$$('.catnav .has-menu>a').forEach(a=>a.addEventListener('click',e=>{if(matchMedia('(hover:none)').matches){e.preventDefault();a.parentElement.classList.toggle('open');}}));
})();
