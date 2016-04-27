(function () {

    "use strict";

    var commandName = 'cut';

    var Cmd = docmana.CommandBase.extend({
        init: function (options) {
            this.name = commandName;
            this.templateName = 'toolbarBtn';
            this.enabledWhen = 'selected';
            this.shortcuts = 'Ctrl+X';
        },
        exec: function () {
            // 更改剪切时状态
            var workzone = this.workzone();
            workzone.$('.file-list-item.cut').removeClass('cut');
            workzone.select().addClass('cut');

            var selected = this.store().byIds(workzone.getIds());
            this.main().clipboard.cut(selected);
        }
    });

    docmana.commands[commandName] = function (options) {
        return new Cmd(options);
    }

})();

