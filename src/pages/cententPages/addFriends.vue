<template>
  <div class="addFriends">
    <div class="addFriendsTop">
      <div>
        <!-- 搜索组件 -->
        <searchModule
          :searchId="'addFriendsSearchId'"
          :searchVal="addFriends_searchVal"
          @searchFun="addFriendsSearchFun"
        />
      </div>
      <div>
        <button class="exit_btn" style="margin-right:20px;" @click="popOperaShowFun(0)">手机号 / 微信号加好友</button>
        <!-- <button class="exit_btn"  @click="popOperaShowFun(1)">批量分组</button> -->
      </div>
    </div>
    <div class="addFriendsContainer">
      <!-- 列表组件 -->
      <formModule
        :checkboxGroup=true
        :separationBorder=true
        :showHeight=formHeight_
        :formVal="addFriendsFormVal"
        @formClickFun="formClickFun"
        ref="addFriendsForm"
      />
      <div style="width:100%;height:30px;"></div>
      <!-- 分页组件 -->
      <pagingModule
        :totalNum=totalNumber
        :currentNum=currentNum
        :showValNum=showValNum
        @pagingFun="addFriendsPagingFun"
      />
    </div>
    
    <!-- 手机号 / 微信号加好友 -->
    <popOperation
      v-if="popOperaShow==0"
      :title="'手机号 / 微信号加好友'"
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
      addFriends_searchVal:{
        title:'',                           //搜索title
        s_nameShow:true,                    //子标题显示
        search:true,                        //搜索按钮（true为使用，false为不使用）
        reset:false,                        //重置按钮（true为使用，false为不使用）
        timeChoose:{                        //日期区间筛选
          bool:false,                       //开关
          id:'moren'                        //组件id
        },
        fill:[
          { type:'input',  s_name:'微信号',  prompt:'搜索关键词'  },
          { type:'input',  s_name:'手机号',  prompt:'搜索关键词'  },
          { type:'select', s_name:'状态',      value:[
              {   prompt:'请选择状态',  val:''  },
              {   prompt:'未执行',  val:'0'  },
              {   prompt:'执行成功',  val:'1'  },
              {   prompt:'执行失败',  val:'2'  },
              {   prompt:'未知',  val:'9'  },
            ]
          },
        ]
      },
      // 导出的数据
      addFriendsDataVal:'1,2,3,4\n5,6,7,8\n',
      // 列表数据
      addFriendsFormVal:{title:[
        { name:'微信信息',    type:'string',      tag:'wxxx',     width:25  },
        { name:'手机号',      type:'string',    tag:'sjh',   width:15  },
        { name:'消息内容',    type:'string',    tag:'xxnr',    width:10  },
        { name:'状态',        type:'string',    tag:'zt',    width:10  },
        { name:'失败原因',    type:'string',    tag:'sbyx',     width:10  },
        { name:'创建者',      type:'string',   tag:'cjz',     width:10  },
        { name:'创建时间',    type:'string',   tag:'cjsj',     width:10  }
      ],value:[]},
      // 列表高度
      formHeight_:0,
      // 微信号条件
      微信号:'',
      // 手机号条件
      手机号:'',
      // 状态条件
      状态:'',
      // 操作者条件
      操作者:'',
      // 总数据页码
      totalNumber:0,
      // 第几页
      currentNum:1,
      // 显示个数
      showValNum:10,
      // 控制弹窗显示变量
      popOperaShow:-1,
      // 手机号 / 微信号加好友弹窗展示数据
      popOperaVal_xzwx:[],
      // 批量分组弹窗展示数据
      popOperaVal_plfz:[],
      // 添加/编辑备注弹窗展示数据
      popOperaVal_tjbz:[],

    }
  },
  components: { searchModule,exportData,formModule,pagingModule,popOperation  },
  watch:{
    addFriends_searchVal:{
      handler(newVal, oldVal){
        // 计算列表高度
        var this_ = this;
        setTimeout(function(){
          this_.formHeight_ = formHeight($('.addFriendsTop').height());
        },50);
      },
      deep:true
    },
  },
  mounted() {
    // 计算列表高度
    this.formHeight_ = formHeight($('.addFriendsTop').height());
    // 初始获取下拉选项类型
    this.getdropValFun();
    // 初始获取列表数据
    this.conditionRequest();
  },
  methods:{
    // 搜索组件回调函数
    addFriendsSearchFun:function(data){
      this.微信号=data.微信号;
      this.手机号=data.手机号;
      this.状态=data.状态;
      this.currentNum=1;
      this.conditionRequest();
    },
    // 分页回调函数
    addFriendsPagingFun:function(data){
      // 判断是否搜索触发
      if(data.conversion){  this.currentNum=data.conversion  }else{this.currentNum=1;}
      if(data.valShowNum){  this.showValNum=data.valShowNum  };
      this.conditionRequest();
    },
    // 条件请求数据
    conditionRequest:function(){
      this.addFriendsValFun({
        pageNum:this.currentNum,
        pageSize:this.showValNum,
        wxno:this.微信号,
        phone:this.手机号,
        state:this.状态,
        operator:this.操作者,
      });
    },
    // 获取微信数据数据
    addFriendsValFun:function(obj={
      pageNum:'',
      pageSize:'',
      wxno:'',
      phone:'',
      state:'',
      operator:'',
    }){
      var this_ = this;
      getIticket(function(ticket){
        this_.$axios.get(
          "http://"+api+"/api/1.0/addContacts/page"+'?pageNum='+obj.pageNum+'&pageSize='+obj.pageSize+'&wxno='+obj.wxno+'&phone='+obj.phone+'&state='+obj.state+'&operator='+obj.operator,
          {headers:{
            'content-type': 'application/x-www-form-urlencoded',
            'ticket':ticket
          }
        }).then((response)=>{
          if(response.data.success){
            var addFriendsVal = response.data.result;

            if(addFriendsVal){
              // 设置总页数
              var page_n=Math.ceil(addFriendsVal.total/this_.showValNum);
              if(page_n==0){page_n=1};
              this_.totalNumber=page_n;

              // 对象数据转换成列表数据个数
              this_.dataConversionFun(addFriendsVal.content);
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
        { name:'微信信息',    type:'string',      tag:'wxxx',     width:25  },
        { name:'手机号',      type:'string',    tag:'sjh',   width:15  },
        { name:'消息内容',    type:'string',    tag:'xxnr',    width:10  },
        { name:'状态',        type:'string',    tag:'zt',    width:10  },
        { name:'失败原因',    type:'string',    tag:'sbyx',     width:10  },
        { name:'创建者',      type:'string',   tag:'cjz',     width:10  },
        { name:'创建时间',    type:'string',   tag:'cjsj',     width:10  }
      ],value_=[];

      // 便利数据
      for(var i=0;i<data.length;i++){
        value_.push({
          id:data[i].id,
          wxxx:data[i].wechatId,
          sjh:data[i].addNo,
          xxnr:data[i].msg,
          zt:data[i].state,
          sbyx:data[i].whyLose,
          cjz:data[i].operator,
          cjsj:data[i].createTime,
        });
      };

      // 赋值
      this.addFriendsFormVal={
        title:title,
        value:value_
      };
    },
    // 获取搜索组件下拉选项类型
    getdropValFun:function(){
      var this_ = this;
      getIticket(function(ticket){
        this_.$axios.get(
          "http://"+api+"/api/1.0/groups/wechat/page/ticket"+'?pageNum=1&pageSize=1000',
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
              this_.dataConverDropValFun(response.data.result.content);
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
      var obj=[
        {
          title:'微信小号',
          type:'specialSelect',
          selectedArr:[],
          screeningArr:[],
        },
        {
          title:'手机号 / 微信号',
          type:'textarea',
          prompt:'号码与号码之间 "/" 隔开',
        },
        {
          title:'加好友内容',
          type:'textarea',
          prompt:'请输入加好友内容',
        },
        {
          title:'操作备注',
          type:'textarea',
          prompt:'请输入备注',
        },
      ];

      for(var i=0;i<data.length;i++){
        // 搜索分组
        obj[0].screeningArr.push({
          text:data[i].wxno,
          val:data[i].id
        });
      };
      this.popOperaVal_xzwx=obj;
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
    // 新增微信弹窗确定按钮
    determine_xzwx:function(data){
      var this_ = this;
      getIticket(function(ticket){
        this_.$axios({
          method: 'post',
          url: "http://"+api+"/api/1.0/addContacts/add",
          headers:{
            'content-type': 'application/json',
            'ticket':ticket
          },
          data: {
            wechatIdList:data[0].val,
            addNo:data[1].val,
            msg:data[2].val,
            remark:data[3].val,
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
          data: this_.$refs.addFriendsForm.selectedIdArr
        })
        .then((response)=>{
          if(response.data.msg=='保存成功'){
            // 关闭弹窗
            this_.popOperaShowFun(-1);
            // 
            alert('批量分组成功');
          };
        })
        .catch((error)=>{
          console.log(error);
        });
      });

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
.addFriends{
  width: 95%;
  height: 100%;
  background: #fff;
  box-sizing: border-box;
  padding: 30px;
}
.addFriendsTop{
  margin-bottom: 10px;
  display: flex;
  flex-direction:row;
  justify-content:space-between;
}
.addFriendsTop>div{
  display: flex;
  flex-direction:row;
  justify-content:space-between;
  align-items:flex-end;
}
.addFriendsContainer{
  width: 100%;
}
</style>
