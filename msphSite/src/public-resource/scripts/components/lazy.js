/*图片懒加载*/
// 可以在回调里实现对每个元素出现在窗口的任何数据加载
const Exposure = (()=>{
    let  _queue = [];
    let _isBind = false;

    let one =($selectors,callback)=>{  //js文件调用入口
        //默认执行文件内封装的接口
        let wrapper = typeof $selectors === 'string' ? document.querySelectorAll('.lazy') : $selectors;
        _add(wrapper,callback);
        _init();
    };

    let _add = ($selectors,callback)=>{
        let _count = $selectors.length;  //dom元素的长度
        for(let i =0; i<_count;i++){
            let o = {
                el:$selectors[i],
                cb:callback
            };
            _queue.push(o);
        };
    };

    let _init = ()=>{
        if(!_isBind){
            _bind();
        }
        _do();
    };

    let _bind = ()=>{  //绑定事件
        let timer = null,
            interval = 100;

        window.onscroll = ()=>{
            timer = setTimeout(()=>{
                _do();
            },interval);
        };
        _isBind = true;
    };

    let _do = ()=>{
        let arrTmp = [];
        for(let i=0;i<_queue.length;i++){
            let item = _queue[i];
            if(_isShow(item.el)){
                item.cb.call(item.el);
            }else{
                arrTmp.push(item);
            }
        }
        _queue = arrTmp;
    };

    let _isShow = ($el)=>{
        let scrollH = document.documentElement.scrollTop || document.body.scrollTop;
        let _top = _toTop($el);
        let winH = document.documentElement.clientHeight;
        if(_top < scrollH + winH){
            return true;
        }else{
            return false;
        }
    };

    let _toTop = (obj)=>{  //获取到图片距离顶部的距离
        let iTop = 0;
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