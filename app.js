var express = require('express');
var http    = require('http');
var path    = require('path');
var less    = require('less-middleware');

var routes  = require('./routes');

var app = express();

var env  = process.env.ENV || 'dev';
var port = env === 'dev' ? 7999 : 8000;

app.use(express.bodyParser());

app.set('port', port);
app.set('env',  env);

app.set('view engine', 'ejs');

if (env === 'dev') {
    app.use(express.errorHandler());
    app.use(express.logger('dev'));
}

app.use(less({
    src: __dirname + '/less',
    dest: __dirname + '/public/css',
    prefix: '/css',
    force: env === 'dev'
}));
app.use(express.static(__dirname + '/public'));

app.get('/', function(req, res) {
    var data = {
        tabs: [
            'expenses',
            'payments',
            'debts',
        ]
    };
    res.render('index', data, function(err, html) {
        res.send(html);
    });
});

app.get('/api/people',   routes.getPeople);
app.get('/api/expenses', routes.getExpenses);
app.get('/api/payments', routes.getPayments);

app.delete('/api/expenses/:id', routes.deleteExpenseById);
app.delete('/api/payments/:id', routes.deletePaymentById);

app.get('/api/total_paid_by/:payer', routes.totalPaidBy);

app.get('/api/debt_from/:payer/to/:payee', routes.debtFromTo);

app.post('/api/expenses', routes.addExpense);
app.post('/api/payments', routes.addPayment);

var server = http.createServer(app)

server.listen(port, function() {
    console.log('Express server listening on port ' + port);
});
