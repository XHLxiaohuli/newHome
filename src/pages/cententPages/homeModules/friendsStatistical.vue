<template>
  <div class="friendsStatistical">
    <!-- 数据导出按钮 -->
    <div class="friendsStatistical_exportData">
      <exportData
        :iframeData="friendsDataVal"
      />
    </div>
    <div class="friendsStatistical_k">
      <!-- 好友性别统计数据 -->
      <div class="friendsStatistical_pieChart">
        <pieChart
          :pieChartId="'pieChartId_0'"
          :pieChartVal="pieChartVal_0"
        />
      </div>
      <!-- 好友来源统计数据 -->
      <div class="friendsStatistical_pieChart">
        <pieChart
          :pieChartId="'pieChartId_1'"
          :pieChartVal="pieChartVal_1"
        />
      </div>
      <!-- 好友地区统计 -->
      <div class="friendsStatistical_mapRegion">
        <mapRegion/>
      </div>
    </div>
  </div>
</template>

<script>
// 地图组件
import mapRegion from '@/components/mapRegion'
// 饼图组件
import pieChart from '@/components/pieChart'
// 数据导出表格组件
import exportData from '@/components/exportData'
export default {
  data() {
    return {
      // 导出的数据
      friendsDataVal:'1,2,3,4\n5,6,7,8\n',
      // 好友性别统计数据
      pieChartVal_0:{
        title:{
          text:'好友性别统计',
          subtext:'共20位',
        },
        legend:{
          top: 'bottom',
          left: 'center',
          right:'',
        },
        data:[
          {"value": 26, "name": "男性"},
          {"value": 16.7, "name": "女性"},
          {"value": 20, "name": "未知"},
        ],
      },
      // 好友来源统计数据
      pieChartVal_1:{
        title:{
          text:'好友来源统计',
          subtext:'共20位',
        },
        legend:{
          top: 'bottom',
          left: 'center',
          right:'',
        },
        data:[
          {"value": 26, "name": "微信号搜索"},
          {"value": 16.7, "name": "手机号搜索"},
          {"value": 20, "name": "附近的人"},
          {"value": 18, "name": "好友推荐"},
        ],
      },


    }
  },
  components: {  mapRegion,pieChart,exportData  },
  methods:{
    
  }
}
</script>

<style lang='less'>
@import '../../../assets/less/common.less';
.friendsStatistical{
  width: 100%;
  height:100%;
  overflow: auto;
}
.friendsStatistical_exportData{
  display: flex;
  flex-direction:row;
  justify-content:flex-end;
  margin-bottom:12px;
}
.friendsStatistical_k{
  width:100%;
  height:440px;
  display: flex;
  flex-direction:row;
  justify-content:space-between;
  box-sizing: border-box;
  padding:0 2px;
}
.friendsStatistical_pieChart{
  width:23.5%;
  height:100%;
  box-sizing: border-box;
  padding:20px;
  border-radius:10px;
  box-shadow: 0px 2px 5px #ccc;
}
.friendsStatistical_mapRegion{
  width:49%;
  height:100%;
  box-sizing: border-box;
  padding:20px;
  border-radius:10px;
  box-shadow: 0px 2px 5px #ccc;
}
</style>
