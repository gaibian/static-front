/*图片懒加载*/
// 可以在回调里实现对每个元素出现在窗口的任何数据加载
const Exposure = (function(){
    let  _queue = [];
    let _isBind = false;

    function one($selectors,callback){  //js文件调用入口
        //默认执行文件内封装的接口
        _add($selectors,callback);
        _init();
    };

    function _add($selectors,callback){
        var _count = $selectors.length;  //dom元素的长度
        for(let i =0; i<_count;i++){
            var o = {
                el:$selectors[i],
                cb:callback
            };
            _queue.push(o);
        };
    };

    function _init(){
        if(!_isBind){
            _bind();
        }
        _do();
    };

    function _bind(){  //绑定事件
        var timer = null,
            interval = 100;

        window.onscroll = function(){
            timer = setTimeout(function(){
                _do();
            },interval);
        };
        _isBind = true;
    };

    function _do(){
        var arrTmp = [];
        var _arrTmp = [];
        for(let i=0;i<_queue.length;i++){
            var item = _queue[i];
            if(_isShow(item.el)){
                item.cb.call(item.el);
            }else{
                arrTmp.push(item);
            }
        }
        _queue = arrTmp;
    };

    function _isShow($el){
        var scrollH = document.documentElement.scrollTop || document.body.scrollTop;
        var _top = _toTop($el);
        var winH = document.documentElement.clientHeight;
        if(_top < scrollH + winH){
            return true;
        }else{
            return false;
        }
    };

    function _toTop(obj){  //获取到图片距离顶部的距离
        var iTop = 0;
        while(obj){
            iTop += obj.offsetTop;
            obj = obj.offsetParent;
        }
        return iTop;
    }

    return {
        one:one
    }

})();


module.exports = Exposure;