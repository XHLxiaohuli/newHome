<template>
        <div class="soundList">
          <div class="soundListTop">
            <div>
              <!-- 搜索组件 -->
              <searchModule
                
                :searchId="'soundListSearchId'"
                :searchVal="soundList_searchVal"
                @searchFun="soundListSearchFun"
              />
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
                <div class="clickPic" slot="operation">
                    <img class="playIcon"  src="../../assets/img/bf.png" alt=""/>
                    <img  src="../../assets/img/xz.png" alt=""/>
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
          
          <div class="playerContainer" style="display: none">
            <div class="players"  >
              <!--音频控件start-->
              <audio id="player" class="audio_" controls="controls" hidden>
                <source data-callid="123" id="sourcePlayer" src="https://record-1254335672.cos.ap-shanghai.myqcloud.com/recordserver/65665/20180817/18081717110511-02061090371-18022875621.wav"/>
              </audio>
              <!--音频控件end-->
              <!--关闭标签start-->
              <div class="closePlayer" @click="closePlayer"></div>
              <!--关闭标签end-->
              <!--可视音频控件stat-->
              <h1 class="visualPlayerTitle">咨询师：麦克</h1>
              <div class="visualPlayerPic"></div>
              <div class="visualPlayerSpeedBody">
                <div class="visualPlayerAllSpeed" @click="obtainDistance">
                  <div class="speedCircular" style="left: -8px;">
                    <div class="speedCircularWhite"></div>
                  </div>
                  <span class="startTime visualPlayerTime">00:00:00</span>
                  <span class="endTime visualPlayerTime">-00:00:00</span>
                </div>
                <!--控件按钮start-->
                <div class="theLastSong" @click="theLastSongFun(-1)"></div>
                <div class="theNext" @click="theLastSongFun(1)"></div>
                <div class="playAndPauseButtom" @click="playerOrSuspend">
                  <img class="playAndPauseButtomPic" src="" alt="">
                </div>
                <!--控件按钮end-->
              </div>
              
              <!--可视音频控件end-->
            </div>
          </div>
          
          

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
            indexs:"",
            speedTiming:"",
            readTime:0,
            allLengthOfTime:0,
            consultationStartTime:"",
            consultationEndTime:"",
            playerShow:false,
            soundDataId:"",
            callerID:"",
            callerPhone:"",
            listData:"",//列表数据
            // 搜索组件数据
            soundList_searchVal:{

                title:'录音管理',                           //搜索title
                search:true,                        //搜索按钮（true为使用，false为不使用）
                reset:true,                         //重置按钮（true为使用，false为不使用）
                timeChoose:{                        //日期区间筛选
                    bool:true,                        //开关
                    id:'date1'                        //组件id
                },
                fill:[                              //搜索框内容
                    {
                    type:'input',                   //输入框type（类型：input）
                    s_name:'咨询客户',               //标签s_name（）
                    prompt:'请输入要咨询的客户'                //提示
                    },
                    {
                    type:'input',              //日期区间筛选（类型：timeChoose）
                    s_name:'咨询师',
                    prompt:'请输入要咨询的咨询师'                //提示

                    // value:[                         //下拉框选项数组
                    //     { 
                    //     prompt:'请选择咨询师',       //提示
                    //     val:''                      //下拉框数据
                    //     },
                    //     { 
                    //     prompt:'请刷新',           //提示
                    //     val:'1'                     //下拉框数据
                    //     }
                    // ]               //标签s_name（）
                    },
                    {
                    type:'timeChoose',                  //输入框type（类型：select）
                    s_name:'咨询时间',                 //标签s_name（）
                    }
                ]

            },
            // 导出的数据
            //soundListDataVal:'1,2,3,4\n5,6,7,8\n',
            // 列表数据
            soundListFormVal:{},
            // 微信号条件
            customer:'',
            // 分组条件
            consultant:'',
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
            speedTimingOne:"",
      
          }
        },
        watch:{
            soundListFormVal(newVal,oldVal){
                this.soundListFormVal=newVal;

                this.sound()

            }
        },
        components: { searchModule,exportData,formModule,pagingModule,popOperation,chatRecord  },
        created(){
            //获取用户信息
            var this_=this;
            indexedDBopt.getData('userData','userVal',function(data){
            this_.callerID=data.val.id;
            this_.callerPhone=data.val.account.phone;
            //console.log(this_.callerID)
            //console.log(this_.callerPhone)
            });
        },

        mounted() {
          
          // 初始获取下拉选项类型
          //this.getdropValFun();
          // 初始获取列表数据
          this.conditionRequest();
        },
        methods:{
          obtainDistance(e){
  
            var player = $("#player")[0]; /*jquery对象转换成js对象*/
            // console.log(player.ended)
            var isEnded=player.ended
            player.currentTime =(e.offsetX/574)*(parseInt(this.allLengthOfTime));
            this.readTime=(e.offsetX/574)*(parseInt(this.allLengthOfTime))
            if(isEnded){
              player.play(); /*播放*/
              this.startTimeTimer()
              $('.playAndPauseButtomPic').attr('src',require('../../assets/img/暂停.png'));
            }
          },
          //控制音频播放还是暂停
          playerOrSuspend(){
            var player = $("#player")[0]; /*jquery对象转换成js对象*/
            if(($('.playAndPauseButtomPic').attr('src'))==require('../../assets/img/暂停.png')){
              $('.playAndPauseButtomPic').attr('src',require('../../assets/img/开始.png'));
              player.pause();/*暂停*/
              clearInterval(this.speedTiming);
            }else{
              if(player.ended){
                this.readTime=0
              }
                player.play(); /*播放*/
                this.startTimeTimer()
              
              $('.playAndPauseButtomPic').attr('src',require('../../assets/img/暂停.png'));
            }
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
              //console.log("-"+hour+":"+minute+":"+second);
            return hour+":"+minute+":"+second
          },
          //开始时间定时器
          startTimeTimer(){
            //console.log($('.speedCircular')[0].style.left)
            var this_=this
            var player = $("#player")[0]; /*jquery对象转换成js对象*/
            //console.log(this_.allLengthOfTime)
            this_.speedTimingOne=setInterval(()=>{
              console.log(this_.allLengthOfTime)
              if(this_.allLengthOfTime!=0){

                clearInterval(this_.speedTimingOne);
                this_.speedTiming=setInterval(()=>{
                              // console.log($('.visualPlayerAllSpeed').offset().left)
                              // console.log($('.speedCircular').offset().left)
                              this_.readTime+=0.01
                              $('.startTime').html(this_.secondTurnTime(this_.readTime)   )
                              $('.speedCircular')[0].style.left=(((this_.readTime)/(this_.allLengthOfTime))*100)+"%"
                              //console.log(this_.readTime)
                              if(player.ended){
                                //console.log(player.ended)
                                clearInterval(this_.speedTiming);
                                $('.speedCircular')[0].style.left="100%"
                                $('.playAndPauseButtomPic').attr('src',require('../../assets/img/开始.png'));
                              }
                            },10)

              }
            },10)
            
          },
          //录音点击
          sound(){
            var this_=this
            var player = $("#player")[0]; /*jquery对象转换成js对象*/
            // $('.playAndPauseButtomPic').attr('src','../../assets/img/暂停.png');
            setTimeout(function(){
                    $('.clickPic').each(function(){
                        $(this).children('img').bind('click',function(){
                            var id = $(this).closest('.jieshouZY').attr('data-id');
                            //console.log(id)
                            this.soundDataId=id
                            $('#player').children()[0].dataset.callid=id
                            //console.log(this.soundDataId)
                        });
                    })
                    $('.jieshouZY .clickPic img').bind('click',function(){
                            var ind = $('.jieshouZY .clickPic img').index(this);//获取当前点击的img下标
                            this_.startTimeTimer()
                            $('.playAndPauseButtomPic').attr('src',require('../../assets/img/暂停.png'));

                            
                            if(ind%2==0){
                      
                              for(var i=0;i<5;i++){
                                if(this_.listData[i].callId==this.soundDataId){
                                  if('../../assets/img/bf2.png' == $(this).attr('src')){
                                    $(this).attr('src',require('../../assets/img/bf.png'));
                                    //$('.playerContainer').css({'display':'none'})
                                    break;
                                  }else {
                                   // console.log(i)
                                    $(this).attr('src',require('../../assets/img/bf2.png'));
                                    $('.playerContainer').css({'display':'block'})
                                    $('.visualPlayerTitle').html('咨询师：'+this_.listData[i].calledName)
                                    //console.log(this_.listData[i].recordUrl)
                                    if(this_.listData[i].recordUrl!=undefined){
                                       $('#player').children()[0].src=this_.listData[i].recordUrl
                                      //console.log($('#player').children()[0].src)
                                      player.load()
                                      player.play(); /*播放*/
                                    }
                                   
                                    
                                    player.oncanplay = function () {
                                        $('.endTime').html('-'+this_.secondTurnTime(player.duration)   )
                                        this_.allLengthOfTime=player.duration

                                    }
                                  break;
                                  }
                                }
                              }
                             
                            }else if(ind%2!=0){
                              if('../../assets/img/xz 2 .png' == $(this).attr('src')){
                                $(this).attr('src',require('../../assets/img/xz.png'));
                              }else{
                                for(var i=0;i<5;i++){
                                  if(this_.listData[i].callId==this.soundDataId){
                                    window.location.href=this_.listData[i].recordUrl
                                    $(this).attr('src',require('../../assets/img/xz 2 .png'));
                                    break;
                                  }
                                }
                              }
                            }
                            //console.log(ind)//弹出第几个


                          $('.jieshouZY .clickPic img').not(this).each(function(){
                              if($(this).attr('src')=='../../assets/img/bf2.png'){
                                $(this).attr('src','../../assets/img/bf.png');
                              };
                              if($(this).attr('src')=='../../assets/img/xz 2 .png'){
                                $(this).attr('src','../assets/img/xz.png');
                              };
                              
                            });


                    })

              });
          },
          //关闭
          closePlayer(){
            this.readTime=0
            this.allLengthOfTime=0
            $('.startTime').html('00:00:00')
            $('.endTime').html('00:00:00')
             $('.speedCircular')[0].style.left=0+"%"
            clearInterval(this.speedTimingOne);
            clearInterval(this.speedTiming);
            this.readTime=0;
            //console.log($('.startTime').html());
            $('.playIcon').attr('src',require('../../assets/img/bf.png'));
            $('.playerContainer').css({'display':'none'})
            player.pause();/*暂停*/
          },
          // 搜索组件回调函数
          soundListSearchFun:function(data){
            //console.log(data.timeChoose)
            this.customer=data.咨询客户;
            this.consultant=data.咨询师;
            this.consultationStartTime=data.timeChoose.startDate;
            this.consultationEndTime=data.timeChoose.endDate;
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
          conditionRequest:function(){
            var _this=this
            //if((this.callerID!==""&&(this.callerPhone!==""))){
                this.soundRecordingList({
                    pageNum:_this.currentNum,
                    pageSize:_this.showValNum,
                    callerName:_this.customer,
                    calledName:_this.consultant,
                    startTime:_this.consultationStartTime,
                    endTime:_this.consultationEndTime,

                    callerId:"",
                    caller:"",
                     //callerId:this.callerID,
                    //caller:this.callerPhone,
                });
            
          },
      
        //录音列表初始数据
        soundRecordingList(obj={pageNum:'',pageSize:'',callerName:'',calledName:'',startTime:'',endTime:'',callerId:'',caller:'',}){
            var this_ = this;
            getIticket(function(ticket){
              console.log(ticket)
                this_.$axios.get(
                    "http://"+api+"/api/1.0/call/page/ticket"+'?pageNum='+obj.pageNum+'&pageSize='+obj.pageSize+'&callerName='+obj.callerName+'&calledName='+obj.calledName+'&startTime='+obj.startTime+'&endTime='+obj.endTime+'&callerId='+obj.callerId+'&caller='+obj.caller,
                    {headers:{
                    'content-type': 'application/x-www-form-urlencoded',
                    'ticket':ticket
                    }}
                )
                .then((response)=>{
                    //console.log(response.data.result)
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
            console.log(this.listData)
            var title=[
                    {"name":"咨询师","tag":"zxs","type":"string","width":"20"},
                    {"name":"咨询客户","tag":"zxkh","type":"string","width":"20"},
                    {"name":"客户电话","tag":"khdh","type":"string","width":"20"},
                    {"name":"通话时长","tag":"thsc","type":"string","width":"20"},
                    {"name":"客户评分","tag":"khpf","type":"string","width":"20"},
                    {"name":"咨询日期","tag":"zxrq","type":"string","width":"20"},
                    {"name":"操作","tag":"cz","type":"operation","width":"20"},
                ],value_=[]; 
            // 便利数据
            var khpfs
            for(var i=0;i<data.length;i++){
               if(data[i].dtmfCode==1){
                khpfs="非常满意"
               }else if(data[i].dtmfCode==2){
                khpfs="满意"
               }else if(data[i].dtmfCode==3){
                khpfs="一般"
               }else if(data[i].dtmfCode==4){
                khpfs="不满意"
               }else if(data[i].dtmfCode==5){
                khpfs="非常不满意"
               }
               value_.push({
                id:data[i].callId,
                zxs:data[i].calledName,
                zxkh:data[i].callerName,
                khdh:data[i].caller,
                thsc:this.timeSection(data[i].startTime,data[i].endTime),//data[i].wxno,
                khpf:khpfs!=undefined?khpfs:"无",//data[i].dtmfCode,
                zxrq:this.timestampToTime(data[i].startTime),
                bf:'播放',
                xz:"下载",
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
          //上一个或下一个录音事件
          theLastSongFun(direction){
            this.readTime=0
            this.allLengthOfTime=0
            $('.startTime').html('00:00:00')
            $('.endTime').html('00:00:00')
             $('.speedCircular')[0].style.left=0+"%"
            clearInterval(this.speedTimingOne);
            var this_=this
            this.readTime=0
            //var current=$('#player').children()[0].src
            $('.playAndPauseButtomPic').attr('src',require('../../assets/img/暂停.png'));
            var playerss=$('#player')[0]
            var current=$('#player').children()[0].dataset.callid;
            for(var i=0;i<5;i++){

              if(this.listData[i].callId==current){
                this_.indexs=i;
                break;
              }
            }
            console.log(this_.indexs)
            if(direction==-1){
              if(this_.indexs<=0){
                alert("已经是第一个了哦")
              }else{
                this_.indexs-=1
              }
            }else if(direction==1){
              if(this_.indexs>=4){
                alert("已经是本页最后一个了哦")
              }else{
                this_.indexs+=1
              }
            }
            // playerss.pause();/*暂停*/
            this.upperOrLower(this_.indexs)
          },
          //上一个或者下一个录音
          upperOrLower(indexs){
            var this_=this
            var player=$('#player')[0]
            if(player.paused){
              $('.speedCircular')[0].style.left="-8px"
              this_.startTimeTimer()
            }
            $('#player').children()[0].dataset.callid=this_.listData[this_.indexs].callId
            $('#player').children()[0].src=this_.listData[this_.indexs].recordUrl
            $('.visualPlayerTitle').html('咨询师：'+this_.listData[this_.indexs].calledName)
            player.load()
            player.play(); /*播放*/
            player.oncanplay = function () {
            $('.endTime').html('-'+this_.secondTurnTime(player.duration)   )
              this_.allLengthOfTime=player.duration
            }
            
            
            
          },
        
          // 点击表信息触发
          formClickFun:function(data){
            if(data.type=='bz'){
              // 打开备注弹窗
              //this.popOperaShowFun(2);
            }else if(data.type=='cz'){
              // 打开操作弹窗
              //this.popOperaShowFun(3);
            };
          },
      
        }
      }
      </script>
      
      <style lang='less'>
      @import '../../assets/less/common.less';
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
      .clickPic{
          width: 100%;
      }
      .clickPic>img{
          width: 20px;
          height: 20px;
          border-radius: 50%;
          overflow: hidden;
          z-index: 3000;
      }
      .clickPic>img:nth-child(2){
          position: relative;
          right: -20px;
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
      .audio_ {
        width: 500px;
      }
      .playerContainer{
        position: fixed;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        margin: auto;
        background:rgba(0,0,0,0.2);
        /* opacity:0.2; */
      }
      .visualPlayerTitle{
        /* width:144px; */
        height:33px;
        font-size:24px;
        font-family:PingFangSC-Medium;
        color:rgba(51,51,51,1);
        line-height:33px;
        text-align: center;
        padding-top: 44px;
      }
      .visualPlayerPic{
        width:191px;
        height:77px;
        margin: auto;
        margin-top: 46px;
        background: url('../../assets/img/音波.gif') no-repeat;
        background-size: 100% 100%;
      }
      .visualPlayerSpeedBody{
        width:574px;
        margin: auto;
        padding-top: 59px;
      }
      .visualPlayerAllSpeed{
        width:574px;
        height:2px;
        background: rgba(204,204,204,1);
        border:1px solid rgba(204,204,204,1);
        position: relative;
        cursor:pointer;
      }
      .speedCircular{
        width:16px;
        height:16px;
        border-radius: 50%;
        background:rgba(0,119,255,1);
        position: absolute;
        top: 0;
        bottom: 0;
        margin: auto;
        overflow: hidden;
        cursor:pointer;
      }
      .speedCircularWhite{
        width:4px;
        height:4px;
        background:rgba(255,255,255,1);
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        margin: auto;
        border-radius: 50%;
        overflow: hidden;
      }
      .startTime{
        float: left;
      }
      .endTime{
        float: right;
      }
      .visualPlayerTime{
        font-size:12px;
        font-family:PingFangSC-Regular;
        color:rgba(51,51,51,1);
        line-height:17px;
        margin-top: 10px;
      }
      .theLastSong{
        width:14px;
        height:14px;
        /**background:rgba(0,119,255,1);**/
        background: url('../../assets/img/上一个.png') no-repeat;
        background-size: 100% 100%;
        position: absolute;
        top: 343px;
        left: 292px;
        cursor:pointer;
      }
      .theNext{
        width:14px;
        height:14px;
        /**background:rgba(0,119,255,1);**/
        background: url('../../assets/img/下一个.png') no-repeat;
        background-size: 100% 100%;
        position: absolute;
        top: 343px;
        right: 287px;
        cursor:pointer;
      }
      .playAndPauseButtom{
        width:41px;
        height:41px;
        position: absolute;
        top: 328px;
        right: 351px;
        border-radius: 50%;
        overflow: hidden;
        cursor:pointer;
      }
      .playAndPause{
        width: 100%;
        height: 100%;
      }
      </style>
      