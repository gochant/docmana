(function () {
    "use strict";

    // 当前工作目录界面

    var Uploader = docmana.ViewBase.extend({
        templateName: 'uploader',
        init: function () {
        },
        defaults: {
            autoRender: true
        },
        events: {
            'click .cancel': '_cancelHandler'
        },
        listen: function () {
            this.listenTo(this.main(), 'start', function () {
                // 设置触发器
            });
        },
        inputInstance: function ($input) {
            return $input.data('blueimp-fileupload') || $input.data('fileupload');
        },
        $filesContainer: function () {
            return this.$('.files');
        },
        build: function ($fileInput) {
            var that = this;
            var tplFile = this.tpl('uploaderFiles');
            var formatFileSize = docmana.utils.formatFileSize;

            $fileInput.fileupload({
                url: this.store().url(),
                formData: function () {
                    return that.store().uploadParams();
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

                    that.$filesContainer().append(data.context);

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
                progressall: function (e, data) {
                    //var progress = parseInt(data.loaded / data.total * 100, 10);
                    //$('#progress .bar').css(
                    //    'width',
                    //    progress + '%'
                    //);
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
                        });
                    }
                },
                done: function (e, data) {
                    debugger;
                    $.each(data.result.added, function (index, file) {
                        $('<p/>').text(file.name).appendTo(document.body);
                    });
                }
            });

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

    docmana.ui.uploader = function (options) {
        return new Uploader(options);
    }
})();

