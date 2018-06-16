require('./choice_company.less');
window.mp = require('../../../public-resource/scripts/components/mp');
$(()=>{
  "use strict";
  const status = (()=>{

    let _queue = [];
    class statusFun{
      constructor(el){
        this.el = el;
        this.statusBox = this.el.find('.status_box');
        this.input = this.el.find('input[type=checkbox]');
        this.init();
      }
      init(){
        this.bind();
      }
      bind(){
        this.statusBox.each((index)=>{
          this.statusBox.eq(index).on('click',()=>{
            let statusBg = this.statusBox.eq(index).find('.status_bg');
            let input = this.statusBox.eq(index).find('input');
            if(statusBg.is(":hidden")){
              this.el.find('.status_bg').hide();
              statusBg.show();
              this.el.find('input[type=checkbox]').each((index)=>{
                this.el.find('input[type=checkbox]').eq(index).prop('checked',false);
              });
              input.prop('checked',true);
            }else{
              statusBg.hide();
              input.prop('checked',false);
            }
          })
        });

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
  status('.company_list_box');
});