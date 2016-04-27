(function () {
    "use strict";

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

