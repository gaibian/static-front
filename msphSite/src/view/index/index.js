require('./index.less');

const mCarousel = require('../../public-resource/components/m_carousel/m_carousel.js');
const lazy = require('../../public-resource/scripts/components/lazy.js');
const tabSwitch = require('../../public-resource/scripts/components/tab_switch.js');
$(()=>{
  "use strict";
  mCarousel('.carousel_box');
  lazy.one('.lazy',function(){
    let srcValue = this.getAttribute('data-src');
    this.setAttribute('src',srcValue);
  });
  tabSwitch('.tab_box');
});
