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