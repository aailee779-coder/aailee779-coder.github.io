/* BBK × 大银 · deck.js — GSAP reveals, counters, bars, parallax, keyboard + dots navigation */
(()=>{
const $=(s,c=document)=>c.querySelector(s),$$=(s,c=document)=>[...c.querySelectorAll(s)];
const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
gsap.registerPlugin(ScrollTrigger);
const slides=$$('.slide'),tot=slides.length;$('.topbar .tot').textContent=String(tot).padStart(2,'0');
/* dots */
const dots=$('.dots');slides.forEach((s,i)=>{const a=document.createElement('a');a.href='#'+s.id;a.setAttribute('aria-label','第 '+(i+1)+' 页');dots.appendChild(a);});
const dotEls=$$('a',dots);
/* per-slide enter animation */
slides.forEach((s,i)=>{
  const items=$$('[data-a]',s);
  ScrollTrigger.create({trigger:s,start:'top 60%',end:'bottom 40%',
    onEnter:()=>enter(s,items,i),onEnterBack:()=>enter(s,items,i,true)});
});
function enter(s,items,i,back){
  $('.topbar .cur').textContent=String(i+1).padStart(2,'0');dotEls.forEach((d,k)=>d.classList.toggle('on',k===i));
  document.querySelector('meta[name=theme-color]')?.setAttribute('content',s.dataset.theme==='light'?'#FFFFFF':s.dataset.theme==='orange'?'#E8571F':'#0F1013');
  $('.hint').classList.toggle('off',i>0);
  if(s.classList.contains('in'))return;s.classList.add('in');
  if(reduce)return;
  gsap.fromTo(items,{y:34,opacity:0},{y:0,opacity:1,duration:1.1,stagger:.07,ease:'expo.out',overwrite:true,clearProps:'transform'});
  /* headline lines */
  const ls=$$('h1 .l',s);if(ls.length)gsap.fromTo(ls,{yPercent:60,opacity:0},{yPercent:0,opacity:1,duration:1.2,stagger:.12,ease:'expo.out',delay:.1});
  /* counters */
  $$('[data-count]',s).forEach(el=>{const to=+el.dataset.count;const o={v:0};gsap.to(o,{v:to,duration:1.4,ease:'power3.out',delay:.3,onUpdate:()=>el.textContent=Math.round(o.v).toLocaleString('en-US')});});
  /* bars */
  $$('[data-bar]',s).forEach((b,k)=>setTimeout(()=>b.style.setProperty('--w',b.dataset.bar+'%'),200+k*60));
}
/* progress bar */
const prog=$('.prog i');const upd=()=>{const h=document.documentElement;const p=h.scrollTop/(h.scrollHeight-h.clientHeight);prog.style.setProperty('--p',(p*100).toFixed(2)+'%');};addEventListener('scroll',upd,{passive:true});upd();
/* parallax backgrounds + slow scroll of page screenshots */
if(!reduce){
  $$('[data-parallax]').forEach(img=>{gsap.fromTo(img,{yPercent:-8},{yPercent:8,ease:'none',scrollTrigger:{trigger:img.closest('.slide'),start:'top bottom',end:'bottom top',scrub:true}});});
  $$('[data-scrollshot]').forEach(img=>{const box=img.parentElement;const run=()=>{const d=img.offsetHeight-box.offsetHeight;if(d<=0)return;gsap.fromTo(img,{y:0},{y:-d,ease:'none',scrollTrigger:{trigger:box.closest('.slide'),start:'top 70%',end:'bottom 30%',scrub:.6}});};if(img.complete)run();else img.addEventListener('load',run);});
}
/* keyboard navigation */
const cur=()=>{const y=scrollY+innerHeight/2;let best=0;slides.forEach((s,i)=>{if(s.offsetTop<=y)best=i;});return best;};
const go=i=>{i=Math.max(0,Math.min(tot-1,i));slides[i].scrollIntoView({behavior:reduce?'auto':'smooth',block:'start'});};
addEventListener('keydown',e=>{if(e.target.matches('input,textarea'))return;
  if(['ArrowDown','ArrowRight','PageDown',' '].includes(e.key)){e.preventDefault();go(cur()+1);}
  else if(['ArrowUp','ArrowLeft','PageUp'].includes(e.key)){e.preventDefault();go(cur()-1);}
  else if(e.key==='Home'){e.preventDefault();go(0);}else if(e.key==='End'){e.preventDefault();go(tot-1);}});
dotEls.forEach((d,i)=>d.addEventListener('click',e=>{e.preventDefault();go(i);}));
/* deep link */
if(location.hash){const s=$(location.hash);if(s)setTimeout(()=>s.scrollIntoView({behavior:'auto'}),50);}
addEventListener('load',()=>ScrollTrigger.refresh());
})();
