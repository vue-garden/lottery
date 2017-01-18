<template>
<div class="viewport prize-overview">
  <div class="inner">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/start' }">开始</el-breadcrumb-item>
      <el-breadcrumb-item>奖项概览</el-breadcrumb-item>
    </el-breadcrumb>

    <section class="prizes">
      <el-row :gutter="35" type="flex" class="row-bg" justify="space-between" v-for="(row, idx) in rows">
        <el-col :span="7" v-for="col in row">
          <el-card class="box-card">
            <div class="img-wrap">
              <img v-bind:src="'local://' + col.giftPhotoSrc" alt="">
            </div>
            <div class="info">
              <el-row type="flex" class="row-bg" justify="space-between">
                <el-col :span="11">
                  {{ col.name }}
                </el-col>
                <el-col :span="11">
                  {{ col.giftName }}
                </el-col>
              </el-row>
              <el-row type="flex" class="row-bg" justify="space-between" v-show="!col.done">
                <el-col :span="11">
                  <span style="color: #999;">待开奖</span>
                </el-col>
                <el-col :span="11">
                  <el-button type="primary" size="small" v-on:click="run(col.name)">开始</el-button>
                </el-col>
              </el-row>
              <el-row type="flex" class="row-bg" justify="space-between" v-show="col.done">
                <el-col :span="11">
                  中奖者
                </el-col>
                <el-col :span="11">
                  {{ col.playerName }}
                </el-col>
              </el-row>
              <el-row type="flex" justify="end" v-show="col.done">
                <el-col :span="11">
                  <el-button type="danger" size="small" v-on:click="reset(col.name)">重置奖项</el-button>
                </el-col>
              </el-row>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </section>
  </div>
</div>
</template>

<script>
import Prize from '../../model/Prize'

export default {
  data() {
    return {
      rows: []
    }
  },
  mounted() {
    this.loadList()
  },
  methods: {
    loadList() {
      let rows = []
      let row = []
      Prize.loadList().then((list) => {
        if (list.length === 0) {
          this.$message.warning('请先设置奖项')
          return
        }
        list.forEach((prize) => {
          if (row.length < 3) {
            row.push(prize)
          } else {
            rows.push(row)
            row = [prize]
          }
        })
        if (row.length) {
          rows.push(row)
        }
        this.rows = rows
      })
    },
    run(name) {
      this.$router.push({
        name: 'prize-run',
        query: {
          name
        }
      })
    },
    reset(name) {
      this.$confirm('重置奖项将会清空上次的中奖结果，上次中奖者将可以参与下次抽奖, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        Prize.findByName(name).then((prize) => {
          prize.playerName = ''
          prize.done = false
          return prize.save()
        }).then(() => {
          return this.loadList()
        }).catch((err) => {
          this.$message.error('错误: ' + err.message)
        })
      }).catch(() => {})
    }
  }
}
</script>

<style>
.viewport.prize-overview {
  width: 100vw;
  height: 100vh;
}

.viewport.prize-overview .inner {
  width: 90vw;
  margin: 0 auto;
  padding: 20px 0;
}

.viewport.prize-overview .prizes {
  margin-top: 50px;
}

.viewport.prize-overview .el-card {
  cursor: pointer;
}

.viewport.prize-overview .el-card img {
  height: 100%;
}

.viewport.prize-overview .el-card .img-wrap {
  height: 20vh;
  overflow: hidden;
  text-align: center;
}

.viewport.prize-overview .el-row {
  margin-bottom: 35px;
  &:last-child {
    margin-bottom: 0;
  }
}

.viewport.prize-overview .el-card .bottom {
  color: #999;
  font-size: 13px;
}

.viewport.prize-overview .el-card .el-col:last-child {
  text-align: right;
}

.viewport.prize-overview .info {
  margin-top: 20px;
  font-size: 14px;
}

.viewport.prize-overview .info .el-row {
  margin-top: 15px;
  margin-bottom: 0;
}
</style>
