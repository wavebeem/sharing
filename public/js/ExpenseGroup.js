'use strict';

function ExpenseGroup() {
    var expenses = ko.observableArray([]);

    this.expenses = ko.computed(function() {
        return expenses.slice(0).reverse();
    });

    this.addExpense = function(expense) {
        expenses.push(expense);
    };

    var moneyOwed = ko.computed(function() {
        var map = {};

        _($root.people()).each(function(person) {
            map[person] = {};
            _($root.people()).each(function(other) {
                if (person === other) return;

                map[person][other] = 0;
            });
        });

        _(this.expenses()).each(function(expense) {
            var paidBy = expense.paidBy();
            _($root.people()).each(function(person) {
                if (person === paidBy) return;

                map[paidBy][person] += expense.share();
            });
        });

        return map;
    }, this);

    var listOfTotalMoneyOwed = ko.computed(function() {
        var results = [];

        _(moneyOwed()).each(function(others, personA) {
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

        return results;
    }, this);

    var sortDebts = function(a, b) {
        if (a.debtor < b.debtor) return -1;
        if (a.debtor > b.debtor) return +1;

        if (a.debtee < b.debtee) return -1;
        if (a.debtee > b.debtee) return +1;

        if (a.amount < b.amount) return -1;
        if (a.amount > b.amount) return +1;

        return 0;
    };

    this.summary = ko.computed(function() {
        return _(listOfTotalMoneyOwed())
            .chain()
            .sortBy(sortDebts)
            .groupBy('debtor')
            .values()
            .value();
    });
}
