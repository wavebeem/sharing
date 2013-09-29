function PaymentForm() {
    var self = this;

    DateMixin(self);
    VisibilityMixin(self);

    self.from   = ko.observable('');
    self.to     = ko.observable('');
    self.amount = ko.observable('0').extend({ money: true });

    self.save = function() {
        console.log('Saving payment...');
    };
}
