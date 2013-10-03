var fs = require('fs');
var mysqlPassword = fs.readFileSync('mysql.passwd', 'utf-8').trim();

var mysql = require('mysql');
var db = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : mysqlPassword,
    database : 'sharing',
    // timezone : 'Z',
});

var numPeople;
db.query('SELECT COUNT(*) - 1 AS num FROM people', function(err, rows) {
    numPeople = rows[0].num;
});

var keepAlive = function() {
    db.query('SELECT 1');
};
setInterval(keepAlive, 60 * 1000);

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

var routeDeleteById = function(table) {
    return function(req, res) {
        res.type('json');
        var safeTableName = mysql.escapeId(table);
        var sql = 'DELETE FROM ' + safeTableName + ' WHERE ?';
        var data = req.params;
        console.log(data);
        db.query(sql, { id: data.id }, function(err, rows) {
            console.log(this.sql);
            res.send({
                err: err,
                data: rows,
            });
        });
    };
};

exports.deleteExpenseById = routeDeleteById('expenses');
exports.deletePaymentById = routeDeleteById('payments');

exports.addExpense = function(req, res) {
    res.type('json');
    var data = req.body;
    db.query('INSERT INTO expenses SET ?', {
        payer       : data.payer,
        amount      : data.amount,
        date        : data.date,
        payee       : data.payee,
        description : data.description,
    }, function(err, rows) {
        res.send({
            err: err,
            data: rows,
        });
    });
};

exports.addPayment = function(req, res) {
    res.type('json');
    var data = req.body;
    db.query('INSERT INTO payments SET ?', {
        payer       : data.payer,
        payee       : data.payee,
        amount      : data.amount,
        date        : data.date,
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
        'IF(payee = 1,',
        'amount / ?,',
        'amount)'
    );
    var sqlOwed = sql(
        '(SELECT SUM(' + sqlAmount + ')',
        'FROM expenses',
        'WHERE payer = ?',
        '   AND (payee = ?',
        '       OR payee = 1))'
    );
    var sqlPaid = sql(
        '(SELECT sum(amount)',
        'FROM payments',
        'WHERE payer = ?',
        '   AND payee = ?)'
    );

    var A = sql(
    );

    // A+B/3 - C+D/3

    db.query(sql(
        'SELECT',
        '   (',
        '       IFNULL(' + sqlOwed + ', 0) +',
        '       IFNULL(' + sqlPaid + ', 0)',
        '   ) - (',
        '       IFNULL(' + sqlOwed + ', 0) +',
        '       IFNULL(' + sqlPaid + ', 0)',
        '   )',
        '   AS debt'
    ), [
        numPeople,

        +data.payer,
        +data.payee,
        +data.payer,
        +data.payee,

        numPeople,

        +data.payee,
        +data.payer,
        +data.payee,
        +data.payer,
    ], function(err, rows) {
        res.send({
            data: rows[0].debt
        });
    });
};
