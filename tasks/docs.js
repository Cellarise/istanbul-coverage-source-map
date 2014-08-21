/* jslint node: true */
"use strict";
var concat = require("gulp-concat");
var path = require('path');
var fs = require('fs');
var jsdoc2md = require("gulp-jsdoc-to-markdown");
var GulpDustCompileRender = require('gulp-dust-compile-render');

module.exports = function(gulp) {
    gulp.task("docs", function(cb){
        var dest = "";
        var context = JSON.parse(fs.readFileSync('package.json'));
        var options = {
            template: './doc_templates/readme.md',
            preserveWhitespace: true,
            partialsGlob: path.join(process.cwd(), 'doc_templates/') + '*.dust*'
        };

        gulp.src(['lib/**/*.js'])
            .pipe(concat("README.md"))
            .pipe(jsdoc2md(options))
            .pipe(new GulpDustCompileRender(context, options))
            .pipe(gulp.dest(dest))
            .on('end', cb);
    });
};
