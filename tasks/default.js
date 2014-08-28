/* jslint node: true */
"use strict";
var runSequence = require('run-sequence');

/**
 * The default gulp build task. The following tasks are executed in sequence:
 * ['test', 'docs-pre', 'docs']
 * @alias tasks:default
 */
module.exports = function(gulp) {
    // Run tasks synchronously in order
    gulp.task('default', function(cb) {
        runSequence(
            'test',
            'docs-pre',
            'docs',
            cb);
    });
};
