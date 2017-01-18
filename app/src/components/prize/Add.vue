<template>
<div class="viewport prize-add">
  <div class="inner">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ name: 'start' }">开始</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ name: 'prize-list' }">奖项列表</el-breadcrumb-item>
      <el-breadcrumb-item>添加奖项</el-breadcrumb-item>
    </el-breadcrumb>

    <el-form ref="form" :model="form" label-width="80px" label-position="left">
      <el-form-item label="奖项名称">
        <el-input v-model.trim="form.name"></el-input>
      </el-form-item>
      <el-form-item label="奖品名称">
        <el-input v-model.trim="form.giftName"></el-input>
      </el-form-item>
      <el-form-item label="奖品图片">
        <file-selector :cbChanged="fileChanged" :cbRemoved="fileRemoved"></file-selector>
      </el-form-item>
      <el-form-item label="奖品价格">
        <el-input v-model.number="form.giftPrice"></el-input>
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
import Prize from '../../model/Prize'
import FileSelector from '../FileSelector'

export default {
  data() {
    return {
      form: {
        name: '',
        giftName: '',
        giftPrice: 0,
        giftPhotoSrc: ''
      }
    }
  },
  methods: {
    fileChanged(result) {
      this.form.giftPhotoSrc = result.dst
    },
    fileRemoved() {
      this.form.giftPhotoSrc = ''
    },
    save() {
      if (this.form.name === '') {
        this.$message.error('请输入奖项名称')
        return
      }
      if (this.form.giftName === '') {
        this.$message.error('请输入奖品名称')
        return
      }
      if (this.form.giftPhotoSrc === '') {
        this.$message.error('请选择奖品图片')
        return
      }
      this.form.giftPrice = parseFloat(this.form.giftPrice)
      this.form.giftPrice = isNaN(this.form.giftPrice) ? 0 : this.form.giftPrice
      if (this.form.giftPrice <= 0) {
        this.$message.error('请输入奖品价格')
        return
      }

      Prize.add(this.form).then(() => {
        this.$message({
          message: '操作成功',
          type: 'success',
          onClose: () => {
            this.$router.back()
          }
        })
      }, (err) => {
        this.$message.error('操作失败: ' + err.message)
      }).catch((err) => {
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
.viewport.prize-add {
  width: 100vw;
  height: 100vh;
}

.viewport.prize-add .inner {
  width: 90vw;
  margin: 0 auto;
  padding: 20px 0;
}

.viewport.prize-add .el-form {
  width: 60vw;
  margin-top: 50px;
}

.viewport.prize-add .el-icon-upload {
  font-family: FontAwesome!important;
}

.viewport.prize-add .el-icon-upload:before {
  content: "\f1c5"
}

.viewport.prize-add .el-upload,
.viewport.prize-add .el-dragger {
  width: 100%;
}
</style>

  width: 100%;
}
</style>
