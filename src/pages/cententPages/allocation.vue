<template>
  <div class="allocation">
    <div class="allocationTop">
      <!-- <div> -->
        <!-- 搜索组件 -->
        <!-- <searchModule
          :searchId="'allocationSearchId'"
          :searchVal="allocation_searchVal"
          @searchFun="allocationSearchFun"
        /> -->
      <!-- </div> -->
      <div>
        <button class="exit_btn" style="margin-right:20px;" @click="popOperaShowFun(0)">新分配规则</button>
        <!-- <button class="exit_btn"  @click="popOperaShowFun(1)">好友分配上线</button> -->
      </div>
    </div>
    <div class="allocationContainer">
      <!-- 列表组件 -->
      <formModule
        :checkboxGroup=false
        :separationBorder=true
        :showHeight=formHeight_
        :formVal="allocationFormVal"
        @formClickFun="formClickFun"
        ref="allocationForm"
      />
      <div style="width:100%;height:30px;"></div>
      <!-- 分页组件 -->
      <pagingModule
        :totalNum=totalNumber
        :currentNum=currentNum
        :showValNum=showValNum
        @pagingFun="allocationPagingFun"
      />
    </div>
    
    <!-- 新分配规则 -->
    <popOperation
      v-if="popOperaShow==0"
      :title="'新分配规则'"
      :popOperaVal="popOperaVal_xzwx"
      @determine="determine_xzwx"
      @cancel="popOperaHideFun"
      @selectFun="xzwx_selectFun"
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

    <!--  -->
    <popOperation
      v-if="popOperaShow==3"
      :title="'是否确认删除'"
      :popOperaVal="null"
      @determine="detele_tjbz"
      @cancel="popOperaHideFun"
    />


    <!-- 修改分配规则 -->
    <popOperation
      v-if="popOperaShow==4"
      :title="'修改分配规则'"
      :popOperaVal="popOperaVal_xzwx_"
      @determine="determine_xzwx_"
      @cancel="popOperaHideFun"
      @selectFun="xzwx_selectFun_"
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
      allocation_searchVal:{},
      // 导出的数据
      allocationDataVal:'1,2,3,4\n5,6,7,8\n',
      // 列表数据
      allocationFormVal:{title:[
        // { name:'要分配的微信范围',       type:'string',     tag:'wxfw',     width:18  },
        // { name:'要分配的内容',           type:'string',     tag:'fpnr',   width:15  },
        // { name:'销售范围',               type:'string',     tag:'xsfw',    width:10  },
        // { name:'所属部门',               type:'string',     tag:'ssbm',    width:10  },
        // { name:'分配方式',               type:'string',     tag:'fpfs',     width:10  },
        // { name:'是否仅分配给在线',        type:'string',     tag:'sfzx',     width:10  },
        { name:'规则名称',                 type:'string',     tag:'name',     width:20  },
        { name:'状态',                      type:'string',     tag:'state',     width:20  },
        { name:'类型',                      type:'string',     tag:'type',     width:20  },
        { name:'操作',                      type:'arry',       tag:'cz',     width:30  }
      ],value:[]},
      // 列表高度
      formHeight_:0,
      // 微信号条件
      // 微信信息:'',
      // 分组条件
      // 分组:'',
      // 总数据页码
      totalNumber:0,
      // 第几页
      currentNum:1,
      // 显示个数
      showValNum:10,
      // 控制弹窗显示变量
      popOperaShow:-1,
      // 新分配规则弹窗展示数据
      popOperaVal_xzwx:[],
      popOperaVal_xzwx_:[],
      // 组数据
      groupVal:[],
      // 销售数据
      salesVal:[],
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
      popOperaVal_tjbz:[
        {
          title:'微信备注信息',
          type:'textarea',
          max:20,
          prompt:'最大输入20字',
        },
      ],
      // 点击操作数据的id
      popOperaId:'',

    }
  },
  components: { searchModule,exportData,formModule,pagingModule,popOperation  },
  watch:{
    allocation_searchVal:{
      handler(newVal, oldVal){
        // 计算列表高度
        var this_ = this;
        setTimeout(function(){
          this_.formHeight_ = formHeight($('.allocationTop').height());
        },50);
      },
      deep:true
    },
  },
  mounted() {
    // 计算列表高度
    this.formHeight_ = formHeight($('.allocationTop').height());
    // 初始获取下拉选项类型
    // this.getdropValFun();
    // 初始获取列表数据
    this.conditionRequest();
  },
  methods:{
    // 搜索组件回调函数
    allocationSearchFun:function(data){
      // console.log(this.$refs.allocationForm.selectedIdArr);
      // this.微信信息=data.微信信息;
      // this.分组=data.分组;
      this.currentNum=1;
      this.conditionRequest();
    },
    // 分页回调函数
    allocationPagingFun:function(data){
      // 判断是否搜索触发
      if(data.conversion){  this.currentNum=data.conversion  }else{this.currentNum=1;}
      if(data.valShowNum){  this.showValNum=data.valShowNum  };
      this.conditionRequest();
      return;
    },
    // 条件请求数据
    conditionRequest:function(){
      this.allocationValFun({
        pageNum:this.currentNum,
        pageSize:this.showValNum,
      });
    },
    // 获取微信数据数据
    allocationValFun:function(obj={
      pageNum:'',
      pageSize:'',
    }){
      var this_ = this;
      getIticket(function(ticket){
        this_.$axios.get(
          "http://"+api+"/api/1.0/rule/page/ticket"+'?pageNum='+obj.pageNum+'&pageSize='+obj.pageSize,
          {headers:{
            'content-type': 'application/x-www-form-urlencoded',
            'ticket':ticket
          }}
        )
        .then((response)=>{
          if(response.data.success){
            var allocationVal = response.data.result;

            if(allocationVal){
              // 设置总页数
              var page_n=Math.ceil(allocationVal.total/this_.showValNum);
              if(page_n==0){page_n=1};
              this_.totalNumber=page_n;

              // 对象数据转换成列表数据个数
              this_.dataConversionFun(allocationVal.content);
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
        // { name:'要分配的微信范围',       type:'string',     tag:'wxfw',     width:18  },
        // { name:'要分配的内容',           type:'string',     tag:'fpnr',   width:15  },
        // { name:'销售范围',               type:'string',     tag:'xsfw',    width:10  },
        // { name:'所属部门',               type:'string',     tag:'ssbm',    width:10  },
        // { name:'分配方式',               type:'string',     tag:'fpfs',     width:10  },
        // { name:'是否仅分配给在线',        type:'string',     tag:'sfzx',     width:10  },
        { name:'规则名称',                 type:'string',     tag:'name',     width:20  },
        { name:'状态',                      type:'string',     tag:'state',     width:20  },
        { name:'类型',                      type:'string',     tag:'type',     width:20  },
        { name:'操作',                      type:'arry',       tag:'cz',     width:30  }
      ],value_=[];

      // 便利数据
      for(var i=0;i<data.length;i++){
        value_.push({
          id:data[i].id,
          data:data[i],
          // wxfw:'',
          // fpnr:'',
          // xsfw:'',
          // ssbm:'',
          // fpfs:'',
          // sfzx:'',
          name:data[i].name,
          state:data[i].state=='0'?'可用':'不可用', 
          type:data[i].type=='0'?'按组分配':'按销售分配',
          cz:[
            {
              belongs:'修改',
              titleShow:false,
              onclick:true,
              val:'修改'
            },
            {
              belongs:'删除',
              titleShow:false,
              onclick:true,
              val:'删除'
            }
          ],
        });
      };

      // 赋值
      this.allocationFormVal={
        title:title,
        value:value_
      };
    },
    // 获取搜索组件下拉选项类型
    getdropValFun:function(){
      var this_ = this;
      getIticket(function(ticket){
        var obj_1 = [
          {  title:'分配类型',  type:'select',  prompt:'请选择分配类型',  selectValArr:[{  text:'按组分配',  val:'0'  },{  text:'按销售分配',  val:'1'  }]  },
          {  title:'规则命名',  type:'input',  prompt:'请输入规则命名'  },
          {  id:'specialSelect_1',  title:'选择客服分组',  type:'specialSelect',  selectedArr:[],  screeningArr:[],  },
          {  id:'specialSelect_0',  title:'选择微信分组',  type:'specialSelect',  selectedArr:[],  screeningArr:[],  },
          // {  title:'仅分配给在线客服',  type:'radio',  radioId:'radio_0',  radioVal:[{  id:'a1',  text:'是',  val:'1'  },{  id:'a2',  text:'否',  val:'0'  }]  }
        ],  obj_2 = [
          {  title:'分配类型',  type:'select',  prompt:'请选择分配类型',  selectValArr:[{  text:'按组分配',  val:'0'  },{  text:'按销售分配',  val:'1'  }]  },
          {  title:'规则命名',  type:'input',  prompt:'请输入规则命名'  },
          {  id:'specialSelect_1',  title:'选择销售',  type:'specialSelect',  selectedArr:[],  screeningArr:[],  },
          {  id:'specialSelect_0',  title:'选择微信分组',  type:'specialSelect',  selectedArr:[],  screeningArr:[],  },
          // {  title:'仅分配给在线客服',  type:'radio',  radioId:'radio_0',  radioVal:[{  id:'a1',  text:'是',  val:'1'  },{  id:'a2',  text:'否',  val:'0'  }]  }
        ];


        this_.$axios.all([
          // 获取好友范围筛选
          this_.$axios.get(
            "http://"+api+"/api/1.0/select/wechatListPage"+'?type=1',
            {headers:{
              'content-type': 'application/x-www-form-urlencoded',
              'ticket':ticket
            }}
          ),
          // 获取销售分组
          this_.$axios.get(
            "http://"+api+"/api/1.0/groups/find/ticket"+"?type=2",
            {headers:{
              'content-type': 'application/x-www-form-urlencoded',
              'ticket':ticket
            }}
          ),
          // 获取销售列表
          this_.$axios.get(
            "http://"+api+"/api/1.0/user/find/seller/ticket",
            {headers:{
              'content-type': 'application/x-www-form-urlencoded',
              'ticket':ticket
            }}
          )
        ]).then(this_.$axios.spread((res1,res2,res3)=>{

            var val_1 = res1.data.result;
            var val_2 = res2.data.result;
            var val_3 = res3.data.result;

            if(JSON.stringify(val_1) !== "{}"){
              for(var i=0;i<val_1.groups.length;i++){
                obj_1[3].screeningArr.push({
                  text:val_1.groups[i].name,
                  val:val_1.groups[i].id
                });
                obj_2[3].screeningArr.push({
                  text:val_1.groups[i].name,
                  val:val_1.groups[i].id
                });
              };
            };
            if(JSON.stringify(val_2) !== "{}"){
              for(var i=0;i<val_2.length;i++){
                obj_1[2].screeningArr.push({
                  text:val_2[i].name,
                  val:val_2[i].id
                });
              };
            };
            if(JSON.stringify(val_3) !== "{}"){
              for(var i=0;i<val_3.length;i++){
                obj_2[2].screeningArr.push({
                  text:val_3[i].name,
                  val:val_3[i].id
                });
              };
            };

            this_.popOperaVal_xzwx=obj_1;
            this_.groupVal=obj_1;
            this_.salesVal=obj_2;

            this_.popOperaShow=0;

        })).catch((err)=>{
            console.log(err);
        });

      });
    },
    // 搜索组件下拉选项格式转换
    dataConverDropValFun:function(data){   
    },
    // 点击表信息触发
    formClickFun:function(data){

      this.popOperaId = data.id;

      if(data.type=='修改'){
        this.modifyDataFun();

        // 打开备注弹窗
        // this.popOperaShowFun(2);
      }else if(data.type=='删除'){
        // 打开操作弹窗
        this.popOperaShowFun(3);
      };
    },
    // 修改分配数据信息
    modifyDataFun:function(){

      var id = this.popOperaId;
      var arr = this.allocationFormVal.value;
      var data;
      for(var i=0;i<arr.length;i++){
        if(id == arr[i].id){
          data = arr[i].data;
          break;
        };
      };

      var this_ = this;
      getIticket(function(ticket){
        var obj_1 = [
          {  title:'分配类型',  type:'select',  prompt:data.type=='0'?'按组分配':'按销售分配',  selectValArr:[{  text:'按组分配',  val:'0'  },{  text:'按销售分配',  val:'1'  }]  },
          {  title:'规则命名',  type:'input',  prompt:data.name  },
          {  id:'specialSelect_1',  title:'选择客服分组',  type:'specialSelect',  selectedArr:[],  screeningArr:[],  },
          {  id:'specialSelect_0',  title:'选择微信分组',  type:'specialSelect',  selectedArr:[],  screeningArr:[],  },
          // {  title:'仅分配给在线客服',  type:'radio',  radioId:'radio_0', defaultData:data.state,  radioVal:[{  id:'a1',  text:'是',  val:'1'  },{  id:'a2',  text:'否',  val:'0'  }]  }
        ],  obj_2 = [
          {  title:'分配类型',  type:'select',  prompt:data.type=='0'?'按组分配':'按销售分配',  selectValArr:[{  text:'按组分配',  val:'0'  },{  text:'按销售分配',  val:'1'  }]  },
          {  title:'规则命名',  type:'input',  prompt:data.name  },
          {  id:'specialSelect_1',  title:'选择销售',  type:'specialSelect',  selectedArr:[],  screeningArr:[],  },
          {  id:'specialSelect_0',  title:'选择微信分组',  type:'specialSelect',  selectedArr:[],  screeningArr:[],  },
          // {  title:'仅分配给在线客服',  type:'radio',  radioId:'radio_0', defaultData:data.state,  radioVal:[{  id:'a1',  text:'是',  val:'1'  },{  id:'a2',  text:'否',  val:'0'  }]  }
        ];
        this_.$axios.all([
          // 获取好友范围筛选
          this_.$axios.get(
            "http://"+api+"/api/1.0/select/wechatListPage"+'?type=1',
            {headers:{
              'content-type': 'application/x-www-form-urlencoded',
              'ticket':ticket
            }}
          ),
          // 获取销售分组
          this_.$axios.get(
            "http://"+api+"/api/1.0/groups/find/ticket"+"?type=2",
            {headers:{
              'content-type': 'application/x-www-form-urlencoded',
              'ticket':ticket
            }}
          ),
          // 获取销售列表
          this_.$axios.get(
            "http://"+api+"/api/1.0/user/find/seller/ticket",
            {headers:{
              'content-type': 'application/x-www-form-urlencoded',
              'ticket':ticket
            }}
          )
        ]).then(this_.$axios.spread((res1,res2,res3)=>{
            
            var val_1 = res1.data.result;
            var val_2 = res2.data.result;
            var val_3 = res3.data.result;

            if(JSON.stringify(val_1) !== "{}"){
              for(var i=0;i<val_1.groups.length;i++){
                obj_1[3].screeningArr.push({
                  text:val_1.groups[i].name,
                  val:val_1.groups[i].id
                });
                obj_2[3].screeningArr.push({
                  text:val_1.groups[i].name,
                  val:val_1.groups[i].id
                });

                if(data.wechatGroups.indexOf(val_1.groups[i].id)>-1){
                  obj_1[3].selectedArr.push({
                    text:val_1.groups[i].name,
                    val:val_1.groups[i].id
                  });
                  obj_2[3].selectedArr.push({
                    text:val_1.groups[i].name,
                    val:val_1.groups[i].id
                  });
                };
              };
            };
            if(JSON.stringify(val_2) !== "{}"){
              for(var i=0;i<val_2.length;i++){
                obj_1[2].screeningArr.push({
                  text:val_2[i].name,
                  val:val_2[i].id
                });

                if(data.type=='0' && data.regions.indexOf(val_2[i].id)>-1){
                  obj_1[2].selectedArr.push({
                    text:val_2[i].name,
                    val:val_2[i].id
                  });
                };

              };
            };
            if(JSON.stringify(val_3) !== "{}"){
              for(var i=0;i<val_3.length;i++){
                obj_2[2].screeningArr.push({
                  text:val_3[i].name,
                  val:val_3[i].id
                });

                if(data.type=='1' && data.regions.indexOf(val_3[i].id)>-1){
                  obj_2[2].selectedArr.push({
                    text:val_3[i].name,
                    val:val_3[i].id
                  });
                };

              };
            };

            this_.popOperaVal_xzwx_=data.type=='0'?obj_1:obj_2;
            this_.groupVal=obj_1;
            this_.salesVal=obj_2;

            this_.popOperaShow=4;

        })).catch((err)=>{
            console.log(err);
        });

      });


















    },
    // 弹窗展示
    popOperaShowFun:function(e){
      if(e == 0){this.getdropValFun();return;};
      this.popOperaShow=e;
    },
    // 弹窗隐藏
    popOperaHideFun:function(){
      this.popOperaShowFun(-1);
    },
    // 新分配规则弹窗确定按钮
    determine_xzwx:function(data){

      var this_ = this;
      getIticket(function(ticket){
        this_.$axios({
          method: 'post',
          url: "http://"+api+"/api/1.0/rule/ticket",
          headers:{
            'content-type': 'application/json',
            'ticket':ticket
          },
          data: {
            type:data[0].val,
            name:data[1].val,
            regions:data[2].val,
            wechatGroups:data[3].val,
            // onlineOnly:data[4].val
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
    // 修改分配规则
    determine_xzwx_:function(data){
      console.log(data);

      var id = this.popOperaId;
      var arr = this.allocationFormVal.value;
      var val_;
      for(var i=0;i<arr.length;i++){
        if(id == arr[i].id){
          val_ = arr[i].data;
          break;
        };
      };

      var this_ = this;
      getIticket(function(ticket){
        this_.$axios({
          method: 'put',
          url: "http://"+api+"/api/1.0/rule",
          headers:{
            'content-type': 'application/json',
            'ticket':ticket
          },
          data: {
            id:val_.id,
            type:data[0].val!=''?data[0].val:val_.type,
            name:data[1].val!=''?data[1].val:val_.name,
            regions:data[2].val,
            wechatGroups:data[3].val,
            // onlineOnly:data[4].val
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
    // 触发下拉选择事件
    xzwx_selectFun:function(data){
      if(data.said=='分配类型'){
        var this_ = this;
          if(data.val=='0'){
            this_.popOperaVal_xzwx=this_.groupVal;
          }else if(data.val=='1'){
            this_.popOperaVal_xzwx=this_.salesVal;
          }
      };
    },
    // 触发下拉选择事件
    xzwx_selectFun_:function(data){
      if(data.said=='分配类型'){
        var this_ = this;
          if(data.val=='0'){
            this_.popOperaVal_xzwx_=this_.groupVal;
          }else if(data.val=='1'){
            this_.popOperaVal_xzwx_=this_.salesVal;
          }
      };
    },
    // 删除消息
    detele_tjbz:function(){
      var this_ = this;
      getIticket(function(ticket){
        this_.$axios({
          method: 'DELETE',
          url: "http://"+api+"/api/1.0/rule/"+this_.popOperaId,
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
.allocation{
  width: 95%;
  height: 100%;
  background: #fff;
  box-sizing: border-box;
  padding: 30px;
}
.allocationTop{
  margin-bottom: 10px;
  display: flex;
  flex-direction:row;
  justify-content:space-between;
}
.allocationTop>div{
  display: flex;
  flex-direction:row;
  justify-content:space-between;
  align-items:flex-end;
}
.allocationContainer{
  width: 100%;
}
</style>
