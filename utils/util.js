function formatTime(date) {
  var year = date.getFullYear()
  var month = date.getMonth() + 1
  var day = date.getDate()

  var hour = date.getHours()
  var minute = date.getMinutes()
  var second = date.getSeconds()


  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

function isToday(date) {
  var today = new Date();
  if (date.getDate() != today.getDate()) return false;
  else if (date.getMonth() != today.getMonth()) return false;
  else if (date.getFullYear() != today.getFullYear()) return false;
  return true;
}

function formatNumber(n) {
  n = n.toString()
  return n[1] ? n : '0' + n
}

module.exports = {
  formatTime: formatTime,
  isToday: isToday
}
