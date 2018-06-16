require('../../public-resource/less/init.less');
require('./index.less');

$(()=>{
  "use strict";
  require('../../public-resource/components/page_top_nav/page_top_nav');
  require('../../public-resource/components/page_nav/page_nav');
  require('../../public-resource/components/footer_nav/footer_nav');
  require('../../public-resource/components/content_header/content_header');
  require('../../public-resource/components/side_contact/side_contact');
  /*图片懒加载*/
  const Exposure = require('../../public-resource/scripts/components/lazy.js');
  let $lazy = document.getElementsByClassName('lazy');
  Exposure.one($lazy,function(){
    "use strict";
    let srcValue = this.getAttribute('data-src');
    this.setAttribute('src',srcValue);
  });
  const input = require('../../public-resource/scripts/components/input_check');
  input('.state_box');

  const tabContent = require('../../public-resource/scripts/components/tab_content');
  tabContent.init('.tab_box');

  const carousel = require('../../public-resource/scripts/components/carousel');
  carousel('.carousel');

  /*导入城市选择数据*/
  const citySelect = require('../../public-resource/scripts/components/city_select');
  citySelect('.city_select');

  const test = require('../../public-resource/scripts/components/test');
  test();

  // MYAPP.namespace('MYAPP.utilities.array');
  // MYAPP.utilities.array = (function(){
  //   "use strict";
  //   return {
  //     inArray:function(needle,haystack){
  //       console.log('inArray');
  //     },
  //     isArray:function(a){
  //       console.log('isArray');
  //     }
  //   }
  // })();
  //
  // console.log(MYAPP);
  //命名空间模式
  // let MYAPP = MYAPP || {};
  // MYAPP.namespace = function(str){
  //
  // }
});