<template>
  <div class="permissions" :id="permisId">
    <!-- 主单选框 -->
    <div class="fromDiv per_fromDiv">
      <div class="checkbox-group">
        <input type="checkbox" :id="permisId+'box'" class="maincheckbox"/>
        <label :for="permisId+'box'"></label>
      </div>
      <p>全选</p>
    </div>
    <div class="checkbox_table">
      <div class="checkbox_hang" v-for="(val,index) in permisValue" :key="index" :style="index>0&&'border-top:none;'">
        <div class="checkbox_zu">
          <div class="fromDiv per_fromDiv martop">
            <div class="checkbox-group">
              <input type="checkbox" :id="val.groupsId" class="teamClass" :data-id="val.groupsId"/>
              <label :for="val.groupsId"></label>
            </div>
            <p>{{val.groupsName}}</p>
          </div>
        </div>
        <div class="checkbox_zi">
          <div class="fromDiv per_fromDiv martop_z" v-for="(v,i) in val.functions || val.menus" :key="i">
            <div class="checkbox-group">
              <input type="checkbox" :id="v.id" class="functionClass" :data-id="v.id" :checked="v.selected"/>
              <label :for="v.id"></label>
            </div>
            <p>{{v.description || v.name}}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props:['permisId','permisVal'],
  data() {
    return {
      permisValue:this.permisVal
    }
  },
  components: {  },
  watch:{
    permisVal:{
      handler(newVal, oldVal){
        this.permisValue = newVal;
        this.deletecheckbox();
        if(newVal && newVal.length>0){
          this.echoFun();
        }
        this.checkboxClick();
      },
      deep:true
    }
  },
  mounted() {
    this.deletecheckbox();
    this.checkboxClick();
    if(this.permisVal && this.permisVal.length>0){
      this.echoFun();
    }
  },
  updated(){
    this.deletecheckbox();
    this.checkboxClick();
    if(this.permisVal && this.permisVal.length>0){
      this.echoFun();
    }
  },
  methods:{
    // 初始设置选项框点击事件
    checkboxClick:function(){
      // 点击全选框
      $('.maincheckbox').bind('click',function(){
        var state   = $(this).prop("checked");
        if(state){
          $('.checkbox-group  input').each(function(){
            $(this).prop("checked", true);
          });
        }else{
          $('.checkbox-group  input').each(function(){
            $(this).prop("checked", false);
          });
        };
      });

      // 点击小组选项框
      $('.teamClass').bind('click',function(){
        var state   = $(this).prop("checked");
        if(state){
          $(this).closest('.checkbox_hang').find('.functionClass').each(function(){
            $(this).prop("checked", true);
          });
        }else{
          $(this).closest('.checkbox_hang').find('.functionClass').each(function(){
            $(this).prop("checked", false);
          });
        };

        // 判断全选框是否勾选
        var bool_0 = true;
        $(this).closest('.checkbox_table').find('.teamClass').each(function(){
          var state = $(this).prop("checked");
          if(!state){bool_0 = false};
        });
        if(bool_0){
          $('.maincheckbox').eq(0).prop("checked", true);
        }else{
          $('.maincheckbox').eq(0).prop("checked", false);
        }
      });

      // 点击功能选项
      $('.functionClass').bind('click',function(){
        // 判断组是否自动勾选选
        var bool_ = true;
        $(this).closest('.checkbox_zi').find('.functionClass').each(function(){
          var state = $(this).prop("checked");
          if(!state){bool_ = false};
        });

        if(bool_){
          $(this).closest('.checkbox_hang').find('.teamClass').each(function(){$(this).prop("checked", true);});
        }else{
          $(this).closest('.checkbox_hang').find('.teamClass').each(function(){$(this).prop("checked", false);});
        };

        // 判断全选框是否勾选
        var bool_0 = true;
        $(this).closest('.checkbox_table').find('.teamClass').each(function(){
          var state = $(this).prop("checked");
          if(!state){bool_0 = false};
        });
        if(bool_0){
          $('.maincheckbox').eq(0).prop("checked", true);
        }else{
          $('.maincheckbox').eq(0).prop("checked", false);
        }
      });
    },
    // 获取所有选中的功能
    getAllFunid:function(){
      var this_ = this;
      var arr = [];
      $('#'+this_.permisId).find('.functionClass').each(function(){
        var state   = $(this).prop("checked");
        if(state){arr.push($(this).attr('data-id'))};
      });
      return arr;
    },
    // 回显函数
    echoFun:function(){
      $('.checkbox_hang').each(function(){
        var bool_ = true;
        $(this).find('.functionClass').each(function(){
          var state   = $(this).prop("checked");
          if(!state){  bool_ = false; };
        });
        if(bool_){
          $(this).find('.teamClass').prop("checked",true);
        };
      });

      $('.checkbox_table').each(function(){
        var bool_ = true;
        $(this).find('.teamClass').each(function(){
          var state   = $(this).prop("checked");
          if(!state){  bool_ = false; };
        });
        if(bool_){
          $('.maincheckbox').prop("checked",true);
        };
      });
    },
    // 清空全选与组选
    deletecheckbox:function(){
      $('.maincheckbox').each(function(){
        $(this).prop("checked", false);
      });
      $('.teamClass').each(function(){
        $(this).prop("checked", false);
      });
    },


  }
}
</script>

<style lang='less'>
@import '../assets/less/common.less';
.permissions{
  width: 100%;
  height: 100%;
}
.per_fromDiv>p{
  font-size:12px;
  font-family:PingFangSC-Regular;
  color:rgba(51,51,51,1);
}
.checkbox_table{
  width: 100%;
  height: 500px;
  overflow: auto;
}
.checkbox_hang{
  width:100%;
  height: auto;
  box-sizing: border-box;
  border:1px solid rgba(221,221,221,1);
  display: flex;
  flex-direction:row;
  justify-content:flex-start;
}
.checkbox_zu{
  width: 120px;
  height: 100%;
  text-align: left;
  box-sizing: border-box;
  padding:0 15px 15px 15px;
}
.checkbox_zi{
  width:1000px;
  height: auto;
  display: flex;
  flex-direction:row;
  flex-wrap:wrap;
  justify-content:flex-start;
  padding:0 15px 15px 15px;
  border-left:1px solid rgba(221,221,221,1);
}
.martop,
.martop_z{
  margin-top: 15px;
}
.martop_z{
  width:120px;
}
.fromDiv{
  height: auto;
  padding: 5px;
  display: flex;
  justify-content:flex-start;
  align-items:Center;
}
</style>
