(function () {

    "use strict";

    var commandName = 'upload';

    var Cmd = docmana.CommandBase.extend({
        init: function (options) {
            this.name = commandName;
            this.templateName = 'toolbarBtnUpload';
            this.icon = 'fa fa-upload';
        },
        listen: function () {
            this.listenTo(this, 'rendered', function () {
                var that = this;
                this.$el.find(':file').on('change', function () {
                    var val = $(this).val();
                    if (val === "" || val == null) return;
                
                    that.store().upload($(this).closest('form'));
                });
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

