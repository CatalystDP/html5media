var request = require('request');
function Request() {
    this.option = {
        headers: {},
        pool:{
            maxSockets:100
        }
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
Request.prototype.post=function(url,callback){
    this.request.post(url,this.option,callback);
};
Request.prototype.get=function(url,callback){
    this.request.get(url,this.option,callback);
};
module.exports = Request;
