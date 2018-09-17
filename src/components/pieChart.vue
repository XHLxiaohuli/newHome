<template>
  <div class="pieChartComponent">
    <div :id="pieChartId" style="width: 100%;height: 100%;"></div>
  </div>
</template>

<script>
export default {
  props:['pieChartId','pieChartVal'],
  data() {
    return {  }
  },
  watch:{
    pieChartVal:{//深度监听，可监听到对象、数组的变化
      handler(newVal, oldVal){
        this.pieChartFun(
          this.pieChartId,
          newVal
        );
      }
    }
  },
  mounted() {
    this.pieChartFun(
      this.pieChartId,
      this.pieChartVal
    );
  },
  methods:{
    pieChartFun:function(pieChartId,pieChartVal_){
        // 展示数据
        let data = pieChartVal_.data;
        // 数据名数组
        let data_name = [];
        // 循环追加数据名
        for (var n  in data){
            data[n]['name'] = data[n]['name'] + ' '+data[n]['value'] +'%';
            data_name.push(data[n]['name'])
        };
        let option = {
          // 背景颜色
          backgroundColor:'#FFFFFF',
          // 标题设置
          title: {
            text: pieChartVal_.title.text,
            subtext: pieChartVal_.title.subtext,
            top: 40,
            left: 'center',
            textStyle: {
              color: "#333",
              fontWeight:'normal',
              fontSize:16
            }
          },
          // 悬浮弹窗
          tooltip: {
            trigger: 'item',
            formatter: "{b}"
          },
          // 
          legend: {
            orient: 'vertical',
            top: pieChartVal_.legend.top,
            left: pieChartVal_.legend.left,
            right: pieChartVal_.legend.right,
            data:data_name,
            textStyle: {
                color: "#888",
                fontWeight:'normal',
                fontSize:12
                // fontFamily:'宋体'
            }
          },
          series: [
            {
              name:'',
              type:'pie',
              radius: ['27%', '40%'],
              data:data
            }
          ]
        };
        // 基于准备好的dom，初始化echarts实例
        let pieChart = echarts.init(document.getElementById(pieChartId));
        // 绘制图表
        pieChart.setOption(option);
    },

  }
}
</script>

<style lang='less'>
@import '../assets/less/common.less';
.pieChartComponent{
  width: 100%;
  height: 100%;
  margin-top: -20px;
}
</style>
