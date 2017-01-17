<template>
<div class="viewport player-list">
  <div class="inner">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/start' }">开始</el-breadcrumb-item>
      <el-breadcrumb-item>参与者列表</el-breadcrumb-item>
    </el-breadcrumb>

    <section class="tools">
      <el-row>
        <el-col :span="6">
          <el-input placeholder="请输入姓名" icon="search" v-model="searchName" :on-icon-click="handleIconClick">
          </el-input>
        </el-col>
        <el-col :span="6" :offset="12" class="add-btn-wrap">
          <el-button type="primary" icon="plus" size="small" v-on:click="$router.push({name: 'player-add'})"></el-button>
        </el-col>
      </el-row>
    </section>

    <el-table :data="tableData" border style="width: 100%">
      <el-table-column prop="name" label="姓名">
      </el-table-column>
      <el-table-column label="照片">
        <template scope="scope">
          <img v-bind:src="'local://' + scope.row.photoSrc"  alt="">
</template>
      </el-table-column>
      <el-table-column label="操作" width="120">
        <template scope="scope">
<el-button @click.native.prevent="deleteRow(scope.row.name)" type="text">
  <i class="el-icon-delete"></i>
</el-button>
</template>
      </el-table-column>
    </el-table>
  </div>
</div>
</template>

<script>
import Player from '../../model/Player'

export default {
  data() {
    return {
      searchName: '',
      tableData: []
    }
  },
  mounted() {
    this.loadList()
  },
  methods: {
    loadList() {
      Player.loadList().then((list) => {
        this.tableData = list
      })
    },
    handleIconClick() {
      Player.loadList().then((list) => {
        if (this.searchName !== '') {
          let ret = []
          list.forEach((player) => {
            if (player.name.indexOf(this.searchName) !== -1) {
              ret.push(player)
            }
          })
          this.tableData = ret
        } else {
          this.tableData = list
        }
      })
    },
    deleteRow(name) {
      this.$confirm('确定删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        Player.delete(name).then(() => {
          this.$message({
            type: 'success',
            message: '删除成功'
          })
          this.loadList()
        })
      }).catch(() => {

      })
    }
  }
}
</script>

<style>
.viewport.player-list {
  width: 100vw;
  height: 100vh;
}

.viewport.player-list .inner {
  width: 90vw;
  margin: 0 auto;
  padding: 20px 0;
}

.viewport.player-list .tools {
  margin: 20px 0;
}

.viewport.player-list>.inner>.el-table .el-table__body-wrapper {
  height: calc(100vh - 200px);
  overflow-x: hidden;
}

.viewport.player-list .add-btn-wrap {
  height: 36px;
  line-height: 36px;
  text-align: right;
}

.viewport.player-list .el-table img {
  width: 80px;
  height: 80px;
  vertical-align: middle;
  margin: 10px 0;
}

.viewport.player-list .el-icon-delete {
  color: #8492a6;
  margin: 0 20px;
  font-size: 1.5em;
}
</style>
