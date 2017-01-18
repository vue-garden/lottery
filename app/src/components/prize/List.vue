<template>
<div class="viewport prize-list">
  <div class="inner">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/start' }">开始</el-breadcrumb-item>
      <el-breadcrumb-item>奖项列表</el-breadcrumb-item>
    </el-breadcrumb>

    <section class="tools">
      <el-button type="primary" size="small" v-on:click="selectDir">
        <i class="fa fa-folder-open"></i>
      </el-button>
      <el-button type="primary" icon="plus" size="small" v-on:click="$router.push({name: 'prize-add'})"></el-button>
    </section>

    <el-dialog title="导入中" v-model="importDialogVisible" v-bind:show-close="importDialogClosable" v-bind:close-on-click-modal="importDialogClosable" v-bind:close-on-press-escape="importDialogClosable">
      <div style="text-align: center;">
        <el-progress type="circle" v-bind:percentage="importProgress"></el-progress>
        <div v-show="importDone" style="margin-top: 10px;">
          <div style="color: #13CE66;">成功 {{ importResult.success }}</div>
          <div style="color: #FF4949;margin-top: 10px;">失败 {{ importResult.failed.length }}</div>
          <div v-for="f in importResult.failed" style="margin-top: 10px; color: #FF4949; word-wrap: break-word;">
            {{ f.file }} - {{ f.reason }}
          </div>
        </div>
      </div>
    </el-dialog>

    <el-table :data="tableData" border style="width: 100%">
      <el-table-column prop="name" label="名称">
      </el-table-column>
      <el-table-column prop="giftName" label="奖品">
      </el-table-column>
      <el-table-column label="图片">
        <template scope="scope">
          <img v-bind:src="'local://' + scope.row.giftPhotoSrc"  alt="">
</template>
      </el-table-column>
      <el-table-column prop="giftPrice" label="价格">
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
import Prize from '../../model/Prize'
import {
  remote
} from 'electron'

export default {
  data() {
    return {
      tableData: [],
      importDialogVisible: false,
      importDialogClosable: false,
      importDone: false,
      importProgress: 0,
      importResult: {
        success: 0,
        failed: []
      }
    }
  },
  mounted() {
    this.loadList()
  },
  methods: {
    loadList() {
      Prize.loadList().then((list) => {
        this.tableData = list
      })
    },
    deleteRow(name) {
      this.$confirm('确定删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        Prize.delete(name).then(() => {
          this.$message({
            type: 'success',
            message: '删除成功'
          })
          this.loadList()
        })
      }).catch(() => {

      })
    },
    selectDir() {
      remote.dialog.showOpenDialog({
        properties: ['openDirectory']
      }, (files) => {
        if (!files || files.length === 0) return

        this.importDialogVisible = true
        this.importDialogClosable = false
        this.importProgress = 0
        this.importDone = false
        Prize.importFromDir(files[0], (progress) => {
          this.importProgress = progress * 100
        }).then((result) => {
          this.importResult = result
          this.importDialogClosable = true
          this.importDone = true
          this.loadList()
        })
      })
    }
  }
}
</script>

<style>
.viewport.prize-list {
  width: 100vw;
  height: 100vh;
}

.viewport.prize-list .inner {
  width: 90vw;
  margin: 0 auto;
  padding: 20px 0;
}

.viewport.prize-list .tools {
  margin: 20px 0;
}

.viewport.prize-list>.inner>.el-table .el-table__body-wrapper {
  height: calc(100vh - 200px);
  overflow-x: hidden;
}

.viewport.prize-list .el-table img {
  width: 80px;
  height: 80px;
  vertical-align: middle;
  margin: 10px 0;
}

.viewport.prize-list .el-icon-delete {
  color: #8492a6;
  margin: 0 20px;
  font-size: 1.5em;
}
</style>
>
