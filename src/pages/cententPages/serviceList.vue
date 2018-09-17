<template>
  <div class="serviceList">
    <div class="serviceListTop">
      <div>
        <!-- 搜索组件 -->
        <searchModule
          :searchId="'serviceListSearchId'"
          :searchVal="serviceList_searchVal"
          @searchFun="serviceListSearchFun"
        />
      </div>
      <div>
        <button class="exit_btn" style="margin-right:20px;" @click="popOperaShowFun(0)">新增客服</button>
        <button class="exit_btn" @click="popOperaShowFun(1)">批量分组</button>
      </div>
    </div>
    <div class="serviceListContainer">
      <!-- 列表组件 -->
      <formModule
        :checkboxGroup=true
        :separationBorder=true
        :showHeight=formHeight_
        :formVal="serviceListFormVal"
        @formClickFun="formClickFun"
        ref="serviceListForm"
      />
      <div style="width:100%;height:30px;"></div>
      <!-- 分页组件 -->
      <pagingModule
        :totalNum=totalNumber
        :currentNum=currentNum
        :showValNum=showValNum
        @pagingFun="serviceListPagingFun"
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

    <!-- 新增客服弹窗 -->
    <maskPopModule  v-if="popOperaShow==0">
      <twoWayData
        :title="'新增客服'"
        :dataLocaValue="dataLocaVal_"
        @determine="determine_tjcy"
        @cancel="popOperaHideFun"
      />
    </maskPopModule>

    <!-- 聊天记录 -->
    <chatRecord
      v-if="popOperaShow==3"
      :chatRecordType="'sellerId'"
      :listBool="true"
      :id="imIdObj.id"
      @cancel="cancel_func"
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
// 遮罩组件
import maskPopModule from '@/components/maskPopModule'
// 双向数据切换组件
import twoWayData from '@/components/twoWayData'
export default {
  data() {
    return {
      // 搜索组件数据
      serviceList_searchVal:{},
      // 导出的数据
      serviceListDataVal:'1,2,3,4\n5,6,7,8\n',
      // 列表数据
      serviceListFormVal:{title:[
        { name:'微信',    type:'arry',      tag:'wx',     width:10  },
        { name:'微信id',  type:'string',    tag:'wxid',   width:20  },
        { name:'微信名',  type:'string',    tag:'wxm',    width:15  },
        { name:'微信号',  type:'string',    tag:'wxh',    width:15  },
        { name:'类型',    type:'string',    tag:'lx',     width:10  },
        { name:'备注',    type:'onclick',   tag:'bz',     width:10  },
        { name:'操作',    type:'onclick',   tag:'cz',     width:10  }
      ],value:[]},
      // 列表高度
      formHeight_:0,
      // 客服名称条件
      客服名称:'',
      // 客服分组
      客服分组:'',
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
        {  title:'微信号',  type:'input',  prompt:'请输入微信号',  },
        {  title:'微信昵称',  type:'input',  prompt:'请输入微信昵称',  },
        {  title:'选择微信用途',  type:'select',  prompt:'请选择微信用途',  
           selectValArr:[{text:'风控',val:'0'},{text:'分流',val:'1'},{text:'群控',val:'2'}]}
      ],
      // 批量分组弹窗展示数据
      popOperaVal_plfz:[
        {  title:'选择微信分组',  type:'select',  prompt:'请选择微信分组',  selectValArr:[]  }
      ],
      // 添加/编辑备注弹窗展示数据
      popOperaVal_tjbz:[
        {  title:'微信备注信息',  type:'textarea',  max:20,  prompt:'最大输入20字',  },
      ],
      // 新增客服弹窗数据
      dataLocaVal_:{},
      // 销售角色数据
      salesRoleVal:{},
      // 聊天数据信息
      imIdObj:{},
    }
  },
  components: { searchModule,exportData,formModule,pagingModule,popOperation,chatRecord,maskPopModule,twoWayData  },
  watch:{
    serviceList_searchVal:{
      handler(newVal, oldVal){
        // 计算列表高度
        var this_ = this;
        setTimeout(function(){
          this_.formHeight_ = formHeight($('.serviceListTop').height());
        },50);
      },
      deep:true
    },
  },
  mounted() {
    // 计算列表高度
    this.formHeight_ = formHeight($('.serviceListTop').height());
    // 初始获取下拉选项类型
    this.getdropValFun();
    // 初始获取列表数据
    this.conditionRequest();
    // 获取分组信息
    this.getdropValFun2();
  },
  methods:{
    // 搜索组件回调函数
    serviceListSearchFun:function(data){
      this.客服名称=data.客服名称;
      this.客服分组=data.客服分组;
      this.currentNum=1;
      this.conditionRequest();
    },
    // 分页回调函数
    serviceListPagingFun:function(data){
      // 判断是否搜索触发
      if(data.conversion){  this.currentNum=data.conversion  }else{this.currentNum=1;}
      if(data.valShowNum){  this.showValNum=data.valShowNum  };
      this.conditionRequest();
    },
    // 条件请求数据
    conditionRequest:function(){
      this.serviceListValFun({
        pageNum:this.currentNum,
        pageSize:this.showValNum,
        name:this.客服名称,
        groupsId:this.客服分组,
      });
    },
    // 获取微信数据数据
    serviceListValFun:function(obj={
      pageNum:'',
      pageSize:'',
      name:'',
      groupsId:'',
    }){
      var this_ = this;
      getIticket(function(ticket){
        this_.$axios.get(
          "http://"+api+"/api/1.0/user/page/seller/ticket"+'?pageNum='+obj.pageNum+'&pageSize='+obj.pageSize+'&name='+obj.name+'&groupsId='+obj.groupsId,
          {headers:{
            'content-type': 'application/x-www-form-urlencoded',
            'ticket':ticket
          }}
        )
        .then((response)=>{
          if(response.data.success){
            var serviceListVal = response.data.result;
            if(serviceListVal){
              // 设置总页数
              var page_n=Math.ceil(serviceListVal.total/this_.showValNum);
              if(page_n==0){page_n=1};
              this_.totalNumber=page_n;
              // 对象数据转换成列表数据个数
              this_.dataConversionFun(serviceListVal.content);
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
        { name:'登入账号',    type:'string',      tag:'drzh',     width:20  },
        { name:'姓名',  type:'string',    tag:'xm',   width:20  },
        { name:'昵称',  type:'string',    tag:'nc',    width:20  },
        { name:'电话',  type:'string',    tag:'dh',    width:20  },
        { name:'聊天记录',    type:'onclick',   tag:'cz',     width:20  }
      ],value_=[];
      // 便利数据
      for(var i=0;i<data.length;i++){
        value_.push({
          id:data[i].accountId,
          drzh:data[i].account.username,
          xm:data[i].name,
          nc:data[i].nickname,
          dh:data[i].account.phone,
          cz:'聊天记录'
        });
      };
      // 赋值
      this.serviceListFormVal={
        title:title,
        value:value_
      };
    },
    // 获取搜索组件下拉选项类型
    getdropValFun:function(){
      var this_ = this;
      getIticket(function(ticket){
        this_.$axios({
          method: 'get',
          url: "http://"+api+"/api/1.0/role/seller",
          headers:{
            'content-type': 'application/json',
            'ticket':ticket
          }
        })
        .then((response)=>{
          if(response.data.success){
            // 获取销售角色对象信息
            this_.salesRoleVal = response.data.result;
            this_.$axios({
              method: 'get',
              url: "http://"+api+"/api/1.0/user/find/role",
              headers:{
                'content-type': 'application/json',
                'ticket':ticket
              },
              params:{
                roleId:this_.salesRoleVal.id
              }
            })
            .then((response_)=>{
              if(response_.data.success){
                // 获取客服数据列表
                var obj = {
                  left:[],
                  right:[],
                };
                var val = response_.data.result;
                for(var i=0;i<val.length;i++){
                  if(val[i].selected){
                    obj.right.push({
                      title:val[i].name,
                      id:val[i].accountId,
                    });
                  }else{
                    obj.left.push({
                      title:val[i].name,
                      id:val[i].accountId,
                    });
                  };
                };
                this_.dataLocaVal_ = obj;
              }else{
                alert(response_.data.msg);
              }
            })
            .catch((error)=>{
              console.log(error);
            });
          }else{
            alert(response.data.msg);
          }
        })
        .catch((error)=>{
          console.log(error);
        });
      });
    },
    getdropValFun2:function(){
      var this_ = this;
      getIticket(function(ticket){
        this_.$axios({
          method: 'get',
          url: "http://"+api+"/api/1.0/select/sellerListPage",
          headers:{
            'content-type': 'application/json',
            'ticket':ticket
          }
        })
        .then((response)=>{
          if(response.data.success){
            var arr = response.data.result.groups;
            var obj = {
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
                { type:'select',  s_name:'客服分组',  value:[{prompt:'请选择分组',  val:''}]  }
              ]
            };
            var obj2 = [
              {  title:'选择微信分组',  type:'select',  prompt:'请选择微信分组',  selectValArr:[]  }
            ];

            for(var i=0; i<arr.length; i++){
              obj.fill[1].value.push({
                prompt:arr[i].name,
                val:arr[i].id,
              });
              obj2[0].selectValArr.push({
                text:arr[i].name,
                val:arr[i].id,
              });
            };

            this_.serviceList_searchVal = obj;
            this_.popOperaVal_plfz = obj2;
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

    },
    // 点击表信息触发
    formClickFun:function(data){
      if(data.type=='bz'){
        // 打开备注弹窗
        this.popOperaShowFun(2);
      }else if(data.type=='cz'){
        // this.imIdObj
        var arr = this.serviceListFormVal.value;
        for(var i=0;i<arr.length;i++){
          if(arr[i].id == data.id){
            this.imIdObj = arr[i];
          };
        };
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
      var this_ = this;
      getIticket(function(ticket){
        this_.$axios({
          method: 'post',
          url: "http://"+api+"/api/1.0/wechat",
          headers:{
            'content-type': 'application/json',
            'ticket':ticket
          },
          data: {
            wxno: data[0].val,
            nickname:data[1].val,
            type: data[2].val,
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
          url: "http://"+api+"/api/1.0/groups/seller/"+data[0].val,
          headers:{
            'content-type': 'application/json',
            'ticket':ticket
          },
          data: this_.$refs.serviceListForm.selectedIdArr
        }).then((response)=>{
          if(response.data.success){
            this_.conditionRequest();
            // 
            alert('批量分组成功');
            // 关闭弹窗
            this_.popOperaShowFun(-1);
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
      console.log(data);
    },
    // 关闭聊天记录窗口
    cancel_func:function(){
      this.popOperaShow=-2;
    },
    // 新增客服确定按钮
    determine_tjcy:function(data){
      var val = data.rightNewVal;
      var arr = [];
      for(var i=0;i<val.length;i++){
        arr.push(val[i].id);
      };
      var this_ = this;
      getIticket(function(ticket){
        this_.$axios({
          method: 'put',
          url: "http://"+api+"/api/1.0/account/role/seller/"+this_.salesRoleVal.id,
          headers:{
            'content-type': 'application/json',
            'ticket':ticket
          },
          data:arr
        })
        .then((response)=>{
          if(response.data.success){
            alert('更新成功');
            // 初始获取下拉选项类型
            this_.getdropValFun();
            // 初始获取列表数据
            this_.conditionRequest();
            // 关闭弹窗
            this_.popOperaShow = -1;
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
.serviceList{
  width: 95%;
  height: 100%;
  background: #fff;
  box-sizing: border-box;
  padding: 30px;
}
.serviceListTop{
  margin-bottom: 10px;
  display: flex;
  flex-direction:row;
  justify-content:space-between;
}
.serviceListTop>div{
  display: flex;
  flex-direction:row;
  justify-content:space-between;
  align-items:flex-end;
}
.serviceListContainer{
  width: 100%;
}
</style>
