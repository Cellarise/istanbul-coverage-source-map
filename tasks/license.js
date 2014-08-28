/* jslint node: true */
"use strict";
var checker = require('npm-license');
var GulpDustCompileRender = require('gulp-dust-compile-render');
var rename = require("gulp-rename");

/**
 * A gulp build task to generate license documentation from all dependent packages.
 * @alias tasks:license
 */
module.exports = function (gulp, context) {
    gulp.task('license', function () {
        var pkg = context.package;
        var directories = pkg.directories;
        var processed = false; //workaround to enable pause and resume stream functions to work

        return gulp.src([directories.doc + '/templates/license/additional_licenses.json',
                directories.doc + '/templates/license/readme-license.dust'])
            .on('data', function (vinyl) {
                var self = this;

                if (!processed) {
                    processed = true;
                    self.pause();
                    checker.init({
                        unknown: false,          // Boolean: generate only a list of unknown licenses
                        start: '.',              // String: path to start the dependency checks
                        depth: '1',            // Number | 'all': how deep to recurse through the dependencies
                        meta: JSON.parse(vinyl.contents),             // String: path to a metadata json file (see below)
                        include: 'all' // String | Array | 'all': recurse through various types of dependencies (https://npmjs.org/doc/json.html)
                    }, function (dependencies) {
                        pkg.licenses = [];
                        //process to get into format for dust
                        var dep, result;
                        for (dep in dependencies) {
                            if (dependencies.hasOwnProperty(dep)) {
                                result = {
                                    name: dep,
                                    license: JSON.stringify(dependencies[dep].licenses),
                                    repository: JSON.stringify(dependencies[dep].repository)
                                };
                                //if (dependencies[dep] instanceof Array){
                                //    result.repository
                                //}
                                pkg.licenses.push(result);
                            }
                        }
                        //ensure this sub task gets executed to update the
                        gulp.src([directories.doc + '/templates/license/readme-license.dust'])
                            .pipe(new GulpDustCompileRender(pkg))
                            .pipe(rename(function (path) {
                                path.basename = path.basename + '.dust';
                                path.extname = '.md';
                            }))
                            .pipe(gulp.dest(directories.doc + '/templates'))
                            .on('end', function () {
                                self.resume();
                            });
                    });
                }

            });
    });
};
