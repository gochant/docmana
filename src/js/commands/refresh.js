(function () {

    "use strict";

    var commandName = 'refresh';

    var Cmd = docmana.CommandBase.extend({
        init: function (options) {
            this.name = commandName;
            this.templateName = 'toolbarBtn';
            this.shortcuts = 'F5';
        },
        exec: function () {
            var target = this.store().cwd().hash;
            this.store().open(target, 0);
        }
    });

    docmana.commands[commandName] = function (options) {
        return new Cmd(options);
    }

})();

