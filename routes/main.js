var fs = require('fs');
var mysqlPassword = fs.readFileSync('mysql.passwd', 'utf-8').trim();

var mysql = require('mysql');
var db = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : mysqlPassword,
    // database : 'sharing',
    timezone : 'Z',
});

db.query('use sharing');

var routeSelectAllFrom = function(table, suffix) {
    return function(req, res) {
        res.type('json');
        var safeTableName = mysql.escapeId(table);
        var sql = 'select * from ' + safeTableName;
        if (suffix) sql += ' ' + suffix
        db.query(sql, function(err, rows) {
            console.log(rows);
            res.send({
                err: err,
                data: rows,
            });
        });
    };
};

exports.getPeople   = routeSelectAllFrom('people');
exports.getExpenses = routeSelectAllFrom('expenses', 'order by date desc');
exports.getPayments = routeSelectAllFrom('payments', 'order by date desc');

exports.addExpense = function(req, res) {
    res.type('json');
    var data = req.body;
    console.log(data);
    // db.query('delete from expenses');
    db.query('insert into expenses set ?', {
        payer       : data.payer,
        amount      : data.amount,
        date        : data.date,
        spent_for   : data.spent_for,
        description : data.description,
    }, function(err, rows) {
        console.error(this.sql);
        res.send({
            err: err,
            data: rows,
        });
    });
};

exports.totalPaidBy = function(req, res) {
    res.type('json');
    var data = req.params;
    db.query('select sum(amount) as total from expenses where ?', {
        payer: data.payer
    }, function(err, rows) {
        res.send({
            err: err,
            data: rows[0].total,
        });
    });
};
