'use strict';

function $(sel) {
    return document.querySelector(sel);
}

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

function formattedDate(date) {
    return ko.computed(function() {
        var d = ko.unwrap(date);

        var day = d.getDate();
        var mon = d.getMonth() + 1;
        var yr  = d.getFullYear();

        var pieces = [mon, day];

        // Only show year if different than current
        if (yr !== new Date().getFullYear()) {
            pieces.push(yr);
        }

        return pieces.join('/');
    });
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

function ajax(opts) {
    var req = new XMLHttpRequest();
    req.open(opts.verb, opts.url);
    req.onreadystatechange = function() {
        if (req.readyState === ajax.DONE && req.status === 200) {
            opts.callback.call(req, req.response);
        }
    };

    if (opts.data) {
        req.setRequestHeader('Content-Type', 'application/json');
        req.send(JSON.stringify(opts.data));
    }
    else {
        req.send();
    }
}

ajax.DONE = 4;

function GET(url, callback) {
    return ajax({
        verb:'GET',
        url:url,
        callback:callback
    });
}

function POST(url, data, callback) {
    return ajax({
        verb:'POST',
        url:url,
        data:data,
        callback:callback
    });
}

function PUT(url, data, callback) {
    return ajax({
        verb:'PUT',
        url:url,
        data:data,
        callback:callback
    });
}

_.mixin({
    megaChain: function(x, fs) {
        _.each(fs, function(f) {
            var name = f[0];
            var args = f[1] || [];

            x = _[name].apply(null, [x].concat(args));
        });

        return x;
    }
});

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
