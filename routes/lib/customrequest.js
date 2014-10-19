var request = require('request');

function Request() {
    this.option = {
        headers: {}
    };
    this.request=request
}
Request.prototype.setUrl = function (url) {
    this.option.url = url;
};
Request.prototype.setCookie = function (cookie) {
    var arr=[];
    for(var p in cookie){
        if(cookie.hasOwnProperty(p)){
            arr.push(p+'='+cookie[p]);
        }
    }
    this.option.headers.Cookie = arr.join(';');
};
Request.prototype.setMethod = function (method) {
    this.option.headers.method = method;
};
module.exports = Request;
