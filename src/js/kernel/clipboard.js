(function () {

    "use strict";

    var Clipboard = docmana.ComponentBase.extend({
        init: function (options) {
            this._data = [];
            this.isCut = 0;
        },
        listen: function () {
           // this.listenTo()
        },
        data: function (data, empty) {
            if (data != null && (empty || data.length > 0)) {
                this._data = data;
                this.trigger('change', this._data);
            }
            return this._data;
        },
        cut: function (data) {
            this.isCut = 1;
            this.data(data);
        },
        copy: function (data) {
            this.isCut = 0;
            this.data(data);
        },
        paste: function () {
            if (this.isEmpty()) return;

            var that = this;
            var targets = this.getIds();
            var destDir = this.store().cwd().hash;
            var srcDir = this.getSrcDir();

            // 复制可无限粘贴，剪切则不能
            // TODO: 当出现同名文件时，弹出对话框让用户选择，使用 deferred
            if (this.isCut) {
                this.store().moveTo(destDir, targets, srcDir).done(function () {
                    that.empty();
                });
            } else {
                this.store().copyTo(srcDir, destDir, targets);
            }
        },
        empty: function () {
            this.data([], true);
        },
        getSrcDir: function () {
            return this._data[0].phash;
        },
        getIds: function () {
            return _.map(this.data(), function (item) {
                return item.hash;
            });
        },
        isEmpty: function () {
            return this.data().length === 0;
        }

    });

    docmana.clipboard = function (options) {
        return new Clipboard(options);
    }

})();

