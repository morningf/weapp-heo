var avUtil = require('../../utils/av-util.js');
var util = require('../../utils/util.js');
const PASS_NUM = 6;

Page({
    data : {
        passages:[],
        passageFinished: false,
        loadingPassages: false,
    },
    requestData: function(cb){
        var that = this;
        that.setData({
            loadingPassages: true
        });
        var time = null;
        if (that.data.passages.length != 0)
            time = that.data.passages[that.data.passages.length-1].updatedAt;
        else
            time = new Date();

        avUtil.queryMyPassages(PASS_NUM, time, (results)=>{
            if (results && results.length != 0) {
                for (var i = 0; i < results.length; ++i) {
                    results[i].attributes.todayRefreshed = util.isToday(results[i].updatedAt);
                }
                if (results.length < PASS_NUM) {
                    that.setData({
                        passages: that.data.passages.concat(results),
                        passageFinished: true,
                        loadingPassages: false
                    });
                }
                else{
                    that.setData({
                        passages: that.data.passages.concat(results),
                        loadingPassages: false
                    });
                }
            }
            else {
                that.setData({
                    passageFinished: true,
                    loadingPassages: false
                });
            }
            if (cb)
                typeof cb == "function" && cb();
        }, function(){
            that.setData({
                passageFinished: true,
                loadingPassages: false
            });
        });
    },
    onLoad: function()
    {
        wx.setNavigationBarTitle({
            title: '我发布的信息'
        });
        this.setData({
            passages:[],
            passageFinished: false,
            loadingPassages: false,
        })
        this.requestData();
    },
    //点击一篇帖子
    tapPassage: function(e) {
        wx.navigateTo({
             url: '../detail/detail?id=' + e.currentTarget.dataset.id
        });
    },
    //图片预览
    previewImage: function(e) {
        wx.previewImage({
            current: e.currentTarget.dataset.src,
            urls: e.currentTarget.dataset.item.images
        });
    },
    //下拉刷新
    onPullDownRefresh: function() {
        if (this.data.loadingPassages) return;
        this.data.loadingPassages = true;
        this.data.passages = [];
        this.setData({
            passageFinished: false,
        })
        this.requestData(function(){
            wx.stopPullDownRefresh();
        });
    },
    //滑到底
    onReachBottom: function() {
        if (this.data.passageFinished)
            return;
        this.requestData();
    },
    //发布新信息
    submitNewPassage: function() {
        wx.navigateTo({
             url: '../edit/edit'
        });
    },
    //删除
    tapDelete: function(e) {
        var that = this;
        wx.showModal({
            title: '提示',
            content: '确定删除吗？删除后不可恢复',
            success: function(res) {
                if (res.confirm)
                {
                    avUtil.deletePassage(e.currentTarget.dataset.id, 
                        function(){
                            wx.showToast({
                                title: '成功',
                                icon: 'success',
                                duration: 1000
                            });
                            that.setData({
                                passages:[],
                                passageFinished: false,
                                loadingPassages: false,
                            });
                            that.requestData();
                        },
                        function(error){
                            wx.showToast({
                                title: '失败',
                                icon: 'warn',
                                duration: 1000
                            });
                        });
                }
            }
        });
    },
    //刷新
    tapRefresh: function(e) {
        var that = this;
        wx.showModal({
            title: '提示',
            content: '确定刷新吗？每天只能刷新一次，刷新后此信息的排名将更靠前。',
            success: function(res) {
                if (res.confirm)
                {
                    avUtil.refreshPassage(e.currentTarget.dataset.id, 
                        function(){
                            wx.showToast({
                                title: '成功',
                                icon: 'success',
                                duration: 1000
                            });
                            that.setData({
                                passages:[],
                                passageFinished: false,
                                loadingPassages: false,
                            });
                            that.requestData();
                        },
                        function(error){
                            wx.showToast({
                                title: '失败',
                                icon: 'warn',
                                duration: 1000
                            })
                        });
                }
            }
        });
    }
})