(function(window, document, undefined) {
    'use strict';

    var reloadCss = _(function() {
        var links = document.querySelectorAll('link[rel="stylesheet"]');
        _(links).each(function(elm) {
            elm.href = elm.href.replace(/\?.*|$/, '?reload=' + Date.now());
        });
    }).debounce(300);

    window.addEventListener('focus', reloadCss, false);
})(this, this.document, void 0);
