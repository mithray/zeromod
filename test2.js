/*
var Parser = require("fast-xml-parser").j2xParser;
//default options need not to set
var defaultOptions = {
    attributeNamePrefix : "@_",
    attrNodeName: "@", //default is false
    textNodeName : "#text",
    ignoreAttributes : false,
    cdataTagName: "__cdata", //default is false
    cdataPositionChar: "\\c",
    format: false,
    indentBy: "  ",
    supressEmptyNode: false,
};
var obj=

var parser = new Parser(defaultOptions);
var xml = parser.parse(obj);
console.log(xml)
*/
var XML = require('xml')

var xml = XML(
//      Class: 'e',
//      Health: 'aoeu',
//      Identity: 'eueou'
  {
    nested: [{ 
      keys: [{ 
          fun: 'hi',
        }, {
          nested: [{ 
          keys: [{ 
            _fun: 'hi' 
          }]
        }]}
]
    }]
  }
)
console.log(xml)

