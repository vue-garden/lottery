<template>
<div>
  <router-view></router-view>
</div>
</template>

<script>
import store from 'src/vuex/store'
import 'font-awesome/css/font-awesome.min.css'

export default {
  store
}
</script>

<style>
* {
  margin: 0;
  padding: 0;
}

html,
body {
  height: 100%;
  overflow-x: hidden;
}

body {
  background: radial-gradient( ellipse at center, rgba(255, 255, 255, 1) 0%, rgba(229, 229, 229, .85) 100%);
  background-position: center;
  font-family: "Helvetica Neue", Helvetica, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "微软雅黑", Arial, sans-serif;
}

[class^="el-icon-fa"],
[class*=" el-icon-fa"] {
  display: inline-block;
  font-family: FontAwesome!important;
  font-size: inherit;
  text-rendering: auto;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.el-icon-fa-gift:before {
  content: "\f06b";
}

.el-icon-fa-users:before {
  content: "\f0c0";
}

.el-icon-fa-play:before {
  content: "\f04b";
}

.clearfix:before,
.clearfix:after {
  display: table;
  content: "";
}

.clearfix:after {
  clear: both
}

.button {
  padding: 0;
  float: right;
}
</style>
