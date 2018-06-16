require('../../../public-resource/less/init.less');
require('./apply_loan.less');
window.verfiy = require('../../../public-resource/scripts/components/verify');
$(()=>{
  "use strict";
  require('../../../public-resource/components/page_top_nav/page_top_nav');
  require('../../../public-resource/components/page_nav/page_nav');
  require('../../../public-resource/components/footer_nav/footer_nav');
  require('../../../public-resource/components/content_header/content_header');
  require('../../../public-resource/components/side_contact/side_contact');
  /*图片懒加载*/
  const Exposure = require('../../../public-resource/scripts/components/lazy.js');
  let $lazy = document.getElementsByClassName('lazy');

  Exposure.one($lazy,function(){
    "use strict";
    let srcValue = this.getAttribute('data-src');
    this.setAttribute('src',srcValue);
  });
});