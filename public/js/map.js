
(function () {
  if (!window.mapData) {
    console.warn("⚠️ No map data found.");
    return;
  }

  const { lat, lon, title, location, accessToken } = window.mapData;

  const map = L.map("map").setView([lat, lon], 12);
// L is a namespace object that contains all of Leaflet’s methods and classes.
  L.tileLayer(
    `https://{s}-tiles.locationiq.com/v3/streets/r/{z}/{x}/{y}.png?key=${accessToken}`,
    {
      attribution: "© LocationIQ © OpenStreetMap contributors",
      maxZoom: 18,
    }
  ).addTo(map);
// we are change the color of the marker by any othe marker image
  L.marker([lat, lon])
    .addTo(map)
    
    .bindPopup(`<b>${title}</b><br>${location}`)
    .openPopup();

  setTimeout(() => map.invalidateSize(), 300);
})();
