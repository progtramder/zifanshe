const config = require('../../common/config')
Page({
  data: {
    category: config.category,
    selCategory: []
  },
  onLoad(opts) {
    this.setData({ openId: opts.id })
    const db = wx.cloud.database();
    db.collection('consultant').doc(opts.id).get().then(res => {
      let data = res.data
      wx.setNavigationBarTitle({
        title: data.name
      })
      this.setData(
        {
          avatar: data.avatar,
          name: data.name,
          phoneNumber: data.phoneNumber,
          wxNumber: data.wxNumber,
          introduction: data.introduction,
          introImage: data.introImage,
          specialty: data.specialty,
          occupation: data.occupation,
          dream: data.dream,
          motto: data.motto,
          product: data.product,
          referral: data.referral,
          zifanCourse: data.zifanCourse
        })
    })
  },

  phoneCall() {
    wx.makePhoneCall({
      phoneNumber: this.data.phoneNumber
    })
  },
})