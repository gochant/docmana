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

