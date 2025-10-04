const controls = document.getElementById('controls');
const timeSlider = document.getElementById('timeSlider');
const currentYearSpan = document.getElementById('currentYear');

timeSlider.addEventListener('input', debounce(e=>{
  STATE.currentYear = parseInt(e.target.value, 10);
  currentYearSpan.textContent = STATE.currentYear;
  setNdviForYear(STATE.currentYear);    // calls map.js; updates tile URL
  document.querySelectorAll('.zone').forEach(z=>{
    z.style.animation='none'; setTimeout(()=>z.style.animation='pulse 2s infinite',100);
  });
}, 250));

document.getElementById('closeSidebar').addEventListener('click', ()=>{
  document.getElementById('sidebar').classList.remove('active');
  controls.style.display = 'none';
});

// Zone clicks
document.querySelectorAll('.zone').forEach(z=>{
  z.addEventListener('click', ()=>{
    const id = z.id, data = zoneData[id];
    if(!data) return;
    controls.style.display = 'block';
    showZoneInfo(data);
  });
});

// Zoom buttons connect to Leaflet map
document.getElementById('zoomIn').addEventListener('click', ()=> STATE.map.zoomIn());
document.getElementById('zoomOut').addEventListener('click', ()=> STATE.map.zoomOut());
document.getElementById('resetZoom').addEventListener('click', ()=>{
  STATE.map.setView([CONFIG.initialView.lat, CONFIG.initialView.lon], CONFIG.initialView.zoom);
});
