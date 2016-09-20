<%@ page  language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>

<%@page import="java.io.*, java.sql.*,twitter4j.*,kr.ac.kunsan.mcalab.*"%>
<%
    request.setCharacterEncoding("utf-8");
    String minLong = request.getParameter("minLong");
    String minLati = request.getParameter("minLati");
    String maxLong = request.getParameter("maxLong");
    String maxLati = request.getParameter("maxLati");   
%>
<%
JSONObject result = DBConnector.getTwitterJSON(new String[] {
  minLati, maxLati, minLong, maxLong
});

//out.print(result.toString());
%>
<!DOCTYPE html>
<html>

<head>
    <title>Twitter View</title>
    <link rel="stylesheet"
          href="http://openlayers.org/en/v3.17.1/css/ol.css" type="text/css">
    <script src="http://openlayers.org/en/v3.17.1/build/ol.js"></script>
    <script src="http://code.jquery.com/jquery-1.7.js"></script>
    <script src="http://cdn.polyfill.io/v2/polyfill.min.js?features=requestAnimationFrame,Element.prototype.classList,URL"></script>
    <script src="http://openlayers.org/en/v3.18.1/build/ol.js"></script>
    <script src="https://code.jquery.com/jquery-2.2.3.min.js"></script>
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/css/bootstrap.min.css">
    <script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/js/bootstrap.min.js"></script>
</head>
<body>
    <div id="map" class="map"><div id="popup"></div></div>
    <script>
    
    var result = <%=result%>;
    var popups = [];
    var iconFeatures = [];
	var element = document.getElementById('popup');
	
    $.each(result, function(idx, item){
		$.each(item,function(key,value){
			var iconFeature = new ol.Feature({
				geometry: new ol.geom.Point(ol.proj.fromLonLat([Number(item[key].longitude), Number(item[key].latitude)])),
				name: item[key].content
			});
			iconFeatures.push(iconFeature);
		});
	});
    
   
    var iconStyle = new ol.style.Style({
		image: new ol.style.Icon(/** @type {olx.style.IconOptions} */ ({
	    anchor: [0.5, 46],
	    anchorXUnits: 'fraction',
	    anchorYUnits: 'pixels',
	    opacity: 0.75,
	    src: 'map-marker2.png',
	    offset: [50, 50]
	  }))
	});
	
	var vectorSource = new ol.source.Vector({
		  features: iconFeatures //add an array of features
		});

	var vectorLayer = new ol.layer.Vector({
		  source: vectorSource,
		  style: iconStyle
		});
	
	var raster = new ol.layer.Tile({
        source: new ol.source.OSM()
    });
   
    var source = new ol.source.Vector({ wrapX: false });

    var vector = new ol.layer.Vector({
        source: source,
        style: new ol.style.Style({
            fill: new ol.style.Fill({
                color: 'rgba(255, 255, 255, 0.2)'
            }),
            stroke: new ol.style.Stroke({
                color: '#ffcc33',
                width: 2
            }),
            image: new ol.style.Circle({
                radius: 7,
                fill: new ol.style.Fill({
                    color: '#ffcc33'
                })
            })
        })
    });
    var map = new ol.Map({
        controls: ol.control.defaults({
            attributionOptions: /** @type {olx.control.AttributionOptions} */ ({
                collapsible: false
            })
        }),
        layers: [raster,vector,vectorLayer],
        target: 'map',
        view: new ol.View({
            center: ol.proj.fromLonLat([126.6827, 35.9447]),//[0,0],
            zoom: 17
        })
    });
    var element = document.getElementById('popup');
    var popup = new ol.Overlay({
    	element: element,
    	positioning: 'bottom-center',
    	stopEvent: false,
    	offset: [0,-50]
    });
    map.addOverlay(popup);
    
    map.on('click', function(evt) {
    	var feature = map.forEachFeatureAtPixel(evt.pixel,
    			function(feature) {
    		return feature;
    	});
    	if (feature) {
    		var coordinates = feature.getGeometry().getCoordinates();
    		popup.setPosition(coordinates);
    		$(element).popover({
    	    	'placement': 'top',
    	    	'html' : true,
    	    	'content': feature.get('name')
    	    });
    		$(element).popover('show');
    	} else {
    		$(element).popover('destroy');
    	}
    });
    
    </script>
</body>
</html>