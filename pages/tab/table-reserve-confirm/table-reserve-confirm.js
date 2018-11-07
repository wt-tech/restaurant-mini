
import httpReq from '../../../utils/request.js';
import constant from '../../../utils/constant.js';
Page({

    data: {
        menus: [],
        reserveInfo: {
            remarks: '',
        }
    },

    onLoad: function () {
        this.initReserveInfo();
        this.initMenus();
    },

    initMenus: function () {
        let menus = getApp().assembleMenuOrderInfo();
        this.setData({
            menus: menus
        });
    },
    initReserveInfo: function () {
        let params = getApp().assembleTableReservInfo();
        this.setData({
            reserveInfo: params
        });
    },
    reserveSubmit: function () {

        let params = this.prepareReserveParams();
        wx.showLoading({
            title: '提交中...',
        })
        httpReq.postRequestWithJSONSchema(['tablereservehome/savetablereservehome', params]).then(function (success) {
            if (success.status === 'success') {
                wx.showModal({
                    title: '系统',
                    content: '预定成功!',
                    success(res) {
                        wx.switchTab({
                            url: '/tab/index/index'
                        });
                    }
                });
            } else
                getApp().globalHint("预定失败");

        }).catch(function (error) {
            console.log(error);
            wx.showToast({
                title: '服务器忙请重试',
                icon: 'none'
            });
        }).finally(function () {
            wx.hideLoading();
        })
    },
    prepareReserveParams: function () {
        let params = this.data.reserveInfo;
        let menus = this.data.menus;
        params.menu = menus.map(function (menu) {
            return {
                id: menu.id,
                specifications: menu.selectedSize.value,
                choosePrice: menu.selectedSize.price,
                menuCount: menu.count
            };
        });
        console.log(params);
        return params;
    }
})