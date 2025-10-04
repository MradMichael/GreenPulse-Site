function debounce(fn, ms=250){ let t; return (...a)=>{ clearTimeout(t); t=setTimeout(()=>fn(...a), ms); }; }

function showBadge(msg){
  let el = document.getElementById('badge');
  if(!el){
    el = document.createElement('div'); el.id='badge';
    Object.assign(el.style,{position:'absolute',top:'12px',right:'12px',background:'#000b',color:'#fff',
      padding:'6px 10px',borderRadius:'8px',fontSize:'12px',zIndex:9999});
    document.body.appendChild(el);
  }
  el.textContent = msg; el.style.display='block';
  setTimeout(()=> el.style.display='none', 3000);
}

(function createParticles(){
  const p = document.getElementById('particles');
  for(let i=0;i<50;i++){
    const d = document.createElement('div');
    d.className='particle';
    d.style.left = Math.random()*100 + '%';
    d.style.animationDelay = Math.random()*15 + 's';
    d.style.animationDuration = (Math.random()*10 + 10) + 's';
    p.appendChild(d);
  }
})();

// fun ticker
setInterval(()=>{
  const el = document.querySelector('.data-stream');
  if(el){ const speed = (Math.random()*200 + 700).toFixed(1); el.textContent = `DATA STREAM: ${speed} MB/s`; }
}, 2000);
