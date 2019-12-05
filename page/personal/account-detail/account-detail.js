function collection() {
  this.nLimit = 0
  this.nSkip = 0
}
collection.prototype.skip = function (skip) {
  this.nSkip = skip
  return this
}
collection.prototype.limit = function (limit) {
  this.nLimit = limit
  return this
}
collection.prototype.get = function () {
  return new Promise((resole, reject) => {
    wx.cloud.callFunction({
      name: 'database',
      data: {
        action: 'accountDetail',
        skip: this.nSkip,
        limit: this.nLimit,
      }
    }).then(res => {
      resole(res.result)
    }).catch(err => {
      reject(err)
    })
  })
}

Page({
  data: {
    order: [],
    isEmpty: false
  },

  onLoad() {
    wx.showNavigationBarLoading()
    this.dbCollection().limit(10).get().then(res => {
      wx.hideNavigationBarLoading()
      this.setData({
        order: res.data,
        isEmpty: res.data.length ? false : true
      });
    }).catch(err => {
      console.log(err)
      wx.hideNavigationBarLoading()
    })
  },

  onReachBottom() {
    wx.showLoading()
    let order = this.data.order
    this.dbCollection().skip(
      order.length
    ).limit(5).get().then((res) => {
      order.push(...res.data)
      wx.hideLoading()
      this.setData(
        {
          order
        })
      }).catch(err => {
        console.log(err)
        wx.hideLoading()
      })
  },

  dbCollection() {
    return new collection()
  }
})
