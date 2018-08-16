
const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const timestampToTime = function(timestamp) {
  var date = new Date(timestamp);//时间戳为10位需*1000，时间戳为13位的话不需乘1000
  var Y = date.getFullYear() + '-';
  var M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
  var D = date.getDate() + ' ';
  var h = date.getHours() + ':';
  //var m = date.getMinutes() + ':';
  var m = date.getMinutes() ;
  // var s = date.getSeconds();
  return Y+M+D+h+m;
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

/**
 * 计算当前月分有多少天 
 */
const getCountDays = function () {
  var curDate = new Date();
  // 获取当前月份
  var curMonth = curDate.getMonth();
  // 实际月份比curMonth大1，下面将月份设置为下一个月
  curDate.setMonth(curMonth + 1);
  // 将日期设置为0，表示自动计算为上个月（这里指的是当前月份）的最后一天
  curDate.setDate(0);
  // 返回当前月份的天数
  return curDate.getDate();
}
/** 
* 时间戳转化为年 月 日 时 分 秒 
* number: 传入时间戳 
* format：返回格式，支持自定义，但参数必须与formateArr里保持一致 
*/
function formatTimeTwo(number, format) {

  var formateArr = ['Y', 'M', 'D', 'h', 'm', 's'];
  var returnArr = [];

  var date = new Date(number * 1000);
  returnArr.push(date.getFullYear());
  returnArr.push(formatNumber(date.getMonth() + 1));
  returnArr.push(formatNumber(date.getDate()));

  returnArr.push(formatNumber(date.getHours()));
  returnArr.push(formatNumber(date.getMinutes()));
  returnArr.push(formatNumber(date.getSeconds()));

  for (var i in returnArr) {
    format = format.replace(formateArr[i], returnArr[i]);
  }
  return format;
}
const getCountWeek = function () {
  var myDate = new Date()
  myDate.setMonth(myDate.getMonth());
  myDate.setDate(1);
  return myDate.getDate()
}

/**
 * 浮點數除法
 * @param {} arg1 
 * @param {*} arg2 
 */
const accDiv = function (arg1, arg2) {
  var t1 = 0, t2 = 0, r1, r2;
  try {
    t1 = arg1.toString().split(".")[1].length
  } catch (e) {
  } try {
    t2 = arg2.toString().split(".")[1].length
  } catch (e) { }

    r1 = Number(arg1.toString().replace(".", ""))
    r2 = Number(arg2.toString().replace(".", ""))
    return (r1 / r2) * pow(10, t2 - t1);
  
}

/**
 * 浮点数乘法
 * @param {*} arg1 
 * @param {*} arg2 
 */
const accAdd = function (arg1, arg2) {
  var r1, r2, m;
  try {
    r1 = arg1.toString().split(".")[1].length
  } catch (e) {
    r1 = 0
  } try {
    r2 = arg2.toString().split(".")[1].length
  } catch (e) { r2 = 0 } m = Math.pow(10, Math.max(r1, r2))
  return (arg1 * m + arg2 * m) / m
}

var accMul = function (arg1,arg2){ 
  var m=0,s1=arg1.toString(),
  s2=arg2.toString(); 
  try{
  m+=s1.split(".")[1].length}catch(e){} 
  try{
  m+=s2.split(".")[1].length}catch(e){} 
  return Number(s1.replace(".",""))*Number(s2.replace(".",""))/Math.pow(10,m
  )}



module.exports = {
  formatTime: formatTime,
  timestampToTime: timestampToTime,
  getCountDays: getCountDays,
  formatTimeTwo: formatTimeTwo,
  getCountWeek: getCountWeek,
  accDiv: accDiv,
  accAdd: accAdd,
  accMul: accMul
}

