// pages/box-reserve/box-reserve.js
import httpReq from '../../utils/request.js';
import constant from '../../utils/constant.js';
Page({

    data: {
        roomList: [

        ],
        pageInfo: {
            totalCounts: 0, //总个数
            pageSize: 0, //每页显示条目
            nextPageNo: 1, //下一次请求需要传递的页数
            hasNoMoreData: false, //表示没有更多数据
        },
        /**
         *  0 仅午餐已预订
         *  1 仅晚餐已预订
         *  2 都预定
         *  3 都没预定
         */
        launchButtonNotAvaliable: [0, 2],
        supperButtonNotAvaliable: [1, 2],

    },


    onLoad: function(options) {
        this.getMoreBoxList();
    },


    /**
     * 获取更多包厢列表
     */
    getMoreBoxList: function() {
        let that = this;
        if (that.data.pageInfo.hasNoMoreData) {
            wx.showToast({
                title: '没有更多信息',
                icon: 'none'
            })
            return;
        }
        wx.showLoading({
            title: '努力加载中...',
        });
        httpReq.getRequest(that.getRequestParams()).then(function(success) {
            if (success.status === 'success') {
                that.dataProcess(success);
            } else
                getApp().globalHint("获取包厢列表失败");
        }).catch(function(err) {
            wx.hideLoading(); //因为showLoading和showToast只能显示一个.这里确保先隐藏Loading
            wx.showToast({
                title: '请求发送失败',
                icon: 'none'
            })
        }).finally(function(abc) {
            wx.hideLoading();
        });

    },
    /**
     * 为获取更多包厢列表 准备参数
     */
    getRequestParams: function() {
        let nextPageNo = this.data.pageInfo.nextPageNo;
        let params = {
            currentPageNo: nextPageNo,
            reservationsStartTime: getApp().boxReserveInfo.reserveTime
        };
        return ["box/listnullbox", params];
    },
    /**
     * 处理请求成功返回来的数据
     */
    dataProcess: function(result) {
        let that = this;
        if (Array.isArray(result.boxs)) {
            //组装包厢信息
            let roomList = result.boxs.map(function(room) {
                let launchBtnAvaliable = that.data.launchButtonNotAvaliable.indexOf(room.reserveStatus) == -1;
                let supperBtnAvaliable = that.data.supperButtonNotAvaliable.indexOf(room.reserveStatus) == -1;
                return {
                    id: room.id,
                    roomNumber: room.roomNumber,
                    roomSize: room.roomSize,
                    roomName: room.roomName,
                    roomDescription: room.roomIntroduction,
                    launchButtonAvaliable: launchBtnAvaliable,
                    supperButtonAvaliable: supperBtnAvaliable,
                    imgURLs: [
                        room.boximage[0].url
                    ]
                }
            });
            //组装分页信息
            let pageInfo = {
                pageSize: result.pageSize,
                totalCounts: result.totalCounts,
                nextPageNo: that.data.pageInfo.nextPageNo + 1, //当前页数
                hasNoMoreData: result.boxs.length < result.pageSize
            };
            that.setData({
                roomList: roomList,
                pageInfo: pageInfo
            });
        }
    },

    reserveLaunch: function(res) {
        let app = getApp();
        app.boxReserveInfo.boxId = res.target.dataset.id;
        app.boxReserveInfo.boxName = res.target.dataset.name
        app.boxReserveInfo.reservationType = constant.launchType;
        wx.navigateTo({
            url: '../box-reserve-form/box-reserve-form',
        })
    },

    reserveSupper: function(res) {
        let app = getApp();
        app.boxReserveInfo.boxId = res.target.dataset.id;
        app.boxReserveInfo.boxName = res.target.dataset.name
        app.boxReserveInfo.reservationType = constant.supperType;
        wx.navigateTo({
            url: '../box-reserve-form/box-reserve-form',
        })
    },

})