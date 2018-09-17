<template>
  <div class="growthStatistical">
    <div class="growthTop">
      <div>
        <!-- 搜索组件 -->
        <searchModule
          :searchId="'growthStatistical_searchVal'"
          :searchVal="growthStatistical_searchVal"
          @searchFun="wechatListSearchFun"
        />
        <!-- 数据导出组件 -->
        <!-- <div style="margin-top:1.5px;">
          <exportData
            :iframeData="growthDataVal"
          />
        </div> -->
      </div>
      <div class="growthCrumbs_f">
        <p>好友增长趋势</p>
        <div>
          <!-- 面包屑切换组件 -->
          <crumbsModule
            :crumbsCorres='0'  
            :crumbsVal='growthCrumbs' 
            :crumbsType="'imgswitch'"
            @crumbsFun='growthCrumbsFun'
          />
        </div>
      </div>
    </div>

    <div class="growthContainer" v-if="growthCrumbsId==0">
      <!-- 条形图组件 -->
      <cylindrical
        :cylindricalId="'cylindricalId_0'"
        :cylindricalVal="growthCylindricalVal"
      />
    </div>

    <div class="growthContainer" v-if="growthCrumbsId==1">
      <!-- 曲线图组件 -->
      <curve
        :curveId="'curveId_0'"
        :curveVal="growthCurveVal"
      />
    </div>

    <div class="growthContainer" v-if="growthCrumbsId==2">
      <!-- 列表组件 -->
      <formModule
        :checkboxGroup=false
        :bottomLine=true
        :showHeight=350
        :formVal="growthFormVal"
      />
      <div style="width:100%;height:15px;"></div>
    </div>
    
  </div>
</template>

<script>
// 搜索组件
import searchModule from '@/components/searchModule'
// 数据导出表格组件
import exportData from '@/components/exportData'
// 面包屑组件
import crumbsModule from '@/components/crumbsModule'
// 曲线图组件
import curve from '@/components/curve'
// 条形图组件
import cylindrical from '@/components/cylindrical'
// 列表组件
import formModule from '@/components/formModule'
// 分页组件
import pagingModule from '@/components/pagingModule'
export default {
  data() {
    return {
      // 搜索组件数据
      growthStatistical_searchVal:{
        title:'',                           //搜索title
        s_nameShow:false,                   //子标题显示
        search:true,                        //搜索按钮（true为使用，false为不使用）
        reset:false,                         //重置按钮（true为使用，false为不使用）
        timeChoose:{                        //日期区间筛选
          bool:true,                        //开关
          id:'date2'                        //组件id
        },
        fill:[                              //搜索框内容
          // {
          //   type:'select',
          //   s_name:'查找类型',
          //   value:[
          //     {prompt:'请选择咨询师',val:''},
          //     {prompt:'新增好友',val:'100'},
          //     {prompt:'好友申请',val:'103'}
          //   ]
          // },
          {
            type:'select',
            s_name:'时间段',
            value:[
              {prompt:'请选择时间类型',val:''},
              {prompt:'按天',val:'0'},
              {prompt:'按月',val:'1'},
              {prompt:'按年',val:'2'}
            ]
          },
          {type:'timeChoose',s_name:'时间区间',},
        ]
      },
      // 面包屑切换组件
      growthCrumbs:[
        {
          selected:require('../../../assets/img/柱状图 2.png'),
          shdown:require('../../../assets/img/柱状图 .png'),
          parameter:'0'
        },
        {
          selected:require('../../../assets/img/折线图.png'),
          shdown:require('../../../assets/img/折线图2.png'),
          parameter:'1'
        },
        {
          selected:require('../../../assets/img/数据图2.png'),
          shdown:require('../../../assets/img/数据图.png'),
          parameter:'2'
        }
      ],
      // 面包屑切换id
      growthCrumbsId:0,
      // 曲线图数据
      growthCurveVal:{
        yAxis:{min: 0,max: 30,interval: 10,},
        xAxisVal:[],
        data:[{name:'好友增长',type:'line',stack: '总量',data:[]}]
      },
      // 条形图数据
      growthCylindricalVal:{
        xAxisVal:[],
        data:[
          {
            name: '好友增长',
            type: 'bar',
            barWidth:40,
            itemStyle:{normal:{color:'#01949B'},},
            markPoint : {
              data : [
                {type : 'max', name : '最大值'},
                {type : 'min', name : '最小值'}
              ]
            },
            markLine : {data : [{type : 'average', name : '平均值'}]},
            data:[]
          }]
      },
      // 列表数据
      growthFormVal:{
        title:[
          { name:'类型',  type:'string',    tag:'wxh',    width:30  },
          { name:'总数',type:'string',    tag:'szfz',    width:30  },
          { name:'时间',    type:'string',    tag:'sfrz',     width:30  },
        ],value_:[]
      },
      查找类型:'',
      时间段:'',
      最大时间:'',
      最小时间:''
    }
  },
  components: { cylindrical,curve,formModule,searchModule,pagingModule,crumbsModule,exportData  },
  mounted() {
    this.conditionRequest();
  },
  methods:{
     // 搜索组件回调函数
    wechatListSearchFun:function(data){
      // this.查找类型 = data.查找类型;
      this.时间段 = data.时间段;
      this.最小时间 = data.timeChoose.startDate;
      this.最大时间 = data.timeChoose.endDate;
      this.currentNum=1;
      this.conditionRequest();
    },
    // 分页回调函数
    // wechatListPagingFun:function(data){
    //   // 判断是否搜索触发
    //   if(data.conversion){  this.currentNum=data.conversion  }else{this.currentNum=1;}
    //   if(data.valShowNum){  this.showValNum=data.valShowNum  };
    //   this.conditionRequest();
    // },
    // 条件请求数据
    conditionRequest:function(){
      this.wechatListValFun({
        statisticType:this.时间段,
        // type:this.查找类型,
        type:'100',
        groupByWechatId:false,
        minConversationTime:this.最小时间,
        maxConversationTime:this.最大时间,
      });
    },
    // 获取微信数据数据
    wechatListValFun:function(obj={
      statisticType:'',
      type:'',
      groupByWechatId:'',
      minConversationTime:'',
      maxConversationTime:'',
    }){
      var this_ = this;
      getIticket(function(ticket){
        this_.$axios.get(
          "http://"+api+"/api/1.0/statistic/find/friend"+'?statisticType='+obj.statisticType+'&type='+obj.type+'&groupByWechatId='+obj.groupByWechatId +'&maxConversationTime='+obj.maxConversationTime+'&minConversationTime='+obj.minConversationTime,
          {headers:{
            'content-type': 'application/x-www-form-urlencoded',
            'ticket':ticket
          }}
        )
        .then((response)=>{
          if(response.data.success){
            this_.dataConversionFun(response.data.result);
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

      // 曲线图
      var quxiantu = this.growthCurveVal;
      // 条形图
      var tiaoxing = this.growthCylindricalVal;
      // 表数据
      var liebiao = this.growthFormVal;

      var timeArr = [];
      var totalArr = [];
      var fromArr = [];

      for(var i=0;i<data.length;i++){
        timeArr.push(data[i].date);
        totalArr.push(data[i].total);
        fromArr.push({
          wxh:'新增好友',
          szfz:data[i].total,
          sfrz:data[i].date,
        });
      };

      quxiantu.xAxisVal=timeArr;
      quxiantu.data[0].data=totalArr;
      this.growthCurveVal = quxiantu;

      tiaoxing.xAxisVal=timeArr;
      tiaoxing.data[0].data=totalArr;
      this.growthCylindricalVal = tiaoxing;

      liebiao.value = fromArr;
      this.growthFormVal = liebiao;

    },
    // 面包屑切换函数
    growthCrumbsFun:function(data){
      this.growthCrumbsId=data;
    },

  },

}
</script>

<style lang='less'>
@import '../../../assets/less/common.less';
.growthStatistical{
  width: 90%;
  height: 100%;
  float: left;
  border:1px solid #ddd;
  overflow: auto;
  box-sizing: border-box;
  padding: 20px;
}
.growthTop{
  margin-bottom: 10px;
  display: flex;
  flex-direction:row;
  justify-content:space-between;
}
.growthTop>div{
  display: flex;
  flex-direction:row;
  justify-content:space-between;
}
.growthCrumbs_f>div>div{
  padding: 0!important;
  margin-top: 6.5px;
}
.growthCrumbs_f>p{
  line-height: 35px;
  margin-right: 20px;
  font-size: 16px;
  color:#666;
}
.growthContainer{
  width: 100%;
  height: 400px;
}
</style>
