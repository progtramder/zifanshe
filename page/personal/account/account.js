const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    balance: '0.00'
  },

  onLoad: function () {
    wx.showNavigationBarLoading()
    wx.cloud.callFunction({
      name: 'database',
      data: {
        action: 'balance',
      }
    }).then(res => {
      wx.hideNavigationBarLoading()
      let account = res.result.data
      if (account.length > 0) {
        this.setData(
          {
            balance: account[0].balance.toFixed(2)
          })
      }
    }).catch(err => {
      wx.hideNavigationBarLoading()
      console.log(err)
    })
  },
  accountDetail() {
    wx.navigateTo({
      url: `../account-detail/account-detail`,
    })
  },

  withdraw() {
    wx.showModal({
      content: '暂时还不支持',
      showCancel: false,
      confirmColor: '#F56C6C'
    })
  },
})