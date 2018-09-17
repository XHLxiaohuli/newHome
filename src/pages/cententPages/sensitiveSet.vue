<template>
  <div class="sensitiveSet">
    <div class="sensitiveSetTop">
      <div>
        <!-- 搜索组件 -->
        <searchModule
          :searchId="'sensitiveSetSearchId'"
          :searchVal="sensitiveSet_searchVal"
          @searchFun="sensitiveSetSearchFun"
        />
      </div>
      <div>
        <button class="exit_btn" style="margin-right:20px;" @click="sensitiveWords(0)">添加敏感词</button>
        <button class="exit_btn" style="margin-right:20px;" @click="sensitiveWords(1)">修改敏感词</button>
        <button class="exit_btn" style="margin-right:20px;" @click="sensitiveWords(2)">删除敏感词</button>
        <button class="exit_btn"  @click="SaveFunction">保存</button>
      </div>
    </div>
    <div class="sensitiveSetContainer">
      <!-- 标签组件 -->
      <div :style="'width:100;height:'+formHeight_+'px'" >
        <labelModule
          v-if="labelModuleBool"
          ref='labelModule'
          :labelVal="labelModuleVal"
        />
      </div>
      <div style="width:100%;height:30px;"></div>
      <!-- 分页组件 -->
      <pagingModule
        :totalNum=totalNumber
        :currentNum=currentNum
        :showValNum=showValNum
        @pagingFun="sensitiveSetPagingFun"
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
// 标签组件
import labelModule from '@/components/labelModule'
export default {
  data() {
    return {
      // 搜索组件数据
      sensitiveSet_searchVal:{},
      // 导出的数据
      sensitiveSetDataVal:'1,2,3,4\n5,6,7,8\n',
      // 标签数据
      labelModuleVal:[],
      // 标签组件状态
      labelModuleBool:true,
      // 列表数据
      sensitiveSetFormVal:{},
      // 列表高度
      formHeight_:0,
      // 敏感词条件
      敏感词:'',
      // 微信分组条件
      微信分组:'',
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
          selectValArr:[{
            text:'风控',
            val:'0'
          },{
            text:'分流',
            val:'1'
          },{
            text:'群控',
            val:'2'
          }]
        }
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
  components: { searchModule,exportData,formModule,pagingModule,popOperation,labelModule  },
  mounted() {
    // 计算列表高度
    this.formHeight_ = formHeight($('.sensitiveSetTop').height());
    // 初始获取下拉选项类型
    this.getdropValFun();
    // 初始获取列表数据
    this.conditionRequest();
  },
  methods:{
    // 搜索组件回调函数
    sensitiveSetSearchFun:function(data){
      this.敏感词=data.敏感词;
      this.微信分组=data.微信分组;
      this.currentNum=1;
      this.conditionRequest();
    },
    // 分页回调函数
    sensitiveSetPagingFun:function(data){
      // 判断是否搜索触发
      if(data.conversion){  this.currentNum=data.conversion  }else{this.currentNum=1;}
      if(data.valShowNum){  this.showValNum=data.valShowNum  };
      this.conditionRequest();
      return;
    },
    // 条件请求数据
    conditionRequest:function(){
      this.sensitiveSetValFun({
        pageNum:this.currentNum,
        pageSize:this.showValNum,
        wechatGroupId:this.微信分组,
        content:this.敏感词,
      });
    },
    // 获取标签数据数据
    sensitiveSetValFun:function(obj={
      pageNum:'',
      pageSize:'',
      wechatGroupId:'',
      content:'',
    }){
      var this_ = this;
      getIticket(function(ticket){
        this_.$axios.get(
          "http://"+api+"/api/1.0/word/page/ticket"+'?pageNum='+obj.pageNum+'&pageSize='+obj.pageSize+'&wechatGroupId='+obj.wechatGroupId+'&content='+obj.content,
          {headers:{
            'content-type': 'application/x-www-form-urlencoded',
            'ticket':ticket
          }}
        )
        .then((response)=>{
          if(response.data.success){
            var sensitiveSetVal = response.data.result;
            if(sensitiveSetVal){
              // 设置总页数
              var page_n=Math.ceil(sensitiveSetVal.total/this_.showValNum);
              if(page_n==0){page_n=1};
              this_.totalNumber=page_n;
              // 对象数据转换成列表数据个数
              this_.dataConversionFun(sensitiveSetVal.content);
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
      var value_=[];
      // 便利数据
      for(var i=0;i<data.length;i++){
        value_.push({
          text:data[i].content,
          id:data[i].id,
        });
      };
      // 赋值
      this.labelModuleVal=value_;
      this.labelModuleBool=true;
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
            { type:'input',  s_name:'敏感词',  prompt:'请输入敏感词'  },
            { type:'select', s_name:'微信分组',      value:[{  prompt:'请选择微信分组',  val:''  }]},
          ]
      };
      for(var i=0;i<data.groups.length;i++){
        // 搜索分组
        obj.fill[1].value.push({
          prompt:data.groups[i].name,
          val:data.groups[i].id
        });
      };
      this.sensitiveSet_searchVal=obj;
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
    },
    // 批量分组弹窗确定按钮
    determine_plfz:function(data){
    },
    // 添加/编辑备注确定函数
    determine_tjbz:function(data){
      console.log(data);
    },
    // 编辑标签函数
    sensitiveWords:function(e){
      if(this.微信分组==''){alert('请先选择微信分组！');return;};
      if(e==0){
        this.$refs.labelModule.separateAdd();
      }else if(e==1){
        if(this.labelModuleVal.length == 0){alert('没有敏感词可以操作');return;};
        this.$refs.labelModule.separateModify();
      }else if(e==2){
        if(this.labelModuleVal.length == 0){alert('没有敏感词可以操作');return;};
        this.$refs.labelModule.separateDel();
      };
    },
    // 保存修改后的标签
    SaveFunction:function(){
      var data = this.$refs.labelModule.getNewVal();
      if(data.task == '增加'){
        var this_ = this;
        var delArr = [];
        for(var i=0;i<data.val.length;i++){  
          delArr.push({
            content:data.val[i].text
          });  
        };
        getIticket(function(ticket){
          this_.$axios({
            method: 'post',
            url: "http://"+api+"/api/1.0/word/ticket/"+this_.微信分组,
            headers:{
              'content-type': 'application/json',
              'ticket':ticket
            },
            data:delArr
          })
          .then((response)=>{
            if(response.data.success){
              alert('保存成功');
              this_.labelModuleBool=false;
              this_.conditionRequest();
            }else{
              alert(response.data.msg);
            }
          })
          .catch((error)=>{
            console.log(error);
          });
        });
      }else if(data.task == '修改'){
        var this_ = this;
        var delArr = [];
        for(var i=0;i<data.val.length;i++){  
          delArr.push({
            content:data.val[i].text,
            id:data.val[i].id,
          });  
        };
        getIticket(function(ticket){
          this_.$axios({
            method: 'put',
            url: "http://"+api+"/api/1.0/word",
            headers:{
              'content-type': 'application/json',
              'ticket':ticket
            },
            data:delArr
          })
          .then((response)=>{
            if(response.data.success){
              alert('更新成功');
              this_.labelModuleBool=false;
              this_.conditionRequest();
            }else{
              alert(response.data.msg);
            }
          })
          .catch((error)=>{
            console.log(error);
          });
        });
      }else if(data.task == '删除'){
        var this_ = this;
        var delArr = [];
        for(var i=0;i<data.val.length;i++){  delArr.push(data.val[i].id);  };
        getIticket(function(ticket){
          this_.$axios({
            method: 'delete',
            url: "http://"+api+"/api/1.0/word",
            headers:{
              'content-type': 'application/json',
              'ticket':ticket
            },
            data:delArr
          })
          .then((response)=>{
            if(response.data.success){
              alert('删除成功');
              this_.labelModuleBool=false;
              this_.conditionRequest();
            }else{
              alert(response.data.msg);
            }
          })
          .catch((error)=>{
            console.log(error);
          });
        });
      };
    },


  }
}
</script>

<style lang='less'>
@import '../../assets/less/common.less';
.sensitiveSet{
  width: 95%;
  height: 100%;
  background: #fff;
  box-sizing: border-box;
  padding: 30px;
}
.sensitiveSetTop{
  margin-bottom: 10px;
  display: flex;
  flex-direction:row;
  justify-content:space-between;
}
.sensitiveSetTop>div{
  display: flex;
  flex-direction:row;
  justify-content:space-between;
  align-items:flex-end;
}
.sensitiveSetContainer{
  width: 100%;
}
</style>
