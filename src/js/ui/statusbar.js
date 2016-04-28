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

