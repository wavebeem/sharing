'use strict';

var GLOBAL = this;
document.addEventListener('DOMContentLoaded', function(event) {
    new Root();

    $root.people([
        'Brian',
        'Ash',
        'Trevor',
        // 'Frank',
        // 'Charlie',
    ]);
    // $root.expenseGroup().addExpense(new Expense({ price:   6, paidBy: 'Charlie', date: new Date('6/17/2011'), description: 'Potatoes' }));
    // $root.expenseGroup().addExpense(new Expense({ price:  25, paidBy: 'Frank'  , date: new Date('5/10/2012'), description: 'Pastrami sandwiches' }));
    $root.expenseGroup().addExpense(new Expense({ price:  35, paidBy: 'Brian'  , paidFor: 'Trevor', date: new Date('8/22/2013'), description: 'Cheesecake for party' }));
    $root.expenseGroup().addExpense(new Expense({ price:   5, paidBy: 'Brian'  , date: new Date('8/21/2013'), description: 'Candy' }));
    $root.expenseGroup().addExpense(new Expense({ price: 145, paidBy: 'Brian'  , date: new Date('8/21/2013'), description: 'Groceries' }));
    $root.expenseGroup().addExpense(new Expense({ price: 789, paidBy: 'Ash'    , date: new Date('8/11/2013'), description: 'Rent' }));
    $root.expenseGroup().addExpense(new Expense({ price:  21, paidBy: 'Trevor' , date: new Date('4/30/2013'), description: 'Movie tickets and beer' }));

    ko.applyBindings($root);
    $root.makeCss();
}, false);
