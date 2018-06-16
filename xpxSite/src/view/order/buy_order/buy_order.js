require('./buy_order.less');
import BScroll from 'better-scroll';  //导入移动端滚动框架

$(()=>{
  let scrollB = new BScroll('.main',{
    scrollX:false,
    scrollY:true,
    click:true,
  });
  let winHeight = $(window).height();
  $('.main').css({
    height:winHeight
  })
});
const btmPopup = (()=>{
  let _queue = [];
  class popupFun{
    constructor(el){
      this.el = el;
      this.btn = this.el.find('.input_box');
      this.setVal = this.btn.find('.p_val');
      this.popup = this.el.find('.popup_box');
      this.val = this.popup.find('.val_list');
      //this.dataId = this.val.attr('data-id');
      this.init();
    }
    init(){
      this.bind();
    }
    bind(){
      this.btn.on('click',()=>{
        let allPopup = $('.popup_box');
        allPopup.each((index)=>{
          allPopup.eq(index).removeClass('move_bottom');
        });
        $('body,html').css({
          height:100+ '%',
          overflow:'hidden'
        });
        this.popup.addClass('move_bottom');
      });
      this.val.each((index)=>{
        let $this = this.val.eq(index);
        $this.on('click',()=>{
          let val = $this.text();
          let dataId = $this.attr('data-id');
          let dataStatus = $this.attr('data-status');
          if(typeof dataStatus === 'undefined'){
            this.setVal.text(val);
            this.setVal.attr('data-id',dataId);
            this.popup.removeClass('move_bottom');
          }else{
            this.setVal.text(val);
            this.setVal.attr('data-id',this.dataId);
            this.popup.removeClass('move_bottom');
            let sInput = this.el.find('.s_input');
            if(dataStatus === 'true'){
              sInput.hide();
            }else if(dataStatus === 'false'){
              sInput.show();
            }
          }
          $('body,html').css({
            height:'auto',
            overflow:'auto'
          });
        })
      })
    }
  }
  return (el)=>{
    let wrapper = typeof el === 'string' ? $(el) : el;
    wrapper.each((index)=>{
      let $this = wrapper.eq(index);
      if($this.hasClass('init')) return false;
      _queue.push(new popupFun($this));
      $this.addClass('init');
    });
  }

})();

btmPopup('.js_input');



window.mp = require('../../../public-resource/scripts/components/mp');