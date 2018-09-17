<template>
  <div id="app">
    <router-view/>
  </div>
</template>
<script>
export default {name: 'App'}
</script>
<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  position: relative;
  width: 100%;
  height: 100%;
  min-width: 1280px;
  max-width: 1920px;
  min-height: 500px;
}
/*设置滚动条*/
::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}
::-webkit-scrollbar-thumb {
  border-radius: 3px;
  -moz-border-radius: 3px;
  -webkit-border-radius: 3px;
  background-color: rgba(180,180,180,.1);
}
::-webkit-scrollbar-track {
  background-color: transparent;
}
/*多选框纯CSS写法*/
.checkbox-group input{display:none;opacity:1;}
.checkbox-group input[type=checkbox]+label, 
.checkbox-group input[type=radio]+label {
    line-height: 1;
    position: relative;
    display: -webkit-box;
    display: -webkit-flex;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-align: center;
    -webkit-align-items: center;
    -ms-flex-align: center;
    align-items: center;
    margin:2px;
}
.checkbox-group input[type=checkbox]+label:before, 
.checkbox-group input[type=radio]+label:before {
    line-height: 20px;
    display: inline-block;
    width: 18px;
    height: 18px;
    content: '';
    color: #fff;
    border: 0.01rem solid #dce4e6;
    background-color: #f3f6f8;
    border-radius: 3px;
}
.checkbox-group input[type=checkbox]:checked+label:before,
.checkbox-group input[type=radio]:checked+label:before{
    content:'\2713';
    color:#fff;
    background-color: #0aa1ed;
    border-radius: 3px;
    font-size:16px;
    text-align: center;
    border-color: #0aa1ed;
}
/* // 向上三角 */
.up-triangle{
width:0px;
height:0px;
border-bottom:6px solid #aaa;
border-left:3px solid transparent;
border-right:3px solid transparent;
}
/* // 向下三角 */
.down-triangle{
width:0px;
height:0px;
border-top:6px solid #aaa;
border-left:3px solid transparent;
border-right:3px solid transparent; 
}
/* // 向左三角 */
.left-triangle{
width:0px;
height:0px;
border-right:6px solid #aaa;
border-top:3px solid transparent;
border-bottom:3px solid transparent; 
}
/* // 向右三角 */
.right-triangle{
width:0px;
height:0px;
border-left:6px solid #aaa;
border-top:3px solid transparent;
border-bottom:3px solid transparent; 
}

</style>
