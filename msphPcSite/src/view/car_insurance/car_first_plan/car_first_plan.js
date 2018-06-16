require('../../../public-resource/less/init.less');
require('./car_first_plan.less');

$(()=>{
  "use strict";
  require('../../../public-resource/components/page_top_nav/page_top_nav');
  require('../../../public-resource/components/page_nav/page_nav');
  require('../../../public-resource/components/footer_nav/footer_nav');
  require('../../../public-resource/components/side_contact/side_contact');
  const input = require('../../../public-resource/scripts/components/input_check');
  input('.state_box');

  // const carousel = require('../../../public-resource/scripts/components/carousel');
  // carousel('.carousel_box');

  const schedule = require('../../../public-resource/scripts/components/time.js');

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
      // wrapper.each((index)=>{
      //   let $this = wrapper.eq(index);
      //   if($this.hasClass('init')) return false;
      //   _queue.push(new timeFun($this));
      //   $this.addClass('init');
      // });
    };
  })();

  timeChoice('.time_choice');

  const hoverPopup = require('../../../public-resource/scripts/components/hover_popup');
  hoverPopup('.hover_box');

  const tabContent = require('../../../public-resource/scripts/components/tab_content');
  tabContent.init('.tab_box');

  const uploadMore = (()=>{
    return (selector)=>{
      let el = $(selector);
      let li = el.find('.company_li_box');
      let moreBtn = el.find('.more_btn');
      let input = li.find('input[type=checkbox]');
      let allInput = $('#all_input');
      moreBtn.on('click',()=>{
        if(moreBtn.hasClass('init')){
          li.css({
            height:`${143}px`
          });
          moreBtn.removeClass('init');
          moreBtn.text('显示更多>>');
        }else{
          li.css({
            height:'auto',
          });
          moreBtn.text('收起内容>>');
          moreBtn.addClass('init');
        }
      });
      allInput.on('click',()=>{
        if(allInput.attr('checked')){
          input.each((index)=>{
            let $input = input.eq(index);
            $input.attr('checked',false).parent().removeClass('active');
          })
        }else{
          input.each((index)=>{
            let $input = input.eq(index);
            $input.attr('checked',true).parent().addClass('active');
          })
        }
      })
    }
  })();
  uploadMore('.company_carousel_box');

  const selectBox = (()=>{
    let _queue = [];
    class selectFn{
      constructor(el,select){
        this.el = el;
        this.select = select;
        this.selectVal = this.el.find('.select_val');
        this.val = this.selectVal.find('.val');
        this.selectMenuBox = this.el.find('.select_menu_box');
        this.li = this.selectMenuBox.find('li');
        this.init();
      }
      init(){
        this.bind();
      }
      bind(){
        this.selectVal.on('click',(e)=>{
          e.stopPropagation();
          if(this.selectVal.hasClass('init')){
            this.selectHide();
          }else{
            this.allSelectHide();
            this.selectShow();
          }
        });
        this.li.each(index=>{
          let $li = this.li.eq(index);
          $li.on('click',(e)=>{
            e.stopPropagation();
            let val = $li.text();
            this.val.text(val);
            this.selectHide();
          })
        });
        $(document).on('click',(e)=>{
          this.selectHide();
        })
      }
      allSelectHide(){
        this.select.each(index=>{
          let $select = this.select.eq(index);
          $select.find('.select_val').removeClass('init');
          $select.find('.select_menu_box').hide();
        })
      }
      selectShow(){
        this.selectMenuBox.show();
        this.selectVal.addClass('init');
      }
      selectHide(){
        this.selectMenuBox.hide();
        this.selectVal.removeClass('init');
      }
    }
    return (el)=>{
      let wrapper = $(el);
      wrapper.each(index=>{
        let $this = wrapper.eq(index);
        if($this.hasClass('init')) return false;
        _queue.push(new selectFn($this,wrapper));
        $this.addClass('init');
      })
    }
  })();
  selectBox('.select_box');


});