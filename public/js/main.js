'use strict';

var GLOBAL = this;
document.addEventListener('DOMContentLoaded', function(event) {
    new Root();

    $root.people(['Brian', 'Ash', 'Trevor']);
    $root.expenseGroup().addExpense(new Expense({ price:   5, paidBy: 'Brian'  , date: new Date('8/21/2013'), description: 'Candy' }));
    $root.expenseGroup().addExpense(new Expense({ price: 145, paidBy: 'Brian'  , date: new Date('8/21/2013'), description: 'Groceries' }));
    $root.expenseGroup().addExpense(new Expense({ price: 789, paidBy: 'Ash'    , date: new Date('8/11/2013'), description: 'Rent' }));
    $root.expenseGroup().addExpense(new Expense({ price:  21, paidBy: 'Trevor' , date: new Date('4/30/2013'), description: 'Movie tickets and beer' }));

    ko.applyBindings($root);
    $root.makeCss();
}, false);
