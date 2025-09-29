// Initialize map centered on Nigeria
var map = L.map('nigeria-map').setView([9.0820, 8.6753], 6);

// Add OpenStreetMap tiles
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  maxZoom: 18
}).addTo(map);

// Load GeoJSON from file
fetch('nigeria-night-lights.json')
  .then(response => response.json())
  .then(data => {
    L.geoJSON(data, {
      pointToLayer: function(feature, latlng) {
        return L.circleMarker(latlng, {
          radius: feature.properties.intensity_2023 / 10,
          fillColor: "#008753",
          color: "#0f2d25",
          weight: 1,
          opacity: 1,
          fillOpacity: 0.7
        });
      },
      onEachFeature: function(feature, layer) {
        layer.bindPopup(`<b>${feature.properties.city}</b><br>Night Lights Intensity: ${feature.properties.intensity_2023}`);
      }
    }).addTo(map);
  });