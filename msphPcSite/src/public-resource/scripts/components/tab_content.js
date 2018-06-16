/*
* tab切换组件
* 一.需求
* 点击切换内容
* <div class="tab_box">
*     <div class="tab_btn"></div>
*     <div class="tab_content"></div>
* </div>
* */

const tabContent = (function(){
    let _queue = [];
    function init(dom){
        var dom = $(dom);
        dom.each(function(index){
            let $this = $(this);
            if($this.hasClass('init')){
                return;
            };
            _queue.push(new tabFun($this));
            $this.addClass('init');
        });
    };

    function tabFun(dom){
        this.dom = dom;
        this.tabBtn = this.dom.find('.tab_btn');
        this.tabContent = this.dom.find('.tab_content');
        this.moveLine = this.dom.find('.move_line');
        this.init();
    }

    tabFun.prototype.init = function(){
        var that = this;
        this.liWidth = this.tabBtn.width();
        this.lineWidth = this.moveLine.width();
        this.moveLine.css({
            left:this.liWidth / 2,
            marginLeft:-(this.lineWidth / 2),
        });

        this.tabBtn.each(function(index){
            if($(this).hasClass('active')){
                that.tabMove(index);
            }
        });
        this.bind();
    };

    tabFun.prototype.bind = function(){
        var that = this;
        this.tabBtn.on('click',function(event){
            var index = that.tabBtn.index(this);
            that.moveLine.addClass('ts');
            that.tabMove(index);
          event.stopPropagation()
        })
    };
    tabFun.prototype.tabMove = function(index){

        this.tabBtn.removeClass('active').eq(index).addClass('active');
        this.moveLine.css({
            left:(this.liWidth * index) + this.liWidth / 2,
        });
        this.tabContent.hide().eq(index).show();
    }

    return{
        init:init
    }
})();

//export{tabContent}
module.exports = tabContent;