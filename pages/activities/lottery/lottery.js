Page({

    data: {
        drawing1: null,
        drawing2: null,
    },

    onLoad: function(options) {
    },

   
    prizeDrawingStarted2: function (res) {
        this.setData({
            drawing2: {
                needsDrawing: true,
                options: {
                    prizeIndex: 0,
                    prizeQuantity: 1,
                    animationDuration: 3000
                }
            }
        });
        console.log(this.data.drawing2.options);
    },

    prizeDrawingFinished : function(res){
        console.log(res)
        console.log('ab');
    }

})