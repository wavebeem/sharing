'use strict';

function Expense(opts) {
    opts = opts || {};

    createObservables(this, opts, {
        price: 0,
        paidBy: '',
        description: '',
        date: new Date(),
        people: [],
        sharePaidBy: {},
    });

    this.expenseId = Expense.id++;

    this.formattedDate = ko.computed(function() {
        var d = this.date();
        var day = d.getDate();
        var mon = d.getMonth() + 1;
        var yr  = d.getFullYear();

        var pieces = [day, mon];

        // Only show year if different than current
        if (yr !== new Date().getFullYear()) {
            pieces.push(yr);
        }

        return pieces.join('/');
    }, this);

    this.share = ko.computed(function() {
        return this.price() / $root.people().length;
    }, this);

    this.formattedShare = ko.computed(function() {
        return this.share().toFixed(0);
    }, this);

    this.formattedPrice = ko.computed(function() {
        return this.price().toFixed(0);
    }, this);
}

Expense.id = 0;
