(function () {

    "use strict";

    var commandName = 'sort';

    var Cmd = docmana.CommandBase.extend({
        init: function (options) {
            this.name = commandName;
            this.templateName = 'toolbarBtnSort';
            this.enabledWhen = null;
        },
        setState: function () {
            var $el = this.$element();
            var sortBy = this.store()._sortBy;
            $el.find('.active').removeClass('active');
            $el.find('[data-field=' + sortBy.field + ']').addClass('active');
            $el.find('[data-order=' + sortBy.order + ']').addClass('active');
        },
        listenUI: function () {
            this.listenTo(this.store(), 'sort', function (sortBy) {
                this.setState();
            });
        },
        exec: function (options) {
            options || (options = {});

            this.store().sortBy(options.field, options.order);
            this.store().update();
        }
    });

    docmana.commands[commandName] = function (options) {
        return new Cmd(options);
    }

})();

