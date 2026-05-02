/* Wanderlog-style day map builder (Leaflet + Carto Voyager tiles).
   Usage: buildDayMap('map', stops)
   stops: [{ name, time, lat, lng, type, note, must, naverQuery, naverUrl }] */

function busanIcon(num, type) {
  return L.divIcon({
    className: 'busan-marker ' + (type || 'sight'),
    html: String(num),
    iconSize: [28, 28],
    iconAnchor: [14, 14],
    popupAnchor: [0, -14],
  });
}

function escapeHtml(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function buildDayMap(containerId, stops) {
  const map = L.map(containerId, {
    zoomControl: true,
    scrollWheelZoom: false,
  });

  L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> &copy; <a href="https://carto.com/attributions">CARTO</a>',
    subdomains: 'abcd',
    maxZoom: 19,
  }).addTo(map);

  const points = [];
  const markers = [];

  stops.forEach((s, i) => {
    if (s.lat == null || s.lng == null) return;
    const t = s.must ? 'must' : (s.type || 'sight');
    const marker = L.marker([s.lat, s.lng], { icon: busanIcon(i + 1, t) }).addTo(map);

    let html = '';
    if (s.time) html += '<span class="pop-time">' + s.time + '</span>';
    html += '<b>' + (s.must ? '⭐ ' : '') + escapeHtml(s.name) + '</b>';
    if (s.note) html += '<div class="pop-note">' + escapeHtml(s.note) + '</div>';
    if (s.naverUrl) {
      html += '<div style="margin-top:6px"><a href="' + s.naverUrl + '" target="_blank" rel="noopener">在 Naver Map 開啟 →</a></div>';
    } else {
      html += '<div style="margin-top:6px"><a href="https://map.naver.com/v5/search/' +
        encodeURIComponent(s.naverQuery || s.name) + '" target="_blank" rel="noopener">在 Naver Map 搜尋 →</a></div>';
    }

    marker.bindPopup(html);
    marker.on('click', () => {
      const el = document.querySelector('[data-stop="' + i + '"]');
      if (el) {
        document.querySelectorAll('.timeline-item.is-active').forEach(n => n.classList.remove('is-active'));
        el.classList.add('is-active');
      }
    });
    markers.push(marker);
    points.push([s.lat, s.lng]);
  });

  if (points.length > 1) {
    L.polyline(points, {
      color: '#1565c0',
      weight: 3,
      opacity: 0.55,
      dashArray: '6, 6',
    }).addTo(map);
  }

  if (points.length > 0) {
    map.fitBounds(points, { padding: [40, 40] });
    if (points.length === 1) map.setZoom(15);
  } else {
    map.setView([35.16, 129.13], 12);
  }

  document.querySelectorAll('.timeline-item').forEach(el => {
    el.addEventListener('click', () => {
      const idx = Number(el.getAttribute('data-stop'));
      if (Number.isInteger(idx) && markers[idx]) {
        markers[idx].openPopup();
        map.flyTo([stops[idx].lat, stops[idx].lng], Math.max(map.getZoom(), 14), { duration: 0.6 });
        document.querySelectorAll('.timeline-item.is-active').forEach(n => n.classList.remove('is-active'));
        el.classList.add('is-active');
      }
    });
  });

  map.once('click', () => map.scrollWheelZoom.enable());

  return map;
}
