var path = require('path');
var expressTplPath = path.join('G:', 'nodejs', 'expressTpl');
var copysOfNodejsFiles = [
    'config',
    'global',
    'lib',
    'self_middleware'
];
var copysOfBroswerJsFiles = [
    'component',
    'core',
    'lib',
    'mod',
    'selfmodule',
    'widget'
];
var copysOfCssFiles = [
    'lib',
    'tools'
];
var copyOfLessFiles = [
    'lib',
    'tools',
    'Template'
];
var copysOfSeajs = [
    'seajs'
];
var copy = {};
copysOfNodejsFiles.forEach(function (item) {
    copy['nodejs_' + item] = {
        expand: true,
        src: './' + item + '/**/*.js',
        dest: path.join(expressTplPath, item)
    };
});
copysOfBroswerJsFiles.forEach(function (item) {
    var prefix = './public/javascripts/';
    copy['js_' + item] = {
        expand: true,
        src: prefix + item + '/**/*.js',
        dest: path.join(expressTplPath, 'public', 'javascripts', item)
    };
});
copysOfSeajs.forEach(function (dir) {
    var prefix = './public/';
    copy['seajs_' + dir] = {
        expand: true,
        src: prefix + dir + '/**/*.js',
        dest: path.join(expressTplPath, 'public', dir)
    };
});
copyOfLessFiles.forEach(function (dir) {
    var prefix = './public/less/';
    copy['less_' + dir] = {
        expand: true,
        src: prefix + dir + '/**/*.less',
        dest: path.join(expressTplPath, 'public/less', dir)
    };
});
copysOfCssFiles.forEach(function (dir) {
    var prefix = './public/css/';
    copy['css_'+dir]={
        expand:true,
        src:prefix+dir+'/**/*.js',
        dest:path.join(expressTplPath,'public/css',dir)
    };
});
module.exports=function(grunt){
    grunt.initConfig({
        copy:copy
    });

    grunt.loadNpmTasks('grunt-copy');
};

