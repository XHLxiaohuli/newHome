<template>
  <div class="navigationBar_" align="center">
    <!-- LOGO -->
    <div class="LOGO_container">
      <div class="buju_container">
        <img src="../assets/img/Logo.png" class="LOGO_img" alt="">
        <!-- <img src="../../static/img/Logo.png" class="LOGO_img" alt=""> -->
        <p class="id_name">{{name}}</p>
      </div>
    </div>
    <!-- 导航 -->
    <div class="navigationArea">
      <div class="navigationScreen">
        <!-- no1级列表 -->
        <ul>
          <li class="a_single" v-for="(val,i) in navigationVal_" :key="i" v-if="val.title == '首页' || val.children.length > 0">
            <p class="selectView" :rouTer="val.router_">
              <img class="selectView_img" :src="val.n_img" :Yimg="val.y_img" :Nimg="val.n_img" alt="">
              <span class="selectView_span no_xuanz">{{val.title}}</span>
            </p>
            <div></div>
            <!-- no2级列表 -->
            <ul class="children_select" viewBool='false'>
              <li class="a_single_min" v-for="(value_,index) in val.children" :key="index" v-if="value_.bool">
                <p class="selectView_min" :rouTer="value_.router_">
                  <span class="selectView_span_min no_xuanz">{{value_.title}}</span>
                </p>
                <div></div>
              </li>
            </ul>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 控制导航缩放参数
      bool_:true,
      // navigationVal_:this.navigationFun(['soundRecording',' ','wechatList','wechatGrous','friendsList','friendsGrous','serviceList','serviceGroup','allocation','distribution','equipmentList','equipmentGrous','sensitiveSet','sensitiveGrous','sensitiveOperations','repeatFriends','wechatFinancial','department','account','management','addFriends','hairFriends_f','hairFriends','shallowRaise','recordNumber','dustZombies','updateLog','operationRecords']),
      navigationVal_:[],
      name:''
    }
  },
  created() {
    var this_=this;
    indexedDBopt.getData('userData','userVal',function(data){
      if(data && data!=undefined){   
        // 获取当前登入用户名
        this_.name = data.val.name;
      }
    });
    // 获取导航数组
    indexedDBopt.getData('userData','navArr',function(data){
      if(data && data!=undefined){   
        data.val.push('soundRecording');
        // 导航菜单分配
        this_.navigationVal_ = this_.navigationFun(data.val);
      }
    });
  },
  mounted() {
    // 初始化打开页面时路由对应选项
    this.corresponding();
    // 初始设置导航的点击事件
    this.clickOptions();
  },
  updated(){
    // 初始化打开页面时路由对应选项
    this.corresponding();
    // 初始设置导航的点击事件
    this.clickOptions();
  },
  methods:{
    // 导航栏菜单分配函数
    navigationFun:function(distriArr){
      var navigaArr = [
        {
          title:'录音管理',
          y_img:require('../assets/img/icon_kefu2.png'),
          n_img:require('../assets/img/icon_kefu.png'),
          //router_:'/main/soundRecording',
          router_:'',
          children:[]
        },
        {
          title:'微信管理',
          y_img:require('../assets/img/图层02.png'),
          n_img:require('../assets/img/icon_wechat.png'),   
          router_:'',
          children:[]
        },
        {
          title:'客户管理',
          y_img:require('../assets/img/客户 选中.png'),
          n_img:require('../assets/img/客户管理.png'),
          router_:'',
          children:[]
        },
        {
          title:'客服管理',
          y_img:require('../assets/img/icon_kefu2.png'),
          n_img:require('../assets/img/icon_kefu.png'),
          router_:'',
          children:[]
        },
        {
          title:'设备管理',
          y_img:require('../assets/img/icon_device2.png'),
          n_img:require('../assets/img/icon_device.png'),
          router_:'',
          children:[]
        },
        {
          title:'微信风控',
          y_img:require('../assets/img/icon_ctrl2.png'),
          n_img:require('../assets/img/icon_ctrl.png'),
          router_:'',
          children:[]
        },
        {
          title:'用户管理',
          y_img:require('../assets/img/icon_user2.png'),
          n_img:require('../assets/img/icon_user.png'),
          router_:'',
          children:[]
        },
        {
          title:'辅助营销',
          y_img:require('../assets/img/icon_sale2.png'),
          n_img:require('../assets/img/icon_sale.png'),
          router_:'',
          children:[]
        },
        {
          title:'其他设置',
          y_img:require('../assets/img/icon_set2.png'),
          n_img:require('../assets/img/icon_set.png'),
          router_:'',
          children:[]
        }
      ];

      var routerArr = [
        ['soundRecording','addressBook'],
        ['wechatList','wechatGrous'],
        ['friendsList','friendsGrous'],
        ['serviceList','serviceGroup','allocation','distribution'],
        ['equipmentList','equipmentGrous'],
        ['sensitiveSet','sensitiveGrous','sensitiveOperations','repeatFriends','wechatFinancial'],
        ['department','account','management'],
        ['addFriends','hairFriends_f','hairFriends','shallowRaise','recordNumber','dustZombies'],
        ['updateLog','operationRecords']
      ];
      
      var titleArr = [
        ["通话记录","通讯录管理"],
        ['微信列表','微信分组'],
        ['客户列表','客户分组'],
        ['客服列表','客服分组','分配规则','分配记录'],
        ['设备列表','设备分组'],
        ['敏感词设置','敏感词分组','敏感操作','重复好友统计','微信财务统计'],
        ['成员管理','角色管理','公司管理'],
        ['手机加好友','发朋友圈','朋友圈记录','浅度养号','养号操作记录','清除僵尸粉'],
        ['更新日志','操作记录']
      ];

      for(var i=0; i < routerArr.length; i++){
        for(var n=0; n<routerArr[i].length; n++){
          if(distriArr.indexOf(routerArr[i][n]) >= 0){
            navigaArr[i].children.push({
              bool:true,
              title:titleArr[i][n],
              router_:'/main/'+routerArr[i][n]
            });
          };
        };
      };
      
      navigaArr.unshift({
        title:'首页',
        y_img:require('../assets/img/icon_home2.png'),
        n_img:require('../assets/img/icon_home.png'),   
        router_:'/main/homePage/growthStatistical',
        children:[]
      });

      return navigaArr;
    },
    // 控制导航栏布局缩放
    zoomSwitch:function(bool_){
      var this_=this;
      var parameter='';
      if(bool_===true || bool_===false){
        parameter=bool_;
      }else{
        parameter=this.bool_;
      }

      if(parameter){
        this.bool_=false;
        parameter=false;
        // 隐藏导航文本
        $('.selectView_span').hide();
        $('.children_select').hide();

        // 隐藏文本时判断选中是否为2级
        $('.selectView').each(function(){
          this_.Level_2_up(this);
        });

      }else{
        this.bool_=true;
        parameter=true;
        // 显示导航文本
        $('.selectView_span').show();

        // 展开文本对应路由选中高亮
        this.corresponding();

      };
      // 触发父级函数
      this.$emit('shrinkageFun',parameter);

    },
    // 点击选项操作
    clickOptions:function(e){
      // 获取vue中this;
      var this_=this;

      //1级选项操作
      $('.selectView').bind('click',function(){
        // 获取2级选项长度
        var selectView_length=$(this).siblings('ul').children().length;
        // 长度大于0  有子级
        if(selectView_length>0){
          // 判断导航是否展开
          if(!this_.bool_){  
            this_.zoomSwitch(false); 
            this_.Level_2_an(this);
          }else{
            // 获取当前子级缩展状态
            var viewBool_ = $(this).siblings('.children_select').attr('viewBool');
            if(viewBool_==='false'){
              this_.Level_2_an(this);
            }else{
              this_.Level_2_up(this);
            };
          }
        }else{  // 长度小于0  没有子级
          Level(this);  
        };
      });

      // 2级选项操作
      $('.selectView_min').bind('click',function(){
        Level(this);
      });

      // 1级选项选中操作
      function Level(that_){
        // 获取路由路径
        var router_=$(that_).attr('rouTer');
        // 跳转路由
        this_.$router.push({
          path:router_,
          query:{
          }
        });
        this_.corresponding();
      };

    },
    // 2级展开操作
    Level_2_an:function(that_){
      var hash_=location.hash;
      // 显示2级
      $(that_).siblings('.children_select').show();
      // 并且修改viewBool属性为true
      $(that_).siblings('.children_select').attr('viewBool','true');

      // 判断子级是否选中
      $(that_).siblings('.children_select').find(".selectView_min").each(function(){
        var rouTer_ ='#'+ $(this).attr('rouTer');
        if(hash_===rouTer_){
          $(that_).children('span').addClass('no_xuanz').removeClass('yes_xuanz');
          // 
          $(that_).siblings('div').removeClass('selectCurrent');
          // 获取选中图片的路径
          var Nimg_=$(that_).children('img').attr('Nimg');
          // 替换选中图片
          $(that_).children('img').attr('src',Nimg_);

          return;
        }
      });

    },
    // 2级收缩操作
    Level_2_up:function(that_){
      var hash_=location.hash;
      // 隐藏2级
      $(that_).siblings('.children_select').hide();
      // 并且修改viewBool属性为false
      $(that_).siblings('.children_select').attr('viewBool','false');

      // 判断子级是否选中
      $(that_).siblings('.children_select').find(".selectView_min").each(function(){
        var rouTer_ ='#'+ $(this).attr('rouTer');
        if(hash_===rouTer_){
          $(that_).children('span').addClass('yes_xuanz').removeClass('no_xuanz');
          // 
          $(that_).siblings('div').addClass('selectCurrent');
          // 获取选中图片的路径
          var Yimg_=$(that_).children('img').attr('Yimg');
          // 替换选中图片
          $(that_).children('img').attr('src',Yimg_);
          return;
        }
      });
      
    },
    //判断当前页面对应的导航选项
    corresponding:function(){
      var hash_=location.hash;
      $('.selectView,.selectView_min').each(function(){
        var rouTer_ ='#'+ $(this).attr('rouTer');
        if(hash_===rouTer_){
          // 更改选中文字的颜色
          $(this).children('span').addClass('yes_xuanz').removeClass('no_xuanz');
          // 
          $(this).siblings('div').addClass('selectCurrent');
          // 获取选中图片的路径
          var Yimg_=$(this).children('img').attr('Yimg');
          if(Yimg_){
            // 替换选中图片
            $(this).children('img').attr('src',Yimg_);
          }else{
            // 判断如果当前选中为2级则显示2级列表
            $(this).parents('.children_select').show();
          }
        }else{
          // 更改选中文字的颜色
          $(this).children('span').addClass('no_xuanz').removeClass('yes_xuanz');
          // 
          $(this).siblings('div').removeClass('selectCurrent');
          // 获取选中图片的路径
          var Nimg_=$(this).children('img').attr('Nimg');
          if(Nimg_){
            // 替换选中图片
            $(this).children('img').attr('src',Nimg_);
          }
        }
      });
      
    },

  }
}
</script>

<style lang='less'>
@import '../assets/less/common.less';

.navigationBar_{
  width: auto;
  height: 100%;
  box-sizing: border-box;
  border-right:2px solid rgba(236,236,248,1);
}
.LOGO_container{
  width: 100%;
  height: 100px;
  min-height: 90px;
  position: relative;
}
.buju_container{
  position: absolute;
  left: 50%;
  top:50%;
  transform: translate(-50%, -50%);
}
.LOGO_img{
  width: 40px;
  height: auto;
}
.id_name{
  max-width: 70px;
  margin-top: 10px;
  font-size:14px;
  font-family:PingFangSC-Regular;
  color:rgba(71,78,95,1);
  text-align: center;
  overflow: hidden;
  text-overflow:ellipsis;
  white-space: nowrap;
}
.navigationArea{
  width: 100%;
  height: 90%;
  min-height: 550px;
  position: relative;
  overflow: auto;
}
.navigationScreen{
  width: auto;
  height: auto;
  position: absolute;
  top:60px;
  left:50%;
  transform: translate(-50%, 0);
}
.a_single{
  position: relative;
  margin-bottom:20px;
}
.selectCurrent{
  height: 30%;
  width: 3px;
  position: absolute;
  top:50%;
  right:-5px;
  transform: translate(0, -50%);
  border-radius:20px;
  background: @mainColor;
}
.selectView{
  width: auto;
  height: 35px;
  box-sizing: border-box;
  padding-left:30px;
  position: relative;
}
.selectView_img{
  height: 100%;
  width: auto;
  position: absolute;
  top: 0;
  left: 0;
  cursor:pointer;
}
.selectView_span{
  display: block;
  width: 90px;
  line-height: 35px;
  margin-left: 15px;
  text-align: left;
  font-size:16px;
  font-family:PingFangSC-Regular;
  cursor:pointer;
}
.a_single_min{
  position: relative;
  margin-bottom:10px;
}
.selectView_min{
  width: auto;
  height: 35px;
  box-sizing: border-box;
  padding-left:35px;
  position: relative;
}
.selectView_span_min{
  display: block;
  width: 90px;
  line-height: 35px;
  margin-left: 10px;
  text-align: left;
  font-size:12px;
  font-family:PingFangSC-Regular;
  text-align: left;
  box-sizing: border-box;
  cursor:pointer;
}
.no_xuanz{
  color:rgba(102,102,102,1);
}
.yes_xuanz{
  color:@mainColor;
}
.children_select{
  display: none;
}
.a_single_min:hover{
  background:rgba(239,242,253,1);
}
</style>
