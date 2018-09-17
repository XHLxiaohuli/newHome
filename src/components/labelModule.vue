<template>
  <div class="labelModule_">
    <!-- 标签框 -->
    <div class="label_div" v-for="(val,i) in conversion" :key="i">
      <div contenteditable='false' class="simulation" :data-id="val.id">{{val.text}}</div>
      <img src="../assets/img/删除.png" class="del_img">
    </div>
    <!-- 添加图标按钮 -->
    <img src="../assets/img/添加.png" class="label_img" @click="add">
    <!-- 清除浮动 -->
    <div style="clear: both;"></div>
  </div>
</template>

<script>
export default {
  props:[ "labelVal" ],
  data() {
    return {
      conversion:this.labelVal,
      old:this.labelVal,
      // 单独功能与完整功能开关
      bool_:false,
      // 修改类型
      type:-1
    }
  },
  watch:{
    labelVal:{//深度监听，可监听到对象、数组的变化
      handler(newVal, oldVal){
        this.conversion=newVal;
        this.old=newVal;
      },
      deep:true
    }
  },
  methods:{
    // 修改
    modify:function(){
      $('.simulation').attr('contenteditable',true);
      $('.label_img').css({display:'block'});
      $('.del_img').css({display:'block'});
      // 设置删除事件
      this.delete_();
      this.bool_=true;
    },
    // 保存
    save:function(){
      var this_ = this;
      this.bool_=false;
      $('.simulation').attr('contenteditable',false);
      $('.del_img').css({display:'none'});
      $('.label_img').css({display:'none'});

      //数组重新保存
      var newArr=[];
      $('.simulation').each(function(){
          if($(this).html()===''){
              $(this).parents('.label_div').remove();
          }else{
             newArr.push(  $(this).html()  );
          }
      });

      // 返回最新的标签数据
      return  newArr;
    },
    // 添加
    add:function(){
      // 在添加图片前面追加输入框
      $('.label_img').before(`
        <div class="label_div">
          <div contenteditable='true' class="simulation newadd"></div>
          <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAAXZJREFUOBGlU71qAkEQ/vY4opDKYCccWIkkEa004gvYpLTzwNY30Cak0TfwASytQp5B/KmE/CBWgmAn6QJqkc1+u+xlDQRO8sHdzs7MN7MzOyvwC3IwuMd2+4DN5hq73YU2p9NHBME7MplH0W4/uxRhN3I4vMRyOcV8fgMpI72161UIiXL5Dfn8nQjDT+q0oyZPJhusVlcnhL82udwHqtWAQXztw8xxySTQN5WaKqng6Zp5bItsFmg2gUTCaowchgBtFopDrq8b5tZcqwGtFlAsAt2uce/1gFIJqjfAem105Khm+7rbNirX0ciQSSCRoLxYGJvRmL+6KSHr9S/s97qZkY3Ht1mpJJmnORwiFy0kk9I71Zy/88AhceFmZ2Z+thy3seQorqcnzA3QaPzUzGPzs0Foc6Gm0+d4QoinaPrGY+PCZtqaGYRka6MHp5KjTVl2Oi+YzW4px0al8ir6/YJpopptcDzjgr7kKETX96/H5CY+9zl/Ay/Wn2OLDtC0AAAAAElFTkSuQmCC" class="del_img">
        </div>
      `);
      // 设置事件
      if(this.bool_){
        this.modify();
      };
    },
    // 删除
    delete_:function(){
      $('.del_img').bind('click',function(){
        $(this).parents('.label_div').remove();
      });
    },
    // 单独启动增加功能
    separateAdd:function(){
      if(this.type==-1){
        this.type=0;
        $('.label_img').css({display:'block'});
      }else{
        alert('请先保存当前操作');
      };
    },
    // 单独启动修改功能
    separateModify:function(){
      if(this.type==-1){
        this.type=1;
        $('.simulation').attr('contenteditable',true);
      }else{
        alert('请先保存当前操作');
      };
    },
    // 单独启动删除功能
    separateDel:function(){
      if(this.type==-1){
        this.type=2;
        $('.del_img').css({display:'block'});
        // 设置删除事件
        this.delete_();
      }else{
        alert('请先保存当前操作');
      };
    },
    // 获取有操作的标签
    getNewVal:function(){
      var this_ = this;
      var oldTextArr = [];
      var newTextArr = [];
      var newVal=[];

      this_.bool_=false;
      $('.simulation').attr('contenteditable',false);
      $('.del_img').css({display:'none'});
      $('.label_img').css({display:'none'});

      if(this_.old.length!=0){
        for(var i=0;i<this_.old.length;i++){
          oldTextArr.push(this_.old[i].text);
        };
      };
      
      $('.simulation').each(function(){
        var newText = $(this).text();
        newTextArr.push(newText);
        if(this_.type == 0 || this_.type == 1){
          if(oldTextArr.indexOf(newText) < 0){
            newVal.push({
              text:newText,
              id:$(this).attr('data-id')
            });
          };
        }
      });

      // 删除
      if(this_.type == 2){
        for(var i=0;i<oldTextArr.length;i++){
          if(newTextArr.indexOf(oldTextArr[i]) >= 0){
            this_.old.splice(i,1);
            oldTextArr.splice(i,1);
            i=i-1;
          }
        };
        newVal = this_.old;
      };

      var pass = {
        task: this_.type==0?'增加':
              this_.type==1?'修改':
              this_.type==2?'删除':'无操作',
        val:newVal
      };

      this_.type = -1;

      return pass;
    },




  }
}
</script>

<style lang='less'>
@import '../assets/less/common.less';
.labelModule_{
  width: 100%;
  height: auto;
}
.label_div{
  width: auto;
  height: 32px;
  float: left;
  margin-right: 35px;
  margin-bottom: 25px;
  border:2px solid rgba(235,237,248,1);
  position: relative;
  display: inline-block;
}
.label_img{
  width: auto;
  height: 32px;
  float: left;
  margin-left: 35px;
  margin-bottom: 25px;
  display: none;
}
.simulation{
  width: auto;
  min-width: 100px;
  height: 100%;
  box-sizing: border-box;
  padding: 0 8px;
  line-height: 36px;
}
.del_img{
  position: absolute;
  right: 0;
  top: 0;
  transform: translate(50%, -50%);
  z-index: 100;
  display: none;
}
</style>
