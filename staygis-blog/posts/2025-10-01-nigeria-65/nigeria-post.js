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
    if (!box) return;

    box.innerHTML = "";
    const steps = slides.map((s, idx) => {
      const section = document.createElement("section");
      section.className = "story-step";
      section.dataset.slide = String(idx + 1);

      const eyebrow = document.createElement("p");
      eyebrow.className = "story-step__eyebrow";
      eyebrow.textContent = `Slide ${idx + 1}`;
      section.appendChild(eyebrow);

      const title = document.createElement("h4");
      title.className = "story-step__title";
      title.textContent = s.title;
      section.appendChild(title);

      if (s.img) {
        const figure = document.createElement("figure");
        figure.className = "story-step__media";
        const img = document.createElement("img");
        img.src = s.img;
        img.alt = s.cap || s.title;
        img.loading = "lazy";
        figure.appendChild(img);
        if (s.cap) {
          const caption = document.createElement("figcaption");
          caption.className = "meta";
          caption.style.marginTop = "6px";
          caption.textContent = s.cap;
          figure.appendChild(caption);
        }
        section.appendChild(figure);
      }

      if (s.text) {
        const body = document.createElement("p");
        body.textContent = s.text;
        section.appendChild(body);
      }

      box.appendChild(section);
      return section;
    });

    const els = {
      prev:  document.getElementById("prev"),
      next:  document.getElementById("next"),
      shareX: document.getElementById("share-x"),
      shareLI: document.getElementById("share-li"),
      copy:  document.getElementById("copy-link")
    };

    let i = -1;
    function go(k, options = {}) {
      const { pushHash = true, fromObserver = false } = options;
      const clamped = Math.max(0, Math.min(slides.length - 1, k));
      if (clamped === i && fromObserver) return;
      i = clamped;
      const s = slides[i];
      mapB.flyTo([s.view.lat, s.view.lon], s.view.z, { duration: flyDur });
      steps.forEach((step, idx) => {
        const active = idx === i;
        step.classList.toggle("is-active", active);
        if (active) {
          step.setAttribute("aria-current", "step");
          if (!fromObserver) {
            const behavior = reduceMotion ? "auto" : "smooth";
            try { step.scrollIntoView({ behavior, block: "start" }); } catch (_) {}
          }
        } else {
          step.removeAttribute("aria-current");
        }
      });
      if (pushHash) location.hash = `#slide-${i+1}`;
    }

    const start = Math.max(1, Math.min(slides.length, parseInt((location.hash || "").replace("#slide-","")) || 1));
    go(start - 1, { pushHash: false, fromObserver: true });
    if (location.hash && steps[start - 1]) {
      try {
        steps[start - 1].scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });
      } catch (_) {}
    }

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

    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = steps.indexOf(entry.target);
            if (index !== -1) go(index, { pushHash: false, fromObserver: true });
          }
        });
      }, { threshold: 0.6, rootMargin: "-15% 0px -30%" });
      steps.forEach((step) => observer.observe(step));
    }

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