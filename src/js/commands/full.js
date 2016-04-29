(function () {

    "use strict";

    var commandName = 'full';

    var Cmd = docmana.CommandBase.extend({
        init: function (options) {
            this.name = commandName;
            this.templateName = 'toolbarBtn';
            this.enabledWhen = null;

            this.viewLayout = this.props.viewLayout;
        },
        defaults: {
            viewLayout: 'normal' // 'fullscreen'
        },
        listen: function () {
            this.listenTo(this, 'rendered', function() {
                this._setDisplay();
            });
        },
        _getReverse: function () {
            var curr = this.viewLayout;
            return curr === 'normal' ? 'fullscreen' : 'normal';
        },
        _setDisplay: function () {
            var curr = this.viewLayout;

            this.$el.find('.docmana-icon').removeClass('docmana-icon-' + this._getReverse())
                .addClass('docmana-icon-' + curr);


        },
        toggle: function (vl) {
            this.viewLayout = this._getReverse();
            this._setDisplay();

            if (this.viewLayout === 'fullscreen') {
                this.main().$el.addClass('fixed');
                $('body').addClass('overflow-hidden');
            } else {
                this.main().$el.removeClass('fixed');
                $('body').removeClass('overflow-hidden');
            }

        },
        exec: function (options) {
            this.toggle();
        }
    });

    docmana.commands[commandName] = function (options) {
        return new Cmd(options);
    }

})();

