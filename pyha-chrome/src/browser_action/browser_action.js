$(function () {
    chrome.extension.sendRequest(
        {
            'action': 'list_unread'
        },
        function (data) {
            if (data) {
                var s_data = $('#data');
                var s_no = $('#no');
                if (data.length == 0) {
                    s_no.removeClass('hidden');
                } else {
                    s_no.addClass('hidden');
                    s_data.html('');
                    for (var t in data) if (data.hasOwnProperty(t)) {
                        s_data.append('<p><a href="#" class="l' + t + '">' + data[t]['name'] + '</a></p>');
                        $('.l' + t).click(function () {
                            chrome.tabs.create({url: 'http://pyha.ru' + data[t]['url']});
                            return false;
                        });
                    }
                }
            }
        }
    );
})();
