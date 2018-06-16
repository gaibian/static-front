const input = (()=>{

  let _queue = [];

  class inputFun{
    constructor(dom){
      this.dom = dom;
      this.input= this.dom.find('input[type=checkbox]');
      this.init();
      this.bind();
    }
    init(){
      // this.dom.addClass('active');
      // this.input.attr('checked',true);
    }
    bind(){
      this.dom.on('click',(event)=>{
        event.stopPropagation();
        if(this.dom.hasClass('active')){
          this.dom.removeClass('active');
          this.input.attr('checked',false);
        }else{
          this.dom.addClass('active');
          this.input.attr('checked',true);
        }
      })
    }
  }

  return (el)=>{
    let wrapper = typeof el === 'string' ? $(el) : el;
    wrapper.each((index)=>{
      let $this = wrapper.eq(index);
      if($this.hasClass('init')){
        return false;
      }
      _queue.push(new inputFun($this));
      $this.addClass('init');
    })
  }

})();

module.exports = input;