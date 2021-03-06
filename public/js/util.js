'use strict';

function noop() {}

function mod(a, b) {
    return ((a % b) + b) % b;
}

function createObservables(thisp, opts, defaults) {
    _(defaults).each(function(v, k) {
        var real = _(opts).has(k) ? opts[k] : defaults[k];
        var func = _(real).isArray() ? ko.observableArray : ko.observable;
        thisp[k] = func(real);
    });
}

function daysInMonth(month, year) {
    // The 0th day of a month is actually the last day of the previous month.
    // This works because we assume month is passed in 1-based here, whereas
    // Date uses 0-based months.
    return new Date(year, month, 0).getDate();
}

function formattedCurrency(money) {
    return ko.computed(function() {
        var $ = ko.unwrap(money);
        return '$' + $.toFixed(2);
    });
}

function stripTime(d) {
    d = new Date(d);

    return new Date(
        d.getFullYear(),
        d.getMonth(),
        d.getDate()
    );
}

function stripUtc(d) {
    d = new Date(d);

    return new Date(
        d.getUTCFullYear(),
        d.getUTCMonth(),
        d.getUTCDate()
    );
};

function today() {
    return new Date();
}

function dateStringToPieces(s) {
    var D = new Date(s);

    return [
        D.getUTCFullYear(),
        D.getUTCMonth() + 1,
        D.getUTCDate(),
    ];
}

function formattedDate(date) {
    return ko.computed(function() {
        var D = dateStringToPieces(ko.unwrap(date));

        return shortAmericanDate.apply(null, D);
    });
}

function notThisYear(y) {
    return y !== today().getFullYear();
}

var shortMonthNames = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
];

var monthNames = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
];

function shortAmericanDate(y, m, d) {
    var s = shortMonthNames[m - 1] + ' ' + d;
    if (notThisYear(y)) {
        s += ', ' + y;
    }
    return s;
}

function americanDate(y, m, d) {
    var s = monthNames[m - 1] + ' ' + d;
    if (notThisYear(y)) {
        s += ', ' + y;
    }
    return s;
}

function numericDate(y, m, d) {
    var p = [m, d];

    if (notThisYear(y)) {
        p.push(y);
    }

    return p.join('/');
}

function setFragment(val) {
    window.location.hash = val;
}

function getFragment() {
    var h = window.location.hash;
    if (h.charAt(0) === '#') return h.substring(1);
    return h;
}

var colors = [
    "#75507b", // plum
    "#cc0000", // scarlet red
    "#4e9a06", // chameleon
    "#edd400", // butter
    "#3465a4", // sky blue
    "#f57900", // orange
    "#c17d11", // chocolate
    "#babdb6", // aluminium
];

function toggleObservable(o) {
    o(!o());
};

ko.subscribable.fn.subscribeChanged = function(callback) {
    var oldValue;

    this.subscribe(function(_oldValue) {
        oldValue = _oldValue;
    }, this, 'beforeChange');

    this.subscribe(function(newValue) {
        callback(newValue, oldValue);
    });
};

ko.extenders.money = function(target, opts) {
    var result = ko.computed({
        read: target,
        write: function(val) {
            val = val.replace(/^[^0-9.]+/g, '');
            var cur = target();
            var out = '$' + parseFloat(val).toFixed(2);

            if (isNaN(parseFloat(val))) {
                target('');
            }
            else if (out !== cur) {
                target(out);
            }
            else if (val !== cur) {
                target.notifySubscribers(out);
            }
        }
    });

    result(target());

    return result;
};
