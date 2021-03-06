const { TabPage } = require('../common/common')
const config = require('../common/config')
const regeneratorRuntime = require('../common/runtime')
const app = getApp()
TabPage({
  async onShow() {
    let isAdmin = app.isAdmin()
    if (isAdmin == null) {
      res = await db.collection('admin').where({ who: openId }).count()
      isAdmin = res.total > 0 ? true : false
      app.setAdmin(isAdmin)
    }

    this.setData({
      isAdmin,
    })

    isAdmin ? config.updateRedDotAdmin(this) : config.updateRedDot(this)
  },

  async onLoad() {
    try {
      wx.showNavigationBarLoading()
      let res
      let openId = app.getOpenId()
      if (!openId) {
        res = await wx.cloud.callFunction({
          name: 'login'
        })
        openId = res.result.OPENID
        app.setOpenId(openId)
      }

      const db = wx.cloud.database()
      res = await db.collection('consultant').where({ _id: openId }).count()
      const isConsultant = res.total > 0 ? true : false

      this.setData({
        isConsultant,
        openId
      })
    } finally {
      wx.hideNavigationBarLoading()
    }
  },

  join() {
    /*wx.getSetting({
      success : (res) => {
        if (res.authSetting['scope.userInfo']) {
          wx.getUserProfile({
            desc: 'desc',
          })({
            success: (res) => {
              app.setUserInfo(res.userInfo)
              wx.navigateTo({
                url: '../main/consultant-info/consultant-info?apply=true',
              })
            }
          })
        } else {
          wx.navigateTo({
            url: '../main/authentication/authentication',
          })
        }
      }
    })*/
    wx.navigateTo({
      url: '../main/authentication/authentication',
    })
  }
})
