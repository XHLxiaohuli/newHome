<template>
  <div class="friendsList">
    <div class="friendsListTop">
      <div>
        <!-- 搜索组件 -->
        <searchModule
          :searchId="'friendsListSearchId'"
          :searchVal="friendsList_searchVal"
          @searchFun="friendsListSearchFun"
        />
      </div>
      <div>
        <button class="exit_btn" style="margin-right:20px;" @click="popOperaShowFun(0)">批量分配好友</button>
        <button class="exit_btn"  @click="popOperaShowFun(1)">批量分组</button>
      </div>
    </div>
    <div class="friendsListContainer">
      <!-- 列表组件 -->
      <formModule
        :checkboxGroup=true
        :separationBorder=true
        :showHeight=formHeight_
        :formVal="friendsListFormVal"
        @formClickFun="formClickFun"
        ref="friendsListForm"
      />
      <div style="width:100%;height:30px;"></div>
      <!-- 分页组件 -->
      <pagingModule
        :totalNum=totalNumber
        :currentNum=currentNum
        :showValNum=showValNum
        @pagingFun="friendsListPagingFun"
      />
    </div>
    
    <!-- 批量分配好友 -->
    <popOperation
      v-if="popOperaShow==0"
      :title="'批量分配好友'"
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
    <chatRecord
      v-if="popOperaShow == 3"
      :wxid="imIdObj.wxid"
      :wechatid="imIdObj.wechatid"
      :topUrl="imIdObj.topUrl"
      @cancel="cancel_func"
    />

    <!-- 单个分配好友 -->
    <popOperation
      v-if="popOperaShow==4"
      :title="'修改分配好友'"
      :popOperaVal="popOperaVal_xzwx"
      @determine="determine_xzwx_"
      @cancel="popOperaHideFun"
    /> 

    <!-- 单个分组 -->
    <popOperation
      v-if="popOperaShow==5"
      :title="'修改分组'"
      :popOperaVal="popOperaVal_plfz"
      @determine="determine_plfz_"
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
      // 列表数据原型
      prototypeVal:[],
      // 聊天数据对应id对象
      imIdObj:{wxid:'',wechatid:''},
      // 搜索组件数据
      friendsList_searchVal:{},
      // 导出的数据
      friendsListDataVal:'1,2,3,4\n5,6,7,8\n',
      // 列表数据
      friendsListFormVal:{title:[
        { name:'客户',      type:'arry',      tag:'wx',     width:25  },
        { name:'所属微信',  type:'arry',      tag:'sswx',   width:25  },
        { name:'好友类型',  type:'string',    tag:'hylx',   width:8  },
        { name:'分配客服',  type:'onclick',   tag:'fpkf',   width:8  },
        { name:'所在分组',type:'string',    tag:'szfz',    width:10  },
        // { name:'手机号',    type:'string',    tag:'sjh',    width:10  },
        // { name:'备注',      type:'onclick',   tag:'bz',     width:8  },
        { name:'操作',      type:'onclick',   tag:'cz',     width:8  }
      ],value:[]},
      // 列表高度
      formHeight_:0,
      // 销售ID号条件
      销售ID:'',
      // 分组ID条件
      分组ID:'',
      // 微信号条件
      微信号:'',
      // 好友类型
      好友类型:'',
      // 好友微信
      好友微信:'',
      // 总数据页码
      totalNumber:0,
      // 第几页
      currentNum:1,
      // 显示个数
      showValNum:10,
      // 控制弹窗显示变量
      popOperaShow:-1,
      // 批量分配好友弹窗展示数据
      popOperaVal_xzwx:[{
        title:'选择客服',
        type:'datalist',
        prompt:'请选择客服',
        id:'cars_',
        dataArr:[]
      }],
      // 批量分组弹窗展示数据
      popOperaVal_plfz:[{
          title:'选择微信分组',
          type:'select',
          prompt:'请选择微信分组',
          selectValArr:[]
      }],
      // 添加/编辑备注弹窗展示数据
      popOperaVal_tjbz:[{
          title:'微信备注信息',
          type:'textarea',
          max:20,
          prompt:'最大输入20字',
      }],
      // 单个修改分组id
      aSinglGroupId:[],

    }
  },
  components: { searchModule,exportData,formModule,pagingModule,popOperation,chatRecord  },
  watch:{
    friendsList_searchVal:{
      handler(newVal, oldVal){
        // 计算列表高度
        var this_ = this;
        setTimeout(function(){
          this_.formHeight_ = formHeight($('.friendsListTop').height());
        },50);
      },
      deep:true
    },
  },
  mounted() {
    // 计算列表高度
    this.formHeight_ = formHeight($('.friendsListTop').height());
    // 初始获取下拉选项类型
    this.getdropValFun();
    this.getdropValFun2();
    // 初始获取列表数据
    this.conditionRequest();
  },
  methods:{
    // 搜索组件回调函数
    friendsListSearchFun:function(data){
      this.好友微信=data.好友微信;
      this.销售ID=data.分配客服;
      this.分组ID=data.好友分组;
      this.微信号=data.所属微信;
      this.好友类型=data.好友类型;
      this.currentNum=1;
      this.conditionRequest();
    },
    // 分页回调函数
    friendsListPagingFun:function(data){
      // 判断是否搜索触发
      if(data.conversion){  this.currentNum=data.conversion  }else{this.currentNum=1;}
      if(data.valShowNum){  this.showValNum=data.valShowNum  };
      this.conditionRequest();
    },
    // 条件请求数据
    conditionRequest:function(){
      this.friendsListValFun({
        pageNum:this.currentNum,
        pageSize:this.showValNum,
        friend:this.好友微信,
        gsellerId:this.销售ID,
        groupsId:this.分组ID,
        wechat:this.微信号,
        type:this.好友类型,
      });
    },
    // 获取微信数据数据
    friendsListValFun:function(obj={
      pageNum:'',
      pageSize:'',
      friend:'',
      gsellerId:'',
      groupsId:'',
      wechat:'',
      type:'',
    }){
      var this_ = this;
      getIticket(function(ticket){
        this_.$axios({
          method: 'get',
          url: "http://"+api+"/api/1.0/wechatFriend/page/ticket",
          headers:{
            'content-type': 'application/x-www-form-urlencoded',
            'ticket':ticket
          },
          params: {
            pageNum:obj.pageNum,
            pageSize:obj.pageSize,
            friend:obj.friend,
            sellerId:obj.gsellerId,
            friendGroupsId:obj.groupsId,
            wxno:obj.wechat,
            type:obj.type,
          }
        }).then((response)=>{
          if(response.data.success){
            var friendsListVal = response.data.result;
            if(friendsListVal){
              // 设置总页数
              var page_n=Math.ceil(friendsListVal.total/this_.showValNum);
              if(page_n==0){page_n=1};
              this_.totalNumber=page_n;

              // 对象数据转换成列表数据个数
              this_.dataConversionFun(friendsListVal.content);
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
      this.prototypeVal=data;
      var title=[
        { name:'客户',      type:'arry',      tag:'wx',     width:25  },
        { name:'所属微信',  type:'arry',      tag:'sswx',   width:25  },
        { name:'好友类型',  type:'string',    tag:'hylx',   width:10  },
        { name:'分配客服',  type:'onclick',   tag:'fpkf',   width:15  },
        { name:'所在分组',type:'onclick',    tag:'szfz',    width:10  },
        // { name:'手机号',    type:'string',    tag:'sjh',    width:10  },
        // { name:'备注',      type:'onclick',   tag:'bz',     width:8  },
        { name:'操作',      type:'onclick',   tag:'cz',     width:10  }
      ],value_=[];

      // 便利数据
      for(var i=0;i<data.length;i++){
        value_.push({
          id:data[i].id,
          wx:[
            { belongs:'image', url:data[i].headImgUrl?data[i].headImgUrl:'http://cloned.test.upcdn.net/xyj_common/def_head.png'},
            { belongs:'', titleShow:false, val:data[i].nickname},
            { belongs:'', titleShow:false, val:data[i].wxno},
          ],
          sswx:[
            { belongs:'image', url:data[i].wechat.headImgUrl?data[i].wechat.headImgUrl:'http://cloned.test.upcdn.net/xyj_common/def_head.png'},
            { belongs:'', titleShow:false, val:data[i].wechat.nickname},
            { belongs:'', titleShow:false, val:data[i].wechat.wxno},
          ],
          hylx:type_hylx(data[i].type),
          fpkf:data[i].seller?data[i].seller.name:'选择客服',
          szfz:data[i].groups?getgroupArr(data[i].groups):'-',
          // sjh:'-',
          // bz:'销售专用',
          cz:'聊天记录'
        });
      };

      // 获取分组名称
      function getgroupArr(data){
        if(!data || data.length==0){return "选择分组"};

        var arr=[];
        for(var i=0;i<data.length;i++){
          arr.push(data[i].name);
        };

        return arr.join(',');
      };

      // 判断好友类型
      function type_hylx(e){
        if(e=='0'){
          return '好友';
        }else if(e=='1'){
          return '微信助手';
        }else if(e=='2'){
          return '公众号';
        }else if(e=='3'){
          return '本人';
        }else if(e=='4'){
          return '僵尸粉';
        }else if(e=='5'){
          return '好友申请';
        }else if(e=='6'){
          return '小程序';
        }else if(e=='7'){
          return '已删好友';
        }else if(e=='999'){
          return '其他';
        }
      };

      // 赋值
      this.friendsListFormVal={
        title:title,
        value:value_
      };
    },
    // 获取搜索组件下拉选项类型
    getdropValFun:function(){
      var this_ = this;
      getIticket(function(ticket){
        // 请求搜索栏数据
        this_.$axios.get(
          "http://"+api+"/api/1.0/select/wechatFriendListPage",
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
    getdropValFun2:function(){
      var this_ = this;
      getIticket(function(ticket){
        // 请求搜索栏数据
        this_.$axios.get(
          "http://"+api+"/api/1.0/user/find/seller/ticket",
          {headers:{
            'content-type': 'application/x-www-form-urlencoded',
            'ticket':ticket
          }
        }).then((response)=>{
          if(response.data.success){
            var val = response.data.result;
            if(JSON.stringify(val) !== "{}"){
              var val_ = response.data.result;

              for(var i=0;i<val_.length;i++){
                this_.popOperaVal_xzwx[0].dataArr.push({
                  text:val_[i].name,
                  val:val_[i].accountId
                });
              };

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
      var this_=this;
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
            { type:'input',  s_name:'所属微信',  prompt:'微信号'  },
            { type:'input',  s_name:'好友微信',  prompt:'微信号'  },
            { type:'select', s_name:'好友分组', value:[
                {prompt:'请选择好友所在分组',val:''}
              ]
            },
            { type:'select', s_name:'分配客服', value:[
                {prompt:'请选择分配客服',val:''}
              ]
            },
            { type:'select', s_name:'好友类型', value:[
                {prompt:'请选择好友类型',val:''},
                {prompt:'好友',val:'0'},
                {prompt:'微信助手',val:'1'},
                {prompt:'公总号',val:'2'},
                {prompt:'本人',val:'3'},
                {prompt:'僵尸粉',val:'4'},
                {prompt:'好友申请',val:'5'},
                {prompt:'小程序',val:'6'},
                {prompt:'已删除好友',val:'7'},
                {prompt:'其他',val:'999'},
              ]
            }
          ]
      };
  
      // 好友分组数据
      for(var i=0;i<data.groups.length;i++){
        obj.fill[2].value.push({
          prompt:data.groups[i].name,
          val:data.groups[i].id
        });
        this_.popOperaVal_plfz[0].selectValArr.push({
          text:data.groups[i].name,
          val:data.groups[i].id
        });
      };
      // 客服分配数据
      for(var i=0;i<data.users.length;i++){
        obj.fill[3].value.push({
          prompt:data.users[i].name,
          val:data.users[i].accountId
        });
        // this_.popOperaVal_xzwx[0].dataArr.push({
        //   text:data.users[i].name,
        //   val:data.users[i].accountId
        // });
      };

      this.friendsList_searchVal=obj;

    },
    // 点击表信息触发
    formClickFun:function(data){
      this.aSinglGroupId = [data.id];
      if(data.type=='fpkf'){
        this.popOperaShowFun(4);
      }else if(data.type=='szfz'){
         this.popOperaShowFun(5);
      }else if(data.type=='cz'){
        // 打开操作弹窗
        this.imjiluVal(data.id);
        this.popOperaShowFun(3);
      };
    },
    // 打开聊天记录的功能
    imjiluVal:function(id){
      var arr = this.prototypeVal;
      var obj = {};
      for(var i=0;i<arr.length;i++){
        if(id == arr[i].id){
          console.log(arr[i]);
          obj.wechatid=arr[i].wechatId;
          obj.wxid=arr[i].wxid;
          obj.topUrl=[arr[i].wechat.headImgUrl,arr[i].headImgUrl];
          break;
        };
      };
      this.imIdObj=obj;
    },
    // 弹窗展示
    popOperaShowFun:function(e){
      this.popOperaShow=e;
    },
    // 弹窗隐藏
    popOperaHideFun:function(){
      this.popOperaShowFun(-1);
    },
    // 批量分配好友弹窗确定按钮
    determine_xzwx:function(data){
      console.log(data);
      var this_ = this;
      getIticket(function(ticket){
        this_.$axios({
          method: 'post',
          url: "http://"+api+"/api/1.0/wechatFriend/redistribution/"+data[0].val,
          headers:{
            'content-type': 'application/json',
            'ticket':ticket
          },
          data:this_.$refs.friendsListForm.selectedIdArr
        }).then((response)=>{
          if(response.data.success){
            // 关闭弹窗
            this_.popOperaShowFun(-1);
            // 
            alert('分配成功');
            this_.conditionRequest();
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
          url: "http://"+api+"/api/1.0/groups/wechatFriend/"+data[0].val,
          headers:{
            'content-type': 'application/json',
            'ticket':ticket
          },
          data: this_.$refs.friendsListForm.selectedIdArr
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
    // 添加/编辑备注确定函数
    determine_tjbz:function(data){
      console.log(data);
    },
    // 关闭聊天记录窗口
    cancel_func:function(){
      this.popOperaShow=-1;
    },
    // 单个分配好友弹窗确定按钮
    determine_xzwx_:function(data){
      console.log(data);
      var this_ = this;
      getIticket(function(ticket){
        this_.$axios({
          method: 'post',
          url: "http://"+api+"/api/1.0/wechatFriend/redistribution/"+data[0].val,
          headers:{
            'content-type': 'application/json',
            'ticket':ticket
          },
          data:this_.aSinglGroupId
        }).then((response)=>{
          if(response.data.success){
            // 关闭弹窗
            this_.popOperaShowFun(-1);
            // 
            alert('分配成功');
            this_.conditionRequest();
          }else{
            alert(response.data.msg);
          }
        }).catch((error)=>{
          console.log(error);
        });
      });

    },
    // 单个分组弹窗确定按钮
    determine_plfz_:function(data){

      var this_ = this;
      getIticket(function(ticket){
        this_.$axios({
          method: 'post',
          url: "http://"+api+"/api/1.0/groups/wechatFriend/"+data[0].val,
          headers:{
            'content-type': 'application/json',
            'ticket':ticket
          },
          data: this_.aSinglGroupId
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

  }
}
</script>

<style lang='less'>
@import '../../assets/less/common.less';
.friendsList{
  width: 95%;
  height: 100%;
  background: #fff;
  box-sizing: border-box;
  padding: 30px;
}
.friendsListTop{
  margin-bottom: 10px;
  display: flex;
  flex-direction:row;
  justify-content:space-between;
}
.friendsListTop>div{
  display: flex;
  flex-direction:row;
  justify-content:space-between;
  align-items:flex-end;
}
.friendsListContainer{
  width: 100%;
}
</style>
