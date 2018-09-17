<template>
  <div class="grouping_">
    <div v-for="(value,index) in unesList" :key="index">
      <!-- 分组名 -->
      <div class="group_whole" @click="groupSwitchFun(index)" v-if="groupNameShow">
        {{value.groupsName}}{{"("+value.friends.length+")"}}
      </div>
      <!-- 组员列 -->
      <div v-if="groupShow == index || !groupNameShow">
        <!-- 单个好友 -->
        <div 
          class="members_whole" v-for="(val,i) in value.friends" 
          :key="i" 
          :class="unesId == val.id ? 'selected_' : ''"
          v-if="val.nickname.indexOf(zhengze) > -1 || zhengze==''"
          @click="groupingC_Fun(val)">
          <img :src="[val.headImgUrl][0]" alt="">
          <p>{{val.nickname}}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props:['unesList','unesId','groupNameShow','zhengze'],
  data() {
    return {
      groupShow:-1
    }
  },
  methods:{
    // 打开和收起分组
    groupSwitchFun:function(e){
      if(this.groupShow != e){
        this.groupShow = e;
      }else{
        this.groupShow = -1;
      }
    },
    // 切换客户id(传递给父级)
    groupingC_Fun:function(data){
      this.$emit('unesIdSwitch2',data);
    } 

  }
}
</script>

<style>
.grouping_{
  width: 100%;
  height: auto;
  background: rgba(236,237,238,1);
}
.group_whole{
  width: 100%;
  height: 50px;
  box-sizing: border-box;
  overflow: hidden;
  padding: 10px 18px 9px;
  border-bottom: 1px solid #fff;
  cursor: pointer;
  position: relative;
  text-align: left;
  line-height: 30px;
  color: rgb(39, 35, 35);
  font-size: 14px;
}
.members_whole{
  width: 100%;
  height: 50px;
  box-sizing: border-box;
  overflow: hidden;
  padding: 10px 18px 9px;
  text-align: left;
  line-height: 30px;
  color: #666;
  font-size: 14px;
  /* background: #626872; */
  background: #fff;
}
.members_whole:hover{
  background:rgba(236,237,238,1);
}
.selected_{
  background: rgba(236,237,238,1);
}
.members_whole>img{
  float: left;
  height: 30px;
  width: auto;
}
.members_whole>p{
  /* float:left; */
  margin-left: 40px;
  /* display: inline-block; */
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  line-height: 30px;
}
</style>
