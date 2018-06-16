
// (function(global,factory){
//   "use strict";
//   module.exports = factory();
// })(this,(function(){
//   "use strict";
//
// })());

const fn = (function(global,factory){
  "use strict";
  module.exports = factory;
  console.log(global);
})(this,function(){
  "use strict";
  console.log('xiaonan');

  var emptyObject = Object.freeze({});

  function isUndef(v){
    return v === undefined || v === null;
  }

  function isDef(v){
    return v !== undefined && v !== null;
  }

  //判断类型是不是等于
  function isTrue(v){
    return v === true;
  }

  function isFalse(v){
    return v === false;
  }

  if(isFalse(false)){
    console.log('true');
  }else{
    console.log('false');
  }
});