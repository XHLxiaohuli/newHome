<template>
  <div class="exportData" style="width:60px;height:32px;">
    <textarea id="exportDataVal" style="position: fixed;top: 3000px;left: 3000px;"></textarea>
    <p id="downloadify" style="position: relative;width:60px;height:32px;">
      <object 
        type="application/x-shockwave-flash" 
        id=""
        name="" 
        data="./static/media/downloadify.swf" 
        width="60" height="30" 
        style="visibility: visible;">
        <param name="allowScriptAccess" value="always">
        <param name="wmode" value="transparent">
        <param name="flashvars" value="queue_name=downloadify_1533009271315&amp;width=60&amp;height=30&amp;downloadImage=./static/images/download.png">
      </object>
    </p>
  </div>
</template>

<script>
export default {
  props:['iframeData'],
  data() {
    return {}
  },
  mounted() {
    this.transferFun();
  },
  methods:{
    transferFun:function(){
      var this_ = this; 
      Downloadify.create('downloadify',{
          filename: function(){
            return 'new_file.csv';
          },
          data: function(){
            return "\ufeff" + this_.iframeData;
          },
          onComplete: function(){
            alert('数据导出成功!');
          },
          onCancel: function(){
            console.log('数据导出关闭');
          },
          onError: function(){
            alert('数据导出失败!');
          },
          swf: './static/media/downloadify.swf',
          downloadImage: './static/images/download.png', 
          width: 60,
          height: 32,
          transparent: true,
          append: true
      });
      setTimeout(function(){
        $("#downloadify").children('object').css({position:'absolute',left:0,top:0});
      });
    },

  }
}
</script>
