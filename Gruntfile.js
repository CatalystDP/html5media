var path = require('path');
var expressTplPath = path.join('G:', 'nodejs', 'expressTpl');
var gruntConfig=require('./grunt.config');
var copy={};
var copys=grunt.copys;
for(var p in copys){
    copys[p].files.forEach(function(item){
            copy[p+'_'+item]={
                expand:true,
                src:copys[p].prefix+'/**/*'+copys[p].ext,
                dest:expressTplPath
            };
    });
}
module.exports=function(grunt){
    grunt.initConfig({
        copy:copy
    });

    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.registerTask('copyToTpl','copy');
};

