var express = require('express');
var router = express.Router();
var fs = require('fs');
var pathUtil=require('path');
/* GET home page. */
function load(req, res, next) {
    var controller = req.params['controller'].replace(/_/g,'/');
    var func = req.params['function'];
    var args;
    var obj;
    var path = pathUtil.join(__dirname,"router",controller+'.js');
    fs.exists(path, function (status) {
        if (status) {
            obj = require(path);
            if (obj[func]) {
                if(args=req.params[0]){
                    args=args.split('/');
                    args.shift();
                    obj[func](req, res,args);
                }

                else
                    obj[func](req,res);
            }

            else {
                next();
            }

        }
        else
            next();
    });

}

router.get('/', function (req, res,next) {
    req.params.controller='index';
    req.params.function='index';
    load(req,res,next);
});
router.get('/iface/:controller/:function*?', function (req, res, next) {
    load(req, res, next);
});
router.post('/iface/:controller/:function*?', function (req, res, next) {
    load(req, res, next);
});
module.exports = router;
