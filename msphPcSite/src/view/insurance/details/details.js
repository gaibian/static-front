require('../../../public-resource/less/init.less');
require('./details.less');

$(()=>{
  "use strict";
  require('../../../public-resource/components/page_top_nav/page_top_nav');
  require('../../../public-resource/components/page_nav/page_nav');
  require('../../../public-resource/components/footer_nav/footer_nav');
  require('../../../public-resource/components/content_header/content_header');
  require('../../../public-resource/components/side_contact/side_contact');
  require('../../../public-resource/components/list_paging/list_paging');
  require('../../../public-resource/components/nav_list/nav_list');

  const tabContent = (function(){
    "use strict";
    let _queue = [];

    class tabFun{
      constructor(el){
        this.el = $(el);
        this.tabBtn = this.el.find('.tab_btn');
        this.tabContent = this.el.find('.explain_list_box');
        this.init();
      }
      init(){
        this.tabContent.eq(0).show();
        this.bind();
      }
      bind(){
        this.tabBtn.each((index)=>{
          let $this = this.tabBtn.eq(index);
          $this.on('click',()=>{
            this.tabBtn.removeClass('active');
            this.tabBtn.eq(index).addClass('active');
            this.tabContent.hide();
            this.tabContent.eq(index).show();
          })
        })
      }
    }

    return (el)=>{
      _queue.push(new tabFun(el));
    }

  })();

  tabContent('.explain_content');
});