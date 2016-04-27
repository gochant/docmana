(function () {

    "use strict";

    var commandName = 'duplicate';

    var Cmd = docmana.CommandBase.extend({
        init: function (options) {
            this.name = commandName;
            this.templateName = 'toolbarBtn';
            this.enabledWhen = 'selected';
        },
        exec: function () {
            var targets = this.workzone().getIds();
            this.store().duplicate(targets);
        }
    });

    docmana.commands[commandName] = function (options) {
        return new Cmd(options);
    }

})();

