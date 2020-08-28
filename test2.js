const readdirp = require('readdirp');

// 2) Streams example, non for-await.
// Print out all JS files along with their size within the current folder & subfolders.





readdirp('.')
  .on('data', (entry) => {
    console.log(JSON.stringify(entry))
  })




/*
  // Optionally call stream.destroy() in `warn()` in order to abort and cause 'close' to be emitted
  .on('warn', error => console.error('non-fatal error', error))
  .on('error', error => console.error('fatal error', error))
  .on('end', () => console.log('done'));

*/
