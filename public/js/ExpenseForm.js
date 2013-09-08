'use strict';

function ExpenseForm() {
    var self = this;

    self.selectedMonth = ko.observable(null);
    self.selectedDay   = ko.observable(null);
    self.selectedYear  = ko.observable(null);

    self.selectToday = function() {
        var today = new Date();

        self.selectedMonth(today.getMonth() + 1);
        self.selectedDay(today.getDate());
        self.selectedYear(today.getFullYear());
    };

    self.selectToday();

    self.months = ko.observable(_.range(1, 13));

    self.years = ko.computed(function() {
        var year = new Date().getFullYear();

        return _.range(year - 1, year + 2);
    });

    self.days = ko.computed(function() {
        var month   = self.selectedMonth();
        var year    = self.selectedYear();
        var numDays = daysInMonth(month, year);

        return _.range(1, numDays + 1);
    });

    self.spendTarget = ko.observable('');

    self.visible = ko.observable(true);

    self.price = ko.observable('').extend({ money: true });

    self.description = ko.observable('');

    self.notVisibile = ko.computed(function() {
        return ! self.visible();
    });

    self.show = function() {
        self.selectToday();
        self.visible(true);
    };

    self.hide = self.visible.bind(null, false);
}
