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
        console.log('Attempting to save expense form');
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

    self.expenses = ko.observableArray();

    self.currentTab = ko.observable(LS.last_tab || 'expenses');
    self.currentTab.subscribe(function(val) {
        LS.last_tab = val;
    });

    self.newExpenseForm = function() {
        self.tempExpenseForm(new ExpenseForm());
    };

    self.menuVisible = ko.observable(true);
}
