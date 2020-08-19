const buildCache = require('./build-cache.js')
const getMods = require('./')

async function init(){
    console.log('initializing...')
    const configPath = path.join(process.cwd(), '.config')
    const modList = await getModList()
        .then((modList)=>{
            save(modList)
            const existAccess = fs.constants.F_OK
            const readAccess = fs.constants.R_OK
            const writeAccess = fs.constants.W_OK
            try {
                fs.accessSync(cachePath, readAccess && writeAccess);
            } catch (err) {
                fs.mkdirSync(path.join(process.cwd(), '.cache'))
            }
            getConfig(modList)
        })

    buildCache()
}
module.exports = init
