# istanbul-coverage-source-map
[![view on npm](http://img.shields.io/npm/v/istanbul-coverage-source-map.svg)](https://www.npmjs.org/package/istanbul-coverage-source-map)
[![npm module downloads per month](http://img.shields.io/npm/dm/istanbul-coverage-source-map.svg)](https://www.npmjs.org/package/istanbul-coverage-source-map)
[![Dependency Status](https://david-dm.org/Cellarise/istanbul-coverage-source-map.svg)](https://david-dm.org/Cellarise/istanbul-coverage-source-map)

> An istanbul tool to translate the coverage object for bundled scripts using their source map.


##Usage 

Get the coverage object after tests have been performed and then translate using this module. The example, below is based on using a gulp task runner for istanbul - gulp-istanbul-custom-reports.  

```js
var istanbul = require('gulp-istanbul-custom-reports');
var COVERAGE_VARIABLE = '$$1cov_' + new Date().getTime() + '$$';
var covObj;
var istanbulCoverageSourceMap = require('istanbul-coverage-source-map');
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
{{>main}}
*documented by [jsdoc-to-markdown](https://github.com/75lb/jsdoc-to-markdown)*.


# License

MIT License (MIT)

Copyright (c) 2014 John Barry

## Dependencies
[amdefine@0.1.0](&quot;https://github.com/jrburke/amdefine&quot;) - [&quot;BSD&quot;,&quot;MIT&quot;], [istanbul-coverage-source-map@0.0.0](&quot;https://github.com/Cellarise/istanbul-coverage-source-map&quot;) - &quot;MIT License (MIT)&quot;, [source-map-closest-match@0.1.0](&quot;https://github.com/Cellarise/source-map-closest-match&quot;) - [&quot;BSD&quot;], 
*documented by [npm-licenses](http://github.com/AceMetrix/npm-license.git)*.