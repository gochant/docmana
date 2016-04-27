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

        setInputSelection: function (input, startPos, endPos) {
            input.focus();
            if (typeof input.selectionStart != "undefined") {
                input.selectionStart = startPos;
                input.selectionEnd = endPos;
            } else if (document.selection && document.selection.createRange) {
                // IE branch
                input.select();
                var range = document.selection.createRange();
                range.collapse(true);
                range.moveEnd("character", endPos);
                range.moveStart("character", startPos);
                range.select();
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

            docmana.utils.setInputSelectionWithoutExtension($editor);

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
        }
    }

})();


