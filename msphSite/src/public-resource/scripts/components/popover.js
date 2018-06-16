/*
* 弹窗方式
* <div class='popup' data-btn="btn">
*   <div class='mask_box'></div>
*   <div class='popup_content'>
*       <div class='close_btn'></div>
*   </div>
* </div>
* <div class="btn"></div>
* */
const elementPopup = (()=>{
  "use strict";
  let _queue = [];
  class popover{
    constructor(dom,cb){
      this.btn = dom;
      this.callback = cb;
      this.popup_data = this.btn.getAttribute('data-popup');
      this.popup = document.querySelector(`.${this.popup_data}`);
      this.moveShape = this.btn.getAttribute('data-move');
      this.mask = this.popup.querySelector(".mask_box");
      this.closeBtn = this.popup.querySelector('.close_btn');
      //运动模式
      this.moveArr = ['bottom_end','right_end','middle_end','left_end'];
    }
    popupShow(){  //弹窗弹出
      this.popup.className = this.popup.className + ' active';
    }
    popupHide(){  //关闭

    }
    isInFun(dom,cb,message){
      if(popover.isInPage(dom)){
        cb(dom);
      }else{
        console.warn(message);
      }
    }
    static isInPage(node){
      return (node === document.body) ? false : document.body.contains(node);
    }
  }
  class bindPopover extends popover{
    constructor(dom,cb){
      super(dom,cb);
      this.init();
    }
    init(){
      /*判断遮罩层是否存在*/
      super.isInFun(this.mask,this.maskBindFun,'注意没有遮罩层的存在');
      super.isInFun(this.mask,this.closeBindFun,'注意没有弹窗关闭按钮的存在');
      this.bind();
    }
    bind(){
      this.btn.addEventListener('touchstart',()=>{
        this.popupShow();
      },false);
    }
    maskBindFun(element){
      element.addEventListener('touchstart',()=>{
        this.popupHide();
      })
    }
    closeBindFun(element){
      element.addEventListener('touchstart',()=>{
        this.popupHide();
      })
    }
  }
  let move = (el,cb)=>{
    let wrapper = typeof el === 'string' ? document.querySelectorAll(el) : el;
    for(let i=0;i<wrapper.length;i++){
      let $this = wrapper[i];
      if($this.className.indexOf('init') === -1){
        _queue.push(new bindPopover($this,cb));
        $this.className += ' init';
      }else{
        return false;
      }
    }
  };
  return {
    move:move,
  }
})();

module.exports = elementPopup;

