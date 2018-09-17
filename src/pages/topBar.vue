<template>
  <div class="topBar_">
    <!-- 控制缩放按钮 -->
    <img class="sf_img" @click="zoomSwitch_" :src="sfVal ? require('../assets/img/small.png') : require('../assets/img/enlarge.png')" alt="">
    <!-- 退出按钮 -->
    <div class="exit_">
      <div class="exit_container" @click="exit">
        <img class="exit_img" src="../assets/img/exit.png" alt="">
        <span class="exit_span">退出</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props:['sfVal'],
  data() {
    return {    }
  },
  components: {    },
  mounted() {
    // var this_ = this;
    // window.crossDomain=crossDomainVal();
    // crossDomain.realTimeGet({
    //   key:['exitKey'],
    //   func:function(e){
    //     if(e[0]=='yes'){
    //       this_.$router.push({
    //         path:'/',
    //         query:{  }
    //       });
    //     };
    //   }
    // });
  },
  methods:{
    zoomSwitch_:function(){
      // 触发父级函数
      this.$emit('zoomSwitch_m');
    },
    // 
    exit:function(){
      // 删除
      this.$cookie.delCookie('userKey');

      this.$router.push({
        path:'/',
        query:{  }
      });

      // crossDomain.realTimeSet({
      //   key:'exitKey',
      //   value:'yes',
      // });	

      // setTimeout(function(){
      //   crossDomain.delCrossVal({key:'exitKey'});
      // },1000);
    },

  }
}
</script>

<style lang='less'>
@import '../assets/less/common.less';

.topBar_{
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  padding: 0.3rem;
  position: relative;
  border-bottom:2px solid rgba(236,236,248,1);
}
.exit_{
  width:70px;
  height:30px;
  border-radius:5px;
  border:1px solid @mainColor;
  position: absolute;
  top:50%;
  right: 0;
  transform: translate(-50%, -50%);
}
.exit_container{
  width: 100%;
  height: 100%;
  position: relative;
}
.exit_img{
  height: 70%;
  width: auto;
  position: absolute;
  left: 5%;
  top:50%;
  transform: translate(0, -50%);
}
.exit_span{
  font-size: 16px;
  font-family:PingFangSC-Regular;
  color:@mainColor;
  position: absolute;
  right: 10%;
  top:50%;
  transform: translate(0, -50%);
}
.sf_img{
  width: 18px;
  height: auto;
  position: absolute;
  top:50%;
  left:0;
  transform: translate(50%, -50%);
}

</style>
