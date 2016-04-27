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

    if (window.noty == null) return;

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

    notify.confirm = function (successCb, cancelCb) {
        notify._core({
            text: '确定进行这个操作？',
            type: 'confirm',
            modal: true,
            buttons: [{
                addClass: 'btn btn-primary btn-xs', text: '确定', onClick: function ($noty) {
                    $noty.close();
                    successCb();
                }
            }, {
                addClass: 'btn btn-danger btn-xs', text: '取消', onClick: function ($noty) {
                    $noty.close();
                    cancelCb();
                }
            }]
        });
    };


})();

