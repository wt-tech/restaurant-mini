import httpReq from '../../utils/request.js';
import customer from '../../utils/customer.js';
Page({

    data: {
        userInfo: {
            url: '',
            nickName: '',
            buttonShow: true
        },
        banquetReserveList: [],
        boxReserveList: [],
        menuOrderList: [],
        showOrders: false,
        showReservations: false,
        hideLoading: 0b00,
        binaryThree: 0b11,

        manager : {
            numbersOfNotify : 0
        }
    },
    onLoad: function() {
        this.initUserInfo();
        this.setData({
            showMerchantsEntrance: getApp().globalData.showMerchantsEntrance
        });
    },
    onShow : function(){
        this.setData({
            manager : {
                numbersOfNotify: getApp().globalData.newNotifyInfo.totoalNotify()
            }
        });
    },
    showLoading: function() {
        wx.showLoading({
            title: '努力加载中',
        });
    },

    showReservations: function() {
        let flag = this.data.showReservations;
        if (!flag){
            if (this.data.banquetReserveList.length === 0) {//只要没有就查找
                this.showLoading();
                this.initBanquetReservations();
            }
            if (this.data.boxReserveList.length === 0) {//只要没有就查找
                this.showLoading();
                this.initBoxReservations();
            }
        }
        this.setData({
            showReservations: !flag
        });
    },

    showOrders : function(){
        let flag = this.data.showOrders;
        if(!flag){
            if (this.data.menuOrderList.length === 0) {//只要没有就查找
                this.initOrders();
            }
        }
        this.setData({
            showOrders: !flag
        });
    },

    hideLoadingConditional: function() {
        let that = this;
        let hideLoading = that.data.hideLoading;
        let three = that.data.binaryThree;
        if (hideLoading & three === three) {
            //说明两个请求都已经完成.可在这里写两个请求都完成后需要实现的功能.
            wx.hideLoading();
            let quantity = that.data.boxReserveList.length + that.data.banquetReserveList.length;
            if(!quantity){
                wx.showToast({
                    title: '没有预订信息',
                    icon: 'none',
                    duration: 2000
                })
            }
        }
    },

    initBoxReservations: function() {
        let that = this;
        let url = "reserve/listreservebycustomerid";
        let params = {
            customerId: customer.getCustomerIdFromStorage()
        };
        httpReq.getRequest([url, params]).then(function(success) {
            if (success.status == 'success') {
                that.processRawBoxReservationsData(success.reserves);
            } else
                getApp().globalHint('包厢预定记录获取失败');
        }).catch(function(err) {
            getApp().globalHint('包厢预定记录获取失败');
        }).finally(function() {
            that.setData({
                hideLoading: that.data.hideLoading | 0b10
            });
            that.hideLoadingConditional();
        });
    },

    initBanquetReservations: function() {
        let that = this;
        let url = "banquetreserve/listbanquetreservebycustomerid";
        let params = {
            customerId: customer.getCustomerIdFromStorage()
        };
        httpReq.getRequest([url, params]).then(function(success) {
            if (success.status == 'success') {
                that.processRawBanquetReservationsData(success.banquetreserves);
            } else
                getApp().globalHint('喜宴预定记录获取失败');
        }).catch(function(err) {
            getApp().globalHint('喜宴预定记录获取失败');
        }).finally(function() {
            that.setData({
                hideLoading: that.data.hideLoading | 0b01
            });
            that.hideLoadingConditional();
        });
    },

    initOrders: function() {
        let that = this;
        that.showLoading();
        let url = "tablereserve/listtablereservebycustomerid";
        let params = {
            customerId: customer.getCustomerIdFromStorage()
        };
        httpReq.getRequest([url, params]).then(function(success) {
            if (success.status == 'success') {
                that.processRawOrderData(success.tablereserves);
            } else
                getApp().globalHint('订单记录获取失败');
        }).catch(function(err) {
            getApp().globalHint('订单记录获取失败');
        }).finally(function() {
            wx.hideLoading();
            if (that.data.menuOrderList.length === 0){
                wx.showToast({
                    title: '您尚未点过餐',
                    icon : 'none',
                    duration: 2000
                })
            }
        });
    },

    processRawBoxReservationsData: function(reservations) {
        let that = this;
        if (Array.isArray(reservations)) {
            that.setData({
                boxReserveList: reservations.map(function(boxReservation) {
                    boxReservation.reservationsStartTime =
                        httpReq.formatTime(new Date(boxReservation.reservationsStartTime));
                    return boxReservation;
                })
            });
        }
    },


    processRawBanquetReservationsData: function(banquetReservations) {

        let that = this;
        if (Array.isArray(banquetReservations)) {
            that.setData({
                banquetReserveList: banquetReservations.map(function(banquetReservation) {
                    banquetReservation.reservationsStartTime =
                        httpReq.formatTime(new Date(banquetReservation.reservationsStartTime));
                    return banquetReservation;
                })
            });
        }
    },

    processRawOrderData: function(tableReservations) {
        let that = this;
        if (Array.isArray(tableReservations)) {
            that.setData({
                menuOrderList: tableReservations.map(function(tableReservation) {
                    tableReservation.createTime =
                        httpReq.formatTime(new Date(tableReservation.reserveTime));
                    delete tableReservation.reserveTime;
                    return tableReservation;
                })
            });
        }
    },



    /*用户信息相关 */
    initUserInfo: function() {
        let that = this;
        wx.getSetting({
            success(res) {
                let authSettings = res.authSetting;
                if (authSettings['scope.userInfo'] === true) {
                    wx.getUserInfo({
                        success: function(e) {
                            that.setUserInfo(e.userInfo);
                        }
                    })
                }
            }
        })
    },

    getUserInfo: function(e) {
        this.setUserInfo(e.detail.userInfo);
    },
    setUserInfo: function(userInfo) {
        this.setData({
            userInfo: {
                url: userInfo.avatarUrl,
                nickName: userInfo.nickName,
                buttonShow: false
            }
        });
    },

    newReservations : function(){
        wx.navigateTo({
            url: '../../pages/tab/new-reservation-list/new-reservation-list',
        })
    }

})