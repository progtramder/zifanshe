const config = require('../common/config')
const app = getApp()
Page({
  onShow() {
    this.setData({
      userInfo: app.getUserInfo(),
      isAdmin: app.isAdmin(),
      isConsultant: app.getUserType() == 'consultant',
      openId: app.getOpenId()
    })
    app.isAdmin() ? config.updateRedDotAdmin(this) : config.updateRedDot(this)
  },
})
