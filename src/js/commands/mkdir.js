(function () {

    "use strict";

    var commandName = 'mkdir';
    var counter = 0;

    var Cmd = docmana.CommandBase.extend({
        init: function (options) {
            this.name = commandName;
            this.templateName = 'toolbarBtn';
            this.shortcuts = 'Alt+N';
            this.exec = _.debounce(_.bind(this.exec, this), 500);
        },
        _generateName: function () {
            var str = ' ' + docmana.resource('new folder');
            return counter === 0 ? str : str + ' ' + counter;
        },
        _generateUsableName: function () {
            var name = null;
            var exist = true;
            while (exist) {
                name = this._generateName();
                exist = this.store().byName(name) != null;
                counter++;
            }
            return name;
        },
        shortcutExec: function () {
            if (this.canExec()) {
                this._exec();
            }
        },
        _exec: function () {
            var that = this;
            var cwd = this.store().cwd();
            if (!cwd) return;

            var target = cwd.hash;
            var name = this._generateUsableName();
            that.store().mkdir(name, target).done(function () {
                that.workzone().select(that.workzone().$items().first());
                that.main().exec('rename');
            });
        },
        exec: function () {
            this._exec();
        }
    });

    docmana.commands[commandName] = function (options) {
        return new Cmd(options);
    }

})();

