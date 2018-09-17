<template>
  <div class="contentBar"  align="center">
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  data() {
    return {  }
  }
}
</script>

<style lang='less'>
@import '../assets/less/common.less';
.contentBar{
  width: 100%;
  height: 100%;
  min-height: 100%;
  box-sizing: border-box;
  padding: 20px 0;
}
</style>
