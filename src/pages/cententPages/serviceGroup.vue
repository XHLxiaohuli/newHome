<template>
  <div class="serviceGroup">
    <div class="serviceGroupTop">
      <div>
        <!-- 搜索组件 -->
        <searchModule
          :searchId="'serviceGroupSearchId'"
          :searchVal="serviceGroup_searchVal"
          @searchFun="serviceGroupSearchFun"
        />
      </div>
      <div>
        <button class="exit_btn" style="margin-right:20px;" @click="popOperaShowFun(0)">新增分组</button>
      </div>
    </div>
    <div class="serviceGroupContainer">
      <!-- 列表组件 -->
      <formModule
        :checkboxGroup=false
        :separationBorder=true
        :showHeight=formHeight_
        :formVal="serviceGroupFormVal"
        @formClickFun="formClickFun"
        ref="serviceGroupForm"
      />
      <div style="width:100%;height:30px;"></div>
      <!-- 分页组件 -->
      <pagingModule
        :totalNum=totalNumber
        :currentNum=currentNum
        :showValNum=showValNum
        @pagingFun="serviceGroupPagingFun"
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
      @determine="determine_tjbz"
      @cancel="popOperaHideFun"
    />

    <!-- 修改分组 -->
    <popOperation
      v-if="popOperaShow==3"
      :title="'修改分组'"
      :popOperaVal="popOperaVal_xiugai"
      @determine="determine_xiugai"
      @cancel="popOperaHideFun"
    /> 

    <popOperation
      v-if="popOperaShow==4"
      :title="'是否确认删除分组'"
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
// 聊天记录组件
import chatRecord from '@/components/chatRecord'
export default {
  data() {
    return {
      // 搜索组件数据
      serviceGroup_searchVal:{
        title:'',                           //搜索title
        s_nameShow:true,                    //子标题显示
        search:true,                        //搜索按钮（true为使用，false为不使用）
        reset:false,                        //重置按钮（true为使用，false为不使用）
        timeChoose:{                        //日期区间筛选
          bool:false,                       //开关
          id:'moren'                        //组件id
        },
        fill:[
          { type:'input',  s_name:'客服名称',  prompt:'客服名称'  },
        ]
      },
      // 导出的数据
      serviceGroupDataVal:'1,2,3,4\n5,6,7,8\n',
      // 列表数据
      serviceGroupFormVal:{title:[
        { name:'分组名称',    type:'string',      tag:'fzmc',     width:30  },
        { name:'备注',  type:'onclick',    tag:'bz',   width:30  },
        { name:'操作',    type:'onclick',   tag:'cz',     width:30  }
      ],value:[]},
      // 列表高度
      formHeight_:0,
      // 微信号条件
      客服名称:'',
      // 总数据页码
      totalNumber:0,
      // 第几页
      currentNum:1,
      // 显示个数
      showValNum:10,
      // 控制弹窗显示变量
      popOperaShow:-1,
      // 新增微信弹窗展示数据
      popOperaVal_xzwx:[
        {
          title:'分组名称',
          type:'input',
          prompt:'请输入分组名称',
        },
        {
          title:'备注',
          type:'input',
          prompt:'添加备注',
        },
      ],
      // 批量分组弹窗展示数据
      popOperaVal_plfz:[
        {  title:'选择微信分组',  type:'select',  prompt:'请选择微信分组',  selectValArr:[]  }
      ],
      // 添加/编辑备注弹窗展示数据
      popOperaVal_tjbz:[
      ],
      // 
      popOperaVal_xiugai:[],
      // 列表数据操作id
      popOperaId:'',

    }
  },
  components: { searchModule,exportData,formModule,pagingModule,popOperation,chatRecord  },
  watch:{
    serviceGroup_searchVal:{
      handler(newVal, oldVal){
        // 计算列表高度
        var this_ = this;
        setTimeout(function(){
          this_.formHeight_ = formHeight($('.serviceGroupTop').height());
        },50);
      },
      deep:true
    },
  },
  mounted() {
    // 计算列表高度
    this.formHeight_ = formHeight($('.serviceGroupTop').height());
    // 初始获取下拉选项类型
    this.getdropValFun();
    // 初始获取列表数据
    this.conditionRequest();
  },
  methods:{
    // 搜索组件回调函数
    serviceGroupSearchFun:function(data){
      this.客服名称=data.客服名称;
      this.currentNum=1;
      this.conditionRequest();
    },
    // 分页回调函数
    serviceGroupPagingFun:function(data){
      // 判断是否搜索触发
      if(data.conversion){  this.currentNum=data.conversion  }else{this.currentNum=1;}
      if(data.valShowNum){  this.showValNum=data.valShowNum  };
      this.conditionRequest();
    },
    // 条件请求数据
    conditionRequest:function(){
      this.serviceGroupValFun({
        pageNum:this.currentNum,
        pageSize:this.showValNum,
        name:this.客服名称,
      });
    },
    // 获取微信数据数据
    serviceGroupValFun:function(obj={
      pageNum:'',
      pageSize:'',
      name:'',
    }){
      var this_ = this;
      getIticket(function(ticket){
        this_.$axios.get(
          "http://"+api+"/api/1.0/groups/page/ticket"+'?pageNum='+obj.pageNum+'&pageSize='+obj.pageSize+'&name='+obj.name+'&type=2',
          {headers:{
            'content-type': 'application/x-www-form-urlencoded',
            'ticket':ticket
          }}
        )
        .then((response)=>{
          if(response.data.success){
            var serviceGroupVal = response.data.result;
            if(serviceGroupVal){
              // 设置总页数
              var page_n=Math.ceil(serviceGroupVal.total/this_.showValNum);
              if(page_n==0){page_n=1};
              this_.totalNumber=page_n;
              // 对象数据转换成列表数据个数
              this_.dataConversionFun(serviceGroupVal.content);
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
        { name:'分组名称',    type:'string',      tag:'fzmc',     width:30  },
        { name:'备注',  type:'onclick',    tag:'bz',   width:30  },
        { name:'操作',    type:'arry',   tag:'cz',     width:30  }
      ],value_=[];
      // 便利数据
      for(var i=0;i<data.length;i++){
        value_.push({
          id:data[i].id,
          fzmc:data[i].name,
          bz:data[i].remark,
          cz:[
            {  belongs:'修改', titleShow:false, onclick:true,  val:'修改'  },
            {  belongs:'删除', titleShow:false, onclick:true,  val:'删除'  }
          ],
        });
      };
      // 赋值
      this.serviceGroupFormVal={
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

      this.popOperaId = data.id;
      if(data.type=='bz'){
        var arr = this.serviceGroupFormVal.value;
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

      }else if(data.type=='修改'){
        var arr = this.serviceGroupFormVal.value;
        for(var i=0;i<arr.length;i++){
          if(data.id == arr[i].id){
            // 打开操作弹窗
            this.popOperaVal_xiugai=[
              {  title:'分组名称',  type:'input',  prompt:arr[i].fzmc,  },
              {  title:'备注',  type:'input',  prompt:arr[i].bz,  },
            ];
            this.popOperaShowFun(3);
            break;
          };
        };
      }else if(data.type=='删除'){
        this.popOperaShowFun(4);
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
            name:data[0].val,
            remark:data[1].val,
            type: 2,
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
      var this_ = this;
      getIticket(function(ticket){
        this_.$axios({
          method: 'post',
          url: "http://"+api+"/api/1.0/groups/wechat/"+data[0].val,
          headers:{
            'content-type': 'application/json',
            'ticket':ticket
          },
          data: this_.$refs.serviceGroupForm.selectedIdArr
        }).then((response)=>{
          if(response.data.success){
            // 关闭弹窗
            this_.popOperaShowFun(-1);
            // 
            alert('批量分组成功');
          }else{
            alert(response.data.msg);
          }
        }).catch((error)=>{
          console.log(error);
        });
      });
    },
    // 添加/编辑备注确定函数
    determine_tjbz:function(data){
      var arr = this.serviceGroupFormVal.value;
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
    // 修改分组
    determine_xiugai:function(data){
      var arr = this.serviceGroupFormVal.value;
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
    // 删除分组信息
    detele_tjbz:function(){
      var this_ = this;
      getIticket(function(ticket){
        this_.$axios({
          method: 'DELETE',
          url: "http://"+api+"/api/1.0/groups/seller/"+this_.popOperaId,
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


  }
}
</script>

<style lang='less'>
@import '../../assets/less/common.less';
.serviceGroup{
  width: 95%;
  height: 100%;
  background: #fff;
  box-sizing: border-box;
  padding: 30px;
}
.serviceGroupTop{
  margin-bottom: 10px;
  display: flex;
  flex-direction:row;
  justify-content:space-between;
}
.serviceGroupTop>div{
  display: flex;
  flex-direction:row;
  justify-content:space-between;
  align-items:flex-end;
}
.serviceGroupContainer{
  width: 100%;
}
</style>
