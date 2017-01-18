'use strict'

const electron = require('electron')
const path = require('path')
const app = electron.app
const BrowserWindow = electron.BrowserWindow
const fs = require('fs')
const Menu = electron.Menu
const dialog = electron.dialog

const afs = {
  readFile: function(file, options = null) {
    return new Promise((resolve, reject) => {
      fs.readFile(file, options, (err, data) => {
        if (err) {
          if (err.code === 'ENOENT') {
            reject()
          } else {
            throw err
          }
        }
        resolve(data)
      })
    })
  },
  mkdir: function(path, mode) {
    return new Promise((resolve) => {
      fs.mkdir(path, mode, (err) => {
        if (err && err.code !== 'EEXIST')
          throw err
        resolve()
      })
    })
  },
  writeFile: function(file, data) {
    return new Promise((resove, reject) => {
      fs.writeFile(file, data, function(err) {
        if (err)
          throw err
        resove()
      })
    })
  }
}

let mainWindow
let config = {}

if (process.env.NODE_ENV === 'development') {
  config = require('../config')
  config.url = `http://localhost:${config.port}`
} else {
  config.devtron = false
  config.url = `file://${__dirname}/dist/index.html`
}

function createDataFiles() {
  let appDataDir = path.join(app.getPath('appData'), 'com.hsiaosiyuan0.lottery')
  let dataDir = path.join(appDataDir, 'data')

  return afs.mkdir(appDataDir, 0o744).then(() => {
    return afs.mkdir(dataDir, 0o744)
  }).then(function() {
    let playersJSONFile = path.join(dataDir, 'players.db')
    let prizesJSONFile = path.join(dataDir, 'prizes.db')
    let photosDir = path.join(dataDir, 'photos')

    let tasks = []

    tasks.push(afs.readFile(playersJSONFile).then(() => {
      return Promise.resolve()
    }, (err) => {
      return afs.writeFile(playersJSONFile, JSON.stringify([{
        name: 'Test',
        photoSrc: ''
      }], null, 4))
    }))

    tasks.push(afs.readFile(prizesJSONFile).then(() => {
      return Promise.resolve()
    }, () => {
      return afs.writeFile(prizesJSONFile, JSON.stringify([], null, 4))
    }))

    tasks.push(afs.mkdir(photosDir, 0o744))

    return Promise.all(tasks)
  })
}

function createWindow() {
  let template = [
    {
      label: 'Application',
      submenu: [
        {
          label: 'About',
          click: function() {
            dialog.showMessageBox({
              type: 'info',
              icon: null,
              message: 'A little 🎁 lottery soft written by hsiaosiyuan0'
            })
          }
        },
        {
          label: 'Quit',
          accelerator: 'Command+Q',
          click: function() {
            app.quit()
          }
        }
      ]
    },
    {
      label: 'Edit',
      submenu: [
        {
          label: 'Undo',
          accelerator: 'CmdOrCtrl+Z',
          selector: 'undo:'
        },
        {
          label: 'Redo',
          accelerator: 'Shift+CmdOrCtrl+Z',
          selector: 'redo:'
        },
        {
          type: 'separator'
        },
        {
          label: 'Cut',
          accelerator: 'CmdOrCtrl+X',
          selector: 'cut:'
        },
        {
          label: 'Copy',
          accelerator: 'CmdOrCtrl+C',
          selector: 'copy:'
        },
        {
          label: 'Paste',
          accelerator: 'CmdOrCtrl+V',
          selector: 'paste:'
        },
        {
          label: 'Select All',
          accelerator: 'CmdOrCtrl+A',
          selector: 'selectAll:'
        }
      ]
    }
  ]

  Menu.setApplicationMenu(Menu.buildFromTemplate(template))

  /**
   * Initial window options
   */
  mainWindow = new BrowserWindow({
    height: 600,
    width: 980
  })

  mainWindow.loadURL(config.url)

  if (process.env.NODE_ENV === 'development') {
    BrowserWindow.addDevToolsExtension(path.join(__dirname, '../node_modules/devtron'))

    let installExtension = require('electron-devtools-installer')

    installExtension.default(installExtension.VUEJS_DEVTOOLS)
      .then((name) => mainWindow.webContents.openDevTools())
      .catch((err) => console.log('An error occurred: ', err))
  }

  mainWindow.on('closed', () => {
    mainWindow = null
  })

  console.log('mainWindow opened')
}

app.on('ready', () => {
  electron.protocol.registerFileProtocol('local', (req, callback) => {
    callback(req.url.substr(8))
  }, (err) => {
    if (err)
      throw err
  })

  createDataFiles().then(() => {
    createWindow()
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
})
