
/*
* off => 0
* warn => 1
* error => 2
* */

module.exports = {
  extends:'eslint:recommended',
  env:{
    node:true,
  },
  rules:{
    'no-console':0,  //关闭console
    'indent':['error',2],  //换行字符空2格
    'quotes':['error','single'],
    'no-alert':0, //禁止使用alert confirm prompt
    'no-array-constructor':2, //禁止使用数组构造器
    'no-bitwise':0, //禁止使用按位运算符
    'no-caller':1, //禁止使用arguments.caller 或 arguments.callee
    'no-const-assign':2, //禁止修改const声明的变量
    'prefer-const':2,  //首选const
    'padded-blocks':0,  //块语句内行首尾是否要空行
    'vars-on-top':2,  //var必须放在作用域顶部
    'valid-typeof':2,  //必须使用合法的typeof的值
    'strict':2,  //使用严格模式
    'space-in-parens':[0,"never"],  //小括号里面要不要有空格
  }
};