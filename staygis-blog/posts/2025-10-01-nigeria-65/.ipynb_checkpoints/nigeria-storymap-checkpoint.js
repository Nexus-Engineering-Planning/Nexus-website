fetch('nigeria-night-lights.json')
  .then(response => response.json())
  .then(data => {
    var storymap = new L.Storymap('storymap', {
      width: '100%',
      height: '600px',
      basemap: L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        maxZoom: 18
      }),
      storymap_data: {
        "storymap": {
          "slides": [
            {
              "title": "Independence Day 1960",
              "text": "On October 1, 1960, Nigeria gained independence. Lagos, the economic hub, laid the foundation for rapid urban growth.",
              "location": { "center": [3.3792, 6.5244], "zoom": 10 },
              "media": { "url": "cover.jpg", "type": "image", "caption": "Lagos in the 1960s" }
            },
            {
              "title": "Abuja: Capital Since 1991",
              "text": "Abuja, designed as the new capital, reflects Nigeria’s modern urban planning efforts over 65 years.",
              "location": { "center": [7.4951, 9.0579], "zoom": 10 },
              "media": { "url": "cover.jpg", "type": "image", "caption": "Abuja development" }
            },
            {
              "title": "Kano: Northern Heritage",
              "text": "Kano, a historic trade center, continues to thrive, showcasing Nigeria’s diverse urban legacy.",
              "location": { "center": [8.5167, 12.0001], "zoom": 10 },
              "media": { "url": "cover.jpg", "type": "image", "caption": "Kano markets" }
            },
            {
              "title": "Nigeria @ 65: Looking Ahead",
              "text": "Celebrating 65 years of resilience, Nigeria aims for sustainable cities. Join StayGIS for more insights!",
              "location": { "center": [9.0820, 8.6753], "zoom": 6 },
              "media": { "url": "https://source.unsplash.com/1080x608/?nigeria,flag", "type": "image", "caption": "Nigeria @65 Celebration" }
            }
          ]
        }
      },
      geojson: data,
      pointToLayer: function(feature, latlng) {
        return L.circleMarker(latlng, {
          radius: feature.properties.intensity_2023 / 10,
          fillColor: "#008753",
          color: "#0f2d25",
          weight: 1,
          opacity: 1,
          fillOpacity: 0.7
        }).bindPopup(`<b>${feature.properties.city}</b><br>Intensity: ${feature.properties.intensity_2023}`);
      }
    });
    storymap.init();
  });