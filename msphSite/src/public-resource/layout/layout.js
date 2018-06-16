
/*构建前端模板系统的js*/
module.exports = (opt,templates)=>{
  "use strict";
  /*导入常用的模板*/
  const layout = require('../components/layout.ejs');
  const footerNav = require('../components/footer_nav/footer_nav.ejs');
  const mCarousel = require('../components/m_carousel/m_carousel.ejs');

  const resultModule = {
    layout:layout(opt),
    footerNav:footerNav(),
    mCarousel:mCarousel(opt),
  };
  return Object.assign({},resultModule,templates);
};