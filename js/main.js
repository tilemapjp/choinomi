(function(){
    var map = L.map('map').setView([35.0, 135.0], 5);
    L.tileLayer('http://j.tile.openstreetmap.jp/{z}/{x}/{y}.png', {
        attribution: 'Map data &copy; OpenStreetMap contributors, Tiles Courtesy of OpenStreetMap Japan',
        maxZoom: 19,
    }).addTo(map);
})();
