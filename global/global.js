/**
 * Created by dp on 2014/5/20.
 */
var express=require('express');
var router=express.Router();
var mainConfig=require('../config/main.config');
router.use(function(req,res,next){
   res.locals.staticServer=mainConfig.staticServer;
   next();
});

module.exports=router;