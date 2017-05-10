var avUtil = require('../../utils/av-util.js');
var app = getApp();

Page({
    data: {
        images: [],
        type: app.globalData.type,
        selectedType: 0,
        submitting: false
    },
    addImage: function()
    {
        var that = this;
        wx.chooseImage({
            count: 3 - that.data.images.length,
            success: function(obj){
                console.log("success");
                that.data.images = that.data.images.concat(obj.tempFilePaths);
                that.setData({
                    images: that.data.images
                });
            }
        });
    },
    bindTypeChange: function(e) {
        this.setData({
            selectedType: e.detail.value
        });
    },
    errBox: function(err) {
        wx.showModal({
            title: '错误',
            content: err,
            showCancel: false
        });
    },
    msgBox: function(msg){
        wx.showModal({
            title: '信息',
            content: msg,
            showCancel: false
        });
    },
    doSubmitPassage: function(e){
        this.setData({
            submitting: true
        });
        var data = this.data;
        var that = this;
        avUtil.submitPassage(
            e.detail.value.textarea, 
            data.images, 
            data.type[data.selectedType],
            function(pa){
                that.setData({
                    submitting: false
                });
                wx.showModal({
                    title: '成功',
                    content: "提交成功",
                    showCancel: false,
                    success: function(res) {
                    if (res.confirm) {
                        console.log(pa);
                        wx.redirectTo({
                            url: '../detail/detail?id=' + pa.id
                        })
                    }
                }
                });
            },
            function(error) {
                that.setData({
                    submitting: false
                });
                that.errBox("提交失败");
                console.error(error);
            })
    },
    submitPassage: function(e){
        if (e.detail.value.textarea === '')
        {
            wx.showModal({
                title: '提示',
                content: '请输入要发布的内容',
                showCancel: false
            });
            return;
        }
        var that = this;
        wx.showModal({
            title: '提示',
            content: '确定发布吗？',
            success: function(res) {
                if (res.confirm)
                    that.doSubmitPassage(e);
            }
        });
    }
})