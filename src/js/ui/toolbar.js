(function () {
    "use strict";

    // 工具栏界面

    var Toolbar = docmana.CommandContainer.extend({
        className: 'docmana-toolbar',
        defaults: {
            autoRender: true,
            autoAction: true,
            commands: ['new', 'open', 'clipboard', 'organize', 'view']
        },
        render: function () {
            this._renderCommands();
        }
    });

    docmana.ui.toolbar = function (options) {
        return new Toolbar(options);
    }
})();

