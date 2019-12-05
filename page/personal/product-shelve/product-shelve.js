const util = require('../../common/util')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    cover: "",
    name: "",
    brief: "",
    price: "",
    original_price: "",
    price_desc: "",
    detail: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let title = "产品上架"
    if (options.id) {
      title = "产品编辑"
      this.setData({
        productId: options.id
      })
      wx.showNavigationBarLoading()
      const db = wx.cloud.database();
      db.collection('product').where({
        _id: options.id
      }).get().then((res) => {
        wx.hideNavigationBarLoading()
        let product = res.data[0]
        this.selectComponent("#rich_editor").init(product.detail)
        this.setData(
          {
            cover: product.cover,
            name: product.name,
            brief: product.brief,
            price: product.price / 100,
            original_price: product.original_price / 100,
            price_desc: product.price_desc ? product.price_desc : '',
            detail: product.detail
          })
      })
    }

    wx.setNavigationBarTitle({
      title: title
    })
  },

  addCover() {
    wx.chooseImage({
      count: 1,
      success: (res) => {
        this.setData({
          cover: res.tempFilePaths[0]
        })
      },
    })
  },

  getProductBrief(e) {
    this.setData({ brief: e.detail.value })
  },

  getProductPrice(e) {
    if (e.detail.value != '' && e.detail.value < 0.01) {
      this.alert("金额太小")
      return
    }
    this.setData({ price: e.detail.value })
  },

  getProductOriginalPrice(e) {
    if (e.detail.value != '' && e.detail.value < 0.01) {
      this.alert("金额太小")
      return
    }
    this.setData({ original_price: e.detail.value })
  },

  getPriceDesc(e) {
    this.setData({ price_desc: e.detail.value })
  },

  getProductName(e) {
    this.setData({ name: e.detail.value })
  },

  onFinish() {
    if (this.data.name == "" || this.data.price == "" || this.data.cover == "") {
      this.alert('请完整填写内容')
      return
    }

    //Update or Shelve a new product
    let newShelve = false
    let productId = this.data.productId
    if (!productId) {
      newShelve = true
      productId = util.randomCode()
      this.setData({
        productId: productId
      })
    }
    wx.showLoading()
    let promises = []
    if (!this.data.cover.match(/^cloud:\/\//)) {
      let prom = new Promise((resolve, reject) => {
        wx.cloud.uploadFile({
          cloudPath: `image/product/${productId}-cover`,
          filePath: this.data.cover,
          success: res => {
            resolve(
              {
                file: res.fileID, 
                index: -1
              })
          },
          fail: err => {
            reject(err)
          },
        })
      })
      promises.push(prom)
    }
    this.data.detail.forEach((e, index)=> {
      if (!e.match(/^cloud:\/\//)) {
        let prom = new Promise((resolve, reject) => {
          wx.cloud.uploadFile({
            cloudPath: `image/product/${productId}-${new Date().getTime()}`,
            filePath: e,
            success: res => {
              resolve(
                {
                  file: res.fileID, 
                  index: index
                })
            },
            fail: err => {
              reject(err)
            },
          })
        })
        promises.push(prom)
      }
    })
    
    Promise.all(promises).then(res => {
      let detailTemp = this.data.detail
      res.forEach(e => {
        if (e.index == -1) {
          this.setData({
            cover: e.file
          })
        } else {
          detailTemp[e.index] = e.file
        }
      })
      this.setData({
        detail: detailTemp
      })

      //Now we have successfully upload the images,
      //save the data to db
      const db = wx.cloud.database()
      if (newShelve) {
        db.collection('product').add({
          data: {
            _id: productId,
            cover: this.data.cover,
            name: this.data.name,
            brief: this.data.brief,
            price: this.data.price * 100,
            original_price: this.data.original_price == '' ? this.data.price * 100 : this.data.original_price * 100,
            price_desc: this.data.price_desc,
            detail: this.data.detail
          },
        }).then(res => {
          //Finally we successfully shelved the product
          wx.hideLoading()
          wx.navigateBack()
        }).catch(err => {
          wx.hideLoading()
          this.alert('数据库写入失败，请检查网络')
        })
      } else {
        db.collection('product').doc(productId).update({
          data: {
            cover: this.data.cover,
            name: this.data.name,
            brief: this.data.brief,
            price: this.data.price * 100,
            original_price: this.data.original_price == '' ? this.data.price * 100 : this.data.original_price * 100,
            price_desc: this.data.price_desc,
            detail: this.data.detail
          },
        }).then(res => {
          //Finally we successfully updated the product
          wx.hideLoading()
          wx.navigateBack()
        }).catch(err => {
          wx.hideLoading()
          this.alert('数据库更新失败，请检查网络')
        })
      }
    }).catch(err => {
      wx.hideLoading()
      this.alert('文件上传失败，请检查网络')
      console.log(err)
    })
  },

  alert(tilte) {
    wx.showModal({
      content: tilte,
      showCancel: false,
      confirmColor: '#F56C6C'
    })
  },
  detailChanged(event) {
    let imgList = []
    event.detail.forEach((e) => {
      imgList.push(e.attrs.src)
    })
    this.setData({
      detail: imgList
    })
  },
})