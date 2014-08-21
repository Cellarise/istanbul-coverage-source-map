/* jslint node: true */
/* global featureFile, scenarios, steps */
"use strict";

var Yadda = require('yadda');
var path = require('path');
var context = {
    assert: require('assert'),
    world: {},
    paths: {
        features: './unit/',
        steps: './unit/'
    }
}; //interpreter context - global

//helper function to prepare multiple libraries for loading into the yadda interpreter
function require_libraries(libraries) {
    function require_library(libraries, library) {
        return libraries.concat(require(path.join(__dirname, context.paths.steps)+ library));
    }
    return libraries.reduce(require_library, []);
}

//attach yadda functions like featureFile to this object
Yadda.plugins.mocha.AsyncStepLevelPlugin.init();

//execute all unit test feature files
new Yadda.FeatureFileSearch([path.join(__dirname, context.paths.features)]).each(function(file) {

    featureFile(file, function(feature) {
        var loaded_libraries,
            libraries = [];

        if(feature.annotations.libraries !== undefined){
            libraries = feature.annotations.libraries.split(', '); //load any libraries annotated in the feature file
        }
        libraries.push(file.replace(/.*\\|\..*$/g, '').replace(/\..+$/, '') + "-steps.js"); //add
        loaded_libraries = require_libraries(libraries);

        var yadda = new Yadda.Yadda(loaded_libraries, context);
        scenarios(feature.scenarios, function(scenario) {
            steps(scenario.steps, function(step, done) {
                yadda.yadda(step, done);
            });
        });
    });
});