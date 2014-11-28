/**
 * Created by dp on 2014/5/20.
 */
var express=require('express');
var router=express.Router();
router.use(function(req,res,next){
   next();
});

module.exports=router;