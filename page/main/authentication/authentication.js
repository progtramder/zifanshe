const app = getApp()
Page({
  bindGetUserInfo(e) {
    if (e.detail.userInfo) {
      app.setUserInfo(e.detail.userInfo)
      wx.navigateTo({
        url: '../consultant-info/consultant-info?apply=true',
      })
    }
  },
  getUserProfile() {
    wx.getUserProfile({
      desc: '用于展示用户头像', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
      success: (res) => {
        app.setUserInfo(res.userInfo)
        wx.navigateTo({
          url: '../consultant-info/consultant-info?apply=true',
        })
      }
    })
  }
})
