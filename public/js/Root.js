'use strict';

function Root() {
    if (GLOBAL.$root) return GLOBAL.$root;

    var self = this;
    var LS = localStorage;

    GLOBAL.$root = self;

    self.currentUser = ko.observable(+LS.user_id || 2);
    self.currentUser.subscribe(function(val) {
        LS.user_id = val;
    });

    self.tempExpenseForm = ko.observable(new ExpenseForm());

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
    self.nameForId = function(id) {
        return self.people()[+id - 1].name;
    };
    self.numberOfPeople = ko.computed(function() {
        return self.people().length - 1;
    });

    self.expenses = ko.observableArray();
    self.debts = ko.observableArray();
    self.debtsGrouped = ko.computed(function() {
        var grouped = _(self.debts()).groupBy('from');
        return _(grouped).pairs();
    });

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
            allDebtsAjax()
        ).done(function(a, b) {
            var expenses = a[0].data;
            var debts    = b;

            self.expenses(expenses);
            self.debts(debts);

            applyBindings();
        })
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

    self.menuVisible = ko.observable(true);
}
