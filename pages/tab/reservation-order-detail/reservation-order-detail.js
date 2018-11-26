// pages/tab/reservation-order-detail/reservation-order-detail.js
Page({

    data: {
        reserveInfo: null,
        showInfo : {},
    },

    onLoad: function(options) {
        this.setData({
            reserveInfo: getApp().globalData.currentSelectReservationOrOrder,
            showInfo : this.initShowInfo()
        });
        console.log(this.data.reserveInfo);

    },

    initShowInfo : function(){
        let item = getApp().globalData.currentSelectReservationOrOrder;
        return {
            baseInfo: item.type != 'menuOrderList',
            menuInfo : item.menu && item.menu.length > 0,
            Name : true,
            Sex : true,
            reserveTime : true,
            reservationsPopulation: ['boxReserveList', 'tableReserveList'].indexOf(item.type) != -1,
            roomName: item.type == 'boxReserveList',
            reservationsQuantity: item.type == 'banquetReserveList',
            combo: item.type == 'banquetReserveList',
            tel : true,
            orderTime : true,
            comment : true
        }
    }

})