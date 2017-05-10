var avUtil = require('../../utils/av-util.js');

Page({
    data: {
        succeed: false,
        item: {}
    },
    onShareAppMessage: function () {
        var that = this;
        return {
            title: that.data.item.attributes.nickName+": 我发布了一条信息",
            path: '/pages/detail/detail?id=' + that.data.item.id
        }
    },
    onLoad: function(option) {
        var that = this;
        avUtil.queryPassageByObjectId(option.id,
            function(pa){
                that.setData({
                    succeed: true,
                    item: pa
                });
            },
            function(error){
                that.setData({
                    succeed: false,
                });
            });
    },
    //图片预览
    previewImage: function(e) {
        wx.previewImage({
            current: e.currentTarget.dataset.src,
            urls: e.currentTarget.dataset.item.images
        });
    },
    goHome: function(){
        wx.switchTab({
            url: '/pages/index/index'
        })
    }
})