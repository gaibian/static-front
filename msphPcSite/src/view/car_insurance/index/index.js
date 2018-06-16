require('../../../public-resource/less/init.less');
require('./index.less');

$(()=>{
  "use strict";
  require('../../../public-resource/components/page_top_nav/page_top_nav');
  require('../../../public-resource/components/page_nav/page_nav');
  require('../../../public-resource/components/footer_nav/footer_nav');
  require('../../../public-resource/components/side_contact/side_contact');
  const hoverPopup = require('../../../public-resource/scripts/components/hover_popup');
  hoverPopup('.hover_box');

  const input = require('../../../public-resource/scripts/components/input_check');
  input('.state_box');

  const tabContent = require('../../../public-resource/scripts/components/tab_content');
  tabContent.init('.tab_box');

  /*导入城市选择数据*/
  const citySelect = require('../../../public-resource/scripts/components/city_select');
  citySelect('.city_select');



  /*车险保障*/
  let aTextBox = $('.a_text_box');
  let carGuaranteeDom = $('.car_guarantee_details_box');
  aTextBox.each((index)=>{
    let $this = aTextBox.eq(index);
    $this.on('mouseover',()=>{
      aTextBox.find('.explan_text_box').removeClass('active');
      $this.find('.explan_text_box').addClass('active');
    });
    $this.on('mouseleave',()=>{
      aTextBox.find('.explan_text_box').removeClass('active');
    })
  });

});