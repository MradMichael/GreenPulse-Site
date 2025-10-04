function initMap(){
  STATE.map = L.map('map', { zoomControl:false, worldCopyJump:true })
    .setView([CONFIG.initialView.lat, CONFIG.initialView.lon], CONFIG.initialView.zoom);

  // Basemap
  STATE.layers.base = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap'
  }).addTo(STATE.map);

  // NDVI overlay from provider
  const dateStr = CONFIG.defaultDateForYear(CONFIG.defaultYear);
  STATE.layers.ndvi = L.tileLayer(buildTileUrl(dateStr), {
    opacity: 0.65,
    attribution: CONFIG.attribution,
    updateWhenIdle: true
  })
  .on('tileerror', ()=> showBadge('Data unavailable for current date.'))
  .addTo(STATE.map);
}

function setNdviForYear(year){
  if(!STATE.layers.ndvi) return;
  const d = CONFIG.defaultDateForYear(year);
  STATE.layers.ndvi.setUrl(buildTileUrl(d));
}

// boot
initMap();
