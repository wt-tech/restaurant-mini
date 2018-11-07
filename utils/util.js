const formatDate = date => {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  return [year, month, day].map(formatNumber).join('-');
}

const formatTime = date =>{
    const hours = date.getHours();
    const minutes = date.getMinutes();
    return [hours, minutes].map(formatNumber).join(':');
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

module.exports = {
  formatDate: formatDate,
  formatTime : formatTime
}
