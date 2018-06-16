require('./address_manage.less');
const addressManage = (()=>{
  "use strict";
  class addressFun{
    constructor(dom){
      this.dom = dom;
      this.ul = this.dom.querySelector('.address_list_container');
      this.li = this.ul.querySelectorAll('.address_list');
      this.addDom = document.querySelector('.add_address_box');
      this.addBtn = this.dom.querySelector('.add_address_btn');
      this.addPopup = document.querySelector('.add_address_popup');
      this.closeBtn = this.addPopup.querySelector('.close_btn');
      this.keepBtn = this.addPopup.querySelector('.address_popup_btn');
      this.popupInput = this.addPopup.querySelectorAll('input[type=text]');
      this.popupCheck = this.addPopup.querySelector('input[type=checkbox]');
      this.popupName = this.addPopup.querySelector('#popup_name');
      this.popupPhone = this.addPopup.querySelector('#popup_phone');
      this.popupAddress = this.addPopup.querySelector('#popup_address');
      this.glBtn = this.dom.querySelector('.gl_address');
      this.init();
    }
    init(){
      //判断有没有地址栏
      //this.isAddressBar();
      this.isActive();
      this.isDefault();
      this.bind();
    }
    //判断有没有地址栏
    isAddressBar(){
      if(!this.dom){
        this.addDom.show();
      }
    }
    //判断是否为选中的地址
    isActive(){
      for(let i=0;i<this.li.length;i++){
        let $this = this.li[i];
        let modifyBtn = $this.querySelector('.modify_btn');
        if($this.className.indexOf('active') !== -1){
          modifyBtn.style.display = 'block';
        }else{
          modifyBtn.style.display = 'none';
        }
      }
    }
    //判断是否是默认地址
    isDefault(){
      for(let i=0;i<this.li.length;i++){
        let $this = this.li[i];
        let defaultStatus = $this.querySelector('.default_status');
        if($this.className.indexOf('default') !== -1){
          defaultStatus.innerText = '默认地址';
          defaultStatus.style.display = 'block';
        }else{
          defaultStatus.innerText = '设置默认';
          defaultStatus.style.display = 'none';
        }
      }
    }
    //选中的设为默认地址
    setDefault(dom,$this){
      console.log(dom);
      for(let i=0;i<dom.length;i++){
        let $this = dom[i].querySelector('.default_status');
        $this.innerText = '设为默认地址';
        $this.style.display = 'none';
      }
      $this.innerText = '默认地址';
      $this.style.display = 'block';
    }
    //执行事件判断方法
    isEvent($this,callback){
      if($this.className.indexOf('active') !== -1 && $this.className.indexOf('default') === -1){
        callback();
      }
    }
    //点击添加类
    addClass($this,dom,name){
      for(let i=0;i<dom.length;i++){
        dom[i].className = dom[i].className.replace(` ${name}`,``);
      }
      $this.className = `${$this.className} ${name}`;
    }
    //弹窗的显示
    popupShow(){
      this.addPopup.style.display = 'block';
    }
    popupHide(){
      this.addPopup.style.display = 'none';
    }
    //判断弹窗是新增还是修改
    ispopup(type,callback){
      if(typeof type === 'string' && type === 'addString'){
        callback();
        return false;
      }
      if(typeof type === 'string' && type === 'modifyString'){
        //填写数据
        callback();
        return false;
      }
    }
    bind(){
      this.glBtn.addEventListener('click',()=>{
        for(let i=0;i<this.li.length;i++){

          let deleteBtn = this.li[i].querySelector('.delete_btn');
          deleteBtn.style.display = 'block';
          let defa = this.li[i].querySelector('.default_status');
          if(this.li[i].className.indexOf('default') !== -1){
            defa.style.color = '#f50';
            defa.style.background = '#ffece3';
          }else{
            defa.style.color = '#fff';
            defa.style.background = '#ff5500';
          }
        }
      },false)
      // this.glBtn.addEventListener('click',()=>{
      //
      // },false);
      for(let i=0;i<this.li.length;i++){
        let $this = this.li[i];
        let defaultStatus = $this.querySelector('.default_status');
        $this.addEventListener('click',(e)=>{
          this.addClass($this,this.li,'active');
          this.isActive();
        },false);
        $this.addEventListener('mouseover',()=>{
          this.isEvent($this,()=>{
            defaultStatus.style.display = 'block';
          })
        },false);
        $this.addEventListener('mouseout',()=>{
          this.isEvent($this,()=>{
            defaultStatus.style.display = 'none';
          })
        },false);
        // defaultStatus.addEventListener('click',()=>{
        //   this.isEvent($this,()=>{
        //     this.setDefault(this.li,defaultStatus);
        //     this.addClass($this,this.li,'default');
        //   })
        // },false)
      }
      // this.addBtn.addEventListener('click',()=>{
      //   this.ispopup('addString',()=>{
      //     //清空表单数据
      //     for(let i=0;i<this.popupInput.length;i++){
      //       this.popupInput[i].value = '';
      //     }
      //     this.popupCheck.checked = false;
      //     this.popupShow();
      //     verify.init([{
      //       el:'.popup_form',
      //       success:()=>{
      //         let name = this.popupName.value;
      //         let phone = this.popupPhone.value;
      //         let address = this.popupAddress.value;
      //         let li = document.createElement('li');
      //         li.className = 'address_list';
      //         li.innerHTML = `<div class="default_status">设置默认</div><h2 class="ads_tit">浙江<span>宁波</span>(${name} 收)</h2><p class="ads_text">鄞州区${address} ${phone}</p><button class="modify_btn">修改</button>`;
      //         this.ul.appendChild(li);
      //         this.popupHide();
      //       }
      //     }])
      //   });
      // },false);
      this.closeBtn.addEventListener('click',()=>{
        this.popupHide();
      });
    }
  }
  return (dom)=>{
    let wrapper = typeof dom === 'string' ? document.querySelector(dom) : dom;
    new addressFun(wrapper);
  }
})();

addressManage('.address_content_box');