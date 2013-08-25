'use strict';

function Root() {
    var self = this;

    if (GLOBAL.$root) return GLOBAL.$root;

    GLOBAL.$root = self;

    var backgroundFor = function(name) {
        var i = people().indexOf(name);
        return colors[mod(i, colors.length)];
    };

    self.makeCss = function() {
        $('#name_css').innerHTML = people().map(function(name) {
            var className = 'color_' + name

            return [
                '.' + className + '.true         { background: '              + backgroundFor(name) + ' }',
                '.' + className + '.color_left   { border-left:   6px solid ' + backgroundFor(name) + ' }',
                '.' + className + '.color_fg     { color: '                   + backgroundFor(name) + ' }',
                '.' + className + '.border       { border-color: '            + backgroundFor(name) + ' }',
            ].join('\n');
        }).join('\n');
    };

    self.tempExpenseForm = ko.observable(new ExpenseForm());

    self.saveTempExpense = function() {
        console.log('Attempting to save expense form');
    };

    var people = ko.observableArray([]);
    self.people = ko.computed({
        read: function() { return people() },
        write: function(people_) { people(people_.slice(0).sort()) },
    });
    self.people.subscribe(self.makeCss);

    self.expenseGroup = ko.observable(new ExpenseGroup());
}
