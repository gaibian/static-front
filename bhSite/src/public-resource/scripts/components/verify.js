 require("../../less/error_popup.less");
require("../../less/success_popup.less");

/*前端验证*/
const verify = (function(){
  "use strict";
  let _queue = [];
  class validation{
    constructor(obj){
      this.obj = obj;
      //验证规则
      this.rules = {
        'empty':{
          "rule":[/\S/],
          "message":"请输入信息",
          "error":"*不能为空",
        },
        'policy':{
          "rule":[/^[0-9a-zA-Z]+$/],
          "message":"请输入保单号",
          "error":"请输入正确的保单号"
        },
        'card':{
          "rule":[/(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/],
          "message":"请输入身份证",
          "error":"*请输入正确的身份证号",
        },
        'name':{
          "rule":[/^(?=([\u4e00-\u9fa5].*){2})/],
          "message":"请输入姓名",
          "error":"*请输入您的姓名",
        },
        'number':{
          "rule":["^[0-9]*[1-9][0-9]*$"],
          "message":"请输入数字",
          "error":"*请输入数字格式",
        },
        'Address':{
          "rule":[/^(?=([\u4e00-\u9fa5].*){9})/],
          "message":"请输入地址信息",
          "error":"*请输入正确的地址信息",
        },
        'Date':{
          "rule":[/^(\d{4})-(\d{2})-(\d{2})$/],
          "message":"请输入身份证到期日期",
          "error":"*请输入正确的身份证到期日期",
        },
        'phone':{
          "rule":[/^[1][345678]\d{9}$/],
          "message":"请输入手机号码",
          "error":"*请输入正确的手机号码"
        },
        'Email':{
          "rule":[/^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/],
          "message":"请输入邮箱地址",
          "error":"*请输入正确的邮箱地址"
        }
      };
    }
    init(){  //初始化
      this.form = $(this.obj.el);
      this.elArr = [];
      this.input = this.form.find('input[data-toggle],textarea[data-toggle]');
      this.sendBtn = $('.' + this.form.attr('data-btn'));
      this.flagArr = [];
      this.flag = false;
    }
  }
  class bgBind extends validation{
    constructor(obj){
      super(obj);
      super.init();
      this.init();
      this.bind();
    }
    init(){
      let that = this;
      this.input.each((index)=>{
        let $this = that.input.eq(index);
        $this.attr('check',false);
        $this.attr('data-empty',true);
        $this.on('blur',()=>{
          let type = $this.attr('checkType');
          if(type.indexOf('Date') != -1){
            type = 'Date';
          }else if(type.indexOf('Address') != -1){
            type = 'Address';
          }else if(type.indexOf('Email') != -1){
            type = 'Email';
          }
          that.checkIsOK($this,type,index);
        });
      });
    };
    bind(){
      let that = this;
      this.sendBtn[0].addEventListener('click',function(){
        that.flagArr = [];
        that.input.each((index)=>{
          let $this = that.input.eq(index);
          let type = $this.attr('checkType');
          let o = {
            check:$this.attr('check'),  //是否通过
            type:type,   //判断的类型
            el:$this
          };
          that.flagArr.push(o);
          if($this.attr('check') === 'true'){
            that.success();
          }else{
            let obj = that.rules[type];
          };
        });

        for(let i=0;i<that.flagArr.length;i++){
          if(that.flagArr[i]['check'] == 'false'){
            let dataError = that.flagArr[i]['el'].attr('data-error');
            let dataNull = that.flagArr[i]['el'].attr('data-empty');
            let dataNullError = that.flagArr[i]['el'].attr('data-null-error');
            if(typeof dataNullError != 'undefined' && dataNull == 'true'){  //输入的值为空
              that.error(dataNullError);
            }else{
              if(typeof dataError === 'undefined'){
                let errorVal = that.rules[that.flagArr[i]['type']]['error'];
                that.error(errorVal);
              }else{
                that.error(dataError);
              }
            }
            that.flag = false;  //数据没有通过
            break;
          }else{
            that.flag = true;  //全部数据通过
          };
        };

        if(that.flag){
          this.successPopup = $('.success_popup');
          if($(this).hasClass('formSuccess')){
            console.log('请不要重复提交');
          }else{
            // if(this.successPopup.length > 0){
            //   this.successPopup.show();
            //   this.successPopup.find('.text').text('提交成功');
            // }else{
            //   $(this).addClass('formSuccess');
            //   let successDom = $('<div class="success_popup"><div class="success_content"><div class="img"></div><p class="text">'+ '提交成功' +'</p></div></div>');
            //   $('body').append(successDom);
            //   this.successPopup = $('.success_popup');
            //   that.obj.success();
            // }
            // setTimeout(()=>{
            //   this.successPopup.hide();
            // },1000)
            that.obj.success();
          }
        }else{
          $(this).removeClass('formSuccess');
        }
      },false);
    };
    checkIsOK(This,type,index){ //对每个input进行验证
      let text = This.val();
      let obj = this.rules[type];
      if(typeof obj['rule'] === 'function'){

      }else{
        //先判断是否有内容
        if($.trim(text) === ''){  //为空
          This.attr('data-val',text);
          This.attr('check',false);
          This.attr('data-empty',true);
        }else{
          for(let i=0;i<obj.rule.length;i++){
            let rex = new RegExp(obj.rule[i]);
            if(rex.test(text)){
              This.attr('data-val',text);
              This.attr('check',true);
              This.attr('data-empty',false);
            }else{
              This.attr('check',false);
              This.attr('data-empty',false);
            }
          }
        }
      }
    };
    //验证出错
    error(message){
      let that = this;
      this.errorPopup = $('.error_popup');
      if(this.errorPopup.length > 0){
        this.errorPopup.show();
        this.errorPopup.find('.text').text(message);
      }else{
        let errorDom = $('<div class="error_popup"><div class="error_content"><div class="img"></div><p class="text">'+ message +'</p></div></div>');
        $('body').append(errorDom);
        this.errorPopup = $('.error_popup');
      }
      setTimeout(function(){
        that.errorPopup.hide();
      },1000)
    }
    //验证成功
    success(){
      //console.log('单独验证通过');
    }
  }
  return (opt)=>{
    let init = (opt)=>{
      for(let i=0;i<opt.length;i++){
        let o = opt[i];
        _queue.push(new bgBind(o));
      }
    };
    init(opt);
  }
})();

module.exports = verify;