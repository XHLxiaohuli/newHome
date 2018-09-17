<template>
  <div class="treeOptions">
    <div class="no_elve1" v-for="(val_1,i) in treeOptionsVal" :key="i">
      <div :class="seleLE == val_1.id ? 'xuanzhongle no_p1':'no_p1'">
        <p  @click="clickPSJ({id:val_1.id,type:val_1.type,level:'0',text:val_1.title})">{{val_1.title}}</p>
        <i  v-if="structureSWH && suspenArrVal.indexOf(val_1.id)>-1" @click="clickPSJ({id:val_1.id,type:val_1.type,level:'0',text:val_1.title})" class="down-triangle sanjiao1"></i>
        <i  v-if="structureSWH && !(suspenArrVal.indexOf(val_1.id)>-1)" @click="clickPSJ({id:val_1.id,type:val_1.type,level:'0',text:val_1.title})" class="right-triangle sanjiao1"></i>
        <img v-if="structureSWH" class="bumen_1" src="../assets/img/部门.png" alt="">
        <img v-if="suspenSWH && val_1.suspenArr.length>0" class="sandian" src="../assets/img/more.png" alt="">
        <div class="xuanfu_c">
          <div>
            <p  v-for="(value,index) in val_1.suspenArr" 
                :key="index" 
                @click="clicksuspenFun({id:val_1.id,type:val_1.type,level:'0',text:value})">{{value}}</p>
          </div>
        </div>
      </div>
      <div class="no_elve2"  v-if="suspenArrVal.indexOf(val_1.id)>-1"  v-for="(val_2,n) in val_1.children" :key="n">
        <div :class="seleLE == val_2.id ? 'xuanzhongle no_p2':'no_p2'">
          <p  @click="clickPSJ({id:val_2.id,type:val_2.type,level:'1',text:val_2.title})">{{val_2.title}}</p>
          <i  v-if="structureSWH && suspenArrVal.indexOf(val_2.id)>-1" @click="clickPSJ({id:val_2.id,type:val_2.type,level:'1',text:val_2.title})" class="down-triangle sanjiao2"></i>
          <i  v-if="structureSWH && !(suspenArrVal.indexOf(val_2.id)>-1)" @click="clickPSJ({id:val_2.id,type:val_2.type,level:'1',text:val_2.title})" class="right-triangle sanjiao2"></i>
          <img  v-if="structureSWH" class="bumen_2" src="../assets/img/部门.png" alt="">
          <img v-if="suspenSWH && val_2.suspenArr.length>0" class="sandian" src="../assets/img/more.png" alt="">
          <div class="xuanfu_c">
            <div>
              <p  v-for="(value,index) in val_2.suspenArr" 
                  :key="index" 
                  @click="clicksuspenFun({id:val_2.id,type:val_2.type,level:'0',text:value})">{{value}}</p>
            </div>
          </div>
        </div>
        <div class="no_elve3"  v-if="suspenArrVal.indexOf(val_2.id)>-1"  v-for="(val_3,m) in val_2.children" :key="m">
          <div :class="seleLE == val_3.id ? 'xuanzhongle no_p3':'no_p3'">
            <p  @click="clickPSJ({id:val_3.id,type:val_3.type,level:'2',text:val_3.title})">{{val_3.title}}</p>
            <img v-if="suspenSWH && val_3.suspenArr.length>0" class="sandian" src="../assets/img/more.png" alt="">
            <div class="xuanfu_c">
              <div>
                <p  v-for="(value,index) in val_3.suspenArr" 
                    :key="index" 
                    @click="clicksuspenFun({id:val_3.id,type:val_3.type,level:'0',text:value})">{{value}}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
export default {
  props:['treesVal','chilsWArr','suspenSWH','structureSWH','seleLE'],
  data() {
    return {
      treeOptionsVal:this.treesVal,
      // 下级显示开关
      suspenArrVal:this.chilsWArr?this.chilsWArr:[],
      // 单击选中id
      xzId:'',
    }
  },
  components: {  },
  watch:{
    treesVal:{
      handler(newVal, oldVal){
        this.treeOptionsVal = newVal;
        this.suspensionFun();
      },
      deep:true
    },
    chilsWArr:{
      handler(newVal, oldVal){
        this.suspenArrVal = newVal;
        this.suspensionFun();
      },
      deep:true
    },
  },
  mounted() {
    this.suspensionFun();
  },
  updated(){
    this.suspensionFun();
  },
  methods:{
    // 点击打开下级
    clickPSJ:function(obj={
      id:'',
      type:'',
      level:'',
      text:'',
    }){
      var index_ = this.suspenArrVal.indexOf(obj.id);
      if(index_ > -1){
        this.suspenArrVal.splice(index_, 1); 
      }else{
        this.suspenArrVal.push(obj.id);
      };
      this.xzId=obj.id;
      this.$emit('clickSele',obj);
    },
    // 悬浮函数
    suspensionFun:function(){
      $('.sandian').mouseover(function(){
        $(this).siblings('.xuanfu_c').css({display:'block'})
        .mouseover(function(){
          $(this).css({display:'block'});
        }).mouseout(function(){
          $(this).css({display:'none'});
        });
      }).mouseout(function(){
        $(this).siblings('.xuanfu_c').css({display:'none'});
      });
    },
    // 点击弹窗按钮
    clicksuspenFun:function(obj={
      id:'',
      type:'',
      level:'',
      text:'',
    }){
      this.$emit('clickSuspen',obj);
    },

  }
}
</script>

<style lang='less'>
@import '../assets/less/common.less';
.treeOptions{
  width: 100%;
  height: 100%;
}
.no_elve1,
.no_elve2,
.no_elve3{
  width: 100%;
  height: auto;
}
.no_p1,
.no_p2,
.no_p3{
  width: 100%;
  height: 30px;
  font-size: 16px;
  font-family:PingFangSC-Regular;
  color:rgba(71,78,95,1);
  padding-right: 25px;
  box-sizing: border-box;
  text-align: left;
  line-height: 30px;
  position: relative!important;
}
.no_p1{  padding-left: 25px; }
.no_p2{  padding-left: 35px; }
.no_p3{  padding-left: 45px; }
.no_p1:hover,
.no_p2:hover,
.no_p3:hover{
  background:rgba(239,242,253,1);
}
.no_p1>p,
.no_p2>p,
.no_p3>p{
  width: 100%;
  height: 30px;
  overflow: hidden;
  white-space:nowrap;
  text-overflow: ellipsis;
  box-sizing: border-box;
  text-align: left;
  line-height: 30px;
}
.sandian{
  width: 14px;
  height: auto;
  position: absolute;
  right: 5px;
  top:50%;
  transform: translate(0, -50%);
}
.bumen_1{
  width: 8px;
  height: auto;
  position: absolute;
  left: 15px;
  top:50%;
  transform: translate(0, -50%);
}
.bumen_2{
  width: 8px;
  height: auto;
  position: absolute;
  left: 25px;
  top:50%;
  transform: translate(0, -50%);
}
.sanjiao1{
  display: inline-block;
  position: absolute;
  left: 5px;
  top:50%;
  transform: translate(0, -50%);
}
.sanjiao2{
  display: inline-block;
  position: absolute;
  left: 15px;
  top:50%;
  transform: translate(0, -50%);
}
.xuanfu_c{
  width: auto;
  height: auto;
  box-sizing: border-box;
  padding-top: 10px;
  position: absolute;
  right: 5px;
  top:15px;
  z-index: 999;
  display: none;
}
.xuanfu_c>div{
  width: auto;
  height: auto;
  border-radius: 5px;
  background: #fff;
  box-sizing: border-box;
  padding: 5px;
  box-shadow:0px 0px 5px #333333;
}
.xuanfu_c>div>p{
  width:auto;
  min-width: 60px;
  height: 20px;
  line-height: 20px;
  font-size: 10px;
}
.xuanfu_c>div>p:hover{
  background:rgba(239,242,253,1);
}
.xuanzhongle{
  background:rgba(239,242,253,1);
}
</style>
