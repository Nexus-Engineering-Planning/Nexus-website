// Nigeria @ 65 — externalized app code (Leaflet + slides)
// Requires: leaflet.js on page, nigeria-points.json, nigeria-slides.json

(function () {
  const ready = (fn) => (document.readyState !== 'loading') ? fn() : document.addEventListener('DOMContentLoaded', fn);

  async function fetchJSON(path) {
    const r = await fetch(path, { cache: "no-store" });
    if (!r.ok) throw new Error(`HTTP ${r.status} for ${path}`);
    return r.json();
  }

  ready(async () => {
    // Safety: if Leaflet didn't load, show a friendly message
    if (typeof window.L === 'undefined') {
      const msg = document.createElement('p');
      msg.textContent = "We couldn't load the map tiles right now. Please check your connection and try again.";
      msg.className = 'meta';
      document.getElementById('mapA')?.replaceWith(msg.cloneNode(true));
      document.getElementById('mapB')?.replaceWith(msg);
      return;
    }

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const flyDur = reduceMotion ? 0 : 0.9;

    // ===== Map A: sanity check =====
    const mapA = L.map("mapA", { zoomControl: true, scrollWheelZoom: true }).setView([6.5244, 3.3792], 9);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 18, attribution: "&copy; OpenStreetMap contributors"
    }).addTo(mapA);
    L.marker([6.5244, 3.3792], { keyboard: true }).addTo(mapA).bindPopup("Lagos").openPopup();

    // ===== Map B: narrative =====
    const mapB = L.map("mapB", { zoomControl: true, scrollWheelZoom: true }).setView([9.0820, 8.6753], 6);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 18, attribution: "&copy; OpenStreetMap contributors"
    }).addTo(mapB);

    // Load data (external JSON files in same folder)
    let points, slides;
    try {
      [points, slides] = await Promise.all([
        fetchJSON("nigeria-points.json"),
        fetchJSON("nigeria-slides.json")
      ]);
    } catch (err) {
      const box = document.getElementById("slides");
      if (box) box.innerHTML = `<p class="meta">Couldn't load data files (${err.message}). Check filenames and that they're in the same folder as this post.</p>`;
      return;
    }

    // Add bubbles
    const layer = L.geoJSON(points, {
      pointToLayer: (f, latlng) => L.circleMarker(latlng, {
        radius: (f.properties?.intensity_2023 || 40) / 10,
        fillColor: "#008753", color: "#0f2d25", weight: 1, opacity: 1, fillOpacity: 0.75
      }).bindPopup(`<b>${f.properties?.city || "City"}</b><br>Night Lights (2023): ${f.properties?.intensity_2023 ?? "-"}`)
    }).addTo(mapB);

    // Slides UI
    const box = document.getElementById("slides");
    box.innerHTML = `
      <figure style="margin:0">
        <img id="img" alt="" style="width:100%;max-height:260px;object-fit:cover;border-radius:8px" loading="lazy" />
        <figcaption id="cap" class="meta" style="margin-top:6px"></figcaption>
      </figure>
      <h4 id="title" style="margin:.6rem 0 0"></h4>
      <p id="text" style="margin:.25rem 0 0"></p>
    `;

    const els = {
      title: document.getElementById("title"),
      text:  document.getElementById("text"),
      img:   document.getElementById("img"),
      cap:   document.getElementById("cap"),
      prev:  document.getElementById("prev"),
      next:  document.getElementById("next"),
      shareX: document.getElementById("share-x"),
      shareLI: document.getElementById("share-li"),
      copy:  document.getElementById("copy-link")
    };

    let i = 0;
    function go(k, pushHash = true) {
      i = Math.max(0, Math.min(slides.length - 1, k));
      const s = slides[i];
      els.title.textContent = s.title;
      els.text.textContent  = s.text;
      els.img.src           = s.img;
      els.img.alt           = s.cap || s.title;
      els.cap.textContent   = s.cap || "";
      mapB.flyTo([s.view.lat, s.view.lon], s.view.z, { duration: flyDur });
      if (pushHash) location.hash = `#slide-${i+1}`;
    }

    // Start from hash if present
    const start = Math.max(1, Math.min(slides.length, parseInt((location.hash || "").replace("#slide-","")) || 1));
    go(start-1, false);

    // Controls
    els.prev?.addEventListener("click", () => go(i - 1));
    els.next?.addEventListener("click", () => go(i + 1));
    document.addEventListener("keydown", (e) => {
      if (e.key === "ArrowLeft")  go(i - 1);
      if (e.key === "ArrowRight") go(i + 1);
    });

    // Fit markers on map click
    mapB.on("click", () => {
      try { mapB.fitBounds(layer.getBounds(), { padding: [20,20] }); } catch (_) {}
    });

    // Share links + copy
    const pageUrl = window.location.href.split('#')[0];
    const text = encodeURIComponent("Nigeria @ 65 — a mini map story by StayGIS");
    if (els.shareX)  els.shareX.href = `https://twitter.com/intent/tweet?text=${text}&url=${encodeURIComponent(pageUrl)}&utm_source=blog&utm_medium=share&utm_campaign=nigeria65`;
    if (els.shareLI) els.shareLI.href = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(pageUrl)}&utm_source=blog&utm_medium=share&utm_campaign=nigeria65`;
    els.copy?.addEventListener("click", async () => {
      try { await navigator.clipboard.writeText(pageUrl); els.copy.textContent = "Copied ✓"; setTimeout(()=>els.copy.textContent="Copy link",1500); }
      catch { els.copy.textContent = "Press Ctrl/Cmd+C"; setTimeout(()=>els.copy.textContent="Copy link",1500); }
    });
  });
})();