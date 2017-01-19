import loadImage from 'blueimp-load-image'

const fs = require('fs')

module.exports = {
  readFile: (file, options = null) => {
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
  mkdir: (path, mode) => {
    return new Promise((resolve) => {
      fs.mkdir(path, mode, (err) => {
        if (err && err.code !== 'EEXIST')
          throw err
        resolve()
      })
    })
  },
  writeFile: (file, data) => {
    return new Promise((resolve, reject) => {
      fs.writeFile(file, data, (err) => {
        if (err)
          throw err
        resolve()
      })
    })
  },
  readdir: (dir) => {
    return new Promise((resolve) => {
      fs.readdir(dir, (err, files) => {
        if (err)
          throw err
        let ret = []
        files.forEach((f) => {
          if (f.indexOf('.') !== 0) {
            ret.push(f)
          }
        })
        resolve(ret)
      })
    })
  },
  readImageAndAutoOrient: (blob, dst) => {
    return new Promise((resolve) => {
      let loadingImage = loadImage(blob, (canvas) => {
        if (!canvas.toDataURL) {
          throw new Error('Failed to auto orient image')
        }
        let dataUrl = canvas.toDataURL()
        let buf = new Buffer(dataUrl.replace(/^data:image\/(png|gif|jpg|jpeg);base64,/, ''), 'base64')
        fs.writeFile(dst, buf, (err) => {
          if (err)
            throw err
          resolve()
        })
      }, {
        orientation: true
      })
    })
  }
}
