var interval = 1000 * 60;
var url = 'http://pyha.ru/forum/informer/';
var url_unread = 'http://pyha.ru/forum/new/';
var answer = {};

function fetch_feed(url, callback) {
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function(data) {
        if (xhr.readyState == 4)
        {
            if (xhr.status == 200)
            {
                data = xhr.responseText;
                callback(data);
            }
            else
            {
                callback(null);
            }
        }
    };
    xhr.open('GET', url, true);
    xhr.send();
}

function show_notify(text) {
    var popup = window.webkitNotifications.createNotification('icons/icon128.png',
                                                              'ПЫХА', text);
    popup.onclick = function() {
        chrome.tabs.create({url : url_unread});
        popup.cancel();
    };
    popup.show();

}

function core(){
    fetch_feed(url, function(data) {
        if (data.search(/pyha-informer-status/) < 0)
        {
            show_notify('Залогинься!');
            return;
        }
        var r = JSON.parse(data);
        if (r != null)
        {
            if (answer['count'] != r['count'] && r['count'] != 0)
            {
                show_notify('Непрочитанных: ' + r['count']);
            }
            answer = r;
        }
        else
        {
            show_notify('Пыха в дауне!');
        }
    });
}

core();
setInterval(core, interval);

function onRequest(request, sender, callback) {
    if (request.action == 'list_unread')
    {
        callback(answer['topics']);
    }
}
chrome.extension.onRequest.addListener(onRequest);