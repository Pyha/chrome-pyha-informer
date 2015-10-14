(function () {

    if (!localStorage.is_init) {
        localStorage.is_init = true;
        localStorage.is_test = 0;
        localStorage.is_notify = 1;
        localStorage.is_badge = 1;
        localStorage.frequency = 60;
    }

    var url = 'http://pyha.ru/forum/informer/';
    var url_unread = 'http://pyha.ru/forum/new/';
    var answer = {};
    var notification_id = 'PYHA-RU';
    var frequency = +localStorage.frequency;

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
            if (+localStorage.is_test) {
                r = {count: 3, topics: [
                    {url: '/#1', name: 'Топик 1'},
                    {url: '/#2', name: 'Топик 2'},
                    {url: '/#3', name: 'Топик 3'}
                ]};
            }
            if (r != null) {
                r['count'] = +r['count'];
                var topics = {};
                for (var i in r['topics']) if (r['topics'].hasOwnProperty(i)) {
                    r['topics'][i]['url'] = 'http://pyha.ru' + r['topics'][i]['url'];
                    topics['id' + i] = r['topics'][i];
                }
                r['topics'] = topics;

                if (answer['count'] != r['count'] && r['count'] != 0) {
                    show_notify('Непрочитанных: ' + r['count']);
                }
                answer = r;

                set_badge(answer['count']);
            } else {
                show_notify('Пыха в дауне!');
            }
        });
    }

    function show_notify(text) {
        if (!+localStorage.is_notify) {
            return;
        }
        chrome.notifications.create(
            notification_id,
            {
                iconUrl: 'img/icon128.png',
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

    function set_badge(count) {
        if (!+localStorage.is_badge) {
            count = '';
        }
        chrome.browserAction.setBadgeText({
            text: count ? count.toString() : ''
        });
    }

    function update() {
        setInterval(core, 1000 * frequency);
    }

    chrome.notifications.onClicked.addListener(function (id) {
        if (id == notification_id) {
            chrome.tabs.create({url: url_unread});
            chrome.notifications.clear(id, function (id) {});
        }
    });
    chrome.runtime.onMessage.addListener(function (request, sender, callback) {
        switch (request.action) {
            case 'pyha_unread':
                callback(answer);
                break;
            case 'pyha_update':
                core();
                break;
            case 'pyha_click':
                if (request.url) {
                    chrome.tabs.create({url: request.url});
                }
                if (request.id) {
                    delete answer['topics'][request.id];
                    set_badge(--answer['count']);
                }
                break;
            case 'pyha_open_all':
                for (var t in answer['topics']) if (answer['topics'].hasOwnProperty(t)) {
                    chrome.runtime.sendMessage({
                        action: 'pyha_click',
                        id: t,
                        url: answer['topics'][t]['url']
                    });
                }
                break;
        }
    });

    core();
    update();

})();
