/**
 * Module dependencies.
 */

var express = require('express')
  , http = require('http')
  , path = require('path')
  , bodyParser = require('body-parser');

//express setting
var app = express();

app.configure(function(){
	app.set('port', process.env.PORT || 3000);
	app.set('views', __dirname + '/views');
	app.set('view engine', 'ejs');
	app.use(express.favicon());
	app.use(express.logger('dev'));
	app.use(express.bodyParser());
	app.use(express.methodOverride());
	app.use(app.router);
	app.use(express.static(path.join(__dirname, 'public')));
	/*외부 모듈 사용시 처리해주어야한다. 좌측 디렉토리는 클라이언트쪽에서 접근할 수 있는 훼이크 경로 우측 경로가 실 경로이다. 편의를 위해 일단 동일하게 작성*/
	app.use('/resources/jquery-ui-1.12.1', express.static(__dirname + "/resources/jquery-ui-1.12.1"));
	app.use('/public/js', express.static(__dirname + "/public/js"));
	app.use('/public/stylesheets', express.static(__dirname + "/public/stylesheets"));
	app.use('/public/images',express.static(__dirname + "/public/images"));
	app.use('/resources/jqwidgets-ver4.3.0', express.static(__dirname + "/resources/jqwidgets-ver4.3.0"));
});


// development only
app.configure('development', function(){
  app.use(express.errorHandler());
});

// routing setting
require('./router.js').route(app);


//create connection pool for MySQL, just do it once when sever has created.

//create http server
http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});