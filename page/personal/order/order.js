const app = getApp()
Page({
  data: {
    order: [],
    isEmpty: false
  },

  queryorder (e) {
    const index = e.currentTarget.dataset.index
    let order = this.data.order
    if (order[index].deleting) {
      delete order[index].deleting
      this.setData({
        order
      })
      return
    } else {
      let update = false
      order.forEach(e => {
        if (e.deleting) {
          delete e.deleting
          update = true
        }
      })
      if (update) {
        this.setData({
          order
        })
      }
    }
    wx.navigateTo({
      url: `/page/payorder/index?id=${e.currentTarget.dataset.order}`
    });
  },

  onShow () {
    wx.showNavigationBarLoading()
    const db = wx.cloud.database();
    db.collection('order').where({
      _openid: app.getOpenId()
    }).orderBy('time_stamp', 'desc').limit(10).field({
      body: true,
      status: true,
      out_trade_no: true
    }).get().then(res => {
      wx.hideNavigationBarLoading()
      this.setData({
        order: res.data,
        isEmpty: res.data.length ? false : true
      });
    })
  },

  onReachBottom() {
    wx.showLoading()
    let order = this.data.order
    const db = wx.cloud.database();
    db.collection('order').where({
      _openid: app.getOpenId()
    }).orderBy('time_stamp', 'desc').skip(
      order.length
    ).limit(5).field({
      body: true,
      status: true,
      out_trade_no: true
    }).get().then((res) => {
      order.push(...res.data)
      wx.hideLoading()
      this.setData(
        {
          order
        })
    })
  },

  longPress(event) {
    const index = event.currentTarget.dataset.index
    let order = this.data.order
    if (!order[index].deleting) {
      order[index].deleting = true
      this.setData({
        order
      })
    }
  },

  deleteItem(event) {
    const index = event.currentTarget.dataset.index
    let order = this.data.order
    wx.showModal({
      content: '确定删除吗？',
      confirmColor: '#F56C6C',
      success: (res) => {
        if (res.confirm) {
          const db = wx.cloud.database();
          db.collection('order').doc(order[index]._id).remove().then(res => {
            order.splice(index, 1)
            this.setData({
              order
            })
          }).catch(err => {
            console.log(err)
          })
        } else if (res.cancel) {
          delete order[index].deleting
          this.setData({
            order
          })
        }
      }
    })
  }
})
