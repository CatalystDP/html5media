var express = require('express');
var path = require('path');
var log4js=require('log4js');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session=require('express-session');
var routes = require('./routes/index');
var users = require('./routes/users');
var globalVar=require('./global/global');
var compression = require('compression');
var domainMiddleware=require('express-domain-middleware');
var multer=require('multer');
var config=require('./config.json');
var app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.set('env',config.env);
app.use(domainMiddleware);//增加domainmiddleware
app.use(compression());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());
/****log4js初始化****/
log4js.configure('./config/log_config.json');
var logger=log4js.getLogger('express_access');

app.use(log4js.connectLogger(logger,{level:'auto'}));
/*********/
app.use(multer({
    dest:'./upload',
    rename:function(filed,filename){
        var now=Date.now();
        now=now.toString();
        return now+parseInt(Math.random()*1000000);
    }
}));
app.use(express.static(path.join(__dirname,'public')));
app.use(globalVar);
app.use('/', routes);
app.use('/users', users);


/// catch 404 and forwarding to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

/// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    logger=log4js.getLogger('express_debug');
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
        logger.trace(err.message,err.status,err.stack);
    });

}
if(app.get('env')==='production'){
    logger=log4js.getLogger('express_debug');
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: {}
        });
        logger.error(err.message,err.status,err.stack);
    });
}
// production error handler
// no stacktraces leaked to user

if(config.standalone){
    app.set('port',3000);
    var server=app.listen(app.get('port'),function(){
        console.log('listen port on '+server.address().port);
    });
}
else{
    module.exports=app;
}
