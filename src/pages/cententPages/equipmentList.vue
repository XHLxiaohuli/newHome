<template>
  <div class="equipmentList">
    <div class="equipmentListTop">
      <div>
        <!-- 搜索组件 -->
        <searchModule
          :searchId="'equipmentListSearchId'"
          :searchVal="equipmentList_searchVal"
          @searchFun="equipmentListSearchFun"
        />
      </div>
      <div>
        <button class="exit_btn" style="margin-right:20px;" @click="popOperaShowFun(0)">新增设备</button>
        <!-- <button class="exit_btn"  @click="popOperaShowFun(1)">批量分组</button> -->
      </div>
    </div>
    <div class="equipmentListContainer">
      <!-- 列表组件 -->
      <formModule
        :checkboxGroup=true
        :separationBorder=true
        :showHeight=formHeight_
        :formVal="equipmentListFormVal"
        @formClickFun="formClickFun"
        ref="equipmentListForm"
      />
      <div style="width:100%;height:30px;"></div>
      <!-- 分页组件 -->
      <pagingModule
        :totalNum=totalNumber
        :currentNum=currentNum
        :showValNum=showValNum
        @pagingFun="equipmentListPagingFun"
      />
    </div>
    
    <!-- 新增设备 -->
    <popOperation
      v-if="popOperaShow==0"
      :title="'新增设备'"
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
      equipmentList_searchVal:{},
      // 导出的数据
      equipmentListDataVal:'1,2,3,4\n5,6,7,8\n',
      // 列表数据
      equipmentListFormVal:{title:[
        { name:'IMEI',    type:'string',      tag:'imei',     width:15  },
        { name:'MEID',  type:'string',    tag:'meid',   width:15  },
        { name:'手机号',  type:'string',    tag:'phone',    width:15  },
        { name:'类型',  type:'string',    tag:'type',    width:15  },
        { name:'备注',    type:'onclick',   tag:'bz',     width:15  },
        { name:'操作',    type:'onclick',   tag:'cz',     width:15 }
      ],value:[]},
      // 列表高度
      formHeight_:0,
      // IMEI条件
      IMEI:'',
      // MEID条件
      MEID:'',
      // 手机号条件
      手机号:'',
      // 手机型号条件
      手机型号:'',
      // 总数据页码
      totalNumber:0,
      // 第几页
      currentNum:1,
      // 显示个数
      showValNum:10,
      // 控制弹窗显示变量
      popOperaShow:-1,
      // 新增设备弹窗展示数据
      popOperaVal_xzwx:[],
      // 批量分组弹窗展示数据
      popOperaVal_plfz:[],
      // 添加/编辑备注弹窗展示数据
      popOperaVal_tjbz:[],

    }
  },
  components: { searchModule,exportData,formModule,pagingModule,popOperation  },
  watch:{
    equipmentList_searchVal:{
      handler(newVal, oldVal){
        // 计算列表高度
        var this_ = this;
        setTimeout(function(){
          this_.formHeight_ = formHeight($('.equipmentListTop').height());
        },50);
      },
      deep:true
    },
  },
  mounted() {
    // 计算列表高度
    this.formHeight_ = formHeight($('.equipmentListTop').height());
    // 初始获取下拉选项类型
    this.getdropValFun();
    // 初始获取列表数据
    this.conditionRequest();
  },
  methods:{
    // 搜索组件回调函数
    equipmentListSearchFun:function(data){
      console.log(data);
      this.IMEI=data.IMEI;
      this.MEID=data.MEID;
      this.手机号=data.手机号;
      this.手机型号=data.手机型号;
      this.currentNum=1;
      this.conditionRequest();
    },
    // 分页回调函数
    equipmentListPagingFun:function(data){
      // 判断是否搜索触发
      if(data.conversion){  this.currentNum=data.conversion  }else{this.currentNum=1;}
      if(data.valShowNum){  this.showValNum=data.valShowNum  };
      this.conditionRequest();
      return;
    },
    // 条件请求数据
    conditionRequest:function(){
      this.equipmentListValFun({
        pageNum:this.currentNum,
        pageSize:this.showValNum,
        phone:this.手机号,
        imei:this.IMEI,
        meid:this.MEID,
        type:this.手机型号,
      });
    },
    // 获取微信数据数据
    equipmentListValFun:function(obj={
      pageNum:'',
      pageSize:'',
      phone:'',
      imei:'',
      meid:'',
      type:''
    }){
      var this_ = this;
      getIticket(function(ticket){
        this_.$axios.get(
          "http://"+api+"/api/1.0/device/page/ticket"+'?pageNum='+obj.pageNum+'&pageSize='+obj.pageSize+'&phone='+obj.phone+'&imei='+obj.imei+'&meid='+obj.meid+'&type='+obj.type,
          {headers:{
            'content-type': 'application/x-www-form-urlencoded',
            'ticket':ticket
          }}
        )
        .then((response)=>{
          if(response.data.success){
            var equipmentListVal = response.data.result;
            if(equipmentListVal){
              // 设置总页数
              var page_n=Math.ceil(equipmentListVal.total/this_.showValNum);
              if(page_n==0){page_n=1};
              this_.totalNumber=page_n;
              // 对象数据转换成列表数据个数
              this_.dataConversionFun(equipmentListVal.content);
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
        { name:'IMEI',    type:'string',      tag:'imei',     width:15  },
        { name:'MEID',  type:'string',    tag:'meid',   width:15  },
        { name:'手机号',  type:'string',    tag:'phone',    width:15  },
        { name:'类型',  type:'string',    tag:'type',    width:15  },
        { name:'备注',    type:'onclick',   tag:'bz',     width:15  },
        { name:'操作',    type:'onclick',   tag:'cz',     width:15 }
      ],value_=[];

      // 便利数据
      for(var i=0;i<data.length;i++){
        value_.push({
          id:data[i].id,
          imei:data[i].imei,
          meid:data[i].meid,
          phone:data[i].phone,
          type:data[i].type,
          bz:'添加备注',
          cz:'删除'
        });
      };

      // 赋值
      this.equipmentListFormVal={
        title:title,
        value:value_
      };
    },
    // 获取搜索组件下拉选项类型
    getdropValFun:function(){
      var this_ = this;
      getIticket(function(ticket){
        this_.$axios.get(
          "http://"+api+"/api/1.0/select/deviceListPage",
          {headers:{
            'content-type': 'application/x-www-form-urlencoded',
            'ticket':ticket
          }}
        )
        .then((response)=>{
          if(response.data.success){
            var val = response.data.result;
            if(JSON.stringify(val) !== "{}"){
              // 搜索组件选项数据
              this_.dataConverDropValFun(response.data.result);
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
    // 搜索组件下拉选项格式转换
    dataConverDropValFun:function(data){
      var this_ = this,
      obj_1={
          title:'',                           //搜索title
          s_nameShow:true,                    //子标题显示
          search:true,                        //搜索按钮（true为使用，false为不使用）
          reset:false,                        //重置按钮（true为使用，false为不使用）
          timeChoose:{                        //日期区间筛选
            bool:false,                       //开关
            id:'moren'                        //组件id
          },
          fill:[
            { type:'input',  s_name:'IMEI',  prompt:'IMEI'  },
            { type:'input',  s_name:'MEID',  prompt:'MEID'  },
            { type:'input',  s_name:'手机号',  prompt:'手机号'  },
            { type:'select', s_name:'手机型号', value:[{   prompt:'请选择手机型号',  val:''  }]  },
          ]
      },
      obj_2=[
        {  title:'IMEI',  type:'input',  prompt:'请输入IMEI',  },
        {  title:'MEID',  type:'input',  prompt:'请输入MEID',  },
        {  title:'手机号',  type:'input',  prompt:'请输入手机号',  },
        {  title:'手机型号',  type:'select',  prompt:'请选择手机型号',  selectValArr:[],  },
        {  title:'备注',  type:'input',  prompt:'请输入备注',  },
      ];


      for(var i=0;i<data.type.length;i++){
        obj_1.fill[3].value.push({
          prompt:data.type[i].name,
          val:data.type[i].id
        });
        obj_2[3].selectValArr.push({
          text:data.type[i].name,
          val:data.type[i].id
        });
      };

      this_.equipmentList_searchVal=obj_1;
      this_.popOperaVal_xzwx=obj_2;

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
    // 新增设备弹窗确定按钮
    determine_xzwx:function(data){
      console.log(data);
      var this_ = this;
      getIticket(function(ticket){
        this_.$axios({
          method: 'post',
          url: "http://"+api+"/api/1.0/device/ticket",
          headers:{
            'content-type': 'application/json',
            'ticket':ticket
          },
          data: {
            imei:data[0].val,
            meid: data[1].val,
            phone: data[2].val,
            type: data[3].val,
          }
        })
        .then((response)=>{
          if(response.data.success){
            // 跳转第一页
            this_.currentNum=1;
            // 重新请求数据
            this_.conditionRequest();
            // 关闭弹窗
            this_.popOperaShowFun(-1);
            // 
            alert('保存成功');
          }else{
            alert(response.data.msg);
          }
        })
        .catch((error)=>{
          console.log(error);
        });
      });

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
.equipmentList{
  width: 95%;
  height: 100%;
  background: #fff;
  box-sizing: border-box;
  padding: 30px;
}
.equipmentListTop{
  margin-bottom: 10px;
  display: flex;
  flex-direction:row;
  justify-content:space-between;
}
.equipmentListTop>div{
  display: flex;
  flex-direction:row;
  justify-content:space-between;
  align-items:flex-end;
}
.equipmentListContainer{
  width: 100%;
}
</style>
