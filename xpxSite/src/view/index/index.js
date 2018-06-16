require('./index.less');


const addressPicker = require('../../public-resource/components/address_picker/address_picker.js');
window.onload = ()=>{
  "use strict";
  new addressPicker('.address_picker',(data)=>{
      //console.log(data);
  });
};

