/* jslint node: true */
"use strict";
var rename = require("gulp-rename");
var fs = require('fs');
var GulpDustCompileRender = require('gulp-dust-compile-render');

module.exports = function(gulp) {
    gulp.task("docs-pre", function(cb){
        var dest = "doc_templates";
        var context = JSON.parse(fs.readFileSync('package.json'));

        gulp.src([dest + '/**/*.dust.md'])
            .pipe(new GulpDustCompileRender(context))
            .pipe(rename(function (path) {
                path.basename = path.basename.replace('.dust','');
            }))
            .pipe(gulp.dest(dest))
            .on('end', cb);
    });
};
