function VisibilityMixin(self) {
    self.visible = ko.observable(false);

    self.notVisible = ko.computed(function() {
        return ! self.visible();
    });

    self.hide = self.visible.bind(null, false);
}
