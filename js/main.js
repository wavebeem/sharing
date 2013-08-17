(function(window, document, undefined) { 'use strict';
function $(sel) {
    return document.querySelector(sel);
}

function mod(a, b) {
    return ((a % b) + b) % b;
}

var colors = [
    "#75507b", // plum
    "#cc0000", // scarlet red
    "#4e9a06", // chameleon
    "#edd400", // butter
    "#3465a4", // sky blue
    "#f57900", // orange
    "#c17d11", // chocolate
    "#babdb6", // aluminium
];

function ExpenseGroup() {
    var expenses = ko.observableArray([]);

    this.expenses = ko.computed(function() {
        return expenses.slice(0).reverse();
    });

    this.addExpense = function(expense) {
        if (expense.people().length === 0) {
            expense.people(this.people());
        }
        expenses.push(expense);
    };

    var people = ko.observableArray([]);
    this.people = ko.computed({
        read: function() { return people() },
        write: function(people_) { people(people_.slice(0).sort()) },
    });

    var backgroundFor = function(name) {
        var i = people().indexOf(name);
        return colors[mod(i, colors.length)];
    }.bind(this);

    this.makeCss = function() {
        $('#name_css').innerHTML = people().map(function(name) {
            var className = 'color_' + name.toLowerCase().replace(/[^a-z_]/, '_');

            return [
                '.' + className + '.true       { background: '            + backgroundFor(name) + ' }',
                '.' + className + '.color_left { border-left: 6px solid ' + backgroundFor(name) + ' }',
                '.' + className + '.border     { border-color: '          + backgroundFor(name) + ' }',
            ].join('\n');
        }, this).join('\n');
    };

    this.summary = ko.computed(function() {
        var moneyOwed = {};
        _(this.people()).each(function(person) {
            moneyOwed[person] = {};
            _(this.people()).each(function(other) {
                if (person === other) return;

                moneyOwed[person][other] = 0;
            }, this);
        }, this);
        return _([]).tap(function(results) {
            _(this.expenses()).each(function(expense) {
                var paidBy = expense.paidBy();
                _(expense.people()).each(function(person) {
                    if (person === paidBy) return;

                    moneyOwed[paidBy][person] += expense.share();
                });
            });

            _(moneyOwed).each(function(others, personA) {
                _(others).each(function(money, personB) {
                    if (money > 0) {
                        results.push({
                            debtee: personA,
                            debtor: personB,
                            amount: money,
                        });
                    }
                }, this);
            }, this);

            results.sort(function(a, b) {
                if (a.debtor < b.debtor) return -1;
                if (a.debtor > b.debtor) return  1;

                if (a.debtee < b.debtee) return -1;
                if (a.debtee > b.debtee) return  1;

                if (a.amount < b.amount) return -1;
                if (a.amount > b.amount) return  1;

                return 0;
            });
        }.bind(this));
    }, this);

    this.people.subscribe(this.makeCss, this);
}

function createObservables(thisp, opts, defaults) {
    _(defaults).each(function(v, k) {
        var real = _(opts).has(k) ? opts[k] : defaults[k];
        var func = _(real).isArray() ? ko.observableArray : ko.observable;
        thisp[k] = func(real);
    });
}

var expenseId = 0;
function Expense(opts) {
    opts = opts || {};

    createObservables(this, opts, {
        price: 0,
        paidBy: '',
        description: '',
        date: new Date(),
        people: [],
        sharePaidBy: {},
    });

    this.expenseId = expenseId++;

    this.formattedDate = ko.computed(function() {
        var d = this.date();
        var day = d.getDate();
        var mon = d.getMonth() + 1;

        return [mon, day].join('/');
    }, this);

    this.share = ko.computed(function() {
        return this.price() / this.people().length;
    }, this);

    this.formattedShare = ko.computed(function() {
        return this.share().toFixed(2);
    }, this);

    this.formattedPrice = ko.computed(function() {
        return this.price().toFixed(2);
    }, this);

    this.toggleSharePaidBy = function(name, event) {
        var el = event.target;
        el.classList.toggle('true');
        this.sharePaidBy()[name] = true;
        this.sharePaidBy.notifySubscribers();
    };
}

document.addEventListener('DOMContentLoaded', function(event) {
    var eg = new ExpenseGroup();
    eg.people(['Brian', 'Ash', 'Trevor']);
    eg.addExpense(new Expense({ price:   5, paidBy: 'Brian'  , date: new Date('8/21/2013'), description: 'Candy' }));
    eg.addExpense(new Expense({ price: 145, paidBy: 'Brian'  , date: new Date('8/21/2013'), description: 'Groceries' }));
    eg.addExpense(new Expense({ price: 789, paidBy: 'Ash'    , date: new Date('8/11/2013'), description: 'Rent' }));
    eg.addExpense(new Expense({ price:  21, paidBy: 'Trevor' , date: new Date('4/30/2013'), description: 'Movie tickets and beer' }));

    ko.applyBindings(eg);
    eg.makeCss();

    window.$eg = eg;
}, false);
})(this, this.document, void 0);
