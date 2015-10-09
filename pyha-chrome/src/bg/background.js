(function () {
    var interval = 1000 * 60;
    var url = 'http://pyha.ru/forum/informer/';
    var url_unread = 'http://pyha.ru/forum/new/';
    var answer = {};
    var notification_id = 'PYHA-RU';

    function fetch_feed(url, callback) {
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function (data) {
            if (xhr.readyState == 4) {
                if (xhr.status == 200) {
                    data = xhr.responseText;
                    callback(data);
                } else {
                    callback(null);
                }
            }
        };
        xhr.open('GET', url, true);
        xhr.send();
    }

    function core() {
        fetch_feed(url, function (data) {
            if (data.search(/pyha-informer-status/) < 0) {
                show_notify('Залогинься!');
                return;
            }
            var r = JSON.parse(data);
            if (r != null) {
                if (answer['count'] != r['count'] && r['count'] != 0) {
                    show_notify('Непрочитанных: ' + r['count']);
                }
                answer = r;
            } else {
                show_notify('Пыха в дауне!');
            }
        });
    }

    function show_notify(text) {
        chrome.notifications.create(
            notification_id,
            {
                iconUrl: 'icons/icon128.png',
                title: 'ПЫХА',
                message: text,
                type: 'basic',
                isClickable: true
            },
            function (id) {
                return id;
            }
        );
    }

    chrome.notifications.onClicked.addListener(function (id) {
        if (id == notification_id) {
            chrome.tabs.create({url: url_unread});
            chrome.notifications.clear(id, function (id) {});
        }
    });
    chrome.extension.onRequest.addListener(function (request, sender, callback) {
        if (request.action == 'list_unread') {
            callback(answer['topics']);
        }
    });

    core();
    setInterval(core, interval);
})();
