var express = require('express');
var app = express();

var map = require('./routes/map');
app.use('/map',map);

app.get('/p1/r1', function(req, res){
	res.send('Hello /p1/r1');
});

app.listen(3003, function() {
	console.log('connection!');
});