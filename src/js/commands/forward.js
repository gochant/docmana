(function () {

    "use strict";

    var Cmd = docmana.CommandBase.extend({
        init: function (options) {
            this.name = 'forward';
            this.templateName = 'toolbarBtn';
            this.shortcuts = 'Alt+Right';
        },
        listen: function () {
            this.listenTo(this.main().store, 'update', function () {
                this.setState();
            });
        },
        canExec: function () {
            return this.main().history.canForward();
        },
        exec: function () {
            return this.main().history.forward();
        }
    });

    docmana.commands.forward = function (options) {
        return new Cmd(options);
    }

})();

