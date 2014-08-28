/* jslint node: true */
"use strict";
var fs = require('fs');
var path = require('path');
var SourceMapConsumer = require("source-map-closest-match").SourceMapConsumer;


function prepareCoverageObjForFile(p_origFilePath, p_listCode, TRANSLATED_COV_OBJ, origFileCtrMap) {
    if (!TRANSLATED_COV_OBJ.hasOwnProperty(p_origFilePath)) {
        //setup coverage object for file
        TRANSLATED_COV_OBJ[p_origFilePath] = {
            "path": p_origFilePath,
            "s": {},
            "b": {},
            "f": {},
            "fnMap": {},
            "statementMap": {},
            "branchMap": {}
        };
        //setup counters
        origFileCtrMap[p_origFilePath] = {};
        origFileCtrMap[p_origFilePath].s = 0;
        origFileCtrMap[p_origFilePath].b = 0;
        origFileCtrMap[p_origFilePath].f = 0;
    }
    //get next statement number for original file (counter)
    origFileCtrMap[p_origFilePath][p_listCode] = origFileCtrMap[p_origFilePath][p_listCode] + 1;

    //No return - arguments passed by reference
}

function translateStatement(statementList, statementMapList, sourceMapConsumer, opts, TRANSLATED_COV_OBJ, origFileCtrMap) {
    var statement;
    for (statement in statementList) {
        if(statementList.hasOwnProperty(statement)) {
            var origStartPos,
                origEndPos,
                origFilePath,
                statementMap = statementMapList[statement];

            //get original file and line and column - convert statementMap object
            origStartPos = sourceMapConsumer.originalPositionFor({
                line: statementMap.start.line,
                column: statementMap.start.column
            });
            origEndPos = sourceMapConsumer.originalPositionFor({
                line: statementMap.end.line,
                column: statementMap.end.column
            });
            origFilePath = origStartPos.source;
            //strip generator prefix
            origFilePath = origFilePath.replace(opts.generatorPrefix, '');
            //convert to absolute path
            origFilePath = path.resolve(origFilePath);

            //if file exists and if start filepath source equals end filepath source then add to coverage.
            if (fs.existsSync(origFilePath) && origStartPos.source === origEndPos.source) {

                //check if we've started translating this file
                //if not then prepare translation coverage object for file and file counters
                //increment statement counter "s"
                prepareCoverageObjForFile(origFilePath, "s", TRANSLATED_COV_OBJ, origFileCtrMap);

                //add statement and statementMap to translated coverage object for file
                TRANSLATED_COV_OBJ[origFilePath].s[origFileCtrMap[origFilePath].s] = statementList[statement];
                TRANSLATED_COV_OBJ[origFilePath].statementMap[origFileCtrMap[origFilePath].s] = {
                    "start": {
                        "line": origStartPos.line,
                        "column": origStartPos.column
                    },
                    "end": {
                        "line": origEndPos.line,
                        "column": origEndPos.column
                    }
                };
            }
        }
    }
}

function translateBranch(branchList, branchMapList, sourceMapConsumer, opts, TRANSLATED_COV_OBJ, origFileCtrMap) {
    var branch;
    for (branch in branchList) {
        if(branchList.hasOwnProperty(branch)){
            var origPos,
                origStartPos,
                origEndPos,
                origFilePath,
                locCtr,
                branchLocation,
                branchMap = branchMapList[branch];

            //get original file and line and column - convert statementMap object
            origPos = sourceMapConsumer.originalPositionFor({
                line: branchMap.line,
                column: 0
            });
            origFilePath = origPos.source;

            origFilePath = origPos.source;
            //strip generator prefix
            origFilePath = origFilePath.replace(opts.generatorPrefix, '');
            //convert to absolute path
            origFilePath = path.resolve(origFilePath);

            //if file exists then add to coverage.
            if (fs.existsSync(origFilePath)) {
                //check if we've started translating this file
                //if not then prepare translation coverage object for file and file counters
                //increment branch counter "b"
                prepareCoverageObjForFile(origFilePath, "b", TRANSLATED_COV_OBJ, origFileCtrMap);

                //add branch and branchMap to translated coverage object for file
                TRANSLATED_COV_OBJ[origFilePath].b[origFileCtrMap[origFilePath].b] = branchList[branch];
                TRANSLATED_COV_OBJ[origFilePath].branchMap[origFileCtrMap[origFilePath].b] = {
                    "line": origPos.line,
                    "type": branchMap.type,
                    "locations": []
                };
                //add locations
                for (locCtr = 0; locCtr < branchMap.locations.length; locCtr = locCtr + 1) {
                    branchLocation = branchMap.locations[locCtr];

                    origStartPos = sourceMapConsumer.originalPositionFor(branchLocation.start);
                    origEndPos = sourceMapConsumer.originalPositionFor(branchLocation.end);

                    TRANSLATED_COV_OBJ[origFilePath].branchMap[origFileCtrMap[origFilePath].b].locations[locCtr] = {
                        "start": {
                            "line": origStartPos.line,
                            "column": origStartPos.column
                        },
                        "end": {
                            "line": origEndPos.line,
                            "column": origEndPos.column
                        }
                    };
                }
            }
        }
    }
}

function translateFn(fnList, fnMapList, sourceMapConsumer, opts, TRANSLATED_COV_OBJ, origFileCtrMap) {
    var fn;

    for (fn in fnList) {
        if(fnList.hasOwnProperty(fn)){
            var origPos,
                origStartPos,
                origEndPos,
                origFilePath,
                fnMap = fnMapList[fn];

            //get original file and line and column - convert statementMap object
            origPos = sourceMapConsumer.originalPositionFor({
                line: fnMap.line,
                column: 0
            });
            origStartPos = sourceMapConsumer.originalPositionFor(fnMap.loc.start);
            origEndPos = sourceMapConsumer.originalPositionFor(fnMap.loc.end);

            origFilePath = origPos.source;
            //strip generator prefix
            origFilePath = origFilePath.replace(opts.generatorPrefix, '');
            //convert to absolute path
            origFilePath = path.resolve(origFilePath);

            //if file exists and if start filepath source equals end filepath source then add to coverage.
            if (fs.existsSync(origFilePath) && origStartPos.source === origEndPos.source) {

                //check if we've started translating this file
                //if not then prepare translation coverage object for file and file counters
                //increment statement counter "s"
                prepareCoverageObjForFile(origFilePath, "f", TRANSLATED_COV_OBJ, origFileCtrMap);

                //add statement and statementMap to translated coverage object for file
                TRANSLATED_COV_OBJ[origFilePath].f[origFileCtrMap[origFilePath].f] = fnList[fn];
                TRANSLATED_COV_OBJ[origFilePath].fnMap[origFileCtrMap[origFilePath].f] = {
                    "name": fnMap.name,
                    "line": origPos.line,
                    "loc": {
                        "start": {
                            "line": origStartPos.line,
                            "column": origStartPos.column
                        },
                        "end": {
                            "line": origEndPos.line,
                            "column": origEndPos.column
                        }
                    }
                };
            }
        }
    }
}

function translate(covFileObj, sourceMapFilePath, opts, TRANSLATED_COV_OBJ, origFileCtrMap) {
    var sourceMapObj,
        sourceMapConsumer,
        //lists and list items
        statementList,
        branchList,
        fnList,
        statementMapList,
        branchMapList,
        fnMapList;

    //load source map
    sourceMapObj = JSON.parse(fs.readFileSync(sourceMapFilePath, "UTF-8"));
    sourceMapConsumer = new SourceMapConsumer(sourceMapObj);

    //get list references
    statementList = covFileObj.s;
    statementMapList = covFileObj.statementMap;
    branchList = covFileObj.b;
    branchMapList = covFileObj.branchMap;
    fnList = covFileObj.f;
    fnMapList = covFileObj.fnMap;

    translateStatement(statementList, statementMapList, sourceMapConsumer, opts, TRANSLATED_COV_OBJ, origFileCtrMap);

    translateBranch(branchList, branchMapList, sourceMapConsumer, opts, TRANSLATED_COV_OBJ, origFileCtrMap);

    translateFn(fnList, fnMapList, sourceMapConsumer, opts, TRANSLATED_COV_OBJ, origFileCtrMap);
}

/**
 * {description}.
 * @module {name}
 * @param {Object} COV_OBJ an istanbul coverage object
 * @param {Object} opts optional
 * @param {Object} [opts.generatorPrefix=''] the protocol prefix added to the path for original sources by the source map generator.
 * @param {Object} [opts.sourceMaps] an object array of source-map file mappings.
 * If not provided the module will look for a source map in the same directory as the covered source file with the suffix `.map`.
 * Object array example,
 * {~lb}
 * "./file1.js": "./file1.js.map",
 * "./file2.js": "./maps/file2.js.map"
 * {~rb}
 */
module.exports = function (COV_OBJ, opts) {
    if(typeof COV_OBJ === 'string' || COV_OBJ instanceof String){
        COV_OBJ = JSON.parse(COV_OBJ);
    }
    opts = opts || {};
    opts.generatorPrefix = opts.generatorPrefix || '';
    opts.sourceMaps = opts.sourceMaps || false;

    //for each file in coverage object
    var TRANSLATED_COV_OBJ = {},
        origFileCtrMap = {},
        translating = false,
        covFileObj,
        currFileName,
        currFilePath,
        //source map
        sourceMapFilePath;

    for (currFileName in COV_OBJ) {
        if(COV_OBJ.hasOwnProperty(currFileName)){
            covFileObj = COV_OBJ[currFileName];
            currFilePath = covFileObj.path;

            //get source map path
            if(opts.sourceMaps) {
                sourceMapFilePath = opts.sourceMaps[currFilePath];
            } else {
                sourceMapFilePath = currFilePath + '.map';
            }

            //check if file has a source map
            if (fs.existsSync(sourceMapFilePath)) {
                translating = true;
                translate(covFileObj, sourceMapFilePath, opts, TRANSLATED_COV_OBJ, origFileCtrMap);
            }

        }
    }

    if (translating) {
        return JSON.stringify(TRANSLATED_COV_OBJ);
    } else {
        return JSON.stringify(COV_OBJ);
    }
};
