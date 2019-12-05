const app = getApp()
Page({
  onLoad: function (options) {
    wx.showNavigationBarLoading()
    const db = wx.cloud.database();
    db.collection('product').where({
      _id: options.id
    }).get().then((res) => {
      wx.hideNavigationBarLoading()
      let product = res.data[0]
      wx.setNavigationBarTitle({
        title: product.name
      })

      //如果不是iOS平台或者是showprice设置成true的时候显示价格按钮
      let showPrice = false
      if (!app.isApple() || app.getShowPrice()) {
        showPrice = true
      }
      this.setData(
        {
          product,
          showPrice
        })
    })
  },
  
  onPay() {
    wx.showLoading({ title: '正在下单'});
    let id = this.data.product._id;
    wx.cloud.callFunction({
      name: 'pay',
      data: {
        type: 'unifiedorder',
        data: 
        {
          goodId: id 
        }
      }
    }).then(res => {
      wx.hideLoading();
      wx.navigateTo({
        url: `/page/payorder/index?id=${res.result.data.out_trade_no}`
      })
    }).catch(err => {
      console.log(err)
      wx.hideLoading();
    });
  },

  previewCover() {
    wx.previewImage({
      urls: [this.data.product.cover],
      current: this.data.product.cover
    })
  },
  imageTap(e) {
    wx.previewImage({
      urls: this.data.product.detail,
      current: e.currentTarget.dataset.imgpath
    })
  },

  onShareAppMessage: function () {
    return {
      title: this.data.product.name,
      path: `page/products/product-detail/product-detail?id=${this.data.product._id}`
    }
  }
})