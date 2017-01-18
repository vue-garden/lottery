import electron from 'electron'
import path from 'path'
import fs from '../lib/fs'
import config from '../config'
import uuid from 'uuid/v4'
import Prize from './Prize'

let list = null

export default class Player {
  name = ''
  photoSrc = ''

  static fromDict(dict) {
    let ret = new Player()
    ret.name = dict.name
    ret.photoSrc = dict.photoSrc
    return ret
  }

  static async loadList() {
    if (list === null) {
      list = []
      let data = await fs.readFile(config.playersJSONFile, 'utf8')
      JSON.parse(data).forEach((row) => {
        list.push(Player.fromDict(row))
      })
    }
    return list
  }

  static async loadRemainList() {
    let prizes = await Prize.loadList()
    let names = []
    prizes.forEach((prize) => {
      if (prize.playerName) {
        names.push(prize.playerName)
      }
    })
    let list = await this.loadList()
    let ret = []
    list.forEach((player) => {
      if (names.indexOf(player.name) === -1) {
        ret.push(player)
      }
    })
    return ret
  }

  static async isNameExist(name) {
    let list = await this.loadList()
    let ret = false
    list.every((player) => {
      if (player.name === name) {
        ret = true
        return false
      }
      return true
    })
    return ret
  }

  static async add(name, photoSrc) {
    let isNameExist = await this.isNameExist(name)
    if (isNameExist) {
      throw new Error('姓名已存在')
    } else {
      let players = await this.loadList()
      players.push(Player.fromDict({
        name,
        photoSrc
      }))
      list = players
      await this.sync()
    }
  }

  static async delete(name) {
    let players = await this.loadList()
    let ret = []
    players.forEach((player) => {
      if (player.name !== name) {
        ret.push(player)
      }
    })
    list = ret
    await this.sync()
  }

  static async sync() {
    await fs.writeFile(config.playersJSONFile, JSON.stringify(list, null, 4))
  }

  static async savePhoto(dataUrl, ext) {
    let buf = new Buffer(dataUrl.replace(/^data:image\/(png|gif|jpg|jpeg);base64,/, ''), 'base64')
    let filePath = path.join(config.photosDir, uuid() + '.' + ext)
    await fs.writeFile(filePath, buf)
    return filePath
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
        let fileData = await fs.readFile(file)
        let parsed = path.parse(file)

        let outPath = path.join(config.photosDir, uuid() + parsed.ext)
        await fs.writeFile(outPath, fileData)

        await this.add(parsed.name, outPath)
        ret.success++
      } catch (err) {
        ret.failed.push({
          file: files[i],
          reason: err.message
        })
      }
      if (cbProgress) {
        cbProgress((i + 1) / len)
      }
    }
    if (cbProgress) {
      cbProgress(1)
    }
    return ret
  }
}
