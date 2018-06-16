import BScroll from 'better-scroll';  //导入移动端滚动框架
require('./m_carousel.less');
const mCarousel = (function(){
  let _queue = [];
  class carouselFun{
    constructor(dom){
      this.dom = dom;
      this.ul = this.dom.children[0]; //获取到第一个子元素ul
      this.li = this.ul.querySelectorAll('a');
      this.liWidth = this.li[0].clientWidth;
      this.liLength = this.li.length;
      this.spanBox = this.dom.querySelector('.indicator');
      this.loop = true;  //是否开启无缝轮播
      this.autoPlay = true;  //是否开启轮播功能
      this.interval = 4000;  //轮播的间隔时间
      this.opts = {
        scrollX:true,
        scrollY:false,
        momentum:false,  //根据速度 产生的惯性挂动
        snap:{
          loop:this.loop,
          threshold:0.3,
          speed:400
        },
        click:true
      };
      this.init();
    }
    init(){  //初始化一些操作
      if (!this.dom) {
        console.warn('can not resolve the wrapper dom');
      }
      this.scroller = this.dom.children[0];
      if (!this.ul) {
        console.warn('the wrapper need at least one child element to be scroller');
      }
      this.loop ? this.ul.style.width = this.liWidth * (this.liLength + 2) + 'px' : this.ul.style.width = this.liWidth * this.liLength + 'px';
      let createSpan = '<span></span>';
      for(let i=0;i<this.liLength;i++){
        this.spanBox.innerHTML += createSpan;
      }
      this.currentPageIndex = 0;
      this.span = this.spanBox.querySelectorAll('span');
      this.span[this.currentPageIndex].className = 'active';
      setTimeout(()=>{
        this.scroll = new BScroll(this.dom,this.opts);
        if(this.autoPlay){
          this.play();
        }
        this.bind();
      },30);
    }
    bind(){
      this.scroll.on('scrollEnd',()=>{  //监控到scrollEnd事件的变化
        let pageIndex = this.scroll.getCurrentPage().pageX;
        // if(this.loop){
        //   pageIndex -= 1;
        // }
        this.currentPageIndex = pageIndex;  //滚动对应的下标
        this.indicatorFun();
        if(this.autoPlay){
          this.play();
        }
      });
      this.scroll.on('beforeScrollStart',()=>{  //监控到滚动事件之前
        if(this.autoPlay){
          clearTimeout(this.timer);
        }
      })
    }
    indicatorFun(){  //指示器操作函数
      for(let i=0;i<this.span.length;i++){
        this.span[i].className = this.span[i].className.replace('active','');
      }
      this.span[this.currentPageIndex].className = 'active';
    }
    play(){  //自动轮播
      let pageIndex = this.currentPageIndex;
      if(this.loop){
        pageIndex += 1;
      }
      if(pageIndex > this.li.length -1){
        pageIndex = 0;
      }
      this.timer = setTimeout(()=>{
        this.scroll.goToPage(pageIndex,0,400);
      },this.interval)
    }
  }

  return (el)=>{
    //判断传进来的el是dom对象还是字符串
    let wrapper = typeof el === 'string' ? document.querySelectorAll(el) : el;
    for(let i=0;i<wrapper.length;i++){
      let $this = wrapper[i];
      if($this.className.indexOf('init') === -1){
        _queue.push(new carouselFun($this));
        $this.className += ' init';
      }else{
        return false;
      }
    }
  };
})();

module.exports = mCarousel;