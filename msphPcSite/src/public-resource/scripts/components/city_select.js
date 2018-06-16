
const cityData = require('../data/city_data.js');
const citySelect = (()=>{
  "use strict";
  let _queue = [];
  class cityFun{
    constructor(dom){
      this.dom = dom;
      this.addressInput = this.dom.find('.address_input');
      this.inputVal = this.addressInput.find('.val');
      this.addressMenuPopup = this.dom.find('.address_menu_popup');
      this.searchPopup = this.dom.find('.search_letter_popup');
      this.tabBtn = this.addressMenuPopup.find('.tab_btn');
      this.hotContent = this.addressMenuPopup.find('.hot_tab_content');
      this.tabContent = this.addressMenuPopup.find('.tab_content');
      this.hotUl = this.hotContent.find('.content_ul');
      this.ul = this.tabContent.find('.content_ul');
      this.cityDate = require('../data/city_select_data');
      this.pCityData = require('../data/city_data.js');
      this.plateList = this.pCityData.citylist;
      this.cityList = this.cityDate.cityList;  //普通城市列表
      this.hotCity = this.cityDate.hotCity;
      this.regEx = /^([\u4E00-\u9FA5\uf900-\ufa2d]+)\|(\w+)\|(\w)\w*$/i;
    }
    hotDataRender(){  //热门城市数据渲染方法
      //console.log(this.hotCity);
      for(let i=0;i<this.hotCity.length;i++){
        let match = this.regEx.exec(this.hotCity[i])[1];
        let createSpan = $('<span data-city='+ match +'>'+ match +'</span>');
        this.hotUl.append(createSpan);
      }
    }
    cityDataRender(){  //按首字母渲染城市数据方法
      let letterArr = ()=>{  //获取到按钮上的字母
        let arr = [];
        this.tabBtn.each((index,value)=>{
          let $this = this.tabBtn.eq(index);
          if(!$this.hasClass('hot_city_btn')){
            arr.push($this.text());
          }
        });
        return arr;
      };
      let arr1 = letterArr();
      for(let i=0;i<arr1.length;i++){
        let newArr = arr1[i].split('');
        for(let k=0;k<newArr.length;k++){
          let createDiv = $('<div class="letter_list_box"><label class="letter">'+ newArr[k] +'</label><div class="span_box"></div></div>');
          this.ul.eq(i+1).append(createDiv);
        }
      }
      this.spanBox = this.ul.find('.span_box');
      let eachArr = (match)=>{
        let arr = letterArr();
        let index = 0;
        for(let i=0;i<arr.length;i++){
          if(arr[i].indexOf(match) !== -1){
            index = i;
          }
        }
        return index;
      };
      for(let i=0;i<this.cityList.length;i++){
        let match = this.regEx.exec(this.cityList[i])[3].toUpperCase();
        let textVal = this.regEx.exec(this.cityList[i])[1];
        let index = eachArr(match) + 1;
        let letter = this.ul.find('.letter');
        letter.each((index)=>{
          let $this = letter.eq(index);
          if(match === $this.text()){
            let createSpan = $('<span data-city='+ textVal +'>'+ textVal +'</span>');
            $this.next().append(createSpan);
          }
        });
      }
    }
    searchDataRender(val){  //搜索结果的数据渲染
      let newVal = val.replace(/'/g,'');
      let flag = true;
      let flagArr = [];
      let newValLength = newVal.length;
      let searchFun = ()=>{
        for(let i=0;i<this.cityList.length;i++){
            let match = this.regEx.exec(this.cityList[i])[0];
            let letterArr = match.split('|');
            for(let k=0;k<letterArr.length;k++){
              if(letterArr[k].substr(0,newValLength) == newVal){
                let textVal = letterArr[0];
                let createSpan = $('<li class="search_val">'+ textVal +'</li>');
                this.searchPopup.append(createSpan);
                flagArr.push(true);
                break;
              }else{
                flagArr.push(false);
              }
            }
        }

        for(let i=0;i<flagArr.length;i++){
          if(flagArr[i]){
            flag = true;
            break;
          }else{
            flag = false;
          }
        }

        if(!flag){
          let createSpan = $('<li class="no_search_val">'+ '没有检索到信息' +'</li>');
          console.log('没有检索到信息');
          this.searchPopup.append(createSpan);
          this.searchLi = null;
        }
      };
      if(newVal === ''){
        this.searchPopupHide();
        this.popupShow();
        return false;
      }else{
        this.popupHide();
        this.searchPopup.empty();
        searchFun();
      }
      this.searchLi = this.searchPopup.find('.search_val');
    }
    popupShow(){  //点击弹窗出现
      this.addressMenuPopup.show();
    }
    popupHide(){  //点击弹窗消失
      this.addressMenuPopup.hide();
    }
    searchPopupShow(){
      this.searchPopup.show();
    }
    searchPopupHide(){
      this.searchPopup.hide();
    }
  }

  class cityOperate extends cityFun{
    constructor(dom){
      super(dom);
      this.init();
    }
    init(){
      super.hotDataRender();  //执行渲染热门城市的列表方法
      super.cityDataRender();  //执行渲染城市的列表方法
      this.span = this.ul.find('span');
      this.bind();
    }
    bind(){
      this.inputVal.on('focus',(event)=>{
        let val = this.inputVal.val();
        if(val === ''){
          this.popupShow();
        }else{
          this.popupHide();
        }
      });
      this.span.each((index)=>{
        this.span.eq(index).on('click',(event)=>{
          let val = this.span.eq(index).text();
          this.inputVal.val(val);
          this.popupHide();
          event.stopPropagation()
        });
      });
      this.inputVal.on('keyup',(event)=>{
        let val = this.inputVal.val();
        this.searchPopupShow();
        this.searchDataRender(val);
        this.searchLi.each((index)=>{
          this.searchLi.eq(index).on('click',(event)=>{
            let val = this.searchLi.eq(index).text();
            this.inputVal.val(val);
            this.searchPopupHide();
          })
        });
      });
      this.addressInput.on('click',(event)=>{
        event.stopPropagation()
      });
      $(document).on('click',()=>{
        this.popupHide();
      })
    }
  }
  return (el)=>{
    //判断传进来的el是dom对象还是字符串
    let wrapper = typeof el === 'string' ? $(el) : el;
    wrapper.each((index)=>{
      let $this = wrapper.eq(index);
      if($this.hasClass('init')) return false;
      _queue.push(new cityOperate($this));
      $this.addClass('init');
    });
  };

})();

module.exports = citySelect;