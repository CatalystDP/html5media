exports.index = function (req, res) {
    res.render('index', {
        title: 'dp'
    });
};
exports.submit = function (req, res) {
    res.send(req.body);
};
exports.test=function(req,res){
    req.on('data',function(data){
       console.log(data.toString('utf-8'));
    });
    req.on('end',function(){
        res.end();
    });
};