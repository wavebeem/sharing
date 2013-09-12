var express = require('express');
var http    = require('http');
var path    = require('path');
var less    = require('less-middleware');

var routes  = require('./routes/main');

var app = express();

var env  = process.env.ENV || 'dev';
var port = env === 'dev' ? 8000 : 8001;

// var bodyParser = express.bodyParser();
app.use(express.bodyParser());

app.set('port', port);
app.set('env',  env);

if (env === 'dev') {
    app.use(express.errorHandler());
    app.use(express.logger('dev'));
}

app.use(express.favicon());
app.use(less({
    src: __dirname + '/less',
    dest: __dirname + '/public/css',
    prefix: '/css',
    force: env === 'dev'
}));
app.use(express.static(__dirname + '/public'));

app.get('/', function(req, res) {
    res.sendfile('/index.html');
});

app.get('/api/people', routes.getPeople);
app.put('/api/people', routes.addPerson);

var server = http.createServer(app)

server.listen(port, function() {
    console.log('Express server listening on port ' + port);
});
