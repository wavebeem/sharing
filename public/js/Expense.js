'use strict';

function Expense(opts) {
    var self = this;
    opts = opts || {};

    createObservables(self, opts, {
        price: 0,
        paidBy: '',
        description: '',
        date: new Date(),
        people: [],
        sharePaidBy: {},
    });

    self.expenseId = Expense.id++;

    self.formattedDate = ko.computed(function() {
        var d = self.date();
        var day = d.getDate();
        var mon = d.getMonth() + 1;
        var yr  = d.getFullYear();

        var pieces = [mon, day];

        // Only show year if different than current
        if (yr !== new Date().getFullYear()) {
            pieces.push(yr);
        }

        return pieces.join('/');
    });

    self.share = ko.computed(function() {
        return self.price() / $root.people().length;
    });

    self.formattedShare = ko.computed(function() {
        return self.share().toFixed(0);
    });

    self.formattedPrice = ko.computed(function() {
        return self.price().toFixed(0);
    });
}

Expense.id = 0;
