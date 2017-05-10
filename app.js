//app.js

const AV = require('./libs/av-weapp-min.js');
AV.init({ 
 appId: '这里是LeanCloud的appId', 
 appKey: '这里是LeanCloud的appKey', 
});

App({
  onLaunch: function () {
    AV.User.loginWithWeapp().then(user => {
      console.log(user)
      // 调用小程序 API，得到用户信息
      wx.getUserInfo({
        success: ({userInfo}) => {
          // 更新当前用户的信息
          user.set(userInfo).save().then(user => {
            // 成功，此时可在控制台中看到更新后的用户信息
            this.globalData.userInfo = user.toJSON()
            console.log(this.globalData.user)
          }).catch(console.error);
        },
        fail: function(res) {
          console.error(res)
        }
      })
    }).catch(error => console.error(error))
  },
  globalData:{
    userInfo:null,
    type: ['综合','成品','白茬','木料','雕刻','烘干','切割','机器','招工'] //论坛模块的类型
  }
})