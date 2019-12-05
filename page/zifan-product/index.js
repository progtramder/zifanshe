Page({
  onLoad: function () {
    wx.showNavigationBarLoading()
    const db = wx.cloud.database();
    db.collection('zifan-product').field({
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
      path: 'page/zifan-product/index'
    }
  }
})
