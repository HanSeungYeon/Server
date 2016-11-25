// binding task model
var Task = require('../models/task.js');
var map = require('../public/js/java_map.js');

//Task를 조작해서 DB로부터 정보를 가져와서 가져온 정보를 토대로 view 조작
module.exports = {
		get_data : function(req, res) {
			var arr;
			Task.showData(req,res,function(err,result){
				arr = JSON.parse(result);		//갯수만큼 Object를 만듦
				res.send(arr);					//topID 5개를 클라이언트로 보내줌
			});
		},
		get_content : function(req, res) {
			/*logic 처리*/
			var obj = [];		//model에서 전달받은 데이터를 파싱해서 저장할 데이터
			var map = new Map();
			var sortData = [];
			var keys = [];
			var sendData = [];	//클라이언트에서 요청한 갯수만큼 리턴할 배열
			Task.showContent(req,res,function(err,result){
				obj = JSON.parse(result);
				//obj의 갯수만큼 순회하면서 words 라는 배열에 split한 결과를 집어넣는다.
				for(i in obj){
					var words = obj[i].content.split(" ");		//String.split
					for(word in words){
						if(words[word].length > 3){
							if(map.containsKey(words[word])){
								var count = map.get(words[word])+1;
								map.put(words[word],count);
							}else{
								map.put(words[word],1);
							}
						}
					}
				}	
				keys = map.keys();
				
				//key의 갯수만큼 순회하면서 key,value값을 가지는 리스트생성
				for(i in keys){
					sortData.push({key:keys[i],value:map.get(keys[i])});
				}
				
				//sort 내림차순 정렬
				sortData.sort(function(a,b){
					return(a.value < b.value) ? 1 : (a.value > b.value) ? -1 : 0;
				});
				
				//top5
				for(var i = 0; i < 10 ; i++){
					sendData.push(sortData[i]);
				}
					res.send(sendData);
			});
		},
		get_marker : function(req, res) {
			var arr;
			Task.showMarkerList(req,res,function(err,result){
				arr = JSON.parse(result);
				res.send(arr);
			});
		}
}
function topId(arr){
	var map = new Map();
	
	for (var key in arr) {
		//console.log(arr[key].name);		//객체의 이름을 하나씩 출력
		var key = arr[key].user_id;
		
		if(map.containsKey(key)){
			var count = map.get(key)+1;
			map.put(key,count);
		}else{
			map.put(key,1);
		}
	}
	console.log(map.size());
	console.log(map);
	
}