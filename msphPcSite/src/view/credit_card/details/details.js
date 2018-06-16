require('../../../public-resource/less/init.less');
require('./details.less');

$(()=>{
  "use strict";
  require('../../../public-resource/components/page_top_nav/page_top_nav');
  require('../../../public-resource/components/page_nav/page_nav');
  require('../../../public-resource/components/footer_nav/footer_nav');
  require('../../../public-resource/components/content_header/content_header');
  require('../../../public-resource/components/side_contact/side_contact');

  const tabContent = require('../../../public-resource/scripts/components/tab_content');
  tabContent.init('.tab_box');

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

  const enlargeImg = (()=>{
    class imgFun{
      constructor(dom){
        this.dom = $(dom);
        this.bigImg = this.dom.find('.img_box img');
        this.ul = this.dom.find('.carousel_ul');
        this.li = this.ul.find('>li');
        this.bind();
      }
      bind(){
        this.li.each((index)=>{
          let $this = this.li.eq(index);
          $this.on('click',()=>{
            let dataImg = $this.find('img').attr('data-img');
            this.bigImg.attr('src',dataImg);
          })
        })
      }
    }
    return (el)=>{
      new imgFun(el);
    }
  })();

  enlargeImg('.js_carousel')
})