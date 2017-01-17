import electron from 'electron'
import path from 'path'

let app = electron.remote.app

let appDataDir = path.join(app.getPath('appData'), 'com.hsiaosiyuan0.lottery')

let dataDir = path.join(appDataDir, 'data')
let playersJSONFile = path.join(dataDir, 'players.db')
let prizesJSONFile = path.join(dataDir, 'prizes.db')

let photosDir = path.join(dataDir, 'photos')

export default {
  dataDir,
  playersJSONFile,
  prizesJSONFile,
  photosDir
}
