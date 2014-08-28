/* jslint node: true */
"use strict";
var fs = require('fs');
var path = require('path');
var gulp = require('gulp');
var tap = require('gulp-tap');
var assert = require('assert');
var English = require('yadda').localisation.English;
var webpack = require("webpack");
var gutil = require("gulp-util");
var istanbul = require('gulp-istanbul-custom-reports');
var webpackConfig = {
    context: process.cwd(),
    entry: "./Test/resources/non-bundled/non-bundled-file-1.js",
    output: {
        path: path.join(process.cwd(), "Test/resources"),
        filename: "bundled.js",
        chunkFilename: "[id].chunk.js"
    },
    devtool: "source-map"
};

/* Feature: Develop clover-style json report with source-map support */
module.exports = (function() {
    return English.library()
    /*Scenario: Code coverage report with no source maps */
        .define("Given I have non-bundled Javascript files", function(done) {
            this.world.non_bundled_file_1 = path.join(__dirname, '../resources/non-bundled/non-bundled-file-1');
            this.world.non_bundled_file_2 = path.join(__dirname, '../resources/non-bundled/non-bundled-file-2');
            assert(fs.existsSync(this.world.non_bundled_file_1 + '.js'));
            assert(fs.existsSync(this.world.non_bundled_file_2 + '.js'));
            done();
        })
        .define("When I run coverage report on the files", function(done) {
            var COVERAGE_VARIABLE = '$$1cov_' + new Date().getTime() + '$$';
            var covObj;
            var istanbulCoverageSourceMap = require('../../lib/index.js');

            gulp.src(['Test/resources/non-bundled/**/*.js'], {cwd: process.cwd()})
                .pipe(istanbul({coverageVariable: COVERAGE_VARIABLE})) // Covering files - must wait for finish event before continuing
                .on('finish', function () {
                    gulp.src(['Test/resources/non-bundled/**/*.js'], {cwd: process.cwd()})
                        .pipe(tap(function(f) {
                            require(f.path); // Make sure all files are loaded to get accurate coverage data
                        }))
                        .on('end', function () {
                            covObj = JSON.stringify(global[COVERAGE_VARIABLE]);

                            //translate coverage object
                            covObj = istanbulCoverageSourceMap(covObj, {
                                generatorPrefix: "webpack:///"
                            });

                            fs.writeFileSync('Test/code-coverage/non-bundled/coverage.json', covObj);

                            global[COVERAGE_VARIABLE] = JSON.parse(covObj);

                            gulp.src('Test/resources/non-bundled/**/*.js')
                                .pipe(istanbul.writeReports({
                                    coverageVariable: COVERAGE_VARIABLE,
                                    dir: 'Test/code-coverage/non-bundled',
                                    reporters: [ 'html', 'clover']
                                }))
                                .on('end', done);
                        });
                });
        })
        .define("Then a coverage report is produced referencing the non-bundled files", function(done) {
            var actualObj = JSON.parse(fs.readFileSync('Test/code-coverage/bundled/coverage.json', "UTF-8"));
            var expectedObj = JSON.parse(fs.readFileSync('Test/code-coverage/non-bundled/coverage.json', "UTF-8"));
            var actualFile, expectedFile;
            var actual, expected;

            //set actual to last file in set
            for (actualFile in actualObj){
                if(actualObj.hasOwnProperty(actualFile)){
                    actual = actualFile.statementMap;
                }
            }
            for (expectedFile in expectedObj){
                if(expectedObj.hasOwnProperty(expectedFile)){
                    expected = expectedFile.statementMap;
                }
            }
            expected = JSON.stringify(expected);
            actual = JSON.stringify(actual);
            assert.equal(actual, expected);
            done();
        })/*Scenario: Code coverage report with source maps */
        .define("Given I have a bundled Javascript file", function(done) {
            var self = this;
            //create bundle
            // modify some webpack config options
            var myConfig = Object.create(webpackConfig);
            // run webpack
            webpack(myConfig, function(err, stats) {
                if(err) {
                    throw new gutil.PluginError("webpack:build", err);
                }
                gutil.log("[webpack:build]", stats.toString({
                    colors: true
                }));
                self.world.template = path.join(__dirname, '../resources/bundled');
                assert(fs.existsSync(self.world.template + '.js'));
                done();
            });
        })
        .define("When I run coverage report on the file", function(done) {
            var COVERAGE_VARIABLE = '$$2cov_' + new Date().getTime() + '$$';
            var covObj;
            var istanbulCoverageSourceMap = require('../../lib/index.js');

            gulp.src(['Test/resources/bundled.js'], {cwd: process.cwd()})
                .pipe(istanbul({coverageVariable: COVERAGE_VARIABLE})) // Covering files - must wait for finish event before continuing
                .on('finish', function () {
                    gulp.src(['Test/resources/bundled.js'], {cwd: process.cwd()})
                        .pipe(tap(function(f) {
                            require(f.path); // Make sure all files are loaded to get accurate coverage data
                        }))
                        .on('end', function () {
                            covObj = JSON.stringify(global[COVERAGE_VARIABLE]);

                            //translate coverage object
                            covObj = istanbulCoverageSourceMap(covObj, {
                                generatorPrefix: "webpack:///"
                            });

                            fs.writeFileSync('Test/code-coverage/bundled/coverage.json', covObj);

                            global[COVERAGE_VARIABLE] = JSON.parse(covObj);

                            gulp.src('Test/resources/bundled.js')
                                .pipe(istanbul.writeReports({
                                    coverageVariable: COVERAGE_VARIABLE,
                                    dir: 'Test/code-coverage/bundled',
                                    reporters: [ 'html', 'clover']
                                }))
                                .on('end', done);
                        });
                });
        });
})();