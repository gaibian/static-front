require('./confirm_order.less');
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
  status('.statement_info_box');

  let timePick = $('#time_picker');
  let timeVal = timePick.find('.time_val');
  timePick.on('click',()=>{
    let dtPicker = new mui.DtPicker({
      "type": "date",
      "beginYear": '2018',
      "endYear": '2050'
    });
    dtPicker.show(function(e) {
      let y = Number(e.y.value) + 1;
      let m = e.m.value;
      let d = e.d.value;
      let val = `${e.value}至${y}-${m}-${d}`;
      timeVal.text(val);
      timeVal.attr('data-time',e.value);
    })
  });
})