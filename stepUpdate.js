var fs=require('fs');
var crypto=require('crypto');

var a=fs.readFileSync('./a.js').toString().replace(/\r\n/g,'');
var b=fs.readFileSync('./b.js').toString().replace(/\r\n/g,'');

var chunkSize=4;
var a_old=(function(){
    var blocks=[],
        map={};
    var substr,md5;
    var checkNum=0;
    for(var i= 0,len= a.length;i<len;i+=chunkSize){
        substr= a.substr(i,chunkSize);
        md5=getMd5(substr);
        var arr=map[md5];
        if(!arr){
            arr=[];
        }
        arr.push(checkNum);
        map[md5]=arr;
        checkNum++;
    }
    return map;
})();
console.log(a_old);
var checkSum=(function(){
    var old=a_old;
    var start=0;
    var arr=[];
    var digest;
    var blockNum=0;
    var buf={};
    while(1){
        if(start> b.length-1){
            break;
        }
        if((b.length-start)<=chunkSize && (old.hasOwnProperty(digest))){
            break;
        }
        var chunk= b.substr(start,chunkSize);
        digest=getMd5(chunk);
        if(old.hasOwnProperty(digest)){
            arr.push(blockNum);
            blockNum++;
            start+=chunkSize;
        }
        else{
            buf[blockNum]=buf[blockNum]||[];
            buf[blockNum].push(b[start]);
            (start+1)%chunkSize ==0 && (buf[blockNum]=buf[blockNum].join(''))&& arr.push(buf[blockNum]) && ++blockNum;
            start+=1;
        }
    }
    return arr;
})();
function getMd5(text){
    var md5=crypto.createHash('md5');
    md5.update(text);
    return md5.digest('hex');
}
function getNextBlock(arr,curNo){
    if(arr.length==1){
        return arr[0];
    }
    for(var i= 0,len=arr.length;i<len;++i){
        if(arr[i]>curNo){
            return arr[i];
        }
    }
}
console.log(checkSum);