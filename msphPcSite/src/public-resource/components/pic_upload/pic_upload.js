require('./pic_upload.less');
const picUpLoad = (()=>{
  "use strict";
  let _queue = [];
  class upload{
    constructor(opt){
      this.opt = opt;
      this.filechooser = document.querySelector(this.opt.input);
      //用于压缩图片的canvas
      this.canvas = document.createElement("canvas");
      this.ctx = this.canvas.getContext('2d');
      //瓦片 canvas
      this.tCanvas = document.createElement("canvas");
      this.tctx = this.tCanvas.getContext('2d');
      this.btn = document.querySelector(this.opt.btn);
      this.defaultOpt = Object.assign({},{
        maxsize:100 * 1024,  //图片不压缩值的界限
        compressRatio:8,  //canvas图片压缩的系数
        uploadCount:9,  //最大上传图片的个数
      },this.opt);
      console.log(this.defaultOpt);
      this.stateArr = [];
      this.bind();
    }
    bind(){
      this.btn.addEventListener('click',()=>{
        this.filechooser.click();
      },false);
      this.btn.addEventListener('touchstart',()=>{
        this.btn.className = this.btn.className + ' touch';
      },false);
      this.btn.addEventListener('touchend',()=>{
        this.btn.className = this.btn.className.replace(' touch','');
      },false);
      this.filechooser.addEventListener('change',()=>{
        this.changeFun();
      },false)
    }
    changeFun(){
      this.stateArr = [];
      let file = this.filechooser.files;
      if(!file.length) return false;
      let files = Array.prototype.slice.call(file);

      if(files.length > this.defaultOpt.uploadCount){
        alert("最多同时可以上传9张图片");
        return false;
      }
      this.promptPopup('正在上传当中...');
      files.forEach((file,i)=>{
        //判断上传的图片的格式
        if (!/\/(?:jpeg|png|gif)/i.test(file.type)) return false;
        let reader = new FileReader();
        //图片加载完成
        let that = this;
        reader.onload = function(){
          let result = this.result;
          let img = new Image();
          img.src = result;
          //如果图片大小小于100kb,则直接上传
          if(result.length <= that.defaultOpt.maxsize){
            img = null;
            //执行上传
            that.upload(result,file.type,i,files.length);
            return false;
          }
          //图片加载完毕进行前端压缩
          let callback = ()=>{
            let data = that.compress(img);
            //压缩完成执行上传
            that.upload(data,file.type,i,files.length);
          }
          //判断图片是否加载完毕
          if(img.complete){
            callback();
          }else{
            img.onload = callback;
          }
        };
        //读取文件的时候发生错误
        reader.onerror = function(e){

        };
        reader.readAsDataURL(file);
      });
    }
    //获取图片的大小
    imgSize(file){
      return file.size / 1024 > 1024 ? (~~(10 * file.size / 1024 / 1024)) / 10 + "MB" : ~~(file.size / 1024) + "KB";
    }
    //上传图片的提示框
    promptPopup(msg){
      let dom = document.createElement('div');
      dom.innerHTML = `<div class="message_content">${msg}</div><div class="v_modal"></div>`;
      let body = document.querySelector('body');
      dom.className = 'upload_prompt_popup';
      body.appendChild(dom);
      let messageDom = dom.querySelector('.message_content');
      setTimeout(()=>{
        messageDom.className = `${messageDom.className} upload_active`;
      },10);
    }
    //使用canvas对大图进行压缩
    compress(img){
      //图片的大小
      let initSize = img.src.length;
      let width = img.width;
      let height = img.height;
      //如果图片大于四百万像素，计算压缩比并将大小压至400万以下
      let ratio;
      if((ratio = width * height / 4000000) > 1){
        ratio = Math.sqrt(ratio);
        width /= ratio;
        height /= ratio;
      }else{
        ratio = 1;
      }

      this.canvas.width = width;
      this.canvas.height = height;

      //铺底色
      this.ctx.fillStyle = '#fff';
      this.ctx.fillRect(0,0,this.canvas.width,this.canvas.height);

      //如果图片像素大于100万则使用瓦片绘制
      let count;
      if((count = width * height / 1000000) > 1){
        count = ~~(Math.sqrt(count) + 1);  //计算要分成多少块瓦片

        //计算每块瓦片的宽和高
        let nw = ~~(width / count);
        let nh = ~~(height / count);

        this.tCanvas.width = nw;
        this.tCanvas.height = nh;

        for (let i = 0; i < count; i++) {
          for (let j = 0; j < count; j++) {
            this.tctx.drawImage(img, i * nw * ratio, j * nh * ratio, nw * ratio, nh * ratio, 0, 0, nw, nh);
            this.ctx.drawImage(this.tCanvas, i * nw, j * nh, nw, nh);
          }
        }
      }else{
        this.ctx.drawImage(img,0,0,width,height);
      }

      //进行最小压缩
      let ndata = this.canvas.toDataURL('image/jpeg',this.defaultOpt.compressRatio);
      // console.log('压缩前：' + initSize);
      // console.log('压缩后：' + ndata.length);
      // console.log('压缩率：' + ~~(100 * (initSize - ndata.length) / initSize) + "%");
      this.tCanvas.width = this.tCanvas.height = this.canvas.width = this.canvas.height = 0;
      return ndata;
    }
    //图片预览
    preview(){

    }
    //图片执行上传
    upload(basestr,type,i,length){
      let fd = new FormData();
      fd.append('mypic',basestr);
      let xhr = new XMLHttpRequest();
      xhr.open('post',this.defaultOpt.url);  //上传的地址
      if(typeof fd == 'undefined'){
        xhr.setRequestHeader("Content-type","application/x-www-form-urlencoded");
      }
      xhr.send(fd);
      xhr.onreadystatechange = ()=>{
        //请求事件的注册通过
        if(xhr.readyState == 4 && xhr.status == 200){
          //请求成功返回数据
          let jsonData = JSON.parse(xhr.responseText);
          this.stateArr.push(jsonData);
          console.log(this.stateArr)
          console.log(length);
          if(this.stateArr.length === length){
            this.defaultOpt.callback(this.stateArr);
            let message = '上传成功';
            let promptPopup = document.querySelector('.upload_prompt_popup');
            let messageContent = document.querySelector('.message_content');
            messageContent.innerText = message;
            setTimeout(()=>{
              promptPopup.remove();
            },500)
          }
        }
      };
    }
  }
  return (opt)=>{
    _queue.push(new upload(opt));
  }
})();

module.exports = picUpLoad;