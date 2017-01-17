<template>
<section class="viewport menu">
  <div class="inner">
    <div>
      <el-button type="primary" icon="fa-gift" v-on:click="$router.push({name: 'prize-list'})">设定奖项</el-button>
    </div>
    <div>
      <el-button type="primary" icon="fa-users" v-on:click="$router.push({name: 'player-list'})">管理人员</el-button>
    </div>
    <div>
      <el-button type="primary" icon="fa-play" v-on:click="$router.push({name: 'prize-overview'})">开始抽奖</el-button>
    </div>
  </div>
</section>
</template>

<script>
export default {
  data() {
    return {

    }
  }
}
</script>

<style>
.viewport.menu {
  width: 100vw;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
}

.viewport.menu>.inner>div {
  margin-bottom: 28px;
  text-align: center;
}

.viewport.menu button {
  width: 109px;
}

.viewport.menu button>* {
  vertical-align: middle;
}

.viewport.menu button>i {
  font-size: 14px;
}

.viewport.menu .el-icon-fa-gift {
  font-size: 18px;
}
</style>
