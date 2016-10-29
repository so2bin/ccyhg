/************************************************
 *
 *  定义时间相关的函数
 *
 */

module.exports = {

  /**
   * 日期格式化
   * 针对 yyyy/YYYY MM DD/dd HH/hh mm ss/SS来处理
   * @param date
   * @param formatStr : yyyy-MM-dd hh:mm:ss
   */
  dateFormat: function (date, formatStr) {
    if (!formatStr || !date instanceof Date) {
      throw 'parameters in dateFormat() incorrect!';
    }
    var str = formatStr;
    str     = str.replace(/yyyy|YYYY/, date.getFullYear());
    str     = str.replace(/MM/, date.getMonth() + 1 > 9 ? date.getMonth() + 1 : ('0' + (date.getMonth() + 1).toString()));
    str     = str.replace(/dd|DD/, date.getDate() > 9 ? date.getDate() : ('0' + date.getDate().toString()));
    str     = str.replace(/hh|HH/, date.getHours() > 9 ? date.getHours() : ('0' + date.getHours().toString()));
    str     = str.replace(/mm/, date.getMinutes() > 9 ? date.getMinutes() : ('0' + date.getMinutes().toString()));
    str     = str.replace(/ss|SS/, date.getSeconds() > 9 ? date.getSeconds() : ('0' + date.getSeconds().toString()));
    return str;
  }


};