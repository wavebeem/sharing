var fs = require('fs');
var mysqlPassword = fs.readFileSync('mysql.passwd', 'utf-8').trim();

var mysql = require('mysql');
var sqlDo = function(query, params, then, fail) {
    var db = mysql.createConnection({
        host     : 'localhost',
        user     : 'root',
        password : mysqlPassword,
        database : 'sharing',
    });

    db.query(query, params, function(err, rows) {
        if (err) {
            if (fail) fail(err)
        }
        else {
            then(rows);
        }

        db.end();
    });
};

var K = {
    ID_EVERYONE: 1,
};

var numPeople;
sqlDo('SELECT COUNT(*) - 1 AS num FROM people', [], function(rows) {
    numPeople = rows[0].num;
});

var routeSelectAllFrom = function(table, suffix) {
    return function(req, res) {
        res.type('json');

        var safeTableName = mysql.escapeId(table);
        var sql = 'SELECT * FROM ' + safeTableName;
        if (suffix) sql += ' ' + suffix

        sqlDo(sql, [], function(rows) {
            res.send({ data: rows });
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

        sqlDo(sql, { id: data.id }, function(rows) {
            res.send({ data: rows });
        });
    };
};

exports.deleteExpenseById = routeDeleteById('expenses');
exports.deletePaymentById = routeDeleteById('payments');

exports.addExpense = function(req, res) {
    res.type('json');
    var data = req.body;
    sqlDo('INSERT INTO expenses SET ?', {
        payer       : data.payer,
        amount      : data.amount,
        date        : data.date,
        payee       : data.payee,
        description : data.description,
    }, function(rows) {
        res.send({
            data: rows,
        });
    });
};

exports.addPayment = function(req, res) {
    res.type('json');
    var data = req.body;
    sqlDo('INSERT INTO payments SET ?', {
        payer  : data.payer,
        payee  : data.payee,
        amount : data.amount,
        date   : data.date,
    }, function(rows) {
        res.send({
            data: rows,
        });
    });
};

exports.totalPaidBy = function(req, res) {
    res.type('json');
    var data = req.params;
    sqlDo('SELECT SUM(amount) AS TOTAL FROM expenses WHERE ?', {
        payer: data.payer
    }, function(rows) {
        res.send({
            data: rows[0].total,
        });
    });
};

var rand = function(n) {
    return ~~(Math.random() * n);
};
var sql = function() {
    return [].join.call(arguments, ' ');
};
exports.debtFromTo = function(req, res) {
    res.type('json');
    var data = req.params;

    var qExp = sql(
        'IFNULL((',
            'SELECT SUM(amount) / ?',
            'FROM expenses',
            'WHERE payer = ? AND payee = ?',
        '), 0)'
    );

    var qPay = sql(
        'IFNULL((',
            'SELECT SUM(amount)',
            'FROM payments',
            'WHERE payer = ? AND payee = ?',
        '), 0)'
    );

    var a = +data.payer;
    var b = +data.payee;
    var everyone = K.ID_EVERYONE;

    sqlDo(sql(
        'SELECT',
            '(', qExp, '+', qExp, '+', qPay, ') -',
            '(', qExp, '+', qExp, '+', qPay, ')',
        'AS debt'
    ), [
        1, b, a,
        numPeople, b, everyone,
        b, a,
        1, a, b,
        numPeople, a, everyone,
        a, b,
    ], function(rows) {
        res.send({
            data: rows[0].debt
        });
    });
};
