<template>
  <div class="dataLocation" :id="dataLocaId">
    <div class="input_div_">
      <div class="input_search_">
        <input type="text" placeholder="请输入要搜索的内容"  v-model="inputModel" @keydown.13="searchFun_">
        <img src="../assets/img/on_serch_direct.png" alt=""  @click="searchFun_">
      </div>
    </div>
    <div class="val_list">
      <div class="val_con">
        <p  class="val_p_" 
            v-for="(val,i) in dataLocaVal"  
            :key="i"
            @click="getClickVal(i)">
            {{val.title}}
        </p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props:['dataLocaId','dataLocaValue'],
  data() {
    return {
      // 初始数据
      dataLocaVal:this.dataLocaValue,
      // title数组
      titleArr:[],
      // 输入框绑定数据
      inputModel:''
    }
  },
  components: {  },
  watch:{
    dataLocaValue:{//深度监听，可监听到对象、数组的变化
      handler(newVal, oldVal){
        this.dataLocaVal = newVal;
        this.getcorresponTitle();
      },
    }
  },
  mounted() {
    this.getcorresponTitle();
  },
  methods:{
    // 初始获取数据title对应数组
    getcorresponTitle:function(){
      var arr = [];
      for(var i=0;i<this.dataLocaVal.length;i++){
        arr.push(this.dataLocaVal[i].title);
      };
      this.titleArr = arr;
    },
    // 获取被点击的数据
    getClickVal:function(e){
      var clickVal = this.dataLocaVal[e];
      this.dataLocaVal.splice(e,1);
      this.titleArr.splice(e,1);
      // 传递数据父级
      this.$emit('getDelVal',clickVal);
    },
    // 输入框搜索函数
    searchFun_:function(){
      var id = this.dataLocaId;
      var text = this.inputModel,
          judgmentVal = this.titleArr,
          indexArr = [];
      // 获取能匹配的title的下标
      if(text!=''){
        for(var i=0;i<judgmentVal.length;i++){
          if(judgmentVal[i].indexOf(text) > -1){
            indexArr.push(i);
          };
        };
      };
      // 判断匹配的下标是否为0
      if(indexArr.length!=0){
            // 当前距离头部高度
        var height_ = $('#'+id+'  .val_con').position().top,
            // 当前div高度
            view_height = $('#'+id+'  .val_con').height(),
            bool_ = false,
            height_c;
        // 滚动高度取正数
        height_ = height_>=0?height_:height_*-1; 
        for(var i=0;i<indexArr.length;i++){
          // 当前距离头部高度
          height_c = $('#'+id+'  .val_p_').eq(indexArr[i]).position().top;
          if((view_height-height_)==355){
            bool_ = true; break;
          };
          if((height_c-height_)>0){
            $('#'+id+'  .val_list').animate({scrollTop:height_c},500);
            return;
          };
        };
        if(bool_){
          $('#'+id+'  .val_list').animate({scrollTop:$('#'+id+'  .val_p_').eq(indexArr[0]).position().top},500);
        };
      };
    },
    // 获取当前新数据
    getNewValFun:function(){
      var newVal = this.dataLocaValue;
      return newVal;
    },


  }
}
</script>

<style lang='less'>
@import '../assets/less/common.less';
.dataLocation{
  width: 280px;
  height: 400px;
  border-radius:4px;
  background:rgba(255,255,255,1);
  border:1px solid rgba(236,236,248,1);
  box-sizing: border-box;
}
.input_div_{
  width: 100%;
  height: 45px;
  background:rgba(236,236,248,.5);
}
.val_list{
  width: 100%;
  height: 355px;
  position: relative;
  overflow: auto;
}
.input_search_{
  width: 280px;
  height: 45px;
  box-sizing: border-box;
  position: relative;
}
.input_search_>input{
  width: 235px;
  height: 40px;
  float: left;
  text-indent:10px;
  background:none;  
	outline:none;  
	border:0px;
}
.input_search_>img{
  position: absolute;
  right: 6px;
  top:50%;
  transform: translate(0, -50%);
}
.val_p_{
  width: 100%;
  height: 40px;
  box-sizing: border-box;
  padding:0 10px;
  text-align: left;
  line-height: 40px;
  font-size:16px;
  font-family:PingFangSC-Regular;
  color:rgba(71,78,95,1);
}
.val_p_:hover{
  background: rgba(236,236,248,.2);
}
.val_con{
  width: 100%;
  height: auto;
  position: relative;
  min-height: 355px;
}
</style>
