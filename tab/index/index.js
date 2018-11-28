import httpReq from '../../utils/request.js';
import constant from '../../utils/constant.js';
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

    },
    showLotteryView: false, //是否显示真个转盘页面
    showShareBtn: false, //是否显示转发按钮
    circleList: [], //圆点数组
    awardList: [], //奖品数组
    colorCircleFirst: '#FFDF2F', //圆点颜色1
    colorCircleSecond: '#FE4D32', //圆点颜色2
    colorAwardDefault: '#F5F0FC', //奖品默认颜色
    colorAwardSelect: '#ffe400', //奖品选中颜色
    indexSelect: 0, //被选中的奖品index
    isRunning: false, //是否正在抽奖
    imageAward: [], //奖品图片数组
    showView: true,
  },

  onLoad: function(options) {
    this.initDeviceSize();
    //this.initSwiper();
    //未中过奖才初始化大转盘
    let hasWinLotteryBefore = wx.getStorageSync(constant.hasWinLotteryBefore);
    if (!hasWinLotteryBefore) {
      this.initLotteryView();
    }
  },

  //获取屏幕高度
  initDeviceSize: function() {
    let that = this;
    wx.getSystemInfo({
      success: function(res) {
        console.log(res);
        that.setData({
          deviceSize: {
            height: ((res.windowHeight * (750 / res.windowWidth) - 193 - 121 - 254)) / 750 * res.windowWidth,
            width: res.windowWidth + 1,
          }
        });
      }
    });
  },

  initSwiper: function() {
    let that = this;
    let url = 'banner/listbanner';
    httpReq.simpleRequest([url]).then(function(success) {
      if (success.status === 'success')
        that.processBannerData(success.banners);
      else {
        wx.showToast({
          title: '轮播图获取失败',
          icon: 'none'
        })
      }
    }).catch(function(error) {
      wx.showToast({
        title: '轮播图获取失败',
        icon: 'none'
      })
    }).finally(function() {

    });
  },

  processBannerData: function(banners) {
    if (Array.isArray(banners)) {
      let imgUrls = [];
      banners.reduce(function(accumulator, banner, index) {
        accumulator.push(banner.url);
        return accumulator;
      }, imgUrls);

      this.setData({
        swiper: {
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
  goToBanquetReserve: function() {
    wx.navigateTo({
      url: '../../pages/banquet/banquet-list/banquet-list',
    })
  },

  scanCode: function() {
    wx.scanCode({
      success: function(res) {
        console.log(res);
      }
    })
  },

  goToDirector: function() {
    wx.openLocation({
      latitude: 30.70,
      longitude: 118.40,
      name: '新煮天下美食府',
    });
  },

  goToDial: function() {
    wx.makePhoneCall({
      phoneNumber: '13731909494'
    });
  },










  /*转盘相关代码*/

  initLotteryView: function() {
    var _this = this;
    wx.showShareMenu({
      withShareTicket: true
    });
    _this.setButtonStatus();
    _this.initPrizeImg();
  },


  setButtonStatus: function() {
    let restLotteryTimes = wx.getStorageSync(constant.restLotteryTime);
    let hasWinLotteryBefore = wx.getStorageSync(constant.hasWinLotteryBefore);
    let flag = restLotteryTimes === 0 && hasWinLotteryBefore === false;
    this.setData({
      showShareBtn: flag
    });
  },

  initPrizeWheel: function() {
    var _this = this;
    //圆点设置
    var leftCircle = 7.5;
    var topCircle = 7.5;
    var circleList = [];
    for (var i = 0; i < 24; i++) {
      if (i == 0) {
        topCircle = 15;
        leftCircle = 15;
      } else if (i < 6) {
        topCircle = 7.5;
        leftCircle = leftCircle + 102.5;
      } else if (i == 6) {
        topCircle = 15
        leftCircle = 620;
      } else if (i < 12) {
        topCircle = topCircle + 94;
        leftCircle = 620;
      } else if (i == 12) {
        topCircle = 565;
        leftCircle = 620;
      } else if (i < 18) {
        topCircle = 570;
        leftCircle = leftCircle - 102.5;
      } else if (i == 18) {
        topCircle = 565;
        leftCircle = 15;
      } else if (i < 24) {
        topCircle = topCircle - 94;
        leftCircle = 7.5;
      } else {
        return
      }
      circleList.push({
        topCircle: topCircle,
        leftCircle: leftCircle
      });
    }
    this.setData({
      circleList: circleList
    })
    //圆点闪烁
    setInterval(function() {
      if (_this.data.colorCircleFirst == '#FFDF2F') {
        _this.setData({
          colorCircleFirst: '#FE4D32',
          colorCircleSecond: '#FFDF2F',
        })
      } else {
        _this.setData({
          colorCircleFirst: '#FFDF2F',
          colorCircleSecond: '#FE4D32',
        })
      }
    }, 500)
    //奖品item设置
    var awardList = [];
    //间距,怎么顺眼怎么设置吧.
    var topAward = 25;
    var leftAward = 25;
    for (var j = 0; j < 8; j++) {
      if (j == 0) {
        topAward = 25;
        leftAward = 25;
      } else if (j < 3) {
        topAward = topAward;
        //166.6666是宽.15是间距.下同
        leftAward = leftAward + 166.6666 + 15;
      } else if (j < 5) {
        leftAward = leftAward;
        //150是高,15是间距,下同
        topAward = topAward + 150 + 15;
      } else if (j < 7) {
        leftAward = leftAward - 166.6666 - 15;
        topAward = topAward;
      } else if (j < 8) {
        leftAward = leftAward;
        topAward = topAward - 150 - 15;
      }
      var imageAward = this.data.imageAward[j].url; //TODO 
      awardList.push({
        topAward: topAward,
        leftAward: leftAward,
        imageAward: imageAward
      });
    }
    this.setData({
      awardList: awardList
    })
  },

  initPrizeImg: function() {
    let that = this;
    let url = 'prize/list';
    httpReq.simpleRequest([url]).then(function(success) {
      if (success.status === 'success') {
        that.processPrizeData(success.prizeList);
        that.setData({
          showLotteryView: true
        });
        that.initPrizeWheel();
      } else {
        wx.showToast({
          title: '奖品图片获取失败',
          icon: 'none'
        })
      }
    }).catch(function(error) {
      wx.showToast({
        title: '奖品图片获取失败',
        icon: 'none'
      })
    }).finally(function() {

    });
  },
  processPrizeData: function(prizeList) {
    if (Array.isArray(prizeList)) {
      this.setData({
        imageAward: prizeList.map(function(item, index) {
          return {
            id: item.id,
            url: item.url,
            name: item.description
          }
        })
      });
    }
  },

  //开始游戏
  startGame: function() {

    var finallResult = this.getRandomTimes();
    if (this.data.isRunning) return;

    if (!this.checkIfCanStartButton()) {
      return;
    }

    this.setData({
      isRunning: true
    })
    var _this = this;
    var indexSelect = 0
    var i = 0;
    var timer = setInterval(function() {
      indexSelect++;
      //这里我只是简单粗暴用y=30*x+200函数做的处理.可根据自己的需求改变转盘速度
      i += 30;
      if (i > finallResult) {

        //去除循环
        clearInterval(timer)
        //获奖提示

        wx.showModal({
          title: [2, 4, 7].indexOf(indexSelect) == -1 ? '恭喜您' : '提示',
          content: _this.lotteryTips(indexSelect),
          showCancel: false, //去掉取消按钮
          success: function(res) {
            if (res.confirm) {
              _this.setData({
                isRunning: false
              })
            }
          }
        })
      }
      indexSelect = indexSelect % 8;
      _this.setData({
        indexSelect: indexSelect
      })
    }, (200 + i))
  },
  getRandomTimes: function() {
    var baseTimes = 480;
    var randomNumber = Math.random();
    return Math.floor(Math.random() * 240) + baseTimes;
  },

  lotteryTips: function(indexSelect) {
    var that = this;
    var no_prize_index = [2, 4, 7];
    var tips = null;
    if (no_prize_index.indexOf(indexSelect) == -1) { //中奖
      tips = '获得了一瓶' + this.data.imageAward[parseInt((indexSelect % 8))].name;
      wx.setStorageSync(constant.hasWinLotteryBefore, true);
      that.saveRecordBackEnd(indexSelect);
    } else { //未中奖
      tips = "很遗憾,您未中奖~,转发至群增加一次抽奖机会";
    }
    that.setButtonStatus();
    return tips;
  },

  checkIfCanStartButton: function() {
    let that = this;
    let hasWinLotteryBefore = wx.getStorageSync(constant.hasWinLotteryBefore);
    if (hasWinLotteryBefore === true) {
      wx.showModal({
        title: '提示',
        content: '您之前已经中过奖品,不可重复抽奖',
      })
      return false;
    }

    let restLotteryTimes = wx.getStorageSync(constant.restLotteryTime);
    if (restLotteryTimes === null || restLotteryTimes === 'undefined' || restLotteryTimes === '') {
      wx.setStorageSync(constant.restLotteryTime, 1);
    }
    restLotteryTimes = wx.getStorageSync(constant.restLotteryTime);

    wx.setStorageSync(constant.restLotteryTime, restLotteryTimes - 1);
    return true;
  },


  onShareAppMessage: function(options) {
    console.log('onShareAppMessage');
    let that = this;
    return {
      title: '新煮天下美食府',
      path: '/pages/index/index'
    }
  },


  /**
   * 抽中奖品后,向后台插入记录.
   */
  saveRecordBackEnd: function(indexSelect) {
    let that = this;
    let id = that.data.imageAward[indexSelect].id;
    let url = "prize/record";
    let params = {
      customer: {
        id: wx.getStorageSync(constant.customerId)
      },
      prize: {
        id: id
      }
    };
    httpReq.postRequestWithJSONSchema([url, params]).then(function(res) {
      console.log(res);
    }).catch(function(res) {
      console.log(res);
    }).finally(function() {

    });

  },
  Closebutton: function() {
    let that = this;
    that.setData({
      showLotteryView: false,
      showView: false
    })
  }
})