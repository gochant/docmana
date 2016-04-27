(function () {
    "use strict";

    docmana.templateHelper = {
        formatDate: function (unixTs, format) {
            var date = new Date(unixTs * 1000);
            format || (format = 'yyyy/mm/dd HH:MM');

            return date.format(format);
            //return date.toLocaleDateString(docmana.lang) + ' ' + date.toLocaleTimeString(docmana.lang, {
            //    hour12: false
            //});
        },
        formatFileSize: function (bytes, onlyKb, si) {
            if (si == null) si = true;
            if (onlyKb == null) onlyKb = false;
            var thresh = si ? 1000 : 1024;
            var units = si ? ['KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'] : ['KiB', 'MiB', 'GiB', 'TiB', 'PiB', 'EiB', 'ZiB', 'YiB'];
            var u = -1;
            var fixed = 1;
            if (onlyKb) {
                bytes /= thresh;
                u = 0;
                fixed = 0;
                if (bytes < 1 && bytes > 0) {
                    bytes = 1;
                }
            } else {
                if (Math.abs(bytes) < thresh) {

                    return bytes + ' B';
                }

                do {
                    bytes /= thresh;
                    ++u;
                } while (Math.abs(bytes) >= thresh && u < units.length - 1);
            }


            return bytes.toFixed(fixed) + ' ' + units[u];
        },
        // deprecate
        _mime2ClassDep: function (mime) {
            var prefix = 'ico-';

            mime = mime.split('/');

            return prefix + mime[0] + (mime[0] !== 'image' && mime[1] ? ' ' + prefix + mime[1].replace(/(\.|\+)/g, '-') : '');
        },
        name2IconClass: function (name, mime) {
            if (mime === 'directory') {
                return 'icon-folder';
            }
            var parts = name.split('.');
            var prefix = 'icon-';
            return prefix + parts[parts.length - 1];
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
            strs.push(lang('Type') + ': ' + lang('kind' + this.mime2Type(data.mime)));
            if (data.mime !== 'directory') {
                strs.push(lang('Size') + ': ' + this.formatFileSize(data.size));
            }
            strs.push(lang('Date modified') + ': ' + this.formatDate(data.ts));
            return strs.join(' &#13; ');
        }
    };

})();

