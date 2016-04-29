$(function () {

    function setLocal(key, value) {
        if (window.localStorage) {
            localStorage.setItem(key, value);
        }
    }

    function getLocal(key) {
        if (window.localStorage) {
            return localStorage.getItem(key);
        }
        return null;
    }

    var initData = {
        lang: getLocal('lang') || 'en',
        theme: getLocal('theme') || 0
    }

    docmana.lang = initData.lang;

    // 这里仅针对这个示例界面简单处理
    $('.txt-lang').text(docmana.resource('labelLanguage'));
    $('.txt-theme').text(docmana.resource('labelTheme'));
    $('.version').text('v' + docmana.VERSION);

    var themes = ['default', 'cerulean', 'cosmo', 'darkly', 'flatly', 'lumen', 'paper',
        'sandstone', 'simplex', 'spacelab', 'superhero', 'tiny'];
    var $select = $("#select-theme");
    var $selectLang = $('#select-lang');

    $.each(themes, function (index, value) {
        $select.append($("<option />")
            .val(index)
            .text(value));
    });

    $selectLang.on('change', function () {
        var val = $(this).val();
        setLocal('lang', val);
        window.location.reload();
    }).val(initData.lang);

    $select.on('change', function () {
        var val = $(this).val();
        var theme = themes[val];
        var css = 'assets/bootstrap/themes/' + theme + '.css';
        setLocal('theme', val);
        $("#theme-style").attr("href", css);
        setTimeout(function () {
            $('#docmana').data('docmana').relayout();
        }, 500);
    }).val(initData.theme).change();


    var serverUrl = 'http://192.168.1.18:8097/FileManager/Medias/Index';  // 替换为实际的
    
    $('#docmana').docmana({
        store: {
            requestData: {
                folder: 'Medias',
                lang: docmana.lang
            },
            url: serverUrl
        },
        workzone: {
            layout: 'icons'
        }
    });
});
