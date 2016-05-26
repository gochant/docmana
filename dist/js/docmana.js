
(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    define(["jquery","lodash","backbone","bootstrap"], factory);
  } else if (typeof exports === 'object') {
    module.exports = factory(require('jquery'), require('lodash'), require('backbone'), require('bootstrap'));
  } else {
    root.docmana = factory(root.jQuery, root._, root.Backbone, root.undefined);
  }
}(this, function($, _, Backbone, undefined) {

/*
 * Date Format 1.2.3
 * (c) 2007-2009 Steven Levithan <stevenlevithan.com>
 * MIT license
 *
 * Includes enhancements by Scott Trenda <scott.trenda.net>
 * and Kris Kowal <cixar.com/~kris.kowal/>
 *
 * Accepts a date, a mask, or a date and a mask.
 * Returns a formatted version of the given date.
 * The date defaults to the current date/time.
 * The mask defaults to dateFormat.masks.default.
 */

var dateFormat = function () {
	var	token = /d{1,4}|m{1,4}|yy(?:yy)?|([HhMsTt])\1?|[LloSZ]|"[^"]*"|'[^']*'/g,
		timezone = /\b(?:[PMCEA][SDP]T|(?:Pacific|Mountain|Central|Eastern|Atlantic) (?:Standard|Daylight|Prevailing) Time|(?:GMT|UTC)(?:[-+]\d{4})?)\b/g,
		timezoneClip = /[^-+\dA-Z]/g,
		pad = function (val, len) {
			val = String(val);
			len = len || 2;
			while (val.length < len) val = "0" + val;
			return val;
		};

	// Regexes and supporting functions are cached through closure
	return function (date, mask, utc) {
		var dF = dateFormat;

		// You can't provide utc if you skip other args (use the "UTC:" mask prefix)
		if (arguments.length == 1 && Object.prototype.toString.call(date) == "[object String]" && !/\d/.test(date)) {
			mask = date;
			date = undefined;
		}

		// Passing date through Date applies Date.parse, if necessary
		date = date ? new Date(date) : new Date;
		if (isNaN(date)) throw SyntaxError("invalid date");

		mask = String(dF.masks[mask] || mask || dF.masks["default"]);

		// Allow setting the utc argument via the mask
		if (mask.slice(0, 4) == "UTC:") {
			mask = mask.slice(4);
			utc = true;
		}

		var	_ = utc ? "getUTC" : "get",
			d = date[_ + "Date"](),
			D = date[_ + "Day"](),
			m = date[_ + "Month"](),
			y = date[_ + "FullYear"](),
			H = date[_ + "Hours"](),
			M = date[_ + "Minutes"](),
			s = date[_ + "Seconds"](),
			L = date[_ + "Milliseconds"](),
			o = utc ? 0 : date.getTimezoneOffset(),
			flags = {
				d:    d,
				dd:   pad(d),
				ddd:  dF.i18n.dayNames[D],
				dddd: dF.i18n.dayNames[D + 7],
				m:    m + 1,
				mm:   pad(m + 1),
				mmm:  dF.i18n.monthNames[m],
				mmmm: dF.i18n.monthNames[m + 12],
				yy:   String(y).slice(2),
				yyyy: y,
				h:    H % 12 || 12,
				hh:   pad(H % 12 || 12),
				H:    H,
				HH:   pad(H),
				M:    M,
				MM:   pad(M),
				s:    s,
				ss:   pad(s),
				l:    pad(L, 3),
				L:    pad(L > 99 ? Math.round(L / 10) : L),
				t:    H < 12 ? "a"  : "p",
				tt:   H < 12 ? "am" : "pm",
				T:    H < 12 ? "A"  : "P",
				TT:   H < 12 ? "AM" : "PM",
				Z:    utc ? "UTC" : (String(date).match(timezone) || [""]).pop().replace(timezoneClip, ""),
				o:    (o > 0 ? "-" : "+") + pad(Math.floor(Math.abs(o) / 60) * 100 + Math.abs(o) % 60, 4),
				S:    ["th", "st", "nd", "rd"][d % 10 > 3 ? 0 : (d % 100 - d % 10 != 10) * d % 10]
			};

		return mask.replace(token, function ($0) {
			return $0 in flags ? flags[$0] : $0.slice(1, $0.length - 1);
		});
	};
}();

// Some common format strings
dateFormat.masks = {
	"default":      "ddd mmm dd yyyy HH:MM:ss",
	shortDate:      "m/d/yy",
	mediumDate:     "mmm d, yyyy",
	longDate:       "mmmm d, yyyy",
	fullDate:       "dddd, mmmm d, yyyy",
	shortTime:      "h:MM TT",
	mediumTime:     "h:MM:ss TT",
	longTime:       "h:MM:ss TT Z",
	isoDate:        "yyyy-mm-dd",
	isoTime:        "HH:MM:ss",
	isoDateTime:    "yyyy-mm-dd'T'HH:MM:ss",
	isoUtcDateTime: "UTC:yyyy-mm-dd'T'HH:MM:ss'Z'"
};

// Internationalization strings
dateFormat.i18n = {
	dayNames: [
		"Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat",
		"Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"
	],
	monthNames: [
		"Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
		"January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"
	]
};

// For convenience...
Date.prototype.format = function (mask, utc) {
	return dateFormat(this, mask, utc);
};


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

/*
* jQuery File Download Plugin v1.4.4
*
* http://www.johnculviner.com
*
* Copyright (c) 2013 - John Culviner
*
* Licensed under the MIT license:
*   http://www.opensource.org/licenses/mit-license.php
*
* !!!!NOTE!!!!
* You must also write a cookie in conjunction with using this plugin as mentioned in the orignal post:
* http://johnculviner.com/jquery-file-download-plugin-for-ajax-like-feature-rich-file-downloads/
* !!!!NOTE!!!!
*/

(function($, window){
	// i'll just put them here to get evaluated on script load
	var htmlSpecialCharsRegEx = /[<>&\r\n"']/gm;
	var htmlSpecialCharsPlaceHolders = {
				'<': 'lt;',
				'>': 'gt;',
				'&': 'amp;',
				'\r': "#13;",
				'\n': "#10;",
				'"': 'quot;',
				"'": '#39;' /*single quotes just to be safe, IE8 doesn't support &apos;, so use &#39; instead */
	};

$.extend({
    //
    //$.fileDownload('/path/to/url/', options)
    //  see directly below for possible 'options'
    fileDownload: function (fileUrl, options) {

        //provide some reasonable defaults to any unspecified options below
        var settings = $.extend({

            //
            //Requires jQuery UI: provide a message to display to the user when the file download is being prepared before the browser's dialog appears
            //
            preparingMessageHtml: null,

            //
            //Requires jQuery UI: provide a message to display to the user when a file download fails
            //
            failMessageHtml: null,

            //
            //the stock android browser straight up doesn't support file downloads initiated by a non GET: http://code.google.com/p/android/issues/detail?id=1780
            //specify a message here to display if a user tries with an android browser
            //if jQuery UI is installed this will be a dialog, otherwise it will be an alert
            //Set to null to disable the message and attempt to download anyway
            //
            androidPostUnsupportedMessageHtml: "Unfortunately your Android browser doesn't support this type of file download. Please try again with a different browser.",

            //
            //Requires jQuery UI: options to pass into jQuery UI Dialog
            //
            dialogOptions: { modal: true },

            //
            //a function to call while the dowload is being prepared before the browser's dialog appears
            //Args:
            //  url - the original url attempted
            //
            prepareCallback: function (url) { },

            //
            //a function to call after a file download dialog/ribbon has appeared
            //Args:
            //  url - the original url attempted
            //
            successCallback: function (url) { },

            //
            //a function to call after a file download dialog/ribbon has appeared
            //Args:
            //  responseHtml    - the html that came back in response to the file download. this won't necessarily come back depending on the browser.
            //                      in less than IE9 a cross domain error occurs because 500+ errors cause a cross domain issue due to IE subbing out the
            //                      server's error message with a "helpful" IE built in message
            //  url             - the original url attempted
            //  error           - original error cautch from exception
            //
            failCallback: function (responseHtml, url, error) { },

            //
            // the HTTP method to use. Defaults to "GET".
            //
            httpMethod: "GET",

            //
            // if specified will perform a "httpMethod" request to the specified 'fileUrl' using the specified data.
            // data must be an object (which will be $.param serialized) or already a key=value param string
            //
            data: null,

            //
            //a period in milliseconds to poll to determine if a successful file download has occured or not
            //
            checkInterval: 100,

            //
            //the cookie name to indicate if a file download has occured
            //
            cookieName: "fileDownload",

            //
            //the cookie value for the above name to indicate that a file download has occured
            //
            cookieValue: "true",

            //
            //the cookie path for above name value pair
            //
            cookiePath: "/",

            //
            //if specified it will be used when attempting to clear the above name value pair
            //useful for when downloads are being served on a subdomain (e.g. downloads.example.com)
            //
            cookieDomain: null,

            //
            //the title for the popup second window as a download is processing in the case of a mobile browser
            //
            popupWindowTitle: "Initiating file download...",

            //
            //Functionality to encode HTML entities for a POST, need this if data is an object with properties whose values contains strings with quotation marks.
            //HTML entity encoding is done by replacing all &,<,>,',",\r,\n characters.
            //Note that some browsers will POST the string htmlentity-encoded whilst others will decode it before POSTing.
            //It is recommended that on the server, htmlentity decoding is done irrespective.
            //
            encodeHTMLEntities: true

        }, options);

        var deferred = new $.Deferred();

        //Setup mobile browser detection: Partial credit: http://detectmobilebrowser.com/
        var userAgent = (navigator.userAgent || navigator.vendor || window.opera).toLowerCase();

        var isIos;                  //has full support of features in iOS 4.0+, uses a new window to accomplish this.
        var isAndroid;              //has full support of GET features in 4.0+ by using a new window. Non-GET is completely unsupported by the browser. See above for specifying a message.
        var isOtherMobileBrowser;   //there is no way to reliably guess here so all other mobile devices will GET and POST to the current window.

        if (/ip(ad|hone|od)/.test(userAgent)) {

            isIos = true;

        } else if (userAgent.indexOf('android') !== -1) {

            isAndroid = true;

        } else {

            isOtherMobileBrowser = /avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|playbook|silk|iemobile|iris|kindle|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(userAgent) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|e\-|e\/|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(di|rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|xda(\-|2|g)|yas\-|your|zeto|zte\-/i.test(userAgent.substr(0, 4));

        }

        var httpMethodUpper = settings.httpMethod.toUpperCase();

        if (isAndroid && httpMethodUpper !== "GET" && settings.androidPostUnsupportedMessageHtml) {
            //the stock android browser straight up doesn't support file downloads initiated by non GET requests: http://code.google.com/p/android/issues/detail?id=1780

            if ($().dialog) {
                $("<div>").html(settings.androidPostUnsupportedMessageHtml).dialog(settings.dialogOptions);
            } else {
                alert(settings.androidPostUnsupportedMessageHtml);
            }

            return deferred.reject();
        }

        var $preparingDialog = null;

        var internalCallbacks = {

            onPrepare: function (url) {

                //wire up a jquery dialog to display the preparing message if specified
                if (settings.preparingMessageHtml) {

                    $preparingDialog = $("<div>").html(settings.preparingMessageHtml).dialog(settings.dialogOptions);

                } else if (settings.prepareCallback) {

                    settings.prepareCallback(url);

                }

            },

            onSuccess: function (url) {

                //remove the perparing message if it was specified
                if ($preparingDialog) {
                    $preparingDialog.dialog('close');
                }

                settings.successCallback(url);

                deferred.resolve(url);
            },

            onFail: function (responseHtml, url, error) {

                //remove the perparing message if it was specified
                if ($preparingDialog) {
                    $preparingDialog.dialog('close');
                }

                //wire up a jquery dialog to display the fail message if specified
                if (settings.failMessageHtml) {
                    $("<div>").html(settings.failMessageHtml).dialog(settings.dialogOptions);
                }

                settings.failCallback(responseHtml, url, error);

                deferred.reject(responseHtml, url);
            }
        };

        internalCallbacks.onPrepare(fileUrl);

        //make settings.data a param string if it exists and isn't already
        if (settings.data !== null && typeof settings.data !== "string") {
            settings.data = $.param(settings.data);
        }


        var $iframe,
            downloadWindow,
            formDoc,
            $form;

        if (httpMethodUpper === "GET") {

            if (settings.data !== null) {
                //need to merge any fileUrl params with the data object

                var qsStart = fileUrl.indexOf('?');

                if (qsStart !== -1) {
                    //we have a querystring in the url

                    if (fileUrl.substring(fileUrl.length - 1) !== "&") {
                        fileUrl = fileUrl + "&";
                    }
                } else {

                    fileUrl = fileUrl + "?";
                }

                fileUrl = fileUrl + settings.data;
            }

            if (isIos || isAndroid) {

                downloadWindow = window.open(fileUrl);
                downloadWindow.document.title = settings.popupWindowTitle;
                window.focus();

            } else if (isOtherMobileBrowser) {

                window.location(fileUrl);

            } else {

                //create a temporary iframe that is used to request the fileUrl as a GET request
                $iframe = $("<iframe>")
                    .hide()
                    .prop("src", fileUrl)
                    .appendTo("body");
            }

        } else {

            var formInnerHtml = "";

            if (settings.data !== null) {

                $.each(settings.data.replace(/\+/g, ' ').split("&"), function () {

                    var kvp = this.split("=");

                    //Issue: When value contains sign '=' then the kvp array does have more than 2 items. We have to join value back
                    var k = kvp[0];
                    kvp.shift();
                    var v = kvp.join("=");
                    kvp = [k, v];

                    var key = settings.encodeHTMLEntities ? htmlSpecialCharsEntityEncode(decodeURIComponent(kvp[0])) : decodeURIComponent(kvp[0]);
                    if (key) {
                        var value = settings.encodeHTMLEntities ? htmlSpecialCharsEntityEncode(decodeURIComponent(kvp[1])) : decodeURIComponent(kvp[1]);
                    formInnerHtml += '<input type="hidden" name="' + key + '" value="' + value + '" />';
                    }
                });
            }

            if (isOtherMobileBrowser) {

                $form = $("<form>").appendTo("body");
                $form.hide()
                    .prop('method', settings.httpMethod)
                    .prop('action', fileUrl)
                    .html(formInnerHtml);

            } else {

                if (isIos) {

                    downloadWindow = window.open("about:blank");
                    downloadWindow.document.title = settings.popupWindowTitle;
                    formDoc = downloadWindow.document;
                    window.focus();

                } else {

                    $iframe = $("<iframe style='display: none' src='about:blank'></iframe>").appendTo("body");
                    formDoc = getiframeDocument($iframe);
                }

                formDoc.write("<html><head></head><body><form method='" + settings.httpMethod + "' action='" + fileUrl + "'>" + formInnerHtml + "</form>" + settings.popupWindowTitle + "</body></html>");
                $form = $(formDoc).find('form');
            }

            $form.submit();
        }


        //check if the file download has completed every checkInterval ms
        setTimeout(checkFileDownloadComplete, settings.checkInterval);


        function checkFileDownloadComplete() {
            //has the cookie been written due to a file download occuring?

            var cookieValue = settings.cookieValue;
            if(typeof cookieValue == 'string') {
                cookieValue = cookieValue.toLowerCase();
            }

            var lowerCaseCookie = settings.cookieName.toLowerCase() + "=" + cookieValue;

            if (document.cookie.toLowerCase().indexOf(lowerCaseCookie) > -1) {

                //execute specified callback
                internalCallbacks.onSuccess(fileUrl);

                //remove cookie
                var cookieData = settings.cookieName + "=; path=" + settings.cookiePath + "; expires=" + new Date(0).toUTCString() + ";";
                if (settings.cookieDomain) cookieData += " domain=" + settings.cookieDomain + ";";
                document.cookie = cookieData;

                //remove iframe
                cleanUp(false);

                return;
            }

            //has an error occured?
            //if neither containers exist below then the file download is occuring on the current window
            if (downloadWindow || $iframe) {

                //has an error occured?
                try {

                    var formDoc = downloadWindow ? downloadWindow.document : getiframeDocument($iframe);

                    if (formDoc && formDoc.body !== null && formDoc.body.innerHTML.length) {

                        var isFailure = true;

                        if ($form && $form.length) {
                            var $contents = $(formDoc.body).contents().first();

                            try {
                                if ($contents.length && $contents[0] === $form[0]) {
                                    isFailure = false;
                                }
                            } catch (e) {
                                if (e && e.number == -2146828218) {
                                    // IE 8-10 throw a permission denied after the form reloads on the "$contents[0] === $form[0]" comparison
                                    isFailure = true;
                                } else {
                                    throw e;
                                }
                            }
                        }

                        if (isFailure) {
                            // IE 8-10 don't always have the full content available right away, they need a litle bit to finish
                            setTimeout(function () {
                                internalCallbacks.onFail(formDoc.body.innerHTML, fileUrl);
                                cleanUp(true);
                            }, 100);

                            return;
                        }
                    }
                }
                catch (err) {

                    //500 error less than IE9
                    internalCallbacks.onFail('', fileUrl, err);

                    cleanUp(true);

                    return;
                }
            }


            //keep checking...
            setTimeout(checkFileDownloadComplete, settings.checkInterval);
        }

        //gets an iframes document in a cross browser compatible manner
        function getiframeDocument($iframe) {
            var iframeDoc = $iframe[0].contentWindow || $iframe[0].contentDocument;
            if (iframeDoc.document) {
                iframeDoc = iframeDoc.document;
            }
            return iframeDoc;
        }

        function cleanUp(isFailure) {

            setTimeout(function() {

                if (downloadWindow) {

                    if (isAndroid) {
                        downloadWindow.close();
                    }

                    if (isIos) {
                        if (downloadWindow.focus) {
                            downloadWindow.focus(); //ios safari bug doesn't allow a window to be closed unless it is focused
                            if (isFailure) {
                                downloadWindow.close();
                            }
                        }
                    }
                }

                //iframe cleanup appears to randomly cause the download to fail
                //not doing it seems better than failure...
                //if ($iframe) {
                //    $iframe.remove();
                //}

            }, 0);
        }


        function htmlSpecialCharsEntityEncode(str) {
            return str.replace(htmlSpecialCharsRegEx, function(match) {
                return '&' + htmlSpecialCharsPlaceHolders[match];
        	});
        }
        var promise = deferred.promise();
        promise.abort = function() {
            cleanUp();
            $iframe.remove();
        };
        return promise;
    }
});

})(jQuery, this);

/*jslint browser: true*/
/*jslint jquery: true*/

/*
 * jQuery Hotkeys Plugin
 * Copyright 2010, John Resig
 * Dual licensed under the MIT or GPL Version 2 licenses.
 *
 * Based upon the plugin by Tzury Bar Yochay:
 * https://github.com/tzuryby/jquery.hotkeys
 *
 * Original idea by:
 * Binny V A, http://www.openjs.com/scripts/events/keyboard_shortcuts/
 */

/*
 * One small change is: now keys are passed by object { keys: '...' }
 * Might be useful, when you want to pass some other data to your handler
 */

(function(jQuery) {

  jQuery.hotkeys = {
    version: "0.2.0",

    specialKeys: {
      8: "backspace",
      9: "tab",
      10: "return",
      13: "return",
      16: "shift",
      17: "ctrl",
      18: "alt",
      19: "pause",
      20: "capslock",
      27: "esc",
      32: "space",
      33: "pageup",
      34: "pagedown",
      35: "end",
      36: "home",
      37: "left",
      38: "up",
      39: "right",
      40: "down",
      45: "insert",
      46: "del",
      59: ";",
      61: "=",
      96: "0",
      97: "1",
      98: "2",
      99: "3",
      100: "4",
      101: "5",
      102: "6",
      103: "7",
      104: "8",
      105: "9",
      106: "*",
      107: "+",
      109: "-",
      110: ".",
      111: "/",
      112: "f1",
      113: "f2",
      114: "f3",
      115: "f4",
      116: "f5",
      117: "f6",
      118: "f7",
      119: "f8",
      120: "f9",
      121: "f10",
      122: "f11",
      123: "f12",
      144: "numlock",
      145: "scroll",
      173: "-",
      186: ";",
      187: "=",
      188: ",",
      189: "-",
      190: ".",
      191: "/",
      192: "`",
      219: "[",
      220: "\\",
      221: "]",
      222: "'"
    },

    shiftNums: {
      "`": "~",
      "1": "!",
      "2": "@",
      "3": "#",
      "4": "$",
      "5": "%",
      "6": "^",
      "7": "&",
      "8": "*",
      "9": "(",
      "0": ")",
      "-": "_",
      "=": "+",
      ";": ": ",
      "'": "\"",
      ",": "<",
      ".": ">",
      "/": "?",
      "\\": "|"
    },

    // excludes: button, checkbox, file, hidden, image, password, radio, reset, search, submit, url
    textAcceptingInputTypes: [
      "text", "password", "number", "email", "url", "range", "date", "month", "week", "time", "datetime",
      "datetime-local", "search", "color", "tel"],

    // default input types not to bind to unless bound directly
    textInputTypes: /textarea|input|select/i,

    options: {
      filterInputAcceptingElements: true,
      filterTextInputs: true,
      filterContentEditable: true
    }
  };

  function keyHandler(handleObj) {
    if (typeof handleObj.data === "string") {
      handleObj.data = {
        keys: handleObj.data
      };
    }

    // Only care when a possible input has been specified
    if (!handleObj.data || !handleObj.data.keys || typeof handleObj.data.keys !== "string") {
      return;
    }

    var origHandler = handleObj.handler,
      keys = handleObj.data.keys.toLowerCase().split(" ");

    handleObj.handler = function(event) {
      //      Don't fire in text-accepting inputs that we didn't directly bind to
      if (this !== event.target &&
        (jQuery.hotkeys.options.filterInputAcceptingElements &&
          jQuery.hotkeys.textInputTypes.test(event.target.nodeName) ||
          (jQuery.hotkeys.options.filterContentEditable && jQuery(event.target).attr('contenteditable')) ||
          (jQuery.hotkeys.options.filterTextInputs &&
            jQuery.inArray(event.target.type, jQuery.hotkeys.textAcceptingInputTypes) > -1))) {
        return;
      }

      var special = event.type !== "keypress" && jQuery.hotkeys.specialKeys[event.which],
        character = String.fromCharCode(event.which).toLowerCase(),
        modif = "",
        possible = {};

      jQuery.each(["alt", "ctrl", "shift"], function(index, specialKey) {

        if (event[specialKey + 'Key'] && special !== specialKey) {
          modif += specialKey + '+';
        }
      });

      // metaKey is triggered off ctrlKey erronously
      if (event.metaKey && !event.ctrlKey && special !== "meta") {
        modif += "meta+";
      }

      if (event.metaKey && special !== "meta" && modif.indexOf("alt+ctrl+shift+") > -1) {
        modif = modif.replace("alt+ctrl+shift+", "hyper+");
      }

      if (special) {
        possible[modif + special] = true;
      }
      else {
        possible[modif + character] = true;
        possible[modif + jQuery.hotkeys.shiftNums[character]] = true;

        // "$" can be triggered as "Shift+4" or "Shift+$" or just "$"
        if (modif === "shift+") {
          possible[jQuery.hotkeys.shiftNums[character]] = true;
        }
      }

      for (var i = 0, l = keys.length; i < l; i++) {
        if (possible[keys[i]]) {
          return origHandler.apply(this, arguments);
        }
      }
    };
  }

  jQuery.each(["keydown", "keyup", "keypress"], function() {
    jQuery.event.special[this] = {
      add: keyHandler
    };
  });

})(jQuery || this.jQuery || window.jQuery);

/*global ActiveXObject, window, console, define, module, jQuery */
//jshint unused:false, strict: false

/*
    PDFObject v2.0.201604172
    https://github.com/pipwerks/PDFObject
    Copyright (c) 2008-2016 Philip Hutchison
    MIT-style license: http://pipwerks.mit-license.org/
    UMD module pattern from https://github.com/umdjs/umd/blob/master/templates/returnExports.js
*/

(function () {

    "use strict";
    //jshint unused:true

    //PDFObject is designed for client-side (browsers), not server-side (node)
    //Will choke on undefined navigator and window vars when run on server
    //Return boolean false and exit function when running server-side

    if (typeof window === "undefined" || typeof navigator === "undefined") { return false; }

    var pdfobjectversion = "2.0.201604172",
        supportsPDFs,

        //declare functions
        createAXO,
        isIE,
        supportsPdfMimeType = (typeof navigator.mimeTypes['application/pdf'] !== "undefined"),
        supportsPdfActiveX,
        buildFragmentString,
        log,
        embedError,
        embed,
        getTargetElement,
        generatePDFJSiframe,
        isIOS = (function () { return (/iphone|ipad|ipod/i.test(navigator.userAgent.toLowerCase())); })(),
        generateEmbedElement;


    /* ----------------------------------------------------
       Supporting functions
       ---------------------------------------------------- */

    createAXO = function (type) {
        var ax;
        try {
            ax = new ActiveXObject(type);
        } catch (e) {
            ax = null; //ensure ax remains null
        }
        return ax;
    };

    //IE11 still uses ActiveX for Adobe Reader, but IE 11 doesn't expose
    //window.ActiveXObject the same way previous versions of IE did
    //window.ActiveXObject will evaluate to false in IE 11, but "ActiveXObject" in window evaluates to true
    //so check the first one for older IE, and the second for IE11
    //FWIW, MS Edge (replacing IE11) does not support ActiveX at all, both will evaluate false
    //Constructed as a method (not a prop) to avoid unneccesarry overhead -- will only be evaluated if needed
    isIE = function () { return !!(window.ActiveXObject || "ActiveXObject" in window); };

    //If either ActiveX support for "AcroPDF.PDF" or "PDF.PdfCtrl" are found, return true
    //Constructed as a method (not a prop) to avoid unneccesarry overhead -- will only be evaluated if needed
    supportsPdfActiveX = function () { return !!(createAXO("AcroPDF.PDF") || createAXO("PDF.PdfCtrl")); };

    //Determines whether PDF support is available
    supportsPDFs = (supportsPdfMimeType || (isIE() && supportsPdfActiveX()));

    //Create a fragment identifier for using PDF Open parameters when embedding PDF
    buildFragmentString = function (pdfParams) {

        var string = "",
            prop;

        if (pdfParams) {

            for (prop in pdfParams) {
                if (pdfParams.hasOwnProperty(prop)) {
                    string += encodeURIComponent(prop) + "=" + encodeURIComponent(pdfParams[prop]) + "&";
                }
            }

            //The string will be empty if no PDF Params found
            if (string) {

                string = "#" + string;

                //Remove last ampersand
                string = string.slice(0, string.length - 1);

            }

        }

        return string;

    };

    log = function (msg) {
        if (typeof console !== "undefined" && console.log) {
            console.log("[PDFObject] " + msg);
        }
    };

    embedError = function (msg) {
        log(msg);
        return false;
    };

    getTargetElement = function (targetSelector) {

        //Default to body for full-browser PDF
        var targetNode = document.body;

        //If a targetSelector is specified, check to see whether
        //it's passing a selector, jQuery object, or an HTML element

        if (typeof targetSelector === "string") {

            //Is CSS selector
            targetNode = document.querySelector(targetSelector);

        } else if (typeof jQuery !== "undefined" && targetSelector instanceof jQuery && targetSelector.length) {

            //Is jQuery element. Extract HTML node
            targetNode = targetSelector.get(0);

        } else if (typeof targetSelector.nodeType !== "undefined" && targetSelector.nodeType === 1) {

            //Is HTML element
            targetNode = targetSelector;

        }

        return targetNode;

    };

    generatePDFJSiframe = function (targetNode, url, pdfOpenFragment, PDFJS_URL, id) {

        var fullURL = PDFJS_URL + "?file=" + encodeURIComponent(url) + pdfOpenFragment;
        var scrollfix = (isIOS) ? "-webkit-overflow-scrolling: touch; overflow-y: scroll; " : "overflow: hidden; ";
        var iframe = "<div style='" + scrollfix + "position: absolute; top: 0; right: 0; bottom: 0; left: 0;'><iframe  " + id + " src='" + fullURL + "' style='border: none; width: 100%; height: 100%;' frameborder='0'></iframe></div>";
        targetNode.className += " pdfobject-container";
        targetNode.style.position = "relative";
        targetNode.style.overflow = "auto";
        targetNode.innerHTML = iframe;
        return targetNode.getElementsByTagName("iframe")[0];

    };

    generateEmbedElement = function (targetNode, targetSelector, url, pdfOpenFragment, width, height, id) {

        var style = "";

        if (targetSelector && targetSelector !== document.body) {
            style = "width: " + width + "; height: " + height + ";";
        } else {
            style = "position: absolute; top: 0; right: 0; bottom: 0; left: 0; width: 100%; height: 100%;";
        }

        targetNode.className += " pdfobject-container";
        targetNode.innerHTML = "<embed " + id + " class='pdfobject' src='" + url + pdfOpenFragment + "' type='application/pdf' style='overflow: auto; " + style + "'/>";

        return targetNode.getElementsByTagName("embed")[0];

    };

    embed = function (url, targetSelector, options) {

        //Ensure URL is available. If not, exit now.
        if (typeof url !== "string") { return embedError("URL is not valid"); }

        //If targetSelector is not defined, convert to boolean
        targetSelector = (typeof targetSelector !== "undefined") ? targetSelector : false;

        //Ensure options object is not undefined -- enables easier error checking below
        options = (typeof options !== "undefined") ? options : {};

        //Get passed options, or set reasonable defaults
        var id = (options.id && typeof options.id === "string") ? "id='" + options.id + "'" : "",
            page = (options.page) ? options.page : false,
            pdfOpenParams = (options.pdfOpenParams) ? options.pdfOpenParams : {},
            fallbackLink = (typeof options.fallbackLink !== "undefined") ? options.fallbackLink : true,
            width = (options.width) ? options.width : "100%",
            height = (options.height) ? options.height : "100%",
            forcePDFJS = (typeof options.forcePDFJS === "boolean") ? options.forcePDFJS : false,
            PDFJS_URL = (options.PDFJS_URL) ? options.PDFJS_URL : false,
            targetNode = getTargetElement(targetSelector),
            fallbackHTML = "",
            pdfOpenFragment = "",
            fallbackHTML_default = "<p>This browser does not support inline PDFs. Please download the PDF to view it: <a href='[url]'>Download PDF</a></p>";

        //If target element is specified but is not valid, exit without doing anything
        if (!targetNode) { return embedError("Target element cannot be determined"); }


        //page option overrides pdfOpenParams, if found
        if (page) {
            pdfOpenParams.page = page;
        }

        //Stringify optional Adobe params for opening document (as fragment identifier)
        pdfOpenFragment = buildFragmentString(pdfOpenParams);

        //Do the dance
        if (forcePDFJS && PDFJS_URL) {

            return generatePDFJSiframe(targetNode, url, pdfOpenFragment, PDFJS_URL, id);

        } else if (supportsPDFs) {

            return generateEmbedElement(targetNode, targetSelector, url, pdfOpenFragment, width, height, id);

        } else {

            if (PDFJS_URL) {

                return generatePDFJSiframe(targetNode, url, pdfOpenFragment, PDFJS_URL, id);

            } else if (fallbackLink) {

                fallbackHTML = (typeof fallbackLink === "string") ? fallbackLink : fallbackHTML_default;
                targetNode.innerHTML = fallbackHTML.replace(/\[url\]/g, url);

            }

            return embedError("This browser does not support embedded PDFs");

        }

    };

    window.PDFObject = {
        embed: function (a, b, c) { return embed(a, b, c); },
        pdfobjectversion: (function () { return pdfobjectversion; })(),
        supportsPDFs: (function () { return supportsPDFs; })()
    };
})();
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
            ['search', ['search']],
            ['util', ['full']]
            //,
            //['refresh', ['refresh']]
        ],
        workzone:{
            layout: 'list'
        },
        ui: ['workzone', 'toolbar', 'navigation', 'statusbar', 'viewer', 'uploader'],
        kernel: ['store', 'history', 'clipboard']
    }

    docmana.commands = {};
    docmana.ui = {};
})();

(function () {

    "use strict";

    // polyfill
    if (typeof Object.create != 'function') {
        Object.create = (function () {
            var Temp = function () { };
            return function (prototype) {
                if (arguments.length > 1) {
                    throw Error('Second argument not supported');
                }
                if (prototype !== Object(prototype) && prototype !== null) {
                    throw TypeError('Argument must be an object or null');
                }
                if (prototype === null) {
                    return {};
                }
                Temp.prototype = prototype;
                var result = new Temp();
                Temp.prototype = null;
                return result;
            };
        })();
    }

    // underscore polyfill
    if (!_.remove) {
        _.remove = function (data, fn) {
            for (var i = data.length - 1; i > -1; i--) {
                var item = data[i];
                if (fn(item)) {
                    data.splice(i, 1);
                }
            }
        }
    }

    if (!_.orderBy) {
        _.orderBy = function (collection, iteratees, orders) {
            _.each(iteratees, function (iterate, i) {
                collection = _.sortBy(collection, function (item) {
                    return item[iterate];
                });
                if (orders[i] === 'desc') {
                    collection = collection.reverse();
                }
            });
            return collection;
        }
    }
    if (!_.upperFirst) {
        _.upperFirst = function (string) {
            return string.charAt(0).toUpperCase() + string.slice(1);
        }
    }
    if (!_.trim) {
        _.trim = String.prototype.trim || function () {
            return this.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, '');
        };
    }

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
        statusbar: function () {
            return this.main().ui.statusbar;
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

        },
        ieVersion: function () {
            var ua = window.navigator.userAgent;
            var msie = ua.indexOf("MSIE ");

            if (msie > 0 || !!navigator.userAgent.match(/Trident.*rv\:11\./))  // If Internet Explorer, return version number
            {
                return parseInt(ua.substring(msie + 5, ua.indexOf(".", msie)));
            }
            else  // If another browser, return false
            {
                return false;
            }
        }
    }

})();



'use strict';
window.docmana.templates = Object.create(null);
window.docmana.templates['breadcrumb.html'] = '<% _.forEach(data, function(item, i){ %>\n    <% if(i === data.length - 1){ %>\n    <li class="active">\n        <span>\n            <%- item.name %>\n        </span>\n    </li>\n    <% }else{ %>\n    <li>\n        <a href="#" data-hash="<%- item.hash %>">\n            <%- item.name %>\n        </a>\n    </li>\n    <% } %>\n<% }); %>';
window.docmana.templates['fileInfo.html'] = '<div class="docmana-file-info">\n    <div class="media center-block">\n        <div class="media-left file-type-large">\n            <span class="filetype <%- T.name2IconClass(data.name, data.mime) %>"></span>\n        </div>\n        <div class="media-body">\n            <h4 class="media-heading">\n                <%- data.name%>\n            </h4>\n            <p>\n            <p>\n                <%- L(\'fileType\') %>:\n                <%- L(\'kind\' + T.mime2Type(data.mime)) %>\n            </p>\n            <p>\n                <%- L(\'fileDateModified\') %>:\n                <%- T.formatDate(data.ts) %>\n            </p>\n            <p>\n                <%- L(\'fileSize\') %>:\n                <%- T.formatFileSize(data.size) %>\n            </p>\n            </p>\n        </div>\n    </div>\n</div>\n';
window.docmana.templates['main.html'] = '<div class="docmana-panel">\n    <div class="docmana-heading panel-heading">\n        <div class="docmana-toolbar btn-toolbar"></div>\n    </div>\n    <div class="docmana-body panel-body no-padding">\n        <div class="docmana-navigation clearfix"></div>\n        <div class="docmana-workzone"></div>\n    </div>\n    <div class="docmana-footer panel-footer">\n        <div class="docmana-statusbar clearfix"></div>\n    </div>\n</div>\n\n<div class="modal fade" id="modal-file" tabindex="-1" role="dialog">\n    <div class="modal-dialog modal-lg static" role="document">\n        <div class="modal-content docmana-viewer"></div>\n    </div>\n</div>\n<div class="modal fade" tabindex="-1" role="dialog">\n    <div class="modal-dialog" role="document">\n        <div class="modal-content docmana-uploader"></div>\n    </div>\n</div>';
window.docmana.templates['navigation.html'] = '<div class="nav-group"></div>\n<div class="breadcrumb-group form-control input-sm">\n    <ul class="docmana-breadcrumb breadcrumb no-margin"></ul>\n</div>\n<div class="search-group btn-toolbar"></div>\n<div class="refresh-group"></div>\n\n';
window.docmana.templates['statusbar.html'] = '<div class="status-text pull-left btn-sm"></div>\n<div class="pull-right btn-toolbar">\n    <div class="uploader btn-group"></div>\n    <div class="layout btn-group"></div>\n</div>';
window.docmana.templates['statusbarText.html'] = '<span class="text-total">\n    <%- data.count %>\n    <%- L(\'statusbarItems\') %>\n</span>\n<span class="text-selected">\n    <% if(data.selectedCount > 0){ %>\n    <%- L(\'statusbarSelectedItem\', data.selectedCount) %>\n\n    <span class="size">\n        <%- data.selectedSize %>\n    </span>\n    <% } %>\n</span>';
window.docmana.templates['toolbar.html'] = '<div class="right pull-right btn-toolbar">\n    \n</div>';
window.docmana.templates['toolbarBtn.html'] = '<button type="button" class="btn btn-default <%- data.name %>"\n        data-command="<%- data.name %>"\n        title="<%- L(\'cmd\' + _.upperFirst(data.name)) %> <%- data.shortcuts %>">\n    <i class="<%- data.icon %>"></i>\n</button>\n';
window.docmana.templates['toolbarBtnGroup.html'] = '<div class="btn-group btn-group-sm docmana-group-<%- data.name %>" role="group"></div>';
window.docmana.templates['toolbarBtnLayout.html'] = '<div class="btn-group btn-group-sm" data-toggle="buttons">\n    <label class="btn btn-default" title="<%- L(\'layoutList\') %>">\n        <input type="radio" name="layout" autocomplete="off" data-layout="list">\n        <i class="docmana-icon docmana-icon-listview"></i>\n    </label>\n    <label class="btn btn-default" title="<%- L(\'layoutLargeIcons\') %>">\n        <input type="radio" name="layout" autocomplete="off" data-layout="icons">\n        <i class="docmana-icon docmana-icon-iconsview"></i>\n    </label>\n</div>\n';
window.docmana.templates['toolbarBtnSort.html'] = '<div class="btn-group btn-group-sm <%- data.name %>">\n    <button type="button" class="btn btn-default dropdown-toggle"\n            data-toggle="dropdown" aria-haspopup="true"\n            aria-expanded="false"\n             title="<%- L(\'cmdSort\') %>">\n        <i class="<%- data.icon %>"></i>\n        <span class="caret"></span>\n    </button>\n    <ul class="dropdown-menu">\n        <li>\n            <a href="#" data-command="sort" data-field="name">\n                <i class=""></i>\n                <%- L(\'sortByName\') %>\n            </a>\n        </li>\n        <li>\n            <a href="#" data-command="sort" data-field="size">\n                <%- L(\'sortBySize\') %>\n            </a>\n        </li>\n        <li>\n            <a href="#" data-command="sort" data-field="mime">\n                <%- L(\'sortByType\') %>\n            </a>\n        </li>\n        <li>\n            <a href="#" data-command="sort" data-field="ts">\n                <%- L(\'sortByDate\') %>\n            </a>\n        </li>\n        <li role="separator" class="divider"></li>\n        <li>\n            <a href="#" data-command="sort" data-order="asc">\n                <%- L(\'sortAscending\') %>\n            </a>\n        </li>\n        <li>\n            <a href="#" data-command="sort" data-order="desc">\n                <%- L(\'sortDescending\') %>\n            </a>\n        </li>\n    </ul>\n</div>\n';
window.docmana.templates['toolbarBtnUpload.html'] = '<a class="btn btn-default <%- data.name %>" data-command="<%- data.name %>"\n    title="<%- L(\'cmd\' + _.upperFirst(data.name)) %>">\n    <i class="<%- data.icon %>"></i>\n    <form enctype="multipart/form-data" method="POST">\n        <input type="file" name="upload[]" multiple value="" />\n    </form>\n</a>';
window.docmana.templates['toolbarSearch.html'] = '<div class="form-inline">\n    <div class="form-group has-feedback">\n        <input type="text" class="form-control input-sm" \n               placeholder="<%- L(\'textSearch\') %>">\n        <span class="form-control-feedback" aria-hidden="true">\n            <i class="fa fa-search"></i>\n        </span>\n    </div>\n</div>';
window.docmana.templates['uploader.html'] = '<div class="modal-header">\n    <button type="button" class="close" data-dismiss="modal" aria-label="Close">\n        <span aria-hidden="true">&times;</span>\n    </button>\n    <h4 class="modal-title"><%- L(\'textFileUpload\') %></h4>\n</div>\n<div class="modal-body no-padding">\n    <div class="files list-group"></div>\n</div>\n<div class="modal-footer clearfix">\n    <button type="button" class="btn btn-default btn-sm" data-dismiss="modal">\n        <%- L(\'textClose\') %>\n    </button>\n</div>';
window.docmana.templates['uploaderFiles.html'] = '        <% for (var i=0, file; file= data.files[i]; i++) { %>\n<div class="file-upload file">\n    <span class="list-group-item holder">.</span>\n    <div class="progress">\n        <div class="progress-bar progress-bar-info" style="width: 0"></div>\n    </div>\n    <div class="info list-group-item clearfix">\n        <div class="table-row">\n            <div class="name table-column">\n                <%- file.name %>\n            </div>\n            <div class="size table-column">\n                Processing...\n            </div>\n            <!--<div class="folder pull-left">\n        我的文件\n    </div>-->\n            <div class="status table-column">\n                <!--<i class="fa fa-check-circle text-success"></i>-->\n                <span class="percent"></span>\n                <span class="error"></span>\n            </div>\n            <div class="operator table-column">\n                <% if (!i && !data.options.autoUpload) { %>\n                <button class="btn btn-primary btn-sm start" disabled>\n                    <i class="fa fa-upload"></i>\n                </button>\n                <% } %>\n                <% if (!i) { %>\n                <button class="btn btn-link btn-warning btn-xs cancel">\n                    <i class="fa fa-ban"></i>\n                </button>\n                <% } %>\n            </div>\n        </div>\n    </div>\n</div>\n        <% } %>\n';
window.docmana.templates['uploaderTrigger.html'] = '<div class="btn-uploader btn-group-sm" style="position:relative;"  title="<%- L(\'textFileUpload\') %>">\n    <button class="btn btn-default btn-sm">\n        <i class="fa fa-tasks"></i>\n    </button>\n    <span class="badge badge-notify"></span>\n</div>';
window.docmana.templates['viewer.html'] = '<div class="modal-header">\n    <button type="button" class="close" data-dismiss="modal" aria-label="Close">\n        <span aria-hidden="true">&times;</span>\n    </button>\n    <h4 class="modal-title">�ļ�</h4>\n</div>\n<div class="modal-body no-padding docmana-viewer-body">\n\n</div>\n<div class="modal-footer clearfix">\n    <button type="button" class="btn btn-default"\n            title="<%- L(\'cmdDownload\') %>"\n            data-action="download">\n        <i class="docmana-icon docmana-icon-download"></i>\n    </button>\n    <button type="button" class="btn btn-default"\n            title="<%- L(\'textPreviousItem\') %>"\n            data-action="previous">\n        <i class="docmana-icon docmana-icon-back"></i>\n    </button>\n    <button type="button"\n            class="btn btn-default"\n            data-action="next"\n            title="<%- L(\'textNextItem\') %>">\n        <i class="docmana-icon docmana-icon-forward"></i>\n    </button>\n</div>';
window.docmana.templates['workzoneIconsView.html'] = '<div class="icons-view docmana-workzone-view clearfix">\n</div>\n';
window.docmana.templates['workzoneIconsViewItem.html'] = '<div id="<%- data.hash %>"\n     title="<%= T.fileMetadata(data) %>"\n     class="drag-block file-list-item <%- T.mime2Class(data.mime) %>"\n     data-name="<%- data.name %>">\n    <div class="filetype <%- T.name2IconClass(data.name, data.mime)%> drag-block"></div>\n    <div class="filename drag-block" title="<%- data.name %>">\n        <%- data.name %>\n    </div>\n</div>\n';
window.docmana.templates['workzoneListView.html'] = '<div class="list-view">\n    <div class="datatable-header panel panel-default">\n        <table class="table table-bordered table-condensed no-margin">\n            <colgroup>\n                <col />\n                <col style="width:135px;" />\n                <col style="width:135px;" />\n                <col style="width:90px;" />\n            </colgroup>\n            <thead>\n                <tr>\n                    <th><%- L(\'fileName\') %></th>\n                    <th><%- L(\'fileDateModified\') %></th>\n                    <th><%- L(\'fileType\') %></th>\n                    <th><%- L(\'fileSize\') %></th>\n                </tr>\n            </thead>\n        </table>\n    </div>\n    <div class="datatable-content">\n        <table class="table table-condensed no-margin">\n            <colgroup>\n                <col />\n                <col style="width:135px;" />\n                <col style="width:135px;" />\n                <col style="width:90px;" />\n            </colgroup>\n            <tbody class="docmana-workzone-view"></tbody>\n        </table>\n    </div>\n</div>\n';
window.docmana.templates['workzoneListViewItem.html'] = '<tr id="<%- data.hash %>"\n    class="file-list-item <%- T.mime2Class(data.mime) %>"\n    data-name="<%- data.name %>">\n    <td class="name">\n        <span title="<%= T.fileMetadata(data) %>">\n            <span class="filetype <%- T.name2IconClass(data.name, data.mime) %> drag-block"></span>\n            <span class="filename drag-block">\n                <%- data.name %>\n            </span>\n        </span>\n\n    </td>\n    <td class="metadata date text-muted">\n        <span class="drag-block">\n            <%- T.formatDate(data.ts) %>\n        </span>\n    </td>\n    <td class="metadata type text-muted">\n        <span class="drag-block">\n            <%- L(\'kind\' + T.mime2Type(data.mime)) %>\n        </span>\n    </td>\n    <td class="metadata size text-muted">\n        <span class="drag-block">\n            <%- data.mime === \'directory\' ? \'\' : T.formatFileSize(data.size, true) %>\n        </span>\n    </td>\n</tr>\n';

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
            var cmd = this.command(name);
            if (cmd) {
                cmd.exec.apply(cmd, args);
            }
        },
        focus: function () {
            this.$el.focus();
        },
        startup: function () {
            var a = this.$el[0].outerWidth;
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


(function () {

    "use strict";

    var Clipboard = docmana.ComponentBase.extend({
        init: function (options) {
            this._data = [];
            this.isCut = 0;
        },
        listen: function () {
           // this.listenTo()
        },
        data: function (data, empty) {
            if (data != null && (empty || data.length > 0)) {
                this._data = data;
                this.trigger('change', this._data);
            }
            return this._data;
        },
        cut: function (data) {
            this.isCut = 1;
            this.data(data);
        },
        copy: function (data) {
            this.isCut = 0;
            this.data(data);
        },
        paste: function () {
            if (this.isEmpty()) return;

            var that = this;
            var targets = this.getIds();
            var destDir = this.store().cwd().hash;
            var srcDir = this.getSrcDir();

            // 复制可无限粘贴，剪切则不能
            // TODO: 当出现同名文件时，弹出对话框让用户选择，使用 deferred
            if (this.isCut) {
                this.store().moveTo(destDir, targets, srcDir).done(function () {
                    that.empty();
                });
            } else {
                this.store().copyTo(srcDir, destDir, targets);
            }
        },
        empty: function () {
            this.data([], true);
        },
        getSrcDir: function () {
            return this._data[0].phash;
        },
        getIds: function () {
            return _.map(this.data(), function (item) {
                return item.hash;
            });
        },
        isEmpty: function () {
            return this.data().length === 0;
        }

    });

    docmana.clipboard = function (options) {
        return new Clipboard(options);
    }

})();


(function () {

    "use strict";

    var History = docmana.ComponentBase.extend({
        init: function (options) {
            this.position = null;
            this._data = [];
        },
        listen: function () {
            this.listenTo(this.main().store, 'cwdChange', function () {
                var cwd = this.main().store.cwd();
                var idx = _.findIndex(this._data, function (item) {
                    return item.hash === cwd.hash;
                });
                if (idx < 0) {
                    this.add(cwd);
                    this.position = this._data.length - 1;
                } else {
                    this.position = idx;
                }

                this.trigger('change', this._data);
            });
        },
        byId: function (id) {
            return _.find(this._data, function(item) {
                return item.hash === id;
            });
        },
        getPath: function () {
            return this._data.slice(0, this.position + 1);
        },
        add: function (item) {

            if (this.position < this._data.length - 1) {
                this._data.splice(this.position + 1, this._data.length - 1 - this.position);
            }
            this._data.push(item);
        },
        forward: function () {
            if (this.canForward()) {
                this.position = this.position + 1;
                this.triggerOpen();
            }
        },
        getCurrHash: function () {
            var data = this._data[this.position];
            return data != null ? data.hash : data;
        },
        back: function () {
            if (this.canBack()) {
                this.position = this.position - 1;
                this.triggerOpen();
            }
        },
        triggerOpen: function () {
            this.main().store.open(this.getCurrHash());
        },
        canForward: function () {
            return this.position + 1 < this._data.length;
        },
        canBack: function () {
            return this._data.length >= 2 && this.position !== 0;
        },

        // TODO: 存储到 localstorage
        storeHistory: function () {

        },
        restoreHistory: function () {

        }

    });

    docmana.history = function (options) {
        return new History(options);
    }

})();


(function () {

    "use strict";

    docmana.mimeTypes = {
        'unknown': 'Unknown',
        'directory': 'Folder',
        'symlink': 'Alias',
        'symlink-broken': 'AliasBroken',
        'application/x-empty': 'TextPlain',
        'application/postscript': 'Postscript',
        'application/vnd.ms-office': 'MsOffice',
        'application/msword': 'MsWord',
        'application/vnd.ms-word': 'MsWord',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'MsWord',
        'application/vnd.ms-word.document.macroEnabled.12': 'MsWord',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.template': 'MsWord',
        'application/vnd.ms-word.template.macroEnabled.12': 'MsWord',
        'application/vnd.ms-excel': 'MsExcel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': 'MsExcel',
        'application/vnd.ms-excel.sheet.macroEnabled.12': 'MsExcel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.template': 'MsExcel',
        'application/vnd.ms-excel.template.macroEnabled.12': 'MsExcel',
        'application/vnd.ms-excel.sheet.binary.macroEnabled.12': 'MsExcel',
        'application/vnd.ms-excel.addin.macroEnabled.12': 'MsExcel',
        'application/vnd.ms-powerpoint': 'MsPP',
        'application/vnd.openxmlformats-officedocument.presentationml.presentation': 'MsPP',
        'application/vnd.ms-powerpoint.presentation.macroEnabled.12': 'MsPP',
        'application/vnd.openxmlformats-officedocument.presentationml.slideshow': 'MsPP',
        'application/vnd.ms-powerpoint.slideshow.macroEnabled.12': 'MsPP',
        'application/vnd.openxmlformats-officedocument.presentationml.template': 'MsPP',
        'application/vnd.ms-powerpoint.template.macroEnabled.12': 'MsPP',
        'application/vnd.ms-powerpoint.addin.macroEnabled.12': 'MsPP',
        'application/vnd.openxmlformats-officedocument.presentationml.slide': 'MsPP',
        'application/vnd.ms-powerpoint.slide.macroEnabled.12': 'MsPP',
        'application/pdf': 'PDF',
        'application/xml': 'XML',
        'application/vnd.oasis.opendocument.text': 'OO',
        'application/vnd.oasis.opendocument.text-template': 'OO',
        'application/vnd.oasis.opendocument.text-web': 'OO',
        'application/vnd.oasis.opendocument.text-master': 'OO',
        'application/vnd.oasis.opendocument.graphics': 'OO',
        'application/vnd.oasis.opendocument.graphics-template': 'OO',
        'application/vnd.oasis.opendocument.presentation': 'OO',
        'application/vnd.oasis.opendocument.presentation-template': 'OO',
        'application/vnd.oasis.opendocument.spreadsheet': 'OO',
        'application/vnd.oasis.opendocument.spreadsheet-template': 'OO',
        'application/vnd.oasis.opendocument.chart': 'OO',
        'application/vnd.oasis.opendocument.formula': 'OO',
        'application/vnd.oasis.opendocument.database': 'OO',
        'application/vnd.oasis.opendocument.image': 'OO',
        'application/vnd.openofficeorg.extension': 'OO',
        'application/x-shockwave-flash': 'AppFlash',
        'application/flash-video': 'Flash video',
        'application/x-bittorrent': 'Torrent',
        'application/javascript': 'JS',
        'application/rtf': 'RTF',
        'application/rtfd': 'RTF',
        'application/x-font-ttf': 'TTF',
        'application/x-font-otf': 'OTF',
        'application/x-rpm': 'RPM',
        'application/x-web-config': 'TextPlain',
        'application/xhtml+xml': 'HTML',
        'application/docbook+xml': 'DOCBOOK',
        'application/x-awk': 'AWK',
        'application/x-gzip': 'GZIP',
        'application/x-bzip2': 'BZIP',
        'application/x-xz': 'XZ',
        'application/zip': 'ZIP',
        'application/x-zip': 'ZIP',
        'application/x-rar': 'RAR',
        'application/x-tar': 'TAR',
        'application/x-7z-compressed': '7z',
        'application/x-jar': 'JAR',
        'text/plain': 'TextPlain',
        'text/x-php': 'PHP',
        'text/html': 'HTML',
        'text/javascript': 'JS',
        'text/css': 'CSS',
        'text/rtf': 'RTF',
        'text/rtfd': 'RTF',
        'text/x-c': 'C',
        'text/x-csrc': 'C',
        'text/x-chdr': 'CHeader',
        'text/x-c++': 'CPP',
        'text/x-c++src': 'CPP',
        'text/x-c++hdr': 'CPPHeader',
        'text/x-shellscript': 'Shell',
        'application/x-csh': 'Shell',
        'text/x-python': 'Python',
        'text/x-java': 'Java',
        'text/x-java-source': 'Java',
        'text/x-ruby': 'Ruby',
        'text/x-perl': 'Perl',
        'text/x-sql': 'SQL',
        'text/xml': 'XML',
        'text/x-comma-separated-values': 'CSV',
        'text/x-markdown': 'Markdown',
        'image/x-ms-bmp': 'BMP',
        'image/jpeg': 'JPEG',
        'image/gif': 'GIF',
        'image/png': 'PNG',
        'image/tiff': 'TIFF',
        'image/x-targa': 'TGA',
        'image/vnd.adobe.photoshop': 'PSD',
        'image/xbm': 'XBITMAP',
        'image/pxm': 'PXM',
        'audio/mpeg': 'AudioMPEG',
        'audio/midi': 'AudioMIDI',
        'audio/ogg': 'AudioOGG',
        'audio/mp4': 'AudioMPEG4',
        'audio/x-m4a': 'AudioMPEG4',
        'audio/wav': 'AudioWAV',
        'audio/x-mp3-playlist': 'AudioPlaylist',
        'video/x-dv': 'VideoDV',
        'video/mp4': 'VideoMPEG4',
        'video/mpeg': 'VideoMPEG',
        'video/x-msvideo': 'VideoAVI',
        'video/quicktime': 'VideoMOV',
        'video/x-ms-wmv': 'VideoWM',
        'video/x-flv': 'VideoFlash',
        'video/x-matroska': 'VideoMKV',
        'video/ogg': 'VideoOGG'
    };

})();


(function () {

    "use strict";

    docmana.resources = {};

    docmana.resource = function () {
        var resource = docmana.resources[docmana.lang];
        var args = _.toArray(arguments);
        var name = args.shift();
        var r = resource[name];
        if (r == null) {
            return name;
        }
        args.unshift(r);
        return docmana.utils.formatString.apply(docmana.utils, args);
    }

})();
(function () {

    "use strict";

    var Store = docmana.ComponentBase.extend({
        init: function (options) {
            this._data = [];
            this._sortBy = {
                field: 'name',
                order: 'asc'
            };
            this._cwd = null;
        },
        data: function (data) {
            if (data != null) {
                this._data = data;
            }
            return this._data;
        },
        cwdData: function () {
            var parentHash = this.cwd().hash;

            return _.filter(this._data, function (f) {
                return f.phash === parentHash;
            });
        },
        url: function (name) {
            return this.props.url;
        },
        cwd: function () {
            return this._cwd;
        },
        byId: function (id) {
            return _.find(this._data, function (item) {
                return item.hash === id;
            });
        },
        byName: function (name) {
            return _.find(this._data, function (item) {
                return item.name === name;
            });
        },
        byIds: function (ids) {
            var that = this;
            return _.compact(_.map(ids, function (id) {
                return that.byId(id);
            }));
        },
        listen: function () {
            this.listenTo(this, 'sync', function (resp, request) {
                if (resp.added) {
                    this._data = this._data.concat(resp.added);
                }
                if (resp.removed) {
                    _.remove(this._data, function (n) {
                        return (_.findIndex(resp.removed, function (r) {
                            return n.hash === r;
                        }) >= 0);
                    });
                }
                if (resp.files) {
                    this._data = resp.files;
                }
                if (resp.cwd) {
                    if (this._cwd == null || this._cwd.hash !== resp.cwd.hash) {
                        this._cwd = resp.cwd;
                        this.trigger('cwdChange', this.cwd());
                    }
                }

                this.cleanData();

                //TODO: 在更新界面前必须要进行排序
                this.sortBy();
                this.update(request);
            });
        },
        cleanData: function () {
            // 移除未保存的数据
            _.remove(this._data, function (d) {
                return d.isNew;
            });
        },
        // 排序
        sortBy: function (field, order, folderFirst) {
            if (field != null) {
                this._sortBy.field = field;
            }
            if (order != null) {
                this._sortBy.order = order;
            }
            if (folderFirst == null) { folderFirst = true; }

            if (folderFirst) {
                var groups = _.groupBy(this._data, function (item) {
                    return item.mime === 'directory';
                });
                groups['true'] = this._baseSortBy(groups['true']);
                groups['false'] = this._baseSortBy(groups['false']);

                this._data = groups['true'].concat(groups['false']);
            } else {
                this._data = this._baseSortBy(this._data);
            }

            this.trigger('sort', this._sortBy);
            return this;
        },
        update: function (eventData) {
            eventData || (eventData = {});
            this.trigger('update', this._data, eventData);
        },
        _baseSortBy: function (list) {
            var field = this._sortBy.field;
            var order = this._sortBy.order;

            if (field === 'name') {
                field = function (item) {
                    return item.name.toLowerCase();
                };
            }
            return _.orderBy(list, [field], [order]);
        },
        mkdir: function (name, target) {
            return this.post({
                cmd: 'mkdir',
                target: target,
                name: name
            });
        },
        // 重命名
        rename: function (name, target) {
            return this.post({
                cmd: 'rename',
                name: name,
                target: target
            });
        },
        // 移动
        moveTo: function (destDir, targets, srcDir) {
            srcDir || (srcDir = this.cwd().hash);
            return this.paste(srcDir, destDir, targets, 1);
        },
        // 复制
        copyTo: function (srcDir, destDir, targets) {
            return this.paste(srcDir, destDir, targets, 0);
        },
        // 打开
        open: function (target, isInit) {
            var that = this;
            return this.fetch({
                cmd: 'open',
                target: target,
                init: isInit
            });
        },
        // 搜索
        search: function (target, q) {
            return this.fetch({
                cmd: 'search',
                target: target,
                q: q
            });
        },
        content: function (target) {
            var that = this;
            return this.getJSON({
                cmd: 'get',
                target: target
            });
        },
        // 粘贴
        paste: function (srcDir, destDir, targets, isCut) {
            if (srcDir === destDir) {
                return this.duplicate(targets);
            }

            return this.post({
                cmd: 'paste',
                cut: isCut,
                dst: destDir,
                src: srcDir,
                targets: targets
            });
        },
        // 副本
        duplicate: function (targets) {
            return this.post({
                cmd: 'duplicate',
                targets: targets
            });
        },
        // 上传
        upload: function ($form) {
            var that = this;
            return $form.ajaxSubmit({
                url: this.url(),
                dataType: "json",
                data: this.uploadParams(),
                success: function (resp) {
                    that.trigger('sync', resp);
                }
            });
        },
        uploadParams: function() {
            return this._getRequestParams({
                cmd: 'upload',
                target: this.cwd().hash
            });
        },
        // 删除
        rm: function (targets) {
            return this.post({
                cmd: 'rm',
                targets: targets
            });
        },
        _getRequestParams: function (data) {
            return $.extend({}, this.props.requestData, data);
        },
        request: function (method, data, sync) {
            var that = this;
            var params = this._getRequestParams(data);
            if (sync == null) sync = true;
            return $.ajax({
                url: this.url(),
                type: method,
                data: params,
                //contentType: "application/json; charset=utf-8",
                dataType: "json"
            }).fail(function (xhr, resp, x, xx) {
                that.trigger('syncFail', resp);
            }).done(function (resp) {
                if (sync) {
                    that.trigger('sync', resp, params);
                }
            }).always(function (resp) {
               // console.log(resp);
            });
        },
        getJSON: function (data) {
            return this.request('get', data, false);
        },
        // 获取文件Url
        fileUrl: function (target, download) {
            if (download == null) download = 0;
            var params = this._getRequestParams({
                cmd: 'file',
                target: target,
                download: download
            });
            return this.url() + '?' + $.param(params);
        },
        fetch: function (data) {
            return this.request('get', data);
        },
        get: function (data) {
            return this.request('get', data);
        },
        post: function (data) {
            return this.request('post', data);
        }

    });

    docmana.store = function (options) {
        return new Store(options);
    }

})();


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



(function () {

    "use strict";

    var Cmd = docmana.CommandBase.extend({
        init: function (options) {
            this.name = 'back';
            this.templateName = 'toolbarBtn';
            this.shortcuts = 'Alt+Left';
        },
        listen: function(){
            this.listenTo(this.main().store, 'update', function () {
                this.setState();
            });
        },
        canExec: function() {
            return this.main().history.canBack();
        },
        exec: function() {
            return this.main().history.back();
        }
    });

    docmana.commands.back = function (options) {
        return new Cmd(options);
    }

})();


(function () {

    "use strict";

    var commandName = 'copy';

    var Cmd = docmana.CommandBase.extend({
        init: function (options) {
            this.name = commandName;
            this.templateName = 'toolbarBtn';
            this.enabledWhen = 'selected';
            this.shortcuts = 'Ctrl+C';
        },
        exec: function () {
            var selected = this.store().byIds(this.workzone().getIds());
            this.main().clipboard.copy(selected);
        }
    });

    docmana.commands[commandName] = function (options) {
        return new Cmd(options);
    }

})();


(function () {

    "use strict";

    var commandName = 'cut';

    var Cmd = docmana.CommandBase.extend({
        init: function (options) {
            this.name = commandName;
            this.templateName = 'toolbarBtn';
            this.enabledWhen = 'selected';
            this.shortcuts = 'Ctrl+X';
        },
        exec: function () {
            // 更改剪切时状态
            var workzone = this.workzone();
            workzone.$('.file-list-item.cut').removeClass('cut');
            workzone.select().addClass('cut');

            var selected = this.store().byIds(workzone.getIds());
            this.main().clipboard.cut(selected);
        }
    });

    docmana.commands[commandName] = function (options) {
        return new Cmd(options);
    }

})();


(function () {

    "use strict";

    var commandName = 'download';

    var Cmd = docmana.CommandBase.extend({
        init: function (options) {
            this.name = commandName;
            this.templateName = 'toolbarBtn';
            this.enabledWhen = 'selectedFiles';
        },
        _filteredIds: function () {
            var selected = this.workzone().getIds();
            var that = this;
            var filtered = _.filter(selected, function (id) {
                return that.store().byId(id).mime !== 'directory';
            });
            return filtered;
        },

        canExec: function () {
            var selected = this.workzone().getIds();
            if (selected.length === 0) return false;
            var that = this;
            return _.every(selected, function (id) {
                return that.store().byId(id).mime !== 'directory';
            });
        },
        exec: function () {
            var ids = this._filteredIds();
            var that = this;
            _.forEach(ids, function (id) {
                var url = that.store().fileUrl(id, 1);
                $.fileDownload(url);
            });
        }
    });

    docmana.commands[commandName] = function (options) {
        return new Cmd(options);
    }

})();


(function () {

    "use strict";

    var commandName = 'duplicate';

    var Cmd = docmana.CommandBase.extend({
        init: function (options) {
            this.name = commandName;
            this.templateName = 'toolbarBtn';
            this.enabledWhen = 'selected';
        },
        exec: function () {
            var targets = this.workzone().getIds();
            this.store().duplicate(targets);
        }
    });

    docmana.commands[commandName] = function (options) {
        return new Cmd(options);
    }

})();


(function () {

    "use strict";

    var Cmd = docmana.CommandBase.extend({
        init: function (options) {
            this.name = 'forward';
            this.templateName = 'toolbarBtn';
            this.shortcuts = 'Alt+Right';
        },
        listen: function () {
            this.listenTo(this.main().store, 'update', function () {
                this.setState();
            });
        },
        canExec: function () {
            return this.main().history.canForward();
        },
        exec: function () {
            return this.main().history.forward();
        }
    });

    docmana.commands.forward = function (options) {
        return new Cmd(options);
    }

})();


(function () {

    "use strict";

    var commandName = 'full';

    var Cmd = docmana.CommandBase.extend({
        init: function (options) {
            this.name = commandName;
            this.templateName = 'toolbarBtn';
            this.enabledWhen = null;

            this.viewLayout = this.props.viewLayout;
        },
        defaults: {
            viewLayout: 'normal' // 'fullscreen'
        },
        listen: function () {
            this.listenTo(this, 'rendered', function() {
                this._setDisplay();
            });
        },
        _getReverse: function () {
            var curr = this.viewLayout;
            return curr === 'normal' ? 'fullscreen' : 'normal';
        },
        _setDisplay: function () {
            var curr = this.viewLayout;

            this.$el.find('.docmana-icon').removeClass('docmana-icon-' + this._getReverse())
                .addClass('docmana-icon-' + curr);


        },
        toggle: function (vl) {
            this.viewLayout = this._getReverse();
            this._setDisplay();

            if (this.viewLayout === 'fullscreen') {
                this.main().$el.addClass('fixed');
                $('body').addClass('overflow-hidden');
            } else {
                this.main().$el.removeClass('fixed');
                $('body').removeClass('overflow-hidden');
            }

        },
        exec: function (options) {
            this.toggle();
        }
    });

    docmana.commands[commandName] = function (options) {
        return new Cmd(options);
    }

})();


(function () {

    "use strict";

    var commandName = 'layout';

    var Cmd = docmana.CommandBase.extend({
        init: function (options) {
            this.name = commandName;
            this.templateName = 'toolbarBtnLayout';
            this.enabledWhen = null;
        },
        exec: function () {
            var layout = this.$element().find('input[type=radio]:checked').data('layout');
            this.workzone().changeLayout(layout);
        },
        listenUI: function () {
            // 初始按钮状态，在绑定 change 之前，否则会触发不必要的 change 事件
            var currLayout = this.workzone().layout;
            this.$element().find('[data-layout=' + currLayout + ']').closest('.btn').button('toggle');

            var that = this;
            // 不能直接触发 data-action，暂时没去找原因，因此监听 change 事件
            this.$el.on('change', function (e) {
                that.exec();
            });

        }
    });

    docmana.commands[commandName] = function (options) {
        return new Cmd(options);
    }

})();


(function () {

    "use strict";

    var commandName = 'mkdir';
    var counter = 0;

    var Cmd = docmana.CommandBase.extend({
        init: function (options) {
            this.name = commandName;
            this.templateName = 'toolbarBtn';
            this.shortcuts = 'Alt+N';
            this.exec = _.debounce(_.bind(this.exec, this), 500);
        },
        _generateName: function () {
            var str = ' ' + docmana.resource('new folder');
            return counter === 0 ? str : str + ' ' + counter;
        },
        _generateUsableName: function () {
            var name = null;
            var exist = true;
            while (exist) {
                name = this._generateName();
                exist = this.store().byName(name) != null;
                counter++;
            }
            return name;
        },
        shortcutExec: function () {
            if (this.canExec()) {
                this._exec();
            }
        },
        _exec: function () {
            var that = this;
            var cwd = this.store().cwd();
            if (!cwd) return;

            var target = cwd.hash;
            var name = this._generateUsableName();
            that.store().mkdir(name, target).done(function () {
                that.workzone().select(that.workzone().$items().first());
                that.main().exec('rename');
            });
        },
        exec: function () {
            this._exec();
        }
    });

    docmana.commands[commandName] = function (options) {
        return new Cmd(options);
    }

})();


(function () {

    "use strict";

    var commandName = 'mkfile';

    var Cmd = docmana.CommandBase.extend({
        init: function (options) {
            this.name = commandName;
            this.templateName = 'toolbarBtn';
        }
    });

    docmana.commands[commandName] = function (options) {
        return new Cmd(options);
    }

})();


"use strict";

(function () {

    var commandName = 'open';

    var Cmd = docmana.CommandBase.extend({
        init: function (options) {
            this.name = commandName;
            this.templateName = 'toolbarBtn';
            this.enabledWhen = 'single';
            this.shortcuts = 'Return';
        },
        exec: function (info) {

            if (info == null || info.mime == null) {
                var id = this.workzone().select().attr('id');
                info = this.store().byId(id);
            }
            if (info == null) return;
            // 文件夹，则打开
            if (info.mime === 'directory') {
                this.store().open(info.hash);
            } else {
                var viewer = this.main().ui.viewer;
                if (viewer) {
                    viewer.callout();
                }
               // this.store().content(info.hash);
            }
            // TODO: 文件类型，则查看，如果未提供查看器，则弹出提示，并提供下载链接
        }
    });

    docmana.commands[commandName] = function (options) {
        return new Cmd(options);
    }

})();


(function () {

    "use strict";

    var commandName = 'paste';

    var Cmd = docmana.CommandBase.extend({
        init: function (options) {
            this.name = commandName;
            this.templateName = 'toolbarBtn';
            this.shortcuts = 'Ctrl+V';
        },
        exec: function () {
            this.clipboard().paste();
        },
        listenUI: function () {
            this.listenTo(this.main().clipboard, 'change', function () {
                this.setState();
            });
        },
        canExec: function () {
            if (this.main().clipboard.isEmpty()) return false;

            return true;
        }
    });

    docmana.commands[commandName] = function (options) {
        return new Cmd(options);
    }

})();


(function () {

    "use strict";

    var commandName = 'refresh';

    var Cmd = docmana.CommandBase.extend({
        init: function (options) {
            this.name = commandName;
            this.templateName = 'toolbarBtn';
            this.shortcuts = 'F5';
        },
        exec: function () {
            var target = this.store().cwd().hash;
            this.store().open(target, 0);
        }
    });

    docmana.commands[commandName] = function (options) {
        return new Cmd(options);
    }

})();


(function () {

    "use strict";

    var commandName = 'rename';

    var Cmd = docmana.CommandBase.extend({
        init: function (options) {
            this.name = commandName;
            this.templateName = 'toolbarBtn';
            this.enabledWhen = 'single';
            this.shortcuts = 'F2';
        },
        exec: function () {
            var that = this;
            this.workzone().editItemName(function (name) {
                var id = that.workzone().getIds()[0];
                that.store().rename(name, id).done(function () {
                    that.main().focus();
                });
            });
        }
    });

    docmana.commands[commandName] = function (options) {
        return new Cmd(options);
    }

})();


(function () {

    "use strict";

    var commandName = 'rm';

    var Cmd = docmana.CommandBase.extend({
        init: function (options) {
            this.name = commandName;
            this.templateName = 'toolbarBtn';
            this.enabledWhen = 'selected';
            this.shortcuts = 'Del';
        },
        exec: function () {
            var ids = this.workzone().getIds();
            if (ids.length > 0) {
                var that = this;
                docmana.ui.notify.confirm(function () {
                    that.store().rm(ids);
                });
            }
           
           
        }
    });

    docmana.commands[commandName] = function (options) {
        return new Cmd(options);
    }

})();


(function () {

    "use strict";

    var commandName = 'search';

    var Cmd = docmana.CommandBase.extend({
        init: function(options) {
            this.name = commandName;
            this.templateName = 'toolbarSearch';
        },
        exec: function() {
            var q = _.trim(this.$input().val());
            if (q === "" || q == null) return;
            var target = this.store().cwd().hash;
            this.store().search(target, q);
        },
        $input: function() {
            return this.$element().find('input');
        },
        listen: function () {
            this.listenTo(this, 'rendered', function () {
                var that = this;
                this.$el.on('keydown', function (e) {
                    if (e.which === 13) {
                        e.preventDefault();
                        that.exec();
                    }
                });
                this.$input().clearIt({
                    callback: function () {
                        var target = that.store().cwd().hash;
                        that.store().open(target);
                    }
                });
            });
        }
    });

    docmana.commands[commandName] = function (options) {
        return new Cmd(options);
    }

})();


(function () {

    "use strict";

    var commandName = 'sort';

    var Cmd = docmana.CommandBase.extend({
        init: function (options) {
            this.name = commandName;
            this.templateName = 'toolbarBtnSort';
            this.enabledWhen = null;
        },
        setState: function () {
            var $el = this.$element();
            var sortBy = this.store()._sortBy;
            $el.find('.active').removeClass('active');
            $el.find('[data-field=' + sortBy.field + ']').addClass('active');
            $el.find('[data-order=' + sortBy.order + ']').addClass('active');
        },
        listenUI: function () {
            this.listenTo(this.store(), 'sort', function (sortBy) {
                this.setState();
            });
        },
        exec: function (options) {
            options || (options = {});

            this.store().sortBy(options.field, options.order);
            this.store().update();
        }
    });

    docmana.commands[commandName] = function (options) {
        return new Cmd(options);
    }

})();


(function () {

    "use strict";

    var commandName = 'upload';

    var Cmd = docmana.CommandBase.extend({
        init: function (options) {
            this.name = commandName;
            this.templateName = 'toolbarBtnUpload';
        },
        listen: function () {
            this.listenTo(this.main(), 'started', function () {
                var that = this;
                if (!this.$el) return;
                var $file = this.$el.find(':file');
                var uploader = this.main().ui.uploader;
                // 如果有 jquery file upload 控件，则初始化 uploader 容器
                if ($.fn.fileupload && uploader) {
                    uploader.build($file);
                } else {
                    $file.on('change', function () {
                        var val = $(this).val();
                        if (val === "" || val == null) return;
                        // 通过 jquery.form 提交
                        that.store().upload($(this).closest('form'));
                    });
                }
            });
            this.listenTo(this, 'rendered', function () {


            });
        },
        enable: function () {
            docmana.CommandBase.prototype.enable.apply(this, arguments);
            this.$element().find(':file').removeAttr('disabled');
        },
        disable: function () {
            docmana.CommandBase.prototype.disable.apply(this, arguments);
            this.$element().find(':file').attr('disabled', 'disabled');
        }
    });

    docmana.commands[commandName] = function (options) {
        return new Cmd(options);
    }

})();


(function () {
    "use strict";

    var Breadcrumbs = docmana.ViewBase.extend({
        listen: function () {
            this.listenTo(this.history(), 'change', function() {
                this.render();
            });
        },
        events: {
            'click li > a': '_linkHandler'
        },
        $breadcrumb: function () {
            return this.$('.breadcrumb');
        },
 
        render: function () {
            var tpl = this.tpl('breadcrumbs');
            var pathData = this.history().getPath();
            this.$el.html(tpl(pathData));

            this._interactive();
        },
        _interactive: function () {
            var that = this;
            this.$('li > a:not(.ui-droppable)').droppable({
                accept: ".file-list-item",
                hoverClass: "drop-active",
                drop: function (e, ui) {
                    // 注意：如果这里要直接取 ui.draggable，则需手动更改 ddmanager
                    var targets = that.workzone().getIds(ui.draggable);
                    var dest = $(e.target).attr('data-hash');

                    that.store().moveTo(dest, targets);
                }
            });
        },
        _linkHandler: function (e) {
            e.preventDefault();
            var hash = $(e.currentTarget).attr('data-hash');
            this.main().exec('open', this.history().byId(hash));
        }
    });

    docmana.ui.breadcrumbs = function (options) {
        return new Breadcrumbs(options);
    }

})();


(function () {
    "use strict";

    var Navigation = docmana.CommandContainer.extend({
        templateName: 'navigation',
        breadcrumbTemplateName: 'breadcrumb',
        defaults: {
            autoAction: true,
            autoRender: true,
            commands: [{
                name: 'navigation',
                to: '.nav-group'
            }, {
                name: 'search',
                to: '.search-group'
            }, {
                name: 'refresh',
                to: '.search-group'
            }]
        },
        listen: function () {
            this.listenTo(this.history(), 'change', function () {
                this._renderBreadcrumb();
            });
            this.listenTo(this, 'rendered', function () {
                this._renderBreadcrumb();
                this._renderCommands();
            });
        },
        events: {
            'click .docmana-breadcrumb li > a': '_linkHandler'
        },
        $breadcrumb: function () {
            return this.$('.docmana-breadcrumb');
        },
        _renderBreadcrumb: function () {
            var tpl = this.tpl(this.breadcrumbTemplateName);
            var pathData = this.history().getPath();
            this.$breadcrumb().html(tpl(pathData));
            this._initBreadcrumbInteractive();
        },
        _initBreadcrumbInteractive: function () {
            var that = this;
            this.$('li > a:not(.ui-droppable)').droppable({
                accept: ".file-list-item",
                hoverClass: "drop-active",
                drop: function (e, ui) {
                    // 注意：如果这里要直接取 ui.draggable，则需手动更改 ddmanager
                    var targets = that.workzone().getIds(ui.draggable);
                    var dest = $(e.target).attr('data-hash');

                    that.store().moveTo(dest, targets);
                }
            });
        },
        _linkHandler: function (e) {
            e.preventDefault();
            var hash = $(e.currentTarget).attr('data-hash');
            this.main().exec('open', this.history().byId(hash));
        }
    });

    docmana.ui.navigation = function (options) {
        return new Navigation(options);
    }

})();


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


(function () {
    "use strict";

    // 状态栏界面


    var Statusbar = docmana.CommandContainer.extend({
        templateName: 'statusbar',
        defaults: {
            autoRender: true,
            commands: [{
                name: 'layout',
                to: '.layout'
            }]
        },
        listen: function () {
            this.listenTo(this.store(), 'update', function () {
                this.updateStatus();
            });
            this.listenTo(this.workzone(), 'selected', function () {
                this.updateStatus();
            });
            this.listenTo(this, 'rendered', function () {
                this._renderCommands();
            });
        },
        updateStatus: function () {
            this.$('.status-text').html(this.tpl('statusbarText')(this.getStatus()));
        },
        getStatus: function () {
            var data = this.store().cwdData();
            var selectedIds = this.workzone().getIds();
            var selectedSize = _.reduce(_.map(this.store().byIds(selectedIds), function (item) {
                return item.mime === 'directory' ? NaN : item.size;
            }), function (sum, n) {
                return sum + n;
            }, 0);
            
            return {
                count: data.length,
                selectedCount: selectedIds.length,
                selectedSize: isNaN(selectedSize) ? "" : docmana.templateHelper.formatFileSize(selectedSize)
            }
        }
    });

    docmana.ui.statusbar = function (options) {
        return new Statusbar(options);
    }

})();


(function () {
    "use strict";

    // 工具栏界面

    var Toolbar = docmana.CommandContainer.extend({
        className: 'docmana-toolbar',
        templateName: 'toolbar',
        defaults: {
            autoRender: true,
            autoAction: true,
            commands: ['new', 'open', 'clipboard', 'organize', {
                name: 'view',
                to: '.right'
            }, {
                name: 'util',
                to: '.right'
            }]
        },
        listen: function () {
            this.listenTo(this, 'rendered', function () {
                this._renderCommands();
            });
        }
    });

    docmana.ui.toolbar = function (options) {
        return new Toolbar(options);
    }
})();


(function () {
    "use strict";

    // 当前工作目录界面

    var Uploader = docmana.ViewBase.extend({
        templateName: 'uploader',
        init: function () {
            var that = this;
            this.parentDialog().on('shown.bs.modal', function () {

            }).on('hidden.bs.modal', function () {
                // that.$body().html('');
                that.main().$el.focus();  // 重设焦点
            });
        },
        defaults: {
            autoRender: true
        },
        events: {
            'click .cancel': '_cancelHandler'
        },
        listen: function () {
            this.listenTo(this.main(), 'started', function () {
                // 设置触发器
                var that = this;
                var statusbar = this.statusbar();
                var $btn = $(this.tpl('uploaderTrigger')());
                if (statusbar) {
                    $btn.on('click', function () {
                        that.parentDialog().modal('show');
                    }).appendTo(statusbar.$('.uploader'));
                    that.$trigger = $btn;
                }
            });
            this.listenTo(this, 'rendered', function () {
                this.parentDialog().modal({
                    show: false
                });
            });
        },
        parentDialog: function () {
            return this.$element().closest('.modal');
        },
        inputInstance: function ($input) {
            $input = $input || this.$input;
            return $input.data('blueimp-fileupload') || $input.data('fileupload');
        },
        $body: function () {
            return this.$('.files');
        },
        updateBadge: function () {
            var count = this.count();
            var $badge = this.$trigger.find('.badge');
            $badge.text(count);
            if (count === 0) {
                $badge.hide();
            } else {
                $badge.show();
            }
        },
        count: function(){
            var count = this.$('.file').length;
            return count;
        },
        updateDialogDisplay: function(){
            if (this.count() === 0) {
                this.parentDialog().modal('hide');
            } else {
                this.parentDialog().modal('show');
            }
        },
        build: function ($fileInput) {
            var that = this;
            var tplFile = this.tpl('uploaderFiles');
            var formatFileSize = docmana.utils.formatFileSize;

            $fileInput.fileupload({
                url: this.store().url(),
                formData: function () {
                    return _.map(that.store().uploadParams(), function (value, key) {
                        return {
                            name: key,
                            value: value
                        }
                    });
                },
                dataType: 'json',
                add: function (e, data) {
                    if (e.isDefaultPrevented()) {
                        return false;
                    }

                    var $this = $(this);
                    var instance = that.inputInstance($this);
                    var options = instance.options;

                    data.context = $(tplFile({
                        files: data.files,
                        options: options
                    })).data('data', data).addClass('processing');

                    that.$body().append(data.context);

                    that.updateBadge();
                    that.updateDialogDisplay();

                    data.process().always(function () {
                        data.context.each(function (index) {
                            $(this).find('.size').text(
                                formatFileSize(data.files[index].size)
                            );
                        }).removeClass('processing');
                        // that._renderPreviews(data);
                    }).done(function () {
                        data.context.find('.start').prop('disabled', false);

                        if ((instance._trigger('added', e, data) !== false) &&
                            (options.autoUpload || data.autoUpload) &&
                            data.autoUpload !== false) {
                            data.submit();
                        }
                    }).fail(function () {
                        if (data.files.error) {
                            data.context.each(function (index) {
                                var error = data.files[index].error;
                                if (error) {
                                    $(this).find('.status').text(error);
                                }
                            });
                        }
                    });
                },
                progress: function (e, data) {
                    if (e.isDefaultPrevented()) {
                        return false;
                    }
                    var progress = Math.floor(data.loaded / data.total * 100);
                    if (data.context) {
                        data.context.each(function () {
                            $(this).find('.progress')
                                .attr('aria-valuenow', progress)
                                .children().first().css(
                                    'width',
                                    progress + '%'
                                );
                            $(this).find('.status > .percent').text(progress + '%');
                        });
                    }
                },
                fail: function (e, data) {
                    if (e.isDefaultPrevented()) {
                        return false;
                    }
                    var instance = that.inputInstance($(this));
                    if (data.context) {
                        data.context.each(function (index) {
                            if (data.errorThrown !== 'abort') {
                                var file = data.files[index];
                                file.error = file.error || data.errorThrown;
                                $(this).find('.folder').text(file.error);
                            } else {
                                $(this).remove();
                                instance._trigger('failed', e, data);
                                instance._trigger('finished', e, data);
                            }
                        });
                    }

                    that.updateBadge();
                    that.updateDialogDisplay();

                },
                done: function (e, data) {
                    data.context.remove();
                    that.updateBadge();
                    that.updateDialogDisplay();
                    that.store().trigger('sync', data.result);
                }
            });

            // TODO: 为什么在 fileupload add 方法内获取 that.$input 不正确
            this.$input = $fileInput;
        },
        _cancelHandler: function (e) {
            e.preventDefault();
            var $file = $(e.currentTarget).closest('.file-upload,.file-download');
            var data = $file.data('data') || {};
            data.context = data.context || $file;
            if (data.abort) {
                data.abort();
            } else {
                data.errorThrown = 'abort';
                this.trigger('fail', e, data);
            }
        }
    });

    docmana.ui.uploader = function (options) {
        return new Uploader(options);
    }
})();


(function () {
    "use strict";

    var Viewer = docmana.ViewBase.extend({
        templateName: 'viewer',
        defaults: {
            autoAction: true,
            autoRender: true,
            fileType: [
                '.txt', '.csv', '.pdf', '.jpg', '.gif', '.png', '.tiff', '.ppt', '.pptx',
                '.doc', '.docx', '.xls', '.xlsx'
            ]
        },

        init: function () {
            var that = this;
            this.parentDialog().on('shown.bs.modal', function () {
                that.$body().css({
                    top: that.$('.modal-header').outerHeight(),
                    bottom: that.$('.modal-footer').outerHeight()
                });
                that.viewCurrent();
            }).on('hidden.bs.modal', function () {
                that.$body().html('');
                that.main().$el.focus();  // 重设焦点
            });
        },
        listen: function () {
            this.listenTo(this.workzone(), 'selected', function () {
                if (this.$el.is(':visible')) {
                    this.viewCurrent();
                }
            });
            this.listenTo(this, 'rendered', function () {
                this.parentDialog().modal({
                    show: false
                });
            });
        },
        parentDialog: function () {
            return this.$element().closest('.modal');
        },
        callout: function () {
            this.parentDialog().modal('show');
        },
        $body: function () {
            return this.$el.find('.docmana-viewer-body');
        },
        viewCurrent: function () {
            var that = this;
            var selectIds = that.workzone().getIds();
            if (selectIds.length > 0) {
                var target = selectIds[0];
                that.$body().html('');
                var data = that.store().byId(target);
                var ext = docmana.utils.fileNameExtension(data.name);
                that.parentDialog().find('.modal-title').text(data.name);

                if (that.props.fileType.indexOf(ext) >= 0) {
                    that.store().content(target).done(function (resp) {
                        if (resp.view === 'path') {
                            var url = that.store().fileUrl(resp.content);
                            if (ext === '.pdf') {
                                PDFObject.embed(url, that.$body());
                            } else {
                                that.$body().html('<iframe src="' + url + '"></iframe>');
                            }

                        }
                        if (resp.view === 'content') {
                            that.$body().html(resp.content);
                        }
                    });
                } else {
                    var tpl = this.tpl('fileInfo');
                    that.$body().html(tpl(data));
                }

            }
        },
        _previousHandler: function (e) {
            this.workzone().selectTo('previous');
        },
        _nextHandler: function (e) {
            this.workzone().selectTo('next');
        },
        _downloadHandler: function (e) {
            this.main().exec('download');
        }
    });

    docmana.ui.viewer = function (options) {
        return new Viewer(options);
    }

})();


(function () {
    "use strict";

    // 当前工作目录界面

    var WorkZone = docmana.ViewBase.extend({
        init: function () {
            var that = this;
            this._buffer = [];
            this._selected = [];
            this._cwd = null;
            this._timer = [];
            this.layout = this.props.layout;
            this._moving = false;
            this._renderListThrottle = _.throttle(_.bind(this._renderList, this), 100);

            this._triggerSelectDebounce = _.debounce(_.bind(function () {
                this.trigger('selected', this.select());
            }, this), 200);

            var originX = 0;
            var originY = 0;
            // 记录 moving
            this.$el.on('mousedown', function (e) {
                that._moving = false;
                originX = e.clientX;
                originY = e.clientY;
            }).on('mousemove', function (e) {
                if (e.clientX !== originX || e.clientY !== originY) {
                    that._moving = true;
                }
            });

            this._initHotKeys();
            this._initSelectableInteractive();

            this.render();
        },
        events: {
            'scroll': '_scrollHandler',
            'dblclick .file-list-item': '_itemDblClickHandler',
            'mousedown .file-list-item .filename': '_editNameHandler',
            'click': '_clickHandler'
        },
        defaults: {
            bottomThreshold: 50,
            itemCountPerScreen: 50
        },

        listen: function () {

            this.listenTo(this.store(), 'update', function (data, request) {
                if (request.cmd) {
                    if (request.cmd === 'rename') {
                        this._updateSelectedCache(request.target, request.name);
                    }
                    if (request.cmd === 'mkdir') {

                    }
                }

                this.source(data);
            });

            this.listenTo(this, 'refresh', function (items) {
                this._renderList(false);
                this._restoreSelectUI();
            });

            //this.listenTo(this, 'layout', function() {
            //    this.render();
            //});

            this.listenTo(this, 'selected', function ($select) {
                this._selected = _.map($select, function (item) {
                    return {
                        name: $(item).data('name'),
                        id: $(item).attr('id')
                    };
                });
            });
        },
        changeLayout: function (layout) {
            this.layout = layout;
            this.render();
            this.trigger('layout');
            this.source(this.store()._data);
        },
        isListLayout: function () {
            return this.layout === 'list';
        },
        source: function (items) {

            this._buffer = this.store().cwdData();
            if (this.store().cwd().hash !== this._cwd) {
                this._cwd = this.store().cwd().hash;
                this._selected = [];
            }
            this.trigger('refresh', this._buffer);
        },
        getIds: function ($items) {
            if ($items == null) {
                $items = this.select();
            }
            var ids = $.map($items, function (dom) {
                return $(dom).attr('id');
            });
            return ids;
        },
        render: function () {
            var tpl = this.isListLayout() ? this.tpl('workzoneListView') : this.tpl('workzoneIconsView');
            this.$el.html(tpl(this.props));

            this.$view = this.$('.docmana-workzone-view');

            // 可拖拽

            if (this._buffer.length > 0) {
                this.trigger('refresh');
            }
        },
        select: function (elements) {

            if (elements != null) {
                docmana.utils.selectSelectableElement(this.$el, elements);
            }

            // TODO: 这里在设置后马上获取选中项会不会不正确？？
            return this.$('.file-list-item.ui-selected');

        },

        _updateSelectedCache: function (id, newName) {
            var item = _.find(this._selected, function (value) {
                return value.id === id;
            });
            if (item != null) {
                item.name = newName;
            }
        },
        _restoreSelectUI: function () {
            var that = this;
            var willSelect = _.compact(_.map(this._selected, function (value) {
                return that.$('[data-name="' + value.name + '"]')[0];
            }));
            that.select(willSelect);

        },
        _renderItem: function (item) {
            var tplName = this.isListLayout() ? 'workzoneListViewItem' : 'workzoneIconsViewItem';
            return this.tpl(tplName)(item);
        },
        _renderList: function (isAppend) {
            if (isAppend == null) isAppend = true;
            var that = this;
            var $wrapper = this.$el;
            var bottomThreshold = this.props.bottomThreshold;
            var itemCountPerScreen = this.props.itemCountPerScreen;

            var $last = this.$('[id]:last');

            //var shouldRender = !$last.length
            //    || ($last.position().top - ($wrapper.height() + $wrapper.scrollTop() + bottomThreshold)) <= 0;

            //if (!shouldRender) return;

            var items = this._buffer.splice(0, itemCountPerScreen);

            var html = $.map(items, function (item) {
                return that._renderItem(item);
            });

            this.$view[isAppend ? 'append' : 'html'](html.join(''));

            // TODO: 设置选中项的显示状态
            this._setItemInteractive();

            // 刷新状态，否则mousedown时会报错
            this.$el.selectable("refresh");
        },
        $items: function () {
            return this.$('.file-list-item');
        },
        _getShiftSelected: function ($el) {
            var $items = this.$items();
            var $fistSelected = $items.filter('.ui-selected').first();
            var $lastSelected = $items.filter('.ui-selected').last();
            var idx = $items.index($el);
            var firstIdx = $items.index($fistSelected);
            var lastIdx = $items.index($lastSelected);

            firstIdx = Math.min(idx, firstIdx);
            lastIdx = Math.max(idx, lastIdx);

            return $items.slice(firstIdx, (lastIdx + 1));
        },
        _isNormalMouseEvent: function (e) {
            return !e.shiftKey && !e.ctrlKey && !e.metaKey;
        },
        _initSelectableInteractive: function () {
            var that = this;

            // 设置可选择
            this.$el
                .on('mousedown', '.file-list-item', function (e) {
                    var $target = $(e.currentTarget);
                    if (!that._isNormalMouseEvent(e)) {
                        e.preventDefault();
                        if (e.ctrlKey) {
                            var curr = that.select();
                            $.merge($target, curr);
                        }
                        // shift 操作的行为与windows下不一致
                        if (e.shiftKey) {
                            $target = that._getShiftSelected($target);
                        }
                        that.select($target);
                    } else {
                        // 未选中时，mousedown 触发选中
                        if (!$target.hasClass('ui-selected')) {
                            that.select($target);
                        }
                    }

                })
                .on('click', '.file-list-item', function (e) {
                    var $target = $(e.currentTarget);
                    // 多选状态下，click 触发选中
                    if (that.select().length > 1 && that._isNormalMouseEvent(e)) {
                        that.select($target);
                        //$target.focus();
                    }
                })
                .selectable({
                    //appendTo: this.$el,
                    delay: 50,
                    filter: ".file-list-item",
                    //cancel: '.ui-selected',
                    start: function (event, ui) {
                        that._clearTimer();
                        that.$('.inline-edit').blur();
                    },
                    selected: function (e, ui) {
                      //  $(ui.selected).addClass('bg-primary');
                        that._triggerSelectDebounce();
                    },
                    unselected: function (e, ui) {
                     //   $(ui.unselected).removeClass('bg-primary');
                        that._triggerSelectDebounce();
                    },
                    stop: function (e, ui) {
                        //   e.stopImmediatePropagation();
                    }
                });
        },
        _setItemInteractive: function () {
            var that = this;
            // 对每项设置为拖动
            this.$('.drag-block:not(.ui-draggable)').draggable({
                appendTo: that.$el,
                //cancel: ':not(.drag-block), input,textarea,button,select,option',
                delay: 100,
                helper: function () {
                    return '<div class="cwd-draggable-helper"><span class="badge count"></span></div>';
                },
                cursorAt: { top: 20, left: 20 },
                start: function (e, ui) {
                    that._clearTimer();

                    var $selected = that.select();
                    // 设置当前选中项为当前拖动元素
                    $.ui.ddmanager.current.element = $selected;

                    // 设置 helper
                    var $thumbs = $($selected.find('.filetype').splice(0, 4)).clone();
                    $.each($thumbs, function (i, el) {
                        $(el).addClass('icon' + i);
                    });
                    ui.helper.append($thumbs).find('.count').html($selected.length);
                }
            });

            // 设置文件夹可拖动放置
            this.$('.file-list-item.type-directory:not(.ui-droppable)').droppable({
                accept: ".file-list-item",
                hoverClass: "drop-active",
                drop: function (e, ui) {
                    // 注意：如果这里要直接取 ui.draggable，则需手动更改 ddmanager
                    var targets = that.getIds(ui.draggable);
                    var dest = $(e.target).attr('id');

                    that.store().moveTo(dest, targets);
                }
            });
        },
        _unselectAll: function (e) {
            if (!e.shiftKey && !e.ctrlKey && !e.metaKey) {
                this.select([]);
            }
        },
        _selectAll: function () {
            this.select(this.$('.file-list-item'));
        },
        _clearTimer: function () {
            while (this._timer.length > 0) {
                var id = this._timer.shift();
                clearTimeout(id);
            }
        },

        // Hanlders
        _scrollHandler: function () {
            this._renderListThrottle();
        },
        _clickHandler: function (e) {
            e.preventDefault();
            if (!$(e.target).is(':input')) {
                this.$('.inline-edit').blur();
                // 由于点击子节点会造成父节点焦点丢失，这里的判断并没多大作用...
               // if ($(document.activeElement).closest('.docmana').length === 0) {
                    this._$focusEl().focus();
               // }
            }
            // 如果单纯点击，则手动进行反选
            if (!this._moving && $(e.target).closest('.file-list-item').length === 0) {
                this._unselectAll(e);
            }
        },
        _isSingleSelected: function ($el) {
            return $el.closest('.file-list-item').hasClass('ui-selected') && this.select().length === 1;
        },
        _editNameHandler: function (e) {
            if (e.button === 2) return;

            var $el = $(e.currentTarget);

            if (this._isSingleSelected($el)) {
                var timer = _.delay(_.bind(function ($el) {
                    if (this._isSingleSelected($el)) {

                        this.main().exec('rename');
                    }
                }, this), 700, $el);

                this._timer.push(timer);
            }


        },
        _isSelecting: function () {
            return $('.ui-selectable-helper').length > 0;
        },
        _isInput: function ($el) {
            return $el.is('input, textarea, select, button');
        },
        _itemDblClickHandler: function (e) {
            if (this._isInput($(e.target))) return;
            this._clearTimer();
            this.main().exec('open');
        },
        _getSingleSelect: function () {
            var last = this.select().last();
            if (last.length === 0) {
                return this.$items().first();
            }
            return last;
        },
        editItemName: function (callback, isForce) {
            var $item = this.select();
            if ($item.length !== 1) return;
            var $filename = $item.find('.filename');
            var mode = this.isListLayout() ? 0 : 1;
            docmana.utils.inlineEdit($filename, function (name) {
                callback(name);
            }, mode, isForce);
        },
        selectTo: function (pos) {
            var $items = this.$items();
            var curr = this.select().last();
            if (curr.length === 0) {
                curr = $items.first();
            }
            if (curr.length === 0) return;

            var to = curr;
            var idx = $items.index(curr);
            if (pos === 'next') {
                if (idx + 1 < $items.length) {
                    to = $($items[idx + 1]);
                }
            }
            if (pos === 'previous') {
                if (idx - 1 >= 0) {
                    to = $($items[idx - 1]);
                }
            }
            this.select(to);
        },
        _$focusEl: function () {
            return this.main().$el;
        },
        _initHotKeys: function () {
            var that = this;

            // TODO: 添加图标布局下的 up down 处理

            this._$focusEl().bind('keydown.docmana', 'left', function (e) {
                if (!that.isListLayout()) {
                    that.selectTo('previous');
                }
            }).bind('keydown.docmana', 'right', function (e) {
                if (!that.isListLayout()) {
                    that.selectTo('next');
                }
            }).bind('keydown.docmana', 'up', function (e) {
                if (that.isListLayout()) {
                    that.selectTo('previous');
                }
            }).bind('keydown.docmana', 'down', function (e) {
                if (that.isListLayout()) {
                    that.selectTo('next');
                }
            }).bind('keydown.docmana', 'ctrl+a', function (e) {
                e.preventDefault();
                that._selectAll();
            });

            var commands = this.main().commands;

            _.forEach(commands, function (cmd) {
                if (cmd.shortcuts) {
                    that._$focusEl().bind('keydown.docmana', cmd.shortcuts, function (e) {
                        e.preventDefault();
                        cmd.shortcutExec();
                    });
                }
            });
        }

    });

    docmana.ui.workzone = function (options) {
        return new WorkZone(options);
    }
})();


(function () {

    "use strict";

    docmana.resources['en'] = {

        'cmdBack': 'Back',
        'cmdForward': 'Forward',
        'cmdOpen': 'Open',
        'cmdUpload': 'Upload',
        'cmdDownload': 'Download',
        'cmdCut': 'Cut',
        'cmdCopy': 'Copy',
        'cmdPaste': 'Paste',
        'cmdSort': 'Sort by',
        'cmdMkdir': 'New folder',
        'cmdDuplicate': 'Duplicate',
        'cmdRename': 'Rename',
        'cmdRm': 'Remove',
        'sortByName': 'Name',
        'sortBySize': 'Size',
        'sortByType': 'Type',
        'sortByDate': 'Date modified',
        'sortAscending': 'Ascending',
        'sortDescending': 'Descending',
        'fileName': 'Name',
        'fileDateModified': 'Date modified',
        'fileType': 'Type',
        'fileSize': 'Size',
        'statusbarItems': 'items',
        'statusbarSelectedItem': '{0} item selected',
        'layoutList': 'List',
        'layoutLargeIcons': 'Large Icons',
        'textSearch': 'Search...',
        'textPreviousItem': 'previous item',
        'textNextItem': 'next item',
        'textFileUpload': 'File uploader',
        'textClose': 'Close',
        'textOk': 'Ok',
        'textCancel': 'Cancel',
        'textConfirmOperate': 'Are you sure you want to do this operation?',

        'labelLanguage': 'Language: ',
        'labelTheme': 'Theme: ',

        'kindUnknown': 'Unknown',
        'kindFolder': 'Folder',
        'kindAlias': 'Alias',
        'kindAliasBroken': 'Broken alias',
        // applications
        'kindApp': 'Application',
        'kindPostscript': 'Postscript document',
        'kindMsOffice': 'Microsoft Office document',
        'kindMsWord': 'Microsoft Word document',
        'kindMsExcel': 'Microsoft Excel document',
        'kindMsPP': 'Microsoft Powerpoint presentation',
        'kindOO': 'Open Office document',
        'kindAppFlash': 'Flash application',
        'kindPDF': 'Portable Document Format (PDF)',
        'kindTorrent': 'Bittorrent file',
        'kind7z': '7z archive',
        'kindTAR': 'TAR archive',
        'kindGZIP': 'GZIP archive',
        'kindBZIP': 'BZIP archive',
        'kindXZ': 'XZ archive',
        'kindZIP': 'ZIP archive',
        'kindRAR': 'RAR archive',
        'kindJAR': 'Java JAR file',
        'kindTTF': 'True Type font',
        'kindOTF': 'Open Type font',
        'kindRPM': 'RPM package',
        // texts
        'kindText': 'Text document',
        'kindTextPlain': 'Plain text',
        'kindPHP': 'PHP source',
        'kindCSS': 'Cascading style sheet',
        'kindHTML': 'HTML document',
        'kindJS': 'Javascript source',
        'kindRTF': 'Rich Text Format',
        'kindC': 'C source',
        'kindCHeader': 'C header source',
        'kindCPP': 'C++ source',
        'kindCPPHeader': 'C++ header source',
        'kindShell': 'Unix shell script',
        'kindPython': 'Python source',
        'kindJava': 'Java source',
        'kindRuby': 'Ruby source',
        'kindPerl': 'Perl script',
        'kindSQL': 'SQL source',
        'kindXML': 'XML document',
        'kindAWK': 'AWK source',
        'kindCSV': 'Comma separated values',
        'kindDOCBOOK': 'Docbook XML document',
        'kindMarkdown': 'Markdown text',
        // images
        'kindImage': 'Image',
        'kindBMP': 'BMP image',
        'kindJPEG': 'JPEG image',
        'kindGIF': 'GIF Image',
        'kindPNG': 'PNG Image',
        'kindTIFF': 'TIFF image',
        'kindTGA': 'TGA image',
        'kindPSD': 'Adobe Photoshop image',
        'kindXBITMAP': 'X bitmap image',
        'kindPXM': 'Pixelmator image',
        // media
        'kindAudio': 'Audio media',
        'kindAudioMPEG': 'MPEG audio',
        'kindAudioMPEG4': 'MPEG-4 audio',
        'kindAudioMIDI': 'MIDI audio',
        'kindAudioOGG': 'Ogg Vorbis audio',
        'kindAudioWAV': 'WAV audio',
        'AudioPlaylist': 'MP3 playlist',
        'kindVideo': 'Video media',
        'kindVideoDV': 'DV movie',
        'kindVideoMPEG': 'MPEG movie',
        'kindVideoMPEG4': 'MPEG-4 movie',
        'kindVideoAVI': 'AVI movie',
        'kindVideoMOV': 'Quick Time movie',
        'kindVideoWM': 'Windows Media movie',
        'kindVideoFlash': 'Flash movie',
        'kindVideoMKV': 'Matroska movie',
        'kindVideoOGG': 'Ogg movie'
    }

})();


(function () {

    "use strict";

    docmana.resources['zh-CN'] = {

        'cmdBack': '后退',
        'cmdForward': '前进',
        'cmdOpen': '打开',
        'cmdUpload': '上传',
        'cmdDownload': '下载',
        'cmdCut': '剪切',
        'cmdCopy': '复制',
        'cmdPaste': '粘贴',
        'cmdSort': '排序方式',
        'cmdMkdir': '新建文件夹',
        'cmdDuplicate': '副本',
        'cmdRename': '重命名',
        'cmdRm': '移除',
        'sortByName': '名称',
        'sortBySize': '大小',
        'sortByType': '类型',
        'sortByDate': '修改日期',
        'sortAscending': '升序',
        'sortDescending': '降序',
        'fileName': '名称',
        'fileDateModified': '修改日期',
        'fileType': '类型',
        'fileSize': '大小',
        'statusbarItems': '个项目',
        'statusbarSelectedItem': '选中 {0} 个项目',
        'layoutList': '列表布局',
        'layoutLargeIcons': '图标布局',
        'textSearch': '搜索...',
        'textPreviousItem': '前一项',
        'textNextItem': '后一项',
        'textFileUpload': '文件上传器',
        'textClose': '关闭',
        'textOk': '确定',
        'textCancel': '取消',
        'textConfirmOperate': '确定做此操作？',

        'labelLanguage': '语言：',
        'labelTheme': '主题：',


        'kindUnknown': '未知',
        'kindFolder': '文件夹',
        'kindAlias': '别名',
        'kindAliasBroken': '错误的别名',
        // applications
        'kindApp': '程序',
        'kindPostscript': 'Postscript 文档',
        'kindMsOffice': 'Microsoft Office 文档',
        'kindMsWord': 'Microsoft Word 文档',
        'kindMsExcel': 'Microsoft Excel 文档',
        'kindMsPP': 'Microsoft Powerpoint 演示',
        'kindOO': 'Open Office 文档',
        'kindAppFlash': 'Flash 程序',
        'kindPDF': 'Portable Document Format (PDF)',
        'kindTorrent': 'Bittorrent 文件',
        'kind7z': '7z 压缩包',
        'kindTAR': 'TAR 压缩包',
        'kindGZIP': 'GZIP 压缩包',
        'kindBZIP': 'BZIP 压缩包',
        'kindXZ': 'XZ 压缩包',
        'kindZIP': 'ZIP 压缩包',
        'kindRAR': 'RAR 压缩包',
        'kindJAR': 'Java JAR 文件',
        'kindTTF': 'True Type 字体',
        'kindOTF': 'Open Type 字体',
        'kindRPM': 'RPM 包',
        // texts
        'kindText': '文本文件',
        'kindTextPlain': '纯文本',
        'kindPHP': 'PHP 源代码',
        'kindCSS': '层叠样式表(CSS)',
        'kindHTML': 'HTML 文档',
        'kindJS': 'Javascript 源代码',
        'kindRTF': '富文本格式(RTF)',
        'kindC': 'C 源代码',
        'kindCHeader': 'C 头文件',
        'kindCPP': 'C++ 源代码',
        'kindCPPHeader': 'C++ 头文件',
        'kindShell': 'Unix 外壳脚本',
        'kindPython': 'Python 源代码',
        'kindJava': 'Java 源代码',
        'kindRuby': 'Ruby 源代码',
        'kindPerl': 'Perl 源代码',
        'kindSQL': 'SQL 脚本',
        'kindXML': 'XML 文档',
        'kindAWK': 'AWK 源代码',
        'kindCSV': '逗号分隔值文件(CSV)',
        'kindDOCBOOK': 'Docbook XML 文档',
        // images
        'kindImage': '图片',
        'kindBMP': 'BMP 图片',
        'kindJPEG': 'JPEG 图片',
        'kindGIF': 'GIF 图片',
        'kindPNG': 'PNG 图片',
        'kindTIFF': 'TIFF 图片',
        'kindTGA': 'TGA 图片',
        'kindPSD': 'Adobe Photoshop 图片',
        'kindXBITMAP': 'X bitmap 图片',
        'kindPXM': 'Pixelmator 图片',
        // media
        'kindAudio': '音频',
        'kindAudioMPEG': 'MPEG 音频',
        'kindAudioMPEG4': 'MPEG-4 音频',
        'kindAudioMIDI': 'MIDI 音频',
        'kindAudioOGG': 'Ogg Vorbis 音频',
        'kindAudioWAV': 'WAV 音频',
        'AudioPlaylist': 'MP3 播放列表',
        'kindVideo': '视频',
        'kindVideoDV': 'DV 视频',
        'kindVideoMPEG': 'MPEG 视频',
        'kindVideoMPEG4': 'MPEG-4 视频',
        'kindVideoAVI': 'AVI 视频',
        'kindVideoMOV': 'Quick Time 视频',
        'kindVideoWM': 'Windows Media 视频',
        'kindVideoFlash': 'Flash 视频',
        'kindVideoMKV': 'Matroska 视频',
        'kindVideoOGG': 'Ogg 视频'
    }

})();


return window.docmana;

}));
