require('../../../public-resource/less/init.less');
require('./car_info.less');
window.verify = require('../../../public-resource/scripts/components/verify.js');
window.picUpLoad = require('../../../public-resource/components/pic_upload/pic_upload.js');
$(()=>{
  "use strict";
  require('../../../public-resource/components/page_top_nav/page_top_nav');
  require('../../../public-resource/components/page_nav/page_nav');
  require('../../../public-resource/components/footer_nav/footer_nav');
  require('../../../public-resource/components/side_contact/side_contact');
  const schedule = require('../../../public-resource/scripts/components/time.js');
  /*状态选择*/
  const status = require('../../../public-resource/scripts/components/status.js');
  status('.status_box');

  const timeChoice = (()=>{
    let _queue = [];
    let _newQueur = [];
    class timeFun{
      constructor(el){
        this.el = el;
        this.input = this.el.querySelector('input');
        this.btn = this.el.querySelector('.time_click');
        this.init();
      }
      init(){
        let oDiv = document.createElement("div");
        oDiv.className = 'boxshaw schedule-box';
        this.el.appendChild(oDiv);
        this.timeShow = this.el.querySelector('.boxshaw');
        let that = this;
        _newQueur.push(new schedule({
          el:this.timeShow,
          //date: '2018-9-20',
          clickCb: function (y,m,d) {
            that.input.setAttribute('value',y+'-'+m+'-'+d);
            that.isHide();
          },
          // nextMonthCb: function (y,m,d) {
          //   that.input.setAttribute('value',y+'-'+m+'-'+d);
          //   that.isHide();
          // },
          // nextYeayCb: function (y,m,d) {
          //   that.input.setAttribute('value',y+'-'+m+'-'+d);
          //   that.isHide();
          // },
          // prevMonthCb: function (y,m,d) {
          //   that.input.setAttribute('value',y+'-'+m+'-'+d);
          //   that.isHide();
          // },
          // prevYearCb: function (y,m,d) {
          //   that.input.setAttribute('value',y+'-'+m+'-'+d);
          //   that.isHide();
          // }
        }));
        this.bind();
      }
      bind(){
        let that = this;
        this.btn.onclick = (ev)=>{
          let oEvent = ev || event;
          oEvent.cancelBubble = true;
          oEvent.stopPropagation();
          this.isShow();
        };
        document.onclick = function(ev){
          let oEvent = ev || event;
          oEvent.cancelBubble = true;
          oEvent.stopPropagation();
          let hideView = document.querySelectorAll('.boxshaw');
          for(let i=0;i<hideView.length;i++){
            hideView[i].style.display = 'none';
          }
        }
      }
      isShow(){
        let hideView = document.querySelectorAll('.boxshaw');
        for(let i=0;i<hideView.length;i++){
          hideView[i].style.display = 'none';
        }
        this.timeShow.style.display = 'block';
      }
      isHide(){
        this.timeShow.style.display ='none';
      }
    }

    return (el)=>{
      let wrapper = typeof el === 'string' ? document.querySelectorAll(el) : el;
      for(let i=0;i<wrapper.length;i++){
        let $this = wrapper[i];
        _queue.push(new timeFun($this));
      }
    };
  })();
  timeChoice('.time_choice');

  $('.problem_bg').on('mouseover',()=>{
    $('.problem_popup').show();
  });
  $('.problem_bg').on('mouseleave',()=>{
    $('.problem_popup').hide();
  });
})