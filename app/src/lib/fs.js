const fs = require('fs')

module.exports = {
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
