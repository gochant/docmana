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


/*! jQuery UI - v1.11.4 - 2016-04-27
* http://jqueryui.com
* Includes: core.js, widget.js, mouse.js, position.js, draggable.js, droppable.js, selectable.js
* Copyright jQuery Foundation and other contributors; Licensed MIT */

(function( factory ) {
	if ( typeof define === "function" && define.amd ) {

		// AMD. Register as an anonymous module.
		define([ "jquery" ], factory );
	} else {

		// Browser globals
		factory( jQuery );
	}
}(function( $ ) {
/*!
 * jQuery UI Core 1.11.4
 * http://jqueryui.com
 *
 * Copyright jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 *
 * http://api.jqueryui.com/category/ui-core/
 */


// $.ui might exist from components with no dependencies, e.g., $.ui.position
$.ui = $.ui || {};

$.extend( $.ui, {
	version: "1.11.4",

	keyCode: {
		BACKSPACE: 8,
		COMMA: 188,
		DELETE: 46,
		DOWN: 40,
		END: 35,
		ENTER: 13,
		ESCAPE: 27,
		HOME: 36,
		LEFT: 37,
		PAGE_DOWN: 34,
		PAGE_UP: 33,
		PERIOD: 190,
		RIGHT: 39,
		SPACE: 32,
		TAB: 9,
		UP: 38
	}
});

// plugins
$.fn.extend({
	scrollParent: function( includeHidden ) {
		var position = this.css( "position" ),
			excludeStaticParent = position === "absolute",
			overflowRegex = includeHidden ? /(auto|scroll|hidden)/ : /(auto|scroll)/,
			scrollParent = this.parents().filter( function() {
				var parent = $( this );
				if ( excludeStaticParent && parent.css( "position" ) === "static" ) {
					return false;
				}
				return overflowRegex.test( parent.css( "overflow" ) + parent.css( "overflow-y" ) + parent.css( "overflow-x" ) );
			}).eq( 0 );

		return position === "fixed" || !scrollParent.length ? $( this[ 0 ].ownerDocument || document ) : scrollParent;
	},

	uniqueId: (function() {
		var uuid = 0;

		return function() {
			return this.each(function() {
				if ( !this.id ) {
					this.id = "ui-id-" + ( ++uuid );
				}
			});
		};
	})(),

	removeUniqueId: function() {
		return this.each(function() {
			if ( /^ui-id-\d+$/.test( this.id ) ) {
				$( this ).removeAttr( "id" );
			}
		});
	}
});

// selectors
function focusable( element, isTabIndexNotNaN ) {
	var map, mapName, img,
		nodeName = element.nodeName.toLowerCase();
	if ( "area" === nodeName ) {
		map = element.parentNode;
		mapName = map.name;
		if ( !element.href || !mapName || map.nodeName.toLowerCase() !== "map" ) {
			return false;
		}
		img = $( "img[usemap='#" + mapName + "']" )[ 0 ];
		return !!img && visible( img );
	}
	return ( /^(input|select|textarea|button|object)$/.test( nodeName ) ?
		!element.disabled :
		"a" === nodeName ?
			element.href || isTabIndexNotNaN :
			isTabIndexNotNaN) &&
		// the element and all of its ancestors must be visible
		visible( element );
}

function visible( element ) {
	return $.expr.filters.visible( element ) &&
		!$( element ).parents().addBack().filter(function() {
			return $.css( this, "visibility" ) === "hidden";
		}).length;
}

$.extend( $.expr[ ":" ], {
	data: $.expr.createPseudo ?
		$.expr.createPseudo(function( dataName ) {
			return function( elem ) {
				return !!$.data( elem, dataName );
			};
		}) :
		// support: jQuery <1.8
		function( elem, i, match ) {
			return !!$.data( elem, match[ 3 ] );
		},

	focusable: function( element ) {
		return focusable( element, !isNaN( $.attr( element, "tabindex" ) ) );
	},

	tabbable: function( element ) {
		var tabIndex = $.attr( element, "tabindex" ),
			isTabIndexNaN = isNaN( tabIndex );
		return ( isTabIndexNaN || tabIndex >= 0 ) && focusable( element, !isTabIndexNaN );
	}
});

// support: jQuery <1.8
if ( !$( "<a>" ).outerWidth( 1 ).jquery ) {
	$.each( [ "Width", "Height" ], function( i, name ) {
		var side = name === "Width" ? [ "Left", "Right" ] : [ "Top", "Bottom" ],
			type = name.toLowerCase(),
			orig = {
				innerWidth: $.fn.innerWidth,
				innerHeight: $.fn.innerHeight,
				outerWidth: $.fn.outerWidth,
				outerHeight: $.fn.outerHeight
			};

		function reduce( elem, size, border, margin ) {
			$.each( side, function() {
				size -= parseFloat( $.css( elem, "padding" + this ) ) || 0;
				if ( border ) {
					size -= parseFloat( $.css( elem, "border" + this + "Width" ) ) || 0;
				}
				if ( margin ) {
					size -= parseFloat( $.css( elem, "margin" + this ) ) || 0;
				}
			});
			return size;
		}

		$.fn[ "inner" + name ] = function( size ) {
			if ( size === undefined ) {
				return orig[ "inner" + name ].call( this );
			}

			return this.each(function() {
				$( this ).css( type, reduce( this, size ) + "px" );
			});
		};

		$.fn[ "outer" + name] = function( size, margin ) {
			if ( typeof size !== "number" ) {
				return orig[ "outer" + name ].call( this, size );
			}

			return this.each(function() {
				$( this).css( type, reduce( this, size, true, margin ) + "px" );
			});
		};
	});
}

// support: jQuery <1.8
if ( !$.fn.addBack ) {
	$.fn.addBack = function( selector ) {
		return this.add( selector == null ?
			this.prevObject : this.prevObject.filter( selector )
		);
	};
}

// support: jQuery 1.6.1, 1.6.2 (http://bugs.jquery.com/ticket/9413)
if ( $( "<a>" ).data( "a-b", "a" ).removeData( "a-b" ).data( "a-b" ) ) {
	$.fn.removeData = (function( removeData ) {
		return function( key ) {
			if ( arguments.length ) {
				return removeData.call( this, $.camelCase( key ) );
			} else {
				return removeData.call( this );
			}
		};
	})( $.fn.removeData );
}

// deprecated
$.ui.ie = !!/msie [\w.]+/.exec( navigator.userAgent.toLowerCase() );

$.fn.extend({
	focus: (function( orig ) {
		return function( delay, fn ) {
			return typeof delay === "number" ?
				this.each(function() {
					var elem = this;
					setTimeout(function() {
						$( elem ).focus();
						if ( fn ) {
							fn.call( elem );
						}
					}, delay );
				}) :
				orig.apply( this, arguments );
		};
	})( $.fn.focus ),

	disableSelection: (function() {
		var eventType = "onselectstart" in document.createElement( "div" ) ?
			"selectstart" :
			"mousedown";

		return function() {
			return this.bind( eventType + ".ui-disableSelection", function( event ) {
				event.preventDefault();
			});
		};
	})(),

	enableSelection: function() {
		return this.unbind( ".ui-disableSelection" );
	},

	zIndex: function( zIndex ) {
		if ( zIndex !== undefined ) {
			return this.css( "zIndex", zIndex );
		}

		if ( this.length ) {
			var elem = $( this[ 0 ] ), position, value;
			while ( elem.length && elem[ 0 ] !== document ) {
				// Ignore z-index if position is set to a value where z-index is ignored by the browser
				// This makes behavior of this function consistent across browsers
				// WebKit always returns auto if the element is positioned
				position = elem.css( "position" );
				if ( position === "absolute" || position === "relative" || position === "fixed" ) {
					// IE returns 0 when zIndex is not specified
					// other browsers return a string
					// we ignore the case of nested elements with an explicit value of 0
					// <div style="z-index: -10;"><div style="z-index: 0;"></div></div>
					value = parseInt( elem.css( "zIndex" ), 10 );
					if ( !isNaN( value ) && value !== 0 ) {
						return value;
					}
				}
				elem = elem.parent();
			}
		}

		return 0;
	}
});

// $.ui.plugin is deprecated. Use $.widget() extensions instead.
$.ui.plugin = {
	add: function( module, option, set ) {
		var i,
			proto = $.ui[ module ].prototype;
		for ( i in set ) {
			proto.plugins[ i ] = proto.plugins[ i ] || [];
			proto.plugins[ i ].push( [ option, set[ i ] ] );
		}
	},
	call: function( instance, name, args, allowDisconnected ) {
		var i,
			set = instance.plugins[ name ];

		if ( !set ) {
			return;
		}

		if ( !allowDisconnected && ( !instance.element[ 0 ].parentNode || instance.element[ 0 ].parentNode.nodeType === 11 ) ) {
			return;
		}

		for ( i = 0; i < set.length; i++ ) {
			if ( instance.options[ set[ i ][ 0 ] ] ) {
				set[ i ][ 1 ].apply( instance.element, args );
			}
		}
	}
};


/*!
 * jQuery UI Widget 1.11.4
 * http://jqueryui.com
 *
 * Copyright jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 *
 * http://api.jqueryui.com/jQuery.widget/
 */


var widget_uuid = 0,
	widget_slice = Array.prototype.slice;

$.cleanData = (function( orig ) {
	return function( elems ) {
		var events, elem, i;
		for ( i = 0; (elem = elems[i]) != null; i++ ) {
			try {

				// Only trigger remove when necessary to save time
				events = $._data( elem, "events" );
				if ( events && events.remove ) {
					$( elem ).triggerHandler( "remove" );
				}

			// http://bugs.jquery.com/ticket/8235
			} catch ( e ) {}
		}
		orig( elems );
	};
})( $.cleanData );

$.widget = function( name, base, prototype ) {
	var fullName, existingConstructor, constructor, basePrototype,
		// proxiedPrototype allows the provided prototype to remain unmodified
		// so that it can be used as a mixin for multiple widgets (#8876)
		proxiedPrototype = {},
		namespace = name.split( "." )[ 0 ];

	name = name.split( "." )[ 1 ];
	fullName = namespace + "-" + name;

	if ( !prototype ) {
		prototype = base;
		base = $.Widget;
	}

	// create selector for plugin
	$.expr[ ":" ][ fullName.toLowerCase() ] = function( elem ) {
		return !!$.data( elem, fullName );
	};

	$[ namespace ] = $[ namespace ] || {};
	existingConstructor = $[ namespace ][ name ];
	constructor = $[ namespace ][ name ] = function( options, element ) {
		// allow instantiation without "new" keyword
		if ( !this._createWidget ) {
			return new constructor( options, element );
		}

		// allow instantiation without initializing for simple inheritance
		// must use "new" keyword (the code above always passes args)
		if ( arguments.length ) {
			this._createWidget( options, element );
		}
	};
	// extend with the existing constructor to carry over any static properties
	$.extend( constructor, existingConstructor, {
		version: prototype.version,
		// copy the object used to create the prototype in case we need to
		// redefine the widget later
		_proto: $.extend( {}, prototype ),
		// track widgets that inherit from this widget in case this widget is
		// redefined after a widget inherits from it
		_childConstructors: []
	});

	basePrototype = new base();
	// we need to make the options hash a property directly on the new instance
	// otherwise we'll modify the options hash on the prototype that we're
	// inheriting from
	basePrototype.options = $.widget.extend( {}, basePrototype.options );
	$.each( prototype, function( prop, value ) {
		if ( !$.isFunction( value ) ) {
			proxiedPrototype[ prop ] = value;
			return;
		}
		proxiedPrototype[ prop ] = (function() {
			var _super = function() {
					return base.prototype[ prop ].apply( this, arguments );
				},
				_superApply = function( args ) {
					return base.prototype[ prop ].apply( this, args );
				};
			return function() {
				var __super = this._super,
					__superApply = this._superApply,
					returnValue;

				this._super = _super;
				this._superApply = _superApply;

				returnValue = value.apply( this, arguments );

				this._super = __super;
				this._superApply = __superApply;

				return returnValue;
			};
		})();
	});
	constructor.prototype = $.widget.extend( basePrototype, {
		// TODO: remove support for widgetEventPrefix
		// always use the name + a colon as the prefix, e.g., draggable:start
		// don't prefix for widgets that aren't DOM-based
		widgetEventPrefix: existingConstructor ? (basePrototype.widgetEventPrefix || name) : name
	}, proxiedPrototype, {
		constructor: constructor,
		namespace: namespace,
		widgetName: name,
		widgetFullName: fullName
	});

	// If this widget is being redefined then we need to find all widgets that
	// are inheriting from it and redefine all of them so that they inherit from
	// the new version of this widget. We're essentially trying to replace one
	// level in the prototype chain.
	if ( existingConstructor ) {
		$.each( existingConstructor._childConstructors, function( i, child ) {
			var childPrototype = child.prototype;

			// redefine the child widget using the same prototype that was
			// originally used, but inherit from the new version of the base
			$.widget( childPrototype.namespace + "." + childPrototype.widgetName, constructor, child._proto );
		});
		// remove the list of existing child constructors from the old constructor
		// so the old child constructors can be garbage collected
		delete existingConstructor._childConstructors;
	} else {
		base._childConstructors.push( constructor );
	}

	$.widget.bridge( name, constructor );

	return constructor;
};

$.widget.extend = function( target ) {
	var input = widget_slice.call( arguments, 1 ),
		inputIndex = 0,
		inputLength = input.length,
		key,
		value;
	for ( ; inputIndex < inputLength; inputIndex++ ) {
		for ( key in input[ inputIndex ] ) {
			value = input[ inputIndex ][ key ];
			if ( input[ inputIndex ].hasOwnProperty( key ) && value !== undefined ) {
				// Clone objects
				if ( $.isPlainObject( value ) ) {
					target[ key ] = $.isPlainObject( target[ key ] ) ?
						$.widget.extend( {}, target[ key ], value ) :
						// Don't extend strings, arrays, etc. with objects
						$.widget.extend( {}, value );
				// Copy everything else by reference
				} else {
					target[ key ] = value;
				}
			}
		}
	}
	return target;
};

$.widget.bridge = function( name, object ) {
	var fullName = object.prototype.widgetFullName || name;
	$.fn[ name ] = function( options ) {
		var isMethodCall = typeof options === "string",
			args = widget_slice.call( arguments, 1 ),
			returnValue = this;

		if ( isMethodCall ) {
			this.each(function() {
				var methodValue,
					instance = $.data( this, fullName );
				if ( options === "instance" ) {
					returnValue = instance;
					return false;
				}
				if ( !instance ) {
					return $.error( "cannot call methods on " + name + " prior to initialization; " +
						"attempted to call method '" + options + "'" );
				}
				if ( !$.isFunction( instance[options] ) || options.charAt( 0 ) === "_" ) {
					return $.error( "no such method '" + options + "' for " + name + " widget instance" );
				}
				methodValue = instance[ options ].apply( instance, args );
				if ( methodValue !== instance && methodValue !== undefined ) {
					returnValue = methodValue && methodValue.jquery ?
						returnValue.pushStack( methodValue.get() ) :
						methodValue;
					return false;
				}
			});
		} else {

			// Allow multiple hashes to be passed on init
			if ( args.length ) {
				options = $.widget.extend.apply( null, [ options ].concat(args) );
			}

			this.each(function() {
				var instance = $.data( this, fullName );
				if ( instance ) {
					instance.option( options || {} );
					if ( instance._init ) {
						instance._init();
					}
				} else {
					$.data( this, fullName, new object( options, this ) );
				}
			});
		}

		return returnValue;
	};
};

$.Widget = function( /* options, element */ ) {};
$.Widget._childConstructors = [];

$.Widget.prototype = {
	widgetName: "widget",
	widgetEventPrefix: "",
	defaultElement: "<div>",
	options: {
		disabled: false,

		// callbacks
		create: null
	},
	_createWidget: function( options, element ) {
		element = $( element || this.defaultElement || this )[ 0 ];
		this.element = $( element );
		this.uuid = widget_uuid++;
		this.eventNamespace = "." + this.widgetName + this.uuid;

		this.bindings = $();
		this.hoverable = $();
		this.focusable = $();

		if ( element !== this ) {
			$.data( element, this.widgetFullName, this );
			this._on( true, this.element, {
				remove: function( event ) {
					if ( event.target === element ) {
						this.destroy();
					}
				}
			});
			this.document = $( element.style ?
				// element within the document
				element.ownerDocument :
				// element is window or document
				element.document || element );
			this.window = $( this.document[0].defaultView || this.document[0].parentWindow );
		}

		this.options = $.widget.extend( {},
			this.options,
			this._getCreateOptions(),
			options );

		this._create();
		this._trigger( "create", null, this._getCreateEventData() );
		this._init();
	},
	_getCreateOptions: $.noop,
	_getCreateEventData: $.noop,
	_create: $.noop,
	_init: $.noop,

	destroy: function() {
		this._destroy();
		// we can probably remove the unbind calls in 2.0
		// all event bindings should go through this._on()
		this.element
			.unbind( this.eventNamespace )
			.removeData( this.widgetFullName )
			// support: jquery <1.6.3
			// http://bugs.jquery.com/ticket/9413
			.removeData( $.camelCase( this.widgetFullName ) );
		this.widget()
			.unbind( this.eventNamespace )
			.removeAttr( "aria-disabled" )
			.removeClass(
				this.widgetFullName + "-disabled " +
				"ui-state-disabled" );

		// clean up events and states
		this.bindings.unbind( this.eventNamespace );
		this.hoverable.removeClass( "ui-state-hover" );
		this.focusable.removeClass( "ui-state-focus" );
	},
	_destroy: $.noop,

	widget: function() {
		return this.element;
	},

	option: function( key, value ) {
		var options = key,
			parts,
			curOption,
			i;

		if ( arguments.length === 0 ) {
			// don't return a reference to the internal hash
			return $.widget.extend( {}, this.options );
		}

		if ( typeof key === "string" ) {
			// handle nested keys, e.g., "foo.bar" => { foo: { bar: ___ } }
			options = {};
			parts = key.split( "." );
			key = parts.shift();
			if ( parts.length ) {
				curOption = options[ key ] = $.widget.extend( {}, this.options[ key ] );
				for ( i = 0; i < parts.length - 1; i++ ) {
					curOption[ parts[ i ] ] = curOption[ parts[ i ] ] || {};
					curOption = curOption[ parts[ i ] ];
				}
				key = parts.pop();
				if ( arguments.length === 1 ) {
					return curOption[ key ] === undefined ? null : curOption[ key ];
				}
				curOption[ key ] = value;
			} else {
				if ( arguments.length === 1 ) {
					return this.options[ key ] === undefined ? null : this.options[ key ];
				}
				options[ key ] = value;
			}
		}

		this._setOptions( options );

		return this;
	},
	_setOptions: function( options ) {
		var key;

		for ( key in options ) {
			this._setOption( key, options[ key ] );
		}

		return this;
	},
	_setOption: function( key, value ) {
		this.options[ key ] = value;

		if ( key === "disabled" ) {
			this.widget()
				.toggleClass( this.widgetFullName + "-disabled", !!value );

			// If the widget is becoming disabled, then nothing is interactive
			if ( value ) {
				this.hoverable.removeClass( "ui-state-hover" );
				this.focusable.removeClass( "ui-state-focus" );
			}
		}

		return this;
	},

	enable: function() {
		return this._setOptions({ disabled: false });
	},
	disable: function() {
		return this._setOptions({ disabled: true });
	},

	_on: function( suppressDisabledCheck, element, handlers ) {
		var delegateElement,
			instance = this;

		// no suppressDisabledCheck flag, shuffle arguments
		if ( typeof suppressDisabledCheck !== "boolean" ) {
			handlers = element;
			element = suppressDisabledCheck;
			suppressDisabledCheck = false;
		}

		// no element argument, shuffle and use this.element
		if ( !handlers ) {
			handlers = element;
			element = this.element;
			delegateElement = this.widget();
		} else {
			element = delegateElement = $( element );
			this.bindings = this.bindings.add( element );
		}

		$.each( handlers, function( event, handler ) {
			function handlerProxy() {
				// allow widgets to customize the disabled handling
				// - disabled as an array instead of boolean
				// - disabled class as method for disabling individual parts
				if ( !suppressDisabledCheck &&
						( instance.options.disabled === true ||
							$( this ).hasClass( "ui-state-disabled" ) ) ) {
					return;
				}
				return ( typeof handler === "string" ? instance[ handler ] : handler )
					.apply( instance, arguments );
			}

			// copy the guid so direct unbinding works
			if ( typeof handler !== "string" ) {
				handlerProxy.guid = handler.guid =
					handler.guid || handlerProxy.guid || $.guid++;
			}

			var match = event.match( /^([\w:-]*)\s*(.*)$/ ),
				eventName = match[1] + instance.eventNamespace,
				selector = match[2];
			if ( selector ) {
				delegateElement.delegate( selector, eventName, handlerProxy );
			} else {
				element.bind( eventName, handlerProxy );
			}
		});
	},

	_off: function( element, eventName ) {
		eventName = (eventName || "").split( " " ).join( this.eventNamespace + " " ) +
			this.eventNamespace;
		element.unbind( eventName ).undelegate( eventName );

		// Clear the stack to avoid memory leaks (#10056)
		this.bindings = $( this.bindings.not( element ).get() );
		this.focusable = $( this.focusable.not( element ).get() );
		this.hoverable = $( this.hoverable.not( element ).get() );
	},

	_delay: function( handler, delay ) {
		function handlerProxy() {
			return ( typeof handler === "string" ? instance[ handler ] : handler )
				.apply( instance, arguments );
		}
		var instance = this;
		return setTimeout( handlerProxy, delay || 0 );
	},

	_hoverable: function( element ) {
		this.hoverable = this.hoverable.add( element );
		this._on( element, {
			mouseenter: function( event ) {
				$( event.currentTarget ).addClass( "ui-state-hover" );
			},
			mouseleave: function( event ) {
				$( event.currentTarget ).removeClass( "ui-state-hover" );
			}
		});
	},

	_focusable: function( element ) {
		this.focusable = this.focusable.add( element );
		this._on( element, {
			focusin: function( event ) {
				$( event.currentTarget ).addClass( "ui-state-focus" );
			},
			focusout: function( event ) {
				$( event.currentTarget ).removeClass( "ui-state-focus" );
			}
		});
	},

	_trigger: function( type, event, data ) {
		var prop, orig,
			callback = this.options[ type ];

		data = data || {};
		event = $.Event( event );
		event.type = ( type === this.widgetEventPrefix ?
			type :
			this.widgetEventPrefix + type ).toLowerCase();
		// the original event may come from any element
		// so we need to reset the target on the new event
		event.target = this.element[ 0 ];

		// copy original event properties over to the new event
		orig = event.originalEvent;
		if ( orig ) {
			for ( prop in orig ) {
				if ( !( prop in event ) ) {
					event[ prop ] = orig[ prop ];
				}
			}
		}

		this.element.trigger( event, data );
		return !( $.isFunction( callback ) &&
			callback.apply( this.element[0], [ event ].concat( data ) ) === false ||
			event.isDefaultPrevented() );
	}
};

$.each( { show: "fadeIn", hide: "fadeOut" }, function( method, defaultEffect ) {
	$.Widget.prototype[ "_" + method ] = function( element, options, callback ) {
		if ( typeof options === "string" ) {
			options = { effect: options };
		}
		var hasOptions,
			effectName = !options ?
				method :
				options === true || typeof options === "number" ?
					defaultEffect :
					options.effect || defaultEffect;
		options = options || {};
		if ( typeof options === "number" ) {
			options = { duration: options };
		}
		hasOptions = !$.isEmptyObject( options );
		options.complete = callback;
		if ( options.delay ) {
			element.delay( options.delay );
		}
		if ( hasOptions && $.effects && $.effects.effect[ effectName ] ) {
			element[ method ]( options );
		} else if ( effectName !== method && element[ effectName ] ) {
			element[ effectName ]( options.duration, options.easing, callback );
		} else {
			element.queue(function( next ) {
				$( this )[ method ]();
				if ( callback ) {
					callback.call( element[ 0 ] );
				}
				next();
			});
		}
	};
});

var widget = $.widget;


/*!
 * jQuery UI Mouse 1.11.4
 * http://jqueryui.com
 *
 * Copyright jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 *
 * http://api.jqueryui.com/mouse/
 */


var mouseHandled = false;
$( document ).mouseup( function() {
	mouseHandled = false;
});

var mouse = $.widget("ui.mouse", {
	version: "1.11.4",
	options: {
		cancel: "input,textarea,button,select,option",
		distance: 1,
		delay: 0
	},
	_mouseInit: function() {
		var that = this;

		this.element
			.bind("mousedown." + this.widgetName, function(event) {
				return that._mouseDown(event);
			})
			.bind("click." + this.widgetName, function(event) {
				if (true === $.data(event.target, that.widgetName + ".preventClickEvent")) {
					$.removeData(event.target, that.widgetName + ".preventClickEvent");
					event.stopImmediatePropagation();
					return false;
				}
			});

		this.started = false;
	},

	// TODO: make sure destroying one instance of mouse doesn't mess with
	// other instances of mouse
	_mouseDestroy: function() {
		this.element.unbind("." + this.widgetName);
		if ( this._mouseMoveDelegate ) {
			this.document
				.unbind("mousemove." + this.widgetName, this._mouseMoveDelegate)
				.unbind("mouseup." + this.widgetName, this._mouseUpDelegate);
		}
	},

	_mouseDown: function(event) {
		// don't let more than one widget handle mouseStart
		if ( mouseHandled ) {
			return;
		}

		this._mouseMoved = false;

		// we may have missed mouseup (out of window)
		(this._mouseStarted && this._mouseUp(event));

		this._mouseDownEvent = event;

		var that = this,
			btnIsLeft = (event.which === 1),
			// event.target.nodeName works around a bug in IE 8 with
			// disabled inputs (#7620)
			elIsCancel = (typeof this.options.cancel === "string" && event.target.nodeName ? $(event.target).closest(this.options.cancel).length : false);
		if (!btnIsLeft || elIsCancel || !this._mouseCapture(event)) {
			return true;
		}

		this.mouseDelayMet = !this.options.delay;
		if (!this.mouseDelayMet) {
			this._mouseDelayTimer = setTimeout(function() {
				that.mouseDelayMet = true;
			}, this.options.delay);
		}

		if (this._mouseDistanceMet(event) && this._mouseDelayMet(event)) {
			this._mouseStarted = (this._mouseStart(event) !== false);
			if (!this._mouseStarted) {
				event.preventDefault();
				return true;
			}
		}

		// Click event may never have fired (Gecko & Opera)
		if (true === $.data(event.target, this.widgetName + ".preventClickEvent")) {
			$.removeData(event.target, this.widgetName + ".preventClickEvent");
		}

		// these delegates are required to keep context
		this._mouseMoveDelegate = function(event) {
			return that._mouseMove(event);
		};
		this._mouseUpDelegate = function(event) {
			return that._mouseUp(event);
		};

		this.document
			.bind( "mousemove." + this.widgetName, this._mouseMoveDelegate )
			.bind( "mouseup." + this.widgetName, this._mouseUpDelegate );

		event.preventDefault();

		mouseHandled = true;
		return true;
	},

	_mouseMove: function(event) {
		// Only check for mouseups outside the document if you've moved inside the document
		// at least once. This prevents the firing of mouseup in the case of IE<9, which will
		// fire a mousemove event if content is placed under the cursor. See #7778
		// Support: IE <9
		if ( this._mouseMoved ) {
			// IE mouseup check - mouseup happened when mouse was out of window
			if ($.ui.ie && ( !document.documentMode || document.documentMode < 9 ) && !event.button) {
				return this._mouseUp(event);

			// Iframe mouseup check - mouseup occurred in another document
			} else if ( !event.which ) {
				return this._mouseUp( event );
			}
		}

		if ( event.which || event.button ) {
			this._mouseMoved = true;
		}

		if (this._mouseStarted) {
			this._mouseDrag(event);
			return event.preventDefault();
		}

		if (this._mouseDistanceMet(event) && this._mouseDelayMet(event)) {
			this._mouseStarted =
				(this._mouseStart(this._mouseDownEvent, event) !== false);
			(this._mouseStarted ? this._mouseDrag(event) : this._mouseUp(event));
		}

		return !this._mouseStarted;
	},

	_mouseUp: function(event) {
		this.document
			.unbind( "mousemove." + this.widgetName, this._mouseMoveDelegate )
			.unbind( "mouseup." + this.widgetName, this._mouseUpDelegate );

		if (this._mouseStarted) {
			this._mouseStarted = false;

			if (event.target === this._mouseDownEvent.target) {
				$.data(event.target, this.widgetName + ".preventClickEvent", true);
			}

			this._mouseStop(event);
		}

		mouseHandled = false;
		return false;
	},

	_mouseDistanceMet: function(event) {
		return (Math.max(
				Math.abs(this._mouseDownEvent.pageX - event.pageX),
				Math.abs(this._mouseDownEvent.pageY - event.pageY)
			) >= this.options.distance
		);
	},

	_mouseDelayMet: function(/* event */) {
		return this.mouseDelayMet;
	},

	// These are placeholder methods, to be overriden by extending plugin
	_mouseStart: function(/* event */) {},
	_mouseDrag: function(/* event */) {},
	_mouseStop: function(/* event */) {},
	_mouseCapture: function(/* event */) { return true; }
});


/*!
 * jQuery UI Position 1.11.4
 * http://jqueryui.com
 *
 * Copyright jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 *
 * http://api.jqueryui.com/position/
 */

(function() {

$.ui = $.ui || {};

var cachedScrollbarWidth, supportsOffsetFractions,
	max = Math.max,
	abs = Math.abs,
	round = Math.round,
	rhorizontal = /left|center|right/,
	rvertical = /top|center|bottom/,
	roffset = /[\+\-]\d+(\.[\d]+)?%?/,
	rposition = /^\w+/,
	rpercent = /%$/,
	_position = $.fn.position;

function getOffsets( offsets, width, height ) {
	return [
		parseFloat( offsets[ 0 ] ) * ( rpercent.test( offsets[ 0 ] ) ? width / 100 : 1 ),
		parseFloat( offsets[ 1 ] ) * ( rpercent.test( offsets[ 1 ] ) ? height / 100 : 1 )
	];
}

function parseCss( element, property ) {
	return parseInt( $.css( element, property ), 10 ) || 0;
}

function getDimensions( elem ) {
	var raw = elem[0];
	if ( raw.nodeType === 9 ) {
		return {
			width: elem.width(),
			height: elem.height(),
			offset: { top: 0, left: 0 }
		};
	}
	if ( $.isWindow( raw ) ) {
		return {
			width: elem.width(),
			height: elem.height(),
			offset: { top: elem.scrollTop(), left: elem.scrollLeft() }
		};
	}
	if ( raw.preventDefault ) {
		return {
			width: 0,
			height: 0,
			offset: { top: raw.pageY, left: raw.pageX }
		};
	}
	return {
		width: elem.outerWidth(),
		height: elem.outerHeight(),
		offset: elem.offset()
	};
}

$.position = {
	scrollbarWidth: function() {
		if ( cachedScrollbarWidth !== undefined ) {
			return cachedScrollbarWidth;
		}
		var w1, w2,
			div = $( "<div style='display:block;position:absolute;width:50px;height:50px;overflow:hidden;'><div style='height:100px;width:auto;'></div></div>" ),
			innerDiv = div.children()[0];

		$( "body" ).append( div );
		w1 = innerDiv.offsetWidth;
		div.css( "overflow", "scroll" );

		w2 = innerDiv.offsetWidth;

		if ( w1 === w2 ) {
			w2 = div[0].clientWidth;
		}

		div.remove();

		return (cachedScrollbarWidth = w1 - w2);
	},
	getScrollInfo: function( within ) {
		var overflowX = within.isWindow || within.isDocument ? "" :
				within.element.css( "overflow-x" ),
			overflowY = within.isWindow || within.isDocument ? "" :
				within.element.css( "overflow-y" ),
			hasOverflowX = overflowX === "scroll" ||
				( overflowX === "auto" && within.width < within.element[0].scrollWidth ),
			hasOverflowY = overflowY === "scroll" ||
				( overflowY === "auto" && within.height < within.element[0].scrollHeight );
		return {
			width: hasOverflowY ? $.position.scrollbarWidth() : 0,
			height: hasOverflowX ? $.position.scrollbarWidth() : 0
		};
	},
	getWithinInfo: function( element ) {
		var withinElement = $( element || window ),
			isWindow = $.isWindow( withinElement[0] ),
			isDocument = !!withinElement[ 0 ] && withinElement[ 0 ].nodeType === 9;
		return {
			element: withinElement,
			isWindow: isWindow,
			isDocument: isDocument,
			offset: withinElement.offset() || { left: 0, top: 0 },
			scrollLeft: withinElement.scrollLeft(),
			scrollTop: withinElement.scrollTop(),

			// support: jQuery 1.6.x
			// jQuery 1.6 doesn't support .outerWidth/Height() on documents or windows
			width: isWindow || isDocument ? withinElement.width() : withinElement.outerWidth(),
			height: isWindow || isDocument ? withinElement.height() : withinElement.outerHeight()
		};
	}
};

$.fn.position = function( options ) {
	if ( !options || !options.of ) {
		return _position.apply( this, arguments );
	}

	// make a copy, we don't want to modify arguments
	options = $.extend( {}, options );

	var atOffset, targetWidth, targetHeight, targetOffset, basePosition, dimensions,
		target = $( options.of ),
		within = $.position.getWithinInfo( options.within ),
		scrollInfo = $.position.getScrollInfo( within ),
		collision = ( options.collision || "flip" ).split( " " ),
		offsets = {};

	dimensions = getDimensions( target );
	if ( target[0].preventDefault ) {
		// force left top to allow flipping
		options.at = "left top";
	}
	targetWidth = dimensions.width;
	targetHeight = dimensions.height;
	targetOffset = dimensions.offset;
	// clone to reuse original targetOffset later
	basePosition = $.extend( {}, targetOffset );

	// force my and at to have valid horizontal and vertical positions
	// if a value is missing or invalid, it will be converted to center
	$.each( [ "my", "at" ], function() {
		var pos = ( options[ this ] || "" ).split( " " ),
			horizontalOffset,
			verticalOffset;

		if ( pos.length === 1) {
			pos = rhorizontal.test( pos[ 0 ] ) ?
				pos.concat( [ "center" ] ) :
				rvertical.test( pos[ 0 ] ) ?
					[ "center" ].concat( pos ) :
					[ "center", "center" ];
		}
		pos[ 0 ] = rhorizontal.test( pos[ 0 ] ) ? pos[ 0 ] : "center";
		pos[ 1 ] = rvertical.test( pos[ 1 ] ) ? pos[ 1 ] : "center";

		// calculate offsets
		horizontalOffset = roffset.exec( pos[ 0 ] );
		verticalOffset = roffset.exec( pos[ 1 ] );
		offsets[ this ] = [
			horizontalOffset ? horizontalOffset[ 0 ] : 0,
			verticalOffset ? verticalOffset[ 0 ] : 0
		];

		// reduce to just the positions without the offsets
		options[ this ] = [
			rposition.exec( pos[ 0 ] )[ 0 ],
			rposition.exec( pos[ 1 ] )[ 0 ]
		];
	});

	// normalize collision option
	if ( collision.length === 1 ) {
		collision[ 1 ] = collision[ 0 ];
	}

	if ( options.at[ 0 ] === "right" ) {
		basePosition.left += targetWidth;
	} else if ( options.at[ 0 ] === "center" ) {
		basePosition.left += targetWidth / 2;
	}

	if ( options.at[ 1 ] === "bottom" ) {
		basePosition.top += targetHeight;
	} else if ( options.at[ 1 ] === "center" ) {
		basePosition.top += targetHeight / 2;
	}

	atOffset = getOffsets( offsets.at, targetWidth, targetHeight );
	basePosition.left += atOffset[ 0 ];
	basePosition.top += atOffset[ 1 ];

	return this.each(function() {
		var collisionPosition, using,
			elem = $( this ),
			elemWidth = elem.outerWidth(),
			elemHeight = elem.outerHeight(),
			marginLeft = parseCss( this, "marginLeft" ),
			marginTop = parseCss( this, "marginTop" ),
			collisionWidth = elemWidth + marginLeft + parseCss( this, "marginRight" ) + scrollInfo.width,
			collisionHeight = elemHeight + marginTop + parseCss( this, "marginBottom" ) + scrollInfo.height,
			position = $.extend( {}, basePosition ),
			myOffset = getOffsets( offsets.my, elem.outerWidth(), elem.outerHeight() );

		if ( options.my[ 0 ] === "right" ) {
			position.left -= elemWidth;
		} else if ( options.my[ 0 ] === "center" ) {
			position.left -= elemWidth / 2;
		}

		if ( options.my[ 1 ] === "bottom" ) {
			position.top -= elemHeight;
		} else if ( options.my[ 1 ] === "center" ) {
			position.top -= elemHeight / 2;
		}

		position.left += myOffset[ 0 ];
		position.top += myOffset[ 1 ];

		// if the browser doesn't support fractions, then round for consistent results
		if ( !supportsOffsetFractions ) {
			position.left = round( position.left );
			position.top = round( position.top );
		}

		collisionPosition = {
			marginLeft: marginLeft,
			marginTop: marginTop
		};

		$.each( [ "left", "top" ], function( i, dir ) {
			if ( $.ui.position[ collision[ i ] ] ) {
				$.ui.position[ collision[ i ] ][ dir ]( position, {
					targetWidth: targetWidth,
					targetHeight: targetHeight,
					elemWidth: elemWidth,
					elemHeight: elemHeight,
					collisionPosition: collisionPosition,
					collisionWidth: collisionWidth,
					collisionHeight: collisionHeight,
					offset: [ atOffset[ 0 ] + myOffset[ 0 ], atOffset [ 1 ] + myOffset[ 1 ] ],
					my: options.my,
					at: options.at,
					within: within,
					elem: elem
				});
			}
		});

		if ( options.using ) {
			// adds feedback as second argument to using callback, if present
			using = function( props ) {
				var left = targetOffset.left - position.left,
					right = left + targetWidth - elemWidth,
					top = targetOffset.top - position.top,
					bottom = top + targetHeight - elemHeight,
					feedback = {
						target: {
							element: target,
							left: targetOffset.left,
							top: targetOffset.top,
							width: targetWidth,
							height: targetHeight
						},
						element: {
							element: elem,
							left: position.left,
							top: position.top,
							width: elemWidth,
							height: elemHeight
						},
						horizontal: right < 0 ? "left" : left > 0 ? "right" : "center",
						vertical: bottom < 0 ? "top" : top > 0 ? "bottom" : "middle"
					};
				if ( targetWidth < elemWidth && abs( left + right ) < targetWidth ) {
					feedback.horizontal = "center";
				}
				if ( targetHeight < elemHeight && abs( top + bottom ) < targetHeight ) {
					feedback.vertical = "middle";
				}
				if ( max( abs( left ), abs( right ) ) > max( abs( top ), abs( bottom ) ) ) {
					feedback.important = "horizontal";
				} else {
					feedback.important = "vertical";
				}
				options.using.call( this, props, feedback );
			};
		}

		elem.offset( $.extend( position, { using: using } ) );
	});
};

$.ui.position = {
	fit: {
		left: function( position, data ) {
			var within = data.within,
				withinOffset = within.isWindow ? within.scrollLeft : within.offset.left,
				outerWidth = within.width,
				collisionPosLeft = position.left - data.collisionPosition.marginLeft,
				overLeft = withinOffset - collisionPosLeft,
				overRight = collisionPosLeft + data.collisionWidth - outerWidth - withinOffset,
				newOverRight;

			// element is wider than within
			if ( data.collisionWidth > outerWidth ) {
				// element is initially over the left side of within
				if ( overLeft > 0 && overRight <= 0 ) {
					newOverRight = position.left + overLeft + data.collisionWidth - outerWidth - withinOffset;
					position.left += overLeft - newOverRight;
				// element is initially over right side of within
				} else if ( overRight > 0 && overLeft <= 0 ) {
					position.left = withinOffset;
				// element is initially over both left and right sides of within
				} else {
					if ( overLeft > overRight ) {
						position.left = withinOffset + outerWidth - data.collisionWidth;
					} else {
						position.left = withinOffset;
					}
				}
			// too far left -> align with left edge
			} else if ( overLeft > 0 ) {
				position.left += overLeft;
			// too far right -> align with right edge
			} else if ( overRight > 0 ) {
				position.left -= overRight;
			// adjust based on position and margin
			} else {
				position.left = max( position.left - collisionPosLeft, position.left );
			}
		},
		top: function( position, data ) {
			var within = data.within,
				withinOffset = within.isWindow ? within.scrollTop : within.offset.top,
				outerHeight = data.within.height,
				collisionPosTop = position.top - data.collisionPosition.marginTop,
				overTop = withinOffset - collisionPosTop,
				overBottom = collisionPosTop + data.collisionHeight - outerHeight - withinOffset,
				newOverBottom;

			// element is taller than within
			if ( data.collisionHeight > outerHeight ) {
				// element is initially over the top of within
				if ( overTop > 0 && overBottom <= 0 ) {
					newOverBottom = position.top + overTop + data.collisionHeight - outerHeight - withinOffset;
					position.top += overTop - newOverBottom;
				// element is initially over bottom of within
				} else if ( overBottom > 0 && overTop <= 0 ) {
					position.top = withinOffset;
				// element is initially over both top and bottom of within
				} else {
					if ( overTop > overBottom ) {
						position.top = withinOffset + outerHeight - data.collisionHeight;
					} else {
						position.top = withinOffset;
					}
				}
			// too far up -> align with top
			} else if ( overTop > 0 ) {
				position.top += overTop;
			// too far down -> align with bottom edge
			} else if ( overBottom > 0 ) {
				position.top -= overBottom;
			// adjust based on position and margin
			} else {
				position.top = max( position.top - collisionPosTop, position.top );
			}
		}
	},
	flip: {
		left: function( position, data ) {
			var within = data.within,
				withinOffset = within.offset.left + within.scrollLeft,
				outerWidth = within.width,
				offsetLeft = within.isWindow ? within.scrollLeft : within.offset.left,
				collisionPosLeft = position.left - data.collisionPosition.marginLeft,
				overLeft = collisionPosLeft - offsetLeft,
				overRight = collisionPosLeft + data.collisionWidth - outerWidth - offsetLeft,
				myOffset = data.my[ 0 ] === "left" ?
					-data.elemWidth :
					data.my[ 0 ] === "right" ?
						data.elemWidth :
						0,
				atOffset = data.at[ 0 ] === "left" ?
					data.targetWidth :
					data.at[ 0 ] === "right" ?
						-data.targetWidth :
						0,
				offset = -2 * data.offset[ 0 ],
				newOverRight,
				newOverLeft;

			if ( overLeft < 0 ) {
				newOverRight = position.left + myOffset + atOffset + offset + data.collisionWidth - outerWidth - withinOffset;
				if ( newOverRight < 0 || newOverRight < abs( overLeft ) ) {
					position.left += myOffset + atOffset + offset;
				}
			} else if ( overRight > 0 ) {
				newOverLeft = position.left - data.collisionPosition.marginLeft + myOffset + atOffset + offset - offsetLeft;
				if ( newOverLeft > 0 || abs( newOverLeft ) < overRight ) {
					position.left += myOffset + atOffset + offset;
				}
			}
		},
		top: function( position, data ) {
			var within = data.within,
				withinOffset = within.offset.top + within.scrollTop,
				outerHeight = within.height,
				offsetTop = within.isWindow ? within.scrollTop : within.offset.top,
				collisionPosTop = position.top - data.collisionPosition.marginTop,
				overTop = collisionPosTop - offsetTop,
				overBottom = collisionPosTop + data.collisionHeight - outerHeight - offsetTop,
				top = data.my[ 1 ] === "top",
				myOffset = top ?
					-data.elemHeight :
					data.my[ 1 ] === "bottom" ?
						data.elemHeight :
						0,
				atOffset = data.at[ 1 ] === "top" ?
					data.targetHeight :
					data.at[ 1 ] === "bottom" ?
						-data.targetHeight :
						0,
				offset = -2 * data.offset[ 1 ],
				newOverTop,
				newOverBottom;
			if ( overTop < 0 ) {
				newOverBottom = position.top + myOffset + atOffset + offset + data.collisionHeight - outerHeight - withinOffset;
				if ( newOverBottom < 0 || newOverBottom < abs( overTop ) ) {
					position.top += myOffset + atOffset + offset;
				}
			} else if ( overBottom > 0 ) {
				newOverTop = position.top - data.collisionPosition.marginTop + myOffset + atOffset + offset - offsetTop;
				if ( newOverTop > 0 || abs( newOverTop ) < overBottom ) {
					position.top += myOffset + atOffset + offset;
				}
			}
		}
	},
	flipfit: {
		left: function() {
			$.ui.position.flip.left.apply( this, arguments );
			$.ui.position.fit.left.apply( this, arguments );
		},
		top: function() {
			$.ui.position.flip.top.apply( this, arguments );
			$.ui.position.fit.top.apply( this, arguments );
		}
	}
};

// fraction support test
(function() {
	var testElement, testElementParent, testElementStyle, offsetLeft, i,
		body = document.getElementsByTagName( "body" )[ 0 ],
		div = document.createElement( "div" );

	//Create a "fake body" for testing based on method used in jQuery.support
	testElement = document.createElement( body ? "div" : "body" );
	testElementStyle = {
		visibility: "hidden",
		width: 0,
		height: 0,
		border: 0,
		margin: 0,
		background: "none"
	};
	if ( body ) {
		$.extend( testElementStyle, {
			position: "absolute",
			left: "-1000px",
			top: "-1000px"
		});
	}
	for ( i in testElementStyle ) {
		testElement.style[ i ] = testElementStyle[ i ];
	}
	testElement.appendChild( div );
	testElementParent = body || document.documentElement;
	testElementParent.insertBefore( testElement, testElementParent.firstChild );

	div.style.cssText = "position: absolute; left: 10.7432222px;";

	offsetLeft = $( div ).offset().left;
	supportsOffsetFractions = offsetLeft > 10 && offsetLeft < 11;

	testElement.innerHTML = "";
	testElementParent.removeChild( testElement );
})();

})();

var position = $.ui.position;


/*!
 * jQuery UI Draggable 1.11.4
 * http://jqueryui.com
 *
 * Copyright jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 *
 * http://api.jqueryui.com/draggable/
 */


$.widget("ui.draggable", $.ui.mouse, {
	version: "1.11.4",
	widgetEventPrefix: "drag",
	options: {
		addClasses: true,
		appendTo: "parent",
		axis: false,
		connectToSortable: false,
		containment: false,
		cursor: "auto",
		cursorAt: false,
		grid: false,
		handle: false,
		helper: "original",
		iframeFix: false,
		opacity: false,
		refreshPositions: false,
		revert: false,
		revertDuration: 500,
		scope: "default",
		scroll: true,
		scrollSensitivity: 20,
		scrollSpeed: 20,
		snap: false,
		snapMode: "both",
		snapTolerance: 20,
		stack: false,
		zIndex: false,

		// callbacks
		drag: null,
		start: null,
		stop: null
	},
	_create: function() {

		if ( this.options.helper === "original" ) {
			this._setPositionRelative();
		}
		if (this.options.addClasses){
			this.element.addClass("ui-draggable");
		}
		if (this.options.disabled){
			this.element.addClass("ui-draggable-disabled");
		}
		this._setHandleClassName();

		this._mouseInit();
	},

	_setOption: function( key, value ) {
		this._super( key, value );
		if ( key === "handle" ) {
			this._removeHandleClassName();
			this._setHandleClassName();
		}
	},

	_destroy: function() {
		if ( ( this.helper || this.element ).is( ".ui-draggable-dragging" ) ) {
			this.destroyOnClear = true;
			return;
		}
		this.element.removeClass( "ui-draggable ui-draggable-dragging ui-draggable-disabled" );
		this._removeHandleClassName();
		this._mouseDestroy();
	},

	_mouseCapture: function(event) {
		var o = this.options;

		this._blurActiveElement( event );

		// among others, prevent a drag on a resizable-handle
		if (this.helper || o.disabled || $(event.target).closest(".ui-resizable-handle").length > 0) {
			return false;
		}

		//Quit if we're not on a valid handle
		this.handle = this._getHandle(event);
		if (!this.handle) {
			return false;
		}

		this._blockFrames( o.iframeFix === true ? "iframe" : o.iframeFix );

		return true;

	},

	_blockFrames: function( selector ) {
		this.iframeBlocks = this.document.find( selector ).map(function() {
			var iframe = $( this );

			return $( "<div>" )
				.css( "position", "absolute" )
				.appendTo( iframe.parent() )
				.outerWidth( iframe.outerWidth() )
				.outerHeight( iframe.outerHeight() )
				.offset( iframe.offset() )[ 0 ];
		});
	},

	_unblockFrames: function() {
		if ( this.iframeBlocks ) {
			this.iframeBlocks.remove();
			delete this.iframeBlocks;
		}
	},

	_blurActiveElement: function( event ) {
		var document = this.document[ 0 ];

		// Only need to blur if the event occurred on the draggable itself, see #10527
		if ( !this.handleElement.is( event.target ) ) {
			return;
		}

		// support: IE9
		// IE9 throws an "Unspecified error" accessing document.activeElement from an <iframe>
		try {

			// Support: IE9, IE10
			// If the <body> is blurred, IE will switch windows, see #9520
			if ( document.activeElement && document.activeElement.nodeName.toLowerCase() !== "body" ) {

				// Blur any element that currently has focus, see #4261
				$( document.activeElement ).blur();
			}
		} catch ( error ) {}
	},

	_mouseStart: function(event) {

		var o = this.options;

		//Create and append the visible helper
		this.helper = this._createHelper(event);

		this.helper.addClass("ui-draggable-dragging");

		//Cache the helper size
		this._cacheHelperProportions();

		//If ddmanager is used for droppables, set the global draggable
		if ($.ui.ddmanager) {
			$.ui.ddmanager.current = this;
		}

		/*
		 * - Position generation -
		 * This block generates everything position related - it's the core of draggables.
		 */

		//Cache the margins of the original element
		this._cacheMargins();

		//Store the helper's css position
		this.cssPosition = this.helper.css( "position" );
		this.scrollParent = this.helper.scrollParent( true );
		this.offsetParent = this.helper.offsetParent();
		this.hasFixedAncestor = this.helper.parents().filter(function() {
				return $( this ).css( "position" ) === "fixed";
			}).length > 0;

		//The element's absolute position on the page minus margins
		this.positionAbs = this.element.offset();
		this._refreshOffsets( event );

		//Generate the original position
		this.originalPosition = this.position = this._generatePosition( event, false );
		this.originalPageX = event.pageX;
		this.originalPageY = event.pageY;

		//Adjust the mouse offset relative to the helper if "cursorAt" is supplied
		(o.cursorAt && this._adjustOffsetFromHelper(o.cursorAt));

		//Set a containment if given in the options
		this._setContainment();

		//Trigger event + callbacks
		if (this._trigger("start", event) === false) {
			this._clear();
			return false;
		}

		//Recache the helper size
		this._cacheHelperProportions();

		//Prepare the droppable offsets
		if ($.ui.ddmanager && !o.dropBehaviour) {
			$.ui.ddmanager.prepareOffsets(this, event);
		}

		// Reset helper's right/bottom css if they're set and set explicit width/height instead
		// as this prevents resizing of elements with right/bottom set (see #7772)
		this._normalizeRightBottom();

		this._mouseDrag(event, true); //Execute the drag once - this causes the helper not to be visible before getting its correct position

		//If the ddmanager is used for droppables, inform the manager that dragging has started (see #5003)
		if ( $.ui.ddmanager ) {
			$.ui.ddmanager.dragStart(this, event);
		}

		return true;
	},

	_refreshOffsets: function( event ) {
		this.offset = {
			top: this.positionAbs.top - this.margins.top,
			left: this.positionAbs.left - this.margins.left,
			scroll: false,
			parent: this._getParentOffset(),
			relative: this._getRelativeOffset()
		};

		this.offset.click = {
			left: event.pageX - this.offset.left,
			top: event.pageY - this.offset.top
		};
	},

	_mouseDrag: function(event, noPropagation) {
		// reset any necessary cached properties (see #5009)
		if ( this.hasFixedAncestor ) {
			this.offset.parent = this._getParentOffset();
		}

		//Compute the helpers position
		this.position = this._generatePosition( event, true );
		this.positionAbs = this._convertPositionTo("absolute");

		//Call plugins and callbacks and use the resulting position if something is returned
		if (!noPropagation) {
			var ui = this._uiHash();
			if (this._trigger("drag", event, ui) === false) {
				this._mouseUp({});
				return false;
			}
			this.position = ui.position;
		}

		this.helper[ 0 ].style.left = this.position.left + "px";
		this.helper[ 0 ].style.top = this.position.top + "px";

		if ($.ui.ddmanager) {
			$.ui.ddmanager.drag(this, event);
		}

		return false;
	},

	_mouseStop: function(event) {

		//If we are using droppables, inform the manager about the drop
		var that = this,
			dropped = false;
		if ($.ui.ddmanager && !this.options.dropBehaviour) {
			dropped = $.ui.ddmanager.drop(this, event);
		}

		//if a drop comes from outside (a sortable)
		if (this.dropped) {
			dropped = this.dropped;
			this.dropped = false;
		}

		if ((this.options.revert === "invalid" && !dropped) || (this.options.revert === "valid" && dropped) || this.options.revert === true || ($.isFunction(this.options.revert) && this.options.revert.call(this.element, dropped))) {
			$(this.helper).animate(this.originalPosition, parseInt(this.options.revertDuration, 10), function() {
				if (that._trigger("stop", event) !== false) {
					that._clear();
				}
			});
		} else {
			if (this._trigger("stop", event) !== false) {
				this._clear();
			}
		}

		return false;
	},

	_mouseUp: function( event ) {
		this._unblockFrames();

		//If the ddmanager is used for droppables, inform the manager that dragging has stopped (see #5003)
		if ( $.ui.ddmanager ) {
			$.ui.ddmanager.dragStop(this, event);
		}

		// Only need to focus if the event occurred on the draggable itself, see #10527
		if ( this.handleElement.is( event.target ) ) {
			// The interaction is over; whether or not the click resulted in a drag, focus the element
			this.element.focus();
		}

		return $.ui.mouse.prototype._mouseUp.call(this, event);
	},

	cancel: function() {

		if (this.helper.is(".ui-draggable-dragging")) {
			this._mouseUp({});
		} else {
			this._clear();
		}

		return this;

	},

	_getHandle: function(event) {
		return this.options.handle ?
			!!$( event.target ).closest( this.element.find( this.options.handle ) ).length :
			true;
	},

	_setHandleClassName: function() {
		this.handleElement = this.options.handle ?
			this.element.find( this.options.handle ) : this.element;
		this.handleElement.addClass( "ui-draggable-handle" );
	},

	_removeHandleClassName: function() {
		this.handleElement.removeClass( "ui-draggable-handle" );
	},

	_createHelper: function(event) {

		var o = this.options,
			helperIsFunction = $.isFunction( o.helper ),
			helper = helperIsFunction ?
				$( o.helper.apply( this.element[ 0 ], [ event ] ) ) :
				( o.helper === "clone" ?
					this.element.clone().removeAttr( "id" ) :
					this.element );

		if (!helper.parents("body").length) {
			helper.appendTo((o.appendTo === "parent" ? this.element[0].parentNode : o.appendTo));
		}

		// http://bugs.jqueryui.com/ticket/9446
		// a helper function can return the original element
		// which wouldn't have been set to relative in _create
		if ( helperIsFunction && helper[ 0 ] === this.element[ 0 ] ) {
			this._setPositionRelative();
		}

		if (helper[0] !== this.element[0] && !(/(fixed|absolute)/).test(helper.css("position"))) {
			helper.css("position", "absolute");
		}

		return helper;

	},

	_setPositionRelative: function() {
		if ( !( /^(?:r|a|f)/ ).test( this.element.css( "position" ) ) ) {
			this.element[ 0 ].style.position = "relative";
		}
	},

	_adjustOffsetFromHelper: function(obj) {
		if (typeof obj === "string") {
			obj = obj.split(" ");
		}
		if ($.isArray(obj)) {
			obj = { left: +obj[0], top: +obj[1] || 0 };
		}
		if ("left" in obj) {
			this.offset.click.left = obj.left + this.margins.left;
		}
		if ("right" in obj) {
			this.offset.click.left = this.helperProportions.width - obj.right + this.margins.left;
		}
		if ("top" in obj) {
			this.offset.click.top = obj.top + this.margins.top;
		}
		if ("bottom" in obj) {
			this.offset.click.top = this.helperProportions.height - obj.bottom + this.margins.top;
		}
	},

	_isRootNode: function( element ) {
		return ( /(html|body)/i ).test( element.tagName ) || element === this.document[ 0 ];
	},

	_getParentOffset: function() {

		//Get the offsetParent and cache its position
		var po = this.offsetParent.offset(),
			document = this.document[ 0 ];

		// This is a special case where we need to modify a offset calculated on start, since the following happened:
		// 1. The position of the helper is absolute, so it's position is calculated based on the next positioned parent
		// 2. The actual offset parent is a child of the scroll parent, and the scroll parent isn't the document, which means that
		//    the scroll is included in the initial calculation of the offset of the parent, and never recalculated upon drag
		if (this.cssPosition === "absolute" && this.scrollParent[0] !== document && $.contains(this.scrollParent[0], this.offsetParent[0])) {
			po.left += this.scrollParent.scrollLeft();
			po.top += this.scrollParent.scrollTop();
		}

		if ( this._isRootNode( this.offsetParent[ 0 ] ) ) {
			po = { top: 0, left: 0 };
		}

		return {
			top: po.top + (parseInt(this.offsetParent.css("borderTopWidth"), 10) || 0),
			left: po.left + (parseInt(this.offsetParent.css("borderLeftWidth"), 10) || 0)
		};

	},

	_getRelativeOffset: function() {
		if ( this.cssPosition !== "relative" ) {
			return { top: 0, left: 0 };
		}

		var p = this.element.position(),
			scrollIsRootNode = this._isRootNode( this.scrollParent[ 0 ] );

		return {
			top: p.top - ( parseInt(this.helper.css( "top" ), 10) || 0 ) + ( !scrollIsRootNode ? this.scrollParent.scrollTop() : 0 ),
			left: p.left - ( parseInt(this.helper.css( "left" ), 10) || 0 ) + ( !scrollIsRootNode ? this.scrollParent.scrollLeft() : 0 )
		};

	},

	_cacheMargins: function() {
		this.margins = {
			left: (parseInt(this.element.css("marginLeft"), 10) || 0),
			top: (parseInt(this.element.css("marginTop"), 10) || 0),
			right: (parseInt(this.element.css("marginRight"), 10) || 0),
			bottom: (parseInt(this.element.css("marginBottom"), 10) || 0)
		};
	},

	_cacheHelperProportions: function() {
		this.helperProportions = {
			width: this.helper.outerWidth(),
			height: this.helper.outerHeight()
		};
	},

	_setContainment: function() {

		var isUserScrollable, c, ce,
			o = this.options,
			document = this.document[ 0 ];

		this.relativeContainer = null;

		if ( !o.containment ) {
			this.containment = null;
			return;
		}

		if ( o.containment === "window" ) {
			this.containment = [
				$( window ).scrollLeft() - this.offset.relative.left - this.offset.parent.left,
				$( window ).scrollTop() - this.offset.relative.top - this.offset.parent.top,
				$( window ).scrollLeft() + $( window ).width() - this.helperProportions.width - this.margins.left,
				$( window ).scrollTop() + ( $( window ).height() || document.body.parentNode.scrollHeight ) - this.helperProportions.height - this.margins.top
			];
			return;
		}

		if ( o.containment === "document") {
			this.containment = [
				0,
				0,
				$( document ).width() - this.helperProportions.width - this.margins.left,
				( $( document ).height() || document.body.parentNode.scrollHeight ) - this.helperProportions.height - this.margins.top
			];
			return;
		}

		if ( o.containment.constructor === Array ) {
			this.containment = o.containment;
			return;
		}

		if ( o.containment === "parent" ) {
			o.containment = this.helper[ 0 ].parentNode;
		}

		c = $( o.containment );
		ce = c[ 0 ];

		if ( !ce ) {
			return;
		}

		isUserScrollable = /(scroll|auto)/.test( c.css( "overflow" ) );

		this.containment = [
			( parseInt( c.css( "borderLeftWidth" ), 10 ) || 0 ) + ( parseInt( c.css( "paddingLeft" ), 10 ) || 0 ),
			( parseInt( c.css( "borderTopWidth" ), 10 ) || 0 ) + ( parseInt( c.css( "paddingTop" ), 10 ) || 0 ),
			( isUserScrollable ? Math.max( ce.scrollWidth, ce.offsetWidth ) : ce.offsetWidth ) -
				( parseInt( c.css( "borderRightWidth" ), 10 ) || 0 ) -
				( parseInt( c.css( "paddingRight" ), 10 ) || 0 ) -
				this.helperProportions.width -
				this.margins.left -
				this.margins.right,
			( isUserScrollable ? Math.max( ce.scrollHeight, ce.offsetHeight ) : ce.offsetHeight ) -
				( parseInt( c.css( "borderBottomWidth" ), 10 ) || 0 ) -
				( parseInt( c.css( "paddingBottom" ), 10 ) || 0 ) -
				this.helperProportions.height -
				this.margins.top -
				this.margins.bottom
		];
		this.relativeContainer = c;
	},

	_convertPositionTo: function(d, pos) {

		if (!pos) {
			pos = this.position;
		}

		var mod = d === "absolute" ? 1 : -1,
			scrollIsRootNode = this._isRootNode( this.scrollParent[ 0 ] );

		return {
			top: (
				pos.top	+																// The absolute mouse position
				this.offset.relative.top * mod +										// Only for relative positioned nodes: Relative offset from element to offset parent
				this.offset.parent.top * mod -										// The offsetParent's offset without borders (offset + border)
				( ( this.cssPosition === "fixed" ? -this.offset.scroll.top : ( scrollIsRootNode ? 0 : this.offset.scroll.top ) ) * mod)
			),
			left: (
				pos.left +																// The absolute mouse position
				this.offset.relative.left * mod +										// Only for relative positioned nodes: Relative offset from element to offset parent
				this.offset.parent.left * mod	-										// The offsetParent's offset without borders (offset + border)
				( ( this.cssPosition === "fixed" ? -this.offset.scroll.left : ( scrollIsRootNode ? 0 : this.offset.scroll.left ) ) * mod)
			)
		};

	},

	_generatePosition: function( event, constrainPosition ) {

		var containment, co, top, left,
			o = this.options,
			scrollIsRootNode = this._isRootNode( this.scrollParent[ 0 ] ),
			pageX = event.pageX,
			pageY = event.pageY;

		// Cache the scroll
		if ( !scrollIsRootNode || !this.offset.scroll ) {
			this.offset.scroll = {
				top: this.scrollParent.scrollTop(),
				left: this.scrollParent.scrollLeft()
			};
		}

		/*
		 * - Position constraining -
		 * Constrain the position to a mix of grid, containment.
		 */

		// If we are not dragging yet, we won't check for options
		if ( constrainPosition ) {
			if ( this.containment ) {
				if ( this.relativeContainer ){
					co = this.relativeContainer.offset();
					containment = [
						this.containment[ 0 ] + co.left,
						this.containment[ 1 ] + co.top,
						this.containment[ 2 ] + co.left,
						this.containment[ 3 ] + co.top
					];
				} else {
					containment = this.containment;
				}

				if (event.pageX - this.offset.click.left < containment[0]) {
					pageX = containment[0] + this.offset.click.left;
				}
				if (event.pageY - this.offset.click.top < containment[1]) {
					pageY = containment[1] + this.offset.click.top;
				}
				if (event.pageX - this.offset.click.left > containment[2]) {
					pageX = containment[2] + this.offset.click.left;
				}
				if (event.pageY - this.offset.click.top > containment[3]) {
					pageY = containment[3] + this.offset.click.top;
				}
			}

			if (o.grid) {
				//Check for grid elements set to 0 to prevent divide by 0 error causing invalid argument errors in IE (see ticket #6950)
				top = o.grid[1] ? this.originalPageY + Math.round((pageY - this.originalPageY) / o.grid[1]) * o.grid[1] : this.originalPageY;
				pageY = containment ? ((top - this.offset.click.top >= containment[1] || top - this.offset.click.top > containment[3]) ? top : ((top - this.offset.click.top >= containment[1]) ? top - o.grid[1] : top + o.grid[1])) : top;

				left = o.grid[0] ? this.originalPageX + Math.round((pageX - this.originalPageX) / o.grid[0]) * o.grid[0] : this.originalPageX;
				pageX = containment ? ((left - this.offset.click.left >= containment[0] || left - this.offset.click.left > containment[2]) ? left : ((left - this.offset.click.left >= containment[0]) ? left - o.grid[0] : left + o.grid[0])) : left;
			}

			if ( o.axis === "y" ) {
				pageX = this.originalPageX;
			}

			if ( o.axis === "x" ) {
				pageY = this.originalPageY;
			}
		}

		return {
			top: (
				pageY -																	// The absolute mouse position
				this.offset.click.top	-												// Click offset (relative to the element)
				this.offset.relative.top -												// Only for relative positioned nodes: Relative offset from element to offset parent
				this.offset.parent.top +												// The offsetParent's offset without borders (offset + border)
				( this.cssPosition === "fixed" ? -this.offset.scroll.top : ( scrollIsRootNode ? 0 : this.offset.scroll.top ) )
			),
			left: (
				pageX -																	// The absolute mouse position
				this.offset.click.left -												// Click offset (relative to the element)
				this.offset.relative.left -												// Only for relative positioned nodes: Relative offset from element to offset parent
				this.offset.parent.left +												// The offsetParent's offset without borders (offset + border)
				( this.cssPosition === "fixed" ? -this.offset.scroll.left : ( scrollIsRootNode ? 0 : this.offset.scroll.left ) )
			)
		};

	},

	_clear: function() {
		this.helper.removeClass("ui-draggable-dragging");
		if (this.helper[0] !== this.element[0] && !this.cancelHelperRemoval) {
			this.helper.remove();
		}
		this.helper = null;
		this.cancelHelperRemoval = false;
		if ( this.destroyOnClear ) {
			this.destroy();
		}
	},

	_normalizeRightBottom: function() {
		if ( this.options.axis !== "y" && this.helper.css( "right" ) !== "auto" ) {
			this.helper.width( this.helper.width() );
			this.helper.css( "right", "auto" );
		}
		if ( this.options.axis !== "x" && this.helper.css( "bottom" ) !== "auto" ) {
			this.helper.height( this.helper.height() );
			this.helper.css( "bottom", "auto" );
		}
	},

	// From now on bulk stuff - mainly helpers

	_trigger: function( type, event, ui ) {
		ui = ui || this._uiHash();
		$.ui.plugin.call( this, type, [ event, ui, this ], true );

		// Absolute position and offset (see #6884 ) have to be recalculated after plugins
		if ( /^(drag|start|stop)/.test( type ) ) {
			this.positionAbs = this._convertPositionTo( "absolute" );
			ui.offset = this.positionAbs;
		}
		return $.Widget.prototype._trigger.call( this, type, event, ui );
	},

	plugins: {},

	_uiHash: function() {
		return {
			helper: this.helper,
			position: this.position,
			originalPosition: this.originalPosition,
			offset: this.positionAbs
		};
	}

});

$.ui.plugin.add( "draggable", "connectToSortable", {
	start: function( event, ui, draggable ) {
		var uiSortable = $.extend( {}, ui, {
			item: draggable.element
		});

		draggable.sortables = [];
		$( draggable.options.connectToSortable ).each(function() {
			var sortable = $( this ).sortable( "instance" );

			if ( sortable && !sortable.options.disabled ) {
				draggable.sortables.push( sortable );

				// refreshPositions is called at drag start to refresh the containerCache
				// which is used in drag. This ensures it's initialized and synchronized
				// with any changes that might have happened on the page since initialization.
				sortable.refreshPositions();
				sortable._trigger("activate", event, uiSortable);
			}
		});
	},
	stop: function( event, ui, draggable ) {
		var uiSortable = $.extend( {}, ui, {
			item: draggable.element
		});

		draggable.cancelHelperRemoval = false;

		$.each( draggable.sortables, function() {
			var sortable = this;

			if ( sortable.isOver ) {
				sortable.isOver = 0;

				// Allow this sortable to handle removing the helper
				draggable.cancelHelperRemoval = true;
				sortable.cancelHelperRemoval = false;

				// Use _storedCSS To restore properties in the sortable,
				// as this also handles revert (#9675) since the draggable
				// may have modified them in unexpected ways (#8809)
				sortable._storedCSS = {
					position: sortable.placeholder.css( "position" ),
					top: sortable.placeholder.css( "top" ),
					left: sortable.placeholder.css( "left" )
				};

				sortable._mouseStop(event);

				// Once drag has ended, the sortable should return to using
				// its original helper, not the shared helper from draggable
				sortable.options.helper = sortable.options._helper;
			} else {
				// Prevent this Sortable from removing the helper.
				// However, don't set the draggable to remove the helper
				// either as another connected Sortable may yet handle the removal.
				sortable.cancelHelperRemoval = true;

				sortable._trigger( "deactivate", event, uiSortable );
			}
		});
	},
	drag: function( event, ui, draggable ) {
		$.each( draggable.sortables, function() {
			var innermostIntersecting = false,
				sortable = this;

			// Copy over variables that sortable's _intersectsWith uses
			sortable.positionAbs = draggable.positionAbs;
			sortable.helperProportions = draggable.helperProportions;
			sortable.offset.click = draggable.offset.click;

			if ( sortable._intersectsWith( sortable.containerCache ) ) {
				innermostIntersecting = true;

				$.each( draggable.sortables, function() {
					// Copy over variables that sortable's _intersectsWith uses
					this.positionAbs = draggable.positionAbs;
					this.helperProportions = draggable.helperProportions;
					this.offset.click = draggable.offset.click;

					if ( this !== sortable &&
							this._intersectsWith( this.containerCache ) &&
							$.contains( sortable.element[ 0 ], this.element[ 0 ] ) ) {
						innermostIntersecting = false;
					}

					return innermostIntersecting;
				});
			}

			if ( innermostIntersecting ) {
				// If it intersects, we use a little isOver variable and set it once,
				// so that the move-in stuff gets fired only once.
				if ( !sortable.isOver ) {
					sortable.isOver = 1;

					// Store draggable's parent in case we need to reappend to it later.
					draggable._parent = ui.helper.parent();

					sortable.currentItem = ui.helper
						.appendTo( sortable.element )
						.data( "ui-sortable-item", true );

					// Store helper option to later restore it
					sortable.options._helper = sortable.options.helper;

					sortable.options.helper = function() {
						return ui.helper[ 0 ];
					};

					// Fire the start events of the sortable with our passed browser event,
					// and our own helper (so it doesn't create a new one)
					event.target = sortable.currentItem[ 0 ];
					sortable._mouseCapture( event, true );
					sortable._mouseStart( event, true, true );

					// Because the browser event is way off the new appended portlet,
					// modify necessary variables to reflect the changes
					sortable.offset.click.top = draggable.offset.click.top;
					sortable.offset.click.left = draggable.offset.click.left;
					sortable.offset.parent.left -= draggable.offset.parent.left -
						sortable.offset.parent.left;
					sortable.offset.parent.top -= draggable.offset.parent.top -
						sortable.offset.parent.top;

					draggable._trigger( "toSortable", event );

					// Inform draggable that the helper is in a valid drop zone,
					// used solely in the revert option to handle "valid/invalid".
					draggable.dropped = sortable.element;

					// Need to refreshPositions of all sortables in the case that
					// adding to one sortable changes the location of the other sortables (#9675)
					$.each( draggable.sortables, function() {
						this.refreshPositions();
					});

					// hack so receive/update callbacks work (mostly)
					draggable.currentItem = draggable.element;
					sortable.fromOutside = draggable;
				}

				if ( sortable.currentItem ) {
					sortable._mouseDrag( event );
					// Copy the sortable's position because the draggable's can potentially reflect
					// a relative position, while sortable is always absolute, which the dragged
					// element has now become. (#8809)
					ui.position = sortable.position;
				}
			} else {
				// If it doesn't intersect with the sortable, and it intersected before,
				// we fake the drag stop of the sortable, but make sure it doesn't remove
				// the helper by using cancelHelperRemoval.
				if ( sortable.isOver ) {

					sortable.isOver = 0;
					sortable.cancelHelperRemoval = true;

					// Calling sortable's mouseStop would trigger a revert,
					// so revert must be temporarily false until after mouseStop is called.
					sortable.options._revert = sortable.options.revert;
					sortable.options.revert = false;

					sortable._trigger( "out", event, sortable._uiHash( sortable ) );
					sortable._mouseStop( event, true );

					// restore sortable behaviors that were modfied
					// when the draggable entered the sortable area (#9481)
					sortable.options.revert = sortable.options._revert;
					sortable.options.helper = sortable.options._helper;

					if ( sortable.placeholder ) {
						sortable.placeholder.remove();
					}

					// Restore and recalculate the draggable's offset considering the sortable
					// may have modified them in unexpected ways. (#8809, #10669)
					ui.helper.appendTo( draggable._parent );
					draggable._refreshOffsets( event );
					ui.position = draggable._generatePosition( event, true );

					draggable._trigger( "fromSortable", event );

					// Inform draggable that the helper is no longer in a valid drop zone
					draggable.dropped = false;

					// Need to refreshPositions of all sortables just in case removing
					// from one sortable changes the location of other sortables (#9675)
					$.each( draggable.sortables, function() {
						this.refreshPositions();
					});
				}
			}
		});
	}
});

$.ui.plugin.add("draggable", "cursor", {
	start: function( event, ui, instance ) {
		var t = $( "body" ),
			o = instance.options;

		if (t.css("cursor")) {
			o._cursor = t.css("cursor");
		}
		t.css("cursor", o.cursor);
	},
	stop: function( event, ui, instance ) {
		var o = instance.options;
		if (o._cursor) {
			$("body").css("cursor", o._cursor);
		}
	}
});

$.ui.plugin.add("draggable", "opacity", {
	start: function( event, ui, instance ) {
		var t = $( ui.helper ),
			o = instance.options;
		if (t.css("opacity")) {
			o._opacity = t.css("opacity");
		}
		t.css("opacity", o.opacity);
	},
	stop: function( event, ui, instance ) {
		var o = instance.options;
		if (o._opacity) {
			$(ui.helper).css("opacity", o._opacity);
		}
	}
});

$.ui.plugin.add("draggable", "scroll", {
	start: function( event, ui, i ) {
		if ( !i.scrollParentNotHidden ) {
			i.scrollParentNotHidden = i.helper.scrollParent( false );
		}

		if ( i.scrollParentNotHidden[ 0 ] !== i.document[ 0 ] && i.scrollParentNotHidden[ 0 ].tagName !== "HTML" ) {
			i.overflowOffset = i.scrollParentNotHidden.offset();
		}
	},
	drag: function( event, ui, i  ) {

		var o = i.options,
			scrolled = false,
			scrollParent = i.scrollParentNotHidden[ 0 ],
			document = i.document[ 0 ];

		if ( scrollParent !== document && scrollParent.tagName !== "HTML" ) {
			if ( !o.axis || o.axis !== "x" ) {
				if ( ( i.overflowOffset.top + scrollParent.offsetHeight ) - event.pageY < o.scrollSensitivity ) {
					scrollParent.scrollTop = scrolled = scrollParent.scrollTop + o.scrollSpeed;
				} else if ( event.pageY - i.overflowOffset.top < o.scrollSensitivity ) {
					scrollParent.scrollTop = scrolled = scrollParent.scrollTop - o.scrollSpeed;
				}
			}

			if ( !o.axis || o.axis !== "y" ) {
				if ( ( i.overflowOffset.left + scrollParent.offsetWidth ) - event.pageX < o.scrollSensitivity ) {
					scrollParent.scrollLeft = scrolled = scrollParent.scrollLeft + o.scrollSpeed;
				} else if ( event.pageX - i.overflowOffset.left < o.scrollSensitivity ) {
					scrollParent.scrollLeft = scrolled = scrollParent.scrollLeft - o.scrollSpeed;
				}
			}

		} else {

			if (!o.axis || o.axis !== "x") {
				if (event.pageY - $(document).scrollTop() < o.scrollSensitivity) {
					scrolled = $(document).scrollTop($(document).scrollTop() - o.scrollSpeed);
				} else if ($(window).height() - (event.pageY - $(document).scrollTop()) < o.scrollSensitivity) {
					scrolled = $(document).scrollTop($(document).scrollTop() + o.scrollSpeed);
				}
			}

			if (!o.axis || o.axis !== "y") {
				if (event.pageX - $(document).scrollLeft() < o.scrollSensitivity) {
					scrolled = $(document).scrollLeft($(document).scrollLeft() - o.scrollSpeed);
				} else if ($(window).width() - (event.pageX - $(document).scrollLeft()) < o.scrollSensitivity) {
					scrolled = $(document).scrollLeft($(document).scrollLeft() + o.scrollSpeed);
				}
			}

		}

		if (scrolled !== false && $.ui.ddmanager && !o.dropBehaviour) {
			$.ui.ddmanager.prepareOffsets(i, event);
		}

	}
});

$.ui.plugin.add("draggable", "snap", {
	start: function( event, ui, i ) {

		var o = i.options;

		i.snapElements = [];

		$(o.snap.constructor !== String ? ( o.snap.items || ":data(ui-draggable)" ) : o.snap).each(function() {
			var $t = $(this),
				$o = $t.offset();
			if (this !== i.element[0]) {
				i.snapElements.push({
					item: this,
					width: $t.outerWidth(), height: $t.outerHeight(),
					top: $o.top, left: $o.left
				});
			}
		});

	},
	drag: function( event, ui, inst ) {

		var ts, bs, ls, rs, l, r, t, b, i, first,
			o = inst.options,
			d = o.snapTolerance,
			x1 = ui.offset.left, x2 = x1 + inst.helperProportions.width,
			y1 = ui.offset.top, y2 = y1 + inst.helperProportions.height;

		for (i = inst.snapElements.length - 1; i >= 0; i--){

			l = inst.snapElements[i].left - inst.margins.left;
			r = l + inst.snapElements[i].width;
			t = inst.snapElements[i].top - inst.margins.top;
			b = t + inst.snapElements[i].height;

			if ( x2 < l - d || x1 > r + d || y2 < t - d || y1 > b + d || !$.contains( inst.snapElements[ i ].item.ownerDocument, inst.snapElements[ i ].item ) ) {
				if (inst.snapElements[i].snapping) {
					(inst.options.snap.release && inst.options.snap.release.call(inst.element, event, $.extend(inst._uiHash(), { snapItem: inst.snapElements[i].item })));
				}
				inst.snapElements[i].snapping = false;
				continue;
			}

			if (o.snapMode !== "inner") {
				ts = Math.abs(t - y2) <= d;
				bs = Math.abs(b - y1) <= d;
				ls = Math.abs(l - x2) <= d;
				rs = Math.abs(r - x1) <= d;
				if (ts) {
					ui.position.top = inst._convertPositionTo("relative", { top: t - inst.helperProportions.height, left: 0 }).top;
				}
				if (bs) {
					ui.position.top = inst._convertPositionTo("relative", { top: b, left: 0 }).top;
				}
				if (ls) {
					ui.position.left = inst._convertPositionTo("relative", { top: 0, left: l - inst.helperProportions.width }).left;
				}
				if (rs) {
					ui.position.left = inst._convertPositionTo("relative", { top: 0, left: r }).left;
				}
			}

			first = (ts || bs || ls || rs);

			if (o.snapMode !== "outer") {
				ts = Math.abs(t - y1) <= d;
				bs = Math.abs(b - y2) <= d;
				ls = Math.abs(l - x1) <= d;
				rs = Math.abs(r - x2) <= d;
				if (ts) {
					ui.position.top = inst._convertPositionTo("relative", { top: t, left: 0 }).top;
				}
				if (bs) {
					ui.position.top = inst._convertPositionTo("relative", { top: b - inst.helperProportions.height, left: 0 }).top;
				}
				if (ls) {
					ui.position.left = inst._convertPositionTo("relative", { top: 0, left: l }).left;
				}
				if (rs) {
					ui.position.left = inst._convertPositionTo("relative", { top: 0, left: r - inst.helperProportions.width }).left;
				}
			}

			if (!inst.snapElements[i].snapping && (ts || bs || ls || rs || first)) {
				(inst.options.snap.snap && inst.options.snap.snap.call(inst.element, event, $.extend(inst._uiHash(), { snapItem: inst.snapElements[i].item })));
			}
			inst.snapElements[i].snapping = (ts || bs || ls || rs || first);

		}

	}
});

$.ui.plugin.add("draggable", "stack", {
	start: function( event, ui, instance ) {
		var min,
			o = instance.options,
			group = $.makeArray($(o.stack)).sort(function(a, b) {
				return (parseInt($(a).css("zIndex"), 10) || 0) - (parseInt($(b).css("zIndex"), 10) || 0);
			});

		if (!group.length) { return; }

		min = parseInt($(group[0]).css("zIndex"), 10) || 0;
		$(group).each(function(i) {
			$(this).css("zIndex", min + i);
		});
		this.css("zIndex", (min + group.length));
	}
});

$.ui.plugin.add("draggable", "zIndex", {
	start: function( event, ui, instance ) {
		var t = $( ui.helper ),
			o = instance.options;

		if (t.css("zIndex")) {
			o._zIndex = t.css("zIndex");
		}
		t.css("zIndex", o.zIndex);
	},
	stop: function( event, ui, instance ) {
		var o = instance.options;

		if (o._zIndex) {
			$(ui.helper).css("zIndex", o._zIndex);
		}
	}
});

var draggable = $.ui.draggable;


/*!
 * jQuery UI Droppable 1.11.4
 * http://jqueryui.com
 *
 * Copyright jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 *
 * http://api.jqueryui.com/droppable/
 */


$.widget( "ui.droppable", {
	version: "1.11.4",
	widgetEventPrefix: "drop",
	options: {
		accept: "*",
		activeClass: false,
		addClasses: true,
		greedy: false,
		hoverClass: false,
		scope: "default",
		tolerance: "intersect",

		// callbacks
		activate: null,
		deactivate: null,
		drop: null,
		out: null,
		over: null
	},
	_create: function() {

		var proportions,
			o = this.options,
			accept = o.accept;

		this.isover = false;
		this.isout = true;

		this.accept = $.isFunction( accept ) ? accept : function( d ) {
			return d.is( accept );
		};

		this.proportions = function( /* valueToWrite */ ) {
			if ( arguments.length ) {
				// Store the droppable's proportions
				proportions = arguments[ 0 ];
			} else {
				// Retrieve or derive the droppable's proportions
				return proportions ?
					proportions :
					proportions = {
						width: this.element[ 0 ].offsetWidth,
						height: this.element[ 0 ].offsetHeight
					};
			}
		};

		this._addToManager( o.scope );

		o.addClasses && this.element.addClass( "ui-droppable" );

	},

	_addToManager: function( scope ) {
		// Add the reference and positions to the manager
		$.ui.ddmanager.droppables[ scope ] = $.ui.ddmanager.droppables[ scope ] || [];
		$.ui.ddmanager.droppables[ scope ].push( this );
	},

	_splice: function( drop ) {
		var i = 0;
		for ( ; i < drop.length; i++ ) {
			if ( drop[ i ] === this ) {
				drop.splice( i, 1 );
			}
		}
	},

	_destroy: function() {
		var drop = $.ui.ddmanager.droppables[ this.options.scope ];

		this._splice( drop );

		this.element.removeClass( "ui-droppable ui-droppable-disabled" );
	},

	_setOption: function( key, value ) {

		if ( key === "accept" ) {
			this.accept = $.isFunction( value ) ? value : function( d ) {
				return d.is( value );
			};
		} else if ( key === "scope" ) {
			var drop = $.ui.ddmanager.droppables[ this.options.scope ];

			this._splice( drop );
			this._addToManager( value );
		}

		this._super( key, value );
	},

	_activate: function( event ) {
		var draggable = $.ui.ddmanager.current;
		if ( this.options.activeClass ) {
			this.element.addClass( this.options.activeClass );
		}
		if ( draggable ){
			this._trigger( "activate", event, this.ui( draggable ) );
		}
	},

	_deactivate: function( event ) {
		var draggable = $.ui.ddmanager.current;
		if ( this.options.activeClass ) {
			this.element.removeClass( this.options.activeClass );
		}
		if ( draggable ){
			this._trigger( "deactivate", event, this.ui( draggable ) );
		}
	},

	_over: function( event ) {

		var draggable = $.ui.ddmanager.current;

		// Bail if draggable and droppable are same element
		if ( !draggable || ( draggable.currentItem || draggable.element )[ 0 ] === this.element[ 0 ] ) {
			return;
		}

		if ( this.accept.call( this.element[ 0 ], ( draggable.currentItem || draggable.element ) ) ) {
			if ( this.options.hoverClass ) {
				this.element.addClass( this.options.hoverClass );
			}
			this._trigger( "over", event, this.ui( draggable ) );
		}

	},

	_out: function( event ) {

		var draggable = $.ui.ddmanager.current;

		// Bail if draggable and droppable are same element
		if ( !draggable || ( draggable.currentItem || draggable.element )[ 0 ] === this.element[ 0 ] ) {
			return;
		}

		if ( this.accept.call( this.element[ 0 ], ( draggable.currentItem || draggable.element ) ) ) {
			if ( this.options.hoverClass ) {
				this.element.removeClass( this.options.hoverClass );
			}
			this._trigger( "out", event, this.ui( draggable ) );
		}

	},

	_drop: function( event, custom ) {

		var draggable = custom || $.ui.ddmanager.current,
			childrenIntersection = false;

		// Bail if draggable and droppable are same element
		if ( !draggable || ( draggable.currentItem || draggable.element )[ 0 ] === this.element[ 0 ] ) {
			return false;
		}

		this.element.find( ":data(ui-droppable)" ).not( ".ui-draggable-dragging" ).each(function() {
			var inst = $( this ).droppable( "instance" );
			if (
				inst.options.greedy &&
				!inst.options.disabled &&
				inst.options.scope === draggable.options.scope &&
				inst.accept.call( inst.element[ 0 ], ( draggable.currentItem || draggable.element ) ) &&
				$.ui.intersect( draggable, $.extend( inst, { offset: inst.element.offset() } ), inst.options.tolerance, event )
			) { childrenIntersection = true; return false; }
		});
		if ( childrenIntersection ) {
			return false;
		}

		if ( this.accept.call( this.element[ 0 ], ( draggable.currentItem || draggable.element ) ) ) {
			if ( this.options.activeClass ) {
				this.element.removeClass( this.options.activeClass );
			}
			if ( this.options.hoverClass ) {
				this.element.removeClass( this.options.hoverClass );
			}
			this._trigger( "drop", event, this.ui( draggable ) );
			return this.element;
		}

		return false;

	},

	ui: function( c ) {
		return {
			draggable: ( c.currentItem || c.element ),
			helper: c.helper,
			position: c.position,
			offset: c.positionAbs
		};
	}

});

$.ui.intersect = (function() {
	function isOverAxis( x, reference, size ) {
		return ( x >= reference ) && ( x < ( reference + size ) );
	}

	return function( draggable, droppable, toleranceMode, event ) {

		if ( !droppable.offset ) {
			return false;
		}

		var x1 = ( draggable.positionAbs || draggable.position.absolute ).left + draggable.margins.left,
			y1 = ( draggable.positionAbs || draggable.position.absolute ).top + draggable.margins.top,
			x2 = x1 + draggable.helperProportions.width,
			y2 = y1 + draggable.helperProportions.height,
			l = droppable.offset.left,
			t = droppable.offset.top,
			r = l + droppable.proportions().width,
			b = t + droppable.proportions().height;

		switch ( toleranceMode ) {
		case "fit":
			return ( l <= x1 && x2 <= r && t <= y1 && y2 <= b );
		case "intersect":
			return ( l < x1 + ( draggable.helperProportions.width / 2 ) && // Right Half
				x2 - ( draggable.helperProportions.width / 2 ) < r && // Left Half
				t < y1 + ( draggable.helperProportions.height / 2 ) && // Bottom Half
				y2 - ( draggable.helperProportions.height / 2 ) < b ); // Top Half
		case "pointer":
			return isOverAxis( event.pageY, t, droppable.proportions().height ) && isOverAxis( event.pageX, l, droppable.proportions().width );
		case "touch":
			return (
				( y1 >= t && y1 <= b ) || // Top edge touching
				( y2 >= t && y2 <= b ) || // Bottom edge touching
				( y1 < t && y2 > b ) // Surrounded vertically
			) && (
				( x1 >= l && x1 <= r ) || // Left edge touching
				( x2 >= l && x2 <= r ) || // Right edge touching
				( x1 < l && x2 > r ) // Surrounded horizontally
			);
		default:
			return false;
		}
	};
})();

/*
	This manager tracks offsets of draggables and droppables
*/
$.ui.ddmanager = {
	current: null,
	droppables: { "default": [] },
	prepareOffsets: function( t, event ) {

		var i, j,
			m = $.ui.ddmanager.droppables[ t.options.scope ] || [],
			type = event ? event.type : null, // workaround for #2317
			list = ( t.currentItem || t.element ).find( ":data(ui-droppable)" ).addBack();

		droppablesLoop: for ( i = 0; i < m.length; i++ ) {

			// No disabled and non-accepted
			if ( m[ i ].options.disabled || ( t && !m[ i ].accept.call( m[ i ].element[ 0 ], ( t.currentItem || t.element ) ) ) ) {
				continue;
			}

			// Filter out elements in the current dragged item
			for ( j = 0; j < list.length; j++ ) {
				if ( list[ j ] === m[ i ].element[ 0 ] ) {
					m[ i ].proportions().height = 0;
					continue droppablesLoop;
				}
			}

			m[ i ].visible = m[ i ].element.css( "display" ) !== "none";
			if ( !m[ i ].visible ) {
				continue;
			}

			// Activate the droppable if used directly from draggables
			if ( type === "mousedown" ) {
				m[ i ]._activate.call( m[ i ], event );
			}

			m[ i ].offset = m[ i ].element.offset();
			m[ i ].proportions({ width: m[ i ].element[ 0 ].offsetWidth, height: m[ i ].element[ 0 ].offsetHeight });

		}

	},
	drop: function( draggable, event ) {

		var dropped = false;
		// Create a copy of the droppables in case the list changes during the drop (#9116)
		$.each( ( $.ui.ddmanager.droppables[ draggable.options.scope ] || [] ).slice(), function() {

			if ( !this.options ) {
				return;
			}
			if ( !this.options.disabled && this.visible && $.ui.intersect( draggable, this, this.options.tolerance, event ) ) {
				dropped = this._drop.call( this, event ) || dropped;
			}

			if ( !this.options.disabled && this.visible && this.accept.call( this.element[ 0 ], ( draggable.currentItem || draggable.element ) ) ) {
				this.isout = true;
				this.isover = false;
				this._deactivate.call( this, event );
			}

		});
		return dropped;

	},
	dragStart: function( draggable, event ) {
		// Listen for scrolling so that if the dragging causes scrolling the position of the droppables can be recalculated (see #5003)
		draggable.element.parentsUntil( "body" ).bind( "scroll.droppable", function() {
			if ( !draggable.options.refreshPositions ) {
				$.ui.ddmanager.prepareOffsets( draggable, event );
			}
		});
	},
	drag: function( draggable, event ) {

		// If you have a highly dynamic page, you might try this option. It renders positions every time you move the mouse.
		if ( draggable.options.refreshPositions ) {
			$.ui.ddmanager.prepareOffsets( draggable, event );
		}

		// Run through all droppables and check their positions based on specific tolerance options
		$.each( $.ui.ddmanager.droppables[ draggable.options.scope ] || [], function() {

			if ( this.options.disabled || this.greedyChild || !this.visible ) {
				return;
			}

			var parentInstance, scope, parent,
				intersects = $.ui.intersect( draggable, this, this.options.tolerance, event ),
				c = !intersects && this.isover ? "isout" : ( intersects && !this.isover ? "isover" : null );
			if ( !c ) {
				return;
			}

			if ( this.options.greedy ) {
				// find droppable parents with same scope
				scope = this.options.scope;
				parent = this.element.parents( ":data(ui-droppable)" ).filter(function() {
					return $( this ).droppable( "instance" ).options.scope === scope;
				});

				if ( parent.length ) {
					parentInstance = $( parent[ 0 ] ).droppable( "instance" );
					parentInstance.greedyChild = ( c === "isover" );
				}
			}

			// we just moved into a greedy child
			if ( parentInstance && c === "isover" ) {
				parentInstance.isover = false;
				parentInstance.isout = true;
				parentInstance._out.call( parentInstance, event );
			}

			this[ c ] = true;
			this[c === "isout" ? "isover" : "isout"] = false;
			this[c === "isover" ? "_over" : "_out"].call( this, event );

			// we just moved out of a greedy child
			if ( parentInstance && c === "isout" ) {
				parentInstance.isout = false;
				parentInstance.isover = true;
				parentInstance._over.call( parentInstance, event );
			}
		});

	},
	dragStop: function( draggable, event ) {
		draggable.element.parentsUntil( "body" ).unbind( "scroll.droppable" );
		// Call prepareOffsets one final time since IE does not fire return scroll events when overflow was caused by drag (see #5003)
		if ( !draggable.options.refreshPositions ) {
			$.ui.ddmanager.prepareOffsets( draggable, event );
		}
	}
};

var droppable = $.ui.droppable;


/*!
 * jQuery UI Selectable 1.11.4
 * http://jqueryui.com
 *
 * Copyright jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 *
 * http://api.jqueryui.com/selectable/
 */


var selectable = $.widget("ui.selectable", $.ui.mouse, {
	version: "1.11.4",
	options: {
		appendTo: "body",
		autoRefresh: true,
		distance: 0,
		filter: "*",
		tolerance: "touch",

		// callbacks
		selected: null,
		selecting: null,
		start: null,
		stop: null,
		unselected: null,
		unselecting: null
	},
	_create: function() {
		var selectees,
			that = this;

		this.element.addClass("ui-selectable");

		this.dragged = false;

		// cache selectee children based on filter
		this.refresh = function() {
			selectees = $(that.options.filter, that.element[0]);
			selectees.addClass("ui-selectee");
			selectees.each(function() {
				var $this = $(this),
					pos = $this.offset();
				$.data(this, "selectable-item", {
					element: this,
					$element: $this,
					left: pos.left,
					top: pos.top,
					right: pos.left + $this.outerWidth(),
					bottom: pos.top + $this.outerHeight(),
					startselected: false,
					selected: $this.hasClass("ui-selected"),
					selecting: $this.hasClass("ui-selecting"),
					unselecting: $this.hasClass("ui-unselecting")
				});
			});
		};
		this.refresh();

		this.selectees = selectees.addClass("ui-selectee");

		this._mouseInit();

		this.helper = $("<div class='ui-selectable-helper'></div>");
	},

	_destroy: function() {
		this.selectees
			.removeClass("ui-selectee")
			.removeData("selectable-item");
		this.element
			.removeClass("ui-selectable ui-selectable-disabled");
		this._mouseDestroy();
	},

	_mouseStart: function(event) {
		var that = this,
			options = this.options;

		this.opos = [ event.pageX, event.pageY ];

		if (this.options.disabled) {
			return;
		}

		this.selectees = $(options.filter, this.element[0]);

		this._trigger("start", event);

		$(options.appendTo).append(this.helper);
		// position helper (lasso)
		this.helper.css({
			"left": event.pageX,
			"top": event.pageY,
			"width": 0,
			"height": 0
		});

		if (options.autoRefresh) {
			this.refresh();
		}

		this.selectees.filter(".ui-selected").each(function() {
			var selectee = $.data(this, "selectable-item");
			selectee.startselected = true;
			if (!event.metaKey && !event.ctrlKey) {
				selectee.$element.removeClass("ui-selected");
				selectee.selected = false;
				selectee.$element.addClass("ui-unselecting");
				selectee.unselecting = true;
				// selectable UNSELECTING callback
				that._trigger("unselecting", event, {
					unselecting: selectee.element
				});
			}
		});

		$(event.target).parents().addBack().each(function() {
			var doSelect,
				selectee = $.data(this, "selectable-item");
			if (selectee) {
				doSelect = (!event.metaKey && !event.ctrlKey) || !selectee.$element.hasClass("ui-selected");
				selectee.$element
					.removeClass(doSelect ? "ui-unselecting" : "ui-selected")
					.addClass(doSelect ? "ui-selecting" : "ui-unselecting");
				selectee.unselecting = !doSelect;
				selectee.selecting = doSelect;
				selectee.selected = doSelect;
				// selectable (UN)SELECTING callback
				if (doSelect) {
					that._trigger("selecting", event, {
						selecting: selectee.element
					});
				} else {
					that._trigger("unselecting", event, {
						unselecting: selectee.element
					});
				}
				return false;
			}
		});

	},

	_mouseDrag: function(event) {

		this.dragged = true;

		if (this.options.disabled) {
			return;
		}

		var tmp,
			that = this,
			options = this.options,
			x1 = this.opos[0],
			y1 = this.opos[1],
			x2 = event.pageX,
			y2 = event.pageY;

		if (x1 > x2) { tmp = x2; x2 = x1; x1 = tmp; }
		if (y1 > y2) { tmp = y2; y2 = y1; y1 = tmp; }
		this.helper.css({ left: x1, top: y1, width: x2 - x1, height: y2 - y1 });

		this.selectees.each(function() {
			var selectee = $.data(this, "selectable-item"),
				hit = false;

			//prevent helper from being selected if appendTo: selectable
			if (!selectee || selectee.element === that.element[0]) {
				return;
			}

			if (options.tolerance === "touch") {
				hit = ( !(selectee.left > x2 || selectee.right < x1 || selectee.top > y2 || selectee.bottom < y1) );
			} else if (options.tolerance === "fit") {
				hit = (selectee.left > x1 && selectee.right < x2 && selectee.top > y1 && selectee.bottom < y2);
			}

			if (hit) {
				// SELECT
				if (selectee.selected) {
					selectee.$element.removeClass("ui-selected");
					selectee.selected = false;
				}
				if (selectee.unselecting) {
					selectee.$element.removeClass("ui-unselecting");
					selectee.unselecting = false;
				}
				if (!selectee.selecting) {
					selectee.$element.addClass("ui-selecting");
					selectee.selecting = true;
					// selectable SELECTING callback
					that._trigger("selecting", event, {
						selecting: selectee.element
					});
				}
			} else {
				// UNSELECT
				if (selectee.selecting) {
					if ((event.metaKey || event.ctrlKey) && selectee.startselected) {
						selectee.$element.removeClass("ui-selecting");
						selectee.selecting = false;
						selectee.$element.addClass("ui-selected");
						selectee.selected = true;
					} else {
						selectee.$element.removeClass("ui-selecting");
						selectee.selecting = false;
						if (selectee.startselected) {
							selectee.$element.addClass("ui-unselecting");
							selectee.unselecting = true;
						}
						// selectable UNSELECTING callback
						that._trigger("unselecting", event, {
							unselecting: selectee.element
						});
					}
				}
				if (selectee.selected) {
					if (!event.metaKey && !event.ctrlKey && !selectee.startselected) {
						selectee.$element.removeClass("ui-selected");
						selectee.selected = false;

						selectee.$element.addClass("ui-unselecting");
						selectee.unselecting = true;
						// selectable UNSELECTING callback
						that._trigger("unselecting", event, {
							unselecting: selectee.element
						});
					}
				}
			}
		});

		return false;
	},

	_mouseStop: function(event) {
		var that = this;

		this.dragged = false;

		$(".ui-unselecting", this.element[0]).each(function() {
			var selectee = $.data(this, "selectable-item");
			selectee.$element.removeClass("ui-unselecting");
			selectee.unselecting = false;
			selectee.startselected = false;
			that._trigger("unselected", event, {
				unselected: selectee.element
			});
		});
		$(".ui-selecting", this.element[0]).each(function() {
			var selectee = $.data(this, "selectable-item");
			selectee.$element.removeClass("ui-selecting").addClass("ui-selected");
			selectee.selecting = false;
			selectee.selected = true;
			selectee.startselected = true;
			that._trigger("selected", event, {
				selected: selectee.element
			});
		});
		this._trigger("stop", event);

		this.helper.remove();

		return false;
	}

});



}));
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

/*!
 * jQuery Form Plugin
 * version: 3.50.0-2014.02.05
 * Requires jQuery v1.5 or later
 * Copyright (c) 2013 M. Alsup
 * Examples and documentation at: http://malsup.com/jquery/form/
 * Project repository: https://github.com/malsup/form
 * Dual licensed under the MIT and GPL licenses.
 * https://github.com/malsup/form#copyright-and-license
 */
/*global ActiveXObject */

// AMD support
(function (factory) {
    "use strict";
    if (typeof define === 'function' && define.amd) {
        // using AMD; register as anon module
        define(['jquery'], factory);
    } else {
        // no AMD; invoke directly
        factory( (typeof(jQuery) != 'undefined') ? jQuery : window.Zepto );
    }
}

(function($) {
"use strict";

/*
    Usage Note:
    -----------
    Do not use both ajaxSubmit and ajaxForm on the same form.  These
    functions are mutually exclusive.  Use ajaxSubmit if you want
    to bind your own submit handler to the form.  For example,

    $(document).ready(function() {
        $('#myForm').on('submit', function(e) {
            e.preventDefault(); // <-- important
            $(this).ajaxSubmit({
                target: '#output'
            });
        });
    });

    Use ajaxForm when you want the plugin to manage all the event binding
    for you.  For example,

    $(document).ready(function() {
        $('#myForm').ajaxForm({
            target: '#output'
        });
    });

    You can also use ajaxForm with delegation (requires jQuery v1.7+), so the
    form does not have to exist when you invoke ajaxForm:

    $('#myForm').ajaxForm({
        delegation: true,
        target: '#output'
    });

    When using ajaxForm, the ajaxSubmit function will be invoked for you
    at the appropriate time.
*/

/**
 * Feature detection
 */
var feature = {};
feature.fileapi = $("<input type='file'/>").get(0).files !== undefined;
feature.formdata = window.FormData !== undefined;

var hasProp = !!$.fn.prop;

// attr2 uses prop when it can but checks the return type for
// an expected string.  this accounts for the case where a form 
// contains inputs with names like "action" or "method"; in those
// cases "prop" returns the element
$.fn.attr2 = function() {
    if ( ! hasProp ) {
        return this.attr.apply(this, arguments);
    }
    var val = this.prop.apply(this, arguments);
    if ( ( val && val.jquery ) || typeof val === 'string' ) {
        return val;
    }
    return this.attr.apply(this, arguments);
};

/**
 * ajaxSubmit() provides a mechanism for immediately submitting
 * an HTML form using AJAX.
 */
$.fn.ajaxSubmit = function(options) {
    /*jshint scripturl:true */

    // fast fail if nothing selected (http://dev.jquery.com/ticket/2752)
    if (!this.length) {
        log('ajaxSubmit: skipping submit process - no element selected');
        return this;
    }

    var method, action, url, $form = this;

    if (typeof options == 'function') {
        options = { success: options };
    }
    else if ( options === undefined ) {
        options = {};
    }

    method = options.type || this.attr2('method');
    action = options.url  || this.attr2('action');

    url = (typeof action === 'string') ? $.trim(action) : '';
    url = url || window.location.href || '';
    if (url) {
        // clean url (don't include hash vaue)
        url = (url.match(/^([^#]+)/)||[])[1];
    }

    options = $.extend(true, {
        url:  url,
        success: $.ajaxSettings.success,
        type: method || $.ajaxSettings.type,
        iframeSrc: /^https/i.test(window.location.href || '') ? 'javascript:false' : 'about:blank'
    }, options);

    // hook for manipulating the form data before it is extracted;
    // convenient for use with rich editors like tinyMCE or FCKEditor
    var veto = {};
    this.trigger('form-pre-serialize', [this, options, veto]);
    if (veto.veto) {
        log('ajaxSubmit: submit vetoed via form-pre-serialize trigger');
        return this;
    }

    // provide opportunity to alter form data before it is serialized
    if (options.beforeSerialize && options.beforeSerialize(this, options) === false) {
        log('ajaxSubmit: submit aborted via beforeSerialize callback');
        return this;
    }

    var traditional = options.traditional;
    if ( traditional === undefined ) {
        traditional = $.ajaxSettings.traditional;
    }

    var elements = [];
    var qx, a = this.formToArray(options.semantic, elements);
    if (options.data) {
        options.extraData = options.data;
        qx = $.param(options.data, traditional);
    }

    // give pre-submit callback an opportunity to abort the submit
    if (options.beforeSubmit && options.beforeSubmit(a, this, options) === false) {
        log('ajaxSubmit: submit aborted via beforeSubmit callback');
        return this;
    }

    // fire vetoable 'validate' event
    this.trigger('form-submit-validate', [a, this, options, veto]);
    if (veto.veto) {
        log('ajaxSubmit: submit vetoed via form-submit-validate trigger');
        return this;
    }

    var q = $.param(a, traditional);
    if (qx) {
        q = ( q ? (q + '&' + qx) : qx );
    }
    if (options.type.toUpperCase() == 'GET') {
        options.url += (options.url.indexOf('?') >= 0 ? '&' : '?') + q;
        options.data = null;  // data is null for 'get'
    }
    else {
        options.data = q; // data is the query string for 'post'
    }

    var callbacks = [];
    if (options.resetForm) {
        callbacks.push(function() { $form.resetForm(); });
    }
    if (options.clearForm) {
        callbacks.push(function() { $form.clearForm(options.includeHidden); });
    }

    // perform a load on the target only if dataType is not provided
    if (!options.dataType && options.target) {
        var oldSuccess = options.success || function(){};
        callbacks.push(function(data) {
            var fn = options.replaceTarget ? 'replaceWith' : 'html';
            $(options.target)[fn](data).each(oldSuccess, arguments);
        });
    }
    else if (options.success) {
        callbacks.push(options.success);
    }

    options.success = function(data, status, xhr) { // jQuery 1.4+ passes xhr as 3rd arg
        var context = options.context || this ;    // jQuery 1.4+ supports scope context
        for (var i=0, max=callbacks.length; i < max; i++) {
            callbacks[i].apply(context, [data, status, xhr || $form, $form]);
        }
    };

    if (options.error) {
        var oldError = options.error;
        options.error = function(xhr, status, error) {
            var context = options.context || this;
            oldError.apply(context, [xhr, status, error, $form]);
        };
    }

     if (options.complete) {
        var oldComplete = options.complete;
        options.complete = function(xhr, status) {
            var context = options.context || this;
            oldComplete.apply(context, [xhr, status, $form]);
        };
    }

    // are there files to upload?

    // [value] (issue #113), also see comment:
    // https://github.com/malsup/form/commit/588306aedba1de01388032d5f42a60159eea9228#commitcomment-2180219
    var fileInputs = $('input[type=file]:enabled', this).filter(function() { return $(this).val() !== ''; });

    var hasFileInputs = fileInputs.length > 0;
    var mp = 'multipart/form-data';
    var multipart = ($form.attr('enctype') == mp || $form.attr('encoding') == mp);

    var fileAPI = feature.fileapi && feature.formdata;
    log("fileAPI :" + fileAPI);
    var shouldUseFrame = (hasFileInputs || multipart) && !fileAPI;

    var jqxhr;

    // options.iframe allows user to force iframe mode
    // 06-NOV-09: now defaulting to iframe mode if file input is detected
    if (options.iframe !== false && (options.iframe || shouldUseFrame)) {
        // hack to fix Safari hang (thanks to Tim Molendijk for this)
        // see:  http://groups.google.com/group/jquery-dev/browse_thread/thread/36395b7ab510dd5d
        if (options.closeKeepAlive) {
            $.get(options.closeKeepAlive, function() {
                jqxhr = fileUploadIframe(a);
            });
        }
        else {
            jqxhr = fileUploadIframe(a);
        }
    }
    else if ((hasFileInputs || multipart) && fileAPI) {
        jqxhr = fileUploadXhr(a);
    }
    else {
        jqxhr = $.ajax(options);
    }

    $form.removeData('jqxhr').data('jqxhr', jqxhr);

    // clear element array
    for (var k=0; k < elements.length; k++) {
        elements[k] = null;
    }

    // fire 'notify' event
    this.trigger('form-submit-notify', [this, options]);
    return this;

    // utility fn for deep serialization
    function deepSerialize(extraData){
        var serialized = $.param(extraData, options.traditional).split('&');
        var len = serialized.length;
        var result = [];
        var i, part;
        for (i=0; i < len; i++) {
            // #252; undo param space replacement
            serialized[i] = serialized[i].replace(/\+/g,' ');
            part = serialized[i].split('=');
            // #278; use array instead of object storage, favoring array serializations
            result.push([decodeURIComponent(part[0]), decodeURIComponent(part[1])]);
        }
        return result;
    }

     // XMLHttpRequest Level 2 file uploads (big hat tip to francois2metz)
    function fileUploadXhr(a) {
        var formdata = new FormData();

        for (var i=0; i < a.length; i++) {
            formdata.append(a[i].name, a[i].value);
        }

        if (options.extraData) {
            var serializedData = deepSerialize(options.extraData);
            for (i=0; i < serializedData.length; i++) {
                if (serializedData[i]) {
                    formdata.append(serializedData[i][0], serializedData[i][1]);
                }
            }
        }

        options.data = null;

        var s = $.extend(true, {}, $.ajaxSettings, options, {
            contentType: false,
            processData: false,
            cache: false,
            type: method || 'POST'
        });

        if (options.uploadProgress) {
            // workaround because jqXHR does not expose upload property
            s.xhr = function() {
                var xhr = $.ajaxSettings.xhr();
                if (xhr.upload) {
                    xhr.upload.addEventListener('progress', function(event) {
                        var percent = 0;
                        var position = event.loaded || event.position; /*event.position is deprecated*/
                        var total = event.total;
                        if (event.lengthComputable) {
                            percent = Math.ceil(position / total * 100);
                        }
                        options.uploadProgress(event, position, total, percent);
                    }, false);
                }
                return xhr;
            };
        }

        s.data = null;
        var beforeSend = s.beforeSend;
        s.beforeSend = function(xhr, o) {
            //Send FormData() provided by user
            if (options.formData) {
                o.data = options.formData;
            }
            else {
                o.data = formdata;
            }
            if(beforeSend) {
                beforeSend.call(this, xhr, o);
            }
        };
        return $.ajax(s);
    }

    // private function for handling file uploads (hat tip to YAHOO!)
    function fileUploadIframe(a) {
        var form = $form[0], el, i, s, g, id, $io, io, xhr, sub, n, timedOut, timeoutHandle;
        var deferred = $.Deferred();

        // #341
        deferred.abort = function(status) {
            xhr.abort(status);
        };

        if (a) {
            // ensure that every serialized input is still enabled
            for (i=0; i < elements.length; i++) {
                el = $(elements[i]);
                if ( hasProp ) {
                    el.prop('disabled', false);
                }
                else {
                    el.removeAttr('disabled');
                }
            }
        }

        s = $.extend(true, {}, $.ajaxSettings, options);
        s.context = s.context || s;
        id = 'jqFormIO' + (new Date().getTime());
        if (s.iframeTarget) {
            $io = $(s.iframeTarget);
            n = $io.attr2('name');
            if (!n) {
                $io.attr2('name', id);
            }
            else {
                id = n;
            }
        }
        else {
            $io = $('<iframe name="' + id + '" src="'+ s.iframeSrc +'" />');
            $io.css({ position: 'absolute', top: '-1000px', left: '-1000px' });
        }
        io = $io[0];


        xhr = { // mock object
            aborted: 0,
            responseText: null,
            responseXML: null,
            status: 0,
            statusText: 'n/a',
            getAllResponseHeaders: function() {},
            getResponseHeader: function() {},
            setRequestHeader: function() {},
            abort: function(status) {
                var e = (status === 'timeout' ? 'timeout' : 'aborted');
                log('aborting upload... ' + e);
                this.aborted = 1;

                try { // #214, #257
                    if (io.contentWindow.document.execCommand) {
                        io.contentWindow.document.execCommand('Stop');
                    }
                }
                catch(ignore) {}

                $io.attr('src', s.iframeSrc); // abort op in progress
                xhr.error = e;
                if (s.error) {
                    s.error.call(s.context, xhr, e, status);
                }
                if (g) {
                    $.event.trigger("ajaxError", [xhr, s, e]);
                }
                if (s.complete) {
                    s.complete.call(s.context, xhr, e);
                }
            }
        };

        g = s.global;
        // trigger ajax global events so that activity/block indicators work like normal
        if (g && 0 === $.active++) {
            $.event.trigger("ajaxStart");
        }
        if (g) {
            $.event.trigger("ajaxSend", [xhr, s]);
        }

        if (s.beforeSend && s.beforeSend.call(s.context, xhr, s) === false) {
            if (s.global) {
                $.active--;
            }
            deferred.reject();
            return deferred;
        }
        if (xhr.aborted) {
            deferred.reject();
            return deferred;
        }

        // add submitting element to data if we know it
        sub = form.clk;
        if (sub) {
            n = sub.name;
            if (n && !sub.disabled) {
                s.extraData = s.extraData || {};
                s.extraData[n] = sub.value;
                if (sub.type == "image") {
                    s.extraData[n+'.x'] = form.clk_x;
                    s.extraData[n+'.y'] = form.clk_y;
                }
            }
        }

        var CLIENT_TIMEOUT_ABORT = 1;
        var SERVER_ABORT = 2;
                
        function getDoc(frame) {
            /* it looks like contentWindow or contentDocument do not
             * carry the protocol property in ie8, when running under ssl
             * frame.document is the only valid response document, since
             * the protocol is know but not on the other two objects. strange?
             * "Same origin policy" http://en.wikipedia.org/wiki/Same_origin_policy
             */
            
            var doc = null;
            
            // IE8 cascading access check
            try {
                if (frame.contentWindow) {
                    doc = frame.contentWindow.document;
                }
            } catch(err) {
                // IE8 access denied under ssl & missing protocol
                log('cannot get iframe.contentWindow document: ' + err);
            }

            if (doc) { // successful getting content
                return doc;
            }

            try { // simply checking may throw in ie8 under ssl or mismatched protocol
                doc = frame.contentDocument ? frame.contentDocument : frame.document;
            } catch(err) {
                // last attempt
                log('cannot get iframe.contentDocument: ' + err);
                doc = frame.document;
            }
            return doc;
        }

        // Rails CSRF hack (thanks to Yvan Barthelemy)
        var csrf_token = $('meta[name=csrf-token]').attr('content');
        var csrf_param = $('meta[name=csrf-param]').attr('content');
        if (csrf_param && csrf_token) {
            s.extraData = s.extraData || {};
            s.extraData[csrf_param] = csrf_token;
        }

        // take a breath so that pending repaints get some cpu time before the upload starts
        function doSubmit() {
            // make sure form attrs are set
            var t = $form.attr2('target'), 
                a = $form.attr2('action'), 
                mp = 'multipart/form-data',
                et = $form.attr('enctype') || $form.attr('encoding') || mp;

            // update form attrs in IE friendly way
            form.setAttribute('target',id);
            if (!method || /post/i.test(method) ) {
                form.setAttribute('method', 'POST');
            }
            if (a != s.url) {
                form.setAttribute('action', s.url);
            }

            // ie borks in some cases when setting encoding
            if (! s.skipEncodingOverride && (!method || /post/i.test(method))) {
                $form.attr({
                    encoding: 'multipart/form-data',
                    enctype:  'multipart/form-data'
                });
            }

            // support timout
            if (s.timeout) {
                timeoutHandle = setTimeout(function() { timedOut = true; cb(CLIENT_TIMEOUT_ABORT); }, s.timeout);
            }

            // look for server aborts
            function checkState() {
                try {
                    var state = getDoc(io).readyState;
                    log('state = ' + state);
                    if (state && state.toLowerCase() == 'uninitialized') {
                        setTimeout(checkState,50);
                    }
                }
                catch(e) {
                    log('Server abort: ' , e, ' (', e.name, ')');
                    cb(SERVER_ABORT);
                    if (timeoutHandle) {
                        clearTimeout(timeoutHandle);
                    }
                    timeoutHandle = undefined;
                }
            }

            // add "extra" data to form if provided in options
            var extraInputs = [];
            try {
                if (s.extraData) {
                    for (var n in s.extraData) {
                        if (s.extraData.hasOwnProperty(n)) {
                           // if using the $.param format that allows for multiple values with the same name
                           if($.isPlainObject(s.extraData[n]) && s.extraData[n].hasOwnProperty('name') && s.extraData[n].hasOwnProperty('value')) {
                               extraInputs.push(
                               $('<input type="hidden" name="'+s.extraData[n].name+'">').val(s.extraData[n].value)
                                   .appendTo(form)[0]);
                           } else {
                               extraInputs.push(
                               $('<input type="hidden" name="'+n+'">').val(s.extraData[n])
                                   .appendTo(form)[0]);
                           }
                        }
                    }
                }

                if (!s.iframeTarget) {
                    // add iframe to doc and submit the form
                    $io.appendTo('body');
                }
                if (io.attachEvent) {
                    io.attachEvent('onload', cb);
                }
                else {
                    io.addEventListener('load', cb, false);
                }
                setTimeout(checkState,15);

                try {
                    form.submit();
                } catch(err) {
                    // just in case form has element with name/id of 'submit'
                    var submitFn = document.createElement('form').submit;
                    submitFn.apply(form);
                }
            }
            finally {
                // reset attrs and remove "extra" input elements
                form.setAttribute('action',a);
                form.setAttribute('enctype', et); // #380
                if(t) {
                    form.setAttribute('target', t);
                } else {
                    $form.removeAttr('target');
                }
                $(extraInputs).remove();
            }
        }

        if (s.forceSync) {
            doSubmit();
        }
        else {
            setTimeout(doSubmit, 10); // this lets dom updates render
        }

        var data, doc, domCheckCount = 50, callbackProcessed;

        function cb(e) {
            if (xhr.aborted || callbackProcessed) {
                return;
            }
            
            doc = getDoc(io);
            if(!doc) {
                log('cannot access response document');
                e = SERVER_ABORT;
            }
            if (e === CLIENT_TIMEOUT_ABORT && xhr) {
                xhr.abort('timeout');
                deferred.reject(xhr, 'timeout');
                return;
            }
            else if (e == SERVER_ABORT && xhr) {
                xhr.abort('server abort');
                deferred.reject(xhr, 'error', 'server abort');
                return;
            }

            if (!doc || doc.location.href == s.iframeSrc) {
                // response not received yet
                if (!timedOut) {
                    return;
                }
            }
            if (io.detachEvent) {
                io.detachEvent('onload', cb);
            }
            else {
                io.removeEventListener('load', cb, false);
            }

            var status = 'success', errMsg;
            try {
                if (timedOut) {
                    throw 'timeout';
                }

                var isXml = s.dataType == 'xml' || doc.XMLDocument || $.isXMLDoc(doc);
                log('isXml='+isXml);
                if (!isXml && window.opera && (doc.body === null || !doc.body.innerHTML)) {
                    if (--domCheckCount) {
                        // in some browsers (Opera) the iframe DOM is not always traversable when
                        // the onload callback fires, so we loop a bit to accommodate
                        log('requeing onLoad callback, DOM not available');
                        setTimeout(cb, 250);
                        return;
                    }
                    // let this fall through because server response could be an empty document
                    //log('Could not access iframe DOM after mutiple tries.');
                    //throw 'DOMException: not available';
                }

                //log('response detected');
                var docRoot = doc.body ? doc.body : doc.documentElement;
                xhr.responseText = docRoot ? docRoot.innerHTML : null;
                xhr.responseXML = doc.XMLDocument ? doc.XMLDocument : doc;
                if (isXml) {
                    s.dataType = 'xml';
                }
                xhr.getResponseHeader = function(header){
                    var headers = {'content-type': s.dataType};
                    return headers[header.toLowerCase()];
                };
                // support for XHR 'status' & 'statusText' emulation :
                if (docRoot) {
                    xhr.status = Number( docRoot.getAttribute('status') ) || xhr.status;
                    xhr.statusText = docRoot.getAttribute('statusText') || xhr.statusText;
                }

                var dt = (s.dataType || '').toLowerCase();
                var scr = /(json|script|text)/.test(dt);
                if (scr || s.textarea) {
                    // see if user embedded response in textarea
                    var ta = doc.getElementsByTagName('textarea')[0];
                    if (ta) {
                        xhr.responseText = ta.value;
                        // support for XHR 'status' & 'statusText' emulation :
                        xhr.status = Number( ta.getAttribute('status') ) || xhr.status;
                        xhr.statusText = ta.getAttribute('statusText') || xhr.statusText;
                    }
                    else if (scr) {
                        // account for browsers injecting pre around json response
                        var pre = doc.getElementsByTagName('pre')[0];
                        var b = doc.getElementsByTagName('body')[0];
                        if (pre) {
                            xhr.responseText = pre.textContent ? pre.textContent : pre.innerText;
                        }
                        else if (b) {
                            xhr.responseText = b.textContent ? b.textContent : b.innerText;
                        }
                    }
                }
                else if (dt == 'xml' && !xhr.responseXML && xhr.responseText) {
                    xhr.responseXML = toXml(xhr.responseText);
                }

                try {
                    data = httpData(xhr, dt, s);
                }
                catch (err) {
                    status = 'parsererror';
                    xhr.error = errMsg = (err || status);
                }
            }
            catch (err) {
                log('error caught: ',err);
                status = 'error';
                xhr.error = errMsg = (err || status);
            }

            if (xhr.aborted) {
                log('upload aborted');
                status = null;
            }

            if (xhr.status) { // we've set xhr.status
                status = (xhr.status >= 200 && xhr.status < 300 || xhr.status === 304) ? 'success' : 'error';
            }

            // ordering of these callbacks/triggers is odd, but that's how $.ajax does it
            if (status === 'success') {
                if (s.success) {
                    s.success.call(s.context, data, 'success', xhr);
                }
                deferred.resolve(xhr.responseText, 'success', xhr);
                if (g) {
                    $.event.trigger("ajaxSuccess", [xhr, s]);
                }
            }
            else if (status) {
                if (errMsg === undefined) {
                    errMsg = xhr.statusText;
                }
                if (s.error) {
                    s.error.call(s.context, xhr, status, errMsg);
                }
                deferred.reject(xhr, 'error', errMsg);
                if (g) {
                    $.event.trigger("ajaxError", [xhr, s, errMsg]);
                }
            }

            if (g) {
                $.event.trigger("ajaxComplete", [xhr, s]);
            }

            if (g && ! --$.active) {
                $.event.trigger("ajaxStop");
            }

            if (s.complete) {
                s.complete.call(s.context, xhr, status);
            }

            callbackProcessed = true;
            if (s.timeout) {
                clearTimeout(timeoutHandle);
            }

            // clean up
            setTimeout(function() {
                if (!s.iframeTarget) {
                    $io.remove();
                }
                else { //adding else to clean up existing iframe response.
                    $io.attr('src', s.iframeSrc);
                }
                xhr.responseXML = null;
            }, 100);
        }

        var toXml = $.parseXML || function(s, doc) { // use parseXML if available (jQuery 1.5+)
            if (window.ActiveXObject) {
                doc = new ActiveXObject('Microsoft.XMLDOM');
                doc.async = 'false';
                doc.loadXML(s);
            }
            else {
                doc = (new DOMParser()).parseFromString(s, 'text/xml');
            }
            return (doc && doc.documentElement && doc.documentElement.nodeName != 'parsererror') ? doc : null;
        };
        var parseJSON = $.parseJSON || function(s) {
            /*jslint evil:true */
            return window['eval']('(' + s + ')');
        };

        var httpData = function( xhr, type, s ) { // mostly lifted from jq1.4.4

            var ct = xhr.getResponseHeader('content-type') || '',
                xml = type === 'xml' || !type && ct.indexOf('xml') >= 0,
                data = xml ? xhr.responseXML : xhr.responseText;

            if (xml && data.documentElement.nodeName === 'parsererror') {
                if ($.error) {
                    $.error('parsererror');
                }
            }
            if (s && s.dataFilter) {
                data = s.dataFilter(data, type);
            }
            if (typeof data === 'string') {
                if (type === 'json' || !type && ct.indexOf('json') >= 0) {
                    data = parseJSON(data);
                } else if (type === "script" || !type && ct.indexOf("javascript") >= 0) {
                    $.globalEval(data);
                }
            }
            return data;
        };

        return deferred;
    }
};

/**
 * ajaxForm() provides a mechanism for fully automating form submission.
 *
 * The advantages of using this method instead of ajaxSubmit() are:
 *
 * 1: This method will include coordinates for <input type="image" /> elements (if the element
 *    is used to submit the form).
 * 2. This method will include the submit element's name/value data (for the element that was
 *    used to submit the form).
 * 3. This method binds the submit() method to the form for you.
 *
 * The options argument for ajaxForm works exactly as it does for ajaxSubmit.  ajaxForm merely
 * passes the options argument along after properly binding events for submit elements and
 * the form itself.
 */
$.fn.ajaxForm = function(options) {
    options = options || {};
    options.delegation = options.delegation && $.isFunction($.fn.on);

    // in jQuery 1.3+ we can fix mistakes with the ready state
    if (!options.delegation && this.length === 0) {
        var o = { s: this.selector, c: this.context };
        if (!$.isReady && o.s) {
            log('DOM not ready, queuing ajaxForm');
            $(function() {
                $(o.s,o.c).ajaxForm(options);
            });
            return this;
        }
        // is your DOM ready?  http://docs.jquery.com/Tutorials:Introducing_$(document).ready()
        log('terminating; zero elements found by selector' + ($.isReady ? '' : ' (DOM not ready)'));
        return this;
    }

    if ( options.delegation ) {
        $(document)
            .off('submit.form-plugin', this.selector, doAjaxSubmit)
            .off('click.form-plugin', this.selector, captureSubmittingElement)
            .on('submit.form-plugin', this.selector, options, doAjaxSubmit)
            .on('click.form-plugin', this.selector, options, captureSubmittingElement);
        return this;
    }

    return this.ajaxFormUnbind()
        .bind('submit.form-plugin', options, doAjaxSubmit)
        .bind('click.form-plugin', options, captureSubmittingElement);
};

// private event handlers
function doAjaxSubmit(e) {
    /*jshint validthis:true */
    var options = e.data;
    if (!e.isDefaultPrevented()) { // if event has been canceled, don't proceed
        e.preventDefault();
        $(e.target).ajaxSubmit(options); // #365
    }
}

function captureSubmittingElement(e) {
    /*jshint validthis:true */
    var target = e.target;
    var $el = $(target);
    if (!($el.is("[type=submit],[type=image]"))) {
        // is this a child element of the submit el?  (ex: a span within a button)
        var t = $el.closest('[type=submit]');
        if (t.length === 0) {
            return;
        }
        target = t[0];
    }
    var form = this;
    form.clk = target;
    if (target.type == 'image') {
        if (e.offsetX !== undefined) {
            form.clk_x = e.offsetX;
            form.clk_y = e.offsetY;
        } else if (typeof $.fn.offset == 'function') {
            var offset = $el.offset();
            form.clk_x = e.pageX - offset.left;
            form.clk_y = e.pageY - offset.top;
        } else {
            form.clk_x = e.pageX - target.offsetLeft;
            form.clk_y = e.pageY - target.offsetTop;
        }
    }
    // clear form vars
    setTimeout(function() { form.clk = form.clk_x = form.clk_y = null; }, 100);
}


// ajaxFormUnbind unbinds the event handlers that were bound by ajaxForm
$.fn.ajaxFormUnbind = function() {
    return this.unbind('submit.form-plugin click.form-plugin');
};

/**
 * formToArray() gathers form element data into an array of objects that can
 * be passed to any of the following ajax functions: $.get, $.post, or load.
 * Each object in the array has both a 'name' and 'value' property.  An example of
 * an array for a simple login form might be:
 *
 * [ { name: 'username', value: 'jresig' }, { name: 'password', value: 'secret' } ]
 *
 * It is this array that is passed to pre-submit callback functions provided to the
 * ajaxSubmit() and ajaxForm() methods.
 */
$.fn.formToArray = function(semantic, elements) {
    var a = [];
    if (this.length === 0) {
        return a;
    }

    var form = this[0];
    var formId = this.attr('id');
    var els = semantic ? form.getElementsByTagName('*') : form.elements;
    var els2;

    if (els && !/MSIE [678]/.test(navigator.userAgent)) { // #390
        els = $(els).get();  // convert to standard array
    }

    // #386; account for inputs outside the form which use the 'form' attribute
    if ( formId ) {
        els2 = $(':input[form=' + formId + ']').get();
        if ( els2.length ) {
            els = (els || []).concat(els2);
        }
    }

    if (!els || !els.length) {
        return a;
    }

    var i,j,n,v,el,max,jmax;
    for(i=0, max=els.length; i < max; i++) {
        el = els[i];
        n = el.name;
        if (!n || el.disabled) {
            continue;
        }

        if (semantic && form.clk && el.type == "image") {
            // handle image inputs on the fly when semantic == true
            if(form.clk == el) {
                a.push({name: n, value: $(el).val(), type: el.type });
                a.push({name: n+'.x', value: form.clk_x}, {name: n+'.y', value: form.clk_y});
            }
            continue;
        }

        v = $.fieldValue(el, true);
        if (v && v.constructor == Array) {
            if (elements) {
                elements.push(el);
            }
            for(j=0, jmax=v.length; j < jmax; j++) {
                a.push({name: n, value: v[j]});
            }
        }
        else if (feature.fileapi && el.type == 'file') {
            if (elements) {
                elements.push(el);
            }
            var files = el.files;
            if (files.length) {
                for (j=0; j < files.length; j++) {
                    a.push({name: n, value: files[j], type: el.type});
                }
            }
            else {
                // #180
                a.push({ name: n, value: '', type: el.type });
            }
        }
        else if (v !== null && typeof v != 'undefined') {
            if (elements) {
                elements.push(el);
            }
            a.push({name: n, value: v, type: el.type, required: el.required});
        }
    }

    if (!semantic && form.clk) {
        // input type=='image' are not found in elements array! handle it here
        var $input = $(form.clk), input = $input[0];
        n = input.name;
        if (n && !input.disabled && input.type == 'image') {
            a.push({name: n, value: $input.val()});
            a.push({name: n+'.x', value: form.clk_x}, {name: n+'.y', value: form.clk_y});
        }
    }
    return a;
};

/**
 * Serializes form data into a 'submittable' string. This method will return a string
 * in the format: name1=value1&amp;name2=value2
 */
$.fn.formSerialize = function(semantic) {
    //hand off to jQuery.param for proper encoding
    return $.param(this.formToArray(semantic));
};

/**
 * Serializes all field elements in the jQuery object into a query string.
 * This method will return a string in the format: name1=value1&amp;name2=value2
 */
$.fn.fieldSerialize = function(successful) {
    var a = [];
    this.each(function() {
        var n = this.name;
        if (!n) {
            return;
        }
        var v = $.fieldValue(this, successful);
        if (v && v.constructor == Array) {
            for (var i=0,max=v.length; i < max; i++) {
                a.push({name: n, value: v[i]});
            }
        }
        else if (v !== null && typeof v != 'undefined') {
            a.push({name: this.name, value: v});
        }
    });
    //hand off to jQuery.param for proper encoding
    return $.param(a);
};

/**
 * Returns the value(s) of the element in the matched set.  For example, consider the following form:
 *
 *  <form><fieldset>
 *      <input name="A" type="text" />
 *      <input name="A" type="text" />
 *      <input name="B" type="checkbox" value="B1" />
 *      <input name="B" type="checkbox" value="B2"/>
 *      <input name="C" type="radio" value="C1" />
 *      <input name="C" type="radio" value="C2" />
 *  </fieldset></form>
 *
 *  var v = $('input[type=text]').fieldValue();
 *  // if no values are entered into the text inputs
 *  v == ['','']
 *  // if values entered into the text inputs are 'foo' and 'bar'
 *  v == ['foo','bar']
 *
 *  var v = $('input[type=checkbox]').fieldValue();
 *  // if neither checkbox is checked
 *  v === undefined
 *  // if both checkboxes are checked
 *  v == ['B1', 'B2']
 *
 *  var v = $('input[type=radio]').fieldValue();
 *  // if neither radio is checked
 *  v === undefined
 *  // if first radio is checked
 *  v == ['C1']
 *
 * The successful argument controls whether or not the field element must be 'successful'
 * (per http://www.w3.org/TR/html4/interact/forms.html#successful-controls).
 * The default value of the successful argument is true.  If this value is false the value(s)
 * for each element is returned.
 *
 * Note: This method *always* returns an array.  If no valid value can be determined the
 *    array will be empty, otherwise it will contain one or more values.
 */
$.fn.fieldValue = function(successful) {
    for (var val=[], i=0, max=this.length; i < max; i++) {
        var el = this[i];
        var v = $.fieldValue(el, successful);
        if (v === null || typeof v == 'undefined' || (v.constructor == Array && !v.length)) {
            continue;
        }
        if (v.constructor == Array) {
            $.merge(val, v);
        }
        else {
            val.push(v);
        }
    }
    return val;
};

/**
 * Returns the value of the field element.
 */
$.fieldValue = function(el, successful) {
    var n = el.name, t = el.type, tag = el.tagName.toLowerCase();
    if (successful === undefined) {
        successful = true;
    }

    if (successful && (!n || el.disabled || t == 'reset' || t == 'button' ||
        (t == 'checkbox' || t == 'radio') && !el.checked ||
        (t == 'submit' || t == 'image') && el.form && el.form.clk != el ||
        tag == 'select' && el.selectedIndex == -1)) {
            return null;
    }

    if (tag == 'select') {
        var index = el.selectedIndex;
        if (index < 0) {
            return null;
        }
        var a = [], ops = el.options;
        var one = (t == 'select-one');
        var max = (one ? index+1 : ops.length);
        for(var i=(one ? index : 0); i < max; i++) {
            var op = ops[i];
            if (op.selected) {
                var v = op.value;
                if (!v) { // extra pain for IE...
                    v = (op.attributes && op.attributes.value && !(op.attributes.value.specified)) ? op.text : op.value;
                }
                if (one) {
                    return v;
                }
                a.push(v);
            }
        }
        return a;
    }
    return $(el).val();
};

/**
 * Clears the form data.  Takes the following actions on the form's input fields:
 *  - input text fields will have their 'value' property set to the empty string
 *  - select elements will have their 'selectedIndex' property set to -1
 *  - checkbox and radio inputs will have their 'checked' property set to false
 *  - inputs of type submit, button, reset, and hidden will *not* be effected
 *  - button elements will *not* be effected
 */
$.fn.clearForm = function(includeHidden) {
    return this.each(function() {
        $('input,select,textarea', this).clearFields(includeHidden);
    });
};

/**
 * Clears the selected form elements.
 */
$.fn.clearFields = $.fn.clearInputs = function(includeHidden) {
    var re = /^(?:color|date|datetime|email|month|number|password|range|search|tel|text|time|url|week)$/i; // 'hidden' is not in this list
    return this.each(function() {
        var t = this.type, tag = this.tagName.toLowerCase();
        if (re.test(t) || tag == 'textarea') {
            this.value = '';
        }
        else if (t == 'checkbox' || t == 'radio') {
            this.checked = false;
        }
        else if (tag == 'select') {
            this.selectedIndex = -1;
        }
		else if (t == "file") {
			if (/MSIE/.test(navigator.userAgent)) {
				$(this).replaceWith($(this).clone(true));
			} else {
				$(this).val('');
			}
		}
        else if (includeHidden) {
            // includeHidden can be the value true, or it can be a selector string
            // indicating a special test; for example:
            //  $('#myForm').clearForm('.special:hidden')
            // the above would clean hidden inputs that have the class of 'special'
            if ( (includeHidden === true && /hidden/.test(t)) ||
                 (typeof includeHidden == 'string' && $(this).is(includeHidden)) ) {
                this.value = '';
            }
        }
    });
};

/**
 * Resets the form data.  Causes all form elements to be reset to their original value.
 */
$.fn.resetForm = function() {
    return this.each(function() {
        // guard against an input with the name of 'reset'
        // note that IE reports the reset function as an 'object'
        if (typeof this.reset == 'function' || (typeof this.reset == 'object' && !this.reset.nodeType)) {
            this.reset();
        }
    });
};

/**
 * Enables or disables any matching elements.
 */
$.fn.enable = function(b) {
    if (b === undefined) {
        b = true;
    }
    return this.each(function() {
        this.disabled = !b;
    });
};

/**
 * Checks/unchecks any matching checkboxes or radio buttons and
 * selects/deselects and matching option elements.
 */
$.fn.selected = function(select) {
    if (select === undefined) {
        select = true;
    }
    return this.each(function() {
        var t = this.type;
        if (t == 'checkbox' || t == 'radio') {
            this.checked = select;
        }
        else if (this.tagName.toLowerCase() == 'option') {
            var $sel = $(this).parent('select');
            if (select && $sel[0] && $sel[0].type == 'select-one') {
                // deselect all other options
                $sel.find('option').selected(false);
            }
            this.selected = select;
        }
    });
};

// expose debug var
$.fn.ajaxSubmit.debug = false;

// helper fn for console logging
function log() {
    if (!$.fn.ajaxSubmit.debug) {
        return;
    }
    var msg = '[jquery.form] ' + Array.prototype.join.call(arguments,'');
    if (window.console && window.console.log) {
        window.console.log(msg);
    }
    else if (window.opera && window.opera.postError) {
        window.opera.postError(msg);
    }
}

}));


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

(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define([], factory);
    } else if (typeof module === 'object' && module.exports) {
        // Node. Does not work with strict CommonJS, but
        // only CommonJS-like environments that support module.exports,
        // like Node.
        module.exports = factory();
    } else {
        // Browser globals (root is window)
        root.PDFObject = factory();
  }
}(this, function () {

    "use strict";
    //jshint unused:true

    //PDFObject is designed for client-side (browsers), not server-side (node)
    //Will choke on undefined navigator and window vars when run on server
    //Return boolean false and exit function when running server-side

    if(typeof window === "undefined" || typeof navigator === "undefined"){ return false; }

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
        isIOS = (function (){ return (/iphone|ipad|ipod/i.test(navigator.userAgent.toLowerCase())); })(),
        generateEmbedElement;


    /* ----------------------------------------------------
       Supporting functions
       ---------------------------------------------------- */

    createAXO = function (type){
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
    isIE = function (){ return !!(window.ActiveXObject || "ActiveXObject" in window); };

    //If either ActiveX support for "AcroPDF.PDF" or "PDF.PdfCtrl" are found, return true
    //Constructed as a method (not a prop) to avoid unneccesarry overhead -- will only be evaluated if needed
    supportsPdfActiveX = function (){ return !!(createAXO("AcroPDF.PDF") || createAXO("PDF.PdfCtrl")); };

    //Determines whether PDF support is available
    supportsPDFs = (supportsPdfMimeType || (isIE() && supportsPdfActiveX()));

    //Create a fragment identifier for using PDF Open parameters when embedding PDF
    buildFragmentString = function(pdfParams){

        var string = "",
            prop;

        if(pdfParams){

            for (prop in pdfParams) {
                if (pdfParams.hasOwnProperty(prop)) {
                    string += encodeURIComponent(prop) + "=" + encodeURIComponent(pdfParams[prop]) + "&";
                }
            }

            //The string will be empty if no PDF Params found
            if(string){

                string = "#" + string;

                //Remove last ampersand
                string = string.slice(0, string.length - 1);

            }

        }

        return string;

    };

    log = function (msg){
        if(typeof console !== "undefined" && console.log){
            console.log("[PDFObject] " + msg);
        }
    };

    embedError = function (msg){
        log(msg);
        return false;
    };

    getTargetElement = function (targetSelector){

        //Default to body for full-browser PDF
        var targetNode = document.body;

        //If a targetSelector is specified, check to see whether
        //it's passing a selector, jQuery object, or an HTML element

        if(typeof targetSelector === "string"){

            //Is CSS selector
            targetNode = document.querySelector(targetSelector);

        } else if (typeof jQuery !== "undefined" && targetSelector instanceof jQuery && targetSelector.length) {

            //Is jQuery element. Extract HTML node
            targetNode = targetSelector.get(0);

        } else if (typeof targetSelector.nodeType !== "undefined" && targetSelector.nodeType === 1){

            //Is HTML element
            targetNode = targetSelector;

        }

        return targetNode;

    };

    generatePDFJSiframe = function (targetNode, url, pdfOpenFragment, PDFJS_URL, id){

        var fullURL = PDFJS_URL + "?file=" + encodeURIComponent(url) + pdfOpenFragment;
        var scrollfix = (isIOS) ? "-webkit-overflow-scrolling: touch; overflow-y: scroll; " : "overflow: hidden; ";
        var iframe = "<div style='" + scrollfix + "position: absolute; top: 0; right: 0; bottom: 0; left: 0;'><iframe  " + id + " src='" + fullURL + "' style='border: none; width: 100%; height: 100%;' frameborder='0'></iframe></div>";
        targetNode.className += " pdfobject-container";
        targetNode.style.position = "relative";
        targetNode.style.overflow = "auto";
        targetNode.innerHTML = iframe;
        return targetNode.getElementsByTagName("iframe")[0];

    };

    generateEmbedElement = function (targetNode, targetSelector, url, pdfOpenFragment, width, height, id){

        var style = "";

        if(targetSelector && targetSelector !== document.body){
            style = "width: " + width + "; height: " + height + ";";
        } else {
            style = "position: absolute; top: 0; right: 0; bottom: 0; left: 0; width: 100%; height: 100%;";
        }

        targetNode.className += " pdfobject-container";
        targetNode.innerHTML = "<embed " + id + " class='pdfobject' src='" + url + pdfOpenFragment + "' type='application/pdf' style='overflow: auto; " + style + "'/>";

        return targetNode.getElementsByTagName("embed")[0];

    };

    embed = function(url, targetSelector, options){

        //Ensure URL is available. If not, exit now.
        if(typeof url !== "string"){ return embedError("URL is not valid"); }

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
        if(!targetNode){ return embedError("Target element cannot be determined"); }


        //page option overrides pdfOpenParams, if found
        if(page){
            pdfOpenParams.page = page;
        }

        //Stringify optional Adobe params for opening document (as fragment identifier)
        pdfOpenFragment = buildFragmentString(pdfOpenParams);

        //Do the dance
        if(forcePDFJS && PDFJS_URL){

            return generatePDFJSiframe(targetNode, url, pdfOpenFragment, PDFJS_URL, id);

        } else if(supportsPDFs){

            return generateEmbedElement(targetNode, targetSelector, url, pdfOpenFragment, width, height, id);

        } else {

            if(PDFJS_URL){

                return generatePDFJSiframe(targetNode, url, pdfOpenFragment, PDFJS_URL, id);

            } else if(fallbackLink){

                fallbackHTML = (typeof fallbackLink === "string") ? fallbackLink : fallbackHTML_default;
                targetNode.innerHTML = fallbackHTML.replace(/\[url\]/g, url);

            }

            return embedError("This browser does not support embedded PDFs");

        }

    };

    return {
        embed: function (a,b,c){ return embed(a,b,c); },
        pdfobjectversion: (function () { return pdfobjectversion; })(),
        supportsPDFs: (function (){ return supportsPDFs; })()
    };

}));
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

'use strict';
window.docmana.templates = Object.create(null);
window.docmana.templates['breadcrumb.html'] = '<% _.forEach(data, function(item, i){ %>\n    <% if(i === data.length - 1){ %>\n    <li class="active">\n        <span>\n            <%- item.name %>\n        </span>\n    </li>\n    <% }else{ %>\n    <li>\n        <a href="#" data-hash="<%- item.hash %>">\n            <%- item.name %>\n        </a>\n    </li>\n    <% } %>\n<% }); %>';
window.docmana.templates['fileInfo.html'] = '<div class="docmana-file-info">\n    <div class="media center-block">\n        <div class="media-left file-type-large">\n            <span class="filetype <%- T.name2IconClass(data.name, data.mime) %>"></span>\n        </div>\n        <div class="media-body">\n            <h4 class="media-heading">\n                <%- data.name%>\n            </h4>\n            <p>\n            <p>\n                <%- L(\'fileType\') %>:\n                <%- L(\'kind\' + T.mime2Type(data.mime)) %>\n            </p>\n            <p>\n                <%- L(\'fileDateModified\') %>:\n                <%- T.formatDate(data.ts) %>\n            </p>\n            <p>\n                <%- L(\'fileSize\') %>:\n                <%- T.formatFileSize(data.size) %>\n            </p>\n            </p>\n        </div>\n    </div>\n</div>\n';
window.docmana.templates['main.html'] = '<div class="docmana-panel">\n    <div class="docmana-heading panel-heading">\n        <div class="docmana-toolbar btn-toolbar"></div>\n    </div>\n    <div class="docmana-body panel-body no-padding">\n        <div class="docmana-navigation clearfix"></div>\n        <div class="docmana-workzone"></div>\n    </div>\n    <div class="docmana-footer panel-footer">\n        <div class="docmana-statusbar clearfix"></div>\n    </div>\n</div>\n\n<div class="modal fade" id="modal-file" tabindex="-1" role="dialog">\n    <div class="modal-dialog modal-lg static" role="document">\n        <div class="modal-content docmana-viewer"></div>\n    </div>\n</div>\n<div class="modal fade" tabindex="-1" role="dialog">\n    <div class="modal-dialog" role="document">\n        <div class="modal-content docmana-uploader"></div>\n    </div>\n</div>';
window.docmana.templates['navigation.html'] = '<div class="nav-group pull-left"></div>\n<div class="search-group btn-toolbar pull-right"></div>\n<div class="refresh-group pull-right"></div>\n<div class="breadcrumb-group form-control input-sm">\n    <ul class="docmana-breadcrumb breadcrumb no-margin"></ul>\n</div>\n';
window.docmana.templates['statusbar.html'] = '<div class="status-text pull-left"></div>\n<div class="pull-right btn-toolbar">\n    <div class="uploader btn-group"></div>\n    <div class="layout btn-group"></div>\n</div>';
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
window.docmana.templates['uploaderTrigger.html'] = '<div class="btn-uploader" style="position:relative;"  title="<%- L(\'textFileUpload\') %>">\n    <button class="btn btn-default btn-sm">\n        <i class="fa fa-tasks"></i>\n    </button>\n    <span class="badge badge-notify"></span>\n</div>';
window.docmana.templates['viewer.html'] = '<div class="modal-header">\n    <button type="button" class="close" data-dismiss="modal" aria-label="Close">\n        <span aria-hidden="true">&times;</span>\n    </button>\n    <h4 class="modal-title">�ļ�</h4>\n</div>\n<div class="modal-body no-padding docmana-viewer-body">\n\n</div>\n<div class="modal-footer clearfix">\n    <button type="button" class="btn btn-default"\n            title="<%- L(\'cmdDownload\') %>"\n            data-action="download">\n        <i class="docmana-icon docmana-icon-download"></i>\n    </button>\n    <button type="button" class="btn btn-default"\n            title="<%- L(\'textPreviousItem\') %>"\n            data-action="previous">\n        <i class="docmana-icon docmana-icon-back"></i>\n    </button>\n    <button type="button"\n            class="btn btn-default"\n            data-action="next"\n            title="<%- L(\'textNextItem\') %>">\n        <i class="docmana-icon docmana-icon-forward"></i>\n    </button>\n</div>';
window.docmana.templates['workzoneIconsView.html'] = '<div class="icons-view docmana-workzone-view clearfix">\n</div>\n';
window.docmana.templates['workzoneIconsViewItem.html'] = '<div id="<%- data.hash %>"\n     title="<%= T.fileMetadata(data) %>"\n     class="drag-block file-list-item <%- T.mime2Class(data.mime) %>"\n     data-name="<%- data.name %>">\n    <div class="filetype <%- T.name2IconClass(data.name, data.mime)%> drag-block"></div>\n    <div class="filename drag-block" title="<%- data.name %>">\n        <%- data.name %>\n    </div>\n</div>\n';
window.docmana.templates['workzoneListView.html'] = '<div class="list-view">\n    <div class="datatable-header panel panel-default">\n        <table class="table table-bordered table-condensed no-margin">\n            <colgroup>\n                <col />\n                <col style="width:135px;" />\n                <col style="width:135px;" />\n                <col style="width:90px;" />\n            </colgroup>\n            <thead>\n                <tr>\n                    <th><%- L(\'fileName\') %></th>\n                    <th><%- L(\'fileDateModified\') %></th>\n                    <th><%- L(\'fileType\') %></th>\n                    <th><%- L(\'fileSize\') %></th>\n                </tr>\n            </thead>\n        </table>\n    </div>\n    <div class="datatable-content">\n        <table class="table table-hover table-condensed no-margin">\n            <colgroup>\n                <col />\n                <col style="width:135px;" />\n                <col style="width:135px;" />\n                <col style="width:90px;" />\n            </colgroup>\n            <tbody class="docmana-workzone-view"></tbody>\n        </table>\n    </div>\n</div>\n';
window.docmana.templates['workzoneListViewItem.html'] = '<tr id="<%- data.hash %>"\n    class="file-list-item <%- T.mime2Class(data.mime) %>"\n    data-name="<%- data.name %>">\n    <td class="name">\n        <span title="<%= T.fileMetadata(data) %>">\n            <span class="filetype <%- T.name2IconClass(data.name, data.mime) %> drag-block"></span>\n            <span class="filename drag-block">\n                <%- data.name %>\n            </span>\n        </span>\n\n    </td>\n    <td class="metadata date">\n        <span class="drag-block">\n            <%- T.formatDate(data.ts) %>\n        </span>\n    </td>\n    <td class="metadata type">\n        <span class="drag-block">\n            <%- L(\'kind\' + T.mime2Type(data.mime)) %>\n        </span>\n    </td>\n    <td class="metadata size">\n        <span class="drag-block">\n            <%- data.mime === \'directory\' ? \'\' : T.formatFileSize(data.size, true) %>\n        </span>\n    </td>\n</tr>\n';

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
        statusbar: function(){
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
            panelClassName: 'panel no-margin panel-default'
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

            if (this.$el.hasClass('static') || this.$el.hasClass('fixed')) {
                this.$('.docmana-body').css({
                    top: this.$('.docmana-heading').outerHeight(),
                    bottom: this.$('.docmana-footer').outerHeight()
                });
                this.$('.docmana-workzone').css({
                    top: this.$('.docmana-navigation').outerHeight()
                });
                this.$('.docmana-navigation .breadcrumb-group').css({
                    'margin-left': this.$('.docmana-navigation .nav-group').outerWidth() + 5,
                    'margin-right': this.$('.docmana-navigation .search-group').outerWidth() + 5
                });
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
            _.forEach(_.flatten(this.props.commands), function (cmds) {

                if (_.isArray(cmds)) {

                    _.forEach(cmds, function (cmd) {
                        var instance = docmana.commands[cmd](_.extend({
                            main: that
                        }, that.props[cmd]));

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
            strs.push(lang('Type') + ': ' + lang('kind' + this.mime2Type(data.mime)));
            if (data.mime !== 'directory') {
                strs.push(lang('Size') + ': ' + this.formatFileSize(data.size));
            }
            strs.push(lang('Date modified') + ': ' + this.formatDate(data.ts));
            return strs.join(' &#13; ');
        }
    }, docmana.utils);

    docmana.templateHelper = templateHelper;

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

            if (info == null) {
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

    docmana.ui.templates = {
        toolbarBtn: $('#tpl-toolbar-btn').html(),
        toolbarBtnUpload: $('#tpl-toolbar-btn-upload').html(),
        toolbarBtnGroup: $('#tpl-toolbar-btn-group').html(),
        toolbarSearch: $('#toolbarSearch').html(),
        workzoneIconsView: $('#tpl-icons-view').html(),
        workzoneListView: $('#tpl-list-view').html(),
        workzoneIconsViewItem: $('#tpl-icons-view-item').html(),
        workzoneListViewItem: $('#tpl-list-view-item').html(),
        toolbarBtnSort: $('#tpl-toolbar-btn-sort').html(),
        toolbarBtnLayout: $('#toolbarBtnLayout').html(),
        tplNavigation: $('#tplNavigation').html(),
        tplBreadcrumb: $('#tplBreadcrumb').html(),
        tplStatusbar: $('#tplStatusbar').html(),
        tplViewer: $('#tplViewer').html(),
        tplMain: $('#tplMain').html(),
        tplFileInfo: $('#tplFileInfo').html()
    };


    docmana.template.load(docmana.ui.templates);
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
                       // $(ui.unselected).removeClass('bg-primary');
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

            // TODO: 添加图标布局下的up down 处理

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

