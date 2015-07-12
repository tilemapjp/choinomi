function getData(data) {
    var val = data.value;
    if (val.match(/^([0-9]\.+)E([0-9]+)$/)) {
        var root = RegExp.$1 * 1;
        var pow  = RegExp.$2 * 1;
        val = root * Math.pow(10,pow);
    }
    return val;
}

(function(){
    var endpoint = "http://lod.hozo.jp/repositories/lodosaka";
    var sparql = (function() {/*
PREFIX bp:  <http://data.lodosaka.jp/choi-nomi201507012.ttl#> 
PREFIX geo:  <http://www.w3.org/2003/01/geo/wgs84_pos#> 
select * 
from <http://data.lodosaka.jp/choi-nomi201507012.ttl>
where{
?s bp:name ?name.
?s bp:beer_price ?beer.
?s geo:lat ?lat.
?s bp:tel ?tel.
?s geo:long ?long.
FILTER ( ?lat  > #south && ?lat  < #north
        && ?long > #west && ?long < #east)
}
ORDER BY ?beer
    */}).toString().match(/\/\*([^]*)\*\//)[1];
    var namba = [34.6645204,135.5001207];
    var hereIcon = L.icon({
        iconUrl: 'img/circle.png',
        iconSize: [21, 21],
        iconAnchor: [11, 11]
    });
    var topIcon = L.icon({
        iconUrl: 'img/or_baloon.png',
        iconSize: [32, 33],
        iconAnchor: [22, 33]    
    });
    var secIcon = L.icon({
        iconUrl: 'img/gr_baloon.png',
        iconSize: [32, 33],
        iconAnchor: [22, 33]
    });
    var here;
    var markers = [];

    var map = L.map('map').setView([35.0, 135.0], 5);
    L.tileLayer('http://j.tile.openstreetmap.jp/{z}/{x}/{y}.png', {
        attribution: 'Map data &copy; OpenStreetMap contributors, Tiles Courtesy of OpenStreetMap Japan',
        maxZoom: 19,
    }).addTo(map);

    $("#here").on("click",function(){
        var namba_l = [];
        namba_l[0] = namba[0] + Math.random() * 0.006 - 0.003;
        namba_l[1] = namba[1] + Math.random() * 0.006 - 0.003;
        map.setView(namba_l, 16, {animate: true});
        if (!here) {
            here = L.marker(namba_l, {icon: hereIcon}).addTo(map);
        } else {
            here.setLatLng(namba_l);
        }

        sparql = sparql.replace(/#south/, namba_l[0] - 0.003)
            .replace(/#north/, namba_l[0] + 0.003)
            .replace(/#west/, namba_l[1] - 0.003)
            .replace(/#east/, namba_l[1] + 0.003);

        var qr = sendQuery(
            endpoint,
            sparql
        );
    
        qr.fail(
            function (xhr, textStatus, thrownError) {
                alert("Error: A '" + textStatus+ "' occurred.");
            }
        );
        qr.done(
            function (d) {
                var results = d.results.bindings;
                for (var i = markers.length; i >= 1; i--) {
                    map.removeLayer(markers[i-1]);
                }
                var filter = {};
                for (var i = 0; i < results.length; i++) {
                    var result = results[i];
                    var lat = getData(result.lat);
                    var lng = getData(result.long);
                    var beer = getData(result.beer);
                    var tel = getData(result.tel);
                    var s = getData(result.s);
                    if (filter[tel]) continue;
                    filter[tel] = 1;
                    var marker = L.marker([lat,lng], {icon: (i==0 ? topIcon : secIcon) }).addTo(map);
                    markers.push(marker);
                }
            }
        );
    });
})();
