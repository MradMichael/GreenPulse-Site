function initMap(){
  STATE.map = L.map('map', { zoomControl:false, worldCopyJump:true })
    .setView([CONFIG.initialView.lat, CONFIG.initialView.lon], CONFIG.initialView.zoom);

  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap'
  }).addTo(STATE.map);
}
function setNdviForYear(){ /* noop for now */ }
initMap();
