var sqlite3 = require('sqlite3');
var db = new sqlite3.Database('db.db');

exports.getPeople = function(req, res) {
    res.type('json');
    db.all('select * from people', function(err, people) {
        res.send({
            stat: err? 'fail' : 'ok',
            people: people
        });
    });
};

exports.addPerson = function(req, res) {
    res.type('json');
    // db.run('insert into people(name) values(:name)', {
    //     name: req.body.name
    db.run('insert into people(name) values(?)', [
        req.body.name
    ], function(err) {
        res.send({
            stat: err? 'fail' : 'ok'
        });
    });
};
