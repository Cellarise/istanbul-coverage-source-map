# {name}
[![view on npm](http://img.shields.io/npm/v/{name}.svg)](https://www.npmjs.org/package/{name})
[![npm module downloads per month](http://img.shields.io/npm/dm/{name}.svg)](https://www.npmjs.org/package/{name})
[![Dependency Status](https://david-dm.org/Cellarise/{name}.svg)](https://david-dm.org/Cellarise/{name})

> {description}


##Usage 

Get the coverage object after tests have been performed and then translate using this module. The example, below is based on using a gulp task runner for istanbul - gulp-istanbul-custom-reports.  

```js
var istanbul = require('gulp-istanbul-custom-reports');
var COVERAGE_VARIABLE = '$$1cov_' + new Date().getTime() + '$$';
var covObj;
var istanbulCoverageSourceMap = require('{name}');
var sourceFiles = 'lib/bundled/**/*.js'

gulp.src(sourceFiles)
    .pipe(istanbul({coverageVariable: COVERAGE_VARIABLE})) // Covering files - must wait for finish event before continuing
    .on('finish', function () {
        gulp.src(sourceFiles)
            ... run tests
            .on('end', function () {
            
                //get original coverage object
                covObj = JSON.stringify(global[COVERAGE_VARIABLE]);

                //translate coverage object
                covObj = istanbulCoverageSourceMap(covObj);

                //pass translated coverage object back to istanbul
                global[COVERAGE_VARIABLE] = JSON.parse(covObj);

                //generate report
                gulp.src(sourceFiles)
                    .pipe(istanbul.writeReports({
                        coverageVariable: COVERAGE_VARIABLE,
                        reporters: [ 'html']
                    }))
                    .on('end', done);
            });
    });
```



# API
{~lb}{~lb}>main{~rb}{~rb}
*documented by [jsdoc-to-markdown](https://github.com/75lb/jsdoc-to-markdown)*.


# License

MIT License (MIT)

Copyright (c) 2014 {author}