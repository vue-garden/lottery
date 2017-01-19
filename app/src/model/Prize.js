import electron from 'electron'
import path from 'path'
import fs from '../lib/fs'
import config from '../config'
import uuid from 'uuid/v4'
import mime from 'mime'

let list = null

export default class Prize {
  name = ''
  giftName = ''
  giftPrice = 0
  giftPhotoSrc = ''
  done = false
  playerName = ''

  static fromDict(dict) {
    let ret = new Prize()
    ret.name = dict.name
    ret.giftName = dict.giftName
    ret.giftPrice = dict.giftPrice
    ret.giftPhotoSrc = dict.giftPhotoSrc
    ret.done = dict.done
    ret.playerName = dict.playerName
    return ret
  }

  static async findByName(name) {
    let list = await this.loadList()
    let ret = null
    list.every((prize) => {
      if (name === prize.name) {
        ret = prize
        return false
      }
      return true
    })
    if (ret) {
      return ret
    } else {
      throw new Error('人员不存在')
    }
  }

  static async loadList() {
    if (list === null) {
      list = []
      let data = await fs.readFile(config.prizesJSONFile, 'utf8')
      JSON.parse(data).forEach((row) => {
        list.push(Prize.fromDict(row))
      })
    }
    return list
  }

  static async isNameExist(name) {
    let list = await this.loadList()
    let ret = false
    list.every((prize) => {
      if (prize.name === name) {
        ret = true
        return false
      }
      return true
    })
    return ret
  }

  static async add(json) {
    let isNameExist = await this.isNameExist(json.name)
    if (isNameExist) {
      throw new Error('奖项名称已存在')
    } else {
      if (json.giftPhotoDataUrl) {
        json.giftPhotoSrc = await Prize.savePhoto(json.giftPhotoDataUrl, json.giftPhotoExt)
      }
      let prizes = await this.loadList()
      prizes.push(Prize.fromDict(json))
      list = prizes
      await this.sync()
    }
  }

  static async delete(name) {
    let prizes = await this.loadList()
    let ret = []
    prizes.forEach((prize) => {
      if (prize.name !== name) {
        ret.push(prize)
      }
    })
    list = ret
    await this.sync()
  }

  static async deleteAll() {
    list = []
    await this.sync()
  }

  static async sync() {
    await fs.writeFile(config.prizesJSONFile, JSON.stringify(list, null, 4))
  }

  static async savePhoto(dataUrl, ext) {
    let buf = new Buffer(dataUrl.replace(/^data:image\/(png|gif|jpg|jpeg);base64,/, ''), 'base64')
    let filePath = path.join(config.photosDir, uuid() + '.' + ext)
    await fs.writeFile(filePath, buf)
    return filePath
  }

  async save() {
    await Prize.sync()
  }

  static async importFromDir(dir, cbProgress) {
    let files = await fs.readdir(dir)
    let ret = {
      success: 0,
      failed: []
    }
    for (let i = 0, len = files.length; i < len; i++) {
      let file = path.join(dir, files[i])
      try {
        let parsed = path.parse(file)

        let outPath = path.join(config.photosDir, uuid() + parsed.ext)

        let b = await fs.readFile(file)
        let ab = b.buffer.slice(b.byteOffset, b.byteOffset + b.byteLength)
        let m = mime.lookup(file)
        if (m === 'application/octet-stream') {
          throw new Error('Unsupported image type')
        }
        let blob = new Blob([ab], {
          type: m
        })
        await fs.readImageAndAutoOrient(blob, outPath)

        let [prizeName, giftName, giftPrice] = parsed.name.split('@')
        if (!giftName) {
          throw new Error('缺少礼品名称')
        }
        if (!giftPrice) {
          throw new Error('缺少礼品价格')
        }

        let prize = this.fromDict({
          name: prizeName,
          giftName,
          giftPrice,
          giftPhotoSrc: outPath
        })
        await this.add(prize)
        ret.success++
      } catch (err) {
        ret.failed.push({
          file: files[i],
          reason: err.message
        })
      }
      cbProgress && cbProgress((i + 1) / len)
    }
    cbProgress && cbProgress(1)
    return ret
  }
}
