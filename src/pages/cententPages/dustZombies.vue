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
        <button class="exit_btn" @click="queryZombies">查询僵尸粉</button>
        <!-- <button class="exit_btn"  @click="popOperaShowFun(1)">批量分组</button> -->
      </div>
    </div>
    <div class="wechatListContainer">
      <!-- 列表组件 -->
      <formModule
        :checkboxGroup=true
        :separationBorder=true
        :showHeight=formHeight_
        :formVal="wechatListFormVal"
        @formClickFun="formClickFun"
        ref="wechatListForm"
      />
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
    
    <!-- 添加备注 -->
    <popOperation
      v-if="popOperaShow==2"
      :title="'编辑备注'"
      :popOperaVal="popOperaVal_tjbz"
      @determine="determine_tjbz"
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
      wechatList_searchVal:{},
      // 导出的数据
      wechatListDataVal:'1,2,3,4\n5,6,7,8\n',
      // 列表数据
      wechatListFormVal:{title:[
        { name:'微信信息',      type:'arry',      tag:'wxxx',     width:30  },
        { name:'状态',          type:'string',    tag:'zt',    width:20  },
        { name:'最近操作时间',   type:'string',    tag:'czsj',     width:20  },
        { name:'操作',          type:'onclick',   tag:'cz',     width:20  }
      ],value:[]},
      // 列表高度
      formHeight_:0,
      // 微信号条件
      微信信息:'',
      // 分组条件
      分组:'',
      // 状态条件
      状态:'',
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

    }
  },
  components: { searchModule,exportData,formModule,pagingModule,popOperation  },
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
      this.状态=data.状态;
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
        wxno:this.微信信息,
        groupId:this.分组,
        online:this.状态
      });
    },
    // 获取微信数据数据
    wechatListValFun:function(obj={
      pageNum:'',
      pageSize:'',
      wxno:'',
      groupId:'',
      online:'',
    }){
      var this_ = this;
      getIticket(function(ticket){
        this_.$axios.get(
          "http://"+api+"/api/1.0/zombieFan/page"+'?pageNum='+obj.pageNum+'&pageSize='+obj.pageSize+'&wxno='+obj.wxno+'&groupId='+obj.groupId+'&online='+obj.online,
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
        { name:'微信信息',      type:'arry',      tag:'wxxx',     width:30  },
        { name:'状态',          type:'string',    tag:'zt',    width:20  },
        { name:'最近操作时间',   type:'string',    tag:'czsj',     width:20  },
        { name:'操作',          type:'onclick',   tag:'cz',     width:20  }
      ],value_=[];
      // 便利数据
      for(var i=0;i<data.length;i++){
        value_.push({
          id:data[i].wechat.id,
          wxxx:[{
            belongs:'image',
            url:data[i].wechat.headImgUrl
          },{
            belongs:'',
            titleShow:false,
            val:data[i].wechat.wxon
          },{
            belongs:'',
            titleShow:false,
            val:data[i].wechat.wxid
          }],
          zt: data[i].state=='0'?
              '未查询':
              data[i].state=='1'?
              '查询中':
              data[i].state=='2'?
              '查询成功':
              data[i].state=='3'?
              '查询失败':
              data[i].state=='4'?
              '查询成功':
              data[i].state=='9'?
              '未知':'-',
          czsj:'1',
          cz: data[i].state=='2'?'管理僵尸粉':
              data[i].state=='4'?'没有僵尸粉':'请先查询'
        });
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
            { type:'select',  s_name:'状态',  value:[
              {prompt:'未查询',val:'0'},
              {prompt:'查询中',val:'1'},
              {prompt:'查询完成',val:'2'},
              {prompt:'查询失败',val:'3'},
              {prompt:'未知',val:'9'},
            ]},
          ]};

      for(var i=0;i<data.groups.length;i++){
        // 搜索分组
        obj.fill[1].value.push({
          prompt:data.groups[i].name,
          val:data.groups[i].id
        });
      };

      this.wechatList_searchVal=obj;
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
    // 查询僵尸粉功能
    queryZombies:function(){
      var this_ = this;
      getIticket(function(ticket){
        this_.$axios({
          method: 'post',
          url: "http://"+api+"/api/1.0/zombieFan/query",
          headers:{
            'content-type': 'application/json',
            'ticket':ticket
          },
          data: {
            wxids:this_.$refs.wechatListForm.selectedIdArr
          }
        }).then((response)=>{
          if(response.data.success){
            var websocket;
            // 首先判断是否 支持 WebSocket
            if('WebSocket' in window) {
                websocket = new WebSocket("ws://"+api+"/api/1.0/socket/zombieFanState?userId="+ticket+"&count="+this_.$refs.wechatListForm.selectedIdArr.length);
            } else if('MozWebSocket' in window) {
                websocket = new MozWebSocket("ws://"+api+"/api/1.0/socket/zombieFanState?userId="+ticket+"&count="+this_.$refs.wechatListForm.selectedIdArr.length);
            } else {
                websocket = new SockJS("ws://"+api+"/socketJs/api/1.0/socket/zombieFanState?userId="+ticket+"&count="+this_.$refs.wechatListForm.selectedIdArr.length);
            };
            // 打开连接时
            websocket.onopen = function(evnt) {
                console.log("  websocket.onopen  链接成功");
            };
            // 收到消息时
            websocket.onmessage = function(evnt) {
                console.log(evnt.data);
                this_.conditionRequest();
            };
            websocket.onerror = function(evnt) {
                console.log("  websocket.onerror  链接出错");
            };
            websocket.onclose = function(evnt) {
                console.log("  websocket.onclose  链接关闭");
            };
            //客户端主动发消息
            function say(text){  websocket.send(text)  };
          };
        }).catch((error)=>{
          console.log(error);
        });
      });
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
          if(response.data.msg=='保存成功'){
            // 关闭弹窗
            this_.popOperaShowFun(-1);
            // 
            alert('批量分组成功');
          };
        }).catch((error)=>{
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
</style>
