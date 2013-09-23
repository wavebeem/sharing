var fs = require('fs');
var mysqlPassword = fs.readFileSync('mysql.passwd', 'utf-8').trim();

var mysql = require('mysql');
var db = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : mysqlPassword,
});

db.query('use sharing');

var routeSelectAllFrom = function(table) {
    return function(req, res) {
        res.type('json');
        var safeTableName = mysql.escapeId(table);
        db.query('select * from ' + safeTableName, function(err, rows) {
            res.send({
                err: err,
                data: rows,
            });
        });
    };
};

exports.getPeople   = routeSelectAllFrom('people');
exports.getExpenses = routeSelectAllFrom('expenses');
exports.getPayments = routeSelectAllFrom('payments');

exports.addExpense = function(req, res) {
    res.type('json');
    var data = req.body;
    console.log(data);
    db.query('insert into expenses set ?', {
        payer        : data.payer,
        amount       : data.amount,
        date         : data.date,
        spent_for_id : data.date,
        description  : data.date,
    }, function(err, rows) {
        res.send({
            err: err,
            data: rows,
        });
    });
};
