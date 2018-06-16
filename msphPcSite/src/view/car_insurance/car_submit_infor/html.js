const content = require('./car_submit_infor.ejs');
const renderData = require('../../../public-resource/layout/layout.js');
module.exports = content(renderData(['addressManage']));