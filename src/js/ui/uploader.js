(function () {
    "use strict";

    // 当前工作目录界面

    var Uploader = docmana.ViewBase.extend({
        templateName: 'uploader',
        init: function () {
            var that = this;
            this.parentDialog().on('shown.bs.modal', function () {

            }).on('hidden.bs.modal', function () {
                // that.$body().html('');
                that.main().$el.focus();  // 重设焦点
            });
        },
        defaults: {
            autoRender: true
        },
        events: {
            'click .cancel': '_cancelHandler'
        },
        listen: function () {
            this.listenTo(this.main(), 'started', function () {
                // 设置触发器
                var that = this;
                var statusbar = this.statusbar();
                var $btn = $(this.tpl('uploaderTrigger')());
                if (statusbar) {
                    $btn.on('click', function () {
                        that.parentDialog().modal('show');
                    }).appendTo(statusbar.$('.uploader'));
                    that.$trigger = $btn;
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
        inputInstance: function ($input) {
            $input = $input || this.$input;
            return $input.data('blueimp-fileupload') || $input.data('fileupload');
        },
        $body: function () {
            return this.$('.files');
        },
        updateBadge: function () {
            var count = this.count();
            var $badge = this.$trigger.find('.badge');
            $badge.text(count);
            if (count === 0) {
                $badge.hide();
            } else {
                $badge.show();
            }
        },
        count: function(){
            var count = this.$('.file').length;
            return count;
        },
        updateDialogDisplay: function(){
            if (this.count() === 0) {
                this.parentDialog().modal('hide');
            } else {
                this.parentDialog().modal('show');
            }
        },
        build: function ($fileInput) {
            var that = this;
            var tplFile = this.tpl('uploaderFiles');
            var formatFileSize = docmana.utils.formatFileSize;
            var url = _.isFunction(this.props.url) ? this.props.url()
                : (this.props.url || this.store().url());

            $fileInput.fileupload({
                url: url,
                formData: function ($input) {
                    this.url = that.store().uploadUrl == null ? this.url : that.store().uploadUrl(this.url, this.files, this.fileInput);

                    var params = that.store().uploadParams(this.files, this.fileInput);
                    return _.map(params, function (value, key) {
                        return {
                            name: key,
                            value: value
                        }
                    });
                },
                dataType: 'json',
                add: function (e, data) {
                    if (e.isDefaultPrevented()) {
                        return false;
                    }

                    var $this = $(this);
                    var instance = that.inputInstance($this);
                    var options = instance.options;

                    data.context = $(tplFile({
                        files: data.files,
                        options: options
                    })).data('data', data).addClass('processing');

                    that.$body().append(data.context);

                    that.updateBadge();
                    that.updateDialogDisplay();

                    data.process().always(function () {
                        data.context.each(function (index) {
                            $(this).find('.size').text(
                                formatFileSize(data.files[index].size)
                            );
                        }).removeClass('processing');
                        // that._renderPreviews(data);
                    }).done(function () {
                        data.context.find('.start').prop('disabled', false);

                        if ((instance._trigger('added', e, data) !== false) &&
                            (options.autoUpload || data.autoUpload) &&
                            data.autoUpload !== false) {
                            data.submit();
                        }
                    }).fail(function () {
                        if (data.files.error) {
                            data.context.each(function (index) {
                                var error = data.files[index].error;
                                if (error) {
                                    $(this).find('.status').text(error);
                                }
                            });
                        }
                    });
                },
                progress: function (e, data) {
                    if (e.isDefaultPrevented()) {
                        return false;
                    }
                    var progress = Math.floor(data.loaded / data.total * 100);
                    if (data.context) {
                        data.context.each(function () {
                            $(this).find('.progress')
                                .attr('aria-valuenow', progress)
                                .children().first().css(
                                    'width',
                                    progress + '%'
                                );
                            $(this).find('.status > .percent').text(progress + '%');
                        });
                    }
                },
                fail: function (e, data) {
                    if (e.isDefaultPrevented()) {
                        return false;
                    }
                    var instance = that.inputInstance($(this));
                    if (data.context) {
                        data.context.each(function (index) {
                            if (data.errorThrown !== 'abort') {
                                var file = data.files[index];
                                file.error = file.error || data.errorThrown;
                                $(this).find('.folder').text(file.error);
                            } else {
                                $(this).remove();
                                instance._trigger('failed', e, data);
                                instance._trigger('finished', e, data);
                            }
                        });
                    }

                    that.updateBadge();
                    that.updateDialogDisplay();

                },
                done: function (e, data) {
                    data.context.remove();
                    that.updateBadge();
                    that.updateDialogDisplay();
                    that.store().trigger('uploaded', data.result);
                }
            });

            // TODO: 为什么在 fileupload add 方法内获取 that.$input 不正确
            this.$input = $fileInput;
        },
        _cancelHandler: function (e) {
            e.preventDefault();
            var $file = $(e.currentTarget).closest('.file-upload,.file-download');
            var data = $file.data('data') || {};
            data.context = data.context || $file;
            if (data.abort) {
                data.abort();
            } else {
                data.errorThrown = 'abort';
                this.trigger('fail', e, data);
            }
        }
    });

    docmana.ui.Uploader = Uploader;
    docmana.ui.uploader = function (options) {
        return new docmana.ui.Uploader(options);
    }
})();

