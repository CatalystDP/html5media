var csrf=require('csrf');

/**
 * @description Csrf类
 * @param options 直接传递给csrf的选项
 * @constructor
 */
function Csrf(options){
    this.csrf=csrf(options);
    this.cookieKey=options.cookieKey||'_csrf';
    this.cookieOpt=options.cookieOpt;
}
/**
 * @description 用来验证token和secret是否匹配
 * @param req express req对象
 * @param res express res对象
 */
Csrf.prototype.verify=function(req,res){
    var token = (req.query&&req.query[this.cookieKey])||(req.body&&req.body[this.cookieKey]);
    var isValid=this.csrf.verify(req.cookies[this.cookieKey],token);
    !isValid && res.status(403);
    return isValid;
};
/**
 * @description 生成token和secret
 * @param res  express res对象，设置cookie
 * @param callback 通过回调返回 callback(token)
 */
Csrf.prototype.generate=function(res,callback){
    var self=this;
    this.csrf.secret(function(err,secret){
        var token=self.csrf.create(secret);
        res.cookie(self.cookieKey,secret,self.cookieOpt);
        callback(token);
    });
};

module.exports=Csrf;