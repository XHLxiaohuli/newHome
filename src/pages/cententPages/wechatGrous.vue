<template>
  <div class="wechatGrous">
    <div class="wechatGrousTop">
      <div>
        <!-- 搜索组件 -->
        <searchModule
          :searchId="'wechatGrousSearchId'"
          :searchVal="wechatGrous_searchVal"
          @searchFun="wechatGrousSearchFun"
        />
      </div>
      <div>
        <button class="exit_btn" style="margin-right:20px;" @click="popOperaShowFun(0)">新增分组</button>
      </div>
    </div>
    <div class="wechatGrousContainer">
      <!-- 列表组件 -->
      <formModule
        :checkboxGroup=false
        :separationBorder=true
        :showHeight=formHeight_
        :formVal="wechatGrousFormVal"
        @formClickFun="formClickFun"
        ref="wechatGrousForm"
      />
      <div style="width:100%;height:30px;"></div>
      <!-- 分页组件 -->
      <pagingModule
        :totalNum=totalNumber
        :currentNum=currentNum
        :showValNum=showValNum
        @pagingFun="wechatGrousPagingFun"
      />
    </div>
    
    <!-- 新增分组 -->
    <popOperation
      v-if="popOperaShow==0"
      :title="'新增分组'"
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
      @determine="determine_xiugai_2"
      @cancel="popOperaHideFun"
    />


    <!-- 修改分组 -->
    <popOperation
      v-if="popOperaShow==4"
      :title="'修改分组'"
      :popOperaVal="popOperaVal_xiugai"
      @determine="determine_xiugai"
      @cancel="popOperaHideFun"
    /> 


    <!--  -->
    <popOperation
      v-if="popOperaShow==3"
      :title="'微信分组删除将会影响分配规则'"
      :popOperaVal="null"
      @determine="detele_tjbz"
      @cancel="popOperaHideFun"
    />


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
      wechatGrous_searchVal:{
          title:'',                           //搜索title
          s_nameShow:true,                    //子标题显示
          search:true,                        //搜索按钮（true为使用，false为不使用）
          reset:false,                        //重置按钮（true为使用，false为不使用）
          timeChoose:{                        //日期区间筛选
            bool:false,                       //开关
            id:'moren'                        //组件id
          },
          fill:[
            { type:'input',  s_name:'分组名称',  prompt:'分组名称'  },
          ]
      },
      // 导出的数据
      // wechatGrousDataVal:'1,2,3,4\n5,6,7,8\n', 
      // 列表数据
      wechatGrousFormVal:{title:[
        { name:'分组名称',    type:'string',      tag:'fzmc',     width:30  },
        // { name:'组内内容',  type:'onclick',    tag:'znnr',   width:22  },
        { name:'备注',    type:'onclick',   tag:'bz',     width:30  },
        { name:'操作',    type:'arry',      tag:'cz',  width:30  }
      ],value:[]},
      // 列表高度
      formHeight_:0,
      // 分组条件
      分组名称:'',
      // 总数据页码
      totalNumber:0,
      // 第几页
      currentNum:1,
      // 显示个数
      showValNum:10,
      // 控制弹窗显示变量
      popOperaShow:-1,
      // 新增分组弹窗展示数据
      popOperaVal_xzwx:[
        {  title:'分组名称',  type:'input',  prompt:'请输入分组名称',  },
        {  title:'备注',  type:'input',  prompt:'',  },
      ],
      // 批量分组弹窗展示数据
      popOperaVal_plfz:[{
        title:'选择微信分组',
        type:'specialSelect',
        selectedArr:[],
        screeningArr:[],
      },],
      // 添加/编辑备注弹窗展示数据
      popOperaVal_tjbz:[
        {  title:'微信备注信息',  type:'textarea',  max:20,  prompt:'最大输入20字',  },
      ],
      // 操作修改id
      popOperaId:'',

    }
  },
  components: { searchModule,exportData,formModule,pagingModule,popOperation  },
  watch:{
    wechatGrous_searchVal:{
      handler(newVal, oldVal){
        // 计算列表高度
        var this_ = this;
        setTimeout(function(){
          this_.formHeight_ = formHeight($('.wechatGrousTop').height());
        },50);
      },
      deep:true
    },
  },
  mounted() {
    // 计算列表高度
    this.formHeight_ = formHeight($('.wechatGrousTop').height());
    // 初始获取列表数据
    this.conditionRequest();
  },
  methods:{
    // 搜索组件回调函数
    wechatGrousSearchFun:function(data){
      this.分组名称=data.分组名称;
      this.currentNum=1;
      this.conditionRequest();
    },
    // 分页回调函数
    wechatGrousPagingFun:function(data){
      // 判断是否搜索触发
      if(data.conversion){  this.currentNum=data.conversion  }else{this.currentNum=1;}
      if(data.valShowNum){  this.showValNum=data.valShowNum  };
      this.conditionRequest();
    },
    // 条件请求数据
    conditionRequest:function(){
      this.wechatGrousValFun({
        pageNum:this.currentNum,
        pageSize:this.showValNum,
        name:this.分组名称,
      });
    },
    // 获取微信数据数据
    wechatGrousValFun:function(obj={
      pageNum:'',
      pageSize:'',
      name:'',
    }){
      var this_ = this;
      getIticket(function(ticket){
        this_.$axios.get(
          "http://"+api+"/api/1.0/groups/page/ticket"+'?pageNum='+obj.pageNum+'&pageSize='+obj.pageSize+'&type=1'+'&name='+obj.name,
          {headers:{
            'content-type': 'application/x-www-form-urlencoded',
            'ticket':ticket
          }
        }).then((response)=>{
          if(response.data.success){
            var wechatGrousVal = response.data.result;
            if(wechatGrousVal){
              // 设置总页数
              var page_n=Math.ceil(wechatGrousVal.total/this_.showValNum);
              if(page_n==0){page_n=1};
              this_.totalNumber=page_n;

              // 对象数据转换成列表数据个数
              this_.dataConversionFun(wechatGrousVal.content);
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
        { name:'分组名称',    type:'string',      tag:'fzmc',     width:30  },
        // { name:'组内内容',  type:'onclick',    tag:'znnr',   width:22  },
        { name:'备注',    type:'onclick',   tag:'bz',     width:30  },
        { name:'操作',    type:'arry',      tag:'cz',  width:30  }
      ],value_=[];
      // 便利数据
      for(var i=0;i<data.length;i++){
        value_.push({
          id:data[i].id,
          fzmc:data[i].name,
          znnr:'查看详情',
          bz:data[i].remark,
          cz:[
            {  belongs:'修改', titleShow:false, onclick:true,  val:'修改'  },
            {  belongs:'删除', titleShow:false, onclick:true,  val:'删除'  }
          ],
        });
      };
      // 赋值
      this.wechatGrousFormVal={
        title:title,
        value:value_
      };
    },
    // 点击表信息触发
    formClickFun:function(data){
      this.popOperaId = data.id;
      console.log(data);
      if(data.type=='bz'){

        var arr = this.wechatGrousFormVal.value;
        for(var i=0;i<arr.length;i++){
          if(data.id == arr[i].id){
            this.popOperaVal_tjbz=[
              {
                title:'分组备注信息',
                type:'textarea',
                max:20,
                prompt:arr[i].bz,
              },
            ]
            this.popOperaShowFun(2);
            break;
          };
        };

      }else if(data.type=='删除'){
        // 打开操作弹窗
        this.popOperaShowFun(3);
      }else if(data.type=='修改'){
        var arr = this.wechatGrousFormVal.value;
        for(var i=0;i<arr.length;i++){
          if(data.id == arr[i].id){
            // 打开操作弹窗
            this.popOperaVal_xiugai=[
              {  title:'分组名称',  type:'input',  prompt:arr[i].fzmc,  },
              {  title:'备注',  type:'input',  prompt:arr[i].bz,  },
            ];
            this.popOperaShowFun(4);
            break;
          };
        };
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
    // 新增分组弹窗确定按钮
    determine_xzwx:function(data){
      var this_ = this;
      getIticket(function(ticket){
        this_.$axios({
          method: 'post',
          url: "http://"+api+"/api/1.0/groups/ticket",
          headers:{
            'content-type': 'application/json',
            'ticket':ticket
          },
          data: {
            name: data[0].val,
            remark:data[1].val,
            type:'1',
          }
        }).then((response)=>{
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
        }).catch((error)=>{
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
    // 删除分组信息
    detele_tjbz:function(){
      var this_ = this;
      getIticket(function(ticket){
        this_.$axios({
          method: 'DELETE',
          url: "http://"+api+"/api/1.0/groups/wechat/"+this_.popOperaId,
          headers:{
            'content-type': 'application/json',
            'ticket':ticket
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

            alert(response.data.msg);
          }else{
            alert(response.data.msg);
          }
        })
        .catch((error)=>{
          console.log(error);
        });
      });
    },
    // 
    determine_xiugai:function(data){
      var arr = this.wechatGrousFormVal.value;
      var arr2 = [];
      for(var i=0;i<arr.length;i++){
        if(data.id == arr[i].id){
          arr2[0]=arr[i].fzmc;
          arr2[1]=arr[i].bz;
          break;
        };
      };

      var this_ = this;
      getIticket(function(ticket){
        this_.$axios({
          method: 'put',
          url: "http://"+api+"/api/1.0/groups",
          headers:{
            'content-type': 'application/json',
            'ticket':ticket
          },
          data:{
            id:this_.popOperaId,
            name:data[0].val!=''?data[0].val:arr2[0],
            remark:data[1].val!=''?data[1].val:arr2[1],
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

            alert(response.data.msg);    
          }else{
            alert(response.data.msg);
          }
        })
        .catch((error)=>{
          console.log(error);
        });
      });
    },
    // 
    determine_xiugai_2:function(data){
      var arr = this.wechatGrousFormVal.value;
      var arr2 = [];
      for(var i=0;i<arr.length;i++){
        if(data.id == arr[i].id){
          arr2[0]=arr[i].fzmc;
          arr2[1]=arr[i].bz;
          break;
        };
      };

      var this_ = this;
      getIticket(function(ticket){
        this_.$axios({
          method: 'put',
          url: "http://"+api+"/api/1.0/groups",
          headers:{
            'content-type': 'application/json',
            'ticket':ticket
          },
          data:{
            id:this_.popOperaId,
            name:arr2[0],
            remark:data[0].val!=''?data[0].val:arr2[1],
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

            alert(response.data.msg);    
          }else{
            alert(response.data.msg);
          }
        })
        .catch((error)=>{
          console.log(error);
        });
      });
    },


  }
}
</script>

<style lang='less'>
@import '../../assets/less/common.less';
.wechatGrous{
  width: 95%;
  height: 100%;
  background: #fff;
  box-sizing: border-box;
  padding: 30px;
}
.wechatGrousTop{
  margin-bottom: 10px;
  display: flex;
  flex-direction:row;
  justify-content:space-between;
}
.wechatGrousTop>div{
  display: flex;
  flex-direction:row;
  justify-content:space-between;
  align-items:flex-end;
}
.wechatGrousContainer{
  width: 100%;
}
</style>
