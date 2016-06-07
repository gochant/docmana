(function () {
    "use strict";

    // 工具栏界面

    var Toolbar = docmana.CommandContainer.extend({
        className: 'docmana-toolbar',
        templateName: 'toolbar',
        defaults: {
            autoRender: true,
            autoAction: true,
            commands: ['new', 'open', 'clipboard', 'organize', {
                name: 'view',
                to: '.right'
            }, {
                name: 'util',
                to: '.right'
            }]
        },
        listen: function () {
            this.listenTo(this, 'rendered', function () {
                this._renderCommands();
            });
        }
    });

    docmana.ui.Toolbar = Toolbar;
    docmana.ui.toolbar = function (options) {
        return new docmana.ui.Toolbar(options);
    }
})();

