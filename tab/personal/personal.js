import httpReq from '../../utils/request.js';
import customer from '../../utils/customer.js';
Page({

    data: {
        userInfo: {
            url: '',
            nickName: '',
            buttonShow: true
        },
        boxReserveList: [],
        banquetReserveList: [],
        tableReserveList : [],
        menuOrderList: [],
        showBoxReservations: false,
        showBanquetReservations : false,
        showTableReservations : false,
        showOrders: false,

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

    showBoxReservations: function() {
        let flag = this.data.showBoxReservations;
        if (!flag){//状态从不显示到显示
            if (this.data.boxReserveList.length === 0) {//只要没有就查找
                this.showLoading();
                this.initBoxReservations();
            }
        }
        this.setData({
            showBoxReservations: !flag
        });
    },

    showBanquetReservations: function () {
        let flag = this.data.showBanquetReservations;
        if (!flag) {//状态从不显示到显示
            if (this.data.banquetReserveList.length === 0) {//只要没有就查找
                this.showLoading();
                this.initBanquetReservations();
            }
        }
        this.setData({
            showBanquetReservations: !flag
        });
    },

    showTableReservations : function(){
        let flag = this.data.showTableReservations;
        if (!flag) {//状态从不显示到显示
            if (this.data.tableReserveList.length === 0) {//只要没有就查找
                this.showLoading();
                this.initTableReservations();
            }
        }
        this.setData({
            showTableReservations: !flag
        });
    },


    showOrders : function(){
        let flag = this.data.showOrders;
        if(!flag){
            if (this.data.menuOrderList.length === 0) {//只要没有就查找
                this.showLoading();
                this.initOrders();
            }
        }
        this.setData({
            showOrders: !flag
        });
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
            wx.hideLoading();
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
            wx.hideLoading();
        });
    },

    initTableReservations: function () {
        let that = this;
        let url = "tablereservehome/listtablereservehomebycustomerid";
        let params = {
            customerId: customer.getCustomerIdFromStorage()
        };
        httpReq.getRequest([url, params]).then(function (success) {
            if (success.status == 'success') {
                that.processRawTableReservationsData(success.tablereservehomes);
            } else
                getApp().globalHint('店外预定记录获取失败');
        }).catch(function (err) {
            getApp().globalHint('店外预定记录获取失败');
        }).finally(function () {
            wx.hideLoading();
        });
    },

    initOrders: function() {
        let that = this;
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
        });
    },

    processRawBoxReservationsData: function(reservations) {
        let that = this;
        if (Array.isArray(reservations)) {
            if (reservations.length == 0){
                getApp().globalHint('无包厢预订记录');
                return;
            }
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
            if (banquetReservations.length == 0) {
                getApp().globalHint('无喜宴预订记录');
                return;
            }
            that.setData({
                banquetReserveList: banquetReservations.map(function(banquetReservation) {
                    banquetReservation.reservationsStartTime =
                        httpReq.formatTime(new Date(banquetReservation.reservationsStartTime));
                    return banquetReservation;
                })
            });
        }
    },

    processRawTableReservationsData: function (tablereservehomes){
        let that = this;
        if (Array.isArray(tablereservehomes)) {
            if (tablereservehomes.length == 0) {
                getApp().globalHint('无店外预订记录');
            }
            that.setData({
                tableReserveList: tablereservehomes
            });
        }
    },

    processRawOrderData: function(tableReservations) {
        let that = this;
        if (Array.isArray(tableReservations)) {
            if (tableReservations.length == 0) {
                getApp().globalHint('无店外预订记录');
                return;
            }
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
    },

    prepareDataAndSetToAppMemory : function(params){
        let item = this.data[params.type][params.index];
        item.type = params.type;
        getApp().globalData.currentSelectReservationOrOrder = item;
    },

    goToReservationOrderDetail : function(res){
        console.log(res.currentTarget.dataset);
        this.prepareDataAndSetToAppMemory(res.currentTarget.dataset);
        wx.navigateTo({
            url: '../../pages/tab/reservation-order-detail/reservation-order-detail',
        })
    },

    getUserCode : function(){
        let usercode = customer.getCustomerIdFromStorage();
        getApp().globalHint('您的用户编码为 : ' + usercode);
    }


})