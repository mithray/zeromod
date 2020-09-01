var builder = require('xmlbuilder');
 
var obj = {
  root: {
    xmlbuilder: {
      repo: {
        '@type': 'git', // attributes start with @
        '#text': 'git://github.com/oozcitak/xmlbuilder-js.git' // text node
      }
    }
  }
};
 
var xml = builder.create(obj).end({ pretty: true});
console.log(xml);
