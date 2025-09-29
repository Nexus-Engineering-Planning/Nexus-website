// StoryMap with simple slides + point bubbles
(async function () {
  const containerId = "mapB";
  const feedPath = "nigeria-points.json";

  // base map
  const basemap = L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 18,
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
  });

  // load points (same folder as this post)
  let data;
  try {
    const resp = await fetch(feedPath, { cache: "no-store" });
    data = await resp.json();
  } catch (e) {
    console.error("Failed to load nigeria-points.json", e);
    data = { type: "FeatureCollection", features: [] };
  }

  const storymap = new L.Storymap(containerId, {
    width: "100%",
    height: "620px",
    basemap,
    storymap_data: {
      storymap: {
        slides: [
          {
            title: "Independence Day — 1960",
            text:
              "On October 1, 1960, Nigeria gained independence. Lagos—the economic hub—set the pace for rapid growth.",
            location: { center: [6.5244, 3.3792], zoom: 10 }, // [lat, lon]
            media: { url: "cover.jpg", type: "image", caption: "Lagos in the 1960s" }
          },
          {
            title: "Abuja — Capital Since 1991",
            text:
              "Abuja reflects modern planning and central connectivity.",
            location: { center: [9.0579, 7.4951], zoom: 10 },
            media: { url: "cover.jpg", type: "image", caption: "Abuja development" }
          },
          {
            title: "Kano — Northern Heritage",
            text:
              "Kano continues to thrive—showcasing Nigeria’s diverse urban legacy.",
            location: { center: [12.0001, 8.5167], zoom: 10 },
            media: { url: "cover.jpg", type: "image", caption: "Kano markets" }
          },
          {
            title: "Nigeria @ 65 — Looking Ahead",
            text:
              "Resilience and growth. StayGIS is mapping cities, coastlines, and connectivity.",
            location: { center: [9.0820, 8.6753], zoom: 6 },
            media: {
              url: "https://source.unsplash.com/1080x608/?nigeria,flag",
              type: "image",
              caption: "Nigeria @ 65"
            }
          }
        ]
      }
    },
    geojson: data,
    pointToLayer: (feature, latlng) =>
      L.circleMarker(latlng, {
        radius: (feature.properties?.intensity_2023 || 40) / 10,
        fillColor: "#008753",
        color: "#0f2d25",
        weight: 1,
        opacity: 1,
        fillOpacity: 0.75
      }).bindPopup(
        `<b>${feature.properties?.city || "City"}</b><br>` +
          `Night Lights (2023): ${feature.properties?.intensity_2023 ?? "–"}`
      )
  });

  storymap.init();
})();
