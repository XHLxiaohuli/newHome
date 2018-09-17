<template>
  <div class="updateLog">
    <div class="updateLogTop">
      <div>
        <!-- 搜索组件 -->
        <searchModule
          :searchId="'updateLogSearchId'"
          :searchVal="updateLog_searchVal"
          @searchFun="updateLogSearchFun"
        />
      </div>
      <div>
        <button class="exit_btn"  @click="popOperaShowFun(0)">发布更新</button>
      </div>
    </div>
    <div class="updateLogContainer">
      <!-- 列表组件 -->
      <div :style="'width:100%;height:'+formHeight_+'px'">
        <ul>
          <li v-for="(val,i) in valueList" :key="i">
            <div style="position: relative;box-sizing: border-box;padding:20px 0;border-bottom:1px solid #999;">
              <p class="dateOf">{{val.time}}</p>
              <p class="version">版本号：{{val.versionCode}}</p>
              <!-- <p class="details_" v-html="val.content | capitalize"></p> -->
              <textarea class="details_">{{val.content}}</textarea>
              <div class="bianjigengxin" @click="bianjiFun(val.id)">
                <img src="../../assets/img/编辑.png" alt="">
                编辑
              </div>
            </div>
          </li>
        </ul>
      </div>
      <div style="width:100%;height:30px;"></div>
      <!-- 分页组件 -->
      <pagingModule
        :totalNum=totalNumber
        :currentNum=currentNum
        :showValNum=showValNum
        @pagingFun="updateLogPagingFun"
      />
    </div>
    
    <!-- 发布更新 -->
    <popOperation
      v-if="popOperaShow==0"
      :title="'发布更新'"
      :popOperaVal="popOperaVal_xzwx"
      @determine="determine_xzwx"
      @cancel="popOperaHideFun"
    /> 

    <!-- 修改更新 -->
    <popOperation
      v-if="popOperaShow==1"
      :title="'修改更新'"
      :popOperaVal="popOperaVal_plfz"
      @determine="determine_plfz"
      @cancel="popOperaHideFun"
    />
  </div>
</template>

<script>
// 搜索组件
import searchModule from '@/components/searchModule'
// 分页组件
import pagingModule from '@/components/pagingModule'
// 遮罩表单组件
import popOperation from '@/components/popOperation'
export default {
  data() {
    return {
      // 搜索组件数据
      updateLog_searchVal:{
          title:'',                           //搜索title
          s_nameShow:true,                    //子标题显示
          search:true,                        //搜索按钮（true为使用，false为不使用）
          reset:false,                        //重置按钮（true为使用，false为不使用）
          timeChoose:{                        //日期区间筛选
            bool:false,                       //开关
            id:'moren'                        //组件id
          },
          fill:[
            { type:'input',  s_name:'补丁版本',  prompt:'补丁版本'  },
            { type:'input',  s_name:'版本名',  prompt:'版本名'  },
            { type:'input',  s_name:'版本号',  prompt:'版本号'  },
          ]},
      // 版本数据
      valueList:[

      ],
      // 列表高度
      formHeight_:0,
      // 补丁版本条件
      补丁版本:'',
      // 版本名条件
      版本名:'',
      // 版本号条件
      版本号:'',
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
        {  title:'适用版本',  type:'input',  prompt:'请输入适用版本',  },
        {  title:'补丁版本',  type:'input',  prompt:'请输入补丁版本',  },
        {  title:'版本名称(必填)',  type:'input',  prompt:'请输入版本名称',  },
        {  title:'版本号(必填)',  type:'input',  prompt:'请输入版本号',  },
        {  title:'更新日志内容',  type:'textarea',  prompt:'请输入更新日志内容',  },
      ],
      // 批量分组弹窗展示数据
      popOperaVal_plfz:[],
      // 添加/编辑备注弹窗展示数据
      popOperaVal_tjbz:[
        {  title:'微信备注信息',  type:'textarea',  max:20,  prompt:'最大输入20字',  },
      ],
      // 单个修改分组
      aSinglGroup:{},
    }
  },
  components: { searchModule,pagingModule,popOperation  },
  watch:{
    updateLog_searchVal:{
      handler(newVal, oldVal){
        // 计算列表高度
        var this_ = this;
        setTimeout(function(){
          this_.formHeight_ = formHeight($('.updateLogTop').height());
        },50);
      },
      deep:true
    },
  },
  mounted() {
    // 计算列表高度
    this.formHeight_ = formHeight($('.updateLogTop').height());
    // 初始获取列表数据
    this.conditionRequest();
  },
  methods:{
    // 搜索组件回调函数
    updateLogSearchFun:function(data){
      this.补丁版本=data.补丁版本;
      this.版本名=data.版本名;
      this.版本号=data.版本号;
      this.currentNum=1;
      this.conditionRequest();
    },
    // 分页回调函数
    updateLogPagingFun:function(data){
      // 判断是否搜索触发
      if(data.conversion){  this.currentNum=data.conversion  }else{this.currentNum=1;}
      if(data.valShowNum){  this.showValNum=data.valShowNum  };
      this.conditionRequest();
    },
    // 条件请求数据
    conditionRequest:function(){
      this.updateLogValFun({
        pageNum:this.currentNum,
        pageSize:this.showValNum,
        patchVersion:this.补丁版本,
        versionName:this.版本名,
        versionCode:this.版本号,
      });
    },
    // 获取微信数据数据
    updateLogValFun:function(obj={
      pageNum:'',
      pageSize:'',
      patchVersion:'',
      versionName:'',
      versionCode:'',
    }){
      var this_ = this;
      getIticket(function(ticket){
        this_.$axios.get(
          "http://"+api+"/api/1.0/logger/version/page"+'?pageNum='+obj.pageNum+'&pageSize='+obj.pageSize+'&patchVersion='+obj.patchVersion+'&versionName='+obj.versionName+'&versionCode='+obj.versionCode,
          {headers:{
            'content-type': 'application/x-www-form-urlencoded',
            'ticket':ticket
          }}
        )
        .then((response)=>{
          if(response.data.success){
            var updateLogVal = response.data.result;
            if(updateLogVal){
              // 设置总页数
              var page_n=Math.ceil(updateLogVal.total/this_.showValNum);
              if(page_n==0){page_n=1};
              this_.totalNumber=page_n;
              // 对象数据转换成列表数据个数
              this_.dataConversionFun(updateLogVal.content);
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
      for(var i=0;i<data.length;i++){
        data[i].time = getdateTime(data[i].createTime);
      };

      this.valueList = data;
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

      if(data.type=='szfz'){
        // 打开备注弹窗
        this.popOperaShowFun(2);
        this.aSinglGroupId .push(data.id);
      }else if(data.type=='cz'){
        // this.imIdObj
        // 
        var arr = this.updateLogFormVal.value;
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
    },
    // 新增微信弹窗确定按钮
    determine_xzwx:function(data){
      var this_ = this;
      getIticket(function(ticket){
        this_.$axios({
          method: 'post',
          url: "http://"+api+"/api/1.0/logger/version",
          headers:{
            'content-type': 'application/json',
            'ticket':ticket
          },
          data: {
            content : data[4].val,
            applyVersion : data[0].val,
            patchVersion : data[1].val,
            versionName : data[2].val,
            versionCode : data[3].val,
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
            alert('发布成功');
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
          method: 'put',
          url: "http://"+api+"/api/1.0/logger/version",
          headers:{
            'content-type': 'application/json',
            'ticket':ticket
          },
          data: {
            id:this_.aSinglGroup.id,
            content : data[4].val!==''?data[4].val:this_.aSinglGroup.content,
            applyVersion : data[0].val!==''?data[0].val:this_.aSinglGroup.applyVersion,
            patchVersion : data[1].val!==''?data[1].val:this_.aSinglGroup.patchVersion,
            versionName : data[2].val!==''?data[2].val:this_.aSinglGroup.versionName,
            versionCode : data[3].val!==''?data[3].val:this_.aSinglGroup.versionCode,
          }
        }).then((response)=>{
          if(response.data.success){
            // 关闭弹窗
            this_.popOperaShowFun(-1);
            // 
            alert('更新成功');
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
      this.popOperaShow=-1;
    },
    //
    bianjiFun:function(id){
      var valData = this.valueList;
      for(var i=0;i<valData.length;i++){
        if(id == valData[i].id){
          this.aSinglGroup = valData[i];
        };
      };
      this.popOperaVal_plfz = [
        {  title:'适用版本',  type:'input',  prompt:this.aSinglGroup.applyVersion,  },
        {  title:'补丁版本',  type:'input',  prompt:this.aSinglGroup.patchVersion,  },
        {  title:'版本名称(必填)',  type:'input',  prompt:this.aSinglGroup.versionName,  },
        {  title:'版本号(必填)',  type:'input',  prompt:this.aSinglGroup.versionCode,  },
        {  title:'更新日志内容',  type:'textarea',  prompt:this.aSinglGroup.content,  },
      ];

      this.popOperaShow=1;
    },

  }
}
</script>

<style lang='less'>
@import '../../assets/less/common.less';
.dateOf{
  height: 30px;
  text-align: left;
  font-weight: bold;
  font-size: 14px;
  line-height: 30px;
  color: #262626;
}
.version{
  height: 30px;
  text-align: left;
  font-size: 14px;
  line-height: 30px;
  color: #535353;
}
.details_{
  height: auto;
  width: 100%;
  font-family:PingFangSC-Medium;
  font-size: 14px;
  line-height: 24px;
  color: #535353;
  background:none;  
	outline:none;  
  border:0px;
  resize:none;
}
.bianjigengxin{
  position: absolute;
  right:30px;
  bottom:20px;
  color: @mainColor; 
  cursor:pointer;
}
.updateLog{
  width: 95%;
  height: 100%;
  background: #fff;
  box-sizing: border-box;
  padding: 30px;
}
.updateLogTop{
  margin-bottom: 10px;
  display: flex;
  flex-direction:row;
  justify-content:space-between;
}
.updateLogTop>div{
  display: flex;
  flex-direction:row;
  justify-content:space-between;
  align-items:flex-end;
}
.updateLogContainer{
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
