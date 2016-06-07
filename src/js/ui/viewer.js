(function () {
    "use strict";

    var Viewer = docmana.ViewBase.extend({
        templateName: 'viewer',
        defaults: {
            autoAction: true,
            autoRender: true,
            fileType: [
                '.txt', '.csv', '.pdf', '.jpg', '.gif', '.png', '.tiff', '.ppt', '.pptx',
                '.doc', '.docx', '.xls', '.xlsx'
            ]
        },

        init: function () {
            var that = this;
            this.parentDialog().on('shown.bs.modal', function () {
                that.$body().css({
                    top: that.$('.modal-header').outerHeight(),
                    bottom: that.$('.modal-footer').outerHeight()
                });
                that.viewCurrent();
            }).on('hidden.bs.modal', function () {
                that.$body().html('');
                that.main().$el.focus();  // 重设焦点
            });
        },
        listen: function () {
            this.listenTo(this.workzone(), 'selected', function () {
                if (this.$el.is(':visible')) {
                    this.viewCurrent();
                }
            });
            this.listenTo(this, 'rendered', function () {
                this.parentDialog().modal({
                    show: false
                });
            });
        },
        parentDialog: function () {
            return this.$element().closest('.modal');
        },
        callout: function () {
            this.parentDialog().modal('show');
        },
        $body: function () {
            return this.$el.find('.docmana-viewer-body');
        },
        viewCurrent: function () {
            var that = this;
            var selectIds = that.workzone().getIds();
            if (selectIds.length > 0) {
                var target = selectIds[0];
                that.$body().html('');
                var data = that.store().byId(target);
                var ext = that.store().getFileExt(data);
                that.parentDialog().find('.modal-title').text(data.name);

                if (that.props.fileType.indexOf(ext) >= 0) {
                    that.store().content(target).done(function (resp) {
                        if (resp.view === 'path') {
                            var url = that.store().fileUrl(resp.content);
                            if (ext === '.pdf') {
                                PDFObject.embed(url, that.$body());
                            } else {
                                that.$body().html('<iframe src="' + url + '"></iframe>');
                            }

                        }
                        if (resp.view === 'content') {
                            that.$body().html(resp.content);
                        }
                    });
                } else {
                    var tpl = this.tpl('fileInfo');
                    that.$body().html(tpl(data));
                }

            }
        },
        _previousHandler: function (e) {
            this.workzone().selectTo('previous');
        },
        _nextHandler: function (e) {
            this.workzone().selectTo('next');
        },
        _downloadHandler: function (e) {
            this.main().exec('download');
        }
    });

    docmana.ui.Viewer = Viewer;
    docmana.ui.viewer = function (options) {
        return new docmana.ui.Viewer(options);
    }

})();

