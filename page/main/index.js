const config = require('../common/config')
const regeneratorRuntime = require('../common/runtime')
const app = getApp()
Page({
  onShareAppMessage() {
    return {
      title: '子繁社',
      path: 'page/main/index'
    }
  },

  data: {
    isConsultant: true,
    currentSwiperId: 0,
    category: config.category
  },
  swiperItemChanged(e) {
    this.data.currentSwiperId = e.detail.current
  },

  swiperItemTap(e) {
    let bultn = this.data.bulletins[this.data.currentSwiperId]
    if (bultn.page) {
      wx.navigateTo({
        url: `web-view/web-view?page=${bultn.page}`
      })
    } else {
      wx.previewImage({
        urls: [bultn.imageSrc],
      })
    }
  },

  categorySelect(e) {
    wx.navigateTo({
      url: `consultants/consultants?category=${e.currentTarget.id}`
    })
  },

  async onPullDownRefresh() {
    if (this.reInit) {
      await this.init()
    }
    wx.stopPullDownRefresh()
  },
  onShow() {
    this.setData({ isConsultant: app.getUserType() == 'consultant'})
    this.getHotConsultants()
  },

  async init() {
    this.reInit = false
    try {
      let res = await wx.cloud.callFunction({
        name: 'login'
      })
      let openId = res.result.OPENID
      app.setOpenId(openId)
      const db = wx.cloud.database()
      res = await db.collection('consultant').where({ _id: openId }).count()
      if (res.total == 0) {
        app.setUserType('user')
        this.setData({ isConsultant: false })
      }
      res = await db.collection('admin').where({ who: openId }).count()
      if (res.total > 0) {
        app.setAdmin(true)
        config.updateRedDotAdmin()
      } else {
        config.updateRedDot()
      }
    } catch(err) {
      this.reInit = true
      console.log(err)
    }
  },

  onLoad: function (options) {
    wx.getSetting({
      success : (res) => {
        if (res.authSetting['scope.userInfo']) {
          this.init()
          this.getBulletins()
          wx.getUserInfo({
            success: (res) => {
              app.setUserInfo(res.userInfo)
            }
          })
        } else {
          wx.reLaunch({
            url: 'authentication/authentication',
          })
        }
      }
    })
  },
  
  getBulletins() {
    const db = wx.cloud.database();
    db.collection('UI').doc('mainpage').get().then((res) => {
      app.setShowPrice(res.data.iphoneShowPrice == 'yes')
      this.setData({ bulletins : res.data.bulletins })
    });
  },

  getHotConsultants() {
    const db = wx.cloud.database();
    db.collection('consultant').where({
      status: 'approved'
    }).orderBy('grade', 'desc').limit(5).field({
        name: true,
        introduction: true,
        avatar: true
      }).get().then((res) => {
      this.setData(
      {
        consultants: res.data
      })
    })
  }
})
