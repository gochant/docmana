(function () {

    "use strict";

    var History = docmana.ComponentBase.extend({
        init: function (options) {
            this.position = null;
            this._data = [];
        },
        listen: function () {
            this.listenTo(this.main().store, 'cwdChange', function () {
                var cwd = this.main().store.cwd();
                var idx = _.findIndex(this._data, function (item) {
                    return item.hash === cwd.hash;
                });
                if (idx < 0) {
                    this.add(cwd);
                    this.position = this._data.length - 1;
                } else {
                    this.position = idx;
                }

                this.trigger('change', this._data);
            });
        },
        byId: function (id) {
            return _.find(this._data, function(item) {
                return item.hash === id;
            });
        },
        getPath: function () {
            return this._data.slice(0, this.position + 1);
        },
        add: function (item) {

            if (this.position < this._data.length - 1) {
                this._data.splice(this.position + 1, this._data.length - 1 - this.position);
            }
            this._data.push(item);
        },
        forward: function () {
            if (this.canForward()) {
                this.position = this.position + 1;
                this.triggerOpen();
            }
        },
        getCurrHash: function () {
            var data = this._data[this.position];
            return data != null ? data.hash : data;
        },
        back: function () {
            if (this.canBack()) {
                this.position = this.position - 1;
                this.triggerOpen();
            }
        },
        triggerOpen: function () {
            this.main().store.open(this.getCurrHash());
        },
        canForward: function () {
            return this.position + 1 < this._data.length;
        },
        canBack: function () {
            return this._data.length >= 2 && this.position !== 0;
        },

        // TODO: 存储到 localstorage
        storeHistory: function () {

        },
        restoreHistory: function () {

        }

    });

    docmana.history = function (options) {
        return new History(options);
    }

})();

