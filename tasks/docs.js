/* jslint node: true */
"use strict";
var concat = require("gulp-concat");
var path = require('path');
var jsdoc2md = require("gulp-jsdoc-to-markdown");
var GulpDustCompileRender = require('gulp-dust-compile-render');

/**
 * A gulp build task to generate JSDoc documentation, license documentation, and README file.
 * Dependent on gulp build task `docs-pre`.
 * @alias tasks:docs
 */
module.exports = function(gulp, context) {
    gulp.task("docs", function(){
        var cwd = context.cwd;
        var pkg = context.package;
        var directories = pkg.directories;
        var options = {
            template: './doc/readme.md',
            preserveWhitespace: true,
            partialsGlob: path.join(cwd, directories.doc) + '/templates/*.dust*'
        };

        return gulp.src([directories.lib + '/**/*.js'])
            .pipe(concat("README.md"))
            .pipe(jsdoc2md(options))
            .pipe(new GulpDustCompileRender(pkg, options))
            .pipe(gulp.dest(""));
    });
};
