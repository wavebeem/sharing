function PaymentForm() {
    var self = this;

    DateMixin(self);
    VisibilityMixin(self);

    self.to     = ko.observable('');
    self.amount = ko.observable('0').extend({ money: true });

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
        console.log('Saving payment...');
    };

    self.visible(true);
}
