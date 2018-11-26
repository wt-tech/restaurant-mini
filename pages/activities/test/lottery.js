import constant from '../../../utils/constant.js';
Page({
    data: {
        circleList: [],//圆点数组
        awardList: [],//奖品数组
        colorCircleFirst: '#FFDF2F',//圆点颜色1
        colorCircleSecond: '#FE4D32',//圆点颜色2
        colorAwardDefault: '#F5F0FC',//奖品默认颜色
        colorAwardSelect: '#ffe400',//奖品选中颜色
        indexSelect: 0,//被选中的奖品index
        isRunning: false,//是否正在抽奖
        imageAward: [
            {
                url: '../../../img/lottery/cola.jpg',
                name : '可口可乐'
            },
            {
                url: '../../../img/lottery/orange.jpg',
                name : '果粒橙'
            },
            {
                url: '../../../img/lottery/no_prize.png',
                name: '谢谢参与'
            },
            {
                url: '../../../img/lottery/spirit.jpg',
                name: '雪碧'
            },
            {
                url: '../../../img/lottery/no_prize.png',
                name: '谢谢参与'
            },
            {
                url: '../../../img/lottery/vinegar.jpg',
                name: '苹果醋'
            },
            {
                url: '../../../img/lottery/wine.jpg',
                name: '汪伦情'
            },
            {
                url: '../../../img/lottery/no_prize.png',
                name: '谢谢参与'
            }
          
        ],//奖品图片数组
    },

    onLoad: function () {
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
            circleList.push({ topCircle: topCircle, leftCircle: leftCircle });
        }
        this.setData({
            circleList: circleList
        })
        //圆点闪烁
        setInterval(function () {
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
            var imageAward = this.data.imageAward[j].url;//TODO 
            awardList.push({ topAward: topAward, leftAward: leftAward, imageAward: imageAward });
        }
        this.setData({
            awardList: awardList
        })
    },
    //开始游戏
    startGame: function () {
        var finallResult = this.getRandomTimes();
        if (this.data.isRunning) return
        this.setData({
            isRunning: true
        })
        var _this = this;
        var indexSelect = 0
        var i = 0;
        var timer = setInterval(function () {
            indexSelect++;
            //这里我只是简单粗暴用y=30*x+200函数做的处理.可根据自己的需求改变转盘速度
            i += 30;
            if (i > finallResult) {

                //去除循环
                clearInterval(timer)
                //获奖提示

                wx.showModal({
                    title: '恭喜您',
                    content: _this.lotteryTips(indexSelect),
                    showCancel: false,//去掉取消按钮
                    success: function (res) {
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
    getRandomTimes : function(){
        var baseTimes = 480;
        var randomNumber = Math.random();
        return Math.floor(Math.random() * 240) + baseTimes;
    },

    lotteryTips: function (indexSelect){
        var no_prize_index = [2,4,7];
        var tips = null;
        if (no_prize_index.indexOf(indexSelect) == -1){
            tips = '获得了一瓶' + this.data.imageAward[parseInt((indexSelect % 8))].name;
        }else
            tips = "很遗憾,您未中奖~"
        return tips;
    },

    checkIfCanStartButton : function(){
        let restLotteryTimes = wx.getStorageSync(constant.restLotteryTime);
        if (restLotteryTimes == null || restLotteryTimes == 'undefined' || restLotteryTimes == '') {
            wx.setStorageSync(constant.restLotteryTime, 1);
        }
        restLotteryTimes = wx.getStorageSync(constant.restLotteryTime);
        if (restLotteryTimes == 0){
            wx.showModal({
                title: '提示',
                content: '每转发到群即可增加一次抽奖次数',
                confirmText : '转发到群'
            });
            return false;
        }
        return 
    }

})
