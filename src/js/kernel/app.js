(function () {

    "use strict";

    docmana.App = docmana.ViewBase.extend({
        init: function () {
            this.ui = {};
            this.commands = {};

            this._initKernel();
            this._initCommands();
        },
        templateName: 'main',
        defaults: {
            autoRender: true,
            className: 'static',
            panelClassName: 'panel no-margin panel-default',
            commandOptions: {}
        },
        listen: function () {
            this.listenTo(this, 'rendered', function () {
                this.$el.attr('tabindex', 1)
                    .addClass('docmana')
                    .addClass(this.props.className)
                    .find('.docmana-panel')
                    .addClass(this.props.panelClassName);
                this._initUI();
                this.startup();
                var that = this;

                setTimeout(function () {
                    that.relayout();
                }, 1);
            });
            this.listenTo(this, 'started', function () {
                this.listenTo(this.store, 'syncFail', function (resp) {
                    docmana.ui.notify.error(resp);
                });
            });
        },
        $panel: function () {
            return this.$('.docmana-panel');
        },
        relayout: function () {
            var ieVersion = docmana.utils.ieVersion();
            if (ieVersion && ieVersion <= 9) {
                if (this.$el.hasClass('static') || this.$el.hasClass('fixed')) {
                    this.$('.docmana-body').css({
                        top: this.$('.docmana-heading').outerHeight(),
                        bottom: this.$('.docmana-footer').outerHeight()
                    });
                    this.$('.docmana-workzone').css({
                        top: this.$('.docmana-navigation').outerHeight()
                    });
                    this.$('.docmana-navigation .breadcrumb-group').css({
                        'margin-left': '5px',
                        'width': this.$('.docmana-navigation').width()
                            - this.$('.docmana-navigation .nav-group').outerWidth()
                            - this.$('.docmana-navigation .search-group').outerWidth() - 10
                    });
                }
            }
        },
        _initKernel: function () {
            var that = this;
            _.forEach(this.props.kernel, function (name) {
                that[name] = docmana[name](_.extend({
                    main: that
                }, that.props[name]));
            });
        },
        _initUI: function () {
            var that = this;
            _.forEach(this.props.ui, function (name) {
                that.ui[name] = docmana.ui[name](_.extend({
                    el: that.$('.docmana-' + name),
                    main: that
                }, that.props[name]));
            });

            this.$el.on('focus', function () {
                //  that.ui.workzone && that.ui.workzone.$el.focus();
            });
        },
        _initCommands: function () {
            var that = this;
            _.forEach(_.flatten(this.props.commands, true), function (cmds) {

                if (_.isArray(cmds)) {

                    _.forEach(cmds, function (cmd) {
                        var instance = docmana.commands[cmd](_.extend({
                            main: that
                        }, that.props.commandOptions[cmd]));

                        that.commands[cmd] = instance;
                    });
                }

            });
        },
        command: function (name) {
            return this.commands[name];
        },
        exec: function () {
            var args = _.toArray(arguments);
            var name = args.shift();
            var isForce = args.shift();
            var cmd = this.command(name);

            if (isForce || (cmd && cmd.canExec())) {               
                cmd.exec.apply(cmd, args);
            }
        },
        focus: function () {
            this.$el.focus();
        },
        startup: function () {
            //var a = this.$el[0].outerWidth;
            this.trigger('started');
            this.store.open(null, 1);
        }
    });

    // 插件化
    function Plugin(option) {
        return this.each(function () {
            var $this = $(this);
            var data = $this.data('docmana');
            var options = $.extend({
                el: this
            }, docmana.DEFAULTS, $this.data(), typeof option == 'object' && option);

            if (!data) $this.data('docmana', (data = new docmana.App(options)));
            if (typeof option == 'string') data[option]();
        });
    }

    $.fn.docmana = Plugin;
    $.fn.docmana.Constructor = docmana;

})();

