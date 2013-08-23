function Root() {
    if (GLOBAL.$root) return GLOBAL.$root;

    GLOBAL.$root = this;

    var backgroundFor = function(name) {
        var i = people().indexOf(name);
        return colors[mod(i, colors.length)];
    }.bind(this);

    this.makeCss = function() {
        $('#name_css').innerHTML = people().map(function(name) {
            var safeName = name.toLowerCase().replace(/[^a-z_]/, '_');
            var className = 'color_' + safeName;

            return [
                '.' + className + '.true         { background: '              + backgroundFor(name) + ' }',
                '.' + className + '.color_left   { border-left:   6px solid ' + backgroundFor(name) + ' }',
                '.' + className + '.color_fg     { color: '                   + backgroundFor(name) + ' }',
                '.' + className + '.border       { border-color: '            + backgroundFor(name) + ' }',
            ].join('\n');
        }, this).join('\n');
    };

    this.tempExpenseForm = ko.observable(new ExpenseForm());

    this.saveTempExpense = function() {
        console.log('Attempting to save expense form');
    };

    var people = ko.observableArray([]);
    this.people = ko.computed({
        read: function() { return people() },
        write: function(people_) { people(people_.slice(0).sort()) },
    });
    this.people.subscribe(this.makeCss, this);

    this.expenseGroup = ko.observable(new ExpenseGroup());
}
