import httpReq from '../../utils/request.js';
Page({

    /**
     * 页面的初始数据
     */
    data: {

        boxReserveInfo: {},
        population: []

    },

    onLoad: function(options) {
        this.initPopulationPicker();
        this.initReserveForm();
    },

    initPopulationPicker: function() {
        let persons = [];
        for (let i = 3; i <= 30; i++) {
            persons.push(i);
        }
        this.setData({
            population: persons
        });
    },

    numSelect: function(res) {
        let boxReserveInfo = this.data.boxReserveInfo;
        boxReserveInfo.num = this.data.population[res.detail.value];
        this.setData({
            boxReserveInfo: boxReserveInfo
        });
    },
    nameComplete: function(res) {
        let boxReserveInfo = this.data.boxReserveInfo;
        boxReserveInfo.name = res.detail.value;
        this.setData({
            boxReserveInfo: boxReserveInfo
        });
    },

    reservationSexSelect: function(res) {
        let boxReserveInfo = this.data.boxReserveInfo;
        boxReserveInfo.sex = res.detail.value;
        this.setData({
            boxReserveInfo: boxReserveInfo
        });
    },


    initReserveForm: function() {
        let that = this;
        let info = getApp().boxReserveInfo;
        that.setData({
            boxReserveInfo: info
        });
    },

    telComplete: function(res) {
        let boxReserveInfo = this.data.boxReserveInfo;
        boxReserveInfo.tel = res.detail.value;
        this.setData({
            boxReserveInfo: boxReserveInfo
        });
    },

    remarkComplete: function(res) {
        let boxReserveInfo = this.data.boxReserveInfo;
        boxReserveInfo.remark = res.detail.value;
        this.setData({
            boxReserveInfo: boxReserveInfo
        });
    },

    reservationsModeSelect: function(res) {
        let boxReserveInfo = this.data.boxReserveInfo;
        boxReserveInfo.reservationsMode = res.detail.value;
        this.setData({
            boxReserveInfo: boxReserveInfo
        });
    },

    goToMenuList: function() {
        this.updateAppBoxReserveInfo();
        if (this.checkRequiredItems()) {
            wx.navigateTo({
                url: '../menu-list/menu-list',
            })
        }
    },
    updateAppBoxReserveInfo: function() {
        getApp().boxReserveInfo = this.data.boxReserveInfo;
        console.log(getApp().boxReserveInfo);
    },

    goToConfirm : function(){
        this.updateAppBoxReserveInfo();
        if (this.checkRequiredItems()){
            wx.navigateTo({
                url: '../box-reserve-confirm/box-reserve-confirm',
            })
        }
        
    },

    checkRequiredItems: function(){
        return true;
        let boxReserveInfo = this.data.boxReserveInfo;
        if (!boxReserveInfo.name || boxReserveInfo.name.length == 0){
            wx.showToast({
                title: '请输入姓氏',
                image: '../../img/tips.png',
            });
            return false;
        }
        if (!boxReserveInfo.num || boxReserveInfo.num <= 0) {
            wx.showToast({
                title: '请选择人数',
                image: '../../img/tips.png',
            });
            return false;
        }
        if(!boxReserveInfo.tel){//未填写联系方式
            {
                wx.showToast({
                    title: '请输入联系方式',
                    image: '../../img/tips.png',
                });
                return false;
            }
        }
        if (!!boxReserveInfo.tel) {
            let pattern = /1[\d]{10}/;
            if (!pattern.test(boxReserveInfo.tel)){//联系方式格式不对
                wx.showToast({
                    title: '联系方式有误',
                    image: '../../img/tips.png',
                });
                return false;
            }
        }
        return true;
    }
})