// binding task controller
var task = require('./controllers/task-controller.js');


// exports route function for app.js, take express() as argument
exports.route = function(app) {
	app.get('/', function(req, res){
		res.render('map');
	});
	
	app.get('/updateTask',task.get_data);	//요청을 task.update로 넘김*/
	app.get('/rankKey',task.get_content);
	app.get('/createMarker',task.get_marker);
	app.get('/public/images/*',function(req, res){
		res.sendfile('.'+req.path);	//서버기준의 디렉토리
	});
};