const regeneratorRuntime = require('../../common/runtime')
Page({
  data: {
    pressed: 0,
    scheduledLoading: false,
    loadingMore: false,
    category: [
      '待审核顾问',
      '已审核顾问'
    ],
    consultantsVerifying: [],
    consultantApproved: []
  },
  async onLoad() {
    try {
      wx.showNavigationBarLoading()
      await this.loadVerifying()
      await this.loadApproved()
    } catch(err) {
      console.log(err)
    } finally {
      wx.hideNavigationBarLoading()
    }
  },

  tabChanged(e) {
    const index = e.detail
    this.data.curTab = index
  },

  async loadVerifying() {
    const db = wx.cloud.database();
    const res = await db.collection('consultant').where({
      status: 'verifying'
    }).skip(
      this.data.consultantsVerifying.length
    ).limit(10).get()
    let cons = this.data.consultantsVerifying
    cons.push(...res.data)
    this.setData({
      consultantsVerifying: cons
    })
  },
  async loadApproved() {
    const db = wx.cloud.database();
    const res = await db.collection('consultant').where({
      status: 'approved'
    }).skip(
      this.data.consultantApproved.length
    ).limit(10).get()
    let cons = this.data.consultantApproved
    cons.push(...res.data)
    this.setData({
      consultantApproved: cons
    })
  },

  touchStart() {
    this.data.pressed++
  },
  touchEnd() {
    this.data.pressed--
    if (this.released() && this.data.scheduledLoading) {
      this.data.scheduledLoading = false
      this.loadMore()
    }
  },
  released() {
    return this.data.pressed == 0
  },

  async loadMore() {
    if (!this.data.loadingMore) {
      this.setData({
        loadingMore: true
      })
      try {
        if (this.data.curTab == 0) {
          await this.loadVerifying()
        } else {
          await this.loadApproved()
        }
      } finally {
        this.setData({
          loadingMore: false
        })
      }
    }
  },
  reachBottom() {
    if (!this.released()) {
      this.data.scheduledLoading = true
      return
    }
    this.loadMore()
  },
})
