function guid() {
    function s4() {
        return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
    }
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
        s4() + '-' + s4() + s4() + s4();
}


function getData() {

    let uuid = localStorage.getItem('opensights_id');
    let isNew = uuid == null;
    if (uuid == null) {
        uuid = guid();
        localStorage.setItem('opensights_id', uuid);
    }

    let pageLoadTime = window.performance.timing.domContentLoadedEventEnd - window.performance.timing.navigationStart;

    return {
        uuid: uuid,
        path: window.location.pathname,
        host: window.location.host,
        protocol: window.location.protocol,
        appCodeName: navigator.appCodeName,
        appName: navigator.appName,
        appVersion: navigator.appVersion,
        cookieEnabled: navigator.cookieEnabled,
        hardwareConcurrency: navigator.hardwareConcurrency,
        language: navigator.language,
        platform: navigator.platform,
        product: navigator.product,
        productSub: navigator.productSub,
        userAgent: navigator.userAgent,
        vendor: navigator.vendor,
        vendorSub: navigator.vendorSub,
        cookie: document.cookie,
        resolution: window.screen.width + 'x' + window.screen.height,
        isNew: isNew,
        pageLoadTime: pageLoadTime,
        referrer: document.referrer,
        day: new Date().getDate(),
        month: new Date().getMonth() + 1,
        year: new Date().getYear() + 1900
    };
}


function pushData() {

    let isDev = window.location.host == 'localhost:8080';

    let protocol = window.location.protocol;
    let endpoint = 'opensights.developersworkspace.co.za';

    switch (window.location.protocol) {
        case 'file:':
            protocol = 'https:';
            break;
    }

    if (isDev) {
        endpoint = 'localhost:3000';
        protocol = 'http:'
    } else {
        endpoint = 'opensights.developersworkspace.co.za';
    }

    let data = getData();
    let xhr = new XMLHttpRequest();
    xhr.open('POST', protocol + '//' + endpoint + '/api/data/save', true);
    xhr.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
    xhr.send(JSON.stringify(data));
}


(function () {
    setTimeout(function () {
        pushData();
    }, 500);
})();
