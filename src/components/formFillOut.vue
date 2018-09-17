<template>
  <div class="formFillOut">
    <div class="formFillOut_c" v-for="(v,i) in formFillOutVal" :key="i" :data-type="v.type">
      <!-- title -->
      <p>{{v.title}}</p>
      <!-- 输入框 -->
      <div class="formFillOut_d" v-if="v.type=='input'">
        <input type="text" :placeholder="v.prompt">
      </div>
      <!-- 多行文本框 -->
      <div class="formFillOut_d" v-if="v.type=='textarea'">
        <textarea maxlength="20" :placeholder="v.prompt"></textarea>
      </div>
      <!-- 下拉选项框 -->
      <div class="formFillOut_d" v-if="v.type=='select'">
        <select>
          <option value="">{{v.prompt}}</option>
          <option v-for="(val,index) in v.selectValArr" :key="index" :value="val.val">{{val.text}}</option>
        </select>
      </div>
      <!-- 特殊下拉框 -->
      <div class="formFillOut_d" style="height:45px;" v-if="v.type=='specialSelect'">
        <multiSelect
          :selectedArr="v.selectedArr"
          :screeningArr="v.screeningArr"
          ref="multiSelect_M"
        />
      </div>
      <!-- 单选框 -->
      <div class="formFillOut_d" style="width:320px;height:45px;display: inline-block;" v-if="v.type=='radio'">
        <div class="female" style="float:left;margin-top:12.5px;margin-right:30px;" v-for="(val,index) in v.radioVal" :key="index">
            <input type="radio" :id="val.id" :name="v.radioId" :value="val.val"/>
            <label :for="val.id">{{val.text}}</label>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// 下拉多选组件
import multiSelect from '@/components/multiSelect'
export default {
  data() {
    return {
      // 数据结构
      formFillOutVal:[
        {
          title:'输入框',
          type:'input',
          prompt:'提示消息',
        },
        {
          title:'多行输入框',
          type:'textarea',
          prompt:'提示消息',
        },
        {
          title:'下拉选项框',
          type:'select',
          prompt:'提示消息',
          selectValArr:[
            {
              text:'hehe',
              val:'1'
            }
          ]
        },
        {
          title:'特殊下拉选项框',
          type:'specialSelect',
          selectedArr:[11,44],
          screeningArr:[11,22,33,44,55,66],
        },
        {
          title:'单选框',
          type:'radio',
          radioId:'radioId',
          radioVal:[
            {
              id:'a1',
              text:'是',
              val:'1'
            },
            {
              id:'a2',
              text:'否',
              val:'0'
            },
            {
              id:'a3',
              text:'不确定',
              val:'2'
            }
          ]
        }
      ]
    }
  },
  components: { multiSelect },
  methods:{
    obtainValFun:function(){
      var arrVal= [];
      $('.formFillOut_c').each(function(){
        var p_text= $(this).children('p').text();
        var type= $(this).attr('data-type');
        var obj={};  obj['mark']=p_text;

        if(type=='input'){                    //获取输入框数据
          var inputVal=$(this).find('input').val();
          obj['val']=inputVal;
        }else if(type=='textarea'){           //获取多行文本框数据
          var textareaVal=$(this).find('textarea').val();
          obj['val']=textareaVal;
        }else if(type=='select'){             //获取下拉选项框数据
          var selectVal=$(this).find('select').val();
          obj['val']=selectVal;
        }else if(type=='specialSelect'){      //获取特殊下拉选项框数据
          obj['val']=$(this).find('.multiSelect').attr('data-val').split('`/`');
        }else if(type=='radio'){              //获取单选框数据
          obj['val']=$(this).find('input:radio:checked').val();
        };
        arrVal.push(obj);
      });
      console.log(arrVal);
      return arrVal;
    },

  }
}
</script>

<style lang='less'>
@import '../assets/less/common.less';
.formFillOut{
  width: 100%;
  height: auto;
}
.formFillOut_c{
  margin-bottom: 25px;
}
.formFillOut_c>p{
  width: 150px;
  height: 45px;
  line-height: 45px;
  float: left;
  text-align: right;
  font-size:16px;
  font-family:PingFangSC-Regular;
  color:rgba(51,51,51,1);
}
.formFillOut_d>input,
.formFillOut_d>select{
  width:320px;
  height:45px;
  box-sizing: border-box;
  background:rgba(255,255,255,1);
  border-radius:3px;
  border:1px solid rgba(236,236,248,1);
  font-size:12px;
  font-family:PingFangSC-Regular;
  color:#666666;
  text-indent:10px;
  outline:none;
  background: #fff;
}
.formFillOut_d>textarea{
  width:320px;
  height:100px;
  box-sizing: border-box;
  padding: 10px;
  border-radius:4px;
  border:1px solid rgba(236,236,248,1);
  resize: none;
  outline: none;
  font-size:12px;
  font-family:PingFangSC-Regular;
  color:#666666;
}
.formFillOut_d>select>option{
  height: 50px;
  
}
input[type="radio"] + label::before {
    content: "\a0"; /*不换行空格*/
    display: inline-block;
    vertical-align: middle;
    font-size: 21px;
    width: 1em;
    height: 1em;
    margin-right: .4em;
    border-radius: 50%;
    border: 1px solid @mainColor;
    text-indent: .15em;
    line-height: 1; 
    box-sizing: border-box;
}
input[type="radio"]:checked + label::before {
    background-color: @mainColor;
    background-clip: content-box;
    padding: .2em;
    box-sizing: border-box;
}
input[type="radio"] {
  position: absolute;
  clip: rect(0, 0, 0, 0);
}
.formFillOut_d label{
  font-size: 16px;
}
</style>
