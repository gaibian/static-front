require(`./address_picker.less`);
import BScroll from 'better-scroll';

  "use strict";
  class picker{
    constructor(el,cb){
      this.elString = el;
      this.pickerBtn = document.querySelector(el);
      this.cityData = require(`./city_data.js`);
      this.navIndex = 0;
      this.opts = {
        scrollX:false,
        scrollY:true,
        momentum:true,
        click:true
      };
      if(!this.el){
        let elWapper = `${this.elString}_popup`;
        this._addWrapper(elWapper.substr(1));
        this.el = document.querySelector(elWapper);
        this.closeBtn = this.el.querySelector('.close_btn');
        this.pickerContent = this.el.querySelectorAll('.picker_content');
        this.pickerTitle = this.el.querySelector('.picker_title');
        this.pickerViewBox = this.el.querySelector('.picker_view_box');
        this.viewLi = this.pickerViewBox.querySelectorAll('li');
        this.popupContent = this.el.querySelector('.popup_content');
      }
    }
    _addWrapper(elWapper){
      let popupContainer = document.createElement('section');
      popupContainer.className = `${elWapper} address_wrapper`;
      let popupHtml = `<div class="picker_title"><h2 class="title">所在地区</h2><div class="close_btn"></div></div>
                          <div class="popup_content">
                              <ul class="picker_view_box">
                                  <li class="province_val" data-type="s">请选择</li>
                              </ul>
                          </div>`;
      popupContainer.innerHTML = popupHtml;
      document.body.appendChild(popupContainer);
    }
    /*设置最大高度方法*/
    _height(dom){
      let windowHeight = document.documentElement.clientHeight || document.body.clientHeight;
      let titleHeight = parseInt(this.getStyle(this.pickerTitle,`height`));
      let pickerViewHeight = parseInt(this.getStyle(this.pickerViewBox,`height`));
      let pickerContentHeight = windowHeight - (titleHeight + pickerViewHeight);
      dom.style.height = `${pickerContentHeight}px`;
      dom.style.maxHeight = `${pickerContentHeight}px`;
    }
    /*添加dom方法*/
    _addDom(el){
      let pickerContent = document.createElement('div');
      pickerContent.className = `picker_content ${el}`;
      this.popupContent.appendChild(pickerContent);
      let ul = document.createElement('ul');
      ul.className = 'wheel_scroll';
      pickerContent.appendChild(ul);
      return {
        ul:ul,
        pickerContent:pickerContent
      };
    }
    /*添加nav dom方法*/
    addNavDom(el){
      let viewLi = document.createElement('li');
      this.pickerViewBox.appendChild(viewLi);
      viewLi.innerText = '请选择';
      viewLi.className = el;
    }
    /*默认渲染省份数据方法*/
    _data(){
      let o = this._addDom('wheel_province');
      for(let i in this.cityData){
        let li = document.createElement(`li`);
        li.className = `wheel_item`;
        li.innerText = this.cityData[i].name;
        li.setAttribute(`data-province`,i);
        o.ul.appendChild(li);
      }
      this.pickerContent = this.popupContent.querySelectorAll('.picker_content');
      this.viewLi = this.pickerViewBox.querySelectorAll('li');
      this.wheelProvince = this.el.querySelector('.wheel_province');
      this.scroll = new BScroll(this.wheelProvince,this.opts);
      this.provinceItem = o.ul.querySelectorAll('.wheel_item');
      this.navSelectFun(this.navIndex);
      this._height(o.pickerContent);
    }
    /*获取css属性方法*/
    getStyle(element,attr){
      if(element.currentStyle){
        return element.currentStyle[attr];
      }else{
        return window.getComputedStyle(element,null)[attr];
      }
    }
    /*地址选择层显示方法*/
    popupShow(){
      this.el.className = `${this.el.className} active`;
      this.body = document.body;
      this.body.style.height = 100 + '%';
      this.body.style.overflow = 'hidden';
    }
    /*地址选择层隐藏方法*/
    popupHide(){
      this.el.className = this.el.className.replace(` active`,``);
      this.body.style.height =`auto`;
      this.body.style.overflow = `auto`;
    }
    /*导航隐藏方法*/
    navHide(){
      let allContent = this.popupContent.querySelectorAll('.picker_content');
      for(let i=0;i<allContent.length;i++){
        allContent[i].style.display = 'none';
      }
    }
    /*选中标志方法*/
    selectFun(el,index){
      for(let i=0;i<el.length;i++){
        el[i].className = el[i].className.replace(' active','');
      }
      el[index].className = `${el[index].className} active`;
    }
    /*导航选中标志方法*/
    navSelectFun(index){
      this.viewLi = this.pickerViewBox.querySelectorAll('li');
      for(let k=0;k<this.viewLi.length;k++){
        this.viewLi[k].className = this.viewLi[k].className.replace(' active','');
      }
      this.viewLi[index].className = `${this.viewLi[index].className} active`;
    }
    /*选择结束赋值*/
    assignment(){
      let addressVal1 = this.pickerViewBox.querySelector('.province_val').innerText;
      let addressVal2 = this.pickerViewBox.querySelector('.city_val').innerText;
      let addressVal3 = this.pickerViewBox.querySelector('.area_val').innerText;
      let resultVal = `${addressVal1} ${addressVal2} ${addressVal3}`;
      return resultVal;
    }
  }
  class addressPicker extends picker{
    constructor(el,cb){
      super(el);
      this.callback = cb;
      this.init();
    }
    init(){
      //加载默认的省份数据
      super._data();
      this.bind();
    }
    bind(){
      /*弹出地址选择层*/
      this.pickerBtn.addEventListener('click',()=>{
        super.popupShow();
      },false);
      /*隐藏地址选择层*/
      this.closeBtn.addEventListener('touchstart',(e)=>{
        e.preventDefault();
        super.popupHide();
      },false);
      /*地址导航切换执行*/
      this.clickFun();
      this.provinceFun();
    }
    clickFun(){
      for(let i=0;i<this.viewLi.length;i++){
        this.viewLi[i].addEventListener('touchstart',()=>{
          for(let k=0;k<this.pickerContent.length;k++){
            this.pickerContent[k].style.display = 'none';
          }
          super.navSelectFun(i);
          if(this.viewLi[i].className.indexOf('province') != -1){
            this.popupContent.querySelector('.wheel_province').style.display = 'block';
          }else if(this.viewLi[i].className.indexOf('city') != -1){
            this.popupContent.querySelector('.wheel_city').style.display = 'block';
          }else if(this.viewLi[i].className.indexOf('area') != -1){
            this.popupContent.querySelector('.wheel_area').style.display = 'block';
          }
          if(i === 0){
            this.scroll.refresh();
          }else if(i === 1){
            this.cityScroll.refresh();
          }else if(i === 2){
            this.areaScroll.refresh();
          }
        },false)
      }
    }
    provinceFun(){
      /*选择省份*/
      for(let i=0;i<this.provinceItem.length;i++){
        this.provinceItem[i].onclick = ()=>{
          let currentVal = this.provinceItem[i].getAttribute('data-province');
          let itemVal = this.provinceItem[i].innerText;
          this.pickerViewBox.querySelector('.province_val').innerText = itemVal;
          let $this = null;
          super.selectFun(this.provinceItem,i);
          let wheelCity = this.el.querySelector('.wheel_city');
          if(wheelCity){
            this.popupContent.removeChild(wheelCity);
          }
          for(let i in this.cityData){
            if(currentVal === i){
              let cityArr = this.cityData[i].child;
              let o = this._addDom('wheel_city');
              for(let i in cityArr){
                let li = document.createElement('li');
                li.className = `wheel_item`;
                li.innerText = cityArr[i].name;
                li.setAttribute('data-city',i);
                o.ul.appendChild(li);
              }
              this.pickerContent = this.popupContent.querySelectorAll('.picker_content');
              this.viewLi = this.pickerViewBox.querySelectorAll('li');
              this.cityItem = o.ul.querySelectorAll('.wheel_item');
              this.wheelCity = this.el.querySelector('.wheel_city');
              $this = o.pickerContent;
              o.ul.setAttribute('data-province',currentVal);
              o.ul.parentNode.setAttribute('data-type','c');
              this.cityScroll = new BScroll(this.wheelCity,this.opts);
              this._height(o.pickerContent);
            }
          }
          let cityLi = this.pickerViewBox.querySelector('.city_val');
          let areaLi = this.pickerViewBox.querySelector('.area_val');
          if(cityLi){
            cityLi.innerText = '请选择';
          }else{
            super.addNavDom('city_val');
          }
          if(areaLi){
            areaLi.innerText = '请选择';
          }
          super.navHide();
          $this.style.display = 'block';
          super.navSelectFun(this.navIndex + 1);
          this.cityFun();
          this.clickFun();

        }
      }
    }
    cityFun(){
      /*选择城市*/
      for(let i=0;i<this.cityItem.length;i++){
        this.cityItem[i].onclick = ()=>{
          let currentVal = this.cityItem[i].getAttribute('data-city');
          let itemVal = this.cityItem[i].innerText;
          let parentDataProvince = this.cityItem[i].parentNode.getAttribute('data-province');
          this.pickerViewBox.querySelector('.city_val').innerText = itemVal;
          let $this = null;
          super.selectFun(this.cityItem,i);
          let wheelCity = this.el.querySelector('.wheel_area');
          if(wheelCity){
            this.popupContent.removeChild(wheelCity);
          }
          for(let i in this.cityData){
            if(parentDataProvince === i){
              let cityArr = this.cityData[i].child;
              for(let k in cityArr){
                if(currentVal === k){
                  let areaArr = cityArr[k].child;
                  let o = this._addDom('wheel_area');
                  for(let i in areaArr){
                    let li = document.createElement('li');
                    li.className = `wheel_item`;
                    li.innerText = areaArr[i];
                    li.setAttribute('data-city',i);
                    o.ul.appendChild(li);
                  }
                  this.pickerContent = this.popupContent.querySelectorAll('.picker_content');
                  this.viewLi = this.pickerViewBox.querySelectorAll('li');
                  this.areaItem = o.ul.querySelectorAll('.wheel_item');
                  this.wheelArea = this.el.querySelector('.wheel_area');
                  $this = o.pickerContent;
                  o.ul.setAttribute('data-city',currentVal);
                  this.areaScroll = new BScroll(this.wheelArea,this.opts);
                  this._height(o.pickerContent);
                }
              }
              let areaLi = this.pickerViewBox.querySelector('.area_val');
              if(areaLi){
                areaLi.innerText = '请选择';
              }else{
                super.addNavDom('area_val');
              }
              super.navHide();
              $this.style.display = 'block';
              super.navSelectFun(this.navIndex + 2);
              this.areaFun();
              this.clickFun();
            }
          }
        }
      }
    }
    areaFun(){
      for(let i=0;i<this.areaItem.length;i++){
        this.areaItem[i].onclick = ()=>{
          let itemVal = this.areaItem[i].innerText;
          this.pickerViewBox.querySelector('.area_val').innerText = itemVal;
          this.viewLi = this.pickerViewBox.querySelectorAll('li');
          super.selectFun(this.areaItem,i);
          this.clickFun();
          /*关闭弹窗*/
          this.popupHide();
          /*全部选择完毕 赋值*/
          this.callback(super.assignment());
        }
      }
    }
  }

module.exports = addressPicker;