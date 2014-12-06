//var path = require('path');
//var expressTplPath = path.join('G:', 'nodejs', 'expressTpl');
//var copysOfNodejsFiles = [
//    'config',
//    'global',
//    'lib',
//    'self_middleware'
//];
//var copysOfBroswerJsFiles = [
//    'component',
//    'core',
//    'lib',
//    'mod',
//    'selfmodule',
//    'widget'
//];
//var copysOfCssFiles = [
//    'lib',
//    'tools'
//];
//var copyOfLessFiles = [
//    'lib',
//    'tools',
//    'Template'
//];
//var copysOfSeajs = [
//    'seajs'
//];
//var copy = {};
//copysOfNodejsFiles.forEach(function (item) {
//    copy['nodejs_' + item] = {
//        expand: true,
//        cwd:'./',
//        src: item + '/**/*.js',
//        dest:expressTplPath
//    };
//});
//copysOfBroswerJsFiles.forEach(function (item) {
//    var prefix = './public/javascripts/';
//    copy['js_' + item] = {
//        expand: true,
//        src: prefix + item + '/**/*.js',
//        dest: expressTplPath
//    };
//});
//copysOfSeajs.forEach(function (dir) {
//    var prefix = './public/';
//    copy['seajs_' + dir] = {
//        expand: true,
//        src: prefix + dir + '/**/*.js',
//        dest:expressTplPath
//    };
//});
//copyOfLessFiles.forEach(function (dir) {
//    var prefix = './public/less/';
//    copy['less_' + dir] = {
//        expand: true,
//        src: prefix + dir + '/**/*.less',
//        dest: expressTplPath
//    };
//});
//copysOfCssFiles.forEach(function (dir) {
//    var prefix = './public/css/';
//    copy['css_'+dir]={
//        expand:true,
//        src:prefix+dir+'/**/*.js',
//        dest:expressTplPath
//    };
//});
//module.exports=function(grunt){
//    grunt.initConfig({
//        copy:copy
//    });
//
//    grunt.loadNpmTasks('grunt-contrib-copy');
//    grunt.registerTask('copyToTpl',['copy']);
//};

