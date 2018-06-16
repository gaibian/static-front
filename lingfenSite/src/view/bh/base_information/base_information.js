require('./base_information.less');
window.verify = require('../../../public-resource/scripts/components/verify');
window.picUpLoad = require('../../../public-resource/scripts/components/pic_upload');
$(()=>{
  "use strict";
  const switchBtn = require('../../../public-resource/components/switch_btn/switch_btn');
  switchBtn('.switch_container',(This,status)=>{
    let parentDom = This.parentNode;
    let netDom = parentDom.nextSibling.nextSibling;
    if(status){
      netDom.style.display = 'block';
    }else{
      netDom.style.display = 'none';
    }
  });

  let choiceUploadDom = document.querySelectorAll('.choice_upload_box');

  let shoeObj = {};  //定义发布者
  shoeObj.list = []; //缓存列表 存放订阅者回调函数

  shoeObj.listen = function(fn){
    shoeObj.list.push(fn);  //订阅消息添加到缓存列表
  };

  shoeObj.trigger = function(){
    for(let i=0,fn;fn = this.list[i++];){
      fn.apply(this,arguments);
    }
  }

  // 小红订阅如下消息
  shoeObj.listen(function(color,size){
    console.log("颜色是："+color);
    console.log("尺码是："+size);
  });

// 小花订阅如下消息
  shoeObj.listen(function(color,size){
    console.log("再次打印颜色是："+color);
    console.log("再次打印尺码是："+size);
  });

  console.log(shoeObj.list);
  //shoeObj.trigger("红色",40);
  shoeObj.trigger("黑色",42);




});