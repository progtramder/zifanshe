Page({
  onLoad: function () {
    wx.showNavigationBarLoading()
    const db = wx.cloud.database();
    db.collection('corp-product').field({
      detail: false
    }).get().then((res) => {
      wx.hideNavigationBarLoading()
      this.setData(
        {
          product: res.data
        })
    })
  },

  onShareAppMessage: function () {
    return {
      path: 'page/corp-product/index'
    }
  }
})
