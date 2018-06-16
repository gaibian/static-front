
const content = require('./achievement_query.ejs');
const renderData = require('../../../public-resource/layout/layout.js');

/*给模板传递参数*/
const opt = {
  title:'这是标题',
};
module.exports = content(renderData(opt));