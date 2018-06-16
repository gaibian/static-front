
require('../../less/delete_input_val.less');
const deleteInput = (()=>{
  "use strict";
  let _queue = [];
  class deleteInputVal{
    constructor(dom){
      this.dom = dom;
      this.input = this.dom.querySelector('input');
      this.value = this.input.value;
      this.init();
    }
    init(){
      this.addDeleteDom();
      if(this.value !== ''){
        this.deleteBtn.style.display = 'block'
      }
      this.bind();
    }
    bind(){
      this.input.addEventListener('focus',()=>{
        let val = this.input.value;
        if(val !== ''){
          this.deleteBtn.style.display = 'block';
        }
      },false);
      this.input.addEventListener('keyup',()=>{
        let val = this.input.value;
        if(val !== ''){
          this.deleteBtn.style.display = 'block';
        }
      });
      // this.input.addEventListener('blur',()=>{
      //   this.deleteBtn.style.display = 'none';
      // },false);
      this.deleteBtn.addEventListener('click',()=>{
        this.input.value = '';
        this.deleteBtn.style.display = 'none';
      },false)
    }
    addDeleteDom(){
      let i = document.createElement('i');
      i.className = 'delInputBtn';
      this.dom.appendChild(i);
      this.deleteBtn = this.dom.querySelector('.delInputBtn');
      this.deleteBtn.style.display = 'none';
    }
  }
  return (el)=>{
    let wrapper = typeof el === 'string' ? document.querySelectorAll(el) : el;
    for(let i=0;i<wrapper.length;i++){
      let $this = wrapper[i];
      if($this.className.indexOf('init') === -1){
        _queue.push(new deleteInputVal($this));
        $this.className += ' init';
      }else{
        return false;
      }
    }
  }
})();

module.exports = deleteInput;