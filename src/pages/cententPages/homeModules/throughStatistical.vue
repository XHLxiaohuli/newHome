<template>
  <div class="throughStatistical">
    <!-- 数据导出组件 -->
    <div style="margin-bottom:10px;text-align: left;">
      <exportData
        :iframeData="throughDataVal"
      />
    </div>
    <div class="growthContainer">
      <!-- 列表组件 -->
      <formModule
        :checkboxGroup=false
        :separationBorder=true
        :showHeight=310
        :formVal="throughFormVal"
      />
      <div style="width:100%;height:15px;"></div>
      <!-- 分页组件 -->
      <pagingModule
        :totalNum=20
        :currentNum=6
        :showValNum=5
        @pagingFun="throughPagingFun"
      />
    </div>
  </div>
</template>

<script>
// 数据导出表格组件
import exportData from '@/components/exportData'
// 列表组件
import formModule from '@/components/formModule'
// 分页组件
import pagingModule from '@/components/pagingModule'
export default {
  data() {
    return {
      throughDataVal:'1,2,3,4\n5,6,7,8\n',
      throughFormVal:{
        title:[                               
          { 
            name:'微信信息',                   //表头-->列名称
            type:'arry',                    //数据类型（string，arry，operation）
            tag:'shijian',                    //对应数据表示
            highlighted:[],                   //设置高亮名词选填可多个，数据类型（数组）
            width:30                        //占据整行宽度的百分比（数字）
          },
          { 
            name:'分配总数',
            type:'string',
            tag:'nanxing',
            highlighted:[],
            width:20
          },
          { 
            name:'分配男性',
            type:'string',
            tag:'nvxing',
            highlighted:[],
            width:20
          },
          { 
            name:'分配女性',
            type:'string',
            tag:'weizhi',
            highlighted:[],
            width:20
          }
        ],
        value:[                                   //需要显示的数据
          {   
            shijian:[
              {
                belongs:'image',                       //图片数据（belongs指定"image"）
                url:'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1532667996473&di=1283367a35382739009a0c5fdcdf7147&imgtype=0&src=http%3A%2F%2Fs10.sinaimg.cn%2Fmw690%2F005SZPVjzy76vBoMGyB29%26690'   //图片地址
              },{
                belongs:'',
                val:'麋鹿小姐'
              },{
                belongs:'',
                val:'abcdefj'
              }
            ],
            nanxing:'1829',
            nvxing:'3',
            weizhi:'4'
          },
          {   
            shijian:[
              {
                belongs:'image',                       //图片数据（belongs指定"image"）
                url:'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1532667996473&di=1283367a35382739009a0c5fdcdf7147&imgtype=0&src=http%3A%2F%2Fs10.sinaimg.cn%2Fmw690%2F005SZPVjzy76vBoMGyB29%26690'   //图片地址
              },{
                belongs:'',
                val:'麋鹿小姐'
              },{
                belongs:'',
                val:'abcdefj'
              }
            ],
            nanxing:'1829',
            nvxing:'3',
            weizhi:'4'
          },
          {   
            shijian:[
              {
                belongs:'image',                       //图片数据（belongs指定"image"）
                url:'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1532667996473&di=1283367a35382739009a0c5fdcdf7147&imgtype=0&src=http%3A%2F%2Fs10.sinaimg.cn%2Fmw690%2F005SZPVjzy76vBoMGyB29%26690'   //图片地址
              },{
                belongs:'',
                val:'麋鹿小姐'
              },{
                belongs:'',
                val:'abcdefj'
              }
            ],
            nanxing:'1829',
            nvxing:'3',
            weizhi:'4'
          },
          
          
        ]
      },

    }
  },
  components: { exportData,formModule,pagingModule  },
  methods:{
    throughPagingFun:function(data){
      console.log(data);
    },

  }
}
</script>

<style lang='less'>
@import '../../../assets/less/common.less';
.throughStatistical{
  width: 60%;
  height: 100%;
  float: left;
  overflow: auto;
  box-sizing: border-box;
}
</style>
