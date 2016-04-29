(function () {

    "use strict";

    var Store = docmana.ComponentBase.extend({
        init: function (options) {
            this._data = [];
            this._sortBy = {
                field: 'name',
                order: 'asc'
            };
            this._cwd = null;
        },
        data: function (data) {
            if (data != null) {
                this._data = data;
            }
            return this._data;
        },
        cwdData: function () {
            var parentHash = this.cwd().hash;

            return _.filter(this._data, function (f) {
                return f.phash === parentHash;
            });
        },
        url: function (name) {
            return this.props.url;
        },
        cwd: function () {
            return this._cwd;
        },
        byId: function (id) {
            return _.find(this._data, function (item) {
                return item.hash === id;
            });
        },
        byName: function (name) {
            return _.find(this._data, function (item) {
                return item.name === name;
            });
        },
        byIds: function (ids) {
            var that = this;
            return _.compact(_.map(ids, function (id) {
                return that.byId(id);
            }));
        },
        listen: function () {
            this.listenTo(this, 'sync', function (resp, request) {
                if (resp.added) {
                    this._data = this._data.concat(resp.added);
                }
                if (resp.removed) {
                    _.remove(this._data, function (n) {
                        return (_.findIndex(resp.removed, function (r) {
                            return n.hash === r;
                        }) >= 0);
                    });
                }
                if (resp.files) {
                    this._data = resp.files;
                }
                if (resp.cwd) {
                    if (this._cwd == null || this._cwd.hash !== resp.cwd.hash) {
                        this._cwd = resp.cwd;
                        this.trigger('cwdChange', this.cwd());
                    }
                }

                this.cleanData();

                //TODO: 在更新界面前必须要进行排序
                this.sortBy();
                this.update(request);
            });
        },
        cleanData: function () {
            // 移除未保存的数据
            _.remove(this._data, function (d) {
                return d.isNew;
            });
        },
        // 排序
        sortBy: function (field, order, folderFirst) {
            if (field != null) {
                this._sortBy.field = field;
            }
            if (order != null) {
                this._sortBy.order = order;
            }
            if (folderFirst == null) { folderFirst = true; }

            if (folderFirst) {
                var groups = _.groupBy(this._data, function (item) {
                    return item.mime === 'directory';
                });
                groups['true'] = this._baseSortBy(groups['true']);
                groups['false'] = this._baseSortBy(groups['false']);

                this._data = groups['true'].concat(groups['false']);
            } else {
                this._data = this._baseSortBy(this._data);
            }

            this.trigger('sort', this._sortBy);
            return this;
        },
        update: function (eventData) {
            eventData || (eventData = {});
            this.trigger('update', this._data, eventData);
        },
        _baseSortBy: function (list) {
            var field = this._sortBy.field;
            var order = this._sortBy.order;

            if (field === 'name') {
                field = function (item) {
                    return item.name.toLowerCase();
                };
            }
            return _.orderBy(list, [field], [order]);
        },
        mkdir: function (name, target) {
            return this.post({
                cmd: 'mkdir',
                target: target,
                name: name
            });
        },
        // 重命名
        rename: function (name, target) {
            return this.post({
                cmd: 'rename',
                name: name,
                target: target
            });
        },
        // 移动
        moveTo: function (destDir, targets, srcDir) {
            srcDir || (srcDir = this.cwd().hash);
            return this.paste(srcDir, destDir, targets, 1);
        },
        // 复制
        copyTo: function (srcDir, destDir, targets) {
            return this.paste(srcDir, destDir, targets, 0);
        },
        // 打开
        open: function (target, isInit) {
            var that = this;
            return this.fetch({
                cmd: 'open',
                target: target,
                init: isInit
            });
        },
        // 搜索
        search: function (target, q) {
            return this.fetch({
                cmd: 'search',
                target: target,
                q: q
            });
        },
        content: function (target) {
            var that = this;
            return this.getJSON({
                cmd: 'get',
                target: target
            });
        },
        // 粘贴
        paste: function (srcDir, destDir, targets, isCut) {
            if (srcDir === destDir) {
                return this.duplicate(targets);
            }

            return this.post({
                cmd: 'paste',
                cut: isCut,
                dst: destDir,
                src: srcDir,
                targets: targets
            });
        },
        // 副本
        duplicate: function (targets) {
            return this.post({
                cmd: 'duplicate',
                targets: targets
            });
        },
        // 上传
        upload: function ($form) {
            var that = this;
            return $form.ajaxSubmit({
                url: this.url(),
                dataType: "json",
                data: this.uploadParams(),
                success: function (resp) {
                    that.trigger('sync', resp);
                }
            });
        },
        uploadParams: function() {
            return this._getRequestParams({
                cmd: 'upload',
                target: this.cwd().hash
            });
        },
        // 删除
        rm: function (targets) {
            return this.post({
                cmd: 'rm',
                targets: targets
            });
        },
        _getRequestParams: function (data) {
            return $.extend({}, this.props.requestData, data);
        },
        request: function (method, data, sync) {
            var that = this;
            var params = this._getRequestParams(data);
            if (sync == null) sync = true;
            return $.ajax({
                url: this.url(),
                type: method,
                data: params,
                //contentType: "application/json; charset=utf-8",
                dataType: "json"
            }).fail(function (xhr, resp, x, xx) {
                that.trigger('syncFail', resp);
            }).done(function (resp) {
                if (sync) {
                    that.trigger('sync', resp, params);
                }
            }).always(function (resp) {
               // console.log(resp);
            });
        },
        getJSON: function (data) {
            return this.request('get', data, false);
        },
        // 获取文件Url
        fileUrl: function (target, download) {
            if (download == null) download = 0;
            var params = this._getRequestParams({
                cmd: 'file',
                target: target,
                download: download
            });
            return this.url() + '?' + $.param(params);
        },
        fetch: function (data) {
            return this.request('get', data);
        },
        get: function (data) {
            return this.request('get', data);
        },
        post: function (data) {
            return this.request('post', data);
        }

    });

    docmana.store = function (options) {
        return new Store(options);
    }

})();

