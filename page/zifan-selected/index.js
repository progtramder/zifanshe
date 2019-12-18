Page({

  /**
   * 页面的初始数据
   */
  data: {
    isEmpty: false,
    product: []
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    wx.showNavigationBarLoading()
    const db = wx.cloud.database();
    db.collection('selected').skip(
      this.data.product.length
    ).limit(10).field({ 
      detail: false 
    }).get().then((res) => {
      wx.hideNavigationBarLoading()
      let pdt = this.data.product
      pdt.push(...res.data)
      this.setData({
        product: pdt,
        isEmpty: pdt.length == 0
      })
    })
  },

  onReachBottom() {
    wx.showNavigationBarLoading()
    const db = wx.cloud.database();
    db.collection('selected').skip(
      this.data.product.length
    ).limit(10).field({ detail: false }).get().then((res) => {
      wx.hideNavigationBarLoading()
      let pdt = this.data.product
      pdt.push(...res.data)
      this.setData(
        {
          product: pdt,
          isEmpty: pdt.length == 0
        })
    })
  },

  shelve() {
    wx.navigateTo({
      url: "selected-shelve/selected-shelve"
    })
  },

  deleteItem(event) {
    const index = event.currentTarget.dataset.index
    let product = this.data.product
    wx.showModal({
      content: '确定删除吗？',
      confirmColor: '#F56C6C',
      success: (res) => {
        if (res.confirm) {
          const db = wx.cloud.database();
          db.collection('selected').doc(product[index]._id).remove().then(res => {
            product.splice(index, 1)
            this.setData({
              product,
              isEmpty: product.length == 0
            })
          }).catch(err => {
            console.log(err)
          })
        } else {
          this.selectComponent(`#${event.currentTarget.id}`).reset()
        }
      }
    })
  },
})