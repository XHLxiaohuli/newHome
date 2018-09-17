<template>
  <div class="recordNumber">
    <div class="recordNumberTop">
      <div>
        <!-- 搜索组件 -->
        <searchModule
          :searchId="'recordNumberSearchId'"
          :searchVal="recordNumber_searchVal"
          @searchFun="recordNumberSearchFun"
        />
      </div>
      <div>
        <!-- <button class="exit_btn" style="margin-right:20px;" @click="popOperaShowFun(0)">发朋友圈</button> -->
        <!-- <button class="exit_btn"  @click="popOperaShowFun(1)">批量分组</button> -->
      </div>
    </div>
    <div class="recordNumberContainer">
      <!-- 列表组件 -->
      <formModule
        :checkboxGroup=true
        :separationBorder=true
        :showHeight=formHeight_
        :formVal="recordNumberFormVal"
        @formClickFun="formClickFun"
        ref="recordNumberForm"
      />
      <div style="width:100%;height:30px;"></div>
      <!-- 分页组件 -->
      <pagingModule
        :totalNum=totalNumber
        :currentNum=currentNum
        :showValNum=showValNum
        @pagingFun="recordNumberPagingFun"
      />
    </div>
    
    <!-- 发朋友圈 -->
    <popOperation
      v-if="popOperaShow==0"
      :title="'发朋友圈'"
      :popOperaVal="popOperaVal_xzwx"
      @determine="determine_xzwx"
      @cancel="popOperaHideFun"
    /> 

    <!-- 批量分组 -->
    <popOperation
      v-if="popOperaShow==1"
      :title="'批量分组'"
      :popOperaVal="popOperaVal_plfz"
      @determine="determine_plfz"
      @cancel="popOperaHideFun"
    />
    
    <!-- 添加备注 -->
    <popOperation
      v-if="popOperaShow==2"
      :title="'编辑备注'"
      :popOperaVal="popOperaVal_tjbz"
      @determine="determine_tjbz"
      @cancel="popOperaHideFun"
    />


    <!-- 聊天记录 -->


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
      recordNumber_searchVal:{
          title:'',                           //搜索title
          s_nameShow:true,                    //子标题显示
          search:true,                        //搜索按钮（true为使用，false为不使用）
          reset:false,                        //重置按钮（true为使用，false为不使用）
          timeChoose:{                        //日期区间筛选
            bool:true,                       //开关
            id:'moren_0'                        //组件id
          },
          fill:[
            { type:'input',  s_name:'操作人',  prompt:'请输入操作人'  },
            { type:'input',  s_name:'微信号',  prompt:'请输入微信号'  },
            { type:'timeChoose', s_name:'日期筛选' },
          ]
      },
      // 导出的数据
      recordNumberDataVal:'1,2,3,4\n5,6,7,8\n',
      // 列表数据
      recordNumberFormVal:{title:[
        { name:'微信',    type:'string',      tag:'wx',     width:50  },
        { name:'操作人',  type:'string',    tag:'czr',   width:10  },
        { name:'操作行为',  type:'string',    tag:'czxw',   width:10  },
        { name:'操作时间',  type:'string',    tag:'czsj',   width:10  },
      ],value:[]},
      // 列表高度
      formHeight_:0,
      // 操作人条件
      操作人:'',
      // 微信号条件
      微信号:'',
      // 开始日期条件
      开始日期:'',
      // 结束日期条件
      结束日期:'',
      // 总数据页码
      totalNumber:0,
      // 第几页
      currentNum:1,
      // 显示个数
      showValNum:10,
      // 控制弹窗显示变量
      popOperaShow:-1,
      // 发朋友圈弹窗展示数据
      popOperaVal_xzwx:[],
      // 批量分组弹窗展示数据
      popOperaVal_plfz:[],
      // 添加/编辑备注弹窗展示数据
      popOperaVal_tjbz:[],

    }
  },
  components: { searchModule,exportData,formModule,pagingModule,popOperation  },
  watch:{
    recordNumber_searchVal:{
      handler(newVal, oldVal){
        // 计算列表高度
        var this_ = this;
        setTimeout(function(){
          this_.formHeight_ = formHeight($('.recordNumberTop').height());
        },50);
      },
      deep:true
    },
  },
  mounted() {
    // 计算列表高度
    this.formHeight_ = formHeight($('.recordNumberTop').height());
    // 初始获取下拉选项类型
    this.getdropValFun();
    // 初始获取列表数据
    this.conditionRequest();
  },
  methods:{
    // 搜索组件回调函数
    recordNumberSearchFun:function(data){
      this.微信号=data.微信号;
      this.操作人=data.操作人;
      this.开始日期=data.timeChoose.startDate;
      this.结束日期=data.timeChoose.endDate;
      this.currentNum=1;
      this.conditionRequest();
    },
    // 分页回调函数
    recordNumberPagingFun:function(data){
      // 判断是否搜索触发
      if(data.conversion){  this.currentNum=data.conversion  }else{this.currentNum=1;}
      if(data.valShowNum){  this.showValNum=data.valShowNum  };
      this.conditionRequest();
    },
    // 条件请求数据
    conditionRequest:function(){
      this.recordNumberValFun({
        pageNum:this.currentNum,
        pageSize:this.showValNum,
        wxno:this.微信号,
        operator:this.操作人,
        starTime:this.开始日期,
        endTime:this.结束日期,
      });
    },
    // 获取微信数据数据
    recordNumberValFun:function(obj={
      pageNum:'',
      pageSize:'',
      wxno:'',
      operator:'',
      starTime:'',
      endTime:''
    }){
      var this_ = this;
      getIticket(function(ticket){
        this_.$axios.get(
          "http://"+api+"/api/1.0/nourish/page"+'?pageNum='+obj.pageNum+'&pageSize='+obj.pageSize+'&wxno='+obj.wxno+'&operator='+obj.operator+'&starTime='+obj.starTime+'&endTime='+obj.endTime,
          {headers:{
            'content-type': 'application/x-www-form-urlencoded',
            'ticket':ticket
          }
        }).then((response)=>{
          if(response.data.success){
            var recordNumberVal = response.data.result;
            if(recordNumberVal){
              // 设置总页数
              var page_n=Math.ceil(recordNumberVal.total/this_.showValNum);
              if(page_n==0){page_n=1};
              this_.totalNumber=page_n;
              // 对象数据转换成列表数据个数
              this_.dataConversionFun(recordNumberVal.content);
            }
          }else{
            alert(response.data.msg);
          }
          
        }).catch((error)=>{
          console.log(error);  
        });
      });
      
    },
    // 对象数据转换成列表数据个数
    dataConversionFun:function(data){

      var title=[
        { name:'微信',    type:'string',      tag:'wx',     width:50  },
        { name:'操作人',  type:'string',    tag:'czr',   width:10  },
        { name:'操作行为',  type:'string',    tag:'czxw',   width:10  },
        { name:'操作时间',  type:'string',    tag:'czsj',   width:10  },
      ],value_=[];

      // 便利数据
      for(var i=0;i<data.length;i++){
        value_.push({
          id:data[i].id,
          wx:data[i].wechatIds,
          czr:data[i].operator,
          czxw:data[i].action,
          czsj:data[i].createTime,
        });
      };

      // 赋值
      this.recordNumberFormVal={
        title:title,
        value:value_
      };
    },
    // 获取搜索组件下拉选项类型
    getdropValFun:function(){
    },
    // 搜索组件下拉选项格式转换
    dataConverDropValFun:function(data){
    },
    // 点击表信息触发
    formClickFun:function(data){
      console.log(data);
      if(data.type=='bz'){
        // 打开备注弹窗
        this.popOperaShowFun(2);
      }else if(data.type=='cz'){
        // 打开操作弹窗
        this.popOperaShowFun(3);
      };
    },
    // 弹窗展示
    popOperaShowFun:function(e){
      this.popOperaShow=e;
    },
    // 弹窗隐藏
    popOperaHideFun:function(){
      this.popOperaShowFun(-1);
    },
    // 新增微信弹窗确定按钮
    determine_xzwx:function(data){
      console.log(data);
    },
    // 批量分组弹窗确定按钮
    determine_plfz:function(data){
      console.log(data);
    },
    // 添加/编辑备注确定函数
    determine_tjbz:function(data){
      console.log(data);
    },

  }
}
</script>

<style lang='less'>
@import '../../assets/less/common.less';
.recordNumber{
  width: 95%;
  height: 100%;
  background: #fff;
  box-sizing: border-box;
  padding: 30px;
}
.recordNumberTop{
  margin-bottom: 10px;
  display: flex;
  flex-direction:row;
  justify-content:space-between;
}
.recordNumberTop>div{
  display: flex;
  flex-direction:row;
  justify-content:space-between;
  align-items:flex-end;
}
.recordNumberContainer{
  width: 100%;
}
</style>
