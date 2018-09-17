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
      <div>
        <!-- <button class="exit_btn" style="margin-right:20px;" @click="popOperaShowFun(0)">新增微信</button> -->
        <!-- <button class="exit_btn"  @click="popOperaShowFun(1)">批量分组</button> -->
      </div>
    </div>
    <div class="wechatListContainer">
      <!-- 列表组件 -->
      <formModule
        ref="wechatListForm"
        :checkboxGroup=false
        :separationBorder=true
        :showHeight=formHeight_
        :formVal="wechatListFormVal"
      >
      </formModule>
      <div style="width:100%;height:30px;"></div>
      <!-- 分页组件 -->
      <pagingModule
        :totalNum=totalNumber
        :currentNum=currentNum
        :showValNum=showValNum
        @pagingFun="wechatListPagingFun"
      />
    </div>
    
    <!-- 新增微信 -->
    <!-- <popOperation
      v-if="popOperaShow==0"
      :title="'新增微信'"
      :popOperaVal="popOperaVal_xzwx"
      @determine="determine_xzwx"
      @cancel="popOperaHideFun"
    />  -->
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
// 聊天记录组件
import chatRecord from '@/components/chatRecord'
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
            bool:true,                       //开关
            id:'moren_0'                        //组件id
          },
          fill:[
            { type:'select',  s_name:'时间类型',  value:[{prompt:'请选择时间类型',val:''},{prompt:'按天',val:'0'},{prompt:'按月',val:'1'},{prompt:'按年',val:'2'}]},
            { type:'select',  s_name:'搜索类型',  value:[{prompt:'请选择搜索类型',val:''},{prompt:'红包',val:'436207665'},{prompt:'转账',val:'419430449'},{prompt:'确认红包',val:'2000'},{prompt:'确认转账',val:'55535'}]},
            { type:'timeChoose', s_name:'日期筛选',}
          ]},
      // 列表数据
      wechatListFormVal:{title:[
        { name:'财务类型',  type:'string',    tag:'type',    width:24  },
        { name:'金额',  type:'string',    tag:'jine',     width:24  },
        { name:'次数',  type:'string',    tag:'cishu',     width:24  },
        { name:'操作时间',type:'string',    tag:'szfz',    width:24  },
      ],value:[]},
      // 最小时间条件
      最小时间:'',
      // 最大时间条件
      最大时间:'',
      // 时间段
      时间类型:'',
      // 
      搜索类型:'',
      // 总数据页码
      totalNumber:0,
      // 第几页
      currentNum:1,
      // 显示个数
      showValNum:10,
      // 控制弹窗显示变量
      popOperaShow:-1,
      // 
      formHeight_:''
    }
  },
  components: { searchModule,exportData,formModule,pagingModule,popOperation,chatRecord  },
  watch:{
    wechatListFormVal:{
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
    // this.getdropValFun();
    // 初始获取列表数据
    this.conditionRequest();
  },
  methods:{
    // 搜索组件回调函数
    wechatListSearchFun:function(data){
      this.时间类型 = data.时间类型;
      this.搜索类型 = data.搜索类型;
      this.最小时间 = data.timeChoose.startDate;
      this.最大时间 = data.timeChoose.endDate;
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
        minConversationTime:this.最小时间,
        maxConversationTime:this.最大时间,
        type:this.搜索类型,
        statisticType:this.时间类型,
      });
    },
    // 获取微信数据数据
    wechatListValFun:function(obj={
      pageNum:'',
      pageSize:'',
      type:'',
      minConversationTime:'',
      maxConversationTime:'',
      statisticType:'',
    }){
      var this_ = this;
      getIticket(function(ticket){
        this_.$axios.get(
          "http://"+api+"/api/1.0/statistic/page/transfer"+'?pageNum='+obj.pageNum+'&pageSize='+obj.pageSize+ '&type='+obj.type+'&statisticType=' +obj.statisticType +'&maxConversationTime='+obj.maxConversationTime+'&minConversationTime='+obj.minConversationTime,
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
        { name:'财务类型',  type:'string',    tag:'type',    width:24  },
        { name:'金额',  type:'string',    tag:'jine',     width:24  },
        { name:'次数',  type:'string',    tag:'cishu',     width:24  },
        { name:'操作时间',type:'string',    tag:'szfz',    width:24  },
      ],value_=[];

      // 便利数据
      for(var i=0;i<data.length;i++){
        value_.push({
          type: data[i].type == '2000'?
                '确认转账':
                data[i].type == '55535'?
                '确认红包':
                data[i].type == '436207665'?
                '红包':
                data[i].type == '419430449'?
                '转账':'',
          jine:data[i].type == '436207665'?'/':data[i].amount,
          cishu:data[i].total,
          szfz:data[i].date,
        });
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
          "http://"+api+"/api/1.0/select/wechatListPage"+'?type=1',
          {headers:{
            'content-type': 'application/x-www-form-urlencoded',
            'ticket':ticket
          }
        }).then((response)=>{
          if(response.data.success){
           var val = response.data.result;
            if(JSON.stringify(val) !== "{}"){
              // 搜索组件选项数据
              this_.dataConverDropValFun(response.data.result);
            }
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
