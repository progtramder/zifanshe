const regeneratorRuntime  = require("../../common/runtime");
const app = getApp()
Page({
  onShareAppMessage() {
    return {
      title: this.data.consultant.name,
      path: `page/main/consultant-profile/consultant-profile?id=${this.data.consultant._id}`
    }
  },

  async onLoad(options) {
    const db = wx.cloud.database();
    wx.showNavigationBarLoading()
    try {
      let resConsultant = await db.collection('consultant').doc(options.id).field({
        name: true,
        introduction: true,
        avatar: true,
        introImage: true
      }).get()
      wx.setNavigationBarTitle({
        title: resConsultant.data.name
      })

      let resProduct = await db.collection('product').where({
        _openid: options.id
      }).field({detail: false}).get()

      this.setData(
        {
          consultant: resConsultant.data,
          product: resProduct.data
        })
    } finally{
      wx.hideNavigationBarLoading()
    }
  },

  onUnload() {
    wx.cloud.callFunction({
      name: 'database',
      data: {
        action: 'incGrade',
        openId: this.data.consultant._id
      }
    })
  }
})
