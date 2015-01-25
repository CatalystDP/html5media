define(function (require) {
    var jQuery = require('jQuery');
    (function ($) {
        var Banner = function (context, option) {
            this.context = context;
            this.option = option;
            var children = this.resetPos(context);
            this.current = children.eq(0);
            this.direction = 1;//1代表正方向，-1代表反方向
            this.isLocked = false;//操作锁
        };
        Banner.prototype.resetPos = function () {
            var context = this.context;
            var children = context.children();

            var fragment = document.createDocumentFragment();
            for (var i = children.length - 1; i >= 0; --i) {
                fragment.appendChild(children[i]);
            }
            context.empty();
            context.append(fragment);
            return context.children();
        };
        Banner.prototype.next = function () {
            if (isLocked) {
                return;
            }

            //这里执行切换的过程
        };
        Banner.prototype.fade = function (callback) {
            var current = this.current;
            current.animate(
                {opacity: 0},
                this.option.speed,
                this.option.easing,
                function () {
                    var parent
                });
        };

        $.fn.bannerFade = function (option) {
            var defaultOp = {
                speed: 1000,
                delay: 3000,
                easing: 'swing'
            };
            if (option === undefined)
                option = defaultOp;
            else
                option = $.extend(defaultOp, option);
            new Banner(this, option);
        };
    })(jQuery);
});


