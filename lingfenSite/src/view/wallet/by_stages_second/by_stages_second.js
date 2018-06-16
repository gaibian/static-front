require('./by_stages_second.less');


$(()=>{
  "use strict";
  let agreeInput = document.querySelector('.agree_input');
  if(agreeInput.className.indexOf('active') !== -1){
    agreeInput.checked = true;
  }else{
    agreeInput.checked = false;
  }
  agreeInput.addEventListener('touchstart',()=>{
    if(agreeInput.className.indexOf('active') === -1){
      agreeInput.className = `${agreeInput.className} active`;
      agreeInput.checked = true;
    }else{
      agreeInput.className = agreeInput.className.replace(' active','');
      agreeInput.checked = false;
    }
  },false)
});