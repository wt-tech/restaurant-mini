import util from '../../utils/util.js';
Page({

    data: {

        // DAYSEACHWEEK: 7,
        // calendar: {
        //     header: "2018年10月-2018年11月",
        //     weekRow: ['日', '一', '二', '三', '四', '五', '六'],
        //     dateList: [
        //         [21, 22, 23, 24, 25, 26, 27],
        //         [28, 29, 30, 31, '01', 2, 3],
        //         [4, 5, 6, 7, 8, 9, 10]
        //     ],
        // }

        selectedDate: getApp().boxReserveInfo.reserveTime

    },

    goToBoxRoomList: function() {
        if (this.checkDateReasonable()){
            wx.navigateTo({
                url: '../box-list/box-list',
            });
        }else{
            wx.showModal({
                title: '提示',
                content: "所选日期不合法",
            });
        }
    },

    checkDateReasonable : function(){
        let app = getApp();
        let selectedDate = app.boxReserveInfo.reserveTime;
        let today = util.formatDate(new Date);
        console.log(selectedDate,today);
        return new Date(selectedDate) >= new Date(today);
    },


    onLoad: function(options) {
        // this.initCalendar();
        // console.log('onload');
    },

    onShow : function(){
        this.setData({
            selectedDate: getApp().boxReserveInfo.reserveTime
        });
    },

    bindselectDate : function(res){
        let selectedDate = res.detail.date;
        let app = getApp();
        app.boxReserveInfo.reserveTime = selectedDate;
    }











    /**
     * 被注释掉的是自己实现的日历
     */
    // initCalendar: function() {
    //     let that = this;
    //     let arr = [];
    //     that.fillPastAndToday(arr); //填充今日以及之前日期
    //     that.fillFutureDays(arr); //填充今日以后日期.

    //     that.setData({
    //         calendar: that.assembleCalendar(arr)
    //     });
    // },

    // fillPastAndToday: function(arr) {
    //     let date = this.getToday(); //今日日期.
    //     let day = date.getDate();
    //     let weekDay = date.getDay(); //今日周几


    //     let tempDate = this.getToday();

    //     let index = weekDay;
    //     while (index >= 0) {
    //         let tempDate = this.getToday();
    //         tempDate.setDate(day--);
    //         arr.unshift(tempDate.getDate());
    //         index--;
    //     }
    // },
    // fillFutureDays: function(arr) {
    //     let today = this.getToday(); //今日日期.
    //     let tempDate = this.getToday();
    //     tempDate.setDate(today.getDate() + 1); //明日日期
    //     let endDate = this.getToday();

    //     let day = today.getDate();
    //     let month = today.getMonth();

    //     endDate.setMonth(month + 2); //下月的当天

    //     while (tempDate.getDate() != endDate.getDate()) { //只要二者天数不同
    //         arr.push(tempDate.getDate());
    //         tempDate.setDate(tempDate.getDate() + 1);
    //     }
    //     // console.log(arr);
    // },

    // assembleCalendar: function(arr) {
    //     let that = this;
    //     let dateList = [];
    //     arr.reduce(function(accumulator, currentValue, currentIndex, thisArr) {
    //         if (currentIndex % that.data.DAYSEACHWEEK === 0) { //周日
    //             accumulator = [];
    //         }
    //         accumulator.push(currentValue);
    //         //周六 或者 遍历结束
    //         if (currentIndex % that.data.DAYSEACHWEEK === 6 || currentIndex === thisArr.length - 1) {
    //             dateList.push(accumulator);
    //         }
    //         return accumulator;
    //     }, []);

    //     let calendar = that.data.calendar;
    //     calendar.dateList = dateList;
    //     return calendar;
    // },

    // getToday: function() {
    //     let today = new Date();
    //     return today;
    // }


})