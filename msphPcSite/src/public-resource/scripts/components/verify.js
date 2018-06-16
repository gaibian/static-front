/*前端验证*/
require('../../less/verify_error_popup.less');
require('../../less/verify_success_popup.less');
const formVail = (()=>{
    var _queue = [];
    let init = (opt)=>{
        for(let i=0;i<opt.length;i++){
            let o = opt[i];
            _queue.push(new bgBind(o));
        }
    };
    class validation{
        constructor(obj){
            this.obj = obj;
            //验证规则
            this.rules = {
                'empty':{
                    "rule":[/\S/],
                    "message":"请输入信息",
                    "error":"不能为空",
                },
                'card':{
                    "rule":[/(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/],
                    "message":"请输入身份证",
                    "error":"证件格式不正确",
                },
                'car_card':{
                    "rule":[/^[\u4e00-\u9fa5]{1}[A-Za-z]{1}[A-Za-z0-9]{5}$/],
                    "message":"请输入车牌号",
                    "error":"车牌格式不正确"
                },
                'name':{
                    "rule":[/^(?=([\u4e00-\u9fa5].*){2})/],
                    "message":"请输入姓名",
                    "error":"请输入您的姓名",
                },
                'number':{
                    "rule":["^[0-9]*[1-9][0-9]*$"],
                    "message":"请输入数字",
                    "error":"数字格式不正确",
                },
                'Address':{
                    "rule":[/^(?=([\u4e00-\u9fa5].*){9})/],
                    "message":"请输入地址信息",
                    "error":"地址信息格式不正确",
                },
                'Date':{
                    "rule":[/^(\d{4})-(\d{2})-(\d{2})$/],
                    "message":"请输入身份证到期日期",
                    "error":"日期格式不正确",
                },
                'phone':{
                    "rule":[/^[1][345678]\d{9}$/],
                    "message":"请输入手机号码",
                    "error":"手机格式不正确"
                },
                'Email':{
                    "rule":[/^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/],
                    "message":"请输入邮箱地址",
                    "error":"邮箱格式不正确"
                }
            };
        }
        init(){  //初始化
            this.form = $(this.obj.el);
            this.input = this.form.find('input[data-toggle]');
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
            this.sendBtn.on('click',function(){
                that.flagArr = [];
                that.input.each((index)=>{
                    let $this = that.input.eq(index);
                    let type = $this.attr('checkType');
                    let o = {
                        check:$this.attr('check'),
                        type:type
                    };
                    that.flagArr.push(o);
                    if($this.attr('check') === 'true'){
                        that.success($this);
                    }else{
                        let obj = that.rules[type];
                        that.error($this,obj.error);
                    };
                });

                for(let i=0;i<that.flagArr.length;i++){
                    if(that.flagArr[i]['check'] === 'false'){
                        let errorVal = that.rules[that.flagArr[i]['type']]['error'];
                        that.flag = false;
                        //that.error(errorVal);
                        break;
                    }else{
                        that.flag = true;
                    }

                }

                if(that.flag){
                    if($(this).hasClass('formSuccess')){
                        //alert('请不要重复提交');
                    }else{
                        // $(this).addClass('formSuccess');
                        // let successDom = $('<div class="success_popup"><div class="success_content"><div class="img"></div><p class="text">'+ '提交成功' +'</p></div><div class="mask_box"></div></div>');
                        // $('body').append(successDom);
                        that.obj.success();
                    }
                }else{
                    $(this).removeClass('formSuccess');
                }
            });
        };

        checkIsOK(This,type,index){ //对每个input进行验证
            let text = This.val();

            let obj = this.rules[type];
            if(typeof obj['rule'] == 'function'){

            }else{
                for(let i=0;i<obj.rule.length;i++){
                    let rex = new RegExp(obj.rule[i]);
                    if(rex.test(text)){
                        This.attr('data-val',text);
                        This.attr('check',true);
                        this.success(This)
                    }else{
                        This.attr('check',false);
                        this.error(This,obj.error);
                    }
                }
            }
        };

        //验证出错
        error(el,message){
            if(el.next().hasClass('passport_success_text')){
                el.next().remove();
            }
            let errorDom = $(`<div class="passport_note passport_error_text"><i></i><span>${message}</span></div>`);
            if(el.next().hasClass('passport_error_text')){
                return false;
            }
            el.parent().addClass('error_active');
            el.after(errorDom);
        }
        //验证成功
        success(el){
            if(el.next().hasClass('passport_error_text')){
              el.next().remove();
            }else if(el.next().hasClass('passport_success_text')){
                return false;
            }
            let successDom = $(`<div class="passport_note passport_success_text"></div>`);
            el.parent().removeClass('error_active');

            el.after(successDom);
        }
    }

    return {
        init:init
    }
})();

module.exports = formVail;