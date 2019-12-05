Page({
  bindGetUserInfo(e) {
    if (e.detail.userInfo) {
      wx.switchTab({
        url: '../index',
      })
    }
  }
})
