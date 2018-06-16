const countDownTime = (()=>{
  let _queue = [];

  class countDownTimeFun{
    constructor(el,time,cb){
      this.el = el;
      this.hDom = this.el.find('.h_time');
      this.mDom = this.el.find('.m_time');
      this.sDom = this.el.find('.s_time');
      this.time = time.split(':');
      this.cb = cb;
      this.H = Number(this.time[0]);
      this.M = Number(this.time[1]);
      this.S = Number(this.time[2]);
      this.init();
    }
    init(){
      this.countTime();
    }
    countTime(){
      setInterval(()=>{
        this.S --;
        if(this.S < 0){
          this.S = 59;
          this.M = this.M - 1;
        }
        if(this.M < 0){
          this.M = 59;
          this.H = this.H - 1;
        }
        if(this.H < 0){  //时间到期
          this.cb();
          return;
        }
        if(this.S.toString().length === 1){
          this.S = '0' + this.S;
        }
        if(this.M.toString().length === 1){
          this.M = '0' + this.M;
        }
        if(this.H.toString().length === 1){
          this.H = '0' + this.H;
        }
        this.sDom.text(this.S);
        this.mDom.text(this.M);
        this.hDom.text(this.H);

      },1000)
    }
  }

  return (opt)=>{
    let wrapper = typeof  opt.el === 'string' ? $(opt.el) : opt.el;
    _queue.push(new countDownTimeFun(wrapper,opt.time,opt.callback));
  }

})();

module.exports = countDownTime;