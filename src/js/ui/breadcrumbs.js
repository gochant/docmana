(function () {
    "use strict";

    var Breadcrumbs = docmana.ViewBase.extend({
        listen: function () {
            this.listenTo(this.history(), 'change', function() {
                this.render();
            });
        },
        events: {
            'click li > a': '_linkHandler'
        },
        $breadcrumb: function () {
            return this.$('.breadcrumb');
        },
 
        render: function () {
            var tpl = this.tpl('breadcrumbs');
            var pathData = this.history().getPath();
            this.$el.html(tpl(pathData));

            this._interactive();
        },
        _interactive: function () {
            var that = this;
            this.$('li > a:not(.ui-droppable)').droppable({
                accept: ".file-list-item",
                hoverClass: "drop-active",
                drop: function (e, ui) {
                    // 注意：如果这里要直接取 ui.draggable，则需手动更改 ddmanager
                    var targets = that.workzone().getIds(ui.draggable);
                    var dest = $(e.target).attr('data-hash');

                    that.store().moveTo(dest, targets);
                }
            });
        },
        _linkHandler: function (e) {
            e.preventDefault();
            var hash = $(e.currentTarget).attr('data-hash');
            this.main().exec('open', this.history().byId(hash));
        }
    });

    docmana.ui.breadcrumbs = function (options) {
        return new Breadcrumbs(options);
    }

})();

