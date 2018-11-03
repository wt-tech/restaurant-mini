import httpReq from './request.js';
import constant from './constant.js';


function getCustomerIdFromBackEnd(code){
    let url = "customer/authorization";
    let params = {code : code};
    httpReq.postRequest([url,params]).then(function(success){
        saveCustomerIdToStorage(success.customerId);
    }).catch(function(err){
        console.log(err);
    }).finally(function(){
        console.log('finally');
    });
}

function saveCustomerIdToStorage(id){
    wx.setStorageSync(constant.customerId,id);
}

function getCustomerIdFromStorage() {
    return wx.getStorageSync(constant.customerId);
}

module.exports = {
    getCustomerIdFromBackEnd: getCustomerIdFromBackEnd,
    getCustomerIdFromStorage: getCustomerIdFromStorage
}
