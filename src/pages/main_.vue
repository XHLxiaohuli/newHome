<template>
  <div class="main_">
    <!-- 左边导航 -->
    <div class="left_navigation">
      <Navigation
        ref="navigationModule" 
        @shrinkageFun='shrinkage'
      />
    </div>
    <!-- 右上>头部导航 -->
    <div class="rightTop_navigation">
      <Topbar
        @zoomSwitch_m="zoomSwitch_m"
        :sfVal="sf_"
      />
    </div>
    <!-- 右下>主内容容器 -->
    <div class="rightBottom_navigation">
      <Content/>
    </div>
  </div>
</template>

<script>
import Navigation from './navigationBar'
import Topbar from './topBar'
import Content from './contentBar'

export default {
  data() {
    return {  sf_:true  }
  },
  components: {  Navigation,  Topbar,  Content  },
  beforeCreate(){
    var this_ = this;
    // 创建全局Iticket
    window.Iticket = this.$cookie.getCookie('userKey');
    // 创建全局获取Iticket函数
    window.getIticket = function(function_){
      if(this_.$cookie.getCookie('userKey')==null){
        alert('请先登入账号')
        this_.$router.push({path:'/'});
      }else{
        function_(Iticket);
      }
    };
    // 判断登入状态
    if(Iticket==null){
      alert('请先登入账号')
      this.$router.push({path:'/'});
    };
  },
  methods:{
    // 切换导航搜索
    zoomSwitch_m:function(){
      this.$refs.navigationModule.zoomSwitch();
    },
    // 控制导航栏缩放时布局比例
    shrinkage:function(bool_){
      if(bool_){
        this.sf_ = true;
        $('.left_navigation').css({width:'160px'});
        $('.rightTop_navigation').css({paddingLeft:'160px'});
        $('.rightBottom_navigation').css({paddingLeft:'160px'});
      }else{
        this.sf_ = false;
        $('.left_navigation').css({width:'80px'});
        $('.rightTop_navigation').css({paddingLeft:'80px'});
        $('.rightBottom_navigation').css({paddingLeft:'80px'});
      }
    },
    
  }
}
</script>

<style lang='less'>
@import '../assets/less/common.less';
.main_{
  width: 100%;
  height: 100%;
  position: relative;
}
.left_navigation{
  width: 160px;
  height: 100%;
  box-sizing: border-box;
  background: #fff;
  position: absolute;
  top: 0;
  left: 0;
  overflow: hidden;
  z-index: 999;
}
.rightTop_navigation{
  width: 100%;
  height: 60px;
  box-sizing: border-box;
  background: #fff;
  padding-left:160px; 
  position: absolute;
  top: 0;
  right: 0;
  overflow: auto;
  z-index: 888;
}
.rightBottom_navigation{
  width: 100%;
  height: 100%;
  background:rgba(250,251,253,1);
  box-sizing: border-box;
  padding-left:160px; 
  padding-top:60px; 
  position: absolute;
  bottom: 0;
  right: 0;
  overflow: auto;
}
/*公共按钮*/
.exit_btn{
  width: auto;
  height:32px;
  white-space : nowrap;
  border-radius:5px;
  background:@mainColor;
  font-size: 10px;
  font-family:PingFangSC-Regular;
  color:#fff;
  margin-right: 20px;
  cursor:pointer;
  margin: 0;
  padding: 0;
  border: 0;  //自定义边框
  outline: none;    //消除默认点击蓝色边框效果
  box-sizing: border-box;
  padding: 0 10px;
}

</style>
