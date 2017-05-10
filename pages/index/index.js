var avUtil = require('../../utils/av-util.js')
const PASS_NUM = 6;
var app = getApp();

Page({
  data: {
    type: ['所有'].concat(app.globalData.type),
    selectedType: 0,
    passages:[],
    passageFinished: false,
    loadingPassages: false,
  },
  onShareAppMessage: function () {
      return {
          title: '木家具行业信息查询交流',
          path: '/pages/index/index'
      }
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
    var type = that.data.type[that.data.selectedType];
    avUtil.queryPassages(PASS_NUM, time, type, (results)=>{
      if (results && results.length != 0)
      {
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
      else
      {
        that.setData({
          passageFinished: true,
          loadingPassages: false
        });
      }
      if (cb)
        typeof cb == "function" && cb()
    });
  },
  onLoad: function () {
    this.setData({
      passages:[],
      passageFinished: false,
      loadingPassages: false,
    })
    this.requestData();
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
  //类型改变
  bindTypeChange: function(e) {
    this.setData({
        selectedType: e.detail.value,
        passages:[],
        passageFinished: false,
        loadingPassages: false,
    });
    this.requestData();
  },
  //点击一篇帖子
  tapPassage: function(e) {
    wx.navigateTo({
      url: '../detail/detail?id=' + e.currentTarget.dataset.id
    });
  },
})
