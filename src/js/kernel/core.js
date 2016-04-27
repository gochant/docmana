(function () {

    "use strict";

    var extend = function (protoProps, staticProps) {
        var parent = this;
        var child;

        if (protoProps && _.has(protoProps, 'constructor')) {
            child = protoProps.constructor;
        } else {
            child = function () { return parent.apply(this, arguments); };
        }

        _.extend(child, parent, staticProps);

        child.prototype = _.create(parent.prototype, protoProps);
        child.prototype.constructor = child;

        child.__super__ = parent.prototype;

        return child;
    };

    var baseMethods = _.extend({
        main: function () {
            return this.props.parent ? this.props.parent.main : this.props.main;
        },
        store: function () {
            return this.main().store;
        },
        clipboard: function () {
            return this.main().clipboard;
        },
        history: function () {
            return this.main().history;
        },
        toolbar: function () {
            return this.main().ui.toolbar;
        },
        workzone: function () {
            return this.main().ui.workzone;
        },
        initProps: function (options) {
            this.props = _.extend({}, _.result(this, 'defaults'), options);
        },
        getState: function () {
            return {};
        },
        defaults: {},
        tpl: function (name) {
            return docmana.template.get(name);
        },
        $element: function () {
            return this.$el;
        },
        init: function () { },
        listen: function () { return this; },
        render: function () {
            var tpl = this.tpl(_.result(this, 'templateName'));
            if (tpl) {
                this.$el.html(tpl(this.getState()));
            }
            this.trigger('rendered');

        }
    });

    // ComponentBase
    function ComponentBase(options) {
        this.initProps(options);
        this.listen();
        this.init.apply(this, arguments);
    }

    ComponentBase.prototype = _.extend({
        constructor: ComponentBase
    }, baseMethods, Backbone.Events);

    ComponentBase.extend = extend;

    docmana.ComponentBase = ComponentBase;

    // CommandBase
    docmana.CommandBase = ComponentBase.extend({
        setState: function ($el) {
            $el = $el || this.$element();
            if ($el) {
                if (this.canExec()) {
                    this.enable();
                } else {
                    this.disable();
                }
            }
        },
        enable: function () {
            this.$element().removeClass('disabled').removeAttr('disabled');
        },
        disable: function () {
            this.$element().addClass('disabled').attr('disabled', 'disabeld');
        },
        canExec: function () {
            if (this.enabledWhen) {
                var selected = this.workzone().select();
                if (this.enabledWhen === 'selected' && selected.length <= 0) return false;
                if (this.enabledWhen === 'single' && selected.length !== 1) return false;
                if (this.enabledWhen === 'multiple' && selected.length < 1) return false;
            }
            return true;
        },

        exec: function () { },
        listenUI: function () {
            if (this.enabledWhen) {
                this.listenTo(this.workzone(), 'selected refresh', function () {
                    this.setState();
                });
            }
        },
        shortcutExec: function () {
            if (this.canExec()) {
                this.exec();
            }
        },
        render: function () {
            var params = {
                name: this.name,
                icon: this.icon || 'docmana-icon docmana-icon-' + this.name,
                shortcuts: this.shortcuts == null ? "" : '(' + this.shortcuts + ')'
            };
            var tpl = this.tpl(this.templateName);
            var output = tpl(params);
            this.$el = $(output);
            this.trigger('rendered');
            this.listenUI();
            this.setState();
            return this.$el;
        }

    });


    docmana.ViewBase = Backbone.View.extend(_.extend({
        initialize: function (options) {
            this.initProps(options);
            this.listen();
            if (this.props.autoAction) {
                this.events || (this.events = {});
                _.extend(this.events, {
                    'click [data-action]': '_actionHandler',
                    'click [data-command]': '_commandHandler'
                });
                this.delegateEvents();
            }

            this.init.apply(this, arguments);

            this.props.autoRender && this.render();
        },
        _commandHandler: function (e) {
            var $target = $(e.currentTarget);
            var name = $target.attr('data-command');
            var command = this.main().command(name);
            if (command && command.canExec()) {
                command.exec($target.data());
            }
        },
        _actionHandler: function (e, context) {
            e.preventDefault();
            //e.stopImmediatePropagation();

            context || (context = this);
            var $el = $(e.currentTarget);
            if ($el.closest('script').length > 0) return;

            var actionName = '_' + $el.data().action;
            if (actionName.indexOf('Handler') < 0) {
                actionName = actionName + 'Handler';
            }

            context[actionName] && context[actionName](e);
        }
    }, baseMethods));

    docmana.CommandContainer = docmana.ViewBase.extend({
        _getCommandOptions: function () {
            var myCommands = this.props.commands || [];
            return _.filter(this.main().props.commands, function (config) {
                var groupName = config[0];
                return (_.find(myCommands, function (c) {
                    var name = _.isString(c) ? c : c.name;
                    return name === groupName;
                })) != null;
            });
        },
        _getCommandGroups: function () {
            var that = this;
            var result = {};
            _.forEach(this._getCommandOptions(), function (pair) {
                var name = pair[0];
                var cmds = pair[1];
                result[name] = _.compact(_.map(cmds, function (name) {
                    var command = that.main().command(name);
                    return command;
                }));
            });
            return result;
        },
        _getCommandGroupDom: function (cmds, name) {
            if (cmds.length > 0) {
                var $group = $(this.tpl('toolbarBtnGroup')({
                    name: name
                }));

                _.forEach(cmds, function (cmd) {
                    $group.append(cmd.render());
                });

                return $group;
            }
            return '';
        },
        _getCommandAppendTo: function (name) {
            var cmd = _.find(this.props.commands, function (cmd) {
                return cmd.name === name;
            });
            return cmd == null ? this.$el : this.$(cmd.to);
        },
        _renderCommands: function () {
            var cmdGroups = this._getCommandGroups();
            var that = this;
            _.forEach(cmdGroups, function (cmds, name) {
                that._getCommandAppendTo(name).append(that._getCommandGroupDom(cmds, name));
            });
        }
    });

})();

