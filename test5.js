var obj = {}
function setNestedProperty( obj, names, data ) {
    for( var i = 0; i < names.length; i++ ) {
        obj= obj[ names[i] ] = obj[ names[i] ] || data;
    }
console.log(obj)
};
console.log(setNestedProperty(obj, ['hi1', 'hi2'], 'hi3' ))
