(function(){
    var endpoint = "http://lod.hozo.jp/repositories/lodosaka";
    var sparql = (function() {/*
PREFIX bp:  <http://data.lodosaka.jp/choi-nomi201507012.ttl#> 
PREFIX geo:  <http://www.w3.org/2003/01/geo/wgs84_pos#> 
select * 
from <http://data.lodosaka.jp/choi-nomi201507012.ttl>
where{
?s bp:name ?o.
?s bp:tel ?t.
?s geo:lat ?lat.
?s geo:long ?long.
FILTER ( ?lat  > 34.667 && ?lat  < 34.668
        && ?long > 135.40 && ?long < 135.55)
}
    */}).toString().match(/\/\*([^]*)\*\//)[1];
    var namba = [34.6645204,135.5001207];

    var map = L.map('map').setView([35.0, 135.0], 5);
    L.tileLayer('http://j.tile.openstreetmap.jp/{z}/{x}/{y}.png', {
        attribution: 'Map data &copy; OpenStreetMap contributors, Tiles Courtesy of OpenStreetMap Japan',
        maxZoom: 19,
    }).addTo(map);

    $("#here").on("click",function(){
        var namba_l = [];
        namba_l[0] = namba[0] + Math.random() * 0.0006 - 0.0003;
        namba_l[1] = namba[1] + Math.random() * 0.0006 - 0.0003;
        map.setView(namba_l, 16, {animate: true});

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
                result_table(d.results.bindings);
            }
        );
    });
})();
