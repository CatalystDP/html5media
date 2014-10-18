var multipart = require('multiparty');
var Busbody = require('busboy');
var util = require('util');
var url = require('url');
//var http = require('http');
var Request=require('./customrequest');
var async = require('async');
var fs=require('fs');
var os=require('os');
var path=require('path');
var isWindows = os.type().toLowerCase().indexOf('windows') != -1;
/**
 * @description 上传到本地
 * @param req
 * @param options
 */
exports.uploadToLocal = function (req, options) {
    var form = new multipart.Form(options);

};
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
    console.log(files);
//    var dest = isWindows? options.dest.replace(/\/+/g,'\\') : options.dest;
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
                filename:item.originalname,
                contentType:item.mimeType,
                knownLength:item.size
            });
    });
};
//exports.uploadToServer = function (req, options) {
//    var form = new multipart.Form(options);
//    var boundary = Math.floor(Math.random() * 100000);
//    var crlf = '\r\n';
//    var fileList = [];
//    var u = url.parse(options.url, true);
//    var r = http.request({
//        hostname: u.hostname,
//        path: u.path,
//        port: u.port || 80,
//        method: "POST",
//        headers: {
//            'Connection': 'keep-alive',
//            'Content-Type': 'multipart/form-data; boundary=' + boundary
//        }
//    }, function (respone) {
//        respone.on('data', function (data) {
//            options.hasOwnProperty('onData') && options.onData(data);
//        });
//        respone.on('end', function () {
//            options.hasOwnProperty('onEnd') && options.onEnd(fileList);
//        });
//    });
////    var busboy = new Busbody({
////        headers: req.headers
////    });
////    busboy.on('file', function (fieldname, file, filename, encoding, mimeType) {
//////        r.write(crlf);
////        var prefix = '--' + boundary + crlf +
////            "Content-Disposition: form-data; name=" + fieldname + ";" +
////            fieldname && "filename=" + filename
////            +
////            crlf +
////            "Content-Length:" + file.length + crlf +
////            "Content-Type:" + mimeType + "" + crlf + crlf;
////        file.on('end', function () {
////            r.write(crlf, function () {
////                file.unpipe(r);
////            });
////        });
////        r.write(prefix, function () {
////            file.pipe(r);
////        });
////    });
////    busboy.on('finish', function () {
////        r.write('--' + boundary + '--' + crlf, function () {
////            r.end();
////        });
////    });
////    req.pipe(busboy);
//    form.on('part', function (part) {
//
//        var prefix = '--' + boundary + crlf +
//            "Content-Disposition:" + part.headers['content-disposition'] + "" +
//            crlf +
//            "Content-Length:" + part.byteCount + crlf +
//            "Content-Type:" + part.headers['content-type'] + "" + crlf + crlf;
//        async.waterfall([
////            function (callback) {
////                r.write(crlf, function () {
////                    callback(null);
////                });
////            },
//            function (callback) {
//                r.write(prefix, function () {
//                    callback(null);
//                });
//            },
//            function (callback) {
//                var chunk, isCanceled = false;
//                part.on('readable', function () {
//                    async.whilst(function () {
//                        return !isCanceled && (chunk = part.read(1024 * 1024)) !== null;
//                    }, function (cb) {
//                        r.write(chunk, function () {
//                            console.log('sended!');
//                            cb(null);
//                        });
//                    }, function (err) {
//                       callback(null);
//                    });
//                });
//            }
//        ], function (err, result) {
//            r.write(crlf);
//        });
//
//
////        fileList.push({
////            headers: part.headers,
////            filedname: part.name,
////            filename: part.filename
////        });
////        part.on('end', function () {
////            r.write(crlf);
////            part.unpipe(r);
////
////
////        });
////        r.write(prefix);
////        part.pipe(r, {end: false});
////        var info={};
////        var disposition=part.headers['content-disposition'].split(';');
////        disposition.forEach(function(item){
////            var pairs=item.split('=');
////            info[pairs[0]]=pairs[1];
////        });
////        formdata.append('file',part,{
////            filename:info.filename,
////            contentType:part.headers['content-type'],
////            knownLength:part.byteCount
////        });
//
//    });
//    form.on('aborted', function () {
//        options.hasOwnProperty('onAborted') && options.onAborted();
//    });
//    form.on('close', function () {
////        formdata.submit('http://localhost/test/upload.php',function(err,response){
////
////        });
////        formdata.pipe(r);
//        r.write('--' + boundary + '--' + crlf,function(){
//            r.end();
//        });
//
//    });
//    form.parse(req);
//};
