<template>
  <div class="homePage_">

    <div class="homePage_top">
      <span>{{name}}</span>
      <div>
        <!-- 总数据日期筛选 -->
        <searchModule
          :searchId="'homePage_searchVal'"
          :searchVal="timeChoose_0"
          @timeChooseFun="timeChooseFun_0"
        />
      </div>
    </div>

    <!-- 显示卡片数据 -->
    <div class="cardArrcontainer">
      <div class="minCard">
        <card
          :cardVal="overviewVal"
        />
      </div>
      <div class="maxCard">
        <card
          :cardVal="envelopeVal"
        />
      </div>
      <div class="maxCard">
        <card
          :cardVal="transferVal"
        />
      </div>
      <div class="minCard">
        <card
          :cardVal="friendsVal"
        />
      </div>
    </div>

    <!-- 数据统计图表 -->
    <div class="statisticsContainer">
      <!-- 面包屑组件 -->
      <crumbsModule
        :crumbsCorres="routerId"
        :crumbsVal="statistSwitch"
        :crumbsType="'btnswitch'"
        @crumbsFun="statistSwitchFun"
      />
      <!-- 统计表显示区域 -->
      <div class="statistics_" align="center">
        <router-view></router-view>
      </div>
    </div>

  </div>
</template>

<script>
// 搜索组件
import searchModule from '@/components/searchModule'
// 面包屑组件
import crumbsModule from '@/components/crumbsModule'
// 卡片组件组件
import card from '@/components/card'

export default {
  data() {
    return {
      val:{
        title:[                               //表头
          { 
            name:'表-1',                  //表头-->列名称
            type:'string',
            tag:'zxs',                        //对应数据表示
            highlighted:['8'],                   //设置高亮名词选填可多个，数据类型（数组）
            width:30                         //占据整行宽度的百分比（数字）
          },
          { 
            name:'表-2',                  //表头-->列名称
            type:'arry',
            tag:'aaa',                        //对应数据表示
            highlighted:['b'],                   //设置高亮名词选填可多个，数据类型（数组）
            width:30                         //占据整行宽度的百分比（数字）
          },
          { 
            name:'操作',                  //表头-->列名称
            type:'operation',                        //对应数据表示
            width:30                         //占据整行宽度的百分比（数字）
          }
        ],
        value:[                                //需要显示的数据
          {   
            zxs:'8',                            //数据显示（对应表头的tag）
            aaa:[
              {
                belongs:'image',
                url:'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1532667996473&di=1283367a35382739009a0c5fdcdf7147&imgtype=0&src=http%3A%2F%2Fs10.sinaimg.cn%2Fmw690%2F005SZPVjzy76vBoMGyB29%26690'
              },{
                belongs:'数据1',
                val:[
                  {
                    title:'出',
                    val:123
                  },
                  {
                    title:'入',
                    val:456
                  }
                ]
              },{
                belongs:'数据2',
                val:'12'
              },{
                belongs:'数据3',
                val:'123'
              },{
                belongs:'数据4',
                val:'123456'
              }
            ]
          }
        ]
      },
      s_val:{
        title:'',                           //搜索title
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
            prompt:'咨询客户'                //提示
          },
          {
            type:'timeChoose',              //日期区间筛选（类型：timeChoose）
            s_name:'日期筛选',               //标签s_name（）
          },
          {
            type:'select',                  //输入框type（类型：select）
            s_name:'咨询师',                 //标签s_name（）
            value:[                         //下拉框选项数组
              { 
                prompt:'请选择咨询师',       //提示
                val:''                      //下拉框数据
              },
              { 
                prompt:'选你老母',           //提示
                val:'1'                     //下拉框数据
              }
            ]
          }
        ]
      },
      // 公司名字
      name:'',
      // 总数据日期区间筛选
      timeChoose_0:{
        title:'',                           //搜索title
        search:false,                        //搜索按钮（true为使用，false为不使用）
        reset:false,                         //重置按钮（true为使用，false为不使用）
        timeChoose:{                        //日期区间筛选
          bool:true,                        //开关
          id:'date1'                        //组件id
        },
        fill:[                              //搜索框内容
          {
            type:'timeChoose',              //日期区间筛选（类型：timeChoose）
            s_name:'',               //标签s_name（）
          }
        ]
      },
      // 总览卡片数据
      overviewVal:{
        title:'总览',
        imgUrl:require('../../assets/img/home_icon1.png'),
        showVal:[
          // {  title:'微信个数',  val:''  },
          {  title:'可控客服个数',  val:''  },
          // {  title:'通话时长',  val:''  },
          {  title:'可用在线微信个数',  val:''  },
        ]
      },
      // 红包卡片数据
      envelopeVal:{
        title:'红包',
        imgUrl:require('../../assets/img/home_icon2.png'),
        showVal:[
          {  title:'收红包总次数',  val:'' },
          {  title:'确认红包总次数',  val:'' },
          {  title:'',  val:''  },
          {  title:'',  val:''  },
          {  title:'确认红包总金额',  val:'' },
          {  title:'',  val:''  },
        ]
      },
      // 转账卡片数据
      transferVal:{
        title:'转账',
        imgUrl:require('../../assets/img/home_icon3.png'),
        showVal:[
          {  title:'收转账总次数',  val:'' },
          {  title:'确认转账总次数',  val:''  },
          {  title:'',  val:''  },
          {  title:'收转账总金额',  val:''  },
          {  title:'确认转账总金额',  val:''  },
          {  title:'',  val:''  },
        ]
      },
      // 好友卡片数据
      friendsVal:{
        title:'好友',
        imgUrl:require('../../assets/img/home_icon4.png'),
        showVal:[
          {  title:'新增好友',  val:''  },
          {  title:'好友申请',  val:'' },
        ]
      },
      // 面包屑切换模块
      statistSwitch:[
        // {
        //   title:'好友统计',
        //   parameter:'0'
        // },
        // {
        //   title:'敏感操作统计',
        //   parameter:'1'
        // },
        {
          title:'好友增长统计',
          parameter:'2'
        },
        {
          title:'好友增长排行',
          parameter:'3'
        },
        {
          title:'好友分配统计',
          parameter:'4'
        },
        // {
        //   title:'接待人数统计',
        //   parameter:'5'
        // },
        {
          title:'客服对话统计',
          parameter:'6'
        },
        // {
        //   title:'好友未通过统计',
        //   parameter:'7'
        // },
      ],
      // 默认打开子路由下标参数
      routerId:2,
      // 
      最小天数_0:this.formatDate(),
      // 
      最大天数_0:this.formatDate(),
    }
  },
  components: {
    searchModule,
    crumbsModule,
    card,
  },
  mounted() {
    this.switchRouterFun(this.routerId);
    // 数据请求
    this.bianliangdataQueryFun();
  },
  methods:{
    // 总数据日期筛选回调函数
    timeChooseFun_0:function(data){
      this.最小天数_0 = data.startDate;
      this.最大天数_0 = data.endDate;
      // 数据请求
      this.bianliangdataQueryFun();
    },
    // 面包屑导航切换模块回调
    statistSwitchFun:function(data){
      this.switchRouterFun(data);
    },
    // 切换子路由函数
    switchRouterFun:function(index){
      var routerArr = ['friendsStatistical','sensitiveStatistical','growthStatistical','growthRanking','distributionStatistical','receptionStatistical','dialogueStatistical','throughStatistical'];
      this.$router.push({
        path:'/main/homePage/'+routerArr[parseInt(index)],
        query:{  }
      });
    },
    // 数据请求变量函数
    bianliangdataQueryFun:function(){
      console.log(this.formatDate());
      console.log(this.最小天数_0,);
      this.dataQueryFun({
        minConversationTime:this.最小天数_0,
        maxConversationTime:this.最大天数_0,
      });
    },
    //数据请求
    dataQueryFun:function(obj={
      minConversationTime:'',
      maxConversationTime:'',
    }){
      var this_ = this;
      getIticket(function(ticket){
        this_.$axios({
          method: 'get',
          url: "http://"+api+"/api/1.0/statistic/index/ticket",
          headers:{
            'content-type': 'application/json',
            // 'content-type': 'application/x-www-form-urlencoded',
            'ticket':ticket
          },
          params:{
            minConversationTime:obj.minConversationTime,
            maxConversationTime:obj.maxConversationTime,
          }
        }).then((response)=>{
          if(response.data.success){
            
            console.log(response.data.result);

            this_.dataFormatConversion(response.data.result);
          }else{
            alert(response.data.msg);
          }
        }).catch((error)=>{
          console.log(error);
        });
      });
    },
    // 数据格式转换
    dataFormatConversion:function(data){
      // 公司名字
      this.name = data.company.name;
      // 总览数据
      this.overviewVal={
        title:'总览',
        imgUrl:require('../../assets/img/home_icon1.png'),
        showVal:[
          // {  title:'微信个数',  val:data.company.wechatTotal+'个'  },
          {  title:'可控客服个数',  val:' '+data.company.sellerTotal+'个'  },
          // {  title:'通话时长',  val:data.company.limitMins+'分钟'  },
          {  title:'可用在线微信个数',  val:' '+data.company.wechatTotal+'个'  },
        ]
      };
      // 红包数据
      this.envelopeVal={
        title:'红包',
        imgUrl:require('../../assets/img/home_icon2.png'),
        showVal:[
          {  title:'收红包总次数',  val:' '+(data['436207665'].total)+'次' },
          {  title:'确认红包总次数',  val:' '+(data['55535'].total)+'次' },
          {  title:'',  val:''  },
          {  title:'',  val:''  },
          {  title:'确认红包总金额',  val:' '+(data['55535'].amount)+'元' },
          {  title:'',  val:''  },
        ]
      };
      // 转账卡片数据
      this.transferVal={
        title:'转账',
        imgUrl:require('../../assets/img/home_icon3.png'),
        showVal:[
          {  title:'收转账总次数',  val:' '+(data['419430449'].total)+'次' },
          {  title:'确认转账总次数',  val:' '+(data['2000'].total)+'次'  },
          {  title:'',  val:''  },
          {  title:'收转账总金额',  val:' '+(data['419430449'].amount)+'元'  },
          {  title:'确认转账总金额',  val:' '+(data['2000'].amount)+'元'  },
          {  title:'',  val:''  },
        ]
      };
      // 好友卡片数据
      this.friendsVal={
        title:'好友',
        imgUrl:require('../../assets/img/home_icon4.png'),
        showVal:[
          {  title:'新增好友',  val:' '+(data['100'].total)+'位'  },
          {  title:'好友申请',  val:' '+(data['103'].total) +'位' },
        ]
      };


    },
    // 获取当前年月日
    formatDate:function() {
      var d = new Date(),
      month = '' + (d.getMonth() + 1),
      day = '' + d.getDate(),
      year = d.getFullYear();
      if (month.length < 2) month = '0' + month;
      if (day.length < 2) day = '0' + day;
      return [year, month, day].join('-');
    },



  }
}
</script>

<style lang='less'>
@import '../../assets/less/common.less';
.homePage_{
  width: 95%;
  height: auto;
}
.homePage_top{
  width: 100%;
  height: 35px;
  margin-bottom: 15px;
}
.homePage_top>span{
  float: left;
  font-size:20px;
  font-family:PingFangSC-Regular;
  color:rgba(51,51,51,1);
  line-height:35px;
}
.homePage_top>div{
  float: right;
  margin-right: -20px;
}
.cardArrcontainer{
  width:100%;
  height:auto;
  display: flex;
  flex-direction:row;
  justify-content:space-between;
  margin-bottom:15px;
}
@media screen and (max-width: 1500px) {
  .cardArrcontainer{
    flex-wrap:wrap;
  }
}
.statisticsContainer{
  width:100%;
  height:570px;
  background:#fff;
  border-radius:10px;
  box-shadow: 0px 2px 5px #ccc;
  box-sizing: border-box;
  padding: 20px;
}
.statistics_{
  width: 100%;
  height: 488px;
}
.maxCard{
  width:60%;
  height:210px;
  box-sizing: 
  border-box;padding:10px;
}
.minCard{
  width:40%;
  height:210px;
  box-sizing: 
  border-box;padding:10px;
}
</style>
