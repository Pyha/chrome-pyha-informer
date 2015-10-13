window.addEventListener('load', function () {
    options.is_notify.checked = JSON.parse(localStorage.is_notify);
    options.is_badge.checked = JSON.parse(localStorage.is_badge);
    options.frequency.value = localStorage.frequency;
    options.save.onclick = function () {
        localStorage.is_notify = options.is_notify.checked ? 1 : 0;
        localStorage.is_badge = options.is_badge.checked ? 1 : 0;
        localStorage.frequency = +options.frequency.value;
        chrome.runtime.reload();
    }
});
