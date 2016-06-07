(function () {

    "use strict";

    var commandName = 'rename';

    var Cmd = docmana.CommandBase.extend({
        init: function (options) {
            this.name = commandName;
            this.templateName = 'toolbarBtn';
            this.enabledWhen = 'single';
            this.shortcuts = 'F2';
        },
        exec: function () {
            var that = this;
            var id = that.workzone().getIds()[0];
            var data = that.store().byId(id);
            if (data && data.locked === 1) return;

            this.workzone().editItemName(function (name) {
                that.store().rename(name, id).done(function () {
                    that.main().focus();
                });
            });
        }
    });

    docmana.commands[commandName] = function (options) {
        return new Cmd(options);
    }
    docmana.commands[commandName].constructor = Cmd;
})();

