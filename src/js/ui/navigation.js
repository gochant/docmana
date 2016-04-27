(function () {
    "use strict";

    var Navigation = docmana.CommandContainer.extend({
        templateName: 'navigation',
        breadcrumbTemplateName: 'breadcrumb',
        defaults: {
            autoAction: true,
            autoRender: true,
            commands: [{
                name: 'navigation',
                to: '.nav-group'
            }, {
                name: 'search',
                to: '.search-group'
            }, {
                name: 'refresh',
                to: '.search-group'
            }]
        },
        listen: function () {
            this.listenTo(this.history(), 'change', function () {
                this._renderBreadcrumb();
            });
            this.listenTo(this, 'rendered', function () {
                this._renderBreadcrumb();
                this._renderCommands();
            });
        },
        events: {
            'click .docmana-breadcrumb li > a': '_linkHandler'
        },
        $breadcrumb: function () {
            return this.$('.docmana-breadcrumb');
        },
        _renderBreadcrumb: function () {
            var tpl = this.tpl(this.breadcrumbTemplateName);
            var pathData = this.history().getPath();
            this.$breadcrumb().html(tpl(pathData));
            this._initBreadcrumbInteractive();
        },
        _initBreadcrumbInteractive: function () {
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

    docmana.ui.navigation = function (options) {
        return new Navigation(options);
    }

})();

