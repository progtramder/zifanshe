App({
  onLaunch(opts) {
    wx.cloud.init({
      env: 'zifan-cloud-eea07b'
    })

    const res = wx.getSystemInfoSync()
    if (res.system.match(/ios/i)) {
      this.globalData.iOS = true
    }
  },
  globalData: {
    openId: null,
    userInfo: null,
    userType: 'consultant', //user or consultant
    isAdmin: false,
    iOS: false,
    iphoneShowPrice: true
  },

  isApple() {
    return this.globalData.iOS
  },
  setShowPrice(show) {
    this.globalData.iphoneShowPrice = show
  },
  getShowPrice() {
    return this.globalData.iphoneShowPrice
  },
  getOpenId() {
    return this.globalData.openId
  },

  getUserInfo() {
    return this.globalData.userInfo
  },

  setOpenId(openId) {
    this.globalData.openId = openId
  },

  setUserInfo(userInfo) {
    this.globalData.userInfo = userInfo
  },

  getUserType() {
    return this.globalData.userType
  },
  setUserType(userType) {
    this.globalData.userType = userType
  },

  setAdmin() {
    this.globalData.isAdmin = true
  },
  isAdmin(userType) {
    return this.globalData.isAdmin
  }
})
