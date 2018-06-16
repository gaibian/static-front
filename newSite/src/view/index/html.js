const content = require('./index.ejs');
const renderData = require('../../public-resource/layout/layout.js');

//导入业务场景需要的模板名称
module.exports = content(renderData(['test']));