$(function () {
    chrome.extension.sendRequest(
        {
            'action': 'list_unread'
        },
        function (data) {
            if (data) {
                var s_data = $('#data');
                var s_no = $('#no');
                var counter = $('#items-new');
                if (data.length == 0) {
                    s_no.removeClass('hidden');
                    s_data.addClass('hidden');
                } else {
                    s_no.addClass('hidden');
                    s_data.removeClass('hidden');
                    s_data.html('');
                    counter.html(' (' + data.length + ')');

                    for (var t in data) if (data.hasOwnProperty(t)) {
                        s_data.append('<p><a href="#" class="l' + t + '">' + data[t]['name'] + '</a></p>');
                        $('.l' + t).click(function () {
                            chrome.tabs.create({
                                url: 'http://pyha.ru' + data[t]['url']
                            });
                            return false;
                        });
                    }
                }
            }
        }
    );
})();
