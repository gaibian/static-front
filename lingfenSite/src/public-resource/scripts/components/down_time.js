
const downTime = (()=>{
  "use strict";
  let _queue = [];
  class downTime{
    constructor(el,callback){
      this.dom = el;
      this.time = Number(this.dom.getAttribute('data-time'));
      this.callback = callback;
      this.setInter = null;
      this.init();
    }
    init(){
      this.dom.className = `${this.dom.className} active`;
      this.dom.innerText = this.time + '秒';
      this.setInter = setInterval(()=>{
        if(this.time === 0){
          this.dom.innerText = '重新获取';
          this.dom.className = this.dom.className.replace(' active','');
          this.callback(this.dom);
          clearInterval(this.setInter);
          return false;
        }
        this.time --;
        this.dom.innerText = this.time + '秒';
      },1000)
    }
  }
  return (el,callback)=>{
    let _queue = [];
    let wrapper = typeof el === 'string' ? document.querySelectorAll(el) : el;
    for(let i=0;i<wrapper.length;i++){
      let $this = wrapper[i];

        _queue.push(new downTime($this,callback));


    }
  }
})();



module.exports = downTime;