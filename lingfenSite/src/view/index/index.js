require('./index.less');
$(()=>{
  "use strict";
  require('../../public-resource/components/footer_nav/footer_nav');
  const swiper = require('../../public-resource/scripts/components/m_carousel');
  swiper('.swiper_container');
});