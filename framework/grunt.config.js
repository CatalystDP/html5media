module.exports = {
    copys: {
        copysOfNodejsFiles: {
            prefix: '.',
            ext: '.js',
            files: [
                'config',
                'global',
                'lib',
                'self_middleware'
            ]
        },
        copysOfBroswerJsFiles: {
            prefix: './public/javascripts',
            ext: '.js',
            files: [
                'component',
                'core',
                'lib',
                'mod',
                'selfmodule',
                'widget'
            ]
        },
        copysOfCssFiles: {
            prefix: './public/css',
            ext: '.css',
            files: [
                'lib',
                'tools'
            ]
        },
        copysOfLessFiles: {
            prefix: './public/less',
            ext: '.less',
            files: [
                'lib',
                'tools',
                'Template'
            ]
        },
        copysOfSeajs: {
            prefix: './public/seajs',
            ext: '.js',
            files: [
                'seajs'
            ]
        },
        copysOfViewsUtil:{
            prefix:'./views',
            ext:'.ejs',
            files:[
                'util'
            ]
        }
    }
};
