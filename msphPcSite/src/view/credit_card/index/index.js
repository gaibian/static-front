require('../../../public-resource/less/init.less');
require('./index.less');

$(()=>{
  "use strict";
  require('../../../public-resource/components/page_top_nav/page_top_nav');
  require('../../../public-resource/components/page_nav/page_nav');
  require('../../../public-resource/components/footer_nav/footer_nav');
  require('../../../public-resource/components/content_header/content_header');
  require('../../../public-resource/components/side_contact/side_contact');
  require('../../../public-resource/components/list_paging/list_paging');
  require('../../../public-resource/components/nav_list/nav_list');

  const hoverPopup = require('../../../public-resource/scripts/components/hover_popup');
  hoverPopup('.hover_box');

  /*图片懒加载*/
  const Exposure = require('../../../public-resource/scripts/components/lazy.js');
  let $lazy = document.getElementsByClassName('lazy');

  Exposure.one($lazy,function(){
    "use strict";
    let srcValue = this.getAttribute('data-src');
    this.setAttribute('src',srcValue);
  });

  /*轮播*/
  const carousel = require('../../../public-resource/scripts/components/carousel');
  carousel('.carousel');
});