const content = require('./financ_list.ejs');
const renderData = require('../../../public-resource/layout/layout.js');

module.exports = content(renderData({
  title:'这是标题',
}));