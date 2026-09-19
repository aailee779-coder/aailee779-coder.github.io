/* venue map — sample data, clearly labelled as illustrative */
(()=>{
const V=[
 {id:1,n:'The Bullseye Tap',c:'Berlin',r:'eu',x:475,y:205,m:2,p:38,l:true,lb:[['S. Weber',61.2],['A. Köhler',57.4],['M. Yilmaz',52.9]]},
 {id:2,n:'Corner Pocket',c:'Manchester',r:'eu',x:442,y:192,m:1,p:22,l:true,lb:[['J. Lindqvist',55.1],['R. Patel',49.8],['T. Doyle',47.0]]},
 {id:3,n:'Nachtflug',c:'Amsterdam',r:'eu',x:462,y:198,m:1,p:14,l:false,lb:[['D. de Vries',50.2],['K. Bos',44.1]]},
 {id:4,n:'Lone Star Lanes',c:'Dallas',r:'na',x:212,y:262,m:3,p:57,l:true,lb:[['K. Reyes',62.4],['M. Okafor',58.9],['B. Tran',54.0]]},
 {id:5,n:'Northside Arcade',c:'Chicago',r:'na',x:248,y:218,m:2,p:31,l:false,lb:[['L. Novak',53.3],['E. Ruiz',48.6]]},
 {id:6,n:'Pier 9 Bar',c:'Vancouver',r:'na',x:150,y:195,m:1,p:9,l:false,lb:[['C. Wong',46.0]]},
 {id:7,n:'Makati Darts Club',c:'Manila',r:'asia',x:776,y:326,m:4,p:88,l:true,lb:[['R. Santos',64.8],['J. Cruz',60.1],['P. Reyes',58.7]]},
 {id:8,n:'Sukhumvit 11 Sports Bar',c:'Bangkok',r:'asia',x:734,y:314,m:2,p:26,l:false,lb:[['N. Somchai',51.0],['A. Kaur',47.2]]},
 {id:9,n:'Shinjuku Darts Lounge',c:'Tokyo',r:'asia',x:806,y:236,m:3,p:64,l:true,lb:[['H. Tanaka',66.0],['Y. Sato',63.2],['M. Ito',59.9]]},
 {id:10,n:'Xinyi Game Room',c:'Taipei',r:'asia',x:772,y:270,m:2,p:33,l:true,lb:[['W. Chen',60.4],['L. Lin',55.8]]},
 {id:11,n:'Surry Hills Social',c:'Sydney',r:'asia',x:822,y:470,m:1,p:17,l:false,lb:[['A. Brown',49.0]]},
 {id:12,n:"Zhen'an Rd · Factory showroom",c:'Dongguan',r:'asia',x:748,y:275,m:5,p:0,l:false,hq:true,lb:[]}
];
const pins=document.getElementById('pins'),panel=document.getElementById('panel'),list=document.getElementById('vlist');let cur=null,filt='all';
const show=v=>filt==='all'||(filt==='league'&&v.l)||v.r===filt;
function render(){
  pins.innerHTML=V.map(v=>`<g class="pin ${v.l?'league':''} ${v.hq?'hq':''} ${cur===v.id?'on':''} ${show(v)?'':'dim'}" data-id="${v.id}" tabindex="0" role="button" aria-label="${v.n}, ${v.c}"><circle class="h" cx="${v.x}" cy="${v.y}" r="7"/><circle class="c" cx="${v.x}" cy="${v.y}" r="5"/><text x="${v.x+11}" y="${v.y+3}">${v.c}</text></g>`).join('');
  pins.querySelectorAll('.pin').forEach(p=>{const go=()=>{cur=+p.dataset.id;render();};p.addEventListener('click',go);p.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();go();}});});
  const v=V.find(x=>x.id===cur);
  panel.innerHTML=v?(v.hq?`<span class="k">DARTMAN · Factory showroom</span><h3>${v.n}</h3><p style="font-size:14px;color:var(--paper-2)">No.220 Zhen'an West Road, Chang'an, Dongguan. ${v.m} demo machines. Dealers and venue owners book visits here.</p><a class="btn sm" href="/dartman/contact/">Book a showroom visit</a>`
   :`<span class="k">${v.c} · ${v.m} machine${v.m>1?'s':''} · ${v.p} registered players</span><h3>${v.n}</h3>
   ${v.l?`<div><b style="display:block;margin-bottom:6px">Season 3 · week 6 of 10</b><table><tr><td>Format</td><td>501 · best of 3</td></tr><tr><td>Night</td><td>Thu 20:00</td></tr><tr><td>Enrolled</td><td>${Math.round(v.p*.4)}</td></tr></table></div><a class="btn sm" href="#" onclick="toast('Design preview — league sign-up lives in the eDARTS app.');return false">Join this season</a>`
   :`<p style="font-size:14px;color:var(--paper-2)">No league yet. ${v.p} players have played here — enough for an 8-team season.</p><a class="btn ghost sm" href="#" onclick="toast('Design preview — venues start seasons from the operator panel.');return false">Ask the venue to start a season</a>`}
   <div><span class="k">Venue leaderboard · 3-dart avg</span><table>${v.lb.map((r,i)=>`<tr><td>0${i+1} · ${r[0]}</td><td>${r[1].toFixed(1)}</td></tr>`).join('')}<tr><td style="color:var(--paper-3)">0${v.lb.length+1} · you?</td><td>—</td></tr></table></div>`)
   :`<span class="k">How it works</span><h3>Pick a pin.</h3><p style="font-size:14px;color:var(--paper-2);line-height:1.6">Cyan pins have a league season running. Brass pins have machines but no season yet. Pink is the factory showroom in Dongguan.</p><p style="font-size:12px;color:var(--paper-3)">In production: venues come from dealer onboarding; players and averages from the eDARTS app. Everything shown here is sample data.</p>`;
  const vis=V.filter(show);
  list.innerHTML=vis.map(v=>`<div class="venue ${cur===v.id?'on':''}" data-id="${v.id}"><div><b>${v.n}</b><span>${v.c} · ${v.m} machine${v.m>1?'s':''}${v.hq?' · factory showroom':''}</span></div>${v.l?'<span class="tag">● season running</span>':''}</div>`).join('');
  list.querySelectorAll('.venue').forEach(el=>el.addEventListener('click',()=>{cur=+el.dataset.id;render();}));
}
document.querySelectorAll('#filters .chip').forEach(b=>b.addEventListener('click',()=>{filt=b.dataset.f;cur=null;document.querySelectorAll('#filters .chip').forEach(x=>x.classList.toggle('on',x===b));render();}));
render();
})();
