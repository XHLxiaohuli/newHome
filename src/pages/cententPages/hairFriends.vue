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
        <!-- <button class="exit_btn" style="margin-right:20px;" @click="popOperaShowFun(0)">发朋友圈</button> -->
        <!-- <button class="exit_btn"  @click="popOperaShowFun(1)">微信互聊</button> -->
      </div>
    </div>
    <div class="friendsListContainer">
      <!-- 列表组件 -->
      <formModule
        :checkboxGroup=false
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
    
    <!-- 发朋友圈 -->
    <popOperation
      v-if="popOperaShow==0"
      :title="'发朋友圈'"
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
      friendsList_searchVal:{
        title:'',                           //搜索title
        s_nameShow:true,                    //子标题显示
        search:true,                        //搜索按钮（true为使用，false为不使用）
        reset:false,                        //重置按钮（true为使用，false为不使用）
        timeChoose:{                        //日期区间筛选
          bool:false,                       //开关
          id:'moren'                        //组件id
        },
        fill:[
          { type:'input',  s_name:'关键词',  prompt:'搜索关键词'  },
          { type:'select', s_name:'朋友圈类型',      value:[
              {   prompt:'请选择类型',  val:''  },
              {   prompt:'图文',  val:'0'  },
              {   prompt:'视频',  val:'1'  },
              {   prompt:'文本',  val:'2'  },
              {   prompt:'链接',  val:'3'  },
              {   prompt:'未知',  val:'99'  },
            ]
          },
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
      friendsListDataVal:'1,2,3,4\n5,6,7,8\n',
      // 列表数据
      friendsListFormVal:{title:[
        { name:'微信信息',      type:'string',      tag:'wxxi',     width:20  },
        { name:'地区',      type:'string',      tag:'dq',     width:5  },
        { name:'朋友圈内容',  type:'string',      tag:'pyqnr',   width:20  },
        { name:'朋友圈素材',  type:'string',    tag:'pyqsc',   width:10  },
        { name:'发布时间',  type:'string',   tag:'fbsj',   width:10  },
        { name:'操作者',  type:'string',   tag:'czz',   width:10  },
        { name:'操作时间',    type:'string',    tag:'czsj',    width:10  },
      ],value:[]},
      // 列表高度
      formHeight_:0,
      // 关键词条件
      关键词:'',
      // 朋友圈类型条件
      朋友圈类型:'',
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
      // 批量分配好友弹窗展示数据
      popOperaVal_xzwx:[],
      // 批量分组弹窗展示数据
      popOperaVal_plfz:[],
      // 添加/编辑备注弹窗展示数据
      popOperaVal_tjbz:[],


    }
  },
  components: { searchModule,exportData,formModule,pagingModule,popOperation  },
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
    // 初始获取列表数据
    this.conditionRequest();
  },
  methods:{
    // 搜索组件回调函数
    friendsListSearchFun:function(data){
      // console.log(this.$refs.friendsListForm.selectedIdArr);
      this.关键词=data.关键词;
      this.朋友圈类型=data.朋友圈类型;
      this.状态=data.状态;
      this.currentNum=1;
      this.conditionRequest();
    },
    // 分页回调函数
    friendsListPagingFun:function(data){
      // 判断是否搜索触发
      if(data.conversion){  this.currentNum=data.conversion  }else{this.currentNum=1;}
      if(data.valShowNum){  this.showValNum=data.valShowNum  };
      this.conditionRequest();
      return;
    },
    // 条件请求数据
    conditionRequest:function(){
      this.friendsListValFun({
        pageNum:this.currentNum,
        pageSize:this.showValNum,
        keyWord:this.关键词,
        type:this.朋友圈类型,
        state:this.状态,
      });
    },
    // 获取微信数据数据
    friendsListValFun:function(obj={
      pageNum:'',
      pageSize:'',
      keyWord:'',
      state:'',
      type:'',
    }){
      var this_ = this;
      getIticket(function(ticket){
        this_.$axios({
          method: 'get',
          url: "http://"+api+"/api/1.0/moments/page",
          headers:{
            'content-type': 'application/x-www-form-urlencoded',
            'ticket':ticket
          },
          params: {
            pageNum:obj.pageNum,
            pageSize:obj.pageSize,
            keyWord:obj.keyWord,
            state:obj.state,
            type:obj.type,
          }
        })
        .then((response)=>{
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
        { name:'微信信息',      type:'string',      tag:'wxxi',     width:20  },
        { name:'地区',      type:'string',      tag:'dq',     width:5  },
        { name:'朋友圈内容',  type:'string',      tag:'pyqnr',   width:20  },
        { name:'朋友圈素材',  type:'string',    tag:'pyqsc',   width:10  },
        { name:'发布时间',  type:'string',   tag:'fbsj',   width:10  },
        { name:'操作者',  type:'string',   tag:'czz',   width:10  },
        { name:'操作时间',    type:'string',    tag:'czsj',    width:10  },
      ],value_=[];

      // 便利数据
      for(var i=0;i<data.length;i++){
        value_.push({
          id:data[i].id,
          wxxi:data[i].wechatId,
          dq:data[i].location,
          pyqnr:data[i].content,
          pyqsc:data[i].fodderUrl!==''?data[i].fodderUrl:'无',
          fbsj:data[i].operateTime,
          czz:data[i].operator,
          czsj:data[i].createTime,
        });
      };

      // // 赋值
      this.friendsListFormVal={
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
    // 批量分配好友弹窗确定按钮
    determine_xzwx:function(data){
      console.log(data);
      var this_ = this;
      getIticket(function(ticket){
        this_.$axios({
          method: 'post',
          url: "http://"+api+"/api/1.0/moments/send",
          headers:{
            'content-type': 'application/json',
            'ticket':ticket
          },
          data:{

          }
        })
        .then((response)=>{
          if(response.data.success){
            // 关闭弹窗
            this_.popOperaShowFun(-1);
            // 
            alert('分配成功');
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
