function PaymentForm() {
    var self = this;

    self.from   = ko.observable('');
    self.to     = ko.observable('');
    self.amount = ko.observable('0').extend({ money: true });

    self.visible = ko.observable(true);
    self.notVisible = ko.computed(function() {
        return ! self.visible();
    });

    self.save = function() {
        console.log('Saving payment...');
    };

    self.hide = self.visible.bind(null, false);
}
