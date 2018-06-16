require('./auto_repayment.less');

$(()=>{
  "use strict";
  const switchFn = require('../../../public-resource/components/switch_btn/switch_btn');
  switchFn('.switch_container',(This,status)=>{
    let jsBank = document.querySelector('#js_bank');
    if(status){
      jsBank.style.display = 'block';
    }else{
      jsBank.style.display = 'none';
    }
  });
  /*操作银行卡的优先顺序*/
  class bankFn{
    constructor(dom){
      this.dom = document.querySelector(dom);
      this.listBox = this.dom.querySelectorAll('.list_container');
      this.btn = this.dom.querySelectorAll('.btn');
      this.init();
    }
    init(){
      this.defaultActive();
      this.setIndex();
      this.bind();
    }
    bind(){
      for(let i=0;i<this.btn.length;i++){
        let $btn = this.btn[i];
        $btn.onclick = ()=>{
          if($btn.className.indexOf('active') === -1) return false;
          if($btn.className.indexOf('up_btn') !== -1){
            //这是向上按钮
            let parentDom = $btn.parentNode.parentNode.parentNode;
            if(Number(parentDom.getAttribute('index')) === 0){
                this.dom.appendChild(parentDom);
                this.setIndex();
            }else{
                let currentIndex = parentDom.getAttribute('index');
                this.dom.insertBefore(parentDom,this.listBox[currentIndex - 1]);
                this.setIndex();
            }
          }else{
            //这是向下按钮
            let parentDom = $btn.parentNode.parentNode.parentNode;
            if(Number(parentDom.getAttribute('index')) === this.listBox.length - 1){
              this.dom.insertBefore(parentDom,this.listBox[0]);
              this.setIndex();
            }else{
              let currentIndex = Number(parentDom.getAttribute('index'));
              let nextDom = this.listBox[currentIndex + 1];
              this.insertAfter(parentDom,nextDom);
              this.setIndex();
            }
          }
        }
      }
    }
    insertAfter(newEl,targetEl){
      let parentEl = targetEl.parentNode;
      if(parentEl.lastChild == targetEl)
      {
        parentEl.appendChild(newEl);
      }else
      {
        parentEl.insertBefore(newEl,targetEl.nextSibling);
      }
    }
    setIndex(){
      this.listBox = this.dom.querySelectorAll('.list_container');
      for(let i=0;i<this.listBox.length;i++){
        this.listBox[i].setAttribute('index',i);
      }
    }
    //渲染默认的active
    defaultActive(){
      for(let i=0;i<this.listBox.length;i++){
        let $this = this.listBox[i];
        let downBtn = $this.querySelector('.down_btn');
        let upBtn = $this.querySelector('.up_btn');
        if(i === 0){
          downBtn.className = `${downBtn.className} active`;
        }else if(i === this.listBox.length - 1){
          upBtn.className = `${upBtn.className} active`;
        }else{
          downBtn.className = `${downBtn.className} active`;
          upBtn.className = `${upBtn.className} active`;
        }
      }
    }
    //判断能不能点击
  }

  new bankFn('#js_bank');
});