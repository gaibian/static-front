
/*构建前端模板系统的js*/
module.exports = (opt,templates)=>{
  "use strict";
  /*导入常用的模板*/
  let layout = require('../components/layout.ejs');
  let addressPicker = require('../components/address_picker.ejs');
  const resultModule = {
    layout:layout(opt),
    addressPicker:addressPicker(opt),
  };
  return Object.assign({},resultModule,templates);
};