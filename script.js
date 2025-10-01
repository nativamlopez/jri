var fondoActual = null;
var capas = {
    'protegidas': null,
    'municipios': null,
    'corredor': null,
    'stepping': null
};
var seleccionado = null;

var geojsonData = {
    'protegidas': __PROTEGIDAS_JSON__,
    'municipios': __MUNICIPIOS_JSON__,
    'corredor': __CORREDOR_JSON__,
    'stepping': __STEPPING_JSON__
};

function cambiarFondo(opcion) {
    if (fondoActual) {
        __MAP_ID__.removeLayer(fondoActual);
    }

    switch(opcion) {
        case 'osm':
            fondoActual = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png');
            break;
        case 'positron':
            fondoActual = L.tileLayer('https://cartodb-basemaps-a.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png');
            break;
        case 'dark':
            fondoActual = L.tileLayer('https://cartodb-basemaps-a.global.ssl.fastly.net/dark_all/{z}/{x}/{y}.png');
            break;
        case 'satellite':
            fondoActual = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}');
            break;
        case 'none':
            fondoActual = null;
            break;
    }

    if (fondoActual) {
        fondoActual.addTo(__MAP_ID__);
    }
}

function mostrarCapa(nombre) {
    // Si ya está activa → apagarla
    if (capas[nombre]) {
        __MAP_ID__.removeLayer(capas[nombre]);
        capas[nombre] = null;
        return;
    }

    // Si no está activa → encenderla
    capas[nombre] = L.geoJson(geojsonData[nombre], {
        style: function(feature) {
            return {
                color: 'green',
                weight: 0.8,
                fillOpacity: 0.4
            };
        },
        onEachFeature: function (feature, layer) {
            var popupContent = "";

            if (nombre === 'protegidas' && feature.properties.nn) {
                popupContent += "<strong>" + feature.properties.nn + "</strong><br>";
            }
            if (nombre === 'municipios' && feature.properties.desc) {
                popupContent += "<strong>" + feature.properties.desc + "</strong><br>";
            }
            if (nombre === 'corredor' && feature.properties.corredor) {
                popupContent += "<strong>" + feature.properties.corredor + "</strong><br>";
            }
            if (nombre === 'stepping' && feature.properties.stepping) {
                popupContent += "<strong>" + feature.properties.stepping + "</strong><br>";
            }

            if (feature.properties.actividade) {
                var actividades = feature.properties.actividade.split('/');
                popupContent += "<ul style='padding-left: 20px; margin: 5px 0;'>";
                actividades.forEach(function(act) {
                    popupContent += "<li>" + act.trim() + "</li>";
                });
                popupContent += "</ul>";
            }

            layer.bindPopup("<div style='padding:5px; font-size:14px; font-family:Segoe UI'>" + popupContent + "</div>");

            // Selección visual del área
            layer.on('click', function () {
                if (seleccionado) {
                    seleccionado.setStyle({
                        color: 'green',
                        weight: 0.8,
                        fillOpacity: 0.4
                    });
                }

                layer.setStyle({
                    color: '#ffc300',
                    weight: 0.8,
                    fillOpacity: 0.4
                });

                seleccionado = layer;
            });
        }
    }).addTo(__MAP_ID__);
}
