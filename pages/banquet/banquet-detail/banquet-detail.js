// pages/banquet/banquet-detail/banquet-detail.js
Page({

  data: {
      deviceSize : {
          height : 0,
          width : 0
      },
      banquetDetailInfo :{
          menuImg: 'https://www.qghls.com/statics/restaurant/menuimg1.jpg',
      }
  },

  onLoad: function (options) {
      this.initDeviceSize();
  },

    initDeviceSize : function(){
        let that = this;
        wx.getSystemInfo({
            success:function(res){
                console.log(res);
                that.setData({
                    deviceSize : {
                        height: res.windowHeight,
                        width: res.screenWidth+1
                    }
                });
            }
        });
    }

})