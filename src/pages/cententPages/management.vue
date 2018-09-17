<template>
  <div class="management">
    <div class="managementTop">
      <div>
        <!-- 搜索组件 -->
        <searchModule
          :searchId="'managementSearchId'"
          :searchVal="management_searchVal"
          @searchFun="managementSearchFun"
        />
      </div>
      <div>
        <button class="exit_btn" @click="popOperaShowFun(0)">新增公司</button>
      </div>
    </div>
    <div class="managementContainer">
      <!-- 列表组件 -->
      <formModule
        :checkboxGroup=true
        :separationBorder=true
        :showHeight=formHeight_
        :formVal="managementFormVal"
        @formClickFun="formClickFun"
        ref="managementForm"
      />
      <div style="width:100%;height:30px;"></div>
      <!-- 分页组件 -->
      <pagingModule
        :totalNum=totalNumber
        :currentNum=currentNum
        :showValNum=showValNum
        @pagingFun="managementPagingFun"
      />
    </div>
    
    <!-- 新增微信 -->
    <popOperation
      v-if="popOperaShow==0"
      :title="'新增公司'"
      :popOperaVal="popOperaVal_xzwx"
      @determine="determine_xzwx"
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
      management_searchVal:{
          title:'',                           //搜索title
          s_nameShow:true,                    //子标题显示
          search:true,                        //搜索按钮（true为使用，false为不使用）
          reset:false,                        //重置按钮（true为使用，false为不使用）
          timeChoose:{                        //日期区间筛选
            bool:false,                       //开关
            id:'moren'                        //组件id
          },
          fill:[
            { type:'input',  s_name:'公司名称',  prompt:'请输入公司名称'  },
            { type:'input',  s_name:'公司地址',  prompt:'请输入公司地址'  },
            { type:'input',  s_name:'公司联系方式',  prompt:'请输入联系方式'  },
            { type:'input',  s_name:'营业执照注册号',  prompt:'请输入注册号'  },
            { type:'input',  s_name:'法定代表人',  prompt:'请输入法定代表人'  },
          ]
      },
      // 导出的数据
      managementDataVal:'1,2,3,4\n5,6,7,8\n',
      // 列表数据
      managementFormVal:{title:[
        { name:'公司名称',        type:'string',    tag:'gsmc',     width:15  },
        { name:'公司地址',        type:'string',    tag:'gsdz',   width:20  },
        { name:'公司联系方式',    type:'string',    tag:'lxfs',    width:15  },
        { name:'营业执照注册号',  type:'string',    tag:'yyzz',    width:15  },
        { name:'法定代表人',      type:'string',    tag:'fddb',     width:10  },
        { name:'创建时间',        type:'string',   tag:'cjsj',     width:15  },
      ],value:[]},
      // 列表高度
      formHeight_:0,
      // 公司名称条件
      公司名称:'',
      // 公司地址
      公司地址:'',
      // 公司联系方式
      公司联系方式:'',
      // 营业执照注册号
      营业执照注册号:'',
      // 法定代表人
      法定代表人:'',
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
        {  title:'公司名称',  type:'input',  prompt:'请输入公司名称',  },
        {  title:'公司地址',  type:'input',  prompt:'请输入公司地址',  },
        {  title:'公司联系方式',  type:'input',  prompt:'请输入公司联系方式',  },
        {  title:'营业执照注册号',  type:'input',  prompt:'请输入营业执照注册号',  },
        {  title:'法定代表人',  type:'input',  prompt:'请输入法定代表人',  },
        {  title:'登录账号',  type:'input',  prompt:'请输入登录账号',  },
        {  title:'密码（加密）',  type:'input',  prompt:'请输入密码（加密）',  },
        {  title:'用户名',  type:'input',  prompt:'请输入用户名',  },

        {  title:'通话时长',      type:'input',  prompt:'请输入通话时长(必填/正整数)',  },
        {  title:'在线微信数量',  type:'input',  prompt:'请输入微信数量(必填/正整数)',  },
        {  title:'客服数量',      type:'input',  prompt:'请输入客服数量(必填/正整数)',  },
      ],

    }
  },
  components: { searchModule,exportData,formModule,pagingModule,popOperation,chatRecord  },
  watch:{
    management_searchVal:{
      handler(newVal, oldVal){
        // 计算列表高度
        var this_ = this;
        setTimeout(function(){
          this_.formHeight_ = formHeight($('.managementTop').height());
        },50);
      },
      deep:true
    },
  },
  mounted() {
    // 计算列表高度
    this.formHeight_ = formHeight($('.managementTop').height());
    // 初始获取下拉选项类型
    this.getdropValFun();
    // 初始获取列表数据
    this.conditionRequest();
  },
  methods:{
    // 搜索组件回调函数
    managementSearchFun:function(data){
      this.公司名称=data.公司名称;
      this.公司地址=data.公司地址;
      this.公司联系方式=data.公司联系方式;
      this.营业执照注册号=data.营业执照注册号;
      this.法定代表人=data.法定代表人;
      this.currentNum=1;
      this.conditionRequest();
    },
    // 分页回调函数
    managementPagingFun:function(data){
      // 判断是否搜索触发
      if(data.conversion){  this.currentNum=data.conversion  }else{this.currentNum=1;}
      if(data.valShowNum){  this.showValNum=data.valShowNum  };
      this.conditionRequest();
    },
    // 条件请求数据
    conditionRequest:function(){
      this.managementValFun({
        pageNum:this.currentNum,
        pageSize:this.showValNum,
        name:this.公司名称,
        address:this.公司地址,
        phone:this.公司联系方式,
        licenseNumber:this.营业执照注册号,
        legalPerson:this.法定代表人,
      });
    },
    // 获取微信数据数据
    managementValFun:function(obj={
      pageNum:'',
      pageSize:'',
      groupsld:'',
      wechat:'',
    }){
      var this_ = this;
      getIticket(function(ticket){
        this_.$axios.get(
          "http://"+api+"/api/1.0/company/page"+'?pageNum='+obj.pageNum+'&pageSize='+obj.pageSize+'&name='+obj.name+'&address='+obj.address+'&phone='+obj.phone+'&licenseNumber='+obj.licenseNumber+'&legalPerson='+obj.legalPerson,
          {headers:{
            'content-type': 'application/x-www-form-urlencoded',
            'ticket':ticket
          }
        }).then((response)=>{
          if(response.data.success){
            var managementVal = response.data.result;
            if(managementVal){
              // 设置总页数
              var page_n=Math.ceil(managementVal.total/this_.showValNum);
              if(page_n==0){page_n=1};
              this_.totalNumber=page_n;
              // 对象数据转换成列表数据个数
              this_.dataConversionFun(managementVal.content);
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
      console.log(data);
      var title=[
        { name:'公司名称',        type:'string',    tag:'gsmc',     width:20  },
        { name:'公司联系方式',    type:'string',    tag:'lxfs',    width:15  },
        { name:'法定代表人',      type:'string',    tag:'fddb',     width:15  },
        { name:'通话时长',    type:'string',    tag:'thsc',    width:15  },
        { name:'在线微信数量',  type:'string',    tag:'zxwx',    width:15  },
        { name:'客服数量',      type:'string',    tag:'kfsl',     width:15  },
        { name:'创建时间',        type:'string',   tag:'cjsj',     width:15  },
      ],value_=[];
      // 便利数据
      for(var i=0;i<data.length;i++){
        value_.push({
          id:data[i].id,
          gsmc:data[i].name,
          gsdz:data[i].address,
          lxfs:data[i].phone,
          yyzz:data[i].licenseNumber,
          fddb:data[i].legalPerson,
          thsc:data[i].limitMins,
          zxwx:data[i].wechatTotal,
          kfsl:data[i].sellerTotal,
          cjsj:getdateTime(data[i].createTime),
        });
      };
      // 赋值
      this.managementFormVal={
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
      var r =/^[0-9]*[1-9][0-9]*$/;
      if(!(r.test(data[8].val))){alert('通话时长必须正整数'); return;};
      if(!(r.test(data[9].val))){alert('在线微信数量必须正整数'); return;};
      if(!(r.test(data[10].val))){alert('客服数量必须正整数'); return;};

      var this_ = this;
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
          var passwordRas = encrypt.encrypt(data[6].val);

          getIticket(function(ticket){
            this_.$axios({
              method: 'post',
              url: "http://"+api+"/api/1.0/company",
              headers:{
                'content-type': 'application/json',
                'ticket':ticket
              },
              params: {
                companyName:data[0].val,
                address:data[1].val,
                phone:data[2].val,
                licenseNumber:data[3].val,
                legalPerson:data[4].val,
                username:data[5].val,
                password:passwordRas,
                name:data[7].val,
                limitMins:data[8].val,
                wechatTotal:data[9].val,
                sellerTotal:data[10].val,
              }
            }).then((response)=>{
              if(response.data.success){
                // 跳转第一页
                this_.currentNum=1;
                // 重新请求数据
                this_.conditionRequest();
                // 关闭弹窗
                this_.popOperaShowFun(-1);
              };
              alert(response.data.msg);
            }).catch((error)=>{
              console.log(error);
            });
          });
        },
        error:function (response) {
          console.log('获取公钥失败');
        }
      });
      
    },

  }
}
</script>

<style lang='less'>
@import '../../assets/less/common.less';
.management{
  width: 95%;
  height: 100%;
  background: #fff;
  box-sizing: border-box;
  padding: 30px;
}
.managementTop{
  margin-bottom: 10px;
  display: flex;
  flex-direction:row;
  justify-content:space-between;
}
.managementTop>div{
  display: flex;
  flex-direction:row;
  justify-content:space-between;
  align-items:flex-end;
}
.managementContainer{
  width: 100%;
}
</style>
