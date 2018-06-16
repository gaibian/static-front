require('./informing.less');
window.mp = require('../../../public-resource/scripts/components/mp');

$(()=>{
  "use strict";
  let informingContentText = $('.informing_content_text');
  let signPopup = $('.sign_popup');
  let winHeight = $(window).height();
  informingContentText.css({
    'height':(winHeight - signPopup.height()) + 'px'
  })
});