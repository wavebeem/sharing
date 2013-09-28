var fs = require('fs');
var mysqlPassword = fs.readFileSync('mysql.passwd', 'utf-8').trim();

var mysql = require('mysql');
var db = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : mysqlPassword,
    database : 'sharing',
    timezone : 'Z',
});

var numPeople;
db.query('SELECT COUNT(*) AS num FROM people', function(err, rows) {
    numPeople = rows[0].num;
});

var routeSelectAllFrom = function(table, suffix) {
    return function(req, res) {
        res.type('json');
        var safeTableName = mysql.escapeId(table);
        var sql = 'SELECT * FROM ' + safeTableName;
        if (suffix) sql += ' ' + suffix
        db.query(sql, function(err, rows) {
            res.send({
                err: err,
                data: rows,
            });
        });
    };
};

exports.getPeople   = routeSelectAllFrom('people');
exports.getExpenses = routeSelectAllFrom('expenses', 'ORDER BY date DESC');
exports.getPayments = routeSelectAllFrom('payments', 'ORDER BY date DESC');

exports.addExpense = function(req, res) {
    res.type('json');
    var data = req.body;
    // db.query('delete from expenses');
    db.query('INSERT INTO expenses SET ?', {
        payer       : data.payer,
        amount      : data.amount,
        date        : data.date,
        spent_for   : data.spent_for,
        description : data.description,
    }, function(err, rows) {
        res.send({
            err: err,
            data: rows,
        });
    });
};

exports.totalPaidBy = function(req, res) {
    res.type('json');
    var data = req.params;
    db.query('SELECT SUM(amount) AS TOTAL FROM expenses WHERE ?', {
        payer: data.payer
    }, function(err, rows) {
        res.send({
            err: err,
            data: rows[0].total,
        });
    });
};

var rand = function(n) {
    return ~~(Math.random() * n);
};
var sql = function() {
    return [].join.call(arguments, '\n');
};
exports.debtFromTo = function(req, res) {
    res.type('json');
    var data = req.params;
    var sqlAmount = sql(
        'IF(spent_for = 1,',
        'amount / ?,',
        'amount)'
    );
    var sqlOwed = sql(
        'SELECT SUM(' + sqlAmount + ')',
        'FROM expenses',
        'WHERE payer = ?',
        '   AND (spent_for = ?',
        '       OR spent_for = 1)'
    );
    var sqlPaid = sql(
        'SELECT sum(amount)',
        'FROM payments',
        'WHERE payer = ?',
        '   AND payee = ?'
    );

    db.query(sql(
        'SELECT',
        '   IFNULL((' + sqlOwed + '), 0) -',
        '   IFNULL((' + sqlPaid + '), 0)',
        '   AS debt'
    ), [
        numPeople,
        +data.payer,
        +data.payee,
        +data.payer,
        +data.payee
    ], function(err, rows) {
        console.log(this.sql);
        console.log(err);
        console.log(rows);
        res.send({
            data: rows[0].debt
        });
    });
};
