require('../../../public-resource/less/init.less');
require('./regular_financ.less');

$(()=>{
  "use strict";
  require('../../../public-resource/components/page_top_nav/page_top_nav');
  require('../../../public-resource/components/page_nav/page_nav');
  require('../../../public-resource/components/footer_nav/footer_nav');
  require('../../../public-resource/components/side_contact/side_contact');
  require('../../../public-resource/components/list_paging/list_paging');
  require('../../../public-resource/components/nav_list/nav_list');
  const hoverPopup = require('../../../public-resource/scripts/components/hover_popup');
  hoverPopup('.hover_box');

  /*顶部轮播*/
  const topCarousel = (()=>{

    class carousel{
      constructor(el){
        this.el = el;
        this.ul = this.el.find('.carousel_container');
        this.li = this.ul.find('.carousel_content_box');
        this.spanBox = this.el.find('.indicator');
        this.index = 0;
        this.timer = null;
        this.interval = 4000;
        this.init();
      }
      init(){
        for(let i=0;i<this.li.length;i++){
          let span = $('<span></span>');
          this.spanBox.append(span);
        }
        this.span = this.spanBox.find('span');
        this.contentShow();
        this.bind();
        this.autoPlay();
      }
      bind(){
        this.span.each((index)=>{
          let $this = this.span.eq(index);
          $this.on('click',()=>{
            this.index = index;
            this.contentShow(this.li.eq(this.index));
          })
        });
        this.el.on('mouseover',()=>{
          clearInterval(this.timer);
        });
        this.el.on('mouseleave',()=>{
          this.autoPlay();
        })
      }
      autoPlay(){
        this.timer = setInterval(()=>{
          this.index ++;
          if(this.index > this.li.length-1){
            this.index = 0;
          }
          this.contentShow();
        },this.interval);
      }
      contentShow(){
        this.span.removeClass('active');
        this.span.eq(this.index).addClass('active');
        this.li.removeClass('active');
        this.li.eq(this.index).addClass('active');
      }
    }

    return (el)=>{
      let wrapper = typeof el === 'string' ? $(el) : el;
      let newCarousel = new carousel(wrapper);
    }

  })();

  topCarousel('.banner_carousel_box');
})