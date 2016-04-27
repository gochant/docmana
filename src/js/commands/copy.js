(function () {

    "use strict";

    var commandName = 'copy';

    var Cmd = docmana.CommandBase.extend({
        init: function (options) {
            this.name = commandName;
            this.templateName = 'toolbarBtn';
            this.enabledWhen = 'selected';
            this.shortcuts = 'Ctrl+C';
        },
        exec: function () {
            var selected = this.store().byIds(this.workzone().getIds());
            this.main().clipboard.copy(selected);
        }
    });

    docmana.commands[commandName] = function (options) {
        return new Cmd(options);
    }

})();

