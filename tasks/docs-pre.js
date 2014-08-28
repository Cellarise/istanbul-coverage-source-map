/* jslint node: true */
"use strict";
var rename = require("gulp-rename");
var path = require('path');
var GulpDustCompileRender = require('gulp-dust-compile-render');

/**
 * A gulp build task to prepare document templates that must be saved to disk for the JSDoc documentation generator (run as part of the `doc` gulp task).
 * @alias tasks:docs-pre
 */
module.exports = function(gulp, context) {
    gulp.task("docs-pre", function(){
        var cwd = context.cwd;
        var pkg = context.package;
        var directories = pkg.directories;
        var options = {
            partialsGlob: path.join(cwd, directories.doc) + '/templates/*.dust*'
        };

        return gulp.src(directories.doc + '/templates/readme.dust.md')
            .pipe(new GulpDustCompileRender(pkg, options))
            .pipe(rename(function (path) {
                path.basename = path.basename.replace('.dust','');
            }))
            .pipe(gulp.dest(directories.doc));
    });
};
