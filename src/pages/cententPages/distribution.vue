<template>
  <div class="distribution">
    <div class="distributionTop">
      <div>
        <!-- 搜索组件 -->
        <!-- <searchModule
          :searchId="'distributionSearchId'"
          :searchVal="distribution_searchVal"
          @searchFun="distributionSearchFun"
        /> -->
      </div>
      <div>
        <!-- <button class="exit_btn" style="margin-right:20px;" @click="popOperaShowFun(0)">新增微信</button>
        <button class="exit_btn"  @click="popOperaShowFun(1)">批量分组</button> -->
      </div>
    </div>
    <div class="distributionContainer">
      <!-- 列表组件 -->
      <formModule
        :checkboxGroup=false
        :separationBorder=true
        :showHeight=formHeight_
        :formVal="distributionFormVal"
        @formClickFun="formClickFun"
        ref="distributionForm"
      />
      <div style="width:100%;height:30px;"></div>
      <!-- 分页组件 -->
      <pagingModule
        :totalNum=totalNumber
        :currentNum=currentNum
        :showValNum=showValNum
        @pagingFun="distributionPagingFun"
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
      distribution_searchVal:{},
      // 导出的数据
      distributionDataVal:'1,2,3,4\n5,6,7,8\n',
      // 列表数据
      distributionFormVal:{title:[
        { name:'客户',    type:'arry',      tag:'wx',     width:30  },
        { name:'客服',  type:'string',    tag:'wxid',   width:30  },
        { name:'分配时间',  type:'string',    tag:'wxm',    width:30  },
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
        {
          title:'微信号',
          type:'input',
          prompt:'请输入微信号',
        },
        {
          title:'微信昵称',
          type:'input',
          prompt:'请输入微信昵称',
        },
        {
          title:'选择微信用途',
          type:'select',
          prompt:'请选择微信用途',
          selectValArr:[
            {
              text:'风控',
              val:'0'
            },
            {
              text:'分流',
              val:'1'
            },
            {
              text:'群控',
              val:'2'
            },
          ]
        }
      ],
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


    }
  },
  components: { searchModule,exportData,formModule,pagingModule,popOperation  },
  watch:{
    distribution_searchVal:{
      handler(newVal, oldVal){
        // 计算列表高度
        var this_ = this;
        setTimeout(function(){
          this_.formHeight_ = formHeight($('.distributionTop').height());
        },50);
      },
      deep:true
    },
  },
  mounted() {
    // 计算列表高度
    this.formHeight_ = formHeight($('.distributionTop').height());
    // 初始获取下拉选项类型
    // this.getdropValFun();
    // 初始获取列表数据
    this.conditionRequest();
  },
  methods:{
    // 搜索组件回调函数
    distributionSearchFun:function(data){
      // console.log(this.$refs.distributionForm.selectedIdArr);
      this.微信信息=data.微信信息;
      this.分组=data.分组;
      this.currentNum=1;
      this.conditionRequest();
    },
    // 分页回调函数
    distributionPagingFun:function(data){
      // 判断是否搜索触发
      if(data.conversion){  this.currentNum=data.conversion  }else{this.currentNum=1;}
      if(data.valShowNum){  this.showValNum=data.valShowNum  };
      this.conditionRequest();
      return;
    },
    // 条件请求数据
    conditionRequest:function(){
      this.distributionValFun({
        pageNum:this.currentNum,
        pageSize:this.showValNum,
        groupsld:this.分组,
        wechat:this.微信信息,
      });
    },
    // 获取微信数据数据
    distributionValFun:function(obj={
      pageNum:'',
      pageSize:'',
      groupsld:'',
      wechat:'',
    }){
      var this_ = this;
      getIticket(function(ticket){
        this_.$axios.get(
          "http://"+api+"/api/1.0/log/redistribute/page/ticket"+'?pageNum='+obj.pageNum+'&pageSize='+obj.pageSize,
          {headers:{
            'content-type': 'application/x-www-form-urlencoded',
            'ticket':ticket
          }}
        )
        .then((response)=>{
          if(response.data.success){
            var distributionVal = response.data.result;

            if(distributionVal){
              // 设置总页数
              var page_n=Math.ceil(distributionVal.total/this_.showValNum);
              if(page_n==0){page_n=1};
              this_.totalNumber=page_n;

              // 对象数据转换成列表数据个数
              this_.dataConversionFun(distributionVal.content);
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
        { name:'客户',    type:'arry',      tag:'wx',     width:30  },
        { name:'客服',  type:'string',    tag:'wxid',   width:30  },
        { name:'分配时间',  type:'string',    tag:'wxm',    width:30  },
      ],value_=[];

      // 便利数据
      for(var i=0;i<data.length;i++){
        value_.push({
          id:data[i].id,
          wx:[
            { belongs:'image', url:data[i].friend.headImgUrl?data[i].friend.headImgUrl:'http://cloned.test.upcdn.net/xyj_common/def_head.png'},
            { belongs:'', titleShow:false, val:data[i].friend.nickname},
            { belongs:'', titleShow:false, val:data[i].friend.wxno},
          ],
          wxid:data[i].seller.nickname,
          wxm:getdateTime(data[i].createTime),
        });
      };

      // 赋值
      this.distributionFormVal={
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
            { type:'select', s_name:'分组',      value:[
                { 
                  prompt:'请选择微信所在分组',
                  val:''
                }
              ]
            },
            { type:'select',  s_name:'在线状态',  value:[
                { 
                  prompt:'在线',
                  val:'1'
                },
                { 
                  prompt:'离线',
                  val:'0'
                }
              ]
            },
          ]
      };

      for(var i=0;i<data.groups.length;i++){
        obj.fill[1].value.push({
          prompt:data.groups[i].name,
          val:data.groups[i].type
        });
      };

      this.distribution_searchVal=obj;

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
      console.log(data);
    },
    // 批量分组弹窗确定按钮
    determine_plfz:function(data){
      console.log(data);
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
.distribution{
  width: 95%;
  height: 100%;
  background: #fff;
  box-sizing: border-box;
  padding: 30px;
}
.distributionTop{
  margin-bottom: 10px;
  display: flex;
  flex-direction:row;
  justify-content:space-between;
}
.distributionTop>div{
  display: flex;
  flex-direction:row;
  justify-content:space-between;
  align-items:flex-end;
}
.distributionContainer{
  width: 100%;
}
</style>
