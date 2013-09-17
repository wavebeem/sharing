// var sqlite3 = require('sqlite3');
var dblite = require('dblite');
var db = dblite('db.db');

var routeSelectAllFrom = function(table) {
    return function(req, res) {
        res.type('json');
        console.log('table name: ' + table);
        db.query('select * from ?', [table], function(data) {
        // db.all('select * from ?', table, function(err, data) {
            // console.log("SQL: " + this.sql);
            // if (err) {
            //     console.log(err);
            //     err.stat = 'fail',
            //     err.msg = err.message;
            //     res.send(err);
            // }
            // else {
                res.send({
                    stat: 'ok',
                    data: data
                });
            // }
        });
    };
};

exports.getPeople   = routeSelectAllFrom('people');
exports.getExpenses = routeSelectAllFrom('expenses');
exports.getPayments = routeSelectAllFrom('payments');
