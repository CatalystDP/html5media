/**
 * @name Uploader
 * @description 文件上传控件
 * @module uploader
 */
define(function (require, exports, module) {
    var $ = require('jQuery');
    var klass = require('../mod/klass');
    var Widget = require('../widget/widget');
    /**
     * @constructor
     * @alias module:uploader
     * @requires klass
     * @requires event
     * @requires jQuery
     * @requires widget
     *
     */
    var uploader = module.exports = klass(Widget,
        /** @lends uploader.prototype*/
        {
            /**
             * @constructs
             * @param {Number} option.size.width 数字，控件的长度
             * @param {Number} option.size.height 数字，控件的高度
             * @param {String} option.submitStyle 显示文件名的label的边界样式
             * @param {String} option.submitStyle.backgroundColor 按钮的背景样式
             * @param {String} option.submitStyle.fontColor 按钮字的颜色
             * @param {Boolean} option.autocenter 是否居中
             * @param {String} option.url 上传文件的url
             * @param {Boolean} option.usingHtml5 是否使用html5
             * @param {Function} option.onIframeLoaded 当option.usingHtml5不为真时，
             * 需要传递onIframeLoaded回调用于从服务器接收来的结果
             * @description 其他option同Widget的option
             */
        __construct: function (option) {
            var defaultOption = {
                size: {
                    'width': 210,
                    'height': 30
                },
                submitStyle: {
                    border: '1px solid black',
                    backgroundColor: '#000000',
                    fontColor: 'white'
                },
                autocenter: true,
                url: null,
                usingHtml5: false
            };
            option = option ? $.extend(defaultOption, option) : defaultOption;
            klass.parent(uploader, '__construct', this, option);
            this.option = option;
            this.url = option.url;
            !option.usingHtml5 && this.__initFormsWithIframe();
            option.usingHtml5 && this.__initFormsWithoutIframe();
            this.__bindEvent();
        },
        __initFormsWithIframe: function () {
            this.getElement().append('<iframe class="uploaderframe" name="uploaderframe" style="display: none;"></iframe>');
            var iframe = this.$('.uploaderframe');
            var form;
            iframe.before('<form class="fileuploaderForm"></form>');
            form = this.$('.fileuploaderForm');
            this.__initForms(form);
            form.attr('target', 'uploaderframe');
            form.attr('action', this.option.url);
        },
        __initFormsWithoutIframe: function () {
            this.getElement().append('<form class="fileuploaderForm"></form>');
            var form = this.$('.fileuploaderForm');
            this.__initForms(form);
            form.find('.file').attr('multiple', 'multiple');
            form.find('.submitcover').before('<p class="progress" style="display: none"></p>');
            var progress = form.find('.progress');
            progress.css({
                'width': this.option.size.width + 'px',
                'padding': 0
            });
            var fragMent = $(document.createDocumentFragment());
            fragMent.append('<p class="progressbar"></p>');
            fragMent.append('<p class="progressdigital">0%</p>');
            progress.append(fragMent[0]);
            progress.find('p').css({
                'padding': 0
            });
            progress.find('.progressbar').css({
                'width': 0,
                'height': '20px',
                'backgroundColor': '#919191'
            })
        },
        __initForms: function (form) {
            this.form = form;
            var self = this;
            form.attr({
                'method': 'post',
                'enctype': 'multipart/form-data'
            });
            form.append('<div class="submitcover"><input type="submit" value="上传"></div>');
            !this.option.usingHtml5 && form.find('.submitcover').children('input').before('<p class="add inputOp">+</p><p class="remove inputOp" style="margin-left: 10px">-</p>');
            this.appendFileInput();
            form.css({
                'position': 'relative'
            });
            self.option.autocenter && form.css({
                'marginLeft': 'auto',
                'marginRight': 'auto'
            });
            this.__initStyle();
        },
        __initStyle: function () {
            var self = this;
            var form = this.form;
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
                'top': '5px',
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
                'padding': '0',
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
                'border': self.option.submitStyle.border,
                'backgroundColor': self.option.submitStyle.backgroundColor,
                'color': self.option.submitStyle.fontColor
            });
            submitCover.css({
                'marginTop': '20px'
            });
            submitCover.find('input').css({
                'float': 'right',
                width: self.option.size.width / 3 + 'px',
                height: self.option.size.height + 'px',
                border: self.option.submitStyle.border,
                'backgroundColor': self.option.submitStyle.backgroundColor,
                color: self.option.submitStyle.fontColor
            });
            !this.option.usingHtml5 && submitCover.find('.add').css({
                'float': 'left',
                'font-size': '33px',
                'font-weight': 'bold',
                'height': '100%',
                'line-height': '30px',
                'vertical-align': 'middle',
                'padding': 0
            });
            !this.option.usingHtml5 && submitCover.find('.remove').css({
                'float': 'left',
                'font-size': '33px',
                'font-weight': 'bold',
                'height': '100%',
                'line-height': '30px',
                'vertical-align': 'middle',
                'padding': 0
            });
        },
        __bindEvent: function () {
            var self = this;
            this.delegateEvents({
                'change:input.file': function () {
                    var isHtml5 = self.option.usingHtml5;
                    var target = $(this);
                    var files;
                    var name_type;
                    if (isHtml5) {
                        var files = target[0].files;
                        name_type = [];
                        for (var i = 0, j = files.length; i < j; ++i) {
                            name_type.push(files[i].name + ':' + files[i].type);
                        }
                        name_type = name_type.join(';');

                    }
                    else{
                        files=target.val();
                        name_type=files;
                    }
                    self.$('.btncover').find('label').text(name_type);
                },
                'mouseenter:.submitcover input': function () {
                    $(this).css({cursor: 'pointer'});
                },
                'mouseleave:.submitcover input': function () {
                    $(this).css({cursor: 'normal'});
                },
                'submit:.fileuploaderForm': function (e) {
                    e.stopPropagation();
                    e.cancelBubble = true;
                    if (self.option.usingHtml5) {
                        return false;
                    }
                    return true;
                }
            });
            !this.option.usingHtml5 && this.delegateEvents({
                'mouseenter:.inputOp': function () {
                    $(this).css({cursor: 'pointer'});
                },
                'mouseleave:.inputOp': function () {
                    $(this).css({cursor: 'normal'});
                },
                'click:.add': function () {
                    self.appendFileInput();
                },
                'click:.remove': function () {
                    var w = self.$('.fileInputWrapper', false);
                    var length = w.length;
                    if (length > 1) {
                        $(w[w.length - 1]).remove();
                    }

                }
            });
            !this.option.usingHtml5 && this.$('.uploaderframe').on('load', function (e) {
                var doc = this.contentWindow.document;
                var body = doc.getElementsByTagName('body')[0];
                var result;
                try {
                    result = JSON.parse(body.innerText);
                }
                catch (e) {
                    alert('上传失败');
                }
                self.option.onIframeLoaded && self.option.onIframeLoaded(result);
            });
            this.option.usingHtml5 && this.delegateEvents({
                'click:.submitcover input': function (e) {
                    e.stopPropagation();
                    e.cancelBubble = true;
                    __ajaxUpload.call(self);
                }
            });
        },
        appendFileInput: function () {
            var form = this.form;
            var p = document.createElement('p');
            p.innerHTML = '<div class="btncover"><label></label><input class="button" type="button" value="选择文件"></div>' +
                '<div class="filecover"><input class="file" name="file[]" type="file"></div>';
            p.className = 'fileInputWrapper';
            p.style.position = 'relative';
            form.find('.submitcover').before(p);
            this.__initStyle();
        },
        resetProgress:function(){
            var progress=this.$('.progress');
            progress.find('.progressbar').css('width',0);
            progress.find('.progressdigital').text('0%');
            progress.css('display','none');
        }
    });

    function __ajaxUpload() {
        var self = this;
        var form=this.$('.fileuploaderForm');
        var formData = new FormData(form[0]);
        var progress = form.find('.progress');
        var ajax = new XMLHttpRequest();
        this.resetProgress();
        ajax.open('POST', this.url, true);

        ajax.upload.onprogress = function (e) {
            var totalSize= e.totalSize;
            var loaded = e.loaded;
            var percent = parseInt((loaded / totalSize) * 100);
            progress.find('.progressbar').css('width',percent+'%');
            progress.find('.progressdigital').text(percent+'%');
        };
        ajax.onloadstart = function(){
            progress.css('display','block');
        };
        ajax.onload = function (){
            var statusCode=ajax.status;
            __statusCodeFunc[statusCode].call(self);
        };
        ajax.onerror = function (){
            alert('上传失败');
        };
        ajax.send(formData);
    }
    var __statusCodeFunc={
        200:function(){
            alert('上传成功!');
        },
        404:function(){
            this.resetProgress();
            alert('上传接口不存在!!');
        }
    };
});
