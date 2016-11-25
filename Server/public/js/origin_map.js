	var minLong = 0;
	var minLati = 0;
	var maxLong = 0;
	var maxLati = 0;
	var iconFeatures = [];
	var element = document.getElementById('popup');
	var popup = new ol.Overlay({
    	element: element,
    	positioning: 'bottom-center',
    	stopEvent: false,
    	offset: [0,-50]
    });
	//사용자 요청
	$('#btn').jqxButton({ width: '120px', height: '35px', theme: 'darkblue'});
	$('#btnMark').jqxButton({ width: '120px', height: '35px', theme: 'darkblue'});
	
	$('#btn').bind('click',function(){
		//브라우저가 서버로부터 응답을 받으면 onload()이벤트 발생.
		var coordinate = {
				"minLong" : minLong,
				"minLati" : minLati,
				"maxLong" : maxLong,
				"maxLati" : maxLati,
		};
		/*topID request*/
		$.ajax({
			url: '/updateTask',
			type: 'get',
			data: {coordinate},			//영역크기의 위,경도 값을 데이터로 넘겨준다.
			success:function(data){		//서버로부터 응답을 받으면 data가 넘어온다. 여기서 data는 top10 객체
				//console.log(data);
				
				//<ol> 리스트 내부의 요소를 초기화
				$("#topList").html("");
				
				//동적으로 리스트뷰를 만들어주는 tag를 생성하는 코드
				for(key in data){
					var tag = "<li>"+data[key].user_name+"</li>";
					$("#topList").append(tag);
				}
			}
		})
		
		/*topKeyword request*/
		$.ajax({
			url: '/rankKey',
			type: 'get',
			data: {coordinate},			//영역크기의 위,경도 값을 데이터로 넘겨준다.
			success:function(data){		//서버로부터 응답을 받으면 data가 넘어온다. 여기서 data는 top10 객체
				//console.log(data);
				
				//<ol> 리스트 내부의 요소를 초기화
				$("#topWordList").html("");
				if(data[0] != null){	//받아온 데이터가 비어있지 않으면 리스트 출력
					for (key in data){
						var tag = "<li>"+data[key].key+"</li>";
						$("#topWordList").append(tag);
					}
				}
			}
		})
		
		/*marker*/
		$.ajax({
			url: '/createMarker',
			type: 'get',
			data: {coordinate},			//영역크기의 위,경도 값을 데이터로 넘겨준다.
			success:function(result){		//서버로부터 응답을 받으면 data가 넘어온다. 여기서 data는 top10 객체
				for(i in result){
					var iconFeature = new ol.Feature({
						geometry: new ol.geom.Point(ol.proj.fromLonLat([Number(result[i].longitude),Number(result[i].latitude)])),
						name: result[i].content
					});
					iconFeatures.push(iconFeature);
				}
				
				/*popup*/
				vactorSource = new ol.source.Vector({
					  features: iconFeatures //add an array of features
				});
				/*마커에 이미지를 넣음*/
				vactorLayer = new ol.layer.Vector({
					  source: vectorSource,
					  style: iconStyle
					});
				map.addLayer(vactorLayer);
				map.addOverlay(popup);
			}//success
		})//ajax
	});
	var iconStyle = new ol.style.Style({
		image: new ol.style.Icon(/** @type {olx.style.IconOptions} */ ({
	    anchor: [0.5, 46],
	    anchorXUnits: 'fraction',
	    anchorYUnits: 'pixels',
	    src: '/public/images/map-marker.png',
	    opacity: 0.75
		//scale : 1		//크기
	  }))
	});
	var vectorSource;
	var vectorLayer;
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
	    layers: [raster,vector],
	    target: 'map',
	    //size: '600px',
	    view: new ol.View({
	        center: ol.proj.fromLonLat([126.6827, 35.9447]),//[0,0],
	        zoom: 7
	    })
	});
	
	//option
	/*var projectionSelect = document.getElementById('projection');
	projectionSelect.addEventListener('change', function (event) {
	    mousePositionControl.setProjection(ol.proj.get(event.target.value));
	});
	
	var precisionInput = document.getElementById('precision');
	precisionInput.addEventListener('change', function (event) {
	    var format = ol.coordinate.createStringXY(event.target.valueAsNumber);
	    mousePositionControl.setCoordinateFormat(format);
	});*/
	
	var typeSelect = document.getElementById('type');
	var draw; // global so we can remove it later
	var temp = null;
	var start, end;
	var minLong, maxLong, minLat, maxLat;
	        
	function addInteraction() {
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
	addInteraction();