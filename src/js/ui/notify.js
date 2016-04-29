(function () {
    "use strict";

    // 通知
    // 默认使用 noty，如果使用其他通知库，按照接口重写notify对象的相应方法

    var notify = {
        _core: $.noop,
        warn: $.noop,
        success: $.noop,
        error: $.noop,
        confirm: $.noop
    };


    docmana.ui.notify = notify;

    if (!window.console) return;

    if (window.noty == null) {
        notify._core = function (option) {
            console[option.type](option.text);
        }
        notify.warn = function (text) {
            console['warn'](text);
        }
        notify.success = function (text) {
            console['log'](text);
        }
        notify.error = function (text) {
            console['error'](text);
        }
        notify.confirm = function (sb, cb, text) {
            text || (text = docmana.resource('textConfirmOperate'));

            var r = window.confirm(text);
            if (r) {
                sb();
            } else {
                cb();
            }
        }
    } else {

        notify._core = function (option) {
            var n = noty($.extend({
                type: 'warning',
                dismissQueue: true,
                force: true,
                layout: 'topCenter',
                theme: 'relax',  // bootstrapTheme
                closeWith: ['click'],
                maxVisible: 1,
                animation: {
                    open: { height: 'toggle' },
                    close: { height: 'toggle' },
                    easing: 'swing',
                    speed: 100 // opening & closing animation speed
                },
                timeout: false,
                killer: true,
                modal: false
            }, option));

        };

        notify.warn = function (text) {
            notify._core({
                text: text,
                type: 'warning',
                timeout: 4000
            });
        };

        notify.success = function (text) {
            notify._core({
                text: text,
                timeout: 2000,
                type: 'success'
            });
        };

        notify.error = function (text) {
            notify._core({
                text: text,
                type: 'error',
                timeout: false
            });
        };

        notify.confirm = function (successCb, cancelCb, text) {
            text || (text = docmana.resource('textConfirmOperate'));

            notify._core({
                text: text,
                type: 'confirm',
                modal: true,
                buttons: [{
                    addClass: 'btn btn-primary btn-xs', text: docmana.resource('textOk'), onClick: function ($noty) {
                        $noty.close();
                        successCb();
                    }
                }, {
                    addClass: 'btn btn-danger btn-xs', text: docmana.resource('textCancel'), onClick: function ($noty) {
                        $noty.close();
                        cancelCb();
                    }
                }]
            });
        };

    }



})();

