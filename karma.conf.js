//jshint strict: false
module.exports = function (config) {
    config.set({

        basePath: './app',

        files: [
            'bower_components/angular/angular.js',
            'bower_components/angular-route/angular-route.js',
            'bower_components/angular-mocks/angular-mocks.js',
            'view2/view2.js',
            'view2/conversionCtrl.js',
            'view1/**/*.js',
            'view2/**/*.js',

            'components/**/*.js',
            'GF/**/*.js',
            'SlideNav/**/*.js'
        ],

        preprocessors: {
            // source files, that you wanna generate coverage for
            // do not include tests or libraries
            // (these files will be instrumented by Istanbul)
            'view*/**/*.js': ['coverage'],
            'GF/**/*.js': ['coverage'],
            'components/**/*.js':['coverage']
        },

        autoWatch: true,

        frameworks: ['jasmine'],

        browsers: ['Chrome'],

        plugins: [
            'karma-chrome-launcher',
            'karma-firefox-launcher',
            'karma-jasmine',
            'karma-junit-reporter',
            'karma-coverage'
        ],

        reporters : ['progress','coverage'],

        junitReporter: {
            outputFile: 'test_out/unit.xml',
            suite: 'unit'
        }

    });
};
