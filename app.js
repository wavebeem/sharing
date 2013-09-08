var express = require('express');
var http    = require('http');
var path    = require('path');
var less    = require('less-middleware');

var app = express();

var env  = process.env.ENV || 'dev';
var port = env === 'dev' ? 8000 : 8001;

app.set('port', port);
app.set('env',  env);

app.use(express.favicon());
app.use(express.logger('dev'));
app.use(less({
    src: __dirname + '/less',
    dest: __dirname + '/public/css',
    prefix: '/css',
    force: env === 'dev'
}));
app.use(express.static(__dirname + '/public'));

if (env === 'dev') {
    app.use(express.errorHandler());
}

app.get('/', function(req, res) {
    res.sendfile('/index.html');
});

var server = http.createServer(app)

server.listen(port, function() {
    console.log('Express server listening on port ' + port);
});
