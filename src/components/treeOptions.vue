<template>
  <div class="treeOptions" :id="treeId">
    <div class="treeOptions_container">
<!-- ---------------------------------------------------------------------------------------- -->
      <ul>
        <li class="li_con" style="padding-left:0;" 
            v-for="(val_0,i_0) in treeOptionVal" :key="i_0">
          <div class="liP_con">
            <!-- 左选项框 -->
            <div class="fromDiv optionsDialog" v-if="val_0.checkbox">
              <div class="checkbox-group">
                <input class="checkboxInput" type="checkbox" :id="val_0.id" :data-type="val_0.type"/>
                <label :for="val_0.id"></label>
              </div>
            </div>
            <!-- 文本内容 -->
            <div class="div_con">
              <p :class="xzId==val_0.id?'text_color textP_con':'textP_con'" @click="click_s({id:val_0.id,type:val_0.type,level:0,text:val_0.title})">{{val_0.title}}</p>
            </div>
            <!-- 右操作按钮 -->
            <div class="div_opts">
              <!-- 点击打开下拉 -->
              <img  v-if="val_0.children && val_0.children.length > 0 && val_0.dropDown" 
                    @click="dropDownFun(val_0.id)"
                    src="../assets/img/icon_chosed.png" 
                    class="icon_chosed" alt="">
              <!-- 删除图标 -->
              <img  v-if="val_0.delete" 
                    @click="deteleFun(val_0.id)"
                    src="../assets/img/close.png" 
                    class="close_img" alt="">
              <!-- 悬浮操作图标 -->
              <img  v-if="val_0.suspension" 
                    src="../assets/img/home_chose5.png" 
                    class="sandian_img" alt="">
              <div class="suspension_div" v-if="val_0.suspension">
                <div class="suspension_container">
                  <p  v-for="(susVal,i_) in val_0.suspenArr"
                      :key="i_" 
                      @click="clicksuspenFun({id:val_0.id,type:val_0.type,level:0,text:susVal})">
                      {{susVal}}
                  </p>
                </div>
              </div>
            </div>
          </div>
    <!-- ---------------------------------------------------------------------------------------- -->
          <ul v-if="val_0.children && val_0.children.length > 0 && childrenSwitch.indexOf(val_0.id) > -1">
            <li class="li_con"
                v-for="(val_1,i_1) in val_0.children" :key="i_1">
              <div class="liP_con">
                <!-- 左选项框 -->
                <div class="fromDiv optionsDialog" v-if="val_1.checkbox">
                  <div class="checkbox-group">
                    <input class="checkboxInput" type="checkbox" :id="val_1.id" :data-type="val_1.type"/>
                    <label :for="val_1.id"></label>
                  </div>
                </div>
                <!-- 文本内容 -->
                <div class="div_con">
                  <p :class="xzId==val_1.id?'text_color textP_con':'textP_con'"  @click="click_s({id:val_1.id,father:val_0.id,type:val_1.type,level:1,text:val_1.title})">{{val_1.title}}</p>
                </div>
                <!-- 右操作按钮 -->
                <div class="div_opts">
                  <!-- 点击打开下拉 -->
                  <img  v-if="val_1.children && val_1.children.length > 0 && val_1.dropDown" 
                        @click="dropDownFun(val_1.id)"
                        src="../assets/img/icon_chosed.png" 
                        class="icon_chosed" alt="">
                  <!-- 删除图标 -->
                  <img  v-if="val_1.delete" 
                        @click="deteleFun(val_1.id)"
                        src="../assets/img/close.png" 
                        class="close_img" alt="">
                  <!-- 悬浮操作图标 -->
                  <img  v-if="val_1.suspension" 
                        src="../assets/img/home_chose5.png" 
                        class="sandian_img" alt="">
                  <div class="suspension_div" v-if="val_1.suspension">
                    <div class="suspension_container">
                      <p  v-for="(susVal,i_) in val_1.suspenArr"
                          :key="i_" 
                          @click="clicksuspenFun({id:val_1.id,type:val_1.type,level:1,text:susVal})">
                          {{susVal}}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
        <!-- ---------------------------------------------------------------------------------------- -->
              <ul v-if="val_1.children && val_1.children.length > 0 && childrenSwitch.indexOf(val_1.id) > -1">
                <li class="li_con"
                    v-for="(val_2,i_2) in val_1.children" :key="i_2">
                  <div class="liP_con">
                    <!-- 左选项框 -->
                    <div class="fromDiv optionsDialog" v-if="val_2.checkbox">
                      <div class="checkbox-group">
                        <input class="checkboxInput" type="checkbox" :id="val_2.id" :data-type="val_2.type"/>
                        <label :for="val_2.id"></label>
                      </div>
                    </div>
                    <!-- 文本内容 -->
                    <div class="div_con">
                      <p :class="xzId==val_2.id?'text_color textP_con':'textP_con'" @click="click_s({id:val_2.id,father:val_1.id,type:val_2.type,level:2,text:val_2.title})">{{val_2.title}}</p>
                    </div>
                    <!-- 右操作按钮 -->
                    <div class="div_opts">
                      <!-- 点击打开下拉 -->
                      <!-- <img v-if="val_2.dropDown" src="../assets/img/icon_chosed.png" class="icon_chosed" alt=""> -->
                      <!-- 删除图标 -->
                      <img  v-if="val_2.delete" 
                            @click="deteleFun(val_2.id)"
                            src="../assets/img/close.png" 
                            class="close_img" alt="">
                      <!-- 悬浮操作图标 -->
                      <img  v-if="val_2.suspension" 
                            src="../assets/img/home_chose5.png" 
                            class="sandian_img" alt="">
                      <div class="suspension_div" v-if="val_2.suspension">
                        <div class="suspension_container">
                          <p  v-for="(susVal,i_) in val_2.suspenArr"
                              :key="i_" 
                              @click="clicksuspenFun({id:val_2.id,type:val_2.type,level:2,text:susVal})">
                              {{susVal}}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </li>
              </ul>
        <!-- ---------------------------------------------------------------------------------------- -->
            </li>
          </ul>
    <!-- ---------------------------------------------------------------------------------------- -->
        </li>
      </ul>
<!-- ---------------------------------------------------------------------------------------- -->
    </div>
  </div>
</template>
<script>
export default {
  props:['treeId','treesVal','chilsWArr'],
  data () {
    return {
      // 下级显示开关
      childrenSwitch:this.chilsWArr,
      // 树状选项表数据
      treeOptionVal:this.treesVal,
      // 单击选中id
      xzId:''
    };
  },
  components: {},
  watch:{
    treesVal:{
      handler(newVal, oldVal){
        console.log(newVal);
        this.treeOptionVal = newVal;
        this.suspensionFun();
      },
      deep:true
    },
    chilsWArr:{
      handler(newVal, oldVal){
        console.log(newVal);
        this.childrenSwitch = newVal;
        this.suspensionFun();
      },
      deep:true
    },
  },
  mounted(){
    this.CheckBoxFun();
    this.suspensionFun();
  },
  updated(){
    this.CheckBoxFun();
    this.suspensionFun();
  },
  methods: {
    // 单击选中函数
    click_s:function(obj={
      id:'',
      type:'',
      level:'',
      text:'',
    }){
      this.xzId=obj.id;
      this.$emit('clickSele',obj);
    },
    // 复选框筛选
    CheckBoxFun:function(){
      $('.checkboxInput').bind('click',function(){
        var this_   = this;
        var state   = $(this).prop("checked");
        var li_conArr = $(this_).parents('.li_con'),index_ = -1;

        $(this).closest('.li_con').find('.checkboxInput').not(this).each(function(){
          if(state){
            $(this).prop("checked", true);
          }else{
            $(this).prop("checked", false);
          };
        });
        for(var i=0; i<li_conArr.length; i++){
          var bool_0 = true;
          $(li_conArr[i]).find('.checkboxInput').each(function(){
            if(!$(this).prop("checked")){ bool_0 = false; };
          });
          if(bool_0 && state){
            $(li_conArr[i+1]).find('.checkboxInput').eq(0).prop("checked", true);
          }else{
            $(li_conArr[i+1]).find('.checkboxInput').eq(0).prop("checked", false);
          };
          $(li_conArr[i]).siblings('.li_con').each(function(){
            var bool_1 = true;
            $(this).find('.checkboxInput').each(function(){
              if(!$(this).prop("checked")){ index_ = i; bool_1 = false; };
            });
            if(bool_0 && bool_1 && state){
              $(li_conArr[i+1]).find('.checkboxInput').eq(0).prop("checked", true);
            }else{
              $(li_conArr[i+1]).find('.checkboxInput').eq(0).prop("checked", false);
            };
          });
        };
      });
    },
    // 获取所有选中的id
    getCheckBoxidFun:function(){
      var this_ = this;
      var arr = [];
      $('#'+this_.treeId+"  .checkboxInput").each(function(){
        var state   = $(this).prop("checked");
        if(state){
          arr.push({
            id:$(this).attr('id'),
            type:$(this).attr('data-type'),
          });
        };
      });
      return  arr;
    },
    // 打开下拉函数
    dropDownFun:function(id){
      var i = this.childrenSwitch.indexOf(id);
      if(i > -1){
        this.childrenSwitch.splice(i,1);
      }else{
        this.childrenSwitch.push(id);
      };
    },
    // 点击删除按钮
    deteleFun:function(id){
      var arrVal = this.treeOptionVal;
      var level,delVal;
      for(var i=0; i<arrVal.length; i++){
        if(arrVal[i].id == id){
          delVal=arrVal[i];
          level=0;
          this.treeOptionVal.splice(i,1);
          break;
        }else{
          var towArr = arrVal[i].children;
          for(var n=0; n<towArr.length; n++){
            if(towArr[n].id == id){
              delVal=towArr[n];
              level=1;
              this.treeOptionVal[i].children.splice(n,1);
              break;
            }else{
              var sanArr = towArr[n].children;
              for(var m=0; m<sanArr.length; m++){
                if(sanArr[m].id == id){
                  delVal=sanArr[m];
                  level=2;
                  this.treeOptionVal[i].children[n].children.splice(m,1);
                  break;
                };
              };
            };
          };
        };
      };
      // 传递数据父级
      this.$emit('getDelVal',delVal);
    },
    // 悬浮函数
    suspensionFun:function(){
      $('.sandian_img').mouseover(function(){
        $(this).siblings('.suspension_div').css({display:'block'})
        .mouseover(function(){
          $(this).css({display:'block'});
        }).mouseout(function(){
          $(this).css({display:'none'});
        });
      }).mouseout(function(){
        $(this).siblings('.suspension_div').css({display:'none'});
      });
    },
    // 点击悬浮按钮函数
    clicksuspenFun:function(obj={
      id:'',
      type:'',
      level:'',
      text:'',
    }){
      // 传递数据父级
      this.$emit('clickSuspen',obj);
    },

  }
}

</script>

<style lang='less'>
@import '../assets/less/common.less';
.treeOptions{
  width:100%;
  height:auto;
  box-sizing: border-box;
  padding: 10px;
}
.treeOptions_container{
  width: 100%;
  height: auto;
}
ul{
  width: 100%;
  height: auto;
}
.li_con{
  width: 100%;
  height: auto;
  box-sizing: border-box;
  padding-left: 15px;
}
.liP_con{
  width: 100%;
  height:35px;
  text-align: left;
}
.optionsDialog{
  width: 25px;
}
.fromDiv{
  height: auto;
  padding: 5px;
  display: flex;
  justify-content:flex-start;
  align-items:Center;
  float: left;
}
.div_con{
  position: relative;
  width: auto;
  height: 35px;
  float: left;
}
.textP_con{
  /* width: 150px; */
  height: 35px;
  display: inline-block;
  line-height: 35px;
  font-size: 16px;
  font-family:PingFangSC-Regular;
  color:rgba(71,78,95,1);
  cursor:pointer;
}
.textP_con:hover{
  color: @mainColor;
}
.text_color{
  color: @mainColor;
}
.div_opts{
  width:60px;
  height: 35px;
  float: right;
  text-align: center;
  position: relative;
}
.icon_chosed{
  width: 16px;
  height: auto;
  position: absolute;
  left: 0;
  top:50%;
  transform: translate(0, -50%);
}
.close_img{
  width: 10px;
  height: auto;
  position: absolute;
  left: 50%;
  top:50%;
  transform: translate(-50%, -50%);
}
.sandian_img{
  width: 12px;
  height: auto;
  position: absolute;
  right: 0;
  top:50%;
  transform: translate(0, -50%);
}
.suspension_div{
  position: absolute;
  width: auto;
  height: auto;
  right: 0;
  top:20px;
  box-sizing: border-box;
  padding-top: 6px;
  z-index: 1000;
  display: none;
  /* transform: translate(0, 0); */
}
.suspension_container{
  width: auto;
  height: auto;
  background: #fff;
  box-sizing: border-box;
  padding: 5px;
  border-radius: 5px;
  box-shadow:0px 2px 5px #333333;
}
.suspension_container>p{
  text-align: left;
  width: 55px;
  height: 20px;
  box-sizing: border-box;
  padding-left: 5px;
  line-height: 20px;
  font-size:12px;
  font-family:PingFangSC-Regular;
  color:rgba(102,102,102,1);
  cursor:pointer;
}
.suspension_container>p:hover{
  background:rgba(239,242,253,1);
}
</style>