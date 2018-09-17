<template>
  <div class="sensitiveStatistical">
    <div class="sensitiveStatistical_k">
      <!-- 好友性别统计数据 -->
      <div class="sensitiveStatistical_pieChart">
        <pieChart
          :pieChartId="'pieChartId_3'"
          :pieChartVal="pieChartVal_3"
        />
      </div>
    </div>
  </div>
</template>

<script>
// 饼图组件
import pieChart from '@/components/pieChart'
export default {
  data() {
    return {
      // 好友来源统计数据
      pieChartVal_3:{
        title:{
          text:'敏感操作统计',
          subtext:'共20次',
        },
        legend:{
          top: 'center',
          // left: 'center',
          right:'right',
        },
        data:[
          {"value": 26, "name": "触发敏感词"},
          {"value": 16.7, "name": "收红包请求"},
          {"value": 20, "name": "删除联系人"},
          {"value": 18, "name": "删除聊天记录"},
          {"value": 32, "name": "删除联系人"},
        ],
      },
    }
  },
  components: {  pieChart  }
}
</script>

<style lang='less'>
@import '../../../assets/less/common.less';
.sensitiveStatistical{
  width: 100%;

  height:100%;
  overflow: auto;
}
.sensitiveStatistical_k{
  width:100%;
  height:440px;
  display: flex;
  flex-direction:row;
  justify-content:space-between;
  box-sizing: border-box;
  padding:0 2px;
}
.sensitiveStatistical_pieChart{
  width:55%;
  min-width:700px;
  height:380px;
  margin-top: 40px;
  box-sizing: border-box;
  padding:20px 100px 20px 0;
  border-radius:10px;
  box-shadow: 0px 2px 5px #ccc;
}
</style>
