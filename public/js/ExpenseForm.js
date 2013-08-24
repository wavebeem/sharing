'use strict';

function ExpenseForm() {
    this.selectedMonth = ko.observable(null);
    this.selectedDay   = ko.observable(null);
    this.selectedYear  = ko.observable(null);

    this.selectToday = function() {
        var today = new Date();

        this.selectedMonth(today.getMonth() + 1);
        this.selectedDay(today.getDate());
        this.selectedYear(today.getFullYear());
    }.bind(this);

    this.selectToday();

    this.months = ko.observable(_.range(1, 13));

    this.years = ko.computed(function() {
        var year = new Date().getFullYear();

        return _.range(year - 1, year + 2);
    }, this);

    this.days = ko.computed(function() {
        var month   = this.selectedMonth();
        var year    = this.selectedYear();
        var numDays = daysInMonth(month, year);

        return _.range(1, numDays + 1);
    }, this);

    this.visible = ko.observable(true);

    this.price = ko.observable('');

    this.description = ko.observable('');

    this.notVisibile = ko.computed(function() {
        return ! this.visible();
    }, this);

    this.show = function() {
        this.selectToday();
        this.visible(true);
    }.bind(this);

    this.hide = this.visible.bind(this, false);
}
