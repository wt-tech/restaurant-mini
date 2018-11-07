import httpReq from '../../utils/request.js';
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
        //this.initSwiper();
    },

    initSwiper : function(){
        let that = this;
        let url = 'banner/listbanner';
        httpReq.simpleRequest([url]).then(function(success){
            if(success.status==='success')
                that.processBannerData(success.banners);
            else{
                wx.showToast({
                    title: '轮播图获取失败',
                    icon : 'none'
                })
            }
        }).catch(function(error){
            wx.showToast({
                title: '轮播图获取失败',
                icon: 'none'
            })
        }).finally(function(){

        });
    },

    processBannerData : function(banners){
        if(Array.isArray(banners)){
            let imgUrls = [];
            banners.reduce(function(accumulator,banner,index){
                accumulator.push(banner.url);
                return accumulator;
            },imgUrls);

            this.setData({
                swiper : {
                    imgUrls: imgUrls,
                    indicatorDots: false,
                    autoplay: true,
                    interval: 3000,
                    duration: 1000
                }
            });
        }
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