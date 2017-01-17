<template >
<div class="viewport prize-run">
  <div class="inner">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/start' }">开始</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/prize/overview' }">奖项概览</el-breadcrumb-item>
      <el-breadcrumb-item>开奖</el-breadcrumb-item>
    </el-breadcrumb>

    <section class="info">
      <h2>🎁 {{ prize.name }}: <span style="margin-left: 10px;">{{ prize.giftName }}</span></h2>
    </section>

    <section class="players">
      <h2>参与者:</h2>
      <el-row :gutter="10" type="flex" justify="space-between" v-for="(row, idx) in rows">
        <el-col :span="2" v-for="col in row">
          <img v-bind:src="'local://' + col.photoSrc" v-bind:id="'p-' + col.id" v-bind:title="col.name" v-on:load="showAvatar($event)">
        </el-col>
      </el-row>
    </section>

    <el-dialog title="💐 抽奖结果" v-model="resultsVisible" custom-class="result" v-on:close="dialogClosed" v-bind:show-close="false" v-bind:close-on-click-modal="false" v-bind:close-on-press-escape="false">
      <h1>
        👏💐 恭喜
        🎁 <span style="font-size: 18px; color: #000;">{{ $route.query.name }}</span>
        得主
      </h1>
      <h1><span style="font-size: 18px; color: #000;">{{ player.name }}</span></h1>
      <div class="img-wrap">
        <img v-bind:src="'local://' + player.photoSrc">
      </div>
      <div class="btns">
        <el-button type="success" v-on:click="$router.back()">完成</el-button>
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

import bkgMp3 from '../../assets/multimedia/soda_pop.mp3'
import cheeringMp3 from '../../assets/multimedia/cheering.mp3'

export default {
  data() {
    return {
      players: [],
      rows: [],
      id: 0,
      timer: 0,
      resultsVisible: false,
      player: {},
      prize: {},

      bkgMp3Url: bkgMp3,
      cheeringMp3Url: cheeringMp3
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
      console.log(1)
      this.run()
    })
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

      let row = []
      return Player.loadRemainList().then((list) => {
        this.shuffle(list)
        this.players = list
        let rows = []
        list.forEach((player) => {
          player.id = this.id

          if (row.length < 12) {
            row.push(player)
          } else {
            rows.push(row)
            row = [player]
          }

          this.id++
        })
        if (row.length) {
          rows.push(row)
        }

        return new Promise((resolve) => {
          setTimeout(() => {
            Loading.service({
              fullscreen: true
            }).close()
            this.$message.success('坐席已随机分配')
            this.$set(this, 'rows', rows)
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
    random(min, max) {
      return Math.random() * (max - min) + min
    },
    lottery() {
      let len = this.players.length
      let loop = Math.floor(len * this.random(1.5, 3))

      return new Promise((resolve) => {
        let anima = () => {
          if (loop) {
            let rId = Math.floor(Math.random() * len)
            $(`#p-${rId}`).animateCss('rubberBand').then(() => {
              loop--
              setTimeout(anima, 100)
            })
          } else {
            resolve()
          }
        }

        anima()
      })
    },
    run() {
      this.loadPlayers().then(() => {
        if (this.players.length === 0) {
          this.$message.warning('请设定参与人员')
          return
        }
        setTimeout(() => {
          this.$message.info('开始抽奖')
          this.bkgMp3.play()

          this.lottery().then(() => {
            let rId = Math.floor(Math.random() * this.players.length)
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
            }).catch((err) => {
              this.$message.error('错误: ' + err.message)
            }).then(() => {
              this.bkgMp3.pause()
              this.cheeringMp3.play()
              this.resultsVisible = true
            })
          })
        }, 1500)
      })
    },
    dialogClosed() {
      this.cheeringMp3.pause()
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

.viewport.prize-run .players .el-col>img {
  display: none;
  width: 3em;
  height: 3em;
  border-radius: 50%;
  cursor: pointer;
  animation-duration: 0.8s;
}

.viewport.prize-run .players .el-col>img:hover {
  animation-name: pulse;
}

@keyframes pulse {
  from {
    -webkit-transform: scale3d(1, 1, 1);
    transform: scale3d(1, 1, 1);
  }
  50% {
    -webkit-transform: scale3d(1.1, 1.1, 1.1);
    transform: scale3d(1.1, 1.1, 1.1);
  }
  to {
    -webkit-transform: scale3d(1, 1, 1);
    transform: scale3d(1, 1, 1);
  }
}

.viewport.prize-run .players .el-col>img.fadeIn {
  animation-duration: 1.35s;
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
  width: 30vw;
  height: 30vw;
  line-height: 30vw;
  border-radius: 30vw;
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
</style>
