const status = (()=>{
  let _queue = [];

  class statusFun {
    constructor(el) {
      this.el = el;
      this.statusBtn = this.el.find('.status');
      this.input = this.el.find('input');
      this.init();
    }

    init() {
      this.statusBtn.each((index)=>{
        let $this = this.statusBtn.eq(index);
        if($this.hasClass('active')){
          let dataCheck = $this.attr('data-check');
          if(dataCheck === 'true'){
            this.input.prop('checked',true);
          }else if(dataCheck === 'false'){
            this.input.prop('checked',false);
          }
        }
      });
      this.bind();
    }
    bind() {
      this.statusBtn.each((index)=>{
        let $this = this.statusBtn.eq(index);
        $this.on('click',()=>{
          this.statusBtn.removeClass('active');
          $this.addClass('active');
          let dataCheck = $this.attr('data-check');
          if(dataCheck === 'true'){
            this.input.prop('checked',true);
          }
          if(dataCheck === 'false'){
            this.input.prop('checked',false);
          }
        })
      })
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

module.exports = status;