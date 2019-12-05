const app = getApp()
Page({
  data: {
    name: '',
    phone: ''
  },
  onLoad: function (options) {
    wx.showNavigationBarLoading()
    const db = wx.cloud.database();
    db.collection('corp-product').where({
      _id: options.id
    }).get().then((res) => {
      wx.hideNavigationBarLoading()
      let product = res.data[0]
      wx.setNavigationBarTitle({title : product.name})
      this.setData(
        {
          product,
        })
    })
  },

  getPhoneNumber(e) {
    this.data.phone = e.detail.value
  },
  getName(e) {
    this.data.name = e.detail.value
  },

  onPay() {
    if (this.data.phone == '' || this.data.name == '') {
      wx.showModal({
        content: '请留下姓名和电话以便购买成功后我们联系您',
        showCancel: false,
        confirmColor: '#F56C6C'
      })
      return
    }
    wx.showLoading({ title: '正在下单' });
    let id = this.data.product._id;
    wx.cloud.callFunction({
      name: 'zfpay',
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
        url: `../pay/index?id=${res.result.data.out_trade_no}&name=${this.data.name}&phone=${this.data.phone}`
      })
    }).catch(err => {
      console.log(err)
      wx.hideLoading();
    });
  },

  onShareAppMessage: function () {
    return {
      title: this.data.product.name,
      path: `page/corp-product/product-detail/index?id=${this.data.product._id}`
    }
  }
})