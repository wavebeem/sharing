'use strict';

var GLOBAL = this;
$(function() {
    $('#expense_form').hide();
    $('#payment_form').hide();
    $('.column').hide();
    new Root();
    $.ajax('/api/people').done(function(resp) {
        $root.people(resp.data);
        $root.update();
    });

    window.onhashchange = function(event) {
        $root.currentTab(getFragment());
    };
});
