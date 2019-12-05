const config = require('../../common/config')

function collection(category) {
  this.category = category
  this.nLimit = 0
  this.nSkip = 0
  this.oField = {}
}
collection.prototype.skip = function (skip) {
  this.nSkip = skip
  return this
}
collection.prototype.limit = function (limit) {
  this.nLimit = limit
  return this
}
collection.prototype.field = function (field) {
  this.oField = field
  return this
}
collection.prototype.get = function () {
  return new Promise((resole, reject) => {
    wx.cloud.callFunction({
      name: 'database',
      data: {
        action: 'getConsultants',
        category: this.category,
        skip: this.nSkip,
        limit: this.nLimit,
        field: this.oField
      }
    }).then(res => {
      resole(res.result)
    }).catch(err => {
      reject(err)
    })
  })
}

Page({
  onShareAppMessage() {
    return {
      title: this.data.title,
      path: `page/main/consultants/consultants?category=${this.data.category}`
    }
  },

  onLoad(opts) {
    this.setTitle(opts.category)
    this.setData({ category: opts.category})
    wx.showNavigationBarLoading()
    this.getCollection(
      opts.category
      ).limit(10).field({
        _id: true,
        name: true,
        introduction: true,
        avatar: true
      }).get().then((res) => {
        wx.hideNavigationBarLoading()
        this.setData(
        {
          consultants: res.data
        })
    })
  },
  
  onReachBottom() {
    wx.showNavigationBarLoading()
    this.getCollection(
      this.data.category
    ).skip(
        this.data.consultants.length
      ).limit(10).get().then((res) => {
        wx.hideNavigationBarLoading()
        let cons = this.data.consultants
        cons.push(...res.data)
        this.setData(
        {
          consultants: cons
        })
    })
  },

  getCollection(category) {
    if (category == 'all') return this.collectionAll()
    return this.collectionCategory()
  },
  collectionAll() {
    const db = wx.cloud.database();
    return db.collection('consultant').where({
      status: 'approved'
    }).orderBy('grade', 'desc')
  },
  collectionCategory() {
    return new collection(this.data.category)
    /*let regStr = new RegExp(this.data.category)
    const db = wx.cloud.database();
    return db.collection('consultant').where({
      category: regStr
    }).orderBy('grade', 'desc')*/
  },

  setTitle(category) {
    let title = '全部顾问'
    config.category.forEach((e) => {
      if (e.id == category) {
        title = e.name
      }
    })

    this.setData({ title: title})
    wx.setNavigationBarTitle({
      title: title
    })
  }
})
