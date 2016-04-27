(function ($) {

    "use strict";

    var pluginName = "clearIt",
        defaults = {
            clearClass: 'clear_input',
            focusAfterClear: true,
            linkText: '&times;',
            callback: null
        };

    function Plugin(element, options) {
        this.element = element;
        this.$element = $(element);
        this.settings = $.extend({}, defaults, options);
        this._defaults = defaults;
        this._name = pluginName;
        this.init();
    }

    $.extend(Plugin.prototype, {
        init: function () {
            var that = this;
            var $el = this.$element;
            var $parent = $el.parent();
            var divClass = this.settings.clearClass + '_div';

            if (!$parent.hasClass(divClass)) {
                $parent
                   .addClass(divClass)
                   .append('<a style="position: absolute; cursor: pointer;" class="' + this.settings.clearClass + '">'
                   + this.settings.linkText + '</a>');
            }

            this.$btn().on('click', function (e) {
                that.clear();
            });

            $el.on('keyup keydown change focus', function () {
                that.toggleBtn();
                if (!that.hasText()) {
                    that.callback();
                }
            });

            this.toggleBtn();

        },
        $btn: function () {
            return this.$element.parent().find('.' + this.settings.clearClass);
        },
        toggleBtn: function () {
            var $btn = this.$btn();
            var method = this.hasText() ? 'show' : 'hide';
            $btn[method]();
            this.layout();
        },
        layout: function () {
            var width = this.$element.outerWidth();
            var height = this.$element.outerHeight();
            var $btn = this.$btn();
            $btn.css({
                top: height / 2 - $btn.height() / 2,
                left: width - height / 2 - $btn.height() / 2 - 10
            });
        },
        callback: function () {
            if (typeof (this.settings.callback) === "function") {
                this.settings.callback();
            }
        },
        clear: function () {

            this.$element.val('').change();
            this.toggleBtn();

            if (this.settings.focusAfterClear) {
                this.$element.focus();
            }
            this.callback();
        },
        hasText: function () {
            return this.$element.val().replace(/^\s+|\s+$/g, '').length > 0;
        }
    });

    $.fn[pluginName] = function (options) {
        return this.each(function () {
            if (!$.data(this, "plugin_" + pluginName)) {
                $.data(this, "plugin_" +
                    pluginName, new Plugin(this, options));
            }
        });
    };

})(jQuery);




// autosizeinput
// https://github.com/MartinF/jQuery.Autosize.Input
var Plugins;
(function (Plugins) {
    var AutosizeInputOptions = (function () {
        function AutosizeInputOptions(space) {
            if (typeof space === "undefined") { space = 30; }
            this.space = space;
        }
        return AutosizeInputOptions;
    })();
    Plugins.AutosizeInputOptions = AutosizeInputOptions;

    var AutosizeInput = (function () {
        function AutosizeInput(input, options) {
            var _this = this;
            this._input = $(input);
            this._options = $.extend({}, AutosizeInput.getDefaultOptions(), options);

            // Init mirror
            this._mirror = $('<span style="position:absolute; top:-999px; left:0; white-space:pre;"/>');

            // Copy to mirror
            $.each(['fontFamily', 'fontSize', 'fontWeight', 'fontStyle', 'letterSpacing', 'textTransform', 'wordSpacing', 'textIndent'], function (i, val) {
                _this._mirror[0].style[val] = _this._input.css(val);
            });
            $("body").append(this._mirror);

            // Bind events - change update paste click mousedown mouseup focus blur
            // IE 9 need keydown to keep updating while deleting (keeping backspace in - else it will first update when backspace is released)
            // IE 9 need keyup incase text is selected and backspace/deleted is hit - keydown is to early
            // How to fix problem with hitting the delete "X" in the box - but not updating!? mouseup is apparently to early
            // Could bind separatly and set timer
            // Add so it automatically updates if value of input is changed http://stackoverflow.com/a/1848414/58524
            this._input.on("keydown keyup input propertychange change", function (e) {
                _this.update();
            });

            // Update
            (function () {
                _this.update();
            })();
        }
        AutosizeInput.prototype.getOptions = function () {
            return this._options;
        };

        AutosizeInput.prototype.update = function () {
            var value = this._input.val() || "";

            if (value === this._mirror.text()) {
                // Nothing have changed - skip
                return;
            }

            // Update mirror
            this._mirror.text(value);

            // Calculate the width
            var newWidth = this._mirror.width() + this._options.space;

            // Update the width
            this._input.width(newWidth);
        };

        AutosizeInput.getDefaultOptions = function () {
            return this._defaultOptions;
        };

        AutosizeInput.getInstanceKey = function () {
            // Use camelcase because .data()['autosize-input-instance'] will not work
            return "autosizeInputInstance";
        };
        AutosizeInput._defaultOptions = new AutosizeInputOptions();
        return AutosizeInput;
    })();
    Plugins.AutosizeInput = AutosizeInput;

    // jQuery Plugin
    (function ($) {
        var pluginDataAttributeName = "autosize-input";
        var validTypes = ["text", "password", "search", "url", "tel", "email", "number"];

        // jQuery Plugin
        $.fn.autosizeInput = function (options) {
            return this.each(function () {
                // Make sure it is only applied to input elements of valid type
                // Or let it be the responsibility of the programmer to only select and apply to valid elements?
                if (!(this.tagName == "INPUT" && $.inArray(this.type, validTypes) > -1)) {
                    // Skip - if not input and of valid type
                    return;
                }

                var $this = $(this);

                if (!$this.data(Plugins.AutosizeInput.getInstanceKey())) {
                    // If instance not already created and attached
                    if (options == undefined) {
                        // Try get options from attribute
                        options = $this.data(pluginDataAttributeName);
                    }

                    // Create and attach instance
                    $this.data(Plugins.AutosizeInput.getInstanceKey(), new Plugins.AutosizeInput(this, options));
                }
            });
        };

        // On Document Ready
        $(function () {
            // Instantiate for all with data-provide=autosize-input attribute
            $("input[data-" + pluginDataAttributeName + "]").autosizeInput();
        });
        // Alternative to use On Document Ready and creating the instance immediately
        //$(document).on('focus.autosize-input', 'input[data-autosize-input]', function (e)
        //{
        //	$(this).autosizeInput();
        //});
    })(jQuery);
})(Plugins || (Plugins = {}));


