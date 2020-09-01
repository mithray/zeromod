const X2JS = require('./x2js.js')

var x2js = new X2JS();
var jsonObj = { 
     MyRoot : {
                _test: 'success',
                test2 : { 
                    item : [ 'val1', 'val2' ]
                }
      }
};
var xml = x2js.json2xml_str( jsonObj );

console.log(xml)


