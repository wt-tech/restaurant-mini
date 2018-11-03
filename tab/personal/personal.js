import httpReq from '../../utils/request.js';
import customer from '../../utils/customer.js';
Page({

    data: {
        userInfo : {
            url: '',
            nickName : '',
            buttonShow : true
        },
        banquetReserveList: [
        ],
        boxReserveList: [
        ],
        menuOrderList : [
        ],
        showOrders : false,
        showReservations : false,
        hideLoading : 0b000,
        binarySeven: 0b111
    },
    onLoad : function(){
        this.showLoading();
        this.initUserInfo();
        this.initBoxReservations();
        this.initBanquetReservations();
        this.initOrders();
    },
    showLoading : function(){
        wx.showLoading({
            title: '努力加载中',
        });
    },
    hideLoadingConditional : function(){
        let that = this;
        let hideLoading = that.data.hideLoading;
        let seven = that.data.binarySeven;
        if (hideLoading & seven === seven){
            wx.hideLoading();
        }
    },
    initBoxReservations : function(){
        let that = this;
        let url = "reserve/listreservebycustomerid";
        let params = { customerId: customer.getCustomerIdFromStorage()};
        httpReq.getRequest([url,params]).then(function(success){
            if(success.status=='success'){
                that.processRawBoxReservationsData(success.reserves);
            }else
                getApp().globalHint('包厢预定记录获取失败');
        }).catch(function(err){
            getApp().globalHint('包厢预定记录获取失败');
        }).finally(function(){
            that.setData({
                hideLoading: that.data.hideLoading | 0b100
            });
            that.hideLoadingConditional();
        });
    },

    initBanquetReservations : function(){
        let that = this;
        let url = "banquetreserve/listbanquetreservebycustomerid";
        let params = { customerId: customer.getCustomerIdFromStorage() };
        httpReq.getRequest([url, params]).then(function (success) {
            if (success.status == 'success') {
                that.processRawBanquetReservationsData(success.banquetreserves);
            } else
                getApp().globalHint('喜宴预定记录获取失败');
        }).catch(function (err) {
            getApp().globalHint('喜宴预定记录获取失败');
        }).finally(function () {
            that.setData({
                hideLoading: that.data.hideLoading | 0b010
            });
            that.hideLoadingConditional();
        });
    },
   
    initOrders: function () {
        let that = this;
        let url = "tablereserve/listtablereservebycustomerid";
        let params = { customerId: customer.getCustomerIdFromStorage() };
        httpReq.getRequest([url, params]).then(function (success) {
            if (success.status == 'success') {
                that.processRawOrderData(success.tablereserves);
            } else
                getApp().globalHint('订单记录获取失败');
        }).catch(function (err) {
            getApp().globalHint('订单记录获取失败');
        }).finally(function () {
            that.setData({
                hideLoading: that.data.hideLoading | 0b001
            });
            that.hideLoadingConditional();
        });
    },

    processRawBoxReservationsData: function (reservations) {
        console.log(reservations);
        let that = this;
        if (Array.isArray(reservations)) {
            that.setData({
                boxReserveList: reservations.map(function (boxReservation) {
                    boxReservation.reservationsStartTime =
                    httpReq.formatTime(new Date(boxReservation.reservationsStartTime));
                    return boxReservation;
                })
            });
        }
        console.log(that.data.boxReserveList);
    },


    processRawBanquetReservationsData: function (banquetReservations) {
        console.log(banquetReservations);
        let that = this;
        if (Array.isArray(banquetReservations)) {
            that.setData({
                banquetReserveList: banquetReservations.map(function (banquetReservation) {
                    banquetReservation.reservationsStartTime =
                        httpReq.formatTime(new Date(banquetReservation.reservationsStartTime));
                    return banquetReservation;
                })
            });
        }
        console.log(that.data.banquetReserveList);
    },

    processRawOrderData: function (tableReservations) {
        console.log(tableReservations);
        let that = this;
        if (Array.isArray(tableReservations)) {
            that.setData({
                menuOrderList: tableReservations.map(function (tableReservation) {
                    tableReservation.createTime =
                        httpReq.formatTime(new Date(tableReservation.reserveTime));
                    delete tableReservation.reserveTime;
                    return tableReservation;
                })
            });
        }
        console.log(that.data.menuOrderList);
    },



    /*用户信息相关 */
    initUserInfo : function(){
        let that = this;
        wx.getSetting({
            success(res) {
                let authSettings = res.authSetting;
                if (authSettings['scope.userInfo'] === true) {
                    wx.getUserInfo({
                        success: function (e) {
                            that.setUserInfo(e.userInfo);
                        }
                    })
                }
            }
        })
    },

    getUserInfo : function(e){
        this.setUserInfo(e.detail.userInfo);       
    },
    setUserInfo : function(userInfo){
        this.setData(
           {
                userInfo: {
                    url: userInfo.avatarUrl,
                    nickName: userInfo.nickName,
                    buttonShow: false
                }
           }
        );
    }

})