<template >
<div class="viewport prize-run">
  <div class="inner">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/start' }">开始</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/prize/overview' }">奖项概览</el-breadcrumb-item>
      <el-breadcrumb-item>开奖</el-breadcrumb-item>
    </el-breadcrumb>

    <section class="info">
      <h2 style="text-align: center;">
        <span class="gift-icon">🎁</span>
        {{ prize.name }}:
        <span style="margin-left: 10px;">{{ prize.giftName }}</span>
      </h2>
    </section>

    <section class="players">
      <div class="photos">
        <div class="img-wrap" v-for="player in players" v-bind:id="'iw-' + player.id">
          <img v-bind:src="'local://' + player.photoSrc">
        </div>
      </div>
    </section>

    <section class="tips clearfix">
      <span style="float: left;">按下 Space 暂停/继续</span>
      <span style="float: right;">按下 Enter 结束</span>
    </section>

    <el-dialog title="💐 抽奖结果" v-model="resultsVisible" custom-class="result" v-on:close="dialogClosed" v-bind:show-close="false" v-bind:close-on-click-modal="false" v-bind:close-on-press-escape="false">
      <h1>
        👏💐 恭喜
        🎁 <span style="font-size: 18px; color: #000;">{{ $route.query.name }}</span>
        得主
      </h1>
      <div class="img-wrap">
        <img v-bind:src="'local://' + player.photoSrc">
      </div>
      <h1 style="margin-top: 20px;"><span style="font-size: 18px; color: #000;">{{ showPlayerName ? player.name : '******' }}</span></h1>
      <div style="margin-top: 10px; text-align: center; font-size: 13px; color: #99A9BF;">
        {{ showPlayerName ? '按下 Enter 结束' : '按下 Enter 显示姓名' }}
      </div>
    </el-dialog>
    <audio id="bkgMp3" v-bind:src="bkgMp3Url"></audio>
    <audio id="cheeringMp3" v-bind:src="cheeringMp3Url"></audio>
  </div>
</div>
</template>

<script>
import Player from '../../model/Player'
import Prize from '../../model/Prize'
import 'animate.css/animate.min.css'
import $ from 'jquery'
import '../../lib/animate-css'
import {
  Loading
} from 'element-ui'

import bkgMp3 from '../../assets/multimedia/SUGAR.mp3'
import cheeringMp3 from '../../assets/multimedia/cheering.mp3'

export default {
  data() {
    return {
      players: [],
      id: 0,
      timer: 0,
      resultsVisible: false,
      player: {},
      prize: {},

      paused: false,
      lastElem: null,

      bkgMp3Url: bkgMp3,
      cheeringMp3Url: cheeringMp3,

      done: false,
      showPlayerName: false
    }
  },
  computed: {
    bkgMp3() {
      return document.getElementById('bkgMp3')
    },
    cheeringMp3() {
      return document.getElementById('cheeringMp3')
    }
  },
  mounted() {
    this.loadPrize().then(() => {
      this.registerKeyboard()
      this.run()
    })
  },
  beforeRouteLeave(to, from, next) {
    this.pause()
    this.unregisterKeyboard()
    next()
  },
  methods: {
    loadPrize() {
      return Prize.findByName(this.$route.query.name).then((prize) => {
        this.prize = prize
      })
    },
    loadPlayers() {
      Loading.service({
        fullscreen: true,
        text: '正在随机分配坐席'
      })

      return Player.loadRemainList().then((list) => {
        this.shuffle(list)
        this.players = list
        this.players.forEach((player) => {
          player.id = this.id++
        })

        return new Promise((resolve) => {
          setTimeout(() => {
            Loading.service({
              fullscreen: true
            }).close()
            this.$message.success('坐席已随机分配')
            resolve()
          }, 2000)
        })
      })
    },
    showAvatar(evt) {
      $(evt.target).show().animateCss('fadeIn')
    },
    shuffle(array) {
      let idx = array.length
      while (0 !== idx) {
        let rIdx = Math.floor(Math.random() * idx)
        idx -= 1

        let tmp = array[idx]
        array[idx] = array[rIdx]
        array[rIdx] = tmp
      }
    },
    run() {
      this.loadPlayers().then(() => {
        if (this.players.length === 0) {
          this.$message.warning('请设定参与人员')
          return
        }
        setTimeout(() => {
          this.$message.info('开始抽奖')
          this.resume()
        }, 1500)
      })
    },
    dialogClosed() {
      this.cheeringMp3.pause()
    },
    animatePhotos() {
      if (this.timer) {
        clearTimeout(this.timer)
      }
      if (this.paused) {
        return
      }

      let anima = () => {
        if (this.lastElem) {
          this.lastElem.hide()
        }
        let rId = Math.floor(Math.random() * this.players.length)
        this.lastElem = $(`#iw-${rId}`).fadeIn()
        if (!this.paused) {
          this.lastElem.animateCss('inOut').then((elem) => {
            elem.hide()
            this.timer = setTimeout(anima, 10)
          })
        }
      }
      anima()
    },
    stopAnimatePhotos() {
      if (this.timer) {
        clearTimeout(this.timer)
        this.timer = 0
      }
    },
    pause() {
      this.paused = true
      $('.gift-icon').removeClass('animated rubberBand')
      this.bkgMp3.pause()
      this.stopAnimatePhotos()
    },
    resume() {
      this.paused = false
      $('.gift-icon').addClass('animated rubberBand')
      this.bkgMp3.play()
      this.animatePhotos()
    },
    autoPause() {
      if (this.paused) {
        this.resume()
      } else {
        this.pause()
      }
    },
    keyboardHandler(evt) {
      if (evt.code === 'Space') {
        this.autoPause()
      } else if (evt.code === 'Enter') {
        if (this.paused && !this.done) {
          return
        }
        if (!this.done) {
          this.lottery()
        } else if (!this.showPlayerName) {
          this.showPlayerName = true
        } else {
          this.$router.back()
        }
      }
    },
    registerKeyboard() {
      document.addEventListener('keydown', this.keyboardHandler)
    },
    unregisterKeyboard() {
      document.removeEventListener('keydown', this.keyboardHandler)
    },
    lottery() {
      this.pause()

      let rId = Math.floor(Math.random() * this.players.length)
      if (this.lastElem) {
        this.lastElem.hide()
      }
      this.lastElem = $(`#iw-${rId}`).fadeIn()
      this.players.every((player) => {
        if (player.id === rId) {
          this.player = player
          return false
        }
        return true
      })

      Prize.findByName(this.$route.query.name).then((prize) => {
        prize.done = true
        prize.playerName = this.player.name
        return prize.save()
      }).then(() => {
        this.cheeringMp3.play()
        this.done = true
        this.resultsVisible = true
      }).catch((err) => {
        this.$message.error('错误: ' + err.message)
      })
    }
  }
}
</script>

<style>
.viewport.prize-run {
  width: 100vw;
  height: 100vh;
}

.viewport.prize-run .inner {
  width: 90vw;
  margin: 0 auto;
  padding: 20px 0;
}

.viewport.prize-run .info {
  margin: 35px 0;
  font-size: 14px;
}

.viewport.prize-run .players h2 {
  margin-bottom: 20px;
}

.viewport.prize-run .result h1 {
  font-size: 16px;
  text-align: center;
  margin-top: 10px;
}

.viewport.prize-run .result .img-wrap {
  display: block;
  margin: 0 auto;
  width: 35vh;
  height: 35vh;
  line-height: 35vh;
  border-radius: 35vh;
  margin-top: 20px;
  overflow: hidden;
  text-align: center;
  background-color: #dedede;
}

.viewport.prize-run .result .img-wrap img {
  width: 100%;
  vertical-align: middle;
}

.viewport.prize-run .result .btns {
  margin-top: 20px;
  text-align: center;
}

.viewport.prize-run .photos {
  width: 35vw;
  margin: 0 auto;
  height: 60vh;
  line-height: 60vh;
  border: 1px solid #ddd;
  position: relative;
  z-index: 100;
  overflow: hidden;
  text-align: center;
}

.viewport.prize-run .photos .img-wrap {
  display: none;
  height: 100%;
  width: 100%;
  line-height: 60vh;
}

@keyframes inOut {
  from {
    transform: translate3d(100%, 0, 0);
  }
  to {
    transform: translate3d(-100%, 0, 0);
  }
}

.viewport.prize-run .photos .img-wrap.inOut {
  animation-duration: .35s;
  animation-name: inOut;
}

.viewport.prize-run .photos img {
  width: 100%;
  vertical-align: middle;
}

.viewport.prize-run .tips {
  width: 35vw;
  margin: 0 auto;
  color: #8492A6;
  font-size: 14px;
  margin-top: 20px;
}

.viewport.prize-run .gift-icon {
  display: inline-block;
  animation-iteration-count: infinite;
}
</style>
