"use strict";

(function () {

    var commandName = 'open';

    var Cmd = docmana.CommandBase.extend({
        init: function (options) {
            this.name = commandName;
            this.templateName = 'toolbarBtn';
            this.enabledWhen = 'single';
            this.shortcuts = 'Return';
        },
        exec: function (info) {

            if (info == null || info.mime == null) {
                var id = this.workzone().select().attr('id');
                info = this.store().byId(id);
            }
            if (info == null) return;
            // 文件夹，则打开
            if (info.mime === 'directory') {
                this.store().open(info.hash);
            } else {
                var viewer = this.main().ui.viewer;
                if (viewer) {
                    viewer.callout();
                }
               // this.store().content(info.hash);
            }
            // TODO: 文件类型，则查看，如果未提供查看器，则弹出提示，并提供下载链接
        }
    });

    docmana.commands[commandName] = function (options) {
        return new Cmd(options);
    }

})();

