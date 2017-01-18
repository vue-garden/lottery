<template>
<section class="file-selector">
  <label>
    <div class="tips" v-show="file === null">
      <i class="el-icon-upload"></i>
      <div class="el-dragger__text">将图片拖到此处，或<em>点击选择</em></div>
    </div>
    <img v-bind:src="dataUrl !== '' ? 'local://' + dataUrl : ''" v-show="dataUrl !== ''">
    <input type="file" style="display: none;" v-on:change="changed($event)">
  </label>
  <ul class="el-upload__files" v-show="file">
    <li class="el-upload__file is-finished">
      <a class="el-upload__file__name">
        <i class="el-icon-document"></i>{{ file && file.name }}
      </a>
      <span class="el-upload__btn-delete" v-on:click="removeFile">删除</span>
    </li>
  </ul>
</section>
</template>

<script>
import fs from '../lib/fs'
import path from 'path'
import config from '../config'
import uuid from 'uuid/v4'

export default {
  props: {
    cbChanged: {
      type: Function,
      default: () => {}
    },
    cbRemoved: {
      type: Function,
      default: () => {}
    }
  },
  data() {
    return {
      file: null,
      dataUrl: '',
      inputElem: null
    }
  },
  methods: {
    changed(evt) {
      this.inputElem = evt.target
      this.file = evt.target.files[0]

      let dot = this.file.name.lastIndexOf('.')
      let ext = this.file.name.slice(dot + 1)
      let dst = path.join(config.photosDir, uuid() + '.' + ext)

      fs.readImageAndAutoOrient(this.file, dst).then(() => {
        this.dataUrl = dst

        let src = this.file.name
        this.cbChanged({
          src,
          dst
        })
      })
    },
    removeFile() {
      this.inputElem.value = ''
      this.dataUrl = ''
      this.file = null

      this.cbRemoved()
    }
  }
}
</script>

<style>
.file-selector {
  width: 100%;
}

.file-selector>label {
  border: 1px solid #bfcbd9;
  background-color: #fbfdff;
  border-radius: 4px;
  display: block;
  height: 180px;
  text-align: center;
  cursor: pointer;
}

.file-selector>label:hover {
  border-color: #20a0ff;
}

.file-selector>label img {
  width: 100%;
  height: 100%;
}

.file-selector>label i {
  font-size: 67px;
  color: #97a8be;
  margin: 46px 0 25px;
  line-height: 50px;
}

.file-selector>ul {
  margin-top: 15px;
}

.file-selector .el-upload__file a {
  margin-right: 55xpx;
}
</style>
