'use strict';

function Root() {
    var self = this;

    if (GLOBAL.$root) return GLOBAL.$root;

    GLOBAL.$root = self;

    self.currentUser = ko.observable(3);

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

    self.currentTab = ko.observable(localStorage.last_tab || 'expenses');
    self.currentTab.subscribe(function(val) {
        localStorage.last_tab = val;
    });

    self.menuVisible = ko.observable(true);
}
