(function () {

    "use strict";

    var commandName = 'download';

    var Cmd = docmana.CommandBase.extend({
        init: function (options) {
            this.name = commandName;
            this.templateName = 'toolbarBtn';
            this.enabledWhen = 'selectedFiles';
        },
        _filteredIds: function () {
            var selected = this.workzone().getIds();
            var that = this;
            var filtered = _.filter(selected, function (id) {
                return that.store().byId(id).mime !== 'directory';
            });
            return filtered;
        },

        canExec: function () {
            var selected = this.workzone().getIds();
            if (selected.length === 0) return false;
            var that = this;
            return _.every(selected, function (id) {
                return that.store().byId(id).mime !== 'directory';
            });
        },
        exec: function () {
            var ids = this._filteredIds();
            var that = this;
            _.forEach(ids, function (id) {
                that.store().download(id);
            });
        }
    });

    docmana.commands[commandName] = function (options) {
        return new Cmd(options);
    }

})();

