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
