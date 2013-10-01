function PaymentForm() {
    var self = this;

    DateMixin(self);
    VisibilityMixin(self);

    self.to     = ko.observable('');
    self.amount = ko.observable('0').extend({ money: true });
    var realAmount = ko.computed(function() {
        return +self.amount().replace(/[^0-9\.]/g, '');
    });

    var toAndFrom = ko.computed(function() {
        return {
            from: $root.currentUser(),
            to: self.to(),
        };
    });

    toAndFrom.subscribe(function(o) {
        self.amount($root.debtBetween(o.from, o.to));
    });

    self.save = function() {
        $.post('/api/payments', {
            date        : self.date(),
            amount      : realAmount(),
            payer       : +$root.currentUser(),
            payee       : +self.to(),
        }).done(function() {
            self.hide();
            $root.update();
        });
    };
}
