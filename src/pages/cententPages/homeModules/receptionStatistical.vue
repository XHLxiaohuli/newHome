<template>
  <div class="receptionStatistical">
    <div class="receptionTop">
      <div>
        <!-- 搜索组件 -->
        <searchModule
          :searchId="'receptionSearchId'"
          :searchVal="reception_searchVal"
          @searchFun="receptionSearchFun"
        />
        <!-- 数据导出组件 -->
        <div style="margin-top:1.5px;">
          <exportData
            :iframeData="receptionDataVal"
          />
        </div>
      </div>
    </div>

    <div class="receptionContainer">
      <!-- 列表组件 -->
      <formModule
        :checkboxGroup=false
        :bottomLine=true
        :showHeight=350
        :formVal="receptionFormVal"
      >
        <div slot="operation">
          <div class="maskPopshowcilck">
            趋势图
          </div>
        </div>
      </formModule>
      <div style="width:100%;height:15px;"></div>
      <!-- 分页组件 -->
      <pagingModule
        :totalNum=20
        :currentNum=6
        :showValNum=5
        @pagingFun="receptionPagingFun"
      />
    </div>

    <!-- 遮罩弹窗显示 -->
    <maskPopModule v-if="maskPopShow">
      <div class="maskPopDiv">
        <img class="maskPopHide" src="../../../assets/img/弹窗-关闭.png" @click="maskPopShowFun" alt="">
        <div class="maskPopDivTop">
          <span style="line-height: 40px;">张大萌</span>
          <div class="crumbsDiv">
            <!-- 面包屑切换组件 -->
            <crumbsModule
              :crumbsCorres=receptionCrumbsId
              :crumbsVal='receptionCrumbs' 
              :crumbsType="'imgswitch'"
              @crumbsFun='receptionCrumbsFun'
            />
          </div>
        </div>
        <div  class="receptionContainer_2" v-if="receptionCrumbsId==0">
          <!-- 条形图组件 -->
          <cylindrical
            :cylindricalId="'cylindricalId_1'"
            :cylindricalVal="receptionCylindricalVal"
          />
        </div>

        <div  class="receptionContainer_2" v-if="receptionCrumbsId==1">
          <!-- 曲线图组件 -->
          <curve
            :curveId="'curveId_1'"
            :curveVal="receptionCurveVal"
          />
        </div>

        <div class="receptionContainer_2" v-if="receptionCrumbsId==2">
          <!-- 列表组件 -->
          <formModule
            :checkboxGroup=false
            :bottomLine=true
            :showHeight=400
            :formVal="receptionFormVal_2"
          />
          <div style="width:100%;height:15px;"></div>
          <!-- 分页组件 -->
          <pagingModule
            :totalNum=20
            :currentNum=6
            :showValNum=5
            @pagingFun="receptionPagingFun_2"
          />
        </div>
      </div>
    </maskPopModule>

  </div>
</template>

<script>
// 搜索组件
import searchModule from '@/components/searchModule'
// 数据导出表格组件
import exportData from '@/components/exportData'
// 遮罩组件
import maskPopModule from '@/components/maskPopModule'
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
      reception_searchVal:{
        title:'',                           //搜索title
        s_nameShow:false,                   //子标题显示
        search:true,                        //搜索按钮（true为使用，false为不使用）
        reset:false,                         //重置按钮（true为使用，false为不使用）
        timeChoose:{                        //日期区间筛选
          bool:true,                        //开关
          id:'date2'                        //组件id
        },
        fill:[                              //搜索框内容
          {
            type:'timeChoose',              //日期区间筛选（类型：timeChoose）
            s_name:'',               //标签s_name（）
          },
        ]
      },
      // 导出的数据
      receptionDataVal:'1,2,3,4\n5,6,7,8\n',
      // 列表数据
      receptionFormVal:{
        title:[                               
          { 
            name:'微信信息',                   //表头-->列名称
            type:'string',                    //数据类型（string，arry，operation）
            tag:'shijian',                    //对应数据表示
            highlighted:[],                   //设置高亮名词选填可多个，数据类型（数组）
            width:30                         //占据整行宽度的百分比（数字）
          },
          { 
            name:'微信备注',
            type:'string',
            tag:'nanxing',
            highlighted:[],
            width:20
          },
          { 
            name:'新增总数',
            type:'string',
            tag:'nvxing',
            highlighted:[],
            width:10
          },
          { 
            name:'新增男性',
            type:'string',
            tag:'weizhi',
            highlighted:[],
            width:10
          },
          { 
            name:'操作',
            type:'operation',
            width:10
          }
        ],
        value:[                                   //需要显示的数据
          {   
            shijian:'123',                           //需要展示的数据（字符类型、*数组类型-->数组类型看下方详解）
            nanxing:'18293803998',
            nvxing:'3',
            weizhi:'4',
          },
          {   
            shijian:'123',                           //需要展示的数据（字符类型、*数组类型-->数组类型看下方详解）
            nanxing:'18293803998',
            nvxing:'3',
            weizhi:'4',
          },
          {   
            shijian:'123',                           //需要展示的数据（字符类型、*数组类型-->数组类型看下方详解）
            nanxing:'18293803998',
            nvxing:'3',
            weizhi:'4',
          },
          {   
            shijian:'123',                           //需要展示的数据（字符类型、*数组类型-->数组类型看下方详解）
            nanxing:'18293803998',
            nvxing:'3',
            weizhi:'4',
          },
          {   
            shijian:'1234',                           //需要展示的数据（字符类型、*数组类型-->数组类型看下方详解）
            nanxing:'18293803998',
            nvxing:'3',
            weizhi:'4',
          },
        ]
      },
      // 曲线图数据
      receptionCurveVal:{
        yAxis:{
          min: 0,
          max: 100,
          interval: 10,
        },
        xAxisVal:['2018-7-1','2018-7-2','2018-7-3','2018-7-4','2018-7-5','2018-7-6','2018-7-7',],
        data:[
          {
            name:'好友增长',
            type:'line',
            stack: '总量',
            data:[32,46,27,68,50,43,73]
          }
        ]
      },
      // 条形图数据
      receptionCylindricalVal:{
        xAxisVal:['2018-7-1','2018-7-2','2018-7-3','2018-7-4','2018-7-5','2018-7-6','2018-7-7',],
        data:[{
              name: '好友增长',
              type: 'bar',
              barWidth:40,
              itemStyle:{
                normal:{color:'#01949B'},
              },
              markPoint : {
                data : [
                  {type : 'max', name : '最大值'},
                  {type : 'min', name : '最小值'}
                ]
              },
              markLine : {
                data : [
                  {type : 'average', name : '平均值'}
                ]
              },
              data:[32,46,27,68,50,43,73]
          }]
      },
      // 列表数据
      receptionFormVal_2:{
        title:[                               
          { 
            name:'时间',                      //表头-->列名称
            type:'string',                    //数据类型（strimg，arry，operation）
            tag:'shijian',                    //对应数据表示
            highlighted:[],                   //设置高亮名词选填可多个，数据类型（数组）
            width:30                         //占据整行宽度的百分比（数字）
          },
          { 
            name:'男性',
            type:'string',
            tag:'nanxing',
            highlighted:[],
            width:15
          },
          { 
            name:'女性',
            type:'string',
            tag:'nvxing',
            highlighted:[],
            width:15
          },
          { 
            name:'未知',
            type:'string',
            tag:'weizhi',
            highlighted:[],
            width:15
          },
          { 
            name:'总数',
            type:'string',
            tag:'zongshu',
            highlighted:[],
            width:15
          }
        ],
        value:[                                   //需要显示的数据
          {   
            shijian:'1',                           //需要展示的数据（字符类型、*数组类型-->数组类型看下方详解）
            nanxing:'2',
            nvxing:'3',
            weizhi:'4',
            zongshu:'5'
          },
          {   
            shijian:'6',
            nanxing:'7',
            nvxing:'8',
            weizhi:'9',
            zongshu:'10'
          },
          {   
            shijian:'1',                           //需要展示的数据（字符类型、*数组类型-->数组类型看下方详解）
            nanxing:'2',
            nvxing:'3',
            weizhi:'4',
            zongshu:'5'
          },
          {   
            shijian:'6',
            nanxing:'7',
            nvxing:'8',
            weizhi:'9',
            zongshu:'10'
          },
          {   
            shijian:'1',                           //需要展示的数据（字符类型、*数组类型-->数组类型看下方详解）
            nanxing:'2',
            nvxing:'3',
            weizhi:'4',
            zongshu:'5'
          },
          {   
            shijian:'6',
            nanxing:'7',
            nvxing:'8',
            weizhi:'9',
            zongshu:'10'
          },
          {   
            shijian:'1',                           //需要展示的数据（字符类型、*数组类型-->数组类型看下方详解）
            nanxing:'2',
            nvxing:'3',
            weizhi:'4',
            zongshu:'5'
          },
          {   
            shijian:'6',
            nanxing:'7',
            nvxing:'8',
            weizhi:'9',
            zongshu:'10'
          },
          {   
            shijian:'1',                           //需要展示的数据（字符类型、*数组类型-->数组类型看下方详解）
            nanxing:'2',
            nvxing:'3',
            weizhi:'4',
            zongshu:'5'
          },
          {   
            shijian:'6',
            nanxing:'7',
            nvxing:'8',
            weizhi:'9',
            zongshu:'10'
          },
        ]
      },
      // 面包屑切换id
      receptionCrumbsId:0,
      // 面包屑切换组件
      receptionCrumbs:[
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
      // 弹窗开关
      maskPopShow:false
    }
  },
  components: {  searchModule,exportData,formModule,pagingModule,maskPopModule,curve,cylindrical,crumbsModule  },
  mounted() {
    this.operationFun();
  },
  methods:{
    receptionSearchFun:function(data){
      console.log(data);
    },
    receptionPagingFun:function(data){
      console.log(data);
    },
    receptionPagingFun_2:function(data){

    },
    receptionCrumbsFun:function(data){
      this.receptionCrumbsId=data;
    },
    maskPopShowFun(){
      this.maskPopShow=false;
      this.operationFun();
    },
    operationFun:function(){
      var this_ = this;
      $('.maskPopshowcilck').bind('click',function(){
        this_.maskPopShow=true;
        this_.receptionCrumbsId=0;
      });
    }

  }

}
</script>

<style lang='less'>
@import '../../../assets/less/common.less';
.receptionStatistical{
  width: 90%;
  height: 100%;
  float: left;
  overflow: auto;
  box-sizing: border-box;
}
.receptionTop{
  margin-bottom: 10px;
  display: flex;
  flex-direction:row;
  justify-content:space-between;
}
.receptionTop>div{
  display: flex;
  flex-direction:row;
  justify-content:space-between;
}
.receptionCrumbs_f>div>div{
  padding: 0!important;
  margin-top: 6.5px;
}
.receptionCrumbs_f>p{
  line-height: 35px;
  margin-right: 20px;
  font-size: 16px;
  color:#666;
}
.receptionContainer{
  width: 100%;
  height: 400px;
}
.receptionContainer_2{
  width: 100%;
  height: 500px;
}
.maskPopDiv{
  width:1200px;
  height:600px;
  position: relative;
  background:#fff;
  box-sizing: border-box;
  padding:30px;
}
.maskPopDivTop{
  width:100%;height:40px;text-align:left;position: relative;
}
.crumbsDiv{
  position: absolute;
  right:0;
  bottom:0;
}
.crumbsDiv>div{
  padding: 0;
}
.maskPopHide{
  width:30px;
  height: 30px;
  position: absolute;
  right:5px;
  top:5px;
}
</style>
