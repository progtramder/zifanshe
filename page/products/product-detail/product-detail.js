const regeneratorRuntime = require("../../common/runtime")
const app = getApp()
Page({
  data: {
  },
  onLoad(options) {
    this.data.product_id = options.id
  },

  async onShow() {
    try {
      wx.showNavigationBarLoading()
      if (!app.getOpenId()) {
        const res = await wx.cloud.callFunction({ name: 'login' })
        const { openId } = res.result
        app.setOpenId(openId)
      }

      let product = this.data.product
      const db = wx.cloud.database();
      if (!product) {
        let res = await db.collection('product').doc(this.data.product_id).get()
        product = res.data
        wx.setNavigationBarTitle({ title: product.name })
      }

      //判断用户是否已经购买该产品
      let purchased = false
      if (product.price > 0) {
        const res = await db.collection('order').where({
          _openid: app.getOpenId(),
          product: product._id,
          status: 1 //已支付
        }).get()
        if (res.data.length > 0) {
          for (let i = 0; i < product.detail.length; i++) {
            if (product.detail[i].locker === true) {
              product.detail[i].locker = false
            }
          }
          purchased = true
        }
      }

      //如果不是iOS平台或者是showprice设置成true的时候显示价格按钮
      let showPrice = false
      if (!app.isApple() || app.getShowPrice()) {
        showPrice = true
      }

      this.setData({
        product,
        purchased,
        showPrice
      })
    } catch (err) {
      wx.showModal({
        content: err.errMsg,
        showCancel: false,
        confirmColor: '#F56C6C',
        confirmText: '知道了'
      })
    } finally {
      wx.hideNavigationBarLoading()
    }
  },
  
  onPay() {
    if (this.data.purchased) {
      return
    }

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
  previewDetail(e) {
    let urls = []
    this.data.product.detail.forEach(item => {
      if (item.type == 'image') {
        urls.push(item.src)
      }
    })
    wx.previewImage({
      urls,
      current: e.currentTarget.dataset.imgpath
    })
  },

  async viewDocument(event) {
    const document = event.currentTarget.dataset.document
    const locker = document.locker
    const product = this.data.product
    if (product.price > 0 && locker) {
      wx.showModal({
        content: '付费内容，购买后可解锁',//'付费内容，输入验证码或购买后可解锁',
        showCancel: false,
        confirmColor: '#F56C6C',
        confirmText: '知道了'
      })
      return
    }
    const docPath = document.src
    wx.showLoading({
      title: '正在下载文件',
    })
    wx.cloud.downloadFile({
      fileID: docPath,
      success: function (res) {
        wx.openDocument({
          filePath: res.tempFilePath,
        })
      },
      fail: function (res) {
        console.log(res);
      },
      complete: function () {
        wx.hideLoading()
      }
    })
  },

  async playVideo(event) {
    const video = event.currentTarget.dataset.video
    const locker = video.locker
    const product = this.data.product
    if (product.price > 0 && locker) {
      wx.showModal({
        content: '付费内容，购买后可解锁',//'付费内容，输入验证码或购买后可解锁',
        showCancel: false,
        confirmColor: '#F56C6C',
        confirmText: '知道了'
      })
      return
    }
  },

  onShareAppMessage: function () {
    return {
      title: this.data.product.name,
      path: `page/products/product-detail/product-detail?id=${this.data.product._id}`
    }
  }
})