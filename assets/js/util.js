function getParameterByName(name) {
    name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
    var regexS = "[\\?&]" + name + "=([^&#]*)";
    var regex = new RegExp(regexS);
    var results = regex.exec(window.location.href);
    if (results == null)
        return "";
    else
        return decodeURIComponent(results[1].replace(/\+/g, " "));
}

function parseBool(value) {
    return (value || '').toLowerCase() === 'true'
        ? true
        : (value || '').toLowerCase() === 'false'
            ? false
            : undefined;
}

function encodeIntoQuery(data, discardEmptyOrNull) {
    var ret = [];
    for (var key in data) {
        if (data.hasOwnProperty(key)) {
            if (discardEmptyOrNull && !data[key] && typeof data[key] !== 'number')
                continue;
            ret.push(encodeURIComponent(key) + '=' + encodeURIComponent(data[key]));
        }
    }
    return ret ? '?' + ret.join('&') : '';
}

function camelCaseToSentence(camelCaseNotation) {
    var t = camelCaseNotation.replace(/([A-Z]+)/g, " $1").replace(/([A-Z][a-z])/g, " $1");
    return t.charAt(0).toUpperCase() + t.slice(1);
}

function decodeQuery(url, discardEmpty) {
    url = (url || window.location.href).split('?')[1].split('#')[0];
    var ret = {}, url, qKVP, qParts = url.split('&');
    for (var i = 0; i < qParts.length; i++) {
        qKVP = qParts[i].split('=');
        if (discardEmpty && (!qKVP[0] || !qKVP[1])) continue;
        ret[decodeURIComponent(qKVP[0])] = decodeURIComponent(qKVP[1]);
    }
    return ret;
}
function urlEncode(data) {
    var ret = [];
    for (var key in data) {
        if (data.hasOwnProperty(key)) {
            ret.push(encodeURIComponent(key) + '=' + encodeURIComponent(data[key]));
        }
    }
    return ret;
}

function extendedEncodeURIComponent(str) {
    return encodeURIComponent(str).replace(/[!'()]/g, escape).replace(/\*/g, "%2A");
}

