function DateMixin(self) {
    self.selectedMonth = ko.observable(null);
    self.selectedDay   = ko.observable(null);
    self.selectedYear  = ko.observable(null);

    self.selectToday = function() {
        var today = new Date();

        self.selectedMonth(today.getMonth() + 1);
        self.selectedDay(today.getDate());
        self.selectedYear(today.getFullYear());
    };

    self.selectToday();

    self.months = ko.observable(_.range(1, 13));

    self.years = ko.computed(function() {
        var year = new Date().getFullYear();

        return _.range(year - 1, year + 2);
    });

    self.days = ko.computed(function() {
        var month   = self.selectedMonth();
        var year    = self.selectedYear();
        var numDays = daysInMonth(month, year);

        return _.range(1, numDays + 1);
    });

    self.date = ko.computed(function() {
        var y = self.selectedYear();
        var m = self.selectedMonth();
        var d = self.selectedDay();

        return [y, m ,d].join('-');
    });
}
