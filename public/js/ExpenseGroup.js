'use strict';

function ExpenseGroup() {
    var expenses = ko.observableArray([]);

    this.expenses = ko.computed(function() {
        return expenses.slice(0).reverse();
    });

    this.addExpense = function(expense) {
        expenses.push(expense);
    };

    this.summary = ko.computed(function() {
        var moneyOwed = {};
        _($root.people()).each(function(person) {
            moneyOwed[person] = {};
            _($root.people()).each(function(other) {
                if (person === other) return;

                moneyOwed[person][other] = 0;
            }, this);
        }, this);
        return _([]).tap(function(results) {
            _(this.expenses()).each(function(expense) {
                var paidBy = expense.paidBy();
                _($root.people()).each(function(person) {
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
                if (a.debtor > b.debtor) return +1;

                if (a.debtee < b.debtee) return -1;
                if (a.debtee > b.debtee) return +1;

                if (a.amount < b.amount) return -1;
                if (a.amount > b.amount) return +1;

                return 0;
            });
        }.bind(this));
    }, this);
}
