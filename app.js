//app.js
import constant from './utils/constant.js';
import util from './utils/util.js';
import customerUtil from './utils/customer.js';
App({
    onLaunch: function() {

        this.addFinallyToPromise();
        this.initCustomerId();
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
        userInfo: null
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
        reserveTime: util.formatTime(new Date()),
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
})