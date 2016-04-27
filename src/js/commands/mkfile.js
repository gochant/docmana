(function () {

    "use strict";

    var commandName = 'mkfile';

    var Cmd = docmana.CommandBase.extend({
        init: function (options) {
            this.name = commandName;
            this.templateName = 'toolbarBtn';
        }
    });

    docmana.commands[commandName] = function (options) {
        return new Cmd(options);
    }

})();

