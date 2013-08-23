function ExpenseForm() {
    this.months = _.range(1, 13);
    this.days   = _.range(1, 32);
    this.years  = _.range(2012, 2015);

    this.price = ko.observable(1);

    this.description = ko.observable('');
}
