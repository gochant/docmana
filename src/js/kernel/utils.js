(function () {
    "use strict";
    docmana.utils = {
        // 格式化字符串，类似 C# string.format
        formatString: function () {
            var s = arguments[0];
            for (var i = 0; i < arguments.length - 1; i++) {
                var reg = new RegExp("\\{" + i + "\\}", "gm");
                s = s.replace(reg, arguments[i + 1]);
            }
            return s;
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

        fileNameExtension: function (filename) {
            return '.' + filename.split('.').pop();
        },
        unixTimestamp: function () {
            return Math.round(new Date().getTime() / 1000);
        },
        selectSelectableElement: function (selectableContainer, elementsToSelect) {
            $(".ui-selected", selectableContainer)
                .not(elementsToSelect).removeClass("ui-selected ui-selectee").addClass("ui-unselecting");

            $(elementsToSelect).addClass("ui-selecting ui-selectee");

            var selectable = selectableContainer.data("ui-selectable");
            selectable._mouseStop(null);
        },

        setInputSelection: function (input, start, end) {
            input.focus();
            if (input.setSelectionRange) {
                input.setSelectionRange(start, end);
            } else if (typeof input.selectionStart != 'undefined') {
                input.selectionStart = start;
                input.selectionEnd = end;
            } else if (input.createTextRange) {
                var selRange = input.createTextRange();
                selRange.collapse(true);
                selRange.moveStart('character', start);
                selRange.moveEnd('character', end - start);
                selRange.select();
            }
        },
        setInputSelectionWithoutExtension: function ($input) {
            var val = $input.val();
            var endIdx = val.lastIndexOf('.');
            endIdx = endIdx > 0 ? endIdx : val.length;

            docmana.utils.setInputSelection($input[0], 0, endIdx);

        },
        inlineEdit: function ($el, callback, mode, isForce) {  // mode: 0: 横向，1： 纵向
            if (mode == null) mode = 0;
            if (isForce == null) isForce = false;
            var originVal = _.trim($el.text());
            var $editor;

            if (mode === 0) {
                $editor = $('<input name="temp" type="text" class="inline-edit" />').autosizeInput();
            } else {
                $editor = $('<textarea name="temp" class="inline-edit" tabindex="2"></textarea>');
            }
            $editor
                .val(originVal)

                //.on('change keyup keydown paste cut', function () {
                //    if (mode === 0) {
                //        debugger;
                //        $(this).width($(this).val().length * 13 + 20);
                //    } else {
                //        $(this).height(this.scrollHeight);
                //    }
                //})
                .on('keydown', function (e) {
                    if (e.keyCode === 13) {
                        e.preventDefault();
                        $(this).blur();
                    }
                });

            // 初始化高度
            if (mode === 0) {
                $editor.width($el.outerWidth() + 30);
            } else {
                $editor.height($el.outerHeight());
            }


            $el.hide();
            $el.after($editor);
            // $editor.show();
            $editor.focus();

            $editor.on('blur', function () {
                var val = $(this).val();
                if (isForce || (val !== "" && originVal !== val)) {
                    $el.text(val);
                    callback(val);
                }

                $(this).remove();
                $el.show();
            });

            docmana.utils.setInputSelectionWithoutExtension($editor);

        }
    }

})();


