/* pitch.js — chapter marker that follows the current slide */
(()=>{const el=document.createElement('div');el.className='chap';document.body.appendChild(el);
const cur=document.querySelector('.topbar .cur');const slides=[...document.querySelectorAll('.slide')];
const upd=()=>{const i=parseInt(cur.textContent,10)-1;const s=slides[i];if(!s)return;el.textContent=s.dataset.ch||'';el.classList.toggle('off',i===0||!s.dataset.ch);};
new MutationObserver(upd).observe(cur,{childList:true,characterData:true,subtree:true});upd();})();
