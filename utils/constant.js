const customerId = "customerId";
const launchType = "午餐预订";
const supperType = "晚餐预订";
const onlyBookBox = "只订座";
const bookBoxAndOrder ="提前选择菜品";
const sessionID = "JSESSIONID";
const restLotteryTime = "restLotteryTime";//剩余抽奖次数

const http_protocol = "https://";
const ws_protocol = "wss://"; 
const domain = 'www.qghls.com';

const userCode = 'mini-end';
const pwd = 'q3d5#@5896';

// const http_protocol = "http://";
// const ws_protocol = "ws://"; 
// const domain = "192.168.0.177:8888";
// const domain = "192.168.0.109:8080";

const context = "/restaurant/";


const baseURL = http_protocol + domain + context;
const ws_baseURL = ws_protocol + domain + context;
const notifyMP3URL = http_protocol + domain + "/statics/restaurant/voice/new-order.ogg";

module.exports = {
    customerId: customerId,
    baseURL: baseURL,   
    launchType: launchType,
    supperType: supperType,
    onlyBookBox: onlyBookBox,
    bookBoxAndOrder: bookBoxAndOrder,
    sessionID: sessionID,
    notifyMP3URL: notifyMP3URL,
    ws_baseURL: ws_baseURL,
    userCode : userCode,
    pwd : pwd,
    restLotteryTime: restLotteryTime
}