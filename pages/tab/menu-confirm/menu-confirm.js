// pages/box-reserve-confirm/box-reserve-confirm.js
import httpReq from '../../../utils/request.js';
import constant from '../../../utils/constant.js';
Page({

    data: {
        menus: [],
        tableOrBoxId : null,
    },

    onLoad: function (options) {//这里处理扫码传递过来的 桌号
        let tableOrBoxId = options.tableOrBoxId;
        this.setData({
            tableOrBoxId: tableOrBoxId
        });
        this.initMenus();
    },

    initMenus: function () {
        let menus = getApp().assembleMenuOrderInfo();
        this.setData({
            menus: menus
        });
    },

    orderSubmit: function () {

        let params = this.prepareOrderParams();
        wx.showLoading({
            title: '提交中...',
        })
        httpReq.postRequestWithJSONSchema(['tablereserve/savetablereserve', params]).then(function (success) {
           if(success.status==='success'){
               wx.showModal({
                   title: '系统',
                   content: '订单递交成功!',
                   success(res) {
                       wx.switchTab({
                           url: '/tab/index/index'
                       });
                   }
               });
           }else
               getApp().globalHint("点餐失败");
        }).catch(function (error) {
            wx.showToast({
                title: '服务器忙请重试',
                icon: 'none'
            });
        }).finally(function () {
            wx.hideLoading();
        })
    },

    prepareOrderParams: function () {
        /**tableOrBoxId形如: TAB-5 BOX-9格式 */
        let tableOrBoxId = this.data.tableOrBoxId;

        try{
            var typeAndId = tableOrBoxId.split('-');
            var orderType = typeAndId[0];
            var typeId = typeAndId[1];
        }catch(e){
            orderType = null;
        }

        let params = {
            customer: {
                id: wx.getStorageSync(constant.customerId)
            }
        };
        if(orderType == 'TAB'){
            params.table = {
                id: typeId
            };
            params.type = '桌子';
        }else if(orderType == 'BOX'){
            params.box = {
                id: typeId
            };
            params.type = '包厢';
        }

       
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