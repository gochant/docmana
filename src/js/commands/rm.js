(function () {

    "use strict";

    var commandName = 'rm';

    var Cmd = docmana.CommandBase.extend({
        init: function (options) {
            this.name = commandName;
            this.templateName = 'toolbarBtn';
            this.enabledWhen = 'selected';
            this.shortcuts = 'Del';
        },
        exec: function () {
            var ids = this.workzone().getIds();
            if (ids.length > 0) {
                var that = this;
                docmana.ui.notify.confirm(function () {
                    that.store().rm(ids);
                });
            }
           
           
        }
    });

    docmana.commands[commandName] = function (options) {
        return new Cmd(options);
    }

})();

