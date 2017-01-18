const fs = require('fs')
const gm = require('gm').subClass({
  imageMagick: true
})

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
    return new Promise((resove, reject) => {
      fs.writeFile(file, data, (err) => {
        if (err)
          throw err
        resove()
      })
    })
  },
  readdir: (dir) => {
    return new Promise((resolve) => {
      fs.readdir(dir, (err, files) => {
        if (err)
          throw err
        resolve(files)
      })
    })
  },
  readImageAndAutoOrient: (src, dst) => {
    return new Promise((resolve) => {
      gm(src).autoOrient().write(dst, (err) => {
        if (err)
          throw err
        resolve()
      })
    })
  }
}
