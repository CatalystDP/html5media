var express = require('express');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session=require('express-session');
var routes = require('./routes/index');
var users = require('./routes/users');
var globalVar=require('./routes/global/global');
var compression = require('compression');
var multer=require('multer');
var config=require('./config.json');
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(compression());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(formValidation());
app.use(cookieParser());
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
//app.set('env','production');
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});
if(config.standalone){
    app.set('port',3000);
    var server=app.listen(app.get('port'),function(){
        console.log('listen port on '+server.address().port);
    });
}
else{
    module.exports=app;
}
