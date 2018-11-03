import httpReq from '../../../utils/request.js';
Page({

    data: {
        restaurantImgs : [
            'https://www.qghls.com/statics/restaurant/info1.jpg',
            'https://www.qghls.com/statics/restaurant/info2.jpg',
            'https://www.qghls.com/statics/restaurant/info3.jpg',
            'https://www.qghls.com/statics/restaurant/info4.jpg',
        ],
        banquetList: [
            {
                id: 5,
                banquetPrice: 1288,
                banquetName: '永结同心',
                banquetDescription: '新人婚礼套餐,超值优惠.',
                imgURLs: [
                    'https://www.qghls.com/statics/restaurant/xiyan.jpg'
                ],
            },
            {
                id: 1,
                banquetPrice: 1488,
                banquetName: '白头偕老',
                banquetDescription: '新人婚礼套餐,超值优惠.',
                imgURLs: [
                    'https://www.qghls.com/statics/restaurant/xiyan2.jpg'
                ],
            }
        ],
        activityImgs : [
            "https://www.qghls.com/statics/restaurant/activity2.jpg",
            "https://www.qghls.com/statics/restaurant/activity1.jpg"
        ],
    },


    onLoad: function (options) {
        //this.initBanquetList();
    },

    initBanquetList : function(){
        let that = this;
        let url = "combo/listcombo";
        httpReq.getRequest([url]).then(function (success) {
            if (success.status==='success' && Array.isArray(success.combos)){
                console.log(success.combos);
                that.processRawBanquetData(success.combos);
            }else
                getApp().globalHint("获取喜宴列表失败");
        }).catch(function (err) {
            getApp().globalHint("获取喜宴列表失败");
        }).finally(function () {
            console.log('finally');
        });
    },

    processRawBanquetData: function (combos) {
        this.setData({
            banquetList: combos.map(function (banquet) {
                return {
                    id: banquet.id,
                    banquetPrice: banquet.comboPrice,
                    banquetName: banquet.comboName,
                    banquetDescription: banquet.comboIntroduction,
                    imgURLs: banquet.comboimage,
                }
            }),
        });
    },
    goToBanquetDetail: function () {
        wx.navigateTo({
            url: "../banquet-detail/banquet-detail"
        })
    },
    goToBanquetReserveForm: function (event) {
        let id = event.currentTarget.dataset.id;
        let price = event.currentTarget.dataset.price;
        wx.navigateTo({
            url: "../banquet-reserve-form/banquet-reserve-form?id=" + id + "&price=" + price
        })
    },


    previewRestaurantImg: function (e) {
        let index = e.target.dataset.index;
        let urls = this.data.restaurantImgs;
        wx.previewImage({
            current: urls[index],
            urls: urls
        })
    },

    previewImage : function(e){
        wx.previewImage({
            urls: [e.target.dataset.url]
        })
    },

    activityImageLoadError : function(e){
        console.log(e);
    }

})