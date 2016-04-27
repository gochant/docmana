(function () {

    "use strict";

    var commandName = 'search';

    var Cmd = docmana.CommandBase.extend({
        init: function(options) {
            this.name = commandName;
            this.templateName = 'toolbarSearch';
        },
        exec: function() {
            var q = _.trim(this.$input().val());
            if (q === "" || q == null) return;
            var target = this.store().cwd().hash;
            this.store().search(target, q);
        },
        $input: function() {
            return this.$element().find('input');
        },
        listen: function () {
            this.listenTo(this, 'rendered', function () {
                var that = this;
                this.$el.on('keydown', function (e) {
                    if (e.which === 13) {
                        e.preventDefault();
                        that.exec();
                    }
                });
                this.$input().clearIt({
                    callback: function () {
                        var target = that.store().cwd().hash;
                        that.store().open(target);
                    }
                });
            });
        }
    });

    docmana.commands[commandName] = function (options) {
        return new Cmd(options);
    }

})();

