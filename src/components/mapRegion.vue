<template>
  <div class="mapRegionComponent">
    <div id="mapRegion"></div>
  </div>
</template>

<script>
export default {
  data() {
    return {

    }
  },
  mounted() {
    this.mapRegionFun();
  },
  methods:{
    mapRegionFun:function(){
        let option = {
            // 背景颜色
            backgroundColor:'#FFFFFF',
            // 标题设置
            title: {
                text: '微信好友地区统计',
                subtext: '（共20位）',
                left: 'center',
                textStyle: {
                    color: "#333",
                    fontWeight:'normal',
                    fontSize:16
                }
            },
            // 悬浮弹窗
            tooltip: {
                trigger: 'item'
            },
            series: [
                {
                    name: '好友量',
                    type: 'map',
                    mapType: 'china',
                    roam: false,
                    // 地区名称
                    // label: {
                        // normal: {
                        //     show: true
                        // },
                        // emphasis: {
                        //     show: true
                        // }
                    // },
                    data:[
                        {name: '北京',value: 100}
                    ]
                }
            ],
            // visualMap: {
                // min: 0,
                // max: 2500,
                // left: 'left',
                // top: 'bottom',
                // text: ['高','低'],           // 文本，默认为数值文本
                // calculable: true,
                // inRange: {
                //     color: ['#e0ffff', '#006edd'],
                //     symbolSize: [0, 2500]
                // }
            // },
            // toolbox: {
                // show: true,
                // orient: 'vertical',
                // left: 'right',
                // top: 'center',
                // feature: {
                //     dataView: {readOnly: false},
                //     restore: {},
                //     saveAsImage: {}
                // }
            // },
        };
        // 基于准备好的dom，初始化echarts实例
        let mapRegion = echarts.init(document.getElementById('mapRegion'));
        // 绘制图表
        mapRegion.setOption(option);
    },

  }
}
</script>

<style lang='less'>
@import '../assets/less/common.less';
.mapRegionComponent{
  width: 100%;
  height: 100%;
}
#mapRegion{
  width: 100%;
  height: 100%;
}
</style>
