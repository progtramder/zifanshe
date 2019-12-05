Page({

  onLoad: function (options) {
    wx.showNavigationBarLoading()
    const db = wx.cloud.database();
    db.collection('selected').where({
      _id: options.id
    }).get().then((res) => {
      wx.hideNavigationBarLoading()
      let product = res.data[0]
      wx.setNavigationBarTitle({
        title: product.name
      })
      this.setData(
        {
          product
        })
    })
  },

  viewDocument() {
    wx.showLoading()
    wx.cloud.downloadFile({
      fileID: this.data.product.document,
      success: function (res) {
        wx.hideLoading()
        wx.openDocument({
          filePath: res.tempFilePath,
        })
      },
      fail: function (res) {
        console.log(res);
      }
    })
  },
})