'use strict';

var GLOBAL = this;
$(function() {
    $('#expense_form').hide();
    new Root();
    $.ajax('/api/people').done(function(resp) {
        $root.people(resp.data);
        $root.update();
    });
});
