/* pitch.js — motion layer for the DAYIN × BBK strategy deck.
   Replaces deck.js for /pitch/: nav + progress + chapter marker + choreographed reveals. */
(()=>{
const $=(s,c=document)=>c.querySelector(s),$$=(s,c=document)=>[...c.querySelectorAll(s)];
const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
gsap.registerPlugin(ScrollTrigger);
const slides=$$('.slide'),tot=slides.length;
$('.topbar .tot').textContent=String(tot).padStart(2,'0');

/* ---- chrome: dots + chapter marker ---- */
const dots=$('.dots');
slides.forEach((s,i)=>{const a=document.createElement('a');a.href='#'+s.id;a.setAttribute('aria-label','第 '+(i+1)+' 页');dots.appendChild(a);});
const dotEls=$$('a',dots);
const chap=document.createElement('div');chap.className='chap';document.body.appendChild(chap);

/* ---- entrance choreography ---- */
const EASE='expo.out';
function choreograph(s,i){
  $('.topbar .cur').textContent=String(i+1).padStart(2,'0');
  dotEls.forEach((d,k)=>d.classList.toggle('on',k===i));
  document.querySelector('meta[name=theme-color]')?.setAttribute('content',
    s.dataset.theme==='light'?'#FFFFFF':s.dataset.theme==='orange'?'#E8571F':'#0F1013');
  chap.textContent=s.dataset.ch||'';chap.classList.toggle('off',i===0||!s.dataset.ch);
  $('.hint').classList.toggle('off',i>0);
  if(s.classList.contains('in'))return;s.classList.add('in');
  if(reduce)return;

  const tl=gsap.timeline({defaults:{ease:EASE}});
  /* 1 · headline lines wipe up behind a mask */
  const lines=$$('h1 .l',s);
  if(lines.length)tl.fromTo(lines,{yPercent:115,opacity:0},{yPercent:0,opacity:1,duration:1.15,stagger:.1},0);
  const head=$('h1,h2',s);
  if(head&&!lines.length)tl.fromTo(head,{y:40,opacity:0,clipPath:'inset(0 0 100% 0)'},
    {y:0,opacity:1,clipPath:'inset(0 0 0% 0)',duration:1.05},0);
  /* 2 · kicker slides in from the left rule */
  const kick=$('.kicker',s);
  if(kick)tl.fromTo(kick,{x:-18,opacity:0},{x:0,opacity:1,duration:.7},0);
  /* 3 · body items — grouped so each arrival reads as one beat */
  const items=$$('[data-a]',s).filter(e=>e!==head&&e!==kick&&!lines.includes(e));
  const cards=items.filter(e=>e.matches('.pil>div,.hw>div,.mk .stat,.v,.tcard,.three>div,.hand figure,.fb,.pstep,.lstep,.eng .pc,.risks>div,.phase>div,.terms>div,.scale>div,.usa>div,.vis3>div,.gaplist>div,.done a,.ag,.pyr>div,.bbkrow>div,.toc a'));
  const rest=items.filter(e=>!cards.includes(e));
  if(rest.length)tl.fromTo(rest,{y:26,opacity:0},{y:0,opacity:1,duration:.95,stagger:.06},.12);
  if(cards.length)tl.fromTo(cards,{y:34,opacity:0,scale:.985},
    {y:0,opacity:1,scale:1,duration:1,stagger:Math.min(.08,.5/cards.length)},.18);
  /* 4 · section-divider numeral: fill wipes up, bullets slide from the rule */
  const n=$('.n',s);
  if(n)tl.fromTo(n,{yPercent:14,opacity:0},{yPercent:0,opacity:1,duration:1.2},0)
        .fromTo(n,{'--fill':'100%'},{duration:.01},0);
  /* 5 · counters */
  $$('[data-count]',s).forEach(el=>{const to=+el.dataset.count,o={v:0};
    tl.to(o,{v:to,duration:1.5,ease:'power3.out',onUpdate:()=>el.textContent=Math.round(o.v).toLocaleString('en-US')},.3);});
  /* 6 · bars grow after their card lands */
  $$('[data-bar]',s).forEach((b,k)=>tl.call(()=>b.style.setProperty('--w',b.dataset.bar+'%'),null,.4+k*.08));
  $$('.cbar i,.splitbar i',s).forEach((b,k)=>{const w=b.style.getPropertyValue('--w');if(!w)return;
    tl.fromTo(b,{width:'0%'},{width:w,duration:1.1,ease:'power3.out'},.35+k*.1);});
  /* 7 · media: images settle out of a slight push-in */
  const media=$$('.hand img,.done img,.logowall img,.phone,.fly,.curve,.map2,.tablewrap',s);
  if(media.length)tl.fromTo(media,{scale:.97,opacity:0},{scale:1,opacity:1,duration:1.1,stagger:.05},.2);
}
slides.forEach((s,i)=>ScrollTrigger.create({trigger:s,start:'top 62%',end:'bottom 38%',
  onEnter:()=>choreograph(s,i),onEnterBack:()=>choreograph(s,i)}));

/* ---- slide-to-slide transition: the outgoing slide dims and recedes ---- */
if(!reduce){
  slides.forEach(s=>{
    const inner=$('.wrap',s);if(!inner)return;
    gsap.fromTo(inner,{opacity:.35,y:30},{opacity:1,y:0,ease:'none',
      scrollTrigger:{trigger:s,start:'top bottom',end:'top 45%',scrub:.5}});
    gsap.to(inner,{opacity:.25,y:-30,ease:'none',
      scrollTrigger:{trigger:s,start:'bottom 55%',end:'bottom top',scrub:.5}});
  });
  /* background photos: parallax drift + slow settle of the push-in */
  $$('[data-parallax]').forEach(img=>{
    gsap.fromTo(img,{yPercent:-7,scale:1.08},{yPercent:7,scale:1,ease:'none',
      scrollTrigger:{trigger:img.closest('.slide'),start:'top bottom',end:'bottom top',scrub:true}});
  });
  $$('[data-scrollshot]').forEach(img=>{const box=img.parentElement;
    const run=()=>{const d=img.offsetHeight-box.offsetHeight;if(d<=0)return;
      gsap.fromTo(img,{y:0},{y:-d,ease:'none',scrollTrigger:{trigger:box.closest('.slide'),start:'top 70%',end:'bottom 30%',scrub:.6}});};
    img.complete?run():img.addEventListener('load',run);});
}

/* ---- progress + navigation ---- */
const prog=$('.prog i');
const upd=()=>{const h=document.documentElement;prog.style.setProperty('--p',(h.scrollTop/(h.scrollHeight-h.clientHeight)*100).toFixed(2)+'%');};
addEventListener('scroll',upd,{passive:true});upd();
const cur=()=>{const y=scrollY+innerHeight/2;let best=0;slides.forEach((s,i)=>{if(s.offsetTop<=y)best=i;});return best;};
const go=i=>{i=Math.max(0,Math.min(tot-1,i));slides[i].scrollIntoView({behavior:reduce?'auto':'smooth',block:'start'});};
addEventListener('keydown',e=>{if(e.target.matches('input,textarea'))return;
  if(['ArrowDown','ArrowRight','PageDown',' '].includes(e.key)){e.preventDefault();go(cur()+1);}
  else if(['ArrowUp','ArrowLeft','PageUp'].includes(e.key)){e.preventDefault();go(cur()-1);}
  else if(e.key==='Home'){e.preventDefault();go(0);}else if(e.key==='End'){e.preventDefault();go(tot-1);}});
dotEls.forEach((d,i)=>d.addEventListener('click',e=>{e.preventDefault();go(i);}));
if(location.hash){const s=$(location.hash);if(s)setTimeout(()=>s.scrollIntoView({behavior:'auto'}),50);}
addEventListener('load',()=>ScrollTrigger.refresh());
})();
