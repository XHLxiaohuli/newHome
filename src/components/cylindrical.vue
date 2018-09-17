<template>
  <div class="cylindricalComponent">
    <div :id="cylindricalId" style="width: 100%;height: 100%;"></div>
  </div>
</template>

<script>
export default {
  props:['cylindricalId','cylindricalVal'],
  data() {
    return {

    }
  },
  watch:{
    cylindricalVal:{
      handler(newVal, oldVal){
        this.cylindricalFun(
          this.cylindricalId,
          newVal
        );
      },
      deep:true
    },
  },
  mounted() {
    this.cylindricalFun(
      this.cylindricalId,
      this.cylindricalVal
    );
  },
  methods:{
    cylindricalFun:function(cylindricalId,cylindricalVal){
        let option = {
          // 背景颜色
          backgroundColor:'#FFFFFF',
          // 标题设置
          // title: {
              // text: '微信好友地区统计',
              // subtext: '（共20位）',
              // left: 'center',
              // textStyle: {
              //     color: "#333",
              //     fontWeight:'normal',
              //     fontSize:16
              // }
          // },
          // 悬浮弹窗
          tooltip: {
              trigger: 'axis',
              axisPointer: { // 坐标轴指示器，坐标轴触发有效
                  type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
              }
          },
          // legend: {
              // data: ['检查企业数', '完成整改企业数', '违法违规企业数']
          // },
          // 显示区域位置设置
          grid: {
              left: '3%',
              right: '4%',
              bottom: '3%',
              containLabel: true
          },
          // 横轴设置
          xAxis: [{
              type: 'category',
              data: cylindricalVal.xAxisVal
          }],
          // 纵轴设置
          yAxis: [{
              type: 'value',
              //name: '投诉举报数',
              axisLabel: {
                  formatter: '{value}'
              }
          }],
          series: cylindricalVal.data
        };

        // 基于准备好的dom，初始化echarts实例
        let cylindrical = echarts.init(document.getElementById(cylindricalId));
        // 绘制图表
        cylindrical.setOption(option);
    },

  }
}
</script>

<style lang='less'>
@import '../assets/less/common.less';
.cylindricalComponent{
  width: 100%;
  height: 100%;
}
</style>
