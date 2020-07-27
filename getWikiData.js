const wiki = require('wikijs').default;

wiki()
    .page(process.argv[2])
    .then(page => page.info())
    .then(console.log); // Bruce Wayne
