require('./financ_list.less');

const tabSwitch = require('../../../public-resource/scripts/components/tab_switch');
const popover = require('../../../public-resource/components/popover/popover');
$(()=>{
  "use strict";
  tabSwitch('.tab_box');
  popover.move('.popup_btn');
  /*页面筛选操作*/
  let pageJs = {
    init:function(dom,callback){
      this.window = $(window);
      this.dom = $(dom);
      this.callback = callback;
      this.popupMiddleContent = this.dom.find('.popup_middle_content');
      this.topTitleBox = this.dom.find('.top_title_box');
      this.btnBox = this.dom.find('.btn_box');
      this.resetBtn = this.btnBox.find('.reset_btn');
      this.finishBtn = this.btnBox.find('.finish_btn');
      //this.conLi = this.popupMiddleContent.
      this.conBox = this.popupMiddleContent.find('.con_box');
      this.reset();
      this.bind();
      this.conClickFun();
    },
    reset:function(){
      var _height = this.window.height() - (this.topTitleBox.height() + this.btnBox.height());
      this.popupMiddleContent.css({
        height:_height
      });
    },
    bind:function(){
      var that = this;
      this.resetBtn.on('click',function(){
        that.conBox.each(function(){
          $(this).find('.con_li').removeClass('active');
        });
      });
      this.finishBtn.on('click',function(){
        that.callback();
      })
    },
    conClickFun:function(){
      var that = this;
      this._queue = [];
      this.conBox.each(function(){
        var $this = $(this);
        if($this.hasClass('init')){
          return;
        }
        that._queue.push(new conLiFun($this));
        $this.addClass('init');
      });

      function conLiFun(dom){
        this.dom = dom;
        this.conLi = this.dom.find('.con_li');
        this.bind = function(){
          var that = this;
          this.conLi.on('click',function(){
            var $this = $(this);

            if($this.hasClass('active')){
              $this.removeClass('active');
            }else{
              that.conLi.removeClass('active');
              $this.addClass('active');
            }
          });
        };
        this.bind();
      };
    }
  };
  let callback = function(){   //点击完成按钮 后端操作函数

  };
  pageJs.init('.pull_right_popup',callback);

  function Mvvm(options = {}){
    this.$options = options;
    let data = this._data = this.$options.data;
    //数据劫持
    Observe(data);
    for(let key in data){
      Object.defineProperty(this,key,{
        configurable:true,
        get(){
          return this._data[key];
        },
        set(newVal){
          this._data[key] = newVal;
        }
      })
    }
    new Compile(options.el,this);
  }

  function Observe(data){
    for(let key in data){
      let val = data[key];
      observe(val);  //使用递归来实现不断的往下查找对象
      Object.defineProperty(data,key,{
        configurable:true,
        get(){
          return val;
        },
        set(newVal){
          if(val === newVal){
            return;
          }
          val = newVal;
          observe(newVal)
        }
      })
    }
  }

  function observe(data){
    if(!data || typeof data !== 'object') return;
    return new Observe(data);
  }

  function Compile(el,vm){
    /*将el挂载到实例上方便调用*/
    vm.$el = document.querySelector(el);

    let fragment = document.createDocumentFragment();
    let child = vm.$el.firstChild;
    while(child = vm.$el.firstChild){
       fragment.appendChild(child);
     }
     //对el里面的内容进行替换
    function replace(frag){
      Array.from(frag.childNodes).forEach(node => {
        let txt = node.textContent;
        let reg = /\{\{([.|\w]*)\}\}/;   // 正则匹配{{}}
        if(node.nodeType === 1 && reg.test(txt)){
          let arr = RegExp.$1.split('.');
          let val = vm;
          arr.forEach(key => {
            val = val[key];
          });
          //node.textContent = txt.replace(reg,val).trim();
          new Watcher(vm,RegExp.$1,newVal => {
            node.textContent = txt.replace(reg,newVal).trim();
          })
        }
        if(node.childNodes && node.childNodes.length){
          replace(node);
        }
      })
    }
    replace(fragment);
    //将文档碎片放入el中
    vm.$el.appendChild(fragment);
  }
  function Dep(){
    //一个数组(存放函数的事件池)
    this.subs = [];
  }

  Dep.prototype = {
    addSub(sub){
      this.subs.push(sub);
    },
    notify(){
      //绑定的方法,都有一个update方法
      this.subs.forEach(sub => sub.update());
    }
  }

  function Watcher(vm,exp,fn){
    this.fn = fn;
    this.vm = vm;
    this.exp = exp;
    Dep.target = this;
    let arr = exp.split('.');
    let val = vm;
    arr.forEach(key => {
      val = val[key];
    });
    Dep.target = null;
  }

  // function Dep(){
  //   //一个数组(存放函数的事件池)
  //   this.subs = [];
  // }
  //
  // Dep.prototype = {
  //   addSub(sub){
  //     this.subs.push(sub);
  //   },
  //   notify(){
  //     //绑定的方法,都有一个update方法
  //     this.subs.forEach(sub => sub.update());
  //   }
  // }

  // function Watcher(fn){
  //   this.fn = fn;
  // }
  //
  // Watcher.prototype.update = function(){
  //   this.fn();
  // };
  //
  // let watcher = new Watcher(()=> console.log(111));
  // let dep = new Dep();
  // dep.addSub(watcher); //将watcher放到数组中,watcher自带update方法, => [watcher]
  // dep.notify();

  let mvvm = new Mvvm({
    el:'#app',
    data:{
      a:{
        b:1
      },
      c:2
    }
  });




});