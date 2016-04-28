(function () {

    "use strict";

    var commandName = 'upload';

    var Cmd = docmana.CommandBase.extend({
        init: function (options) {
            this.name = commandName;
            this.templateName = 'toolbarBtnUpload';
        },
        listen: function () {
            this.listenTo(this.main(), 'started', function () {
                var that = this;
                var $file = this.$el.find(':file');
                var uploader = this.main().ui.uploader;
                // 如果有 jquery file upload 控件，则初始化 uploader 容器
                if ($.fn.fileupload && uploader) {
                    uploader.build($file);
                } else {
                    $file.on('change', function () {
                        var val = $(this).val();
                        if (val === "" || val == null) return;
                        // 通过 jquery.form 提交
                        that.store().upload($(this).closest('form'));
                    });
                }
            });
            this.listenTo(this, 'rendered', function () {
          

            });
        },
        enable: function () {
            docmana.CommandBase.prototype.enable.apply(this, arguments);
            this.$element().find(':file').removeAttr('disabled');
        },
        disable: function () {
            docmana.CommandBase.prototype.disable.apply(this, arguments);
            this.$element().find(':file').attr('disabled', 'disabled');
        }
    });

    docmana.commands[commandName] = function (options) {
        return new Cmd(options);
    }

})();

