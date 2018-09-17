<template>
<div style="width:95%;height:100%;display: flex;flex-direction:row;">
  <div style="width:15%;height:100%;box-sizing: border-box;padding-right:5px;border-right:3px solid rgba(250,251,253,1);">
    <div style="position: relative;background:#fff;width:100%;height:100%;box-sizing: border-box;padding:20px 0 50px 0;overflow: auto;">
        <!-- @clickSele="departmentSearchFun"
        @clickSuspen="depSuspenFun" -->
      <treeOptions
        :treesVal="treeVal"
        :suspenSWH="true"
        :structureSWH="false"
        :seleLE="角色筛选"
        @clickSuspen="depSuspenFun"
        @clickSele="clickSeleSearchFun"
      />
      <button class="exit_btn" style="position: absolute;bottom:20px;left:50%;transform: translate(-50%, 0);" @click="popOperaShowFun(0)">新建角色</button>
    </div>
  </div>
  <div class="account" style="width:85%">
    <div style="width:100%;height:30px;">
      <div style="width:250px; float:left;">
        <!-- 面包屑导航组件 -->
        <!-- :crumbsVal="[{title:'成员详情',parameter:0},{title:'功能权限',parameter:1},{title:'菜单分配',parameter:2}]" -->
        <crumbsModule
          :crumbsCorres="crumbsId"
          :crumbsVal="[{title:'功能权限',parameter:1},{title:'菜单分配',parameter:2}]"
          :crumbsType="'subscript'"
          @crumbsFun='crumbsswitch'
        />
      </div>
    </div>
    <div class="accountTop">
      <div>
        <!-- 搜索组件 -->
        <!-- <searchModule
          :searchId="'accountSearchId'"
          :searchVal="account_searchVal"
          @searchFun="accountSearchFun"
        /> -->
      </div>
      <div style="position: relative;">
        <button class="exit_btn" style="margin-right:20px;" v-if="crumbsId==0 && 角色筛选!=''"  @click="popOperaShowFun(2)">添加成员</button>
        <button class="exit_btn" style="margin-right:20px;"  v-if="crumbsId==0" @click="popOperaShowFun(1)">批量移动</button>
        <button class="exit_btn"  v-if="crumbsId==0" @click="popOperaShowFun(0)">新建角色</button>
        <button class="exit_btn" style="position: absolute;top:0;right:0;" v-if="crumbsId==1"  @click="getpermisId_0">确认保存</button>
        <button class="exit_btn" style="position: absolute;top:0;right:0;" v-if="crumbsId==2"  @click="getpermisId_1">确认保存</button>
      </div>
    </div>

    <!-- 成员列表详情 -->
    <div class="accountContainer" v-if="crumbsId==0">
      <!-- 列表组件 -->
      <formModule
        :checkboxGroup=true
        :separationBorder=true
        :showHeight=580
        :formVal="accountFormVal"
        @formClickFun="formClickFun"
        ref="accountForm"
      />
      <div style="width:100%;height:30px;"></div>
      <!-- 分页组件 -->
      <pagingModule
        :totalNum=totalNumber
        :currentNum=currentNum
        :showValNum=showValNum
        @pagingFun="accountPagingFun"
      />
    </div>

    <!-- 权限数据列表 -->
    <div class="accountContainer" v-if="crumbsId==1">
      <permissions
        ref="permisId_0"
        :permisId="'permisId_0'"
        :permisVal="permisVal_"
      />
    </div>

    <!-- 权限数据列表 -->
    <div class="accountContainer" v-if="crumbsId==2">
      <permissions
        ref="permisId_1"
        :permisId="'permisId_1'"
        :permisVal="permisVal_1"
      />
    </div>

    <!-- 新建角色 -->
    <popOperation
      v-if="popOperaShow==0"
      :title="'新建角色'"
      :popOperaVal="popOperaVal_xzwx"
      @determine="determine_xzwx"
      @cancel="popOperaHideFun"
    /> 
    <!-- 批量复制 -->
    <popOperation
      v-if="popOperaShow==1"
      :title="'批量复制'"
      :popOperaVal="popOperaVal_plfz"
      @determine="determine_plfz"
      @cancel="popOperaHideFun"
    />

    <popOperation
      v-if="popOperaShow==3"
      :title="'是否确定删除角色'"
      :popOperaVal="null"
      @determine="detele_tjbz"
      @cancel="popOperaHideFun"
    />


    <!-- 添加成员 -->
    <maskPopModule  v-if="popOperaShow==2">
      <twoWayData
        :title="'添加成员'"
        :dataLocaValue="dataLocaVal_"
        @determine="determine_tjcy"
        @cancel="popOperaHideFun"
      />
    </maskPopModule>
  </div>
</div>
</template>

<script>
// 树状选项组件
import treeOptions from '@/components/treeOptions_2'
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
// 遮罩组件
import maskPopModule from '@/components/maskPopModule'
// 面包屑切换组件
import crumbsModule from '@/components/crumbsModule'
// 权限分配组件
import permissions from '@/components/permissions'
// 双向数据切换组件
import twoWayData from '@/components/twoWayData'

export default {
  data() {
    return {
      // 
      treeVal:[],
      // 面包屑导航数据
      crumbsId:1,
      // 搜索组件数据
      account_searchVal:{},
      // 导出的数据
      accountDataVal:'1,2,3,4\n5,6,7,8\n',
      // 列表数据
      accountFormVal:{title:[
        { name:'姓名',      type:'string',      tag:'xm',     width:15  },
        { name:'昵称',      type:'string',      tag:'nc',     width:15  },
        { name:'电话',      type:'string',      tag:'dh',    width:20  },
        { name:'是否停用',  type:'onclick',      tag:'sfty',    width:20  },
        { name:'操作',      type:'onclick',     tag:'cz',     width:20  }
      ],value:[]},
      // 角色筛选条件
      角色筛选:'',
      // 总数据页码
      totalNumber:0,
      // 第几页
      currentNum:1,
      // 显示个数
      showValNum:10,
      // 控制弹窗显示变量
      popOperaShow:-1,
      // 新建角色弹窗展示数据
      popOperaVal_xzwx:[{
        title:'角色名称',
        type:'input',
        prompt:'请输入角色名称',
      }],
      // 批量复制弹窗展示数据
      popOperaVal_plfz:[],
      // 添加好友弹窗数据
      dataLocaVal_:{},
      // 功能权限列表数据
      permisVal_:[],  
      // 菜单列表数据
      permisVal_1:[],
      // 操作角色数据
      aSinglGroup:{},
    }
  },
  components: { searchModule,exportData,formModule,pagingModule,popOperation,crumbsModule,permissions,maskPopModule,twoWayData,treeOptions  },
  mounted() {
    // 初始获取下拉选项类型
    this.getdropValFun();
    // 初始获取列表数据
    this.conditionRequest();
    // 初始获取功能列表
    this.getFunctionIdFun();
    // 获取菜单列表
    this.getFunctionIdFun_1();
  },
  methods:{
    // 切换面包屑
    crumbsswitch:function(data){
      this.crumbsId=parseInt(data);
    },
    // 搜索组件回调函数
    accountSearchFun:function(data){
      this.角色筛选=data.职务角色筛选;
      // 第一页
      this.currentNum=1;
      // 初始获取功能列表
      this.getFunctionIdFun();
      // 获取菜单列表
      this.getFunctionIdFun_1();
      // 获取添加成员数据
      this.addMembersFun();

      if(this.crumbsId==0){
        // 搜索成员详情
        this.conditionRequest();
      }else if(this.crumbsId==1){
        // 权限管理
        this.getFunctionIdFun();
      }else if(this.crumbsId==2){
        // 菜单管理
        this.getFunctionIdFun_1();
      }

    },
    // 分页回调函数
    accountPagingFun:function(data){
      // 判断是否搜索触发
      if(data.conversion){  this.currentNum=data.conversion  }else{this.currentNum=1;}
      if(data.valShowNum){  this.showValNum=data.valShowNum  };
      this.conditionRequest();
      return;
    },
    // 条件请求数据
    conditionRequest:function(){
      this.accountValFun({
        pageNum:this.currentNum,
        pageSize:this.showValNum,
        roleId:this.角色筛选,
      });
    },
    // 获取列表数据
    accountValFun:function(obj={
      pageNum:'',
      pageSize:'',
      roleId:'',
    }){
      var this_ = this;
      getIticket(function(ticket){
        this_.$axios.get(
          "http://"+api+"/api/1.0/user/page/ticket"+'?pageNum='+obj.pageNum+'&pageSize='+obj.pageSize+'&roleId='+obj.roleId,
          {headers:{
            'content-type': 'application/x-www-form-urlencoded',
            'ticket':ticket
          }}
        )
        .then((response)=>{
          if(response.data.success){
            var accountVal = response.data.result;
            if(accountVal){
              // 设置总页数
              var page_n=Math.ceil(accountVal.total/this_.showValNum);
              if(page_n==0){page_n=1};
              this_.totalNumber=page_n;
              // 对象数据转换成列表数据个数
              this_.dataConversionFun(accountVal.content);
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
        { name:'姓名',      type:'string',      tag:'xm',     width:15  },
        { name:'昵称',      type:'string',      tag:'nc',     width:15  },
        { name:'电话',      type:'string',      tag:'dh',    width:20  },
        { name:'是否停用',  type:'onclick',      tag:'sfty',    width:20  },
        { name:'操作',      type:'onclick',     tag:'cz',     width:20  }
      ],value_=[];
      // 便利数据
      for(var i=0;i<data.length;i++){
        value_.push({
          id:data[i].accountId,
          xm:data[i].name,
          nc:data[i].nickname,
          dh:data[i].account.username,
          sfty: data[i].account.state=='0'?
                '正常':
                data[i].account.state=='1'?
                '冻结':
                data[i].account.state=='2'?
                '锁定':
                data[i].account.state=='3'?
                '未激活':'',
          cz:'编辑'
        });
      };
      // 赋值
      this.accountFormVal={
        title:title,
        value:value_
      };
    },
    // 获取搜索组件下拉选项类型
    getdropValFun:function(){
      var this_ = this;
      getIticket(function(ticket){
        this_.$axios.get(
          "http://"+api+"/api/1.0/role/find/ticket",
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
      var this_ = this;
      var obj={
          title:'',                           //搜索title
          s_nameShow:true,                    //子标题显示
          search:true,                        //搜索按钮（true为使用，false为不使用）
          reset:false,                        //重置按钮（true为使用，false为不使用）
          timeChoose:{                        //日期区间筛选
            bool:false,                       //开关
            id:'moren'                        //组件id
          },
          fill:[{ type:'select',s_name:'职务角色筛选',value:[{ prompt:'请选择角色',  val:'' }] }]
      },obj_2=[{
          title:'批量复制',
          type:'select',
          prompt:'请先选择角色',
          selectValArr:[]
      }];

      for(var i=0;i<data.length;i++){
        // 搜索角色
        obj.fill[0].value.push({
          prompt:data[i].name,
          val:data[i].id
        });
        // 批量复制
        obj_2[0].selectValArr.push({
          text:data[i].name,
          val:data[i].id
        });
      };
      // 搜索栏
      this.account_searchVal=obj;
      // 批量复制
      this.popOperaVal_plfz=obj_2;

      // 递归获取数据
      function recursive(data){
        var arr = [];
        for(var i=0;i<data.length;i++){
          arr.push({
            id:data[i].id,
            title:data[i].name,
            type:'',
            suspenArr:['编辑角色','删除角色'],
            children: [],
          });
        };

        return arr;
      };
      this_.treeVal=recursive(data);

    },
    // 点击表信息触发
    formClickFun:function(data){
      console.log(data);
    },
    // 弹窗展示
    popOperaShowFun:function(e){
      this.popOperaShow=e;
    },
    // 弹窗隐藏
    popOperaHideFun:function(){
      this.popOperaShowFun(-1);
    },
    // 新建角色弹窗确定按钮
    determine_xzwx:function(data){
      var this_ = this;
      getIticket(function(ticket){
        this_.$axios({
          method: 'post',
          url: "http://"+api+"/api/1.0/role/ticket",
          headers:{
            'content-type': 'application/json',
            'ticket':ticket
          },
          data: {
            name: data[0].val,
          }
        })
        .then((response)=>{
          if(response.data.success){
            // 跳转第一页
            this_.currentNum=1;
            // 重新请求数据
            this_.getdropValFun();
            // 关闭弹窗
            this_.popOperaShowFun(-1);
            // 
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
    // 批量复制弹窗确定按钮
    determine_plfz:function(data){
      var this_ = this;
      getIticket(function(ticket){
        this_.$axios({
          method: 'post',
          url: "http://"+api+"/api/1.0/account/role/"+data[0].val,
          headers:{
            'content-type': 'application/json',
            'ticket':ticket
          },
          data:this_.$refs.accountForm.selectedIdArr
        })
        .then((response)=>{
          if(response.data.success){
            // 跳转第一页
            this_.currentNum=1;
            // 重新请求数据
            this_.accountValFun();
            // 关闭弹窗
            this_.popOperaShowFun(-1);
            // 
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
    // 添加成员弹窗确定按钮
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
          url: "http://"+api+"/api/1.0/account/role/"+this_.角色筛选,
          headers:{
            'content-type': 'application/json',
            'ticket':ticket
          },
          data:arr
        })
        .then((response)=>{
          if(response.data.success){
            alert(response.data.msg);
            this_.popOperaHideFun();
            this_.currentNum=1;
            this_.conditionRequest();
          }else{
            alert(response.data.msg);
          }
        })
        .catch((error)=>{
          console.log(error);
        });
      });

    }, 
    // 获取功能列表
    getFunctionIdFun:function(){
      var this_ = this;
      getIticket(function(ticket){
        this_.$axios.get(
          "http://"+api+"/api/1.0/groups/function/group/role"+'?roleId='+this_.角色筛选,
          {headers:{
            'content-type': 'application/x-www-form-urlencoded',
            'ticket':ticket
          }}
        )
        .then((response)=>{
          if(response.data.success){
            var val = response.data.result;
            this_.permisVal_ = val;
          }else{
            alert(response.data.msg);
          }
        })
        .catch((error)=>{
          console.log(error);  
        });
      });
    },
    // 获取菜单列表
    getFunctionIdFun_1:function(){
      var this_ = this;
      getIticket(function(ticket){
        this_.$axios.get(
          "http://"+api+"/api/1.0/groups/menu/group/role"+'?roleId='+this_.角色筛选,
          {headers:{
            'content-type': 'application/x-www-form-urlencoded',
            'ticket':ticket
          }
        }).then((response)=>{
          if(response.data.success){
            var val = response.data.result;
            this_.permisVal_1 = val;
          }else{
            alert(response.data.msg);
          }
        }).catch((error)=>{
          console.log(error);  
        });
      });
    },
    // 获取功能权限选中的id
    getpermisId_0:function(){
      var idArr = this.$refs.permisId_0.getAllFunid();
      var this_ = this;
      getIticket(function(ticket){
        this_.$axios({
          method: 'put',
          url: "http://"+api+"/api/1.0/role/permission/"+this_.角色筛选+'/1',
          headers:{
            'content-type': 'application/json',
            'ticket':ticket
          },
          data: idArr
        })
        .then((response)=>{
          if(response.data.success){
            alert(response.data.msg);
            this_.getFunctionIdFun();
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
    getpermisId_1:function(){
      var idArr = this.$refs.permisId_1.getAllFunid();
      var this_ = this;
      getIticket(function(ticket){
        this_.$axios({
          method: 'put',
          url: "http://"+api+"/api/1.0/role/permission/"+this_.角色筛选+'/0',
          headers:{
            'content-type': 'application/json',
            'ticket':ticket
          },
          data: idArr
        })
        .then((response)=>{
          if(response.data.success){
            alert(response.data.msg);
            this_.getFunctionIdFun_1();
          }else{
            alert(response.data.msg);
          }
        })
        .catch((error)=>{
          console.log(error);
        });
      });
    },
    // 获取添加成员数据成员
    addMembersFun:function(){
      var this_ = this;
      getIticket(function(ticket){
        this_.$axios({
          method: 'get',
          url: "http://"+api+"/api/1.0/user/find/role",
          headers:{
            'content-type': 'application/json',
            'ticket':ticket
          },
          params:{
            roleId:this_.角色筛选
          } 
        })
        .then((response)=>{
          if(response.data.success){
            var obj = {
              left:[],
              right:[],
            };
            var val = response.data.result;

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
            alert(response.data.msg);
          }
        })
        .catch((error)=>{
          console.log(error);
        });
      });
    },
    // 
    clickSeleSearchFun:function(data){
      this.角色筛选 = data.id;
      // console.log(data);
      // 权限管理
      this.getFunctionIdFun();
      // 菜单管理
      this.getFunctionIdFun_1();
    },  
    // 
    depSuspenFun:function(data){
      console.log(data);
      if(data.text == '删除角色'){
        this.aSinglGroup=data;
        this.popOperaShow=3;
      };
    },
    // 删除角色函数
    detele_tjbz:function(data){
      var this_ = this;
      getIticket(function(ticket){
        this_.$axios({
          method: 'delete',
          url: "http://"+api+"/api/1.0/role/"+this_.aSinglGroup.id,
          headers:{
            'content-type': 'application/json',
            'ticket':ticket
          }
        })
        .then((response)=>{
          if(response.data.success){
            this_.aSinglGroup = {};
            // 重新请求数据
            this_.getdropValFun();
            // 关闭弹窗
            this_.popOperaShowFun(-1);
            // 
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
.account{
  width: 95%;
  height: 100%;
  background: #fff;
  box-sizing: border-box;
  padding: 30px;
}
.accountTop{
  margin-bottom: 10px;
  display: flex;
  flex-direction:row;
  justify-content:space-between;
}
.accountTop>div{
  display: flex;
  flex-direction:row;
  justify-content:space-between;
  align-items:flex-end;
}
.accountContainer{
  width: 100%;
}
</style>
