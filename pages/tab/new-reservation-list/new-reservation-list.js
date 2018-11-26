import httpReq from '../../../utils/request.js';
import constant from '../../../utils/constant.js';
import utils from '../../../utils/util.js';
Page({

    data: {
        scrollSize: {},
        boxReservations: [],
        banquetReservations: [],
        tableReservations: [],
        orders: [],
        newNotifyInfo: {},
        currentSelectedType: 'boxReservations',
        currentSelectedItems: [],
        integer999: 1
    },

    onLoad: function(options) {
        this.initNewNotifyInfo();
        this.initDeviceSize();
        this.refreshBoxReservations();
    },

    onShow: function() {
        this.initNewNotifyInfo();
    },

    initDeviceSize: function() {
        let that = this;
        wx.getSystemInfo({
            success: function(res) {
                let height = res.windowHeight - (res.windowWidth / 750) * 80;
                that.setData({
                    scrollSize: {
                        height: height - 2,
                        width: 100
                    }
                });
            }
        });
    },

    initNewNotifyInfo: function() {
        this.setData({
            newNotifyInfo: getApp().globalData.newNotifyInfo
        });
    },

    refreshBoxReservations: function() {
        let that = this;
        let newReserveNum = that.data.newNotifyInfo.boxReserve;
        // if (!newReserveNum) return;
        let url = 'reserve/back/listreserve';
        let now = new Date();
        let tomorrow = new Date().setDate(now.getDate() + 1);
        let params = {
            currentPageNo: 1,
            newReserveNum: that.data.integer999,
            reserveStartTime: utils.formatDate(now),
            reserveEndTime: utils.formatDate(new Date(tomorrow))
        };
        wx.showLoading({
            title: '查询中...',
        });
        httpReq.getRequest([url, params]).then(function(success) {
            if (success.status == 'success' && Array.isArray(success.reserves)) {
                let reservations = that.eraseTimeOfDate(that.addShowSubAreaProperty(success.reserves));
                that.setData({
                    boxReservations: reservations,
                    currentSelectedItems: reservations
                });
                that.resetNotifyNumber('boxReserve');
            } else
                getApp().globalHint('查询失败,请稍后重试');
        }).catch(function(error) {
            getApp().globalHint('查询失败,请稍后重试');
        }).finally(function() {
            wx.hideLoading();
        })
    },

    refreshBanquetReservations: function() {
        let that = this;
        let newReserveNum = that.data.newNotifyInfo.banquetReserve;
        // if (!newReserveNum) return;
        let url = 'banquetreserve/back/listbanquetreserve';
        let now = new Date();
        let tomorrow = new Date().setDate(now.getDate() + 1);
        let params = {
            currentPageNo: 1,
            newReserveNum: that.data.integer999,
            queryString: encodeURI(JSON.stringify({
                reserveStartTime: utils.formatDate(now),
                reserveEndTime: utils.formatDate(new Date(tomorrow))
            }))
        };
        wx.showLoading({
            title: '查询中...',
        });
        httpReq.getRequest([url, params]).then(function(success) {
            if (success.status == 'success' && Array.isArray(success.banquetreserves)) {
                let reservations = that.eraseTimeOfDate(that.addShowSubAreaProperty(success.banquetreserves));
                that.setData({
                    banquetReservations: reservations,
                    currentSelectedItems: reservations
                });
                that.resetNotifyNumber('banquetReserve');
            } else
                getApp().globalHint('查询失败,请稍后重试');
        }).catch(function(error) {
            getApp().globalHint('查询失败,请稍后重试');
        }).finally(function() {
            wx.hideLoading();
        })
    },

    refreshTableReservations: function() {
        let that = this;
        let newReserveNum = that.data.newNotifyInfo.tableReserve;
        // if (!newReserveNum) return;
        let url = 'tablereservehome/back/listtablereservehome';
        let now = new Date();
        let tomorrow = new Date().setDate(now.getDate() + 1);
        let params = {
            currentPageNo: 1,
            newReserveNum: that.data.integer999,
            reserveStartTime: utils.formatDate(now),
            reserveEndTime: utils.formatDate(new Date(tomorrow))
        };
        wx.showLoading({
            title: '查询中...',
        });
        httpReq.getRequest([url, params]).then(function(success) {
            if (success.status == 'success' && Array.isArray(success.tablereservehomes)) {
                let reservations = that.addShowSubAreaProperty(success.tablereservehomes);
                that.setData({
                    boxReservations: reservations,
                    currentSelectedItems: reservations
                });
                that.resetNotifyNumber('tableReserve');
            } else
                getApp().globalHint('查询失败,请稍后重试');
        }).catch(function(error) {
            getApp().globalHint('查询失败,请稍后重试');
        }).finally(function() {
            wx.hideLoading();
        })
    },

    refreshOrders: function() {
        let that = this;
        let newReserveNum = that.data.newNotifyInfo.codeScanOrder;
        // if (!newReserveNum) return;
        let url = 'tablereserve/back/listtablereserve';
        let now = new Date();
        let tomorrow = new Date().setDate(now.getDate() + 1);
        let params = {
            currentPageNo: 1,
            newReserveNum: that.data.integer999,
            queryString: encodeURI(JSON.stringify({
                reserveStartTime: utils.formatDate(now),
                reserveEndTime: utils.formatDate(new Date(tomorrow))
            }))
        };
        wx.showLoading({
            title: '查询中...',
        });
        httpReq.getRequest([url, params]).then(function(success) {
            if (success.status == 'success' && Array.isArray(success.tablereserves)) {
                let orders = that.addShowSubAreaProperty(success.tablereserves);
                that.setData({
                    orders: orders,
                    currentSelectedItems: orders
                });
                that.resetNotifyNumber('codeScanOrder');
            } else
                getApp().globalHint('查询失败,请稍后重试');
        }).catch(function(error) {
            getApp().globalHint('查询失败,请稍后重试');
        }).finally(function() {
            wx.hideLoading();
        })
    },

    boxReservationsSelect: function() {
        this.setData({
            currentSelectedType: 'boxReservations',
            currentSelectedItems: this.data.boxReservations
        });
        this.refreshBoxReservations();
    },
    banquetReservationsSelect: function() {
        this.setData({
            currentSelectedType: 'banquetReservations',
            currentSelectedItems: this.data.banquetReservations
        });
        this.refreshBanquetReservations();
    },
    tableReservationsSelect: function() {
        this.setData({
            currentSelectedType: 'tableReservations',
            currentSelectedItems: this.data.tableReservations
        });
        this.refreshTableReservations();
    },
    ordersSelect: function() {

        this.setData({
            currentSelectedType: 'orders',
            currentSelectedItems: this.data.orders
        });
        this.refreshOrders();
    },

    addShowSubAreaProperty: function(arr) {
        if (Array.isArray(arr)) {
            return arr.map(function(item) {
                item.showSubArea = false;
                return item;
            });
        }
    },

    //只保留date的日期部分,去除time
    eraseTimeOfDate: function(arr) {
        if (Array.isArray(arr)) {
            return arr.map(function(item) {
                item.reservationsStartTime = item.reservationsStartTime.substr(0, 10);
                return item;
            });
        }
    },

    resetNotifyNumber: function(property) {
        //App中newNotifyInfo
        getApp().globalData.newNotifyInfo.resetNum(property);
        //本页面newNotifyInfo
        let newNotifyInfo = this.data.newNotifyInfo;
        newNotifyInfo[property] = 0;
        this.setData({
            newNotifyInfo: newNotifyInfo
        });
    },

    showHideSubArea: function(res) {
        let index = res.currentTarget.dataset.index;
        let flag = res.currentTarget.dataset.flag;
        let currentSelectedItems = this.data.currentSelectedItems;
        currentSelectedItems[index].showSubArea = !flag;

        this.setData({
            currentSelectedItems: currentSelectedItems
        });
    },

    goToDial: function(res) {
        let tel = res.currentTarget.dataset.tel;
        wx.makePhoneCall({
            phoneNumber: tel
        });
    }

})