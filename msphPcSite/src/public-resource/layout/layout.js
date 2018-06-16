/*构建前端模板系统的js*/
//注意模板之间的嵌套最多只能两层
module.exports = (needArr,templates)=>{
  "use strict";
  //needArr 当前页面需要导入的模板名称
  /*所有页面公共的静态模板 => 不需要传递参数的模板*/
  let resultModule = {
    layout:require('../components/layout.ejs'),
    pageNav:require('../components/page_nav/page_nav.ejs'),
    pageTopNav:require('../components/page_top_nav/page_top_nav.ejs'),
    sideContact:require('../components/side_contact/side_contact.ejs'),
    footerNav:require('../components/footer_nav/footer_nav.ejs'),
  };
  //业务模板
  let pageModule = {
    carSubmit:require('../page_module/car_submit/car_submit.ejs'),
    carError:require('../page_module/car_error/car_error.ejs'),
    carSuccess:require('../page_module/car_success/car_success.ejs'),
    carSubmitSuccess:require('../page_module/car_submit_success/car_submit_success.ejs'),
  };
  /*需要导入的模板*/
  const tempalte = {
    contentHeader:require('../components/content_header/content_header.ejs'),
    listPaging:require('../components/list_paging/list_paging.ejs'),
    navList:require('../components/nav_list/nav_list.ejs'),
    addressManage:require('../components/address_manage/address_manage.ejs'),
    addressChoice:require('../components/address_choice/address_choice.ejs'),
  };
  if(needArr){
    for(let i=0;i<needArr.length;i++){
      let $this = needArr[i];
      for(let key in tempalte){
        if(key === $this){
          resultModule[$this] = function(opts,tpe){
            /*如果参数传递进来的是带有模板*/
            let tpeArr = [];
            for(let n in arguments){
              //如果传递的参数是数组
              if(arguments[n] instanceof Array){
                tpeArr = arguments[n];
              }
            }
            if(tpeArr){
              for(let i=0;i<tpeArr.length;i++){
                let $tpe = tpeArr[i];
                for(let k in tempalte){
                  if(k === $tpe){
                    opts[$tpe] = o =>{
                      return tempalte[k](o);
                    };
                  }
                }
              }
              return tempalte[key](opts);
            }else{
              return tempalte[key](opts);
            }
          };
        }
      }
    }
  }
  return Object.assign({},resultModule,pageModule,templates);
};
