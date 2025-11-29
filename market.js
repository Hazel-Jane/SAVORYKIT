function initMap(mapDataUrl) {
var map = L.map('map').setView([8.366484, 124.865488], 17);

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

fetch(mapDataUrl)
        .then((response) => response.json())
        .then((data) => {
          data.forEach((pin) => {
            const marker = L.marker([pin.lat, pin.lng]).addTo(map);
            marker.bindPopup(`
              <b>${pin.name}</b><br>
              ${pin.description}<br>
              <img src="${pin.img}" alt="${pin.name}" width="150" style="margin-top:5px;">
            `);
          });
        })
        .catch((err) => console.error("Error loading JSON:", err));
    }

    document.addEventListener("DOMContentLoaded", () => {
      initMap("market.json");
    });