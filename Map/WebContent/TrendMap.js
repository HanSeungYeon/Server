		var raster = new ol.layer.Tile({
            source: new ol.source.OSM()
        });

        var mousePositionControl = new ol.control.MousePosition({
            coordinateFormat: ol.coordinate.createStringXY(4),
            projection: 'EPSG:4326',
            // comment the following two lines to have the mouse position
            // be placed within the map.
            className: 'custom-mouse-position',
            target: document.getElementById('mouse-position'),
            undefinedHTML: '&nbsp;'
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
            }).extend([mousePositionControl]),
            layers: [raster,vector],
            target: 'map',
            //size: '600px',
            view: new ol.View({
                center: ol.proj.fromLonLat([126.6827, 35.9447]),//[0,0],
                zoom: 17
            })
        });

        //option
        var projectionSelect = document.getElementById('projection');
        projectionSelect.addEventListener('change', function (event) {
            mousePositionControl.setProjection(ol.proj.get(event.target.value));
        });

        var precisionInput = document.getElementById('precision');
        precisionInput.addEventListener('change', function (event) {
            var format = ol.coordinate.createStringXY(event.target.valueAsNumber);
            mousePositionControl.setCoordinateFormat(format);
        });

        var typeSelect = document.getElementById('type');
        var draw; // global so we can remove it later
        var temp = null;
        var start, end;
        var minLong, maxLong, minLat, maxLat;
                
        function addInteraction() {
            var value = typeSelect.value;
            var geometryFunction, maxPoints;
            value = 'LineString';
            maxPoints = 2;

            geometryFunction = function (coordinates, geometry) {
                if (!geometry) {
                     geometry = new ol.geom.Polygon(null);
                  }
                  start = coordinates[0];
                  end = coordinates[1];

                  geometry.setCoordinates([
                [start, [start[0], end[1]], end, [end[0], start[1]], start]
                    ]);
                    return geometry;
            };

            draw = new ol.interaction.Draw({
                source: source,
                type: /** @type {ol.geom.GeometryType} */ (value),
                geometryFunction: geometryFunction,
                maxPoints: maxPoints,
            });
           
   
            map.addInteraction(draw);
                    
            drawStart = function () {
            	vector.getSource().clear();
            }
            drawEnd = function () {
                var xy1 = transformingCoordinate(start);
                var xy2 = transformingCoordinate(end);
                setInputPosition(xy1, xy2);
            }
            draw.on('drawend', drawEnd);    //Event
            draw.on('drawstart',drawStart);
        }

        /* Function stringSplit
         * Parameter string, number
         * Return string
         * Comment openSource javaScript split
         * Modified 7/20 20:00
         */

        function stringSplit(strData, strIndex) {
            var stringList = new Array();
            while (strData.indexOf(strIndex) != -1) {
                stringList[stringList.length] = strData.substring(0, strData.indexOf(strIndex));
                strData = strData.substring(strData.indexOf(strIndex) + (strIndex.length), strData.length);
            }
            stringList[stringList.length] = strData;
            return stringList;
        }

        /* Function setInputPosition
         * Parameter Object(coordinate, coordinate)
         * Return 
         * Comment print coordinate
         * Modified 7/20 20:00
         */

        function setInputPosition(coordinate1, coordinate2) {
            if (start !== undefined && end !== undefined) {
                var xy1 = stringSplit(coordinate1, ',');
                var xy2 = stringSplit(coordinate2, ',');
                var minLong;
                var minLati;
                var maxLong;
                var maxLati;
                
                if(xy1[0]<xy2[0]){
                	minLong = xy1[0];
                	maxLong = xy2[0];
                }else{
                	minLong = xy2[0];
                	maxLong = xy1[0];
                }
                
                if(xy1[1]<xy2[1]){
                	minLati = xy1[1];
                	maxLati = xy2[1];
                }else{
                	minLati = xy2[1];
                	maxLati = xy1[1];
                }
                
                document.getElementById('startX').value = minLong;
                document.getElementById('startY').value = minLati;
                document.getElementById('endX').value = maxLong;
                document.getElementById('endY').value = maxLati;
            }
        }

        /* Function transformingCoordinate
         * Parameter Object(coordinate)
         * Return String
         * Modified 7/20 20:00
         */

        function transformingCoordinate(coordinate) {
            var point = ol.proj.toLonLat(coordinate, 'EPSG:3857');
            var stringifyFunc = ol.coordinate.createStringXY(4);
            var out = stringifyFunc(point);
            return out;
        }


        typeSelect.onchange = function () {
            map.removeInteraction(draw);
            addInteraction();
        };

        addInteraction();