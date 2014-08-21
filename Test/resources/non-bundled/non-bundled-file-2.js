//jshint ignore:start
var results = {};
var self = function(e) {
    return function(f) {
        return e + f + 1;
    };
};
if(self){
    results = { custom: 9 };
} else {
    results = { custom: 0 };
}