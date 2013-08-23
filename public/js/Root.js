function Root() {
    this.expenseGroup = ko.observable(new ExpenseGroup());

    this.makeCss = function() {
        this.expenseGroup().makeCss();
    };

    this.tempExpenseForm = ko.observable(new ExpenseForm());

    this.saveTempExpense = function() {
        console.log('Attempting to save expense form');
    };
}
