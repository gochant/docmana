(function () {
    "use strict";

    window.docmana = {};

    docmana.VERSION = '0.1.0';
    docmana.lang = 'zh-CN';

    docmana.DEFAULTS = {
        store: {
            url: null,
            requestData: {
                folder: null,
                subFolder: null
            }
        },
        // navigation, new, open, clipboard, organize, view, select
        commands: [
            ['navigation', ['back', 'forward']],
            ['new', ['mkdir', 'upload']],
            ['open', ['open', 'download']],
            ['clipboard', ['cut', 'copy', 'paste']],
            ['organize', ['duplicate', 'rename', 'rm']],
            ['layout', ['layout']],
            ['view', ['sort']],
            ['search', ['search']]
            //,
            //['refresh', ['refresh']]
        ],
        workzone:{
            layout: 'list'
        },
        ui: ['workzone', 'toolbar', 'navigation', 'statusbar', 'viewer'],
        kernel: ['store', 'history', 'clipboard']
    }

    docmana.commands = {};
    docmana.ui = {};
})();
