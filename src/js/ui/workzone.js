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
                            if ($target.hasClass('ui-selected')) {
                                $target = curr.filter(function(i, dom) {
                                    return dom !== $target.get(0);
                                });
                            } else {
                                $.merge($target, curr);
                            }
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

                    var $allSelected = that.select();
                    var $selected = that._nonLockingItems($allSelected);
                    // 设置当前选中项为当前拖动元素
                    $.ui.ddmanager.current.element = $allSelected;

                    // 设置 helper
                    var $thumbs = $($allSelected.find('.filetype').splice(0, 4)).clone();
                    $.each($thumbs, function (i, el) {
                        $(el).addClass('icon' + i);
                    });

                    var count = $selected.length === 0 ? 'X' : $selected.length;
                    ui.helper.append($thumbs)
                        .find('.count').html(count);
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
        _nonLockingItems: function ($items) {
            var that = this;
            return $items.filter(function (i, dom) {
                var d = that.store().byId($(dom).attr('id'));
                return d.locked !== 1;
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
                // 延迟执行重命名
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
        // 选择记录('next' or 'previous')
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

    docmana.ui.Workzone = WorkZone;
    docmana.ui.workzone = function (options) {
        return new docmana.ui.Workzone(options);
    }
})();

