$(function () {
    chrome.runtime.sendMessage({action: 'pyha_unread'}, function (data) {
        var s_data = $('#data');
        var s_mark = $('#mark-read');
        var s_no = $('#no');
        var counter = $('#items-new');
        if (!data['count']) {
            counter.html('');
            s_no.removeClass('hidden');
            $(s_data,s_mark).addClass('hidden');
        } else {
            counter.html(' (' + data['count'] + ')');
            var html = '';
            for (var t in data['topics']) if (data['topics'].hasOwnProperty(t)) {
                var d = data['topics'][t];
                html += '<p><a href="http://pyha.ru' + d['url'] + '" data-id="' + t + '">' + d['name'] + '</a></p>';
            }
            s_data.html(html);
            s_no.addClass('hidden');
            $(s_data,s_mark).removeClass('hidden');
        }
    });

    $('body').delegate('a', 'click', function () {
        var self = $(this);
        chrome.runtime.sendMessage({
            action: 'pyha_click',
            id: self.data('id'),
            url: self.attr('href')
        });
        return false;
    });
});
