const path = require('path');
const webpack = require('webpack');
const glob = require('glob');
const CommonsChunkPlugin = webpack.optimize.CommonsChunkPlugin;  //提取共同依赖代码插件
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const SpritesmithPlugin = require('webpack-spritesmith');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const WebpackDevServer = require('webpack-dev-server');
const CompressionPlugin = require('compression-webpack-plugin');
const UglifyJsPlugin = webpack.optimize.UglifyJsPlugin;
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const configAddress = require('./webpack.dll.config.js');
const debug = !configAddress.flag;  //控制是开发环境还是上线环境
const getEntry1 = `${configAddress.site}/src/view/**/*.js`;
const getEntry2 = `${configAddress.site}/src/view`;

let distinct = function (arr){
  var arr = arr,i,obj = {},result = [],len = arr.length;
  for(i = 0; i< arr.length; i++){
    if(!obj[arr[i]]){ //如果能查找到，证明数组元素重复了
      obj[arr[i]] = 1;
      result.push(arr[i]);
    }
  }
  return result;
};
/*过滤带有html字符的值*/
let entryFun = (o)=>{
  "use strict";
  let entriess = {};
  if(debug){
    for(let i in o){
      if(o[i].indexOf('html') === -1){
        entriess[i] = o[i];
      }
    }
  }else{
    for(let k in o){
      if(o[k][0].indexOf('html') === -1){
        let arr = k.split('\\');
        if(arr.length > 2){
          let newArr = distinct(arr).join('\\');
          entriess[newArr] = o[k];
        }else{
          entriess[k] = o[k];
        }
      }
    }
  }
  return entriess;
};


let localFun = ()=>{
  "use strict";
  let publicPath = '';
  if(configAddress.local){
    publicPath = '../../';
  }else{
    publicPath = '/' + configAddress.siteStatic + '/';
  }
  return publicPath;
};
//console.log(resolve('src'));
//const chunks = Object.keys(entries);
let entryArr = entryFun(getEntry(getEntry1,getEntry2));
console.log(path.join(__dirname,`${configAddress.site}`));
const config = {
  stats:"errors-only",
  entry: entryArr,
  output: {
    path: path.join(__dirname, `${configAddress.site}/${configAddress.siteStatic}`),
    publicPath:configAddress.csCdn + localFun(),
    filename: 'js/[name].js',
    chunkFilename: 'js/[id].[chunkhash:8].js'
  },
  resolve: {
    extensions: ['.js', '.vue', '.less'],
    alias: {
      '@':path.join(__dirname,`${configAddress.site}/src`),
      'module':'@/public-resource/components',
      'imgs':'@/public-resource/imgs',
      'less':'@/public-resource/less',
      'js':'@/public-resource/scripts'
    }
  },
  devServer:{
    contentBase:path.join(__dirname, configAddress.site + '/' + configAddress.siteStatic),
    publicPath:'/'+configAddress.siteStatic+'/',
    hot:true,
    inline:true,
    progress:true,
    port:8080,
    stats:"errors-only"
  },
  module: {
    loaders: [
       {
        test: /\.less$/,
         use: ExtractTextPlugin.extract([
           {
             loader: 'css-loader',
             options: {
               minimize: true,
               '-autoprefixer': true,
             },
           },
           {
             loader: 'less-loader',
           },
         ]),
      },{
        test: /\.css$/,
        use: ExtractTextPlugin.extract([
          {
            loader: 'css-loader',
            options: {
              minimize: true,
              '-autoprefixer': true,
            },
          },
          {
            loader: 'postcss-loader',
          },
        ]),
        // loader:['style-loader','css-loader']
      },{
            test:/\.js$/,
            exclude:/node_modules/,
            loader:'babel-loader',
            query:{
              presets:['es2015',[
                'env',{
                  "loose":true,
                  "modules":false
                }
              ]],
              plugins:['transform-runtime']
            }
        }, {
        test: /\.html$/,
        loader: 'html-loader?attrs=img:src img:data-src'
      }, {
        test: /\.(woff|woff2|ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        loader: 'file-loader?name=./fonts/[name].[ext]'
       },
      {
        test: /\.(png|jpg|gif)$/,
        loader: 'url-loader?limit=8192&name=img/[hash].[ext]'
      },
        {
            test:/\.art$/,
            use:['art-template-loader']
        },
      {
        test: /\.ejs$/,
        //include: dirVars.srcRootDir,
        loader: 'ejs-loader',
      }
    ]
  },

  plugins: [
    debug ? function(){} : new CopyWebpackPlugin([
        {
          from:path.join(__dirname,configAddress.site + '/src/bin/'),
          to:path.join(__dirname,configAddress.site + '/' + configAddress.siteStatic+'/bin')
        },
    ],{
        ignore:[],
        copyUnmodified:true,
        debug:"debug"
    }),
    // debug ? function(){} : new webpack.ProvidePlugin({ // 加载jq
    //   $: 'jquery',
    //     jQuery:'jquery',
    // }),
    // new webpack.optimize.CommonsChunkPlugin({
    //   name: 'vendors',
    //   chunks: chunks,
    //   minChunks: chunks.length // 提取所有entry共同依赖的模块
    // }),
    //压缩js代码
    debug ? function(){} : new UglifyJsPlugin({ // 压缩代码
      comments:false,  //去掉注释
      compress: {
        warnings: false
      },
      except: ['$super', '$', 'exports', 'require'] // 排除关键字
    }),

    debug ? function (){} : new CompressionPlugin({ //开启gizp压缩，但是没效果
      asset: "[path].gz[query]",
      algorithm: "gzip",
      test: /\.js$|\.css$|\.html$/,
      threshold: 10240,
      minRatio: 0.8
    }),

    new ExtractTextPlugin('css/[name].css',{
      allChunks:true
    }), // 单独使用link标签加载css并设置路径，相对于output配置中的publickPath
    new OptimizeCssAssetsPlugin({
      assetNameRegExp: /\.optimize\.css$/g,
      cssProcessor: require('cssnano'),
      cssProcessorOptions: { discardComments: {removeAll: true } },
      canPrint: true
    }),
      //合成雪碧图
    // new SpritesmithPlugin({
    //     src:{
    //       cwd:path.resolve(__dirname,configAddress.site + '/src/img/icons/'),
    //         glob:'*.png'
    //     },
    //     target:{
    //       image:path.resolve(__dirname,configAddress.site + '/' + configAddress.siteStatic +'/sprites/sprite.png'),
    //       css:path.resolve(__dirname,configAddress.site + '/' + configAddress.siteStatic + '/sprites/sprite.css')
    //     },
    //     apiOptions:{
    //       cssImageRef:'../sprite/sprite.png'
    //     },
    //     spritesmithOptions:{
    //       algorithm:'top-down'
    //     }
    // }),

    new webpack.HotModuleReplacementPlugin()
  ],
};

//编写所有的html模板
const page1 = `${configAddress.site}/src/view/**/*.js`;
const page2 = `${configAddress.site}/src/view`;
const pages = Object.keys(getEntry(page1,page2));

let newHtmlArr = [];
let index = 0;
for(let i=0;i<pages.length;i++){
  if(index > pages.length -1){
    break;
  }else{
    let arr1 = [];
    arr1.push(pages[index]);
    arr1.push(pages[index+1]);
    index = index + 2;
    newHtmlArr.push(arr1);
  }
}

newHtmlArr.forEach(function(pathname){
  const conf = {};
  let htmlname = ``;
  let jsname = ``;
  for(let i=0;i<pathname.length;i++){
    if(pathname[i].indexOf('html') === -1){
      htmlname = pathname[i];
    }else{
      jsname = pathname[i];
    }
  }
  let newName = ``;
  if(debug){
    newName = htmlname;
  }else{
    let nameArr = htmlname.split('\\');
    if(nameArr.length > 2){
      newName = distinct(nameArr).join('\\');
    }else{
      newName = htmlname;
    }
  }



  conf.filename = `./view/${newName}.html`;
  conf.template = `${configAddress.site}/src/view/${jsname}.js`;
  conf.title = `按照ejs模板生成的页面`;

  if(newName in config.entry){
    //conf.favicon = path.resolve(__dirname, configAddress.site + '/src/img/users_ico.ico');
    conf.inject = `body`;
    conf.chunks = [`vendors`,newName];
    conf.hash = true;
  }
  config.plugins.push(new HtmlWebpackPlugin(conf));

});

module.exports = config;

//编写所有的js入口模板循环
function getEntry (globPath, pathDir) {
  let files = glob.sync(globPath);
  let entries = {}, entry, dirname, basename, pathname, extname;

  for (let i = 0; i < files.length; i++) {
    entry = files[i];
    dirname = path.dirname(entry);
    extname = path.extname(entry);
    basename = path.basename(entry, extname);
    pathname = path.normalize(path.join(dirname, basename));
    pathDir = path.normalize(pathDir);
    if (pathname.startsWith(pathDir)) {
      pathname = pathname.substring(pathDir.length+1);
    }

    entries[pathname] = ['./' + entry];

  }
  return entries;

}










