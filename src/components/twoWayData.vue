<template>
  <div class="twoWayData">
    <p class="popOperation_t">{{title}}</p>
    <div style="width:90%;height:420px;">
      <div style="float:left;">
        <p style="text-align: left;">待选取人员</p>
        <dataLocation
          ref="dataLocaId_0_"
          :dataLocaId="'dataLocaId_0'"
          :dataLocaValue="dataLocaValue_1"
          @getDelVal="getDelValFun_1"
        />
      </div>
      <div style="float:right;">
        <p style="text-align: left;">已选人员</p>
        <dataLocation
          ref="dataLocaId_1_"
          :dataLocaId="'dataLocaId_1'"
          :dataLocaValue="dataLocaValue_2"
          @getDelVal="getDelValFun_2"
        />
      </div>
    </div>
    <div class="popOperation_b">
      <button class="exit_btn" 
      style="width:80px;height:40px;margin-right:50px;background:rgba(199,199,199,1);" @click="cancel_p">取消</button>
      <button class="exit_btn" 
      style="width:80px;height:40px;" @click="determine_p">确定</button>
    </div>
  </div>
</template>

<script>
// 列表数据定位
import dataLocation from '@/components/dataLocation'
export default {
  props:['title','dataLocaValue'],
  data() {
    return {
      dataLocaValue_1:this.dataLocaValue.left,
      dataLocaValue_2:this.dataLocaValue.right,
    }
  },
  components: { dataLocation  },
  methods:{
    getDelValFun_1:function(data){
      this.dataLocaValue_2.push(data);
    },
    getDelValFun_2:function(data){
      this.dataLocaValue_1.push(data);
    },
    // 确定按钮
    determine_p:function(){
      var obj={
        leftNewVal:this.$refs.dataLocaId_0_.getNewValFun(),
        rightNewVal:this.$refs.dataLocaId_1_.getNewValFun(),
      };
      // 触发父级函数
      this.$emit('determine',obj);
    },
    // 取消按钮
    cancel_p:function(){
      // 触发父级函数
      this.$emit('cancel');
    },

  }
}
</script>

<style lang='less'>
@import '../assets/less/common.less';
.twoWayData{
  width: 850px;
  height: 700px;
  background:rgba(255,255,255,1);
  border-radius:8px;
  box-sizing: border-box;
  padding: 30px;
}
.popOperation_t{
  font-size:20px;
  font-family:PingFangSC-Medium;
  color:rgba(51,51,51,1);
  line-height:30px;
  margin-bottom: 30px;
}
.popOperation_b{
  width: 100%;
  height: auto;
  margin-top: 80px;
}
</style>
