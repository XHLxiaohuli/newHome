<template>
  <div class="friendsGrous">
    <div class="friendsGrousTop">
      <div>
        <!-- 搜索组件 -->
        <searchModule
          :searchId="'friendsGrousSearchId'"
          :searchVal="friendsGrous_searchVal"
          @searchFun="friendsGrousSearchFun"
        />
      </div>
      <div>
        <button class="exit_btn" style="margin-right:20px;" @click="popOperaShowFun(0)">新增分组</button>
        <!-- <button class="exit_btn"  @click="popOperaShowFun(1)">批量分组</button> -->
      </div>
    </div>
    <div class="friendsGrousContainer">
      <!-- 列表组件 -->
      <formModule
        :checkboxGroup=false
        :separationBorder=true
        :showHeight=formHeight_
        :formVal="friendsGrousFormVal"
        @formClickFun="formClickFun"
        ref="friendsGrousForm"
      />
      <div style="width:100%;height:30px;"></div>
      <!-- 分页组件 -->
      <pagingModule
        :totalNum=totalNumber
        :currentNum=currentNum
        :showValNum=showValNum
        @pagingFun="friendsGrousPagingFun"
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
      v-if="popOperaShow==3"
      :title="'修改分组'"
      :popOperaVal="popOperaVal_xiugai"
      @determine="determine_xiugai"
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
      friendsGrous_searchVal:{
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
      // friendsGrousDataVal:'1,2,3,4\n5,6,7,8\n', 
      // 列表数据
      friendsGrousFormVal:{title:[
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
        {
          title:'分组名称',
          type:'input',
          prompt:'请输入分组名称',
        },
        {
          title:'备注',
          type:'input',
          prompt:'',
        },
      ],
      // 批量分组弹窗展示数据
      popOperaVal_plfz:[
        {
          title:'选择微信分组',
          type:'specialSelect',
          selectedArr:[11,44],
          screeningArr:[11,22,33,44,55,66],
        },
      ],
      // 添加/编辑备注弹窗展示数据
      popOperaVal_tjbz:[],
      // 列表数据操作id
      popOperaId:'',


    }
  },
  components: { searchModule,exportData,formModule,pagingModule,popOperation  },
  watch:{
    friendsGrous_searchVal:{
      handler(newVal, oldVal){
        // 计算列表高度
        var this_ = this;
        setTimeout(function(){
          this_.formHeight_ = formHeight($('.friendsGrousTop').height());
        },50);
      },
      deep:true
    },
  },
  mounted() {
    // 计算列表高度
    this.formHeight_ = formHeight($('.friendsGrousTop').height());
    // 初始获取列表数据
    this.conditionRequest();
  },
  methods:{
    // 搜索组件回调函数
    friendsGrousSearchFun:function(data){
      // console.log(this.$refs.friendsGrousForm.selectedIdArr);
      this.分组名称=data.分组名称;
      this.currentNum=1;
      this.conditionRequest();
    },
    // 分页回调函数
    friendsGrousPagingFun:function(data){
      // 判断是否搜索触发
      if(data.conversion){  this.currentNum=data.conversion  }else{this.currentNum=1;}
      if(data.valShowNum){  this.showValNum=data.valShowNum  };
      this.conditionRequest();
      return;
    },
    // 条件请求数据
    conditionRequest:function(){
      this.friendsGrousValFun({
        pageNum:this.currentNum,
        pageSize:this.showValNum,
        name:this.分组名称,
      });
    },
    // 获取微信数据数据
    friendsGrousValFun:function(obj={
      pageNum:'',
      pageSize:'',
      name:'',
    }){
      var this_ = this;
      getIticket(function(ticket){
        this_.$axios.get(
          "http://"+api+"/api/1.0/groups/page/ticket"+'?pageNum='+obj.pageNum+'&pageSize='+obj.pageSize+'&type=0'+'&name='+obj.name,
          {headers:{
            'content-type': 'application/x-www-form-urlencoded',
            'ticket':ticket
          }}
        )
        .then((response)=>{
          if(response.data.success){
            var friendsGrousVal = response.data.result;
            if(friendsGrousVal){
              // 设置总页数
              var page_n=Math.ceil(friendsGrousVal.total/this_.showValNum);
              if(page_n==0){page_n=1};
              this_.totalNumber=page_n;
              // 对象数据转换成列表数据个数
              this_.dataConversionFun(friendsGrousVal.content);
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
          bz:data[i].remark?data[i].remark:'添加备注',
          cz:[
            {  belongs:'修改', titleShow:false, onclick:true,  val:'修改'  },
            // {  belongs:'删除', titleShow:false, onclick:true,  val:'删除'  }
          ],
        });
      };
      // 赋值
      this.friendsGrousFormVal={
        title:title,
        value:value_
      };
    },
    
    // 点击表信息触发
    formClickFun:function(data){
      this.popOperaId = data.id;
      if(data.type=='bz'){
        var arr = this.friendsGrousFormVal.value;
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
        var arr = this.friendsGrousFormVal.value;
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
      console.log(data);
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
            type:'0',
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
    // 
    determine_xiugai:function(data){
      var arr = this.friendsGrousFormVal.value;
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
      var arr = this.friendsGrousFormVal.value;
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
.friendsGrous{
  width: 95%;
  height: 100%;
  background: #fff;
  box-sizing: border-box;
  padding: 30px;
}
.friendsGrousTop{
  margin-bottom: 10px;
  display: flex;
  flex-direction:row;
  justify-content:space-between;
}
.friendsGrousTop>div{
  display: flex;
  flex-direction:row;
  justify-content:space-between;
  align-items:flex-end;
}
.friendsGrousContainer{
  width: 100%;
}
</style>
