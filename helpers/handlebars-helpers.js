const moment = require('moment');
//시간을 깔끔하게 출력시켜주는 모듈

module.exports = {
    generateTime: function (date, format) {
        return moment(date).format(format);
    },

}
