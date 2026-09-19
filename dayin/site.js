/* DAYIN — site.js */
(()=>{
const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;const $=(s,c=document)=>c.querySelector(s),$$=(s,c=document)=>[...c.querySelectorAll(s)];
gsap.registerPlugin(ScrollTrigger,SplitText);
let lenis=null;if(!reduce&&matchMedia('(pointer:fine)').matches){lenis=new Lenis({lerp:.1,smoothWheel:true});lenis.on('scroll',ScrollTrigger.update);gsap.ticker.add(t=>lenis.raf(t*1000));gsap.ticker.lagSmoothing(0);
  $$('a[href^="#"]').forEach(a=>a.addEventListener('click',e=>{const id=a.getAttribute('href');if(id.length>1&&$(id)){e.preventDefault();lenis.scrollTo(id,{offset:-90});}}));}
const nav=$('.nav');const onScroll=()=>nav&&nav.classList.toggle('solid',scrollY>30);onScroll();addEventListener('scroll',onScroll,{passive:true});
const burger=$('.burger'),mnav=$('.mnav');burger&&burger.addEventListener('click',()=>{const open=!mnav.classList.contains('open');mnav.classList.toggle('open',open);document.body.classList.toggle('menu-open',open);burger.setAttribute('aria-expanded',open);lenis&&(open?lenis.stop():lenis.start());});
$$('.rv').forEach(el=>ScrollTrigger.create({trigger:el,start:'top 88%',once:true,onEnter:()=>el.classList.add('in')}));
if(!reduce){$$('[data-split]').forEach(h=>{const st=new SplitText(h,{type:'lines',linesClass:'line'});gsap.set(st.lines,{yPercent:100,opacity:0});ScrollTrigger.create({trigger:h,start:'top 85%',once:true,onEnter:()=>gsap.to(st.lines,{yPercent:0,opacity:1,duration:1,stagger:.09,ease:'expo.out'})});});}
$$('[data-count]').forEach(el=>{const to=parseFloat(el.dataset.count),dec=(el.dataset.dec|0),suf=el.dataset.suf||'';el.textContent=(0).toFixed(dec)+suf;ScrollTrigger.create({trigger:el,start:'top 88%',once:true,onEnter:()=>{const o={v:0};gsap.to(o,{v:to,duration:1.5,ease:'power3.out',onUpdate:()=>el.textContent=(el.dataset.plain!==undefined?o.v.toFixed(dec):o.v.toFixed(dec).replace(/\B(?=(\d{3})+(?!\d))/g,','))+suf});}});});
if(!reduce)$$('.caps .cap, .prods .prod, .proc > div').forEach((el,i)=>{});
if(!reduce){$$('.caps, .prods, .proc, .stats, .bases').forEach(grid=>{const items=[...grid.children];gsap.set(items,{opacity:0,y:18,scale:.98});ScrollTrigger.create({trigger:grid,start:'top 85%',once:true,onEnter:()=>gsap.to(items,{opacity:1,y:0,scale:1,duration:.5,stagger:{each:.06,grid:'auto'},ease:'back.out(1.4)'})});});}
/* globe — lazy after load + idle; hidden under 760px */
(()=>{const cs=$$('canvas[data-globe]');if(!cs.length||!('WebGLRenderingContext' in window)||matchMedia('(max-width:760px)').matches)return;
  const go=async()=>{const mod=await import('/dayin/globe.js');cs.forEach(c=>{const wrap=c.parentElement;const labels=$$('.lbl',wrap);mod.mount(c,{focusLon:+(c.dataset.lon||108),focusLat:+(c.dataset.lat||18),dark:c.dataset.dark!==undefined,arcs:c.dataset.arcs!=='false',labels}).then(()=>c.classList.add('ready'));});};
  const idle=()=>('requestIdleCallback' in window?requestIdleCallback(go,{timeout:2500}):setTimeout(go,600));if(document.readyState==='complete')idle();else addEventListener('load',idle);})();
/* lazy videos */
$$('video[data-src]').forEach(v=>{const go=()=>{if(v.src)return;v.src=v.dataset.src;v.load();v.play().catch(()=>{});v.classList.add('on');};if(document.readyState==='complete')setTimeout(go,400);else addEventListener('load',()=>setTimeout(go,400));});
/* fit finder */
$$('[data-fit]').forEach(f=>{const out=$('.verdict',f);const ans={};
  $$('.chip[data-q]',f).forEach(b=>b.addEventListener('click',()=>{ans[b.dataset.q]=b.dataset.v;$$(`.chip[data-q="${b.dataset.q}"]`,f).forEach(x=>x.classList.toggle('on',x===b));verdict();}));
  function verdict(){const n=Object.keys(ans).length;if(n<4){out.innerHTML=`<span class="k">Verdict</span><h4>Answer ${4-n} more.</h4><p>We’ll suggest a base — Dongguan, Bắc Ninh, or both — from your answers. It is a starting point for the feasibility review, not a commitment.</p>`;return;}
    let vn=0,cn=0;if(ans.stage==='mass')vn+=2;else cn+=2;if(ans.origin==='yes')vn+=3;if(ans.origin==='pref')vn+=1;if(ans.vol==='high')vn+=1,cn+=1;if(ans.vol==='low')cn+=2;if(ans.tonnage==='xl')cn+=1;if(ans.tonnage==='std')vn+=1;if(ans.stage==='concept')cn+=2;
    const both=Math.abs(vn-cn)<=1;const k=both?'both':vn>cn?'vn':'cn';
    const T={cn:['Start in Dongguan','Concept or early-stage projects, small volumes and very large tonnage suit the Dongguan headquarters: full R&D, mold shop, lab and 100+ machines on one site.',['DFM and tooling in Dongguan','Pilot run and first-article approval','Add Vietnam later if origin matters']],
      vn:['Bắc Ninh, Vietnam','A finalized design with a defined annual volume and a need for non-China origin is exactly what the Vietnam line was built for.',['Tooling transfer or new tooling, 90–1200 T','Vietnamese Certificate of Origin per order','Same ISO 9001 system as Dongguan']],
      both:['Both bases, one team','Develop and tool in Dongguan; run mass production in Bắc Ninh for markets that need it, or split volume by destination.',['One project manager across both plants','Dual-source risk management','Ship China or Vietnam by SKU']]}[k];
    out.innerHTML=`<span class="k">Verdict</span><h4 class="${k}">${T[0]}</h4><p>${T[1]}</p><ul>${T[2].map(x=>`<li>${x}</li>`).join('')}</ul><a class="btn primary sm" style="margin-top:18px" href="/dayin/rfq/?base=${k}">Start the RFQ with this base</a>`;}
  verdict();});
/* forms */
$$('form[data-demo]').forEach(f=>f.addEventListener('submit',e=>{e.preventDefault();let ok=true;$$('[required]',f).forEach(i=>{const bad=!i.value.trim()||(i.type==='email'&&!/^\S+@\S+\.\S+$/.test(i.value));i.closest('label')?.classList.toggle('invalid',bad);if(bad)ok=false;});if(!ok)return toast('Please complete the highlighted fields.');toast(f.dataset.demo);f.reset();}));
function toast(m){let t=$('.toast');if(!t){t=document.createElement('div');t.className='toast';document.body.appendChild(t);}t.textContent=m;t.classList.add('show');clearTimeout(t._t);t._t=setTimeout(()=>t.classList.remove('show'),3800);}window.toast=toast;
/* RFQ multi-step */
$$('[data-rfq]').forEach(w=>{const steps=$$('.fstep',w),side=$$('.rfq-steps div',w);const KEY='dayin-rfq-v2';let i=0;const data=JSON.parse(localStorage.getItem(KEY)||'{}');
  const pre=new URLSearchParams(location.search).get('base');if(pre&&!data.base)data.base={cn:'Dongguan, China',vn:'Bắc Ninh, Vietnam',both:'Both / let DAYIN advise'}[pre];
  const save=()=>localStorage.setItem(KEY,JSON.stringify(data));
  const show=()=>{steps.forEach((s,k)=>s.classList.toggle('on',k===i));side.forEach((s,k)=>{s.classList.toggle('on',k===i);s.classList.toggle('done',k<i);});$('[data-prev]',w).style.visibility=i?'visible':'hidden';const nx=$('[data-next]',w);nx.textContent=i===steps.length-1?'Submit RFQ':'Continue';nx.style.display=steps[i].dataset.final!==undefined?'none':'';if(steps[i].dataset.summary!==undefined)renderSummary();};
  $$('.tile',w).forEach(t=>t.addEventListener('click',()=>{const q=t.dataset.q;if(t.classList.contains('multi')){t.classList.toggle('on');data[q]=$$(`.tile[data-q="${q}"].on`,w).map(x=>x.dataset.v);}else{$$(`.tile[data-q="${q}"]`,w).forEach(x=>x.classList.toggle('on',x===t));data[q]=t.dataset.v;}save();}));
  $$('input,select,textarea',w).forEach(el=>{if(data[el.name])el.value=data[el.name];el.addEventListener('input',()=>{data[el.name]=el.value;save();});});
  // restore tiles
  $$('.tile',w).forEach(t=>{const v=data[t.dataset.q];if(Array.isArray(v)?v.includes(t.dataset.v):v===t.dataset.v)t.classList.add('on');});
  const drop=$('.drop',w),files=$('.files',w);if(drop){const inp=$('input[type=file]',w);drop.addEventListener('click',()=>inp.click());['dragenter','dragover'].forEach(ev=>drop.addEventListener(ev,e=>{e.preventDefault();drop.classList.add('over')}));['dragleave','drop'].forEach(ev=>drop.addEventListener(ev,e=>{e.preventDefault();drop.classList.remove('over')}));
    const list=fl=>{data.files=[...fl].map(f=>f.name+' · '+(f.size/1024).toFixed(0)+' KB');files.innerHTML=data.files.map(x=>`<span>📎 ${x}</span>`).join('');save();};drop.addEventListener('drop',e=>list(e.dataTransfer.files));inp.addEventListener('change',()=>list(inp.files));if(data.files)files.innerHTML=data.files.map(x=>`<span>📎 ${x}</span>`).join('');}
  function renderSummary(){const s=$('.summary',w);const L={type:'Project type',stage:'Stage',vol:'Annual volume',base:'Preferred base',materials:'Materials',processes:'Processes',company:'Company',name:'Contact',email:'Email',country:'Country'};
    s.innerHTML=Object.entries(L).map(([k,l])=>`<div><span>${l}</span><span>${Array.isArray(data[k])?data[k].join(', '):(data[k]||'—')}</span></div>`).join('')+(data.files?`<div><span>Files</span><span>${data.files.length} attached</span></div>`:'');}
  $('[data-next]',w).addEventListener('click',()=>{const st=steps[i];let ok=true;$$('[required]',st).forEach(r=>{const bad=!r.value.trim()||(r.type==='email'&&!/^\S+@\S+\.\S+$/.test(r.value));r.closest('label')?.classList.toggle('invalid',bad);if(bad)ok=false;});
    const qs=[...new Set($$('.tile:not(.multi)',st).map(t=>t.dataset.q))];for(const q of qs)if(!data[q]){ok=false;toast('Pick an option to continue.');break;}
    if(!ok)return;if(i<steps.length-1){i++;if(steps[i].dataset.final!==undefined){data.ref='DY-'+(data.base||'').includes('Việt')?'VN':'CN';const ref='DY-'+((data.base||'').includes('Ninh')?'VN':'CN')+'-'+Math.floor(1000+Math.random()*9000);$('.ref',w).textContent=ref;localStorage.removeItem(KEY);}show();}});
  $('[data-prev]',w).addEventListener('click',()=>{if(i>0){i--;show();}});show();});
/* lightbox */
const lb=document.createElement('div');lb.className='lb';lb.innerHTML='<img alt="">';document.body.appendChild(lb);lb.addEventListener('click',()=>lb.classList.remove('open'));
$$('.gallery figure').forEach(f=>f.addEventListener('click',()=>{lb.querySelector('img').src=$('img',f).src;lb.classList.add('open');}));
$$('[data-year]').forEach(e=>e.textContent=new Date().getFullYear());
})();

/* ===== v5 homepage: marquees, film player, video + image lightbox ===== */
(()=>{
const $=(s,c=document)=>c.querySelector(s),$$=(s,c=document)=>[...c.querySelectorAll(s)];
/* duplicate marquee tracks so the loop is seamless */
$$('.marq .track').forEach(t=>{t.innerHTML+=t.innerHTML;});
/* big film */
$$('[data-player]').forEach(pl=>{const v=$('video',pl),b=$('.play',pl);const go=()=>{pl.classList.add('on');v.muted=false;v.play();};b.addEventListener('click',go);v.addEventListener('play',()=>pl.classList.add('on'));v.addEventListener('pause',()=>{if(v.currentTime===0||v.ended)pl.classList.remove('on');});});
/* lightbox */
const lbx=document.createElement('div');lbx.className='lbx';lbx.innerHTML='<button class="x" aria-label="Close"><svg><use href="#i-close"/></svg></button><div class="body"></div><div class="cap"></div>';document.body.appendChild(lbx);
const body=$('.body',lbx),cap=$('.cap',lbx);
const close=()=>{lbx.classList.remove('open');body.innerHTML='';cap.textContent='';};
lbx.addEventListener('click',e=>{if(e.target===lbx||e.target.closest('.x'))close();});addEventListener('keydown',e=>{if(e.key==='Escape')close();});
$$('[data-zoom]').forEach(f=>f.addEventListener('click',()=>{const img=$('img',f);body.innerHTML=`<img src="${img.src}" alt="">`;cap.textContent=(f.querySelector('figcaption')||{}).textContent||img.alt||'';lbx.classList.add('open');}));
$$('[data-video]').forEach(b=>b.addEventListener('click',()=>{body.innerHTML=`<video src="${b.dataset.video}" controls autoplay playsinline></video>`;cap.textContent=b.dataset.title||'';lbx.classList.add('open');}));
})();
