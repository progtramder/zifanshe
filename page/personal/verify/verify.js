const config = require('../../common/config')
Page({
  data: {
    category: config.category,
    selCategory: []
  },
  onLoad(opts) {
    this.setData({ openId: opts.id })
    const db = wx.cloud.database();
    db.collection('consultant').doc(opts.id).get().then( res => {
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
  approve() {
    if (!this.data.selCategory.length) {
      wx.showModal({
        content: '至少选择一种顾问类别',
        showCancel: false,
        confirmColor: '#F56C6C'
      })
      return
    }
    wx.showModal({
      title: '确定审核通过？',
      confirmColor: '#F56C6C',
      success: res => {
        if (res.confirm) {
          wx.showLoading()
          wx.cloud.callFunction({
            name: 'database',
            data: {
              action: 'approve',
              openId: this.data.openId,
              category: this.data.selCategory.join('|')
            },
            success: (res) => {
              wx.navigateBack()
            },
            fail: (res) => {
              wx.showModal({
                content: '数据库写入失败，请检查网络',
                showCancel: false,
                confirmColor: '#F56C6C'
              })
            },
            complete: (res) => {
              wx.hideLoading()
            }
          })
        }
      }
    })
  },

  phoneCall() {
    wx.makePhoneCall({
      phoneNumber: this.data.phoneNumber
    })
  },
  categoryChange(e) {
    this.setData({
      selCategory: e.detail.value
    })
  }
})