<template>
    <div class="soundList">
      <div class="soundListTop" style="justify-content:flex-start">
        <div>
          <!-- 搜索组件 -->
          <searchModule
            ref="mychild"
            :searchId="'soundListSearchId'"
            :searchVal="soundList_searchVal"
            @searchFun="soundListSearchFun"
          />
        </div>
        <div style="padding-top:57px;position: relative;">
            <!-- <exportData
                :iframeData="wechatListDataVal"
            /> -->
            <button class="exit_btn" @click="exportData">导出</button>
            <button class="exit_btn" style="margin:0 20px;" @click="upload">导入</button><!--@click="popOperaShowFun(0)"-->
            <button class="exit_btn" @click="downloadTemplate">下载模板</button><!--@click="popOperaShowFun(1)"-->
            <button class="exit_btn" style="margin-left: 20px;" @click="newAdd">新增联系人</button><!--@click="popOperaShowFun(1)"-->
            <input type="file" class="inputImport" id="fu_UploadFile" @change="upload">
        </div>
      </div>
      <div class="soundListContainer">
        <!-- 列表组件 -->
        <formModule
          :checkboxGroup=false
          :separationBorder=true
          :showHeight=600
          :formVal="soundListFormVal"
          @formClickFun="formClickFun"
          ref="soundListForm"
        >
            <div class="clickSpan" slot="operation">
                <span class="edit">编辑</span><span class="delete">删除</span>
            </div>
        </formModule>
        <div style="width:100%;height:30px;"></div>
        <!-- 分页组件 -->
        <pagingModule
          :totalNum=totalNumber
          :currentNum=currentNum
          :showValNum=showValNum
          @pagingFun="soundListPagingFun"
        />
      </div>

      <!--弹框蒙版-->
      <div class="outerLayerMask" style="display:none;">
        <!--查看备注和客户需求start-->
        <div class="remAndDemBody" style="display:none">
          <!--关闭弹框按钮-->
          <div class="closeRemAndDem" @click="closeRemAndDem"></div>
          <p class="remAndDemTitle">查看备注</p>
          <p class="maskUserName">
            <span>客户姓名：</span><span class="userName">王小波</span>
          </p>
          <div class="remAndDemContent">
            <span class="remarks">备注：</span><textarea v-model="textMould"  class="remAndDemText" readonly="true" placeholder="请输入备注，最多可输入40个文字。" maxlength="40" name="" id="" cols="30" rows="2"></textarea>
          </div>
          <div class="remAndDemBtn" style="display:none">
            <button @click="cancel">取消</button><button @click="modifyRemarks">确定</button>
          </div>
        </div>
        <!--查看备注和客户需求end-->

        <!--新增和编辑start-->
        <div class="newaddAndEdit" style="display:none">
          <p class="addAndEditTitle">新增联系人</p>
          <div class="addAndEditMain">
            <div>
              <span class="addAndEditSpan">客户姓名</span><input value="" placeholder="请输入客户姓名"  class="addAndEditInput usernamess" type="text"><!--v-model="usernames"-->
            </div>

            <div class="addAndEditDiv">
              <span class="addAndEditSpan">客户电话</span><input value="" placeholder="请输入客户电话"  class="addAndEditInput userphones" type="text"><!--v-model="userphone"-->
            </div>

            <div class="addAndEditDiv" v-if="false">
              <span class="addAndEditSpan">公司ID</span><input value="" placeholder="请输入公司ID"  class="addAndEditInput companyIDs" type="text"><!--v-model="companyID"-->
            </div>

            <div class="addAndEditDiv">
              <span class="addAndEditSpan">客户微信</span><input value="" placeholder="请输入客户微信"  class="addAndEditInput userwxs" type="text"><!--v-model="userwx"-->
            </div>

            <div class="addAndEditDiv">
              <span class="addAndEditSpan">分配客服</span><select @change="check" ref="inputSelect" style="width:349px;" class="addAndEditInput">
                <option v-for="(item,index) in allCustomerData" :value =item>{{item}}</option>
              </select>
            </div>

            <div class="addAndEditDiv">
              <span class="addAndEditSpan">客户来源</span><select @change="sourceCheck" ref="inputSourceSelect" style="width:349px;" class="addAndEditInput">
                <option v-for="(item,index) in userSourceData" :value =item>{{item}}</option>
              </select>
            </div>

            <div class="addAndEditDiv">
              <span class="addAndEditSpan" style="position:relative;top:-32px;">客户需求</span><input value="" placeholder="请输入客户需求"  class="addAndEditInput userdemands" style="height:84px;" type="text"><!--v-model="userdemand"-->
            </div>

            <div class="addAndEditDiv">
              <span class="addAndEditSpan" style="position:relative;top:-32px;">备注</span><input value="" placeholder="请输入客户备注"  class="addAndEditInput userremarkss" style="height:84px;" type="text"><!--v-model="userremarks"-->
            </div>
          </div>
          <div class="addAndEditBtn">
            <button @click="cancelAndEditBtn">取消</button>
            <button @click="sureAndEditBtn">确定</button>
          </div>
        </div>
        <!--新增和编辑end-->

        <!--删除start-->
          <div class="deleteContacts" style="display:none;">
            <p class="deleteTitle">删除联系人</p>
            <p class="deleteText">确定删除<span class="deleteUsername">王小波</span>吗？</p>
            <div class="deleteBtnDiv">
              <button @click="cancelDelete">取消</button><button @click="sureDelete">确定</button>
            </div>
          </div>
        <!--删除start-->
      </div>
      
           
      

    </div>
  </template>
  
  <script>
  // 搜索组件
  import searchModule from '@/components/searchModule'
  // 数据导出表格组件
  //import exportData from '@/components/exportData'
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
        textMould:"",
        picValue:"",

        Uname:"",
        Uphone:"",//电话
        Uwx:"",//微信
        Uservice:"",//客服
        UcompanyId:"",//公司id
        Usource:"",//来源
        Uid:"",//id

        initialCustomerData:[],


        userDemandText:"",//客户需求
        userRemarksText:"",//客户备注
        selectValue:"",//选择客户的值
        userSourceVAlue:"",//客户来源
        newOrEdit:"",
        allCustomerData:["请选择客服"],
        userSourceData:["请选择客服来源","微信","公众号"],
        //通讯录管理数据
        // 导出的数据
        //wechatListDataVal:'1,2,3,4\n5,6,7,8\n',
        // 搜索组件数据
        soundList_searchVal:{

        title:'通讯录管理',                           //搜索title
        search:true,                        //搜索按钮（true为使用，false为不使用）
        reset:false,                         //重置按钮（true为使用，false为不使用）
        timeChoose:{                        //日期区间筛选
            bool:true,                        //开关
            id:'date1'                        //组件id
        },
        fill:[                              //搜索框内容
            {
            type:'input',                   //输入框type（类型：input）
            s_name:'客户名字',               //标签s_name（）
            prompt:'咨询客户'                //提示
            },
            {
            type:'select',                  //输入框type（类型：select）
            s_name:'客户来源',                 //标签s_name（）
            value:[                         //下拉框选项数组
                { 
                prompt:'请选择客户来源',       //提示
                val:''                      //下拉框数据
                },
                { 
                prompt:'我怎么知道',           //提示
                val:'1'                     //下拉框数据
                },
                { 
                prompt:'我怎么知道1',           //提示
                val:'2'                     //下拉框数据
                },
                { 
                prompt:'我怎么知道2',           //提示
                val:'3'                     //下拉框数据
                },
            ]
            },
            {
            type:'select',                  //输入框type（类型：select）
            s_name:'分配客服',                 //标签s_name（）
            value:[                         //下拉框选项数组
                { 
                prompt:'请选择分配客服',       //提示
                val:''                      //下拉框数据
                },
                { 
                prompt:'不分了',           //提示
                val:'1'                     //下拉框数据
                },
                { 
                prompt:'不分了1',           //提示
                val:'2'                     //下拉框数据
                },
                { 
                prompt:'不分了2',           //提示
                val:'3'                     //下拉框数据
                },
            ]
            }
        ]

        },



        //录音管理模板数据
        indexs:"",
        speedTiming:"",
        readTime:0,
        allLengthOfTime:0,
        playerShow:false,
        onlyId:"",
        callerID:"",
        callerPhone:"",
        listData:"",//列表数据
        
        // 导出的数据
        //soundListDataVal:'1,2,3,4\n5,6,7,8\n',
        // 列表数据
        soundListFormVal:{},
        // 总数据页码
        totalNumber:0,
        // 第几页
        currentNum:1,
        // 显示个数
        showValNum:5,
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
        //客户名字
        inputUserName:"",
        customerSource:"",
        distributionAdviser:"",
  
      }
    },
    watch:{
        soundListFormVal(newVal,oldVal){
            this.soundListFormVal=newVal;

            this.sound()

        }
    },
    components: { searchModule,formModule,pagingModule,popOperation,chatRecord  },//exportData,
    created(){
        //获取用户信息
        var this_=this;
        indexedDBopt.getData('userData','userVal',function(data){
        this_.callerID=data.val.id;
        this_.callerPhone=data.val.account.phone;
        });
        this.allCustomerService()
    },

    mounted() {
      
      // 初始获取下拉选项类型
      //this.getdropValFun();
      // 初始获取列表数据
      this.conditionRequest();
    },
    methods:{
      check(){
        var serviceName
        // var backendNeeds
        serviceName= this.$refs.inputSelect.value
        for(var i=0;i<this.initialCustomerData.length;i++){
          // console.log(this.initialCustomerData[i].name)
          if(serviceName==this.initialCustomerData[i].name){
            this.selectValue =this.initialCustomerData[i].account.username
            return
          }
        }

        
      },
      sourceCheck(){
        this.userSourceVAlue = this.$refs.inputSourceSelect.value
        
      },





      //秒数转时间
      secondTurnTime(secondValues){
        //var day;
        var hour='00';
        var minute='00';
        var second='00';
        var secondValue=parseInt(secondValues)
          if(secondValue>=3600){
            hour=parseInt(secondValue/3600)>=10?parseInt(secondValue/3600):("0"+parseInt(secondValue/3600))
            minute=parseInt((secondValue%3600)/60)>0?(parseInt((secondValue%3600)/60)>=10?parseInt((secondValue%3600)/60):("0"+parseInt((secondValue%3600)/60))):"00"
            second=parseInt((secondValue%3600)%60)>0?(parseInt((secondValue%3600)%60)>=10?parseInt((secondValue%3600)%60):("0"+parseInt((secondValue%3600)%60))):"00"
          }else{
            hour="00"
            if(secondValue>=60){
              minute=parseInt(secondValue/60)>=10?parseInt(secondValue/60):("0"+parseInt(secondValue/60))
              second=parseInt(secondValue%60)>0?(parseInt(secondValue%60)>=10?parseInt(secondValue%60):("0"+parseInt(secondValue%60))):"00"
            }else{
              minute="00"
              if(secondValue>0){
                second=secondValue>=10?secondValue:("0"+secondValue)
              }else{
                second="00"
              }
            }
          }
        return hour+":"+minute+":"+second
      },
      //录音点击
      sound(){
        var this_=this
        setTimeout(function(){

                $('.clickSpan').each(function(){
                    $(this).children('span').bind('click',function(){
                        var id = $(this).closest('.jieshouZY').attr('data-id');
                        this_.onlyId=id
                    });
                })

                //编辑事件
                $('.edit').bind('click',function(){
                  $('.outerLayerMask')[0].style.display="block"
                  $('.newaddAndEdit')[0].style.display="block"
                  $('.addAndEditTitle').html("编辑联系人")
                  this_.newOrEdit="edit"
                  this_.singlePut(this_.onlyId)
                })

                //删除事件
                $('.delete').bind('click',function(){
                  $('.outerLayerMask')[0].style.display="block"
                  $('.deleteContacts')[0].style.display="block"
                  for(var i=0;i<this_.listData.length;i++){
                    if(this_.onlyId==this_.listData[i].id){
                      $('.deleteUsername').html(this_.listData[i].name)
                      break;
                    }
                    
                  }
                  
                })


          });
      },
     
      // 搜索组件回调函数
      soundListSearchFun(data){
        this.inputUserName=data.客户名字
        this.customerSource=data.客户来源
        this.distributionAdviser=data.分配客服
        this.currentNum=1;
        
        this.conditionRequest();
        
      },
      // 分页回调函数
      soundListPagingFun:function(data){
        // 判断是否搜索触发
        if(data.conversion){  this.currentNum=data.conversion  }else{this.currentNum=1;}
        if(data.valShowNum){  this.showValNum=data.valShowNum  };
        this.conditionRequest();
      },
      // 条件请求数据
      conditionRequest(){
        var _this=this
        //if((this.callerID!==""&&(this.callerPhone!==""))){
            this.soundRecordingList({
                pageNum:_this.currentNum,
                pageSize:_this.showValNum,
            });
        
      },
  
    //通讯录管理数据请求
    soundRecordingList(obj={pageNum:'',pageSize:''}){
        var this_ = this;
        getIticket(function(ticket){
            this_.$axios.get(
                "http://"+api+"/api/1.0/customer/page/ticket"+'?pageNum='+obj.pageNum+'&pageSize='+obj.pageSize,
                {headers:{
                'content-type': 'application/x-www-form-urlencoded',
                'ticket':ticket
                }}
            )
            .then((response)=>{
                var soundListVal = response.data.result;
                if(soundListVal){
                // 设置总页数
                var page_n=Math.ceil(soundListVal.total/this_.showValNum);
                if(page_n==0){page_n=1};
                this_.totalNumber=page_n;
                // 对象数据转换成列表数据个数
                this_.dataConversionFun(soundListVal.content);
                }
            })
                .catch((error)=>{
                console.log(error);  
            });
        })

    },



    //时间转换
    timestampToTime(timestamp){
      var date = new Date(timestamp); //时间戳为10位需*1000，时间戳为13位的话不需乘1000
        var Y = date.getFullYear() + "-";
        var M =
          (date.getMonth() + 1 < 10
            ? "0" + (date.getMonth() + 1)
            : date.getMonth() + 1) + "-";
        var D = (date.getDate() < 10 ? "0" + date.getDate() : date.getDate()) + " ";
        var h =
          (date.getHours() < 10 ? "0" + date.getHours() : date.getHours()) + ":";
        var m =
          (date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes()) +
          ":";
        var s =
          date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds();
        return Y + M + D + h + m + s;
    },
    //时间区间
    timeSection(startTime,endTime){
      var differenceValue=endTime-startTime
      if(differenceValue>=86400000){
        var day= parseInt(differenceValue/86400000)
        var hour=parseInt((differenceValue%86400000)/3600000)
        var minute=parseInt(((differenceValue%86400000)%3600000)/60000)
        var second=parseInt((((differenceValue%86400000)%3600000)%60000)/1000)
      }else{
        var day=0
        if(differenceValue>3600000){
          var hour=parseInt(differenceValue/3600000)
          var minute=parseInt((differenceValue%3600000)/60000)
          var second=parseInt(((differenceValue%3600000)%60000)/1000)
        }else{
          var hour=0
          if(differenceValue>60000){
            var minute=parseInt(differenceValue/60000)
            var second=parseInt((differenceValue%60000)/1000)
          }else{
            var minute=0
            if(differenceValue>1000){
              var second=parseInt(differenceValue/1000)
            }else{
              var second=0
            }
          }
        }
      }
      
      return day+"天"+hour+"小时"+minute+"分"+second+"秒"
    },
    
      // 对象数据转换成列表数据个数
      dataConversionFun:function(data){
        this.listData=data
        var title=[
                {"name":"客户姓名","tag":"khxm","type":"string","width":"20"},
                {"name":"客户电话","tag":"khdh","type":"string","width":"20"},
                {"name":"客户微信","tag":"khwx","type":"string","width":"20"},
                {"name":"客户来源","tag":"khly","type":"string","width":"20"},
                {"name":"添加时间","tag":"tjsj","type":"string","width":"20"},
                {"name":"客户需求","tag":"khxq","type":"onclick","width":"20"},
                {"name":"备注","tag":"bz","type":"onclick","width":"20"},
                {"name":"操作","tag":"cz","type":"operation","width":"20"},
            ],value_=[]; 
        // 便利数据
        var khpfs
        for(var i=0;i<data.length;i++){
           value_.push({
            id:data[i].id,
            khxm:data[i].name,
            khdh:data[i].phone,
            khwx:data[i].wxAccount,
            khly:data[i].channel,
            tjsj:this.timestampToTime(data[i].createTime),
            khxq:'查看详情',
            bz:'查看详情',
            cz:"下载",
           });
        };
        // 赋值
        this.soundListFormVal={
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
            var val = response.data.result;
            if(JSON.stringify(val) !== "{}"){
              // 搜索组件选项数据
              this_.dataConverDropValFun(response.data.result);
            }
          }).catch((error)=>{
            console.log(error);
          });
        });
      },
      // 点击表信息触发
      formClickFun:function(data){
        var this_=this
        this_.singlePut(data.id)
        $('.remAndDemText').html("")
        for(var i=0;i<this_.listData.length;i++){
          if(data.id==this_.listData[i].id){
            $('.userName').html(this_.listData[i].name)
            break;
          }
        }

        $('.outerLayerMask')[0].style.display="block"
        $('.remAndDemBody')[0].style.display="block"
        if(data.type=='khxq'){
          // 打开客户需求弹窗
          setTimeout(()=>{
            this_.textMould=this_.userDemandText
            $('.remAndDemText').prop("readonly",true)
            $('.remAndDemTitle').html("客户需求")
            $('.remAndDemBtn')[0].style.display="none"
          },300)
        
        }else if(data.type=='bz'){
          setTimeout(()=>{
            this_.textMould=this_.userRemarksText
            $('.remAndDemText').prop("readonly",true)
            $('.remAndDemBtn')[0].style.display="none"
            $('.remAndDemTitle').html("查看备注")
          },300)

        };
      },
      //关闭弹框
      closeRemAndDem(){
        $('.outerLayerMask')[0].style.display="none"
        $('.remAndDemBody')[0].style.display="none"
      },
      //点击取消按钮关闭弹框
      cancel(){
       
        $('.outerLayerMask')[0].style.display="none"
        $('.remAndDemBody')[0].style.display="none"
        
      },
      //添加与编辑按钮取消
      cancelAndEditBtn(){
        $('.outerLayerMask').eq(0).css({display:'none'});
        $('.newaddAndEdit').eq(0).css({display:'none'});

        // this.sound();
      },
      //新增联系人
      newAdd(){


        var this_=this
        $('.usernamess')[0].value=""
        $('.userphones')[0].value=""
        $('.userwxs')[0].value=""
        // $('.companyIDs')[0].value=""
        $('.userdemands')[0].value=""
        $('.userremarkss')[0].value=""
        this_.$refs.inputSelect.value="请选择客服"
        this_.$refs.inputSourceSelect.value="请选择客服来源"
        $('.outerLayerMask')[0].style.display="block"
        $('.newaddAndEdit')[0].style.display="block"
        $('.addAndEditTitle').html("新增联系人")
        this.newOrEdit="newAdd"
      },
      //新增和编辑确认事件
      sureAndEditBtn(){

        var this_ = this;
        var urlAndParameter
        if(this.newOrEdit=="newAdd"){
          this_.newAddFun()
        }else if(this.newOrEdit=="edit"){
          this.editFun()
        }

      },
      //新增联系人
      newAddFun(){
        var this_=this
        getIticket(function(ticket){

          this_.$axios({
            method: 'post',
            url: "http://"+api+"/api/1.0/customer",
            headers:{
              'content-type': 'application/json',
              'ticket':ticket
            },
            data: {
              'name':$('.usernamess')[0].value,
              'phone':$('.userphones')[0].value,
              'wxAccount':$('.userwxs')[0].value,
              'customerService':this_.selectValue,
              'requirement':$('.userdemands')[0].value,
              'comment':$('.userremarkss')[0].value,
              // 'companyId':$('.companyIDs')[0].value,
              'channel':this_.userSourceVAlue,

            }
          }).then((response)=>{
            if(response.data.code==200){
              this_.cancelAndEditBtn()
              this_.conditionRequest()
            }
          }).catch((error)=>{
            console.log(error);
          });



        })
      },
      //先取单条数据再编辑
      singlePut(onlyDataId){
        var this_=this
        this.onlyId=onlyDataId
        getIticket(function(ticket){

          this_.$axios({
            method: 'get',
            url: "http://"+api+"/api/1.0/customer/"+onlyDataId,
            headers:{
              'content-type': 'application/json',
              'ticket':ticket
            },
            data: {}
          }).then((response)=>{
            this_.userDemandText=response.data.result.requirement//需求
            this_.userRemarksText=response.data.result.comment//备注
            this_.Uname=response.data.result.name//名字
            this_.Uphone=response.data.result.phone//电话
            this_.Uwx=response.data.result.wxAccount//微信
            this_.Uservice=response.data.result.customerService//客服
            this_.UcompanyId=response.data.result.companyId//公司id
            this_.Usource=response.data.result.channel//来源
            this_.Uid=response.data.result.id//id

            $('.usernamess')[0].value=response.data.result.name
            $('.userphones')[0].value=response.data.result.phone
            $('.userwxs')[0].value=response.data.result.wxAccount
            $('.companyIDs')[0].value=response.data.result.companyId
            $('.userdemands')[0].value=response.data.result.requirement
            $('.userremarkss')[0].value=response.data.result.comment
            this_.$refs.inputSelect.value=response.data.result.customerService
            this_.$refs.inputSourceSelect.value=response.data.result.channel
            this_.selectValue=response.data.result.customerService
            this_.userSourceVAlue=response.data.result.channel
            
          }).catch((error)=>{
            console.log(error);
          });

        })
      },
      //编辑联系人
      editFun(){
        var this_=this
        getIticket(function(ticket){

            this_.$axios({
            method: 'put',
            url: "http://"+api+"/api/1.0/customer",
            headers:{
              'content-type': 'application/json',
              'ticket':ticket
            },
            data: {
              'name':$('.usernamess')[0].value,
              'phone':$('.userphones')[0].value,
              'wxAccount':$('.userwxs')[0].value,
              'customerService':this_.selectValue,
              'requirement':$('.userdemands')[0].value,
              'comment':$('.userremarkss')[0].value,
              // 'companyId':$('.companyIDs')[0].value,
              'channel':this_.userSourceVAlue,
              'id':this_.onlyId,

            }
          }).then((response)=>{
            if(response.data.code==200){
              this_.cancelAndEditBtn()
              this_.conditionRequest()
            }
          }).catch((error)=>{
            console.log(error);
          });
        })
      },
      //取消删除
      cancelDelete(){
        $('.outerLayerMask')[0].style.display="none"
        $('.deleteContacts')[0].style.display="none"
      },
      //确定删除
      sureDelete(){
        var this_=this
        getIticket(function(ticket){

            this_.$axios({
            method: 'delete',
            url: "http://"+api+"/api/1.0/customer/"+this_.onlyId,
            headers:{
              'content-type': 'application/json',
              'ticket':ticket
            },
            data: {}
          }).then((response)=>{
            if(response.data.code==200){
              this_.cancelDelete()
              this_.conditionRequest()
            }
          }).catch((error)=>{
            console.log(error);
          });
        })
      },
      //确定修改备注
      modifyRemarks(){
        var this_=this
        // this_.userDemandText=response.data.result.requirement//需求
        //     this_.userRemarksText=response.data.result.comment//备注
        //     this_.Uname=response.data.result.name//名字
        //     this_.Uphone=response.data.result.phone//电话
        //     this_.Uwx=response.data.result.wxAccount//微信
        //     this_.Uservice=response.data.result.customerService//客服
        //     this_.UcompanyId=response.data.result.companyId//公司id
        //     this_.Usource=response.data.result.channel//来源
        //     this_.Uid=response.data.result.id//id
        getIticket(function(ticket){

            this_.$axios({
            method: 'put',
            url: "http://"+api+"/api/1.0/customer/update",
            headers:{
              'content-type': 'application/json',
              'ticket':ticket
            },
            data: {
              'name':this_.Uname,
              'phone':this_.Uphone,
              'wxAccount':this_.Uwx,
              'customerService':this_.Uservice,
              'requirement':this_.userDemandText,
              'comment':this_.textMould,
              'companyId':this_.UcompanyId,
              'channel':this_.Usource,
              'id':this_.Uid,

            }
          }).then((response)=>{
            if(response.data.code==200){
              this_.textMould=""
              $('.outerLayerMask')[0].style.display="none"
              $('.remAndDemBody')[0].style.display="none"
              //this_.conditionRequest()
            }
          }).catch((error)=>{
            console.log(error);
          });
        })
      },
      //导入
      upload(e){
        let files = e.target.files || e.dataTransfer.files;
        if (!files.length) return;
        this.picValue = files[0];
        console.log((files[0].name).slice(-4))
        if((files[0].name).slice(-4)=="xlsx"){
          this.postData(this.picValue,"http://"+api+"/api/1.0/customer/importFile")
        }else{
          alert("你上传的不是.xlsx文件")
        }
      },
      postData(value,url){
        var this_=this
        var form = new FormData();
        form.append("file", value);
        getIticket(function(ticket){

            this_.$axios({
            method: 'post',
            url: url,
            headers:{'Content-Type':'multipart/form-data'},
            data:form,
          }).then((response)=>{
            alert("导入成功")
            this.conditionRequest();
          }).catch((error)=>{
            console.log(error);
          });
        })
      },
      //下载模板
      downloadTemplate(){
        var this_=this
        window.location.href="http://"+api+"/api/1.0/customer/downLoadModel"
        // getIticket(function(ticket){

        //     this_.$axios({
        //     method: 'get',
        //     url: "http://192.168.5.93:8886/api/1.0/customer/downLoadModel",
        //     headers:{
        //       'content-type': 'application/json',
        //       'ticket':ticket
        //     },
        //   }).then((response)=>{
        //     if(response.data.code==200){
             
        //     }
        //   }).catch((error)=>{
        //   });
        // })
      },
      //导出
      exportData(){
        var this_=this
        this.$refs.mychild.searchFun();
        window.location.href="http://"+api+"/api/1.0/customer/exportFile?"+"name="+this_.inputUserName+"&channel="+this_.customerSource+"&cs="+this_.distributionAdviser
        // getIticket(function(ticket){

        //     this_.$axios({
        //     method: 'GET',
        //     url: "http://192.168.5.93:8886/api/1.0/customer/exportFile",
        //     headers:{
        //       'content-type': 'application/x-www-form-urlencoded',
        //       'ticket':ticket
        //     },
        //     data:{
        //       name:this_.inputUserName,
        //       channel:this_.customerSource,
        //       cs:this_.distributionAdviser
        //     }
        //   }).then((response)=>{
        //     if(response.data.code==200){
             
        //     }
        //   }).catch((error)=>{
        //     console.log(error);
        //   });
        // })
      },
      allCustomerService(){
        var this_=this
        getIticket(function(ticket){

            this_.$axios({
            method: 'get',
            url: "http://"+api+"/api/1.0/user/find/seller/ticket",
            headers:{
              'content-type': 'application/json',
              'ticket':ticket
            },
            data: {}
          }).then((response)=>{
            if(response.data.code==200){
              console.log(response.data.result)
              this_.initialCustomerData=response.data.result
              for(var i=0;i<response.data.result.length;i++){
                // console.log(response.data.result[i].account.username)
                  this_.allCustomerData.push(response.data.result[i].name)
              }

            }
          }).catch((error)=>{
            console.log(error);
          });
        })
      },
    
  
    }
  }
  </script>
  
  <style lang='less'>
  @import '../../assets/less/common.less';
  /**通讯录管理记录**/
  .clickSpan>span{
    font-size:14px;
    font-family:PingFangSC-Regular;
    color:rgba(0,119,255,1);
    cursor:pointer;
  }
  .clickSpan>span:nth-child(2){
    margin-left: 20px;
  }
  .soundList{
    width: 95%;
    height: 100%;
    background: #fff;
    box-sizing: border-box;
    padding: 30px;
  }
  .soundListTop{
    margin-bottom: 10px;
    display: flex;
    flex-direction:row;
    justify-content:space-between;
  }
  .soundListTop>div{
    display: flex;
    flex-direction:row;
    justify-content:space-between;
  }
  .soundListContainer{
    width: 100%;
    height: 720px;
  }
  .players{
    width:745px;
    height:420px;
    background:rgba(255,255,255,1);
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    margin: auto;
    text-align: center;
  }
  #player{
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    margin: auto;
    text-align: center;
  }
  .closePlayer{
    width: 20px;
    height: 20px;
    position: absolute;
    top: 5px;
    right: 5px;
    background: url('../../assets/img/close.png') no-repeat;
    cursor:pointer;
  }
  audio {
    width: 500px;
  }

  .outerLayerMask{
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    margin: auto;
    background:rgba(0,0,0,0.2);
    z-index: 9999;
  }
  .remAndDemBody{
    width:668px;
    height:417px;
    background:rgba(255,255,255,1);
    border-radius:8px;
    position:absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    margin: auto;
  }
  .closeRemAndDem{
    width:36px;
    height:36px;
    background:url('../../assets/img/delete.png') no-repeat;
    position: absolute;
    top: 28px;
    right: 24px;
  }
  .remAndDemTitle{
    font-size:22px;
    font-family:PingFangSC-Medium;
    color:rgba(51,51,51,1);
    line-height:30px;
    padding-top: 57px;
  }
  .maskUserName{
    text-align: left;
    padding-left: 102px;
    padding-top: 58px;
  }
  .maskUserName>span{
    font-size:18px;
    font-family:PingFangSC-Regular;
    color:rgba(51,51,51,1);
    line-height:25px;
  }
  .maskUserName>span:nth-child(2){
    color:#878787;
  }
  .remarks{
    font-size:18px;
    font-family:PingFangSC-Regular;
    color:rgba(51,51,51,1);
    position: relative;
    top:-55px;
  }
  .remAndDemContent{
    padding-left: 102px;
    padding-top: 15px;
    text-align: left;
  }
  .remAndDemText{
    width:400px;
    height:72px;
    font-size:18px;
    font-family:PingFangSC-Regular;
    color:rgba(51,51,51,1);
    line-height:36px;
  }
  .remAndDemBtn{
    padding-top: 51px;
  }
  .remAndDemBtn>button{
    width:98px;
    height:46px;
    border-radius:4px;
    color:#fff;
    border:0;
  }
  .remAndDemBtn>button:nth-child(1){
    background:#C7C7C7;
  }
  .remAndDemBtn>button:nth-child(2){
    margin-left: 30px;
    background:#0077FF;
  }
  .newaddAndEdit{
    width:756px;
    height:888px;
    background:rgba(255,255,255,1);
    border-radius:8px;
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    margin: auto;
  }
  .addAndEditTitle{
    font-size:22px;
    font-family:PingFangSC-Medium;
    color:rgba(51,51,51,1);
    line-height:30px;
    padding-top: 54px;
  }
  .addAndEditMain{
    padding-top: 48px;
    padding-left: 160px;
    text-align: left;
  }
  .addAndEditDiv{
    margin-top: 19px;
  }
  .addAndEditSpan{
    display: inline-block;
    text-align: right;
    width:73px;
    font-size:18px;
    font-family:PingFangSC-Regular;
    color:rgba(51,51,51,1);
    line-height:25px;
    margin-right: 27px;
  }
  .addAndEditInput{
    width:327px;
    height:48px;
    border-radius:4px;
    border:1px solid rgba(236,236,248,1);
    padding-left: 20px;
  }
  .addAndEditBtn{
    margin-top: 35px;
  }
  .addAndEditBtn>button{
    width:98px;
    height:46px;
    background:rgba(199,199,199,1);
    border-radius:4px;
    border:0;
    color:#fff;
  }
  .addAndEditBtn>button:nth-child(2){
    background:rgba(0,119,255,1);
    margin-left: 30px;
  }
  .deleteContacts{
    width:668px;
    height:351px;
    background:rgba(255,255,255,1);
    border-radius:8px;
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    margin: auto;
  }
  .deleteTitle{
    padding-top: 57px;
    font-size:22px;
    font-family:PingFangSC-Medium;
    font-weight:500;
    color:rgba(51,51,51,1);
    line-height:30px;
  }
  .deleteText{
    padding-top: 71px;
    font-size:18px;
    font-family:PingFangSC-Regular;
    font-weight:400;
    color:rgba(51,51,51,1);
    line-height:25px;
  }
  .deleteUsername{
    color:#0A5CFF;
  }
  .deleteBtnDiv{
    padding-top: 62px;
  }
  .deleteBtnDiv>button{
    width:98px;
    height:46px;
    background:rgba(199,199,199,1);
    border-radius:4px;
    border:0;
    color:#fff;
  }
  .deleteBtnDiv>button:nth-child(1){
    margin-right: 30px;
  }
  .deleteBtnDiv>button:nth-child(2){
    background:rgba(0,119,255,1);
    border-radius:4px;
  }

  .inputImport{
    height: 32px;
    width: 44px;
    overflow: hidden;
    position: absolute;
    left: 64px;
    top: 57px;
    border-radius:4px;
    box-sizing: border-box;
    opacity: 0;
  }
  </style>
  