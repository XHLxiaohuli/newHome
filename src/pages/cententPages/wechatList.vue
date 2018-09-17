<template>
  <div class="wechatList">
    <div class="wechatListTop">
      <div>
        <!-- 搜索组件 -->
        <searchModule
          :searchId="'wechatListSearchId'"
          :searchVal="wechatList_searchVal"
          @searchFun="wechatListSearchFun"
        />
      </div>
      <div>
        <button class="exit_btn" style="margin-right:20px;" @click="popOperaShowFun(0)">新增微信</button>
        <button class="exit_btn"  @click="popOperaShowFun(1)">批量分组</button>
      </div>
    </div>
    <div class="wechatListContainer">
      <!-- 列表组件 -->
      <formModule
        ref="wechatListForm"
        :checkboxGroup=true
        :separationBorder=true
        :showHeight=formHeight_
        :formVal="wechatListFormVal"
        @formClickFun="formClickFun"
      >
        <div class="testswitch" slot="operation">
          <input class="testswitch-checkbox input_swh" type="checkbox">
          <label class="testswitch-label label_swh">
            <span class="testswitch-inner" data-on="YES" data-off="NO"></span>
            <span class="testswitch-switch"></span>
          </label>
        </div>
      </formModule>
      <div style="width:100%;height:30px;"></div>
      <!-- 分页组件 -->
      <pagingModule
        :totalNum=totalNumber
        :currentNum=currentNum
        :showValNum=showValNum
        @pagingFun="wechatListPagingFun"
      />
    </div>
    
    <!-- 新增微信 -->
    <popOperation
      v-if="popOperaShow==0"
      :title="'新增微信'"
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

    <!-- 单个分组 -->
    <popOperation
      v-if="popOperaShow==2"
      :title="'修改分组'"
      :popOperaVal="popOperaVal_plfz"
      @determine="singleGroup"
      @cancel="popOperaHideFun"
    />
    
    <!-- 添加备注 -->
    <popOperation
      v-if="popOperaShow==3"
      :title="'编辑备注'"
      :popOperaVal="popOperaVal_tjbz"
      @determine="determine_tjbz"
      @cancel="popOperaHideFun"
    />

    <!-- 聊天记录 -->
    <chatRecord
      v-if="popOperaShow==4"
      :chatRecordType="'wechatId'"
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
export default {
  data() {
    return {
      // 搜索组件数据
      wechatList_searchVal:{},
      // 导出的数据
      wechatListDataVal:'1,2,3,4\n5,6,7,8\n',
      // 列表数据
      wechatListFormVal:{title:[
        { name:'微信',    type:'arry',      tag:'wx',     width:10  },
        { name:'微信名',  type:'string',    tag:'wxm',    width:10  },
        { name:'微信号',  type:'string',    tag:'wxh',    width:15  },
        { name:'所在分组',type:'string',    tag:'szfz',    width:10  },
        { name:'是否认证',    type:'string',    tag:'sfrz',     width:10  },
        { name:'状态',    type:'string',    tag:'lx',     width:10  },
        { name:'是否自动强红包',    type:'string',    tag:'sfzdq',     width:15  },
        { name:'最近同步时间',  type:'string',   tag:'tongbu',     width:10  },
        // { name:'操作',    type:'onclick',   tag:'cz',     width:10  }
      ],value:[]},
      // 列表高度
      formHeight_:0,
      // 微信号条件
      微信信息:'',
      // 分组条件
      分组:'',
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
      // 单个修改分组id
      aSinglGroupId:[],
      // 聊天数据信息
      imIdObj:{},
    }
  },
  components: { searchModule,exportData,formModule,pagingModule,popOperation,chatRecord  },
  watch:{
    wechatList_searchVal:{
      handler(newVal, oldVal){
        // 计算列表高度
        var this_ = this;
        setTimeout(function(){
          this_.formHeight_ = formHeight($('.wechatListTop').height());
        },50);
      },
      deep:true
    },
  },
  mounted() {
    // 计算列表高度
    this.formHeight_ = formHeight($('.wechatListTop').height());
    // 初始获取下拉选项类型
    this.getdropValFun();
    // 初始获取列表数据
    this.conditionRequest();

  },
  methods:{
    // 搜索组件回调函数
    wechatListSearchFun:function(data){
      this.微信信息=data.微信信息;
      this.分组=data.分组;
      this.currentNum=1;
      this.conditionRequest();
    },
    // 分页回调函数
    wechatListPagingFun:function(data){
      // 判断是否搜索触发
      if(data.conversion){  this.currentNum=data.conversion  }else{this.currentNum=1;}
      if(data.valShowNum){  this.showValNum=data.valShowNum  };
      this.conditionRequest();
    },
    // 条件请求数据
    conditionRequest:function(){
      this.wechatListValFun({
        pageNum:this.currentNum,
        pageSize:this.showValNum,
        groupsld:this.分组,
        wechat:this.微信信息,
      });
    },
    // 获取微信数据数据
    wechatListValFun:function(obj={
      pageNum:'',
      pageSize:'',
      groupsld:'',
      wechat:'',
    }){
      var this_ = this;
      getIticket(function(ticket){
        this_.$axios.get(
          "http://"+api+"/api/1.0/wechat/page/ticket"+'?pageNum='+obj.pageNum+'&pageSize='+obj.pageSize+'&groupsId='+obj.groupsld+'&wechat='+obj.wechat,
          {headers:{
            'content-type': 'application/x-www-form-urlencoded',
            'ticket':ticket
          }}
        )
        .then((response)=>{
          if(response.data.success){
            var wechatListVal = response.data.result;
            if(wechatListVal){
              // 设置总页数
              var page_n=Math.ceil(wechatListVal.total/this_.showValNum);
              if(page_n==0){page_n=1};
              this_.totalNumber=page_n;
              // 对象数据转换成列表数据个数
              this_.dataConversionFun(wechatListVal.content);
              // 特殊操作开关
              this_.kaiguanhanshu();
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

      console.log(data);

      var title=[
        { name:'微信',    type:'arry',      tag:'wx',     width:10  },
        { name:'微信名',  type:'string',    tag:'wxm',    width:10  },
        { name:'微信号',  type:'string',    tag:'wxh',    width:15  },
        { name:'所在分组',type:'onclick',    tag:'szfz',    width:10  },
        { name:'是否认证',    type:'string',    tag:'sfrz',     width:10  },
         { name:'状态',    type:'string',    tag:'using',     width:10  },
        { name:'是否启用',    type:'operation',    tag:'lx',     width:10  },
        { name:'是否自动抢红包',    type:'operation',    tag:'sfzdq',     width:15  },
        { name:'最近同步时间',  type:'string',   tag:'tongbu',     width:10  },
        { name:'聊天记录',    type:'onclick',   tag:'cz',     width:10  }
      ],value_=[];

      // 便利数据
      for(var i=0;i<data.length;i++){
        value_.push({
          id:data[i].id,
          wx:[{
            belongs:'image',
            url:data[i].headImgUrl?data[i].headImgUrl:'http://cloned.test.upcdn.net/xyj_common/def_head.png'
          }],
          wxm:data[i].nickname,
          wxh:data[i].wxno,
          szfz:data[i].groups && data[i].groups.length>0?getgroupArr(data[i].groups):'-',
          sfrz:data[i].isValidate?'已认证':'未认证',
          using:data[i].status==0?
              '在线':
              data[i].status==1?
              '离线':
              data[i].status==2?
              '异常':
              data[i].status==999?
              '未知':'-',
          lx: data[i].usingState==0?
              '可用':
              data[i].usingState==1?
              '不可用':'-',
          sfzdq:data[i].luckyPackage,
          tongbu:getdateTime(data[i].synchronizationTime),
          cz:'查看聊天记录'
        });
      };

      // 获取分组名称
      function getgroupArr(data){
        if(!data || data.length==0){return "-"};

        var arr=[];
        for(var i=0;i<data.length;i++){
          arr.push(data[i].name);
        };

        return arr.join(',');
      };

      // 赋值
      this.wechatListFormVal={
        title:title,
        value:value_
      };
    },
    // 获取搜索组件下拉选项类型
    getdropValFun:function(){
      var this_ = this;
      getIticket(function(ticket){
        this_.$axios.get(
          "http://"+api+"/api/1.0/select/wechatListPage"+'?type=1',
          {headers:{
            'content-type': 'application/x-www-form-urlencoded',
            'ticket':ticket
          }
        }).then((response)=>{
          if(response.data.success){
           var val = response.data.result;
            if(JSON.stringify(val) !== "{}"){
              // 搜索组件选项数据
              this_.dataConverDropValFun(response.data.result);
            }
          }else{
            alert(response.data.msg);
          }
        }).catch((error)=>{
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
          fill:[
            { type:'input',  s_name:'微信信息',  prompt:'微信号 / 微信昵称'  },
            { type:'select', s_name:'分组', value:[{prompt:'请选择微信所在分组',val:''}]},
            { type:'select',  s_name:'在线状态',  value:[{prompt:'在线',val:'1'},{prompt:'离线',val:'0'}]},
          ]};

      for(var i=0;i<data.groups.length;i++){
        // 搜索分组
        obj.fill[1].value.push({
          prompt:data.groups[i].name,
          val:data.groups[i].id
        });
        // 批量分组
        this_.popOperaVal_plfz[0].selectValArr.push({
          text:data.groups[i].name,
          val:data.groups[i].id
        });
      };

      this.wechatList_searchVal=obj;
    },
    // 点击表信息触发
    formClickFun:function(data){
      console.log(data);

      if(data.type=='szfz'){
        // 打开备注弹窗
        this.popOperaShowFun(2);
        this.aSinglGroupId .push(data.id);
      }else if(data.type=='cz'){
        // this.imIdObj
        // 
        var arr = this.wechatListFormVal.value;
        for(var i=0;i<arr.length;i++){
          if(arr[i].id == data.id){
            this.imIdObj = arr[i];
          };
        };
        // 打开操作弹窗
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
      this.kaiguanhanshu();
    },
    // 新增微信弹窗确定按钮
    determine_xzwx:function(data){
      console.log(data);
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
          url: "http://"+api+"/api/1.0/groups/wechat/"+data[0].val,
          headers:{
            'content-type': 'application/json',
            'ticket':ticket
          },
          data: this_.$refs.wechatListForm.selectedIdArr
        }).then((response)=>{
          if(response.data.success){
            // 关闭弹窗
            this_.popOperaShowFun(-1);
            // 
            alert('批量分组成功');
            this_.conditionRequest();
          }else{
            alert(response.data.msg);
          }
        }).catch((error)=>{
          console.log(error);
        });
      });
    },
    // 单个分组弹窗
    singleGroup:function(data){
      var this_ = this;
      getIticket(function(ticket){
        this_.$axios({
          method: 'post',
          url: "http://"+api+"/api/1.0/groups/wechat/"+data[0].val,
          headers:{
            'content-type': 'application/json',
            'ticket':ticket
          },
          data: this_.aSinglGroupId
        }).then((response)=>{
          if(response.data.success){
            // 关闭弹窗
            this_.popOperaShowFun(-1);
            this_.aSinglGroupId=[];
            // 
            alert('修改分组成功');
            this_.conditionRequest();
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
      this.kaiguanhanshu();
    },
    // 开关
    kaiguanhanshu:function(data){
      var this_ = this;
      setTimeout(function(){
        var value_ = this_.wechatListFormVal.value;
        var idlogo = '';
        $('.input_swh').each(function(){
          var id = $(this).closest('.jieshouZY').attr('data-id');
          if(id == idlogo){
            $(this).attr('id',id+'_2');
            for(var i=0;i<value_.length;i++){
              if(id == value_[i].id){
                if(value_[i].sfzdq){
                  $(this).prop("checked", true);
                };
              };
            };
          }else{
            $(this).attr('id',id+'_1');
            for(var i=0;i<value_.length;i++){
              if(id == value_[i].id){
                if(value_[i].lx == '可用'){
                  $(this).prop("checked", true);
                };
              };
            };
            idlogo = $(this).closest('.jieshouZY').attr('data-id');
          }
        });

        idlogo = '';
        $('.label_swh').each(function(){
          var id = $(this).closest('.jieshouZY').attr('data-id');
          if(id == idlogo){
            $(this).attr('for',id+'_2');
          }else{
            $(this).attr('for',id+'_1');
            idlogo = $(this).closest('.jieshouZY').attr('data-id');
          }
        });

        $('.input_swh').unbind();
        $(".input_swh").bind('click', function(){
          var id = $(this).attr('id');
          var logo = id.substr(id.length-1 , id.length);
          id = id.substr(0 , id.length-2);

          var bool_;
          if ($(this).is(':checked')) {
            bool_ = true;
            console.log("在ON的状态下");
          } else {
            bool_ = false;
            console.log("在OFF的状态下");
          }

          if(logo == '1'){
            getIticket(function(ticket){
              this_.$axios({
                method: 'post',
                url: "http://"+api+"/api/1.0/wechatMessage/switch/wechat",
                headers:{
                  'content-type': 'application/x-www-form-urlencoded',
                  'ticket':ticket
                },
                params: {
                  id:id,
                  state:bool_?0:1,
                }
              }).then((response)=>{
                alert(response.data.msg);
              }).catch((error)=>{
                console.log(error);
              });
            });
          }else if(logo == '2'){
            getIticket(function(ticket){
              this_.$axios({
                method: 'post',
                url: "http://"+api+"/api/1.0/wechatMessage/switch/luckyPackage",
                headers:{
                  'content-type': 'application/x-www-form-urlencoded',
                  'ticket':ticket
                },
                params: {
                  id:id,
                  isOn:bool_
                }
              }).then((response)=>{
                alert(response.data.msg);
              }).catch((error)=>{
                console.log(error);
              });
            });
          }
        });
      },100);
    }

  }
}
</script>

<style lang='less'>
@import '../../assets/less/common.less';
.wechatList{
  width: 95%;
  height: 100%;
  background: #fff;
  box-sizing: border-box;
  padding: 30px;
}
.wechatListTop{
  margin-bottom: 10px;
  display: flex;
  flex-direction:row;
  justify-content:space-between;
}
.wechatListTop>div{
  display: flex;
  flex-direction:row;
  justify-content:space-between;
  align-items:flex-end;
}
.wechatListContainer{
  width: 100%;
}
.testswitch {
    position: relative;
    float: left; 
    width: 60px;
    margin: 0;
    -webkit-user-select:none; 
    -moz-user-select:none; 
    -ms-user-select: none;
}
 
.testswitch-checkbox {
    display: none;
}
 
.testswitch-label {
    display: block; 
    overflow: hidden; 
    cursor: pointer;
    // border: 1px solid #999999; 
    border-radius: 20px;
}
 
.testswitch-inner {
    display: block; 
    width: 200%; 
    margin-left: -100%;
    transition: margin 0.1s ease-in 0s;
}
 
.testswitch-inner::before, .testswitch-inner::after {
    display: block; 
    float: right; 
    width: 50%; 
    height: 15px; 
    padding: 0; 
    line-height: 16px;
    font-size: 5px; 
    color: white; 
    font-family: 
    Trebuchet, Arial, sans-serif; 
    font-weight: bold;
    box-sizing: border-box;
}
 
.testswitch-inner::after {
    content: attr(data-on);
    padding-left: 10px;
    background-color: #0aa1ed; 
    color: #FFFFFF;
}
 
.testswitch-inner::before {
    content: attr(data-off);
    padding-right: 5px;
    background-color: #EEEEEE; 
    color: #999999;
    text-align: right;
}
 
.testswitch-switch {
    position: absolute; 
    display: block; 
    width: 10px;
    height: 10px;
    margin: 2px;
    background: #FFFFFF;
    top: 0; 
    bottom: 0;
    right: 40px;
    border: 1px solid #999999; 
    border-radius: 20px;
    transition: all 0.1s ease-in 0s;
}
 
.testswitch-checkbox:checked + .testswitch-label .testswitch-inner {
    margin-left: 0;
}
 
.testswitch-checkbox:checked + .testswitch-label .testswitch-switch {
    right: 0px; 
}

</style>
