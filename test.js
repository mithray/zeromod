const crypto = require('crypto');


const arr = [ 'one', 'two', 'three', 'four', 'one', 'two', 'four', 'three' ]
arr.forEach(word=>{
    var newHash = crypto.createHash('sha256')
    newHash.update(word)
    console.log(newHash.digest('hex'))
})
