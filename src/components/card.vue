<template>
  <div class="cardModule_">
    <!-- 卡片头信息 -->
    <div class="cardTop">
      <img :src="cardVal.imgUrl">
      <span>{{cardVal.title}}</span>
    </div>
    <!-- 数据显示 -->
    <div class="cardVal">
      <div class="cardcen_">
        <div>
          <p v-for="(val,i) in cardVal.showVal" :key="i"  v-if="i < 3">
            {{val.title!=='' ? val.title+':'+val.val:''}}
          </p>
        </div>
        <div v-if="cardVal.showVal.length > 3">
          <p v-for="(val,i) in cardVal.showVal" :key="i" v-if="i >= 3">
            {{val.title!=='' ? val.title+':'+val.val:''}}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props:['cardVal'],
  data() {
    return {}
  },
  components: {}
}
</script>

<style lang='less'>
@import '../assets/less/common.less';
.cardModule_{
  width: 100%;
  height: 100%;
  background: #fff;
  position: relative;
  border-radius:10px;
  box-shadow: 0px 2px 5px #ccc;
}
.cardTop{
  width: 100%;
  height: 50px;
  padding: 10px 16px 6px 16px;
  box-sizing: border-box;
  border-bottom: 1px solid #ddd;
  display: flex;
  flex-direction:row;
  flex-flow:flex-start;
  align-items:center;
}
.cardTop>img{
  width: 30px;
  height: auto;
  margin-right: 15px;
}
.cardTop>span{
  font-size: 18px;
  font-family:PingFangSC-Regular;
  color:rgba(51,51,51,1);
  line-height:29px;
}
.cardVal{
  position: absolute;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  padding-top: 50px;
  left: 0;
  top: 0;
}
.cardcen_{
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  padding: 20px 20px;
  display: flex;
  flex-direction:row;
  flex-wrap:nowrap;
}
.cardcen_>div{
  margin-right: 15px;
}
.cardcen_>div>p{
  height: 40px;
  text-align: left;
  font-size:14px;
  font-family:PingFangSC-Regular;
  color:rgba(51,51,51,1);
  line-height:40px;
}
</style>
