var Request=require('./customrequest');
var fs=require('fs');
var path=require('path');
/**
 * @description 基于http协议进行跨服务器传送文件
 * @param req 来自客户端的请求
 * @param {Object} options 选项
 * @param {String} options.url 要请求的url
 * @param {Object} options.headers http请求头
 * @param {Function} [options.onData(data)] 当有数据时触发
 * @param {Function} [options.onEnd(fileList)] 上传结束时触发
 * @param {Function} [options.onAborted()] 上传取消时触发
 */
exports.uploadToServer=function(req,options){
    var request=new Request();
    var files=req.files[options.filed];
    var r = request.request.post(options.url,function(err,response,body){
       console.log(body);
        var dest=options.dest;
        files.forEach(function(item,index){
           fs.unlinkSync(path.join(dest,item.name));
        });
    });
    var form= r.form();
    files.forEach(function(item,index){
        form.append(options.filed,
            fs.createReadStream(path.join(options.dest,item.name)),
            {
                filename:item.name,
                contentType:item.mimeType,
                knownLength:item.size
            });
    });
};
