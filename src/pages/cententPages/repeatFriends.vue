<template>
  <div class="wechatList">
    <div class="wechatListTop">
      <div>
        <!-- 搜索组件 -->
        <searchModule
          :searchId="'wechatListSearchId'"
          :searchVal="wechatList_searchVal"
          @searchFun="wechatListSearchFun"
        />
      </div>
      <!-- <div>
        <button class="exit_btn" style="margin-right:20px;" @click="popOperaShowFun(0)">新增微信</button>
        <button class="exit_btn"  @click="popOperaShowFun(1)">批量分组</button>
      </div> -->
    </div>
    <div class="wechatListContainer">
      <!-- 重复好友微信定位 -->
      <div class="chongfumokuai " :style="'height:'+(formHeight_+50)+'px;'">
        <div 
          v-for="(v,i) in 重复好友"
          :key="i"
          class="weixinhaoyoucf" 
          :style="好友微信Id==v.friendWxid && 'background:rgba(239,242,253,1);'"
          @click="qiehuancf(v.friendWxid)"
          style="width:100%;height:60px;box-sizing: border-box;border-bottom:1px solid #ececf8;padding:10px;">
          <img style="width:38px;height:38px;float:left;" :src="v.friendHeadImgUrl"/>
          <div style="width:100%;height:38px;box-sizing: border-box;padding-left:45px;text-align: left;">
            <p class="val_color">{{v.friendNickname}}</p>
            <p class="val_color">{{v.friendWxno}}</p>
          </div>
        </div>
      </div>

      <!-- 表单定位 -->
      <div class="biaogemokuai">
        <!-- 列表组件 -->
        <formModule
          ref="wechatListForm"
          :checkboxGroup=false
          :separationBorder=true
          :showHeight=formHeight_
          :formVal="wechatListFormVal"
        >
        </formModule>
      </div>

      <!-- 清除浮动 -->
      <div style="clear: both;"></div>

      <div style="width:100%;height:30px;"></div>
      <!-- 分页组件 -->
      <pagingModule
        :totalNum=totalNumber
        :currentNum=currentNum
        :showValNum=showValNum
        @pagingFun="wechatListPagingFun"
      />
    </div>
    
    
  </div>
</template>

<script>
// 搜索组件
import searchModule from '@/components/searchModule'
// 数据导出表格组件
import exportData from '@/components/exportData'
// 列表组件
import formModule from '@/components/formModule'
// 分页组件
import pagingModule from '@/components/pagingModule'
// 遮罩表单组件
import popOperation from '@/components/popOperation'
export default {
  data() {
    return {
      // 搜索组件数据
      wechatList_searchVal:{
        title:'',                           //搜索title
        s_nameShow:true,                    //子标题显示
        search:true,                        //搜索按钮（true为使用，false为不使用）
        reset:false,                        //重置按钮（true为使用，false为不使用）
        timeChoose:{                        //日期区间筛选
          bool:false,                       //开关
          id:'moren'                        //组件id
        },
        fill:[
          { type:'input',  s_name:'好友微信号',  prompt:'微信号 / 微信昵称'  },
        ]
      },
      // 导出的数据
      wechatListDataVal:'1,2,3,4\n5,6,7,8\n',
      // 列表数据
      wechatListFormVal:{title:[
        { name:'微信头像',    type:'arry',      tag:'wx',     width:25  },
        { name:'微信名',  type:'string',    tag:'wxm',    width:25  },
        { name:'微信号',  type:'string',    tag:'wxh',    width:25  },
        { name:'所属销售',  type:'string',    tag:'ssxs',    width:25  },
      ],value:[]},
      // 列表高度
      formHeight_:0,
      // 好友微信号号条件
      好友微信号:'',
      // 
      好友微信Id:'',
      // 
      重复好友:[],
      // 总数据页码
      totalNumber:0,
      // 第几页
      currentNum:1,
      // 显示个数
      showValNum:10,
      // 控制弹窗显示变量
      popOperaShow:-1,
      
    }
  },
  components: { searchModule,exportData,formModule,pagingModule,popOperation  },
  watch:{
    wechatList_searchVal:{
      handler(newVal, oldVal){
        // 计算列表高度
        var this_ = this;
        setTimeout(function(){
          this_.formHeight_ = formHeight($('.wechatListTop').height());
        },50);
      },
      deep:true
    },
  },
  mounted() {
    // 计算列表高度
    this.formHeight_ = formHeight($('.wechatListTop').height());
    // 初始获取下拉选项类型
    this.getdropValFun();
    // 初始获取列表数据
    // this.conditionRequest();

  },
  methods:{
    // 搜索组件回调函数
    wechatListSearchFun:function(data){
      this.好友微信号=data.好友微信号;
      this.getdropValFun();
    },
    qiehuancf:function( data ){
      this.好友微信Id = data;
      this.currentNum=1;
      this.conditionRequest();
    },
    // 分页回调函数
    wechatListPagingFun:function(data){
      // 判断是否搜索触发
      if(data.conversion){  this.currentNum=data.conversion  }else{this.currentNum=1;}
      if(data.valShowNum){  this.showValNum=data.valShowNum  };
      this.conditionRequest();
    },
    // 条件请求数据
    conditionRequest:function(){
      this.wechatListValFun({
        pageNum:this.currentNum,
        pageSize:this.showValNum,
        friendWxid:this.好友微信Id,
      });
    },
    // 获取微信数据数据
    wechatListValFun:function(obj={
      pageNum:'',
      pageSize:'',
      friendWxid:'',
    }){
      var this_ = this;
      getIticket(function(ticket){
        this_.$axios.get(
          "http://"+api+"/api/1.0/statistic/page/friendRepeat/info"+'?pageNum='+obj.pageNum+'&pageSize='+obj.pageSize+'&friendWxid='+obj.friendWxid,
          {headers:{
            'content-type': 'application/x-www-form-urlencoded',
            'ticket':ticket
          }}
        )
        .then((response)=>{
          if(response.data.success){
            var wechatListVal = response.data.result;
            if(wechatListVal){
              // 设置总页数
              var page_n=Math.ceil(wechatListVal.total/this_.showValNum);
              if(page_n==0){page_n=1};
              this_.totalNumber=page_n;
              // 对象数据转换成列表数据个数
              this_.dataConversionFun(wechatListVal.content);
            }
          }else{
            alert(response.data.msg);
          }
        })
        .catch((error)=>{
          console.log(error);  
        });
      });
    },
    // 对象数据转换成列表数据个数
    dataConversionFun:function(data){

      var title=[
        { name:'微信头像',    type:'arry',      tag:'wx',     width:25  },
        { name:'微信名',  type:'string',    tag:'wxm',    width:25  },
        { name:'微信号',  type:'string',    tag:'wxh',    width:25  },
        { name:'所属销售',  type:'string',    tag:'ssxs',    width:25  },
      ],value_=[];

      // 便利数据
      for(var i=0;i<data.length;i++){
        value_.push({
          id:data[i].id,
          wx:[{
            belongs:'image',
            url:data[i].wechatHeadImgUrl
          }],
          wxm:data[i].wechatNickname,
          wxh:data[i].wechatWxno,
          ssxs:data[i].sellerName?data[i].sellerName:'-',
        });
      };

      // 获取分组名称
      function getgroupArr(data){
        if(!data || data.length==0){return "-"};

        var arr=[];
        for(var i=0;i<data.length;i++){
          arr.push(data[i].name);
        };

        return arr.join(',');
      };

      // 赋值
      this.wechatListFormVal={
        title:title,
        value:value_
      };
    },
    // 获取搜索组件下拉选项类型
    getdropValFun:function(){
      var this_ = this;
      getIticket(function(ticket){
        this_.$axios.get(
          "http://"+api+"/api/1.0/statistic/find/friendRepeat"+"?friendWxno="+this_.好友微信号,
          {headers:{
            'content-type': 'application/x-www-form-urlencoded',
            'ticket':ticket
          }
        }).then((response)=>{
          if(response.data.success){
            // 搜索组件选项数据
            // this_.dataConverDropValFun(response.data.result);
            this_.重复好友 = response.data.result
          }else{
            alert(response.data.msg);
          }
        }).catch((error)=>{
          console.log(error);
        });
      });
    },
    // 搜索组件下拉选项格式转换
    dataConverDropValFun:function(data){
      console.log(data);
      return;
    },
    // 弹窗展示
    popOperaShowFun:function(e){
      this.popOperaShow=e;
    },
    // 弹窗隐藏
    popOperaHideFun:function(){
      this.popOperaShowFun(-1);
    },

  }
}
</script>

<style lang='less'>
@import '../../assets/less/common.less';
.wechatList{
  width: 95%;
  height: 100%;
  background: #fff;
  box-sizing: border-box;
  padding: 30px;
}
.wechatListTop{
  margin-bottom: 10px;
  display: flex;
  flex-direction:row;
  justify-content:space-between;
}
.wechatListTop>div{
  display: flex;
  flex-direction:row;
  justify-content:space-between;
  align-items:flex-end;
}
.wechatListContainer{
  width: 100%;
}
.biaogemokuai{
  width: 80%;
  float: right;
}
.chongfumokuai{
  width: 18%;
  float: left;
  border: 1px solid #ececf8;
  overflow: auto;
}
.weixinhaoyoucf{

}
.weixinhaoyoucf:hover{
  background:rgba(239,242,253,1);
}
.testswitch {
    position: relative;
    float: left; 
    width: 60px;
    margin: 0;
    -webkit-user-select:none; 
    -moz-user-select:none; 
    -ms-user-select: none;
}
 
.testswitch-checkbox {
    display: none;
}
 
.testswitch-label {
    display: block; 
    overflow: hidden; 
    cursor: pointer;
    // border: 1px solid #999999; 
    border-radius: 20px;
}
 
.testswitch-inner {
    display: block; 
    width: 200%; 
    margin-left: -100%;
    transition: margin 0.1s ease-in 0s;
}
 
.testswitch-inner::before, .testswitch-inner::after {
    display: block; 
    float: right; 
    width: 50%; 
    height: 15px; 
    padding: 0; 
    line-height: 16px;
    font-size: 5px; 
    color: white; 
    font-family: 
    Trebuchet, Arial, sans-serif; 
    font-weight: bold;
    box-sizing: border-box;
}
 
.testswitch-inner::after {
    content: attr(data-on);
    padding-left: 10px;
    background-color: #0aa1ed; 
    color: #FFFFFF;
}
 
.testswitch-inner::before {
    content: attr(data-off);
    padding-right: 5px;
    background-color: #EEEEEE; 
    color: #999999;
    text-align: right;
}
 
.testswitch-switch {
    position: absolute; 
    display: block; 
    width: 10px;
    height: 10px;
    margin: 2px;
    background: #FFFFFF;
    top: 0; 
    bottom: 0;
    right: 40px;
    border: 1px solid #999999; 
    border-radius: 20px;
    transition: all 0.1s ease-in 0s;
}
 
.testswitch-checkbox:checked + .testswitch-label .testswitch-inner {
    margin-left: 0;
}
 
.testswitch-checkbox:checked + .testswitch-label .testswitch-switch {
    right: 0px; 
}

</style>
