// zoneData exactly like your original, trimmed for brevity—you can paste the full object
const zoneData = {
  zone1:{ name:"North American Boreal Forests",
    dominantVegetation:{icon:"🌲",type:"Coniferous Forest"},
    data:{ 2024:{stress:25,health:"Stable Ecosystem",class:"healthy"},
           2020:{stress:20,health:"Optimal Conditions",class:"healthy"},
           2016:{stress:15,health:"Peak Performance",class:"healthy"},
           2014:{stress:12,health:"Pristine State",class:"healthy"} },
    plants:["🌲 Coniferous Biomass","🍃 Deciduous Canopy","🌿 Understory Matrix","🦌 Wildlife Corridors"],
    suggestions:["Deploy reforestation satellites","Implement carbon sequestration protocols","Activate forest monitoring network","Launch biodiversity preservation mission"],
    prediction:{trend:"positive",text:"Satellite data indicates successful conservation protocols. Forest biomass projected to increase 8%."}
  },
  /* paste zones 2..9 from your original here unchanged */
};

function showZoneInfo(data){
  const yearData = data.data[STATE.currentYear];
  document.getElementById('zoneName').textContent = `🛰️ ${data.name}`;

  const stressFill = document.getElementById('stressFill');
  const stressPercent = document.getElementById('stressPercent');
  stressFill.style.width = `${yearData.stress}%`;
  if(yearData.stress > 60){ stressFill.style.background = 'linear-gradient(90deg,#f00 0%,#f60 100%)'; }
  else if(yearData.stress > 40){ stressFill.style.background = 'linear-gradient(90deg,#fa0 0%,#fd0 100%)'; }
  else { stressFill.style.background = 'linear-gradient(90deg,#0f0 0%,#6f6 100%)'; }
  stressPercent.textContent = `${yearData.stress}% STRESS LEVEL - ${yearData.health.toUpperCase()}`;

  document.getElementById('plantHealth').innerHTML = `
    <div class="dominant-vegetation">
      <div class="icon">${data.dominantVegetation.icon}</div>
      <div class="label">${data.dominantVegetation.type}</div>
    </div>
    System Status: ${yearData.health}
  `;

  const plantLegend = document.getElementById('plantLegend');
  plantLegend.innerHTML = data.plants.map(p=>`<div class="plant-item">${p}</div>`).join('');

  const suggestions = document.getElementById('suggestions');
  suggestions.innerHTML = data.suggestions.map(s=>`<li>🚀 ${s}</li>`).join('');

  const prediction = document.getElementById('prediction');
  prediction.className = `prediction ${data.prediction.trend}`;
  prediction.innerHTML = `<p><strong>AI ANALYSIS:</strong> ${data.prediction.text}</p>`;

  document.getElementById('sidebar').classList.add('active');
}
