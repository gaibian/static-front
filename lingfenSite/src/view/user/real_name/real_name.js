require('./real_name.less');

window.verify = require('../../../public-resource/scripts/components/verify');

$(()=>{
  "use strict";
  const deleteInputBtn = require('../../../public-resource/scripts/components/delete_input_val');
  deleteInputBtn('.input_box');
});