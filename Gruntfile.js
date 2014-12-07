var path = require('path');
var expressTplPath = path.join('G:', 'nodejs', 'expressTpl');
var gruntConfig = require('./grunt.config');
var copy = {
    toExpressTpl: {
        expand: true,
        src: [],
        dest: expressTplPath
    }
};
var copys = gruntConfig.copys;
for (var p in copys) {
    copys[p].files.forEach(function (item) {
        copy.toExpressTpl.src.push(
            copys[p].prefix+'/'+item+'/**/*'+copys[p].ext
        );
    });
}
module.exports = function (grunt) {
    grunt.initConfig({
        copy: copy
    });
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.registerTask('copyToTpl','copy:toExpressTpl');
};

