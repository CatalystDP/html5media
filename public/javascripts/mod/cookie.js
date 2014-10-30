define(function (require, exports, module) {
    var slice = Array.prototype.slice;
    exports.setCookie = function (key, value, option) {
        var date = new Date();
        option && option.maxAge && date.setTime(date.getTime() + option.maxAge);
        var expire = option && option.maxAge && date.toUTCString();
        var domain = option && option.domain,
            path = option && option.path;
        var cookie = [key + "=" + encodeURIComponent(value)];
        expire && cookie.push("expires=" + expire);
        domain && cookie.push("domain=" + domain);
        path && cookie.push("path=" + path);
        document.cookie = cookie.join(';');
    };
    exports.getCookie = function (key) {
        var cookies = document.cookie.replace(' ', '').split(';');
        //var regExp = new RegExp(key + '=[^;]*;?');
        var matched;
        for (var i = 0, j = cookies.length; i < j; ++i) {
            var split=cookies[i].split('=');
            var k=split[0];
            var v=split[1].replace(';');
            if (k===key) {
                matched=v;
                break;
            }
        }
        //if (Object.prototype.toString.call(matched) == '[object Array]') {
        //    return matched[0].split('=')[1].replace(';', '');
        //}
        return decodeURIComponent(matched);
    };
    exports.removeCookie=function(key){
        var cookie=exports.getCookie(key);
        if(cookie){
            exports.setCookie(key,cookie,{maxAge:-1});
        }
    };
});
