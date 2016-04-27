(function () {

    "use strict";

    var commandName = 'layout';

    var Cmd = docmana.CommandBase.extend({
        init: function (options) {
            this.name = commandName;
            this.templateName = 'toolbarBtnLayout';
            this.enabledWhen = null;
        },
        exec: function () {
            var layout = this.$element().find('input[type=radio]:checked').data('layout');
            this.workzone().changeLayout(layout);
        },
        listenUI: function () {
            // 初始按钮状态，在绑定 change 之前，否则会触发不必要的 change 事件
            var currLayout = this.workzone().layout;
            this.$element().find('[data-layout=' + currLayout + ']').closest('.btn').button('toggle');

            var that = this;
            // 不能直接触发 data-action，暂时没去找原因，因此监听 change 事件
            this.$el.on('change', function (e) {
                that.exec();
            });

        }
    });

    docmana.commands[commandName] = function (options) {
        return new Cmd(options);
    }

})();

