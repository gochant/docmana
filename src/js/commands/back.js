(function () {

    "use strict";

    var Cmd = docmana.CommandBase.extend({
        init: function (options) {
            this.name = 'back';
            this.templateName = 'toolbarBtn';
            this.shortcuts = 'Alt+Left';
        },
        listen: function(){
            this.listenTo(this.main().store, 'update', function () {
                this.setState();
            });
        },
        canExec: function() {
            return this.main().history.canBack();
        },
        exec: function() {
            return this.main().history.back();
        }
    });

    docmana.commands.back = function (options) {
        return new Cmd(options);
    }

})();

