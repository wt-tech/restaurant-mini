// tab/index/index.js
Page({
    data: {
        swiper: {
            imgUrls: [
                "../../img/page/27.jpg",
                "../../img/page/31.jpg",
                "../../img/page/39.jpg",
                "../../img/page/55.jpg"
            ],
            indicatorDots: false,
            autoplay: true,
            interval: 3000,
            duration: 1000
        }
    },

    onLoad: function(options) {

    },

    goToBoxReserve: function() {
        wx.navigateTo({
            url: '../../pages/box-reserve/box-reserve',
        })
    },
    goToBanquetReserve : function(){
        wx.navigateTo({
            url: '../../pages/banquet/banquet-list/banquet-list',
        })
    },

    goToDirector: function () {
        wx.openLocation({
            latitude: 30.70,
            longitude: 118.40,
            name: '新煮天下美食府',
        });
    },

    goToDial : function(){
        wx.makePhoneCall({
            phoneNumber : '15671651407'
        });
    }

})