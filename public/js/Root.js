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

    var applyBindings = _.once(function() {
        ko.applyBindings($root);
    });

    self.update = function() {
        $.when(
            $.ajax('/api/people'),
            $.ajax('/api/expenses')
        ).done(function(a, b) {
            var people   = a[0].data;
            var expenses = b[0].data;

            self.people(people);
            self.expenses(expenses);

            applyBindings();
        })
    };

    self.currentTab = ko.observable(LS.last_tab || 'expenses');
    self.currentTab.subscribe(function(val) {
        LS.last_tab = val;
    });

    self.newExpenseForm = function() {
        var form = new ExpenseForm();
        self.tempExpenseForm(form);
        form.visible(true);
    };

    self.menuVisible = ko.observable(true);
}
