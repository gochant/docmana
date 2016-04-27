(function () {

    "use strict";

    var commandName = 'paste';

    var Cmd = docmana.CommandBase.extend({
        init: function (options) {
            this.name = commandName;
            this.templateName = 'toolbarBtn';
            this.shortcuts = 'Ctrl+V';
        },
        exec: function () {
            this.clipboard().paste();
        },
        listenUI: function () {
            this.listenTo(this.main().clipboard, 'change', function () {
                this.setState();
            });
        },
        canExec: function () {
            if (this.main().clipboard.isEmpty()) return false;

            return true;
        }
    });

    docmana.commands[commandName] = function (options) {
        return new Cmd(options);
    }

})();

