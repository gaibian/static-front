
/*cdn服务器和本地虚拟服务器转换*/
const serverFlag = false;  //true 打包启动cdn地址  false启动本地虚拟地址
const site = `lingfen`;
let csCdn = ``;
serverFlag ? csCdn = `http://cdn.upingou.com` : csCdn = ``;
const siteStatic = `${site}Static`;

let local = false;
if(!serverFlag && local){
  local = true;
}else{
  local = false;
}

const option = {
  local:local,
  flag:serverFlag,
  site:`${site}Site`,  //打包配置启动根目录
  siteStatic:siteStatic,  //静态服务器地址文件根目录
  scCdn:`http://cdn.msphcn.com`,  //正式服务器cdn地址
  csCdn:csCdn,  //测试服务器cdn地址
};

module.exports = option;

//需要改变打包命令的模式
//主要区分本地调式和cdn打包和不是cdn服务器打包

//一.开发环境不需要执行的操作
//1.css和js文件的压缩步骤
//2.打包第三方文件
//3.不需要开启gZip压缩
//4.不需要添加hash值

//生成环境不需要执行的操作
//1.不用开启热更新替换
//2.打包进去jquery文件