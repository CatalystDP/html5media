define(function(require,exports,module){
    var $=require('jQuery');
    var  xhr=new XMLHttpRequest();
    xhr.onprogress=function(e){
        console.log(e);
    };
    xhr.onload=function(e){
        console.log(xhr.response);
        console.log(e);
    };
    xhr.open('POST','/iface/index/test');
    xhr.setRequestHeader('Content-Type','multipart/formData');
    xhr.send(new Blob(['fdsafdsafdsafdsafdsasfdssafdafdsa']));
    var ele= $(document);
//            U.event(document);
    ele.on('click','#testEvent',function(e){
        console.log(this);
        e.stopPropagation();
    });
    ele.on('click','#wrapper',function(e){console.log(this)});
});
