const regeneratorRuntime  = require("../../common/runtime");
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isEmpty: false,
    comment: []
  },

  onLoad: async function () {
    wx.showNavigationBarLoading()
    const db = wx.cloud.database();
    let openId = app.getOpenId()
    try {
      let res = await db.collection('comment').doc(openId).get()
      this.setData({ message : res.data.comment })
      db.collection('comment').doc(openId).update({
        data: {
          unread: false
        },
      })
    } catch(err) {
      this.setData({
        isEmpty: true
      })
    }
    wx.hideNavigationBarLoading()
  }
})