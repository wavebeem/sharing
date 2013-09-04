'use strict';

function Expense(opts) {
    var self = this;
    opts = opts || {};

    createObservables(self, opts, {
        price: 0,
        paidBy: '',
        description: '',
        date: new Date(),
        paidFor: 'everyone',
    });

    self.expenseId = Expense.id++;

    self.share = ko.computed(function() {
        return self.price() / $root.people().length;
    });
}

Expense.id = 0;
