'use strict';

var GLOBAL = this;
$(function() {
    new Root();

    $.when($.ajax('/api/people'), $.ajax('/api/expenses'))
        .done(function(a, b) {
            var people   = a[0].data;
            var expenses = b[0].data;

            $root.people(people);
            $root.expenses(expenses);

            ko.applyBindings($root);
        })
});
