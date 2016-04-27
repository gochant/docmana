(function () {

    "use strict";

    var commandName = 'mkdir';
    var counter = 0;

    var Cmd = docmana.CommandBase.extend({
        init: function (options) {
            this.name = commandName;
            this.templateName = 'toolbarBtn';

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
        exec: function () {
            var that = this;
            var target = this.store().cwd().hash;
            //this.store()._data.unshift({
            //    isNew: true,
            //    phash: target,
            //    name: this._generateUsableName(),
            //    ts: docmana.utils.unixTimestamp(),
            //    size: 0,
            //    mime: 'directory'
            //});
            var name = this._generateUsableName();
            that.store().mkdir(name, target).done(function () {
                that.workzone().select(that.workzone().$items().first());
                that.main().exec('rename');
            });


           // this.store().update();
            //that.workzone().select(this.workzone().$items().first());
            //that.workzone().editItemName(function (name) {
            //    that.store().mkdir(name, target);
            //}, true);
        }
    });

    docmana.commands[commandName] = function (options) {
        return new Cmd(options);
    }

})();

