require('./address_choice.less');

const addressChoice = (()=>{
  "use strict";
  let _queue = [];
  class addressPicker{
    constructor(el){
      this.el = el;
      this.setVal = this.el.find('.address_val');
      this.pickerBtn = this.el.find('.picker_click');
      this.addressMenuPopup = this.el.find('.address_menu_popup');
      this.data = require('../../scripts/data/city');
      this.ul = this.addressMenuPopup.find('ul');
      this.choiceShowBox = this.addressMenuPopup.find('.choice_show_box');
      this.resultVal = '';
      this.init();
    }
    init(){
      //默认渲染第一次省份数据
      this.dataRender(this.data,'province');
      this.bind();
    }
    bind(){
      this.pickerBtn.on('click',()=>{
        if(this.pickerBtn.hasClass('click')){
          this.popupHide();
          this.pickerBtn.removeClass('click');
        }else{
          this.popupShow();
          this.pickerBtn.addClass('click');
        }
      });
      this.liBind();
    }
    liBind(){
      let that = this;
      this.li.on('click',function(){
        let $li = $(this);
        let attrType = $li.attr('data_type');
        let currentVal = $li.text();
        if(attrType === 'province'){  //代表点击的是省份
          that.cityData = that.clickRender($li,that.data,'city',currentVal);
          that.provinceBtn = that.navRender(currentVal,'province_btn');
        }
        if(attrType === 'city'){  //代表点击的是城市
          that.areaData = that.clickRender($li,that.cityData,'area',currentVal);
          that.cityBtn = that.navRender(currentVal,'city_btn');
          that.navBind();
        }
        if(attrType === 'area'){  //代表点击的是区
          let resultVal = '';
          let spanDom = that.choiceShowBox.find('span');
          spanDom.each((index)=>{
            resultVal = `${resultVal} ${spanDom.eq(index).text()}`
          });
          $li.addClass('active');
          that.setVal.text(`${resultVal} ${currentVal}`);
          that.areaBtn = that.navRender(currentVal,'area_btn');
          that.popupHide();

        }
    })
    }
    isActive(btn){
      let text = btn.text();
      this.li.each(index=>{
        if(this.li.eq(index).text() === text){
          this.li.eq(index).addClass('active');
        }
      });
    }
    navBind(){
      if(this.provinceBtn){
        this.provinceBtn.unbind('click').click(()=>{
          this.dataRender(this.data,'province');
          let spanBtn = this.choiceShowBox.find('span');
          spanBtn.each(index=>{
            if(spanBtn.eq(index).attr('class').indexOf('province') === -1){
              spanBtn.eq(index).remove();
            }
          });
          this.isActive(this.provinceBtn);
          this.liBind();
        });
      }
      if(this.cityBtn){
        this.cityBtn.unbind('click').click(()=>{
          this.dataRender(this.cityData,'city');
          let spanBtn = this.choiceShowBox.find('span');
          spanBtn.each(index=>{
            if(spanBtn.eq(index).attr('class').indexOf('area') !== -1){
              spanBtn.eq(index).remove();
            }
          });
          this.isActive(this.cityBtn);
          this.liBind();
        });
      }
      if(this.areaBtn){
        this.areaBtn.unbind('click').click(()=>{
          this.dataRender(this.areaData,'area');
          this.isActive(this.areaBtn);
          this.liBind();
        })
      }
    }
    navRender(val,selector){
      let spanDom = this.choiceShowBox.find('span');
      let btnDom = null;
      let flag = false;
      if(spanDom && spanDom.length > 0){
          let flagFn = (el)=>{
            spanDom.each(index=>{
              let $spanDom = spanDom.eq(index);
              if( $spanDom.hasClass(el)){
                $spanDom.text(val);
                flag = true;
                btnDom =  $spanDom;
              }
            });
            if(!flag){
              let span = $(`<span></span>`);
              span.text(val);
              span.addClass(selector);
              this.choiceShowBox.append(span);
              btnDom =  span;
            }
          };
          if(selector === 'province_btn'){
            flagFn('province_btn');
          };
          if(selector === 'city_btn'){
            flagFn('city_btn');
          }
          if(selector === 'area_btn'){
            flagFn('area_btn');
          }
      }else{
        let span = $(`<span></span>`);
        span.text(val);
        span.addClass(selector);
        this.choiceShowBox.append(span);
        btnDom =  span;
      }
      return btnDom;
    }
    dataRender(data,type){
      if(this.li && this.li.length > 0){
        this.li.remove();
      }
      for(let key in data){
        let li = $(`<li></li>`);
        let val = '';
        if(typeof type === 'string' && type === 'area'){
          val = data[key];
        }else{
          val = data[key].name;
        }
        li.text(val);
        li.attr('data_type',type);
        li.attr('data_value',key);
        this.ul.append(li);
      }
      this.li = this.ul.find('li');
    }
    //判断点击对象渲染对应的数据
    clickRender($el,data,type,val){
      //开始加载地区数据
      let newData = null;
      let dataValue = $el.attr('data_value');
      for(let key in data){
        if(key === dataValue){
          newData = data[key].child;
        }
      }
      this.dataRender(newData,type);
      this.liBind();
      this.resultVal = `${this.resultVal} \ ${val}`;
      return newData;
    }
    popupShow(){
      this.addressMenuPopup.show();
    }
    popupHide(){
      this.resultVal = '';
      this.pickerBtn.removeClass('click');
      this.addressMenuPopup.hide();
    }
  }
  return (el)=>{
    const wrapper = typeof el === 'string' ? $(el) : el;
    wrapper.each(index =>{
      let $this = wrapper.eq(index);
      if($this.hasClass('init')) return false;
      _queue.push(new addressPicker($this));
      $this.addClass('init');
    })
  }
})();

addressChoice('.address_picker');

