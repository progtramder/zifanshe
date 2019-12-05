Page({
  data: {
    currentView: 'zifan-select',
    product: [],
    selected: []
  },

  onShow: function () {
   this.reLoad()
  },

  onReachBottom() {
    this.refresh()
  },

  reLoad() {
    this.data.currentView == 'zifan-select' 
      ? this.reLoadSelected() : this.reLoadProducts()
  },

  reLoadProducts() {
    wx.showNavigationBarLoading()
    const db = wx.cloud.database();
    db.collection('product').limit(10).field({
      detail: false
    }).get().then((res) => {
      wx.hideNavigationBarLoading()
      this.setData(
        {
          product: res.data
        })
    })
  },

  reLoadSelected() {
    wx.showNavigationBarLoading()
    const db = wx.cloud.database();
    db.collection('selected').limit(10).field({
      detail: false
    }).get().then((res) => {
      wx.hideNavigationBarLoading()
      this.setData(
        {
          selected: res.data
        })
    })
  },
  refresh() {
    this.data.currentView == 'zifan-select' 
      ? this.loadSelected() : this.loadProducts()
  },

  loadProducts() {
    wx.showNavigationBarLoading()
    const db = wx.cloud.database();
    db.collection('product').skip(
      this.data.product.length
    ).limit(10).field({detail: false}).get().then((res) => {
      wx.hideNavigationBarLoading()
      if (res.data.length > 0) {
        let product = this.data.product
        product.push(...res.data)
        this.setData(
          {
            product
          })
        }
    })
  },

  loadSelected() {
    wx.showNavigationBarLoading()
    const db = wx.cloud.database();
    db.collection('selected').skip(
      this.data.selected.length
    ).limit(10).field({detail: false}).get().then((res) => {
      wx.hideNavigationBarLoading()
      if (res.data.length > 0) {
        let selected = this.data.selected
        selected.push(...res.data)
        this.setData(
          {
            selected
          })
      }
    })
  },

  tapZifanSelect() {
    this.setData({
      currentView: 'zifan-select'
    })

    this.reLoad()
  },

  tapConsultantProduct() {
    this.setData({
      currentView: 'consultant-product'
    })

    this.reLoad()
  },
})
