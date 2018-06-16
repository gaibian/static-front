/*
* 移动端tab切换
* * <div class="tab_box">
*     <div class="tab_btn"></div>
*     <div class="tab_content"></div>
* </div>
* */

const tabSwitch = (()=>{
  "use strict";
  let _queue = [];
  class SwitchFun{
    constructor(dom){
      this.dom = dom;
      this.switchBtn = this.dom.querySelectorAll('.tab_btn');
      this.switchContent = this.dom.querySelectorAll('.tab_content');
      this.moveLine = this.dom.querySelector('.move_line');
      this.init();
    }
    init(){
      for(let i=0;i<this.switchBtn.length;i++){
        if(!(this.switchBtn[i].className.indexOf('active') === -1)){
          this.activeFun(this.switchContent,i);
          if(this.isInPage(this.moveLine)){
            this.lineInit(i);
          }
        }
      }
      this.bind();
    }
    lineInit(index){
      let btnWidth = parseInt(SwitchFun.getStyle(this.switchBtn[0],'width'));
      let lineWidth = parseInt(SwitchFun.getStyle(this.moveLine,'width'));
      let resultWidth = (btnWidth * index) + (btnWidth - lineWidth)/2;
      SwitchFun.prefixStyle(this.moveLine,resultWidth);
    }
    static prefixStyle(dom,num){
      dom.style.webkitTransform = `translate(${num}px,0) translateZ(0px)`;
      dom.style.mozTransform = `translate(${num}px,0) translateZ(0px)`;
      dom.style.oTransform = `translate(${num}px,0) translateZ(0px)`;
      dom.style.transform = `translate(${num}px,0) translateZ(0px)`;
    }
    static getStyle(element,attr){
      if(element.currentStyle){
        return element.currentStyle[attr];
      }else{
        return window.getComputedStyle(element,null)[attr];
      }
    }
    isInPage(node){
      return (node === document.body) ? false : document.body.contains(node);
    }
    activeFun(dom,index){
      for(let i=0;i<dom.length;i++){
        dom[i].className = dom[i].className.replace(' active','');
      }
      dom[index].className = `${dom[index].className} active`;
    }
    bind(){
      for(let i=0;i<this.switchBtn.length;i++){
        this.switchBtn[i].addEventListener('touchstart',()=>{
          this.activeFun(this.switchBtn,i);
          this.activeFun(this.switchContent,i);
          this.lineInit(i);
        },false)
      }
    }

  }
  /*循坏dom创建实例*/
  let init = (dom)=>{
    let wrapper = typeof dom === 'string' ? document.querySelectorAll(dom):dom;
    for(let i=0;i<wrapper.length;i++){
      let $this = wrapper[i];
      if($this.className.indexOf('init') === -1){
        _queue.push(new SwitchFun($this));
        $this.className += ' init';
      }else{
        return false;
      }
    }
  };
  return (dom)=>{
    init(dom);
  }

})();

module.exports = tabSwitch;
