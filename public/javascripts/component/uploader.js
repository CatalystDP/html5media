define(function (require, exports, module) {
    var $ = require('jQuery');
    var klass = require('../mod/klass');
    var event = require('../mod/globalevent');
    var Widget = require('../widget/widget');
    var uploader = module.exports = klass(Widget, {
        __construct: function (option) {
            var defaultOption = {
                size: {
                    'width': 210,
                    'height': 30
                },
                style: {
                    border: '1px solid black',
                    backgroundColor: '#000000',
                    fontColor: 'white'
                },
                autocenter:true,
                url:null
            };
            option = option ? $.extend(defaultOption, option) : defaultOption;
            klass.parent(uploader, '__construct', this, option);
            this.option = option;
            this.getElement().append('<iframe class="uploaderframe" name="uploaderframe" style="display: none;"></iframe>');
            this.initForms();
            this.__bindEvent();
        },
        initForms: function () {
            var iframe = this.$('.uploaderframe');
            var form;
            var self = this;
            iframe.before('<form class="fileuploaderForm"></form>');
            form = this.$('.fileuploaderForm');
            form.attr({
                'action':self.option.url,
                'target': 'uploaderframe',
                'method': 'post',
                'enctype': 'multipart/form-data'
            });
            form.append('<div class="btncover"><label></label><input class="button" type="button" value="上传"></div>');
            form.append('<div class="filecover"><input class="file" name="file" type="file"></div>');
            form.append('<div class="submitcover"><input type="submit"></div>');
            form.css({
                'position': 'relative'
            });
            self.option.autocenter && form.css({
               'marginLeft':'auto',
               'marginRight':'auto'
            });
            form.find('input').css({
                'height': '100%'
            });
            form.find('div').css({
                'width': self.option.size.width,
                'height': self.option.size.height
            });
            var btnCover = form.find('.btncover');
            var fileCover = form.find('.filecover');
            var submitCover = form.find('.submitcover');
            form.find('.btncover').css({
                'position': 'relative',
                'zIndex': 0,
                'lineHeight': '30px'
            });

            form.find('.filecover').css({
                'position': 'absolute',
                'top': 0,
                'left': 0,
                'zIndex': 1,
                'opacity': 0
            });
            fileCover.css({
                'width': self.option.size.width + 'px',
                'height': self.option.size.height + 'px'
            });
            fileCover.find('input').css('width', '100%');
            btnCover.find('label').css({
                'display': 'inline-block',
                'width': 2 * self.option.size.width / 3 - 3 + 'px',
                'height': self.option.size.height - 2 + 'px',
                'verticalAlign': 'top',
                'border': '1px solid #919191',
                'color': '#919191',
                'overflow': 'hidden',
                'whiteSpace': 'nowrap',
                'textOverflow': 'ellipsis'
            });
            btnCover.find('input').css({
                'width': self.option.size.width / 3 + 'px',
                'verticalAlign': 'top',
                'border': self.option.style.border,
                'backgroundColor': self.option.style.backgroundColor,
                'color': self.option.style.fontColor
            });
            submitCover.css({
                'marginTop':'20px'
            });
            submitCover.find('input').css({
                'float':'right',
                width: self.option.size.width / 3 + 'px',
                height: self.option.size.height + 'px',
                border:self.option.style.border,
                'backgroundColor':self.option.style.backgroundColor,
                color:self.option.style.fontColor
            });
        },
        __bindEvent: function () {
            var self = this;
            this.delegateEvents({
                'change:input.file': function () {
                    var target = $(this);
                    var files = target[0].files;
                    var name_type = [];
                    for (var i = 0, j = files.length; i < j; ++i) {
                        name_type.push(files[i].name + ':' + files[i].type);
                    }
                    name_type = name_type.join(';');
                    self.$('.btncover').find('label').text(name_type);
                },
                'mouseenter:.submitcover input':function(){
                    $(this).css({cursor:'pointer'});
                },
                'mouseleave.submitcover input':function(){
                    $(this).css({cursor:'normal'});
                },
                'submit:.fileuploaderForm':function(e){
                    e.stopPropagation();
                    e.cancelBubble=true;
                    return true;
                }
            });
            this.$('.uploaderframe').on('load',function(e){
                var doc=this.contentWindow.document;
                var body=doc.getElementsByTagName('body')[0];
                var result;
                try{
                    result=JSON.parse(body.innerText);
                }
                catch(e){
                    alert('上传失败');
                }
                self.option.onIframeLoaded && self.option.onIframeLoaded(result);
            });
        }
    });
});
