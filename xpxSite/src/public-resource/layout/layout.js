
/*构建前端模板系统的js*/
module.exports = (opt,templates)=>{
  "use strict";
  /*导入常用的模板*/
  const layout = require('../components/layout.ejs');

  const resultModule = {
    layout:layout(opt),
  };
  return Object.assign({},resultModule,templates);
};