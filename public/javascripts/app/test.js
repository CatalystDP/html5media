define(function (require, exports, module) {
    var $ = require('jQuery');
    require('../selfmodule/banner.jquery.fix');
    $('.banner').bannerFade();
});
