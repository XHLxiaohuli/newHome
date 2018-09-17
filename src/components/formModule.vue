<template>
  <div class="formModule_">
    <ul>
      <!-- 表格标题 -->
      <li :class="lineCalssSwitch(option)">
        <!-- 选项框 -->
        <div v-if="checkboxGroup" class="fromDiv optionsDialog">
          <div class="checkbox-group">
            <input type="checkbox" id="director" @click="checkBoxFun('director')"/>
            <label for="director"></label>
          </div>
        </div>
        <!-- 首行标题 -->
        <div class="fromDiv" v-for="(val,i) in formVal.title" :key="i"  :width="val.width">
          <span class="title_color">{{val.name}}</span>
        </div>
        <!-- 清楚浮动 -->
        <div style="clear: both;"></div>
      </li>
      <!-- 数据 -->
      <div :style="'width:100%;height:'+showHeight+'px;overflow: auto;'">
        <li :class="lineCalssSwitch(option)" v-for="(value,index) in formVal.value" :key="index">
          <!-- 选项框 -->
          <div v-if="checkboxGroup" class="fromDiv optionsDialog">
            <div class="checkbox-group checkbox-children">
              <input type="checkbox" :id="value.id" @click="judgeCheckBoxFun()"/>
              <label :for="value.id"></label>
            </div>
          </div>
          <!-- 数据单行数据循环 -->
          <div 
            v-for="(val,i) in formVal.title"
            :key="i"  
            :width="val.width"
            :class="singleCalssSwitch({ highlighted:formVal.title[i].highlighted , val:value[val.tag] })"
            v-html="valTypeFun({type:val.type , key:val.tag , id:value['id'] , val:value[val.tag]})">
          </div>
          <!-- 清楚浮动 -->
          <div style="clear: both;"></div>
        </li>
      </div>
    </ul>
    <div id="slotZY">
      <slot name="operation"></slot>
    </div>
  </div>
</template>
<script>
export default {
  props:[ "formVal","separation","bottomLine","separationBorder","checkboxGroup","showHeight" ],
  data() {
    return {
      // 复选框记录选中的id
      selectedIdArr:[],
      // 列表样式
      option:{
        separation:this.separation,
        bottomLine:this.bottomLine,
        separationBorder:this.separationBorder
      },
    }
  },
  watch:{
    formVal:{//深度监听，可监听到对象、数组的变化
      handler(newVal, oldVal){
        // 清空选项框
        this.deletecheckbox();
      },
      deep:true
    }
  },
  mounted(){
    // 设置宽度比例
    $('.fromDiv').each(function(){
      var num = $(this).attr('width');
      $(this).css({width:num+'%'});
    }); 
    // 赋值插槽
    $('.jieshouZY').html($('#slotZY').html());
    // 设置点击
    this.OPonclick();
  },

  updated(){
    // 设置宽度比例
    $('.fromDiv').each(function(){
      var num = $(this).attr('width');
      $(this).css({width:num+'%'});
    }); 
    // 赋值插槽
    $('.jieshouZY').html($('#slotZY').html());
    // 设置点击
    this.OPonclick();
  },
  methods:{
    // 单个数据样式设置
    singleCalssSwitch:function(obj={
      highlighted:'',
      val:''
    }){
      var basis = ' fromDiv';       //基础样式
      var highlig = ' highlighted';           //高亮词语样式
      if( 
        typeof(obj.val) == 'string' && 
        obj.highlighted && 
        obj.highlighted.indexOf(obj.val) > -1 
      ){  basis += highlig  };
      return  basis;
    },
    // 单行数据样式
    lineCalssSwitch:function(obj={
      separation:'',
      bottomLine:'',
      separationBorder:''
    }){
      var basis = ' fromLi_';                 //基础样式
      var separation = ' separation';         //行分离样式
      var bottomLine = ' bottomLine';         //下分隔线样式
      var separationBorder = ' separationBorder';  //边框加分离

      if(obj.separation){  basis += separation  };
      if(obj.bottomLine){  basis += bottomLine  };
      if(obj.separationBorder){ basis += separationBorder };

      return  basis;
    },
    // 复选框全选与全不选
    checkBoxFun:function(id){
      var bool_ = $('#'+id).prop("checked");
      if(bool_){
        $('.checkbox-children').each(function(){
          $(this).children('input').prop("checked", true);
        });
      }else{
        $('.checkbox-children').each(function(){
          $(this).children('input').prop("checked", false);
        });
      };
      this.judgeCheckBoxFun();
    },
    // 获取选中的行消息的id
    judgeCheckBoxFun:function(){
      var trueArr = [];
      var jishu = 0;
      $('.checkbox-children>input').each(function(){
        // 判断当前选项框是否选中
        var bool_ = $(this).prop("checked");
        if(bool_){
          trueArr.push($(this).attr('id'));
          jishu++;
        };
      });
      // 当点击单个选项全部选中时头部改为选中
      if(jishu == $('.checkbox-children>input').length){
        $('#director').prop("checked", true);
      };
      // 当点击单个选项不是全部选中并且头部选项状态为选中时改变状态
      if(jishu != $('.checkbox-children>input').length && $('#director').prop("checked")){
        $('#director').prop("checked", false);
      };
      // 赋值
      this.selectedIdArr = trueArr;
    },
    // 数据展示类型分配
    valTypeFun:function(obj={
      type:'',
      key:'',
      id:'',  
      val:''
    }){
      var srt = '';
      if(obj.type === 'string'){            // 文本数据
        srt = `<span class="val_color">${obj.val}</span>`;
      }else if(obj.type === 'operation'){   // 操作
        srt = `<div class="jieshouZY" data-id="${obj.id}"></div>`;
      }else if(obj.type === 'arry'){         // 对象数据
        srt = this.arrValTypeFun(obj.val,obj.key,obj.id);
      }else if(obj.type === 'onclick'){
        srt = `<span class="val_color highlighted OPonclick" data-id="${obj.id}" data-key="${obj.key}">${obj.val}</span>`;
      }

      return srt;
    },
    // 对象数据展示格式分配
    arrValTypeFun:function(arr,key,id){
      var str = '';
      var spanStr = '';
      var jishu = 0;

      // 循环数据
      for(var i=0; i<arr.length; i++){
        // 判断数据类型（图片类型或者文本类型）
        if(arr[i].belongs == 'image'){
          str += `<img class="fromImg_" src="${arr[i].url}"/>`
        }else{
          jishu++;
          if(arr[i].onclick){
            spanStr += `
            <div>
              <span class="val_color">${!arr[i].titleShow ? '':arr[i].belongs+':'}</span>
              <span class="val_color highlighted OPonclick" data-id="${id}" data-key="${arr[i].belongs}">${
                typeof(arr[i].val) !== 'object' ? arr[i].val:
                breakUp(arr[i].val)
              }</span>
            </div>`;
          }else{
            spanStr += `
            <div>
              <span class="val_color">${arr[i].belongs !== '' ? arr[i].belongs+':' : ''}</span>
              <span class="val_color">${
                typeof(arr[i].val) !== 'object' ? arr[i].val:
                breakUp(arr[i].val)
              }</span>
            </div>`;
          };
          if(jishu%4 == 0 || i == arr.length-1){  
            str += `<div style="margin-right:10px">  ${spanStr}  </div>`;
            spanStr = ''; 
          };
        }
      };

      function breakUp(val){
        var str = '';
        for(var i=0;i<val.length;i++){
          str += `<span style="margin-left:10px">${val[i].title !== '' ? val[i].title+':':''}</span><span>${val[i].val}</span>`
        };
        return str;
      };
      
      return str;
    },
    // 设置点击
    OPonclick:function(){
      var this_ = this;
      $('.OPonclick').unbind();
      $('.OPonclick').bind('click',function(){
        this_.$emit('formClickFun',{id:$(this).attr('data-id'),type:$(this).attr('data-key')});
      });
    },
    // 清空选项框
    deletecheckbox:function(){
      $('.checkbox-group').each(function(){
        $(this).children('input').prop("checked", false);
      });
      this.selectedIdArr=[];
    }

  }
}
</script>

<style lang='less'>
@import '../assets/less/common.less';
.formModule_,
.formModule_>ul{
  width: 100%;
  height: auto;
  text-align: left;
}
.fromLi_{
  width: 100%;
  height: auto;
  box-sizing: border-box;
  padding: 5px 0;
  background: #fff;
  display: flex;
  justify-content:center;
  align-items:Center;
}
.fromDiv{
  height: auto;
  padding: 5px;
  display: flex;
  justify-content:flex-start;
  align-items:Center;
  overflow: hidden;
}
.title_color{
  font-size: 14px;
  color:#474E5F
}
.val_color{
  font-size: 14px;
  line-height: 20px;
  color:#474E5F;
}
.fromImg_{
  width: 40px;
  height: 40px;
  border-radius: 3px;
  float: left;
  margin-right: 10px;
}
#slotZY{
  display: none;
}
// 设置高亮颜色
.highlighted{
  color: @mainColor!important;
}
// 分离
.separation{
  margin-bottom: 5px!important;
}
// 下分隔线
.bottomLine{
  border-bottom:1px solid rgba(221,221,221,1)!important;
}
.separationBorder{
  margin-bottom: 5px!important;
  border: 1px solid #eee!important;
}
// 选项框样式
.optionsDialog{
  width: 25px;
}
.OPonclick{
  cursor:pointer;
}
</style>
