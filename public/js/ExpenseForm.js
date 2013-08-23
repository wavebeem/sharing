'use strict';

function ExpenseForm() {
    this.months = _.range(1, 13);
    this.days   = _.range(1, 32);
    this.years  = _.range(2012, 2015);

    this.selectedMonth = ko.observable(12);
    this.selectedDay   = ko.observable(31);
    this.selectedYear  = ko.observable(2013);

    this.visible = ko.observable(true);

    this.price = ko.observable(1);

    this.description = ko.observable('');

    this.notVisibile = ko.computed(function() {
        return ! this.visible();
    }, this);

    this.show = this.visible.bind(this, true);
    this.hide = this.visible.bind(this, false);
}
