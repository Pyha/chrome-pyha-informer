$(function () {
    var s_data = $('#data');
    var s_mark = $('#mark-read');
    var s_no = $('#no');
    var counter = $('#items-new');

    chrome.runtime.sendMessage({action: 'pyha_unread'}, function (data) {
        if (!data['count']) {
            counter.html('');
            s_no.removeClass('hidden');
            s_data.addClass('hidden');
            s_mark.addClass('hidden');
        } else {
            counter.html(' (' + data['count'] + ')');
            s_no.addClass('hidden');
            var html = '';
            for (var t in data['topics']) if (data['topics'].hasOwnProperty(t)) {
                var d = data['topics'][t];
                html += '<p><a href="' + d['url'] + '" data-id="' + t + '">' + d['name'] + '</a></p>';
            }
            s_data.html(html).removeClass('hidden');
            s_mark.removeClass('hidden');
        }
    });

    s_mark.click(function () {
        chrome.runtime.sendMessage({action: 'pyha_open_all'});
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
