const content = require('./car_second_apply.ejs');
const renderData = require('../../../public-resource/layout/layout.js');

module.exports = content(renderData(['listPaging']));