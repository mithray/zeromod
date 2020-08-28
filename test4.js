var createNestedObject = function( base, names ) {
    for( var i = 0; i < names.length; i++ ) {
        base = base[ names[i] ] = base[ names[i] ] || {};
    }
};

obj = {}
createNestedObject( obj, ["shapes", "triangle", "points"] );
console.log(obj)
