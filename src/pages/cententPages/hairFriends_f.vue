<template>
  <div class="hairFriends_f">
    <div class="hairFriends_fTop">
      <div>
        <!-- 搜索组件 -->
        <searchModule
          :searchId="'hairFriends_fSearchId'"
          :searchVal="hairFriends_f_searchVal"
          @searchFun="hairFriends_fSearchFun"
        />
      </div>
      <div>
        <button class="exit_btn" style="margin-right:20px;" @click="popOperaShowFun(0)">发朋友圈</button>
        <!-- <button class="exit_btn"  @click="popOperaShowFun(1)">批量分组</button> -->
      </div>
    </div>
    <div class="hairFriends_fContainer">
      <!-- 列表组件 -->
      <formModule
        :checkboxGroup=true
        :separationBorder=true
        :showHeight=formHeight_
        :formVal="hairFriends_fFormVal"
        @formClickFun="formClickFun"
        ref="hairFriends_fForm"
      />
      <div style="width:100%;height:30px;"></div>
      <!-- 分页组件 -->
      <pagingModule
        :totalNum=totalNumber
        :currentNum=currentNum
        :showValNum=showValNum
        @pagingFun="hairFriends_fPagingFun"
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
      hairFriends_f_searchVal:{},
      // 导出的数据
      hairFriends_fDataVal:'1,2,3,4\n5,6,7,8\n',
      // 列表数据
      hairFriends_fFormVal:{title:[
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
      // 发朋友圈弹窗展示数据
      popOperaVal_xzwx:[
        {
          title:'类型',
          type:'select',
          prompt:'选择朋友圈类型',
          selectValArr:[
            {   text:'图文',  val:'0'  },
            {   text:'视频',  val:'1'  },
            {   text:'文本',  val:'2'  },
            {   text:'链接',  val:'3'  },
            {   text:'未知',  val:'99'  },
          ]
        },
        {
          title:'内容',
          type:'textarea',
          prompt:'请输入内容',
        },
        {
          title:'发布地址',
          type:'input',
          prompt:'请输入地址',
        },
        {
          title:'添加评论',
          type:'input',
          prompt:'多个评论用"#"号拼接',
        },
        {
          title:'发布时间',
          type:'input',
          prompt:'未设置时间则立即执行（格式 1999-01-01 12:00:00）',
        },
      ],
      // 批量分组弹窗展示数据
      popOperaVal_plfz:[
        {
          title:'选择微信分组',
          type:'select',
          prompt:'请选择微信分组',
          selectValArr:[]
        }
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
    hairFriends_f_searchVal:{
      handler(newVal, oldVal){
        // 计算列表高度
        var this_ = this;
        setTimeout(function(){
          this_.formHeight_ = formHeight($('.hairFriends_fTop').height());
        },50);
      },
      deep:true
    },
  },
  mounted() {
    // 计算列表高度
    this.formHeight_ = formHeight($('.hairFriends_fTop').height());
    // 初始获取下拉选项类型
    this.getdropValFun();
    // 初始获取列表数据
    this.conditionRequest();
  },
  methods:{
    // 搜索组件回调函数
    hairFriends_fSearchFun:function(data){
      this.微信信息=data.微信信息;
      this.分组=data.分组;
      this.currentNum=1;
      this.conditionRequest();
    },
    // 分页回调函数
    hairFriends_fPagingFun:function(data){
      // 判断是否搜索触发
      if(data.conversion){  this.currentNum=data.conversion  }else{this.currentNum=1;}
      if(data.valShowNum){  this.showValNum=data.valShowNum  };
      this.conditionRequest();
      return;
    },
    // 条件请求数据
    conditionRequest:function(){
      this.hairFriends_fValFun({
        pageNum:this.currentNum,
        pageSize:this.showValNum,
        groupsld:this.分组,
        wechat:this.微信信息,
      });
    },
    // 获取微信数据数据
    hairFriends_fValFun:function(obj={
      pageNum:'',
      pageSize:'',
      groupsld:'',
      wechat:'',
    }){
      var this_ = this;
      getIticket(function(ticket){
        this_.$axios.get(
          "http://"+api+"/api/1.0/groups/wechat/page/ticket"+'?pageNum='+obj.pageNum+'&pageSize='+obj.pageSize+'&groupsId='+obj.groupsld+'&wechat='+obj.wechat,
          {headers:{
            'content-type': 'application/x-www-form-urlencoded',
            'ticket':ticket
          }}
        )
        .then((response)=>{
          if(response.data.success){
            var hairFriends_fVal = response.data.result;
            if(hairFriends_fVal){
              // 设置总页数
              var page_n=Math.ceil(hairFriends_fVal.total/this_.showValNum);
              if(page_n==0){page_n=1};
              this_.totalNumber=page_n;

              // 对象数据转换成列表数据个数
              this_.dataConversionFun(hairFriends_fVal.content);
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
        { name:'微信',    type:'arry',      tag:'wx',     width:10  },
        { name:'微信id',  type:'string',    tag:'wxid',   width:20  },
        { name:'微信名',  type:'string',    tag:'wxm',    width:15  },
        { name:'微信号',  type:'string',    tag:'wxh',    width:15  },
        { name:'类型',    type:'string',    tag:'lx',     width:10  },
        { name:'备注',    type:'onclick',   tag:'bz',     width:10  },
        { name:'操作',    type:'onclick',   tag:'cz',     width:10  }
      ],value_=[];

      // 便利数据
      for(var i=0;i<data.length;i++){
        value_.push({
          id:data[i].id,
          wx:[
            {
              belongs:'image',
              url:data[i].headImgUrl
            }
          ],
          wxid:data[i].wxid,
          wxm:data[i].nickname,
          wxh:data[i].wxno,
          lx:'1',
          bz:'添加备注',
          cz:'聊天记录'
        });
      };

      // 赋值
      this.hairFriends_fFormVal={
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
            { type:'select', s_name:'分组',      value:[
                { 
                  prompt:'请选择微信所在分组',
                  val:''
                }
              ]
            }
          ]
      };

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

      this.hairFriends_f_searchVal=obj;

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
      var this_ = this;
      getIticket(function(ticket){
        this_.$axios({
          method: 'post',
          url: "http://"+api+"/api/1.0/moments/send",
          headers:{
            'content-type': 'application/json',
            'ticket':ticket
          },
          data: {
            wechatIds: this_.$refs.hairFriends_fForm.selectedIdArr,
            content: data[1].val,
            type: data[0].val,
            location: data[2].val,
            comment: data[3].val,
            operatoTime: data[4].val,
            fodderUrl: ''
          }
        })
        .then((response)=>{
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

        })
        .catch((error)=>{
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
          data: this_.$refs.hairFriends_fForm.selectedIdArr
        })
        .then((response)=>{
          if(response.data.success){
            // 关闭弹窗
            this_.popOperaShowFun(-1);
            // 
            alert('批量分组成功');
          }else{
            alert(response.data.msg);
          }
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
.hairFriends_f{
  width: 95%;
  height: 100%;
  background: #fff;
  box-sizing: border-box;
  padding: 30px;
}
.hairFriends_fTop{
  margin-bottom: 10px;
  display: flex;
  flex-direction:row;
  justify-content:space-between;
}
.hairFriends_fTop>div{
  display: flex;
  flex-direction:row;
  justify-content:space-between;
  align-items:flex-end;
}
.hairFriends_fContainer{
  width: 100%;
}
</style>
