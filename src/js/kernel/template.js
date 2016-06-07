(function () {
    "use strict";

    var templateHelper = _.extend({
        formatDate: function (unixTs, format) {
            var date = new Date(unixTs * 1000);
            format || (format = 'yyyy/mm/dd HH:MM');

            return date.format(format);
            //return date.toLocaleDateString(docmana.lang) + ' ' + date.toLocaleTimeString(docmana.lang, {
            //    hour12: false
            //});
        },
        // deprecate
        _mime2ClassDep: function (mime) {
            var prefix = 'ico-';

            mime = mime.split('/');

            return prefix + mime[0] + (mime[0] !== 'image' && mime[1] ? ' ' + prefix + mime[1].replace(/(\.|\+)/g, '-') : '');
        },
        name2IconClass: function (name, mime, data) {
            var result;
            if (mime === 'directory') {
                result = 'icon-folder';
            } else {
                var parts = name.split('.');
                var prefix = 'icon-';
                result = prefix + parts[parts.length - 1];
            }
            if (data.locked === 1) {
                result += ' icon-locked';
            }
            return result;
        },
        mime2Class: function (mime) {
            if (mime === 'directory') {
                return 'type-directory';
            }
            return 'type-file';
        },
        mime2Type: function (mime) {
            return docmana.mimeTypes[mime];
        },
        fileMetadata: function (data) {
            var lang = docmana.resource;
            var strs = [];
            strs.push(data.name);
            strs.push(lang('fileType') + ': ' + lang('kind' + this.mime2Type(data.mime)));
            if (data.mime !== 'directory') {
                strs.push(lang('fileSize') + ': ' + this.formatFileSize(data.size));
            }
            strs.push(lang('fileDateModified') + ': ' + this.formatDate(data.ts));
            return strs.join(' &#13; ');
        }
    }, docmana.utils);

    docmana.templateHelper = templateHelper;
    if (!_.templateSettings.imports) {
        _.docmanaTemplateHelper = templateHelper;
        _.docmanaResource = docmana.resource;
    }
    docmana.template = {
        _cache: {}
    };

    docmana.template.load = function (tplStore) {
        var that = this;
        _.forEach(tplStore, function(tpl, key) {
            that._cache[key] = that.compile(tpl);
        });
    }

    docmana.template.get = function (key) {
        return this._cache[key + '.html'];
    }

    docmana.template.compile = function (tpl) {
        if (!_.templateSettings.imports) {
            tpl = tpl.replace(/T\./g, '_.docmanaTemplateHelper.').replace(/L\(/g, '_.docmanaResource(');
        }
        return _.template(tpl, {
            'imports': {
                '$': jQuery,
                'T': docmana.templateHelper,
                'L': docmana.resource
            },
            'variable': 'data'
        });
    }

    docmana.template.load(docmana.templates);

})();

