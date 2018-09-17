<template>
  <div class="multiSelect" :data-val="processData(selected)">
    <div class="multiSelect_k">
      <div class="multiSelect_k_2">
        <span class="multiSelect_span" v-for="(val,i) in selected" :key="i">
          {{val.text}}
          <img src="../assets/img/弹窗-关闭.png" @click="delSelected(val)"/>
        </span>
      </div>
      <div :class="'multiSelectClick  '+id" @click="openScreening(id)"></div>
    </div>
    <div  class="multiSelect_list" v-if="multiListShow">
      <p class="multiSelect_list_p" v-for="(val,i) in screening" :key="i" @click="clickScreening(val)">
        {{val.text}}
        <img src="../assets/img/chosed.png" v-if="selected.indexOf(val) > -1"/>
      </p>
    </div>
  </div>
</template>

<script>
export default {
  props:['id','selectedArr','screeningArr'],
  data() {
    return { 
      selected:this.selectedArr,
      screening:this.screeningArr,
      multiListShow:false
    }
  },
  watch:{
    selectedArr:{//深度监听对象的变化
      handler(newVal, oldVal){
        this.selected=newVal;
      },
      deep: true    //深度监听
    },
    screeningArr:{//深度监听对象的变化
      handler(newVal, oldVal){
        this.screening=newVal;
      },
      deep: true    //深度监听
    }
  },
  methods:{
    // 删除已选中的函数
    delSelected:function(data){
      this.selected.splice( this.selected.indexOf( data ), 1 );
    },
    // 打开下拉选项函数
    openScreening:function(data){
      if(this.multiListShow){
        this.multiListShow=false;
        $('.'+data).css({backgroundImage:'url('+require('../assets/img/icon_chosed.png')+')'});
      }else{
        this.multiListShow=true;
        $('.'+data).css({backgroundImage:'url('+require('../assets/img/icon_chosed的副本.png')+')'});
      };
    },
    // 点击选中函数
    clickScreening:function(data){
      if(this.selected.indexOf(data)<0){
        this.selected.push(data);
      }
      // else{
      //   this.selected.splice( this.selected.indexOf( data ), 1 );
      // }
    },
    // 处理数据
    processData:function(data){
      var arr=[];
      for(var i=0;i<data.length;i++){
        arr.push(data[i].val);
      };
      return arr.join('`/`');
    },


  }
}
</script>

<style lang='less'>
@import '../assets/less/common.less';
.multiSelect{
  width:320px;
  height:45px;
  display: inline-block;
  position: relative;
}
.multiSelect_k{
  width:320px;
  height:45px;
  box-sizing: border-box;
  padding: 0 50px 0 10PX;
  text-align: left;
  border-radius:4px;
  border:1px solid rgba(236,236,248,1);
  position: relative;
}
.multiSelect_k_2{
  position: absolute;
  width:260px;
  height: 100%;
  overflow: auto;
}
.multiSelectClick{
  position: absolute;
  width: 50px;
  height: 43px;
  box-sizing: border-box;
  border-left:1px solid rgba(236,236,248,1);
  right: 0;
  top: 0;
  cursor:pointer;
  background-image: url(../assets/img/icon_chosed.png);
  background-repeat: no-repeat;
  background-size: 40% auto;
  background-position: 50% 50%;
}
.multiSelect_list{
  width:320px;
  height:120px;
  box-sizing: border-box;
  padding: 15px;
  background:rgba(255,255,255,1);
  box-shadow:0px 0px 2px 0px rgba(0,0,0,0.08);
  border-radius:4px 4px 4px 0px;
  border:1px solid rgba(236,236,248,1);
  overflow: auto;
  position: absolute;
  left:50%;
  top:50px;
  transform: translate(-50%, 0);
  z-index: 999;
}
.multiSelect_span{
  display: inline-block;
  width:auto;
  height:25px;
  box-sizing: border-box;
  padding: 0 10px;
  line-height: 25px;
  margin: 10px 10px 8px 0;
  border-radius:4px;
  border:1px solid rgba(217,217,217,1);
  position: relative;
}
.multiSelect_span>img{
  width: 16px;
  height: auto;
  position: absolute;
  right:0;
  top:0;
  transform: translate(50%, -50%);
}
.multiSelect_list_p{
  width: 100%;
  height: 30px;
  box-sizing: border-box;
  padding-left: 10px;
  text-align: left;
  line-height: 30px;
  position: relative;
}
.multiSelect_span:hover{
  background:rgba(0,0,0,0.08);
}
.multiSelect_list_p:hover{
  background:rgba(0,0,0,0.08);
}
.multiSelect_list_p>img{
  position: absolute;
  right:10px;
  top:50%;
  transform: translate(0, -50%);
}
</style>
