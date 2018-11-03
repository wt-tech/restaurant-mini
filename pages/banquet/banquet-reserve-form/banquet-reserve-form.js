import httpReq from '../../../utils/request.js';
import constant from '../../../utils/constant.js';

Page({

    data: {
        today: httpReq.formatTime(new Date()),
        banquetQuantities: [],
        banquetReserveInfo : {}
    },

    onLoad: function (options) {
        this.initBanquetQuantities();
        this.initReserveForm(options);//这里将上一个页面传递来的喜宴套餐id放在这里赋值
    },

    initBanquetQuantities : function(){
        let range = [];
        for(let i = 4; i <=30; i++){
            range.push(i);
        }
        this.setData({
            banquetQuantities:range
        });
    },

    initReserveForm: function (options){
        let that = this;
        let info = getApp().banquetReserveInfo;
        info.comboId = options.id;
        info.comboPrice = options.price;
        that.setData({
            banquetReserveInfo: info
        });
    },

    submitBtnClick: function(){
        this.updateAppBanquetReserveInfo();
        if (this.checkRequiredItems()) {
            this.reserveSubmit();
        }
    },

    reserveSubmit : function(){
        let url = "banquetreserve/savebanquetreserve";
        let params = this.assembleBanquetReserveInfo();
        console.log(params);
        httpReq.postRequestWithJSONSchema([url,params]).then(function (success) {
            if (success.status === 'success') {
                wx.showModal({
                    title: '系统',
                    content: '喜宴预定成功!',
                    success(res) {
                        wx.switchTab({
                            url: '/tab/index/index'
                        });
                    }
                });
            } else
                getApp().globalHint("喜宴预定失败");
        }).catch(function (err) {
            getApp().globalHint("喜宴预定失败");
        }).finally(function () {
        });
    },

    assembleBanquetReserveInfo : function(){
        let info = this.data.banquetReserveInfo;
        return {
            customer: {
                id: wx.getStorageSync(constant.customerId)
            },
            reservationsName: info.name,
            reservationsSex: info.sex,
            reservationsTel: info.tel,
            reservationsNum: info.num,
            reservationsStartTime: info.reserveDate,
            remarks: info.remark,
            combo: {
                id: info.comboId,
                comboPrice: info.comboPrice
            }
        };
    },

    updateAppBanquetReserveInfo : function(){
        getApp().banquetReserveInfo = this.data.banquetReserveInfo;
    },


    /* 检查表单必填项 */
    checkRequiredItems : function(){
        // return true;
        let banquetReserveInfo = this.data.banquetReserveInfo;
        if (!banquetReserveInfo.name || banquetReserveInfo.name.length == 0) {
            wx.showToast({
                title: '请输入姓氏',
                image: '../../../img/tips.png',
            }); 
            return false;
        }
        if (!banquetReserveInfo.reserveDate) {
            wx.showToast({
                title: '请选择预定时间',
                image: '../../../img/tips.png',
            });
            return false;
        }
        if (!banquetReserveInfo.num || banquetReserveInfo.num <= 0) {
            wx.showToast({
                title: '请选择人数',
                image: '../../../img/tips.png',
            });
            return false;
        }
        if (!banquetReserveInfo.tel) {//未填写联系方式
            {
                wx.showToast({
                    title: '请输入联系方式',
                    image: '../../../img/tips.png',
                });
                return false;
            }
        }
        if (!!banquetReserveInfo.tel) {
            let pattern = /1[\d]{10}/;
            if (!pattern.test(banquetReserveInfo.tel)) {//联系方式格式不对
                wx.showToast({
                    title: '联系方式有误',
                    image: '../../../img/tips.png',
                });
                return false;
            }
        }
        return true;
    },

    /*表单change事件 */
    nameComplete: function (res) {
        let banquetReserveInfo = this.data.banquetReserveInfo;
        banquetReserveInfo.name = res.detail.value;
        this.setData({
            banquetReserveInfo: banquetReserveInfo
        });
    },

    reservationSexSelect: function (res) {
        let banquetReserveInfo = this.data.banquetReserveInfo;
        banquetReserveInfo.sex = res.detail.value;
        this.setData({
            banquetReserveInfo: banquetReserveInfo
        });
    },

    reserveDateChanged : function(res){
        let banquetReserveInfo = this.data.banquetReserveInfo;
        banquetReserveInfo.reserveDate = res.detail.value;
        this.setData({
            banquetReserveInfo: banquetReserveInfo
        });
    },
    reserveQuantityChanged : function(res) {
        let banquetReserveInfo = this.data.banquetReserveInfo;
        banquetReserveInfo.num = this.data.banquetQuantities[res.detail.value];
        this.setData({
            banquetReserveInfo: banquetReserveInfo
        });
    },

    telComplete: function (res) {
        let banquetReserveInfo = this.data.banquetReserveInfo;
        banquetReserveInfo.tel = res.detail.value;
        this.setData({
            banquetReserveInfo: banquetReserveInfo
        });
    },

    remarkComplete: function (res) {
        let banquetReserveInfo = this.data.banquetReserveInfo;
        banquetReserveInfo.remark = res.detail.value;
        this.setData({
            banquetReserveInfo: banquetReserveInfo
        });
    },

})