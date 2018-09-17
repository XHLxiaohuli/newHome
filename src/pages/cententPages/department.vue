<template>
  <div style="width:95%;height:100%;display: flex;flex-direction:row;">
  <div style="width:15%;height:100%;box-sizing: border-box;padding-right:5px;border-right:3px solid rgba(250,251,253,1);">
    <div style="background:#fff;width:100%;height:100%;box-sizing: border-box;padding:20px 0;overflow: auto;">
      <!-- 树状选项组件 -->
      <!-- <treeOptions
        ref="department_0"
        @clickSele="departmentSearchFun"
        @clickSuspen="depSuspenFun"
        :treeId="'treeId_0'"
        :treesVal="treeVal"
        :chilsWArr="chilsWArr_"
      /> -->
      <treeOptions
        @clickSele="departmentSearchFun"
        @clickSuspen="depSuspenFun"
        :seleLE="架构Id"
        :treesVal="treeVal"
        :chilsWArr="chilsWArr_"
        :suspenSWH="true"
        :structureSWH="true"
      />
    </div>
  </div>
  <div class="department" style="width:85%">
    <div class="departmentTop">
      <div>
        <!-- 搜索组件 -->
        <!-- <searchModule
          :searchId="'departmentSearchId'"
          :searchVal="department_searchVal"
          @searchFun="departmentSearchFun"
        /> -->
      </div>
      <div>
        <button class="exit_btn" 
                style="margin-right:20px;"  
                @click="batchRemoved"  
                v-if="showBtn.type && showBtn.type!=4 && showBtn.type!=''">批量移出</button>
        <button class="exit_btn" @click="popOperaShowFun(0)">批量加入</button>
      </div>
    </div>
    <div class="departmentContainer">
      <!-- 列表组件 -->
      <formModule
        v-if="formModuleShow"
        :checkboxGroup=true
        :separationBorder=true
        :showHeight=formHeight_
        :formVal="departmentFormVal"
        @formClickFun="formClickFun"
        ref="departmentForm"
      />
      <div style="width:100%;height:30px;"></div>
      <!-- 分页组件 -->
      <pagingModule
        :totalNum=totalNumber
        :currentNum=currentNum
        :showValNum=showValNum
        @pagingFun="departmentPagingFun"
      />
    </div>
    <!-- 批量加入 -->
    <maskPopModule v-if="popOperaShow==0">
      <div style="width:400px;height:600px;background:#fff;box-sizing: border-box; padding: 30px;">
        <div style="width:250px;height:450px;overflow:auto;">
          <treeOptions
            @clickSele="clickSeleFun"
            :seleLE="架构Id_2"
            :treesVal="treeVal_1"
            :suspenSWH="false"
            :structureSWH="true"
          />
        </div>
        <div class="popOperation_b2">
          <button class="exit_btn" 
          style="width:80px;height:40px;margin-right:50px;background:rgba(199,199,199,1);" @click="popOperaHideFun">取消</button>
          <button class="exit_btn" 
          style="width:80px;height:40px;" @click="batchJoin">确定</button>
        </div>
      </div>
    </maskPopModule>
    <!-- 添加成员 -->
    <popOperation
      v-if="popOperaShow==2"
      :title="'添加成员'"
      :popOperaVal="pop_addmembers"
      @determine="addmembersFun"
      @cancel="popOperaHideFun"
    />
    <!-- 添加部门 -->
    <popOperation
      v-if="popOperaShow==3"
      :title="'添加部门'"
      :popOperaVal="pop_adddepartment"
      @determine="departmentFun"
      @cancel="popOperaHideFun"
    />
    <!-- 添加岗位 -->
    <popOperation
      v-if="popOperaShow==4"
      :title="'添加岗位'"
      :popOperaVal="pop_addjobs"
      @determine="jobsFun"
      @cancel="popOperaHideFun"
    />
  </div>
  </div>
</template>

<script>
// 树状选项组件
// import treeOptions from '@/components/treeOptions'
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
export default {
  data() {
    return {
      formModuleShow:true,
      // 按钮显示状态
      showBtn:{},
      // 树状图数据结构
      treeVal:[],
      chilsWArr_:[],
      treeVal_1:[],
      // 悬浮数据
      depSuspenVal:'',
      // 点击弹窗树状数据回调数据
      clickSeleVal:'',
      // 添加成员弹窗数据
      pop_addmembers:[],
      // 添加部门弹窗数据
      pop_adddepartment:[],
      // 添加岗位弹窗数据
      pop_addjobs:[
        {
          title:'岗位名称',
          type:'input',
          prompt:'请输入岗位名称',
        }
      ],
      // 搜索组件数据
      department_searchVal:{},
      // 导出的数据
      departmentDataVal:'1,2,3,4\n5,6,7,8\n',
      // 列表数据
      departmentFormVal:{title:[
        { name:'登入账号',    type:'string',    tag:'drzh',     width:20  },
        { name:'姓名',  type:'string',    tag:'xm',   width:15  },
        { name:'昵称',  type:'string',    tag:'nc',   width:15  },
        { name:'电话',  type:'string',    tag:'dh',    width:15  },
        { name:'操作',    type:'onclick',   tag:'cz',     width:35  }
      ],value:[]},
      // 列表高度
      formHeight_:0,
      // 架构类型条件
      架构类型:'',
      // 架构Id条件
      架构Id:'',
      架构Id_2:'',
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
  components: { treeOptions,searchModule,exportData,formModule,pagingModule,popOperation,maskPopModule  },
  watch:{
    department_searchVal:{
      handler(newVal, oldVal){
        // 计算列表高度
        var this_ = this;
        setTimeout(function(){
          this_.formHeight_ = formHeight($('.departmentTop').height());
        },50);
      },
      deep:true
    },
  },
  mounted() {
    // 计算列表高度
    this.formHeight_ = formHeight($('.departmentTop').height());
    // 初始获取下拉选项类型
    // this.getdropValFun();
    // 初始获取列表数据
    this.conditionRequest();
    // 获取树状选项数据
    this.gettreeValFun();
    // 获取角色数据
    this.getjueseFun();
  },
  methods:{
    // 获取角色列表
    getjueseFun:function(){
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
              this_.characterData(response.data.result);
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
    // 角色数据转换格式
    characterData:function(data){
      // 添加部门数据
      var obj = [
        {  title:'部门名称',  type:'input',  prompt:'请输入部门名称',  },
        // {  type:'specialSelect',  title:'请选择部门角色',prompt:'请选择部门角色',selectedArr:[], screeningArr:[]  }
      ];
      // 添加成员
      var obj2=[
        {  title:'名称',  type:'input',  prompt:'请输入名称',  },
        {  title:'昵称',  type:'input',  prompt:'请输入昵称',  },
        {  title:'账号',  type:'input',  prompt:'请输入账号',  },
        {  title:'密码',  type:'input',  prompt:'请输入密码',  },
        {  title:'电话',  type:'input',  prompt:'请输入电话',  },
        {  type:'specialSelect',  title:'请选择成员角色',prompt:'请选择成员角色', selectedArr:[], screeningArr:[]  }
      ];

      for(var i=0;i<data.length;i++){
        // obj[1].screeningArr.push({
        //   text:data[i].name,
        //   val:data[i].id
        // });
        obj2[5].screeningArr.push({
          text:data[i].name,
          val:data[i].id
        });
      };

      this.pop_adddepartment = obj;
      this.pop_addmembers = obj2;

    },
    // 悬浮点击事件
    depSuspenFun:function(data){
      // 树状数据悬浮按钮点击数据
      this.depSuspenVal=data;
      if(data.text=='添加成员'){
        this.pop_addmembers[5].selectedArr = [];
        this.popOperaShow=2;
      }else if(data.text=='添加部门'){
        // this.pop_adddepartment[1].selectedArr = [];
        this.popOperaShow=3;
      }else if(data.text=='添加岗位'){
        this.popOperaShow=4;
      };
    },
    // 添加成员函数
    addmembersFun:function(data){
      var this_ = this;
      // 获取公钥加密密码
      $.ajax({
        type:"get",
        url:"http://"+api+"/api/1.0/pem/publicKey",
        contentType: 'application/x-www-form-urlencoded',
        success:function (res) {
          // RSA加密(公钥)
          var pubkey=res.result;
          var encrypt = new JSEncrypt();
              encrypt.setPublicKey(pubkey);
          // 密码加密
          var passwordRas = encrypt.encrypt(data[3].val);
          // 保存新成员
          getIticket(function(ticket){
            this_.$axios({
              method: 'post',
              url: "http://"+api+"/api/1.0/account",
              headers:{
                'content-type': 'application/json',
                'ticket':ticket
              },
              data: {
                username:data[2].val,
                password:passwordRas,
                nickname:data[1].val,
                name: data[0].val,
                phone:data[4].val,
                roleIds:data[5].val,
                organizationId : this_.depSuspenVal.id,
                organizationType : this_.depSuspenVal.type,
              }
            })
            .then((response)=>{
              if(response.data.success){
                
                // 回显示
                this_.gettreeValFun();
                // 关闭弹窗
                this_.popOperaShowFun(-1);
                // 
                alert(response.data.msg);
              }else{
                alert(response.data.msg);
              };
            })
            .catch((error)=>{
              console.log(error);
            });
          });
        },
        error:function (response) {
          console.log('获取公钥失败');
        }
      });
    },
    // 添加部门函数
    departmentFun:function(data){
      var this_ = this;
      getIticket(function(ticket){
        this_.$axios({
          method: 'post',
          url: "http://"+api+"/api/1.0/organization",
          headers:{
            'content-type': 'application/x-www-form-urlencoded',
            'ticket':ticket
          },
          params: {
            parentId:this_.depSuspenVal.id,
            // roleIds:data[1].val,
            parentType:this_.depSuspenVal.type,
            organizationName:data[0].val,
          }
        })
        .then((response)=>{
            if(response.data.success){
              // 回显示
              this_.gettreeValFun();
              // 关闭弹窗
              this_.popOperaShowFun(-1);
              // 
              alert(response.data.msg);
            }else{
              alert(response.data.msg);
            };
        })
        .catch((error)=>{
          console.log(error);
        });
      });
    },
    // 添加岗位函数
    jobsFun:function(data){
      var this_ = this;
      getIticket(function(ticket){
        this_.$axios({
          method: 'post',
          url: "http://"+api+"/api/1.0/organization",
          headers:{
            'content-type': 'application/x-www-form-urlencoded',
            'ticket':ticket
          },
          params: {
            parentId:this_.depSuspenVal.id,
            parentType:this_.depSuspenVal.type,
            organizationName:data[0].val,
          }
        })
        .then((response)=>{
          if(response.data.success){
            // 回显示
            this_.gettreeValFun();
            // 关闭弹窗
            this_.popOperaShowFun(-1);
            // 
            alert(response.data.msg);
          }else{
            alert(response.data.msg);
          };
        })
        .catch((error)=>{
          console.log(error);
        });
      });
    },
    clickSeleFun:function(data){
      this.clickSeleVal=data;
      this.架构Id_2 = data.id;
    },
    // 批量加入
    batchJoin:function(){
      var this_ = this;
      getIticket(function(ticket){
        this_.$axios({
          method: 'put',
          url: "http://"+api+"/api/1.0/organization"+'/'+this_.clickSeleVal.id+'/'+this_.clickSeleVal.type,
          headers:{
            'content-type': 'application/json',
            'ticket':ticket
          },
          data:this_.$refs.departmentForm.selectedIdArr,
        })
        .then((response)=>{
          this_.clickSeleVal='';
          if(response.data.success){
            // 回显示
            this_.conditionRequest();
            // 关闭弹窗
            this_.popOperaShowFun(-1);
            // 
            alert(response.data.msg);
          }else{
            alert(response.data.msg);
          };
        })
        .catch((error)=>{
          console.log(error);
        });
      });
    },
    // 批量移出
    batchRemoved:function(){
      var this_ = this;
      getIticket(function(ticket){
        this_.$axios({
          method: 'delete',
          url: "http://"+api+"/api/1.0/organization"+'/'+this_.showBtn.id+'/'+this_.showBtn.type,
          headers:{
            'content-type': 'application/json',
            'ticket':ticket
          },
          data:this_.$refs.departmentForm.selectedIdArr,
        })
        .then((response)=>{
          this_.clickSeleVal='';
          if(response.data.success){
            // 回显示
            this_.conditionRequest();
            // 关闭弹窗
            this_.popOperaShowFun(-1);
            // 
            alert(response.data.msg);
          }else{
            alert(response.data.msg);
          };
        })
        .catch((error)=>{
          console.log(error);
        });
      });
    },
    // 搜索组件回调函数
    departmentSearchFun:function(data){
      this.showBtn=data;
      this.架构类型=data.type;
      this.架构Id=data.id;
      this.currentNum=1;
      this.conditionRequest();
    },
    // 分页回调函数
    departmentPagingFun:function(data){
      // 判断是否搜索触发
      if(data.conversion){  this.currentNum=data.conversion  }else{this.currentNum=1;}
      if(data.valShowNum){  this.showValNum=data.valShowNum  };
      this.conditionRequest();
      return;
    },
    // 条件请求数据
    conditionRequest:function(){
      // 架构Id为必须参数
      if(this.架构Id==''){return};
      this.departmentValFun({
        pageNum:this.currentNum,
        pageSize:this.showValNum,
        organizationType:this.架构类型,
        organizationId:this.架构Id,
      });
    },
    // 获取微信数据数据
    departmentValFun:function(obj={
      pageNum:'',
      pageSize:'',
      organizationType:'',
      organizationId:'',
    }){
      var this_ = this;
      getIticket(function(ticket){
        this_.$axios.get(
          "http://"+api+"/api/1.0/user/page/organization"+'?pageNum='+obj.pageNum+'&pageSize='+obj.pageSize+'&organizationType='+obj.organizationType+'&organizationId='+obj.organizationId,
          {headers:{
            'content-type': 'application/x-www-form-urlencoded',
            'ticket':ticket
          }}
        )
        .then((response)=>{
          if(response.data.success){
            var departmentVal = response.data.result;
            if(departmentVal){
              // 设置总页数
              var page_n=Math.ceil(departmentVal.total/this_.showValNum);
              if(page_n==0){page_n=1};
              this_.totalNumber=page_n;
              // 对象数据转换成列表数据个数
              this_.dataConversionFun(departmentVal.content);
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
      this.formModuleShow = true;
      var title=[
        { name:'登入账号',    type:'string',    tag:'drzh',     width:20  },
        { name:'姓名',  type:'string',    tag:'xm',   width:15  },
        { name:'昵称',  type:'string',    tag:'nc',   width:15  },
        { name:'电话',  type:'string',    tag:'dh',    width:15  },
        // { name:'操作',    type:'onclick',   tag:'cz',     width:35  }
      ],value_=[];

      // 便利数据
      for(var i=0;i<data.length;i++){
        value_.push({
          id:data[i].accountId,
          drzh:data[i].account.username,
          xm:data[i].name,
          nc:data[i].nickname,
          dh:data[i].account.phone,
          // cz:'编辑成员'
        });
      };

      // 赋值
      this.departmentFormVal={
        title:title,
        value:value_
      };
    },
    // 获取树状选项数据
    gettreeValFun:function(){
      var this_ = this;
      getIticket(function(ticket){
        this_.$axios.get(
          "http://"+api+"/api/1.0/organization/tree/ticket",
          {headers:{
            'content-type': 'application/x-www-form-urlencoded',
            'ticket':ticket
          }}
        )
        .then((response)=>{
          if(response.data.success){
            var val = response.data.result;
            if(val.length>0){
              // 搜索组件选项数据
              this_.dataConvertreeValFun(response.data.result);
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
    // 树状选项数据格式转换
    dataConvertreeValFun:function(data){

      var this_ = this;
      // 递归获取数据
      function recursive(data){
        var arr = [];
        for(var i=0;i<data.length;i++){
          arr.push({
            id:data[i].id,
            title:data[i].name,
            type:data[i].type,
            suspenArr:data[i].type=='4'?
                      ['添加成员','添加部门']:
                      data[i].type=='5'?
                      ['添加成员','添加岗位']:
                      data[i].type=='6'?
                      ['添加成员','移动岗位']:[],
            children: data[i].children && data[i].children.length > 0?
                      recursive(data[i].children):[],
          });
        };

        return arr;
      };
      this_.treeVal=recursive(data);

      function recursive2(data){
        var arr = [];
        for(var i=0;i<data.length;i++){
          arr.push({
            id:data[i].id,
            title:data[i].name,
            type:data[i].type,
            suspenArr:data[i].type=='4'?
                      ['添加成员','添加部门']:
                      data[i].type=='5'?
                      ['添加成员','添加岗位']:
                      data[i].type=='6'?
                      ['添加成员','移动岗位']:[],
            children: data[i].children && data[i].children.length > 0?
                      recursive(data[i].children):[],
          });
        };

        return arr;
      };
      this_.treeVal_1=recursive2(data);

      function recursive3(data){
        var arr = [];
        for(var i=0;i<data.length;i++){
          arr.push(data[i].id);
        };

        return arr;
      };
      this_.chilsWArr_=recursive3(data);

    },
    // 获取搜索组件下拉选项类型
    getdropValFun:function(){
    },
    // 搜索组件下拉选项格式转换
    dataConverDropValFun:function(data){
      console.log(data);
    },
    // 点击表信息触发
    formClickFun:function(data){
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
.popOperation_b2{
  width: 100%;
  height: auto;
  margin-top: 50px;
}
.department{
  width: 95%;
  height: 100%;
  background: #fff;
  box-sizing: border-box;
  padding: 20px;
}
.departmentTop{
  margin-bottom: 10px;
  display: flex;
  flex-direction:row;
  justify-content:space-between;
}
.departmentTop>div{
  display: flex;
  flex-direction:row;
  justify-content:space-between;
  align-items:flex-end;
}
.departmentContainer{
  width: 100%;
}
</style>