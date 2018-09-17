<template>
  <div class="curveComponent">
    <div :id="curveId" style="width: 100%;height: 100%;"></div>
  </div>
</template>

<script>
export default {
  props:['curveId','curveVal'],
  data() {
    return {  }
  },
  watch:{
    curveVal:{//深度监听，可监听到对象、数组的变化
      handler(newVal, oldVal){
        this.curveFun(
          this.curveId,
          newVal
        );
      }
    }
  },
  mounted() {
    this.curveFun(
      this.curveId,
      this.curveVal
    );
  },
  methods:{
    curveFun:function(curveId,curveVal){
      let option = {
        // 背景颜色
        backgroundColor:'#FFFFFF',
        // 标题设置
        // title: {
            // text: '微信好友地区统计',
            // left: 'left',
            // textStyle: {
            //     color: "#333",
            //     fontWeight:'normal',
            //     fontSize:16
            // }
        // },
        // 悬浮弹窗
        tooltip: {
            trigger: 'axis'
        },
        // legend: {
            // data:['同比','环比']
        // },
        // 显示区域位置设置
        grid: {
            left: '6%',
            right: '5%',
            bottom: '5%',
            containLabel: true
        },
        // 横轴设置
        xAxis: {
            type: 'category',
            boundaryGap: true,
            data: curveVal.xAxisVal
        },
        // 纵轴设置
        yAxis: {
            type: 'value',
            // name: '同比/环比（%）',
            min: curveVal.yAxis.min,
            max: curveVal.yAxis.max,
            interval: curveVal.yAxis.interval,
        },
        series: curveVal.data
      };

      // 基于准备好的dom，初始化echarts实例
      let curve = echarts.init(document.getElementById(curveId));
      // 绘制图表
      curve.setOption(option);
    },

  }
}
</script>

<style lang='less'>
@import '../assets/less/common.less';
.curveComponent{
  width: 100%;
  height: 100%;
}
</style>
