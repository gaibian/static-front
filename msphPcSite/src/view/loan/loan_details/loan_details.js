require('../../../public-resource/less/init.less');
require('./loan_details.less');

$(()=>{
  "use strict";
  require('../../../public-resource/components/page_top_nav/page_top_nav');
  require('../../../public-resource/components/page_nav/page_nav');
  require('../../../public-resource/components/footer_nav/footer_nav');
  require('../../../public-resource/components/content_header/content_header');
  require('../../../public-resource/components/side_contact/side_contact');
  require('../../../public-resource/components/list_paging/list_paging');
  const hoverPopup = require('../../../public-resource/scripts/components/hover_popup');
  hoverPopup('.hover_box');

  const tabContent = require('../../../public-resource/scripts/components/tab_content');
  tabContent.init('.tab_box');

  /*图片懒加载*/
  const Exposure = require('../../../public-resource/scripts/components/lazy.js');
  let $lazy = document.getElementsByClassName('lazy');

  Exposure.one($lazy,function(){
    "use strict";
    let srcValue = this.getAttribute('data-src');
    this.setAttribute('src',srcValue);
  });

  /*前端验证*/
  window.verify = require('../../../public-resource/scripts/components/verify.js');
  console.log(window);

  /*贷款申请弹窗*/
  const applyBtn = $('.apply_btn');
  const applyPopup = $('.apply_popup');
  const popupCloseBtn = applyPopup.find('.close_btn');

  applyBtn.on('click',()=>{
    applyPopup.show();
  });

  popupCloseBtn.on('click',()=>{
    applyPopup.hide();
  });


  /*贷款计算*/
  const calc = (()=>{
    let unique;
    class calcFunB{
      constructor(val1,val2,val3){
        this.allMoneyInputVal = val1;
        this.monthInputVal = val2;
        this.interMonthInputVal = val3 / 1000;
      }
      getCalc(){
        this.eachRepaymentVal = (this.allMoneyInputVal * this.interMonthInputVal) + (this.allMoneyInputVal / this.monthInputVal); //每月还款的钱
        this.lateRepaymentVal = this.eachRepaymentVal;  //末期还款的钱
        this.allInterestVal = this.allMoneyInputVal * this.monthInputVal * this.interMonthInputVal;  //总的利息
        this.allInterestMoneyVal = this.allInterestVal + this.allMoneyInputVal; //本息合计
        this.eachRepaymentValF = Math.round(this.eachRepaymentVal*100) / 100;
        this.lateRepaymentValF = Math.round(this.lateRepaymentVal*100) / 100;
        this.allInterestValF = Math.round(this.allInterestVal*100) / 100;
        this.allInterestMoneyValF = Math.round(this.allInterestMoneyVal*100) / 100;
        return [this.eachRepaymentValF,this.lateRepaymentValF,this.allInterestValF,this.allInterestMoneyValF];
      }
    }  //计算等本等息 的class
    class calcFunX{
      constructor(val1,val2,val3){
        this.allMoneyInputVal = val1;
        this.monthInputVal = val2;
        this.interMonthInputVal = val3 / 1000;
      }
      getCalc(){
        this.eachRepaymentVal = this.allMoneyInputVal * this.interMonthInputVal; //每月还款的钱
        this.lateRepaymentVal = this.eachRepaymentVal + this.allMoneyInputVal;  //末期还款的钱
        this.allInterestVal = this.allMoneyInputVal * this.monthInputVal * this.interMonthInputVal;  //总的利息
        this.allInterestMoneyVal = this.allInterestVal + this.allMoneyInputVal; //本息合计

        this.eachRepaymentValF = Math.round(this.eachRepaymentVal*100) / 100;
        this.lateRepaymentValF = Math.round(this.lateRepaymentVal*100) / 100;
        this.allInterestValF = Math.round(this.allInterestVal*100) / 100;
        this.allInterestMoneyValF = Math.round(this.allInterestMoneyVal*100) / 100;
        return [this.eachRepaymentValF,this.lateRepaymentValF,this.allInterestValF,this.allInterestMoneyValF];
      }
    }  //计算先息后本 的class
    class Context{
      constructor(calcDom,resultDom){
        this.calcDom = $(calcDom);
        this.resultDom = $(resultDom);
        this.calcBtn = $('.calc_btn');
        this.activeBox = this.calcDom.find('.inter_box');
        this.activeBtn = this.activeBox.find('.crl');
        this.formInput = this.calcDom.find('.form_input');
        this.inputBox = this.formInput.find('.input_box');
        this.input = this.inputBox.find('input');
        this.allMoneyInputVal = Number($('#all_money').val());  //贷款金额
        this.monthInputVal = Number($('#month').val());  //贷款期数
        this.interMonthInputVal = Number($('#inter_month').val());  //贷款月利率
        this.eachRepayment = $('#each_repayment');
        this.lateRepayment = $('#late_repayment');
        this.allInterest = $('#all_interest');
        this.allInterestMoney = $('#all_interest_money');
        this.flag = false;
        this.index = 0;  //默认显示等本等息
        this.activeStatus = [];  //选择状态存储
        this.init();
      }
      init(){
        this.activeBtn.eq(this.index).addClass('active');
        this.bind();
      }
      bind(){
        this.activeBtn.each((index)=>{
          let $this = this.activeBtn.eq(index);
          $this.on('click',()=>{
            this.activeBtn.removeClass('active').eq(index).addClass('active');
          })
        });
        this.input.each((index)=>{
          let $this = this.input.eq(index);
          $this.on('blur',()=>{
            this.emtpyFun();
            if(this.flag){
              this.activeBox.each((index)=>{
                let $this = this.activeBox.eq(index);
                let $data = '';
                if($this.find('.crl').hasClass('active')){
                  $data = $this.find('.text').attr('data-id');
                  this.judgeType($data);
                }
              });
            }else{
              return false;
            }
          })
        })
      }
      emtpyFun(){
        this.input.each((index)=>{
          let $this = this.input.eq(index);
          if($.trim($this.val()) == '' || $.trim($this.val()) == 0){
            this.flag = false;
          }else{
            this.flag = true;
          }
        })
      }
      judgeType($data){  //判断
        let data = $data;
        this.allMoneyInputVal = Number($('#all_money').val());  //贷款金额
        this.monthInputVal = Number($('#month').val());  //贷款期数
        this.interMonthInputVal = Number($('#inter_month').val());  //贷款月利率
        if(typeof data === 'string' && data === 'b'){  //等本等息
          this.set(new calcFunB(this.allMoneyInputVal,this.monthInputVal,this.interMonthInputVal));
        }else if(typeof data === 'string' && data === 'x'){  //先息后本
          this.set(new calcFunX(this.allMoneyInputVal,this.monthInputVal,this.interMonthInputVal));
        }
      }
      set(strategy){
        this.strategy = strategy;
        this.getResult(this.strategy.getCalc());
      }
      getResult(arr){
        let [num1,num2,num3,num4] = arr;
        this.eachRepayment.text(num1);
        this.lateRepayment.text(num2);
        this.allInterest.text(num3);
        this.allInterestMoney.text(num4);
      }
    }
    return (calcDom,resultDom)=>{
      if(unique === undefined){
        unique = new Context(calcDom,resultDom);
      }
      return unique;
    };
  })();
  calc('.calc_content_box','.data_show_box')
});