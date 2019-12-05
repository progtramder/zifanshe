const app = getApp()
Page({
  data: {
    order: {}
  },

  onLoad({ id }) {
    this.setData({out_trade_no: id})
    this.getOrder(id)
  },

  pay() {
    let orderQuery = this.data.order
    const {
      time_stamp,
      nonce_str,
      sign,
      prepay_id,
    } = orderQuery;
    wx.requestPayment({
      timeStamp: time_stamp,
      nonceStr: nonce_str,
      package: `prepay_id=${prepay_id}`,
      signType: 'MD5',
      paySign: sign,
      success: res => {
        this.finishPay()
      },
      fail: function (res) {}
    })
    
  },

  finishPay() {
    wx.showLoading()
    const {
      prepay_id,
      body,
      total_fee,
      out_trade_no
    } = this.data.order;
    wx.cloud.callFunction({
      name: 'pay',
      data: {
        type: 'finishPay',
        data: {
          body,
          prepay_id,
          out_trade_no,
          total_fee
        }
      } 
    }).then(res => {
      this.getOrder(out_trade_no, () => {
        wx.hideLoading()
      })
    })    
  },

  close() {
    wx.showLoading({
      title: '正在取消订单'
    });
    let out_trade_no = this.data.out_trade_no
    wx.cloud.callFunction({
      name: 'pay',
      data: {
        type: 'closeorder',
        data: {
          out_trade_no
        }
      }
    }).then(res => {
      this.getOrder(out_trade_no, () => {
        wx.hideLoading()
        wx.showToast({
          title: '订单已取消'
        })
      })
    })
  },

  getOrder(id, callback) {
    wx.cloud.callFunction({
      name: 'pay',
      data: {
        type: 'orderquery',
        data: {
          out_trade_no: id
        }
      }
    }).then(res => {
      this.setData({
        order: res.result.data
      });
      if (callback) callback(res.result.code)
    })
  }
})
