/*
鼠标移入会自动添加active类名
* <div class="hover_box">
*   <div class='hover_btn'></div>
*   <div class="hover_popup"></div>
* </div>
*
* */
const hoverPopup = (()=>{
    "use strict";
    let _queue = [];
    class hoverFun{
        constructor(el){
            this.el = el;
            this.hoverBtn = this.el.querySelector('.hover_btn');
            this.hoverPopup = this.el.querySelector('.hover_popup');
            this.init();
        }
        init(){
            this.bind();
        }
        bind(){
            this.el.addEventListener('mouseover',()=>{
                //this.el.className += ' active';
                this.hoverPopup.style.display = 'block';
            });
            this.el.addEventListener('mouseout',()=>{
                //this.el.className = this.el.className.replace('active','');
                this.hoverPopup.style.display = 'none';
            })
        }
    }

    return (el,opt)=>{
        let wrapper = typeof el === 'string' ? document.querySelectorAll(el) : el;

        for(let i=0;i<wrapper.length;i++){
            let $this = wrapper[i];
            if($this.className.indexOf('init') === -1){
                _queue.push(new hoverFun($this));
                $this.className += ' init';
            }else{
                return false;
            }
        }
    }
})();

module.exports = hoverPopup;