'use strict';

function Root() {
    if (GLOBAL.$root) return GLOBAL.$root;

    var self = this;
    var LS = localStorage;

    GLOBAL.$root = self;

    var confirmDeleteFrom = function(table, id) {
        if (confirm('Deletion is permanent. ARE YOU OK?')) {
            $.ajax('/api/' + table + '/' + id, { type: 'DELETE' })
                .then(self.update);
        }
    };

    self.deleteExpense = function(id) {
        return confirmDeleteFrom('expenses', id);
    };

    self.deletePayment = function(id) {
        return confirmDeleteFrom('payments', id);
    };

    self.currentUser = ko.observable(+LS.user_id || 2);
    self.currentUser.subscribe(function(val) {
        LS.user_id = val;
    });

    self.tempExpenseForm = ko.observable(new ExpenseForm());
    self.tempPaymentForm = ko.observable(new PaymentForm());

    self.saveTempExpense = function() {
        self.tempExpenseForm().save();
    };

    self.people = ko.observableArray();
    self.everyoneButMe = ko.computed(function() {
        return _(self.people()).filter(function(p) {
            return p.id !== self.currentUser();
        });
    });
    self.normalPeople = ko.computed(function() {
        return _(self.people()).filter(function(p) {
            return p.id > 1;
        });
    });
    self.normalPeopleExceptMe = ko.computed(function() {
        return _(self.people()).filter(function(p) {
            return p.id > 1 &&
                p.id !== self.currentUser();
        });
    });
    self.nameForId = function(id) {
        return self.people()[+id - 1].name;
    };
    self.numberOfPeople = ko.computed(function() {
        return self.people().length - 1;
    });

    self.expenses = ko.observableArray();
    self.debts = ko.observableArray();
    self.debtsPositive = ko.computed(function() {
        return _(self.debts()).filter(function(d) {
            return d.amount >= 0.01;
        });
    });
    self.payments = ko.observableArray();

    var applyBindings = _.once(function() {
        ko.applyBindings($root);
    });

    var allDebtsAjax = function() {
        var def = $.Deferred();

        var N = self.people().length - 1;
        var combos = [];
        var promises = [];

        var xs = _.range(2, 2 + N);
        _(xs).each(function(x) {
            var ys = _(xs).without(x);

            _(ys).each(function(y) {
                var path = '/' + [
                    'api',
                    'debt_from',
                    x,
                    'to',
                    y
                ].join('/');
                var prom = $.ajax(path);
                promises.push(prom);
                prom.done(function(data) {
                    combos.push({
                        from: x,
                        to: y,
                        amount: data.data,
                    });
                });
            });
        });

        var allDone = $.when.apply($, promises);
        allDone.done(function() {
            def.resolve(combos);
        });

        return def.promise();
    };

    self.update = function() {
        $.when(
            $.ajax('/api/expenses'),
            $.ajax('/api/payments'),
            allDebtsAjax()
        ).done(function(a, b, c) {
            var expenses = a[0].data;
            var payments = b[0].data;
            var debts    = c;

            self.expenses(expenses);
            self.payments(payments);
            self.debts(debts);

            applyBindings();
        })
    };

    self.cssClassForExpense = function(exp) {
        var d1 = stripTime(stripUtc(exp.date));
        var d2 = stripTime(today());

        return d1 > d2
            ? 'future'
            : '';
    };

    self.currentTab = ko.observable(getFragment() || 'expenses');
    self.currentTab.subscribe(function(val) {
        setFragment(val);
    });

    self.newExpenseForm = function() {
        var form = new ExpenseForm();
        self.tempExpenseForm(form);
        form.visible(true);
    };

    self.newPaymentForm = function() {
        var form = new PaymentForm();
        self.tempPaymentForm(form);
        form.visible(true);
    };

    self.menuVisible = ko.observable(false);

    self.debtBetween = function(from, to) {
        var debt = _(self.debts()).findWhere({
            from: from,
            to: to,
        });

        if (!debt || debt < 0) return '0';
        return '' + debt.amount;
    };
}
