require('./switch_btn.less');

  const switchFn = (()=>{
    let _queue = [];
    class switchFun{
      constructor(dom,callback){
        this.dom = dom;
        this.callback = callback;
        this.status = null;
        this.btn = this.dom.querySelector('.move_btn');
        this.input = this.dom.querySelector('input[type=checkbox]');
        this.init();
      }
      init(){
        if(this.dom.className.indexOf('active') === -1){
          this.input.checked = false;
          this.status = false;
        }else{
          this.input.checked = true;
          this.status = true;
        }
        this.callback(this.dom,this.status);
        this.bind();
      }
      bind(){
        this.btn.addEventListener('touchstart',()=>{
          if(this.dom.className.indexOf('active') === -1){
            this.dom.className = `${this.dom.className} active`;
            this.input.checked = true;
            this.status = true;
            if(this.callback){
              this.callback(this.dom,this.status);
            }
          }else{
            this.dom.className = this.dom.className.replace(' active','');
            this.input.checked = false;
            this.status = false;
            if(this.callback){
              this.callback(this.dom,this.status);
            }
          }
        },false)
      }
    }
    return (el,callback)=>{
      let wrapper = typeof el === 'string' ? document.querySelectorAll(el) : el;
      for(let i=0;i<wrapper.length;i++){
        let $el = wrapper[i];
        if(wrapper[i].className.indexOf('init') === -1){
          _queue.push(new switchFun($el,callback));
          $el.className = `${$el.className} init`;
        }else{
          return false;
        }
      }
    }
  })();

module.exports = switchFn;