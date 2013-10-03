'use strict';

function ExpenseForm() {
    var self = this;

    DateMixin(self);
    VisibilityMixin(self);

    self.save = function() {
        $.post('/api/expenses', {
            date        : self.date(),
            amount      : realPrice(),
            payer       : +$root.currentUser(),
            payee       : +self.spendTarget(),
            description : self.description(),
        }).done(function() {
            self.hide();
            $root.update();
        });
    };

    self.spendTarget = ko.observable('');

    self.price = ko.observable('').extend({ money: true });
    var realPrice = ko.computed(function() {
        return +self.price().replace(/[^0-9\.]/g, '');
    });

    self.description = ko.observable('');
}
