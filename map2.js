// <!-- 🧠 Pass data safely from server -->
<script>
  window.mapData = <%- JSON.stringify({
    lat: listing.geometry.coordinates[1],
    lon: listing.geometry.coordinates[0],
    title: listing.title,
    location: listing.location,
    accessToken: locationIqKey,   // ✅ Pass from server variable
  }) %>;
</script>