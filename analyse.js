var fs=require('fs');
var example=fs.readFileSync('./example').toString();
console.log(example);
var regexp=/framework[^\s]*/g;
var matched=example.match(regexp);
console.log(matched);
matched.forEach(function(item){
    var newPath=item.replace('framework','main');
    var old=fs.readFileSync(item);
    fs.writeFileSync(newPath,old);
});