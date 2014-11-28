var Request=require('./customrequest');
var fs=require('fs');
var path=require('path');
var util =require('util');
/**
 * @description 基于http协议进行跨服务器传送文件
 * @param req 来自客户端的请求
 * @param {Object} options 选项
 * @param {String} options.url 要请求的url
 * @param {String} options.dest 本地上传文件的路径
 * @param {String} options.filed 表单的域
 */
exports.uploadToServer=function(req,options){
    var request=new Request();
    var files=req.files[options.filed];
    var _files=util.isArray(files)? files:[files];
    var r = request.request.post(options.url,function(err,response,body){
        var dest=options.dest;
        _files.forEach(function(item,index){
           fs.unlinkSync(path.join(dest,item.name));
        });
    });
    var form= r.form();
    _files.forEach(function(item,index){
        form.append(options.filed,
            fs.createReadStream(path.join(options.dest,item.name)),
            {
                filename:item.name,
                contentType:item.mimeType,
                knownLength:item.size
            });
    });
};
