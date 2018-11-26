import httpReq from '../../../utils/request.js';
import util from '../../../utils/util.js';
Page({

    /**
     * 页面的初始数据
     */
    data: {

        tableReserveInfo: {},
        population: [],
        now: util.formatTime(new Date())

    },

    onLoad: function (options) {
        this.initPopulationPicker();
        this.initReserveForm();
    },

    initPopulationPicker: function () {
        let persons = [];
        for (let i = 3; i <= 30; i++) {
            persons.push(i);
        }
        this.setData({
            population: persons
        });
    },


    initReserveForm: function () {
        let that = this;
        let info = getApp().tableReserveInfo;
        that.setData({
            tableReserveInfo: info
        });
    },

    /***************wxml页面事件开始*****************/
    numSelect: function (res) {
        let tableReserveInfo = this.data.tableReserveInfo;
        tableReserveInfo.num = this.data.population[res.detail.value];
        this.setData({
            tableReserveInfo: tableReserveInfo
        });
    },
    nameComplete: function (res) {
        let tableReserveInfo = this.data.tableReserveInfo;
        tableReserveInfo.name = res.detail.value;
        this.setData({
            tableReserveInfo: tableReserveInfo
        });
    },

    reservationSexSelect: function (res) {
        let tableReserveInfo = this.data.tableReserveInfo;
        tableReserveInfo.sex = res.detail.value;
        this.setData({
            tableReserveInfo: tableReserveInfo
        });
    },


    telComplete: function (res) {
        let tableReserveInfo = this.data.tableReserveInfo;
        tableReserveInfo.tel = res.detail.value;
        this.setData({
            tableReserveInfo: tableReserveInfo
        });
    },

    remarkComplete: function (res) {
        let tableReserveInfo = this.data.tableReserveInfo;
        tableReserveInfo.remark = res.detail.value;
        this.setData({
            tableReserveInfo: tableReserveInfo
        });
    },

    timeSelect: function (res) {
        let tableReserveInfo = this.data.tableReserveInfo;
        tableReserveInfo.reservationsStartTime = res.detail.value;
        this.setData({
            tableReserveInfo: tableReserveInfo
        });
        console.log(this.data.now);
    },
    /***************wxml页面事件结束*****************/


    updateAppTableReserveInfo: function () {
        getApp().tableReserveInfo = this.data.tableReserveInfo;
        console.log(getApp().tableReserveInfo);
    },

    goToConfirm: function () {
        this.updateAppTableReserveInfo();
        if (this.checkRequiredItems()) {
            wx.navigateTo({
                url: '../table-reserve-confirm/table-reserve-confirm',
            })
        }
    },

    checkRequiredItems: function () {
        // return true;
        let tableReserveInfo = this.data.tableReserveInfo;
        if (!tableReserveInfo.name || tableReserveInfo.name.length == 0) {
            wx.showToast({
                title: '请输入姓氏',
                image: '../../../img/tips.png',
            });
            return false;
        }

        if (!tableReserveInfo.reservationsStartTime) {
            wx.showToast({
                title: '请选择时间',
                image: '../../../img/tips.png',
            });
            return false;
        }

        if (!tableReserveInfo.num || tableReserveInfo.num <= 0) {
            wx.showToast({
                title: '请选择人数',
                image: '../../../img/tips.png',
            });
            return false;
        }
        if (!tableReserveInfo.tel) {//未填写联系方式
            {
                wx.showToast({
                    title: '请输入联系方式',
                    image: '../../../img/tips.png',
                });
                return false;
            }
        }
        if (!!tableReserveInfo.tel) {
            var telphone = /^[\d-]{5,14}$/;
            var mobile = /^[1][3,4,5,7,8,9][0-9]{9}$/;
            if (('' + tableReserveInfo.tel).substr(0, 1) == '1') {//填的是手机号
                if (!mobile.test(tableReserveInfo.tel)) {
                    //联系方式格式不对
                    wx.showToast({
                        title: '联系方式有误',
                        image: '../../../img/tips.png',
                    });
                    return false;
                }
            }
            else if (!telphone.test(tableReserveInfo.tel)) {
                wx.showToast({
                    title: '联系方式有误',
                    image: '../../../img/tips.png',
                });
                return false;
            }
        }
        return true;
    }
})