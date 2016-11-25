// binding modules
var mysql = require('mysql');
var dbconfig = require("../config/database");
var minLati,minLong,maxLati,maxLong;

var pool = mysql.createPool(dbconfig.mysql);

module.exports = {
	showData : function(req, res,callback){
		var minLati = req.query.coordinate.minLati;
		var minLong = req.query.coordinate.minLong;
		var maxLati = req.query.coordinate.maxLati;
		var maxLong = req.query.coordinate.maxLong;
		pool.getConnection(function(err, connection){
			var sql = "SELECT user_name,count(user_name) FROM twitter_data"+
					" WHERE "+minLati+" <= latitude && latitude<= "+maxLati+" && "+minLong+" <= longitude && longitude <="+maxLong+
					" GROUP BY user_name"+
					" ORDER BY count(user_name) desc limit 10";
//			var sql = "SELECT user_name,count(user_name) FROM twitter_data"+
//			" WHERE latitude between"+minLati+"AND"+maxLati+"&& latitude between"+minLong+"and"+maxLong+
//			" GROUP BY user_name"+
//			" ORDER BY count(user_name) desc limit 10";
			if(minLati == 0){
				sql = "SELECT user_name,count(user_name) FROM twitter_data GROUP BY user_name ORDER BY count(user_name) desc limit 10";
			}
			//console.log(sql);
			connection.query(sql,function(err,result){
				result = JSON.stringify(result);
				callback(err,result);
				//연결 해제
				connection.release();
			})
		});
	},
	showContent : function(req, res,callback){
		var minLati = req.query.coordinate.minLati;
		var minLong = req.query.coordinate.minLong;
		var maxLati = req.query.coordinate.maxLati;
		var maxLong = req.query.coordinate.maxLong;
		pool.getConnection(function(err, connection){
			var sql = "SELECT content FROM twitter_data"+
					" WHERE "+minLati+" <= latitude && latitude<= "+maxLati+" && "+minLong+" <= longitude && longitude <="+maxLong;
			if(minLati == 0){
				sql = "SELECT content FROM twitter_data"+
					" limit 3";
			}
			connection.query(sql,function(err,result){
				result = JSON.stringify(result);
				callback(err,result);
				connection.release();
			})
		});
	},
	showMarker : function(req, res,callback){
		var minLati = req.query.coordinate.minLati;
		var minLong = req.query.coordinate.minLong;
		var maxLati = req.query.coordinate.maxLati;
		var maxLong = req.query.coordinate.maxLong;
		pool.getConnection(function(err, connection){
			var sql = "SELECT name, latitude, longitude, content FROM random"
			connection.query(sql,function(err,result){
				result = JSON.stringify(result);
				callback(err,result);
				connection.release();
			})
		});
	},
	showMarkerList : function(req, res,callback){
		var minLati = req.query.coordinate.minLati;
		var minLong = req.query.coordinate.minLong;
		var maxLati = req.query.coordinate.maxLati;
		var maxLong = req.query.coordinate.maxLong;
		var value = req.query.value;
		var tagId = req.query.tagId;
		pool.getConnection(function(err, connection){
			var sql;
			if(tagId == "topList"){
				 sql = "SELECT  latitude, longitude, content FROM twitter_data where user_name like '"+value+"'"+
					"AND "+minLati+" <= latitude && latitude<= "+maxLati+" && "+minLong+" <= longitude && longitude <="+maxLong;
			}else if(tagId == "topWordList"){
				 sql = "SELECT  latitude, longitude, content FROM twitter_data where content like '%"+value+"%'"+
					"AND "+minLati+" <= latitude && latitude<= "+maxLati+" && "+minLong+" <= longitude && longitude <="+maxLong;
			}
				connection.query(sql,function(err,result){
					result = JSON.stringify(result);
					callback(err,result);
					connection.release();
				})
		});
	}
}