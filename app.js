//app.js
import constant from './utils/constant.js';
import util from './utils/util.js';
import customerUtil from './utils/customer.js';
import httpReq from './utils/request.js';
App({
    onLaunch: function() {
        this.initManagerList();
        this.addFinallyToPromise();
        this.initCustomerId();
    },

    initManagerList : function(){//作用就是为了initWebsocket
        let that = this;
        setTimeout(that._initManagerList, 1000);
        //这里延迟一秒钟是等待小程序完成初始化.让getApp()能够返回小程序,而非返回undefined
    },

    _initManagerList: function () {//作用就是为了initWebsocket
        let that = this;
        let url = "customer/manager";
        httpReq.simpleRequest([url]).then(function (res) {
            let list = res.managerList;
            if (list.indexOf(customerUtil.getCustomerIdFromStorage()) != -1) {
                console.log(customerUtil.getCustomerIdFromStorage());
                console.log(res);
                that.initWebSocket();
                that.globalData.showMerchantsEntrance = true;
            }
        }).catch(function (res) {
            console.log(res);
        });
    },

    initWebSocket: function () {
        let that = this;
        let connection = that.createSocket();
        connection.onMessage(that.processMessage);
        connection.onClose(that.reStartSocket);
        that.globalData.connection = connection;
    },

    createSocket : function(){
        return wx.connectSocket({
            url: constant.ws_baseURL + 'notifyHandler',
            header: {
                'content-type': 'application/json',
                'Cookie': getApp().globalData[constant.sessionID]
            }
        });
    },

    reStartSocket : function(){
        let that = this;
        that.initWebSocket();
    },

    processMessage: function (message) {
        if(message.data){
           try{
               let notifyType = JSON.parse(message.data);
               if (notifyType.type) {
                   this.globalData.newNotifyInfo.newNotify(notifyType);
                   this.playVoice();
               }
           }catch(e){
               console.log(e);
           }
        }
    },

    playVoice : function(){
        const manager = wx.createInnerAudioContext();
        manager.src = constant.notifyMP3URL;
        manager.play();
    },


    /**
     * 初始化customerId,将id放入storage缓存
     */
    initCustomerId : function(){
        let customerId = customerUtil.getCustomerIdFromStorage();
        if (!customerId) {
            wx.login({
                success: res => {
                    // 发送 res.code 到后台换取 openId, sessionKey, unionId
                    customerUtil.getCustomerIdFromBackEnd(res.code);
                }
            });
        }
    },

    globalHint: function (content) {
        wx.showModal({
            title: '提示',
            content: content
        });
    },

    globalData: {
        userInfo: null,
        JSESSIONID : null,
        connection : null,
        showMerchantsEntrance : false,
        newNotifyInfo : {
            boxReserve : 0,
            banquetReserve : 0,
            tableReserve : 0,
            codeScanOrder: 0,
            newNotify : function(message){
                let that = this;
                console.log(message.type);
                switch(message.type){
                    case 'boxReserve': that.boxReserve++; break;
                    case 'banquetReserve': that.banquetReserve++; break;
                    case 'tableReserve': that.tableReserve++; break;
                    case 'codeScanOrder': that.codeScanOrder++; break;
                }
  
            },
            resetNum : function(property){
                let that = this;
                that[property] = 0;
            },
            totoalNotify : function(){
                return this.boxReserve + this.banquetReserve
                             + this.tableReserve + this.codeScanOrder;
            }
        }
    },

    /**
     * 给promise添加finally支持
     */
    addFinallyToPromise: function() {
        Promise.prototype.finally = function(callback) {
            var Promise = this.constructor;
            return this.then(
                function(value) {
                    Promise.resolve(callback()).then(
                        function() {
                            return value;
                        }
                    );
                },
                function(reason) {
                    Promise.resolve(callback()).then(
                        function() {
                            throw reason;
                        }
                    );
                }
            );
        }

    },

    /**
     * 当前包厢预定信息
     */
    boxReserveInfo: {
        reserveTime: util.formatDate(new Date()),
        boxId: 1,
        name: '',
        sex: '先生',
        tel: '',
        num: null,
        reservationType: '午餐预订',
        reservationsMode: "只订座",
        menus: [], //点的菜
        remark: ''
    },

    /**
     * 当前喜宴预订信息
     */
    banquetReserveInfo: {
        sex: '先生',
    },

    /**
     * 当前桌子预定信息
     */
    tableReserveInfo : {
        name: '',
        sex: '先生',
        tel: null,
        num: null,
        reservationsStartTime: null,
        remarks: '',
        menu : [],
    },


    /**
     * 保存classification和menu的Map,
     * 这样不用每次切换menu-header都发送请求.
     * Key:classification的id,
     * value : 该分类(key)下的菜单列表
     */
    menusMap: new Map(),

    /**
     * 处理所点菜品信息.
     * 循环遍历menusMap,找出其中count>0的菜品
     */
    assembleMenuOrderInfo: function() {
        let menusMap = this.menusMap;
        let selectedMenus = []; //用于保存客户点的菜品
        menusMap.forEach(function(value, key) { //key 是classificationId,value是menus数组
            selectedMenus = selectedMenus.concat(
                value.filter(function(menu) {
                    return menu.count > 0;
                })
            );
        });
        return selectedMenus;
    },

    assembleBoxReservInfo: function() {
        let info = this.boxReserveInfo;
        return {
            customer: {
                id: wx.getStorageSync(constant.customerId)
            },
            reservationsName: info.name,
            reservationsSex: info.sex,
            reservationsTel: info.tel,
            reservationsNum: info.num,
            reservationsStartTime: info.reserveTime,
            reservationType: info.reservationType,
            reservationsMode: info.reservationsMode,
            remarks: info.remark,
            box: [{
                id: info.boxId,
                roomName: info.boxName
            }],
            menu: null
        }
    },

    assembleTableReservInfo: function () {
        let info = this.tableReserveInfo;
        return {
            customer: {
                id: wx.getStorageSync(constant.customerId)
            },
            reservationsName: info.name,
            reservationsSex: info.sex,
            reservationsTel: info.tel,
            reservationsNum: info.num,
            reservationsStartTime: util.formatDate(new Date()) + ' '+ info.reservationsStartTime,
            remarks: info.remark,
            menu: null
        }
    },

});
