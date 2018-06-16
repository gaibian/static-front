const content = require('./index.ejs');
const renderData = require('../../public-resource/layout/layout.js');

//公共模板的参数

module.exports = content(renderData());