<template>
<div class="viewport player-add">
  <div class="inner">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ name: 'start' }">开始</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ name: 'player-list' }">参与者列表</el-breadcrumb-item>
      <el-breadcrumb-item>添加参与者</el-breadcrumb-item>
    </el-breadcrumb>

    <el-form ref="form" :model="form" label-width="80px" label-position="left">
      <el-form-item label="姓名">
        <el-input v-model.trim="form.name"></el-input>
      </el-form-item>
      <el-form-item label="照片">
        <file-selector :cbChanged="fileChanged" :cbRemoved="fileRemoved"></file-selector>
      </el-form-item>
      <el-form-item>
        <el-button v-on:click="$router.back()">取消</el-button>
        <el-button type="primary" v-on:click="save">确定</el-button>
      </el-form-item>
    </el-form>
  </div>
</div>
</template>

<script>
import Player from '../../model/Player'
import FileSelector from '../FileSelector'

export default {
  data() {
    return {
      form: {
        name: '',
        photoSrc: ''
      }
    }
  },
  methods: {
    processImg(file) {
      console.log(file)
      return false
    },
    fileChanged(result) {
      this.form.photoSrc = result.dst
    },
    fileRemoved() {
      this.form.photoSrc = ''
    },
    save() {
      if (this.form.name === '') {
        this.$message.error('请输入姓名')
        return
      }
      if (this.form.photoSrc === '') {
        this.$message.error('请选择照片')
        return
      }

      Player.add(this.form.name, this.form.photoSrc).then(() => {
        this.$message({
          message: '操作成功',
          type: 'success',
          onClose: () => {
            this.$router.back()
          }
        })
      }, (err) => {
        this.$message.error('操作失败: ' + err.message)
      })
    }
  },
  components: {
    FileSelector
  }
}
</script>

<style>
.viewport.player-add {
  width: 100vw;
  height: 100vh;
}

.viewport.player-add .inner {
  width: 90vw;
  margin: 0 auto;
  padding: 20px 0;
}

.viewport.player-add .el-form {
  width: 60vw;
  margin-top: 50px;
}

.viewport.player-add .el-icon-upload {
  font-family: FontAwesome!important;
}

.viewport.player-add .el-icon-upload:before {
  content: "\f1c5"
}

.viewport.player-add .el-upload,
.viewport.player-add .el-dragger {
  width: 100%;
}
</style>
