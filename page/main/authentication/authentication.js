const app = getApp()
Page({
  bindGetUserInfo(e) {
    if (e.detail.userInfo) {
      app.setUserInfo(e.detail.userInfo)
      wx.navigateTo({
        url: '../consultant-info/consultant-info?apply=true',
      })
    }
  }
})
