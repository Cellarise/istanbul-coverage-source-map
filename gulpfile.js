/* jslint node: true */
"use strict";
var gulp = require("gulp");
require('gulp-load-params')(gulp, {modulePrefix: 'gulp-tasks'});

// setup context object to be passed to gulp tasks
var cwd = process.cwd();
var context = {
    cwd: cwd,
    package: require(cwd + '/package.json')
};

// load tasks from tasks directory and dependencies that start with `gulp-tasks` in package.json
gulp.loadTasks(cwd, context);
