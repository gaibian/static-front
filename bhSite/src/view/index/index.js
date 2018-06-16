require('./index.less');

$(()=>{
  "use strict";
  const statusBox = (()=>{
    let _queue = [];

    class statusFun{
      constructor(el){
        this.el = el;
        this.clickDom = this.el.find('.status_bg');
        this.input = this.el.find('input');
        this.loadDom = this.el.find('.loading_container');
        this.init();
      }
      init(){
        this.bind();
        if(this.clickDom.hasClass('active')){
          this.loadDom.hide();
        }else{
          this.loadDom.show();
        }
      }
      bind(){
        this.clickDom.on('click',()=>{
          if(this.clickDom.hasClass('active')){
            this.clickDom.removeClass('active');
            this.input.prop('checked',false);
            this.loadDom.show();
          }else{
            this.clickDom.addClass('active');
            this.input.prop('checked',true);
            this.loadDom.hide();
          }
        })
      }
    }

    return (el)=>{
      let wrapper = typeof el === 'string' ? $(el) : el;
      wrapper.each((index)=>{
        let $this = wrapper.eq(index);
        if($this.hasClass('init')) return false;
        _queue.push(new statusFun($this));
        $this.addClass('init');
      });
    }

  })();
  statusBox('.choice_status_box');
  window.verify = require('../../public-resource/scripts/components/verify');

});