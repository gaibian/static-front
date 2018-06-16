
const content = require('./c_record.ejs');
const renderData = require('../../../public-resource/layout/layout.js');
module.exports = content(renderData({
  title:'这是标题',
}));