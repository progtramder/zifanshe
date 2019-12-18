const util = require('../../common/util')
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    cover: '',
    name: '',
    brief: '',
    type: 'video',
    video: '',
    document: '',
    selectedTypes: [
      {
        name: '视频',
        value: 'video'
      },
      {
        name: '文档',
        value: 'document'
      }
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let title = "精选上架"
    if (options.id) {
      title = "精选编辑"
      this.setData({
        productId: options.id
      })
      wx.showNavigationBarLoading()
      const db = wx.cloud.database();
      db.collection('selected').where({
        _id: options.id
      }).get().then((res) => {
        wx.hideNavigationBarLoading()
        let product = res.data[0]
        this.setData(
          {
            cover: product.cover,
            name: product.name,
            brief: product.brief,
            type: product.type,
            video: product.video,
            document: product.document,
            status: product.status
          })
          
      })
    }

    wx.setNavigationBarTitle({
      title: title
    })
  },

  typeChange(e) {
    this.setData({
      type: e.detail.value
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

  chooseMovie() {
    wx.chooseVideo({
      sourceType: ['album'],
      success: res => {
        this.setData({
          video: res.tempFilePath,
        })
      }
    })
  }, 

  chooseWxFile() {
    wx.chooseMessageFile({
      count: 1,
      type: 'file',
      success: res => {
        let document = res.tempFiles[0].path
        console.log(document)
        this.setData({
          document
        })
      },
    })
  },

  getProductBrief(e) {
    this.data.brief = e.detail.value
  },

  getProductName(e) {
    this.data.name = e.detail.value
  },

  onFinish() {
    if (this.data.name == '' || this.data.cover == '' || this.data.type == '') {
      this.alert('请完整填写内容')
      return
    }

    if(this.data.type == 'video' && this.data.video == '') {
      this.alert('视频内容不能为空')
      return
    }

    if (this.data.type == 'document' && this.data.document == '') {
      this.alert('请选择上传文档')
      return
    }

    //Update or Shelve a new product
    let newShelve = false
    let productId = this.data.productId
    if (!productId) {
      newShelve = true
      productId = util.randomCode()
    }
    wx.showLoading()
    let promises = []
    if (this.data.type == 'video' && !this.data.video.match(/^cloud:\/\//)) {
      promises.push(new Promise((resolve, reject) => {
        wx.cloud.uploadFile({
          cloudPath: `video/${productId}`,
          filePath: this.data.video,
          success: res => {
            resolve(res.fileID)
          },
          fail: err => {
            reject(err)
          },
        })
      }))
    } else {
      promises.push(new Promise((resolve, reject) => {
        resolve(this.data.video)
      }))
    }
    
    if (this.data.type == 'document' && !this.data.document.match(/^cloud:\/\//)) {
      promises.push(new Promise((resolve, reject) => {
        wx.cloud.uploadFile({
          cloudPath: `document/${productId}`,
          filePath: this.data.document,
          success: res => {
            resolve(res.fileID)
          },
          fail: err => {
            reject(err)
          },
        })
      }))
    } else {
      promises.push(new Promise((resolve, reject) => {
        resolve(this.data.document)
      }))
    }

    if (!this.data.cover.match(/^cloud:\/\//)) {
      promises.push(new Promise((resolve, reject) => {
        wx.cloud.uploadFile({
          cloudPath: `image/selected/${productId}`,
          filePath: this.data.cover,
          success: res => {
            resolve(res.fileID)
          },
          fail: err => {
            reject(err)
          },
        })
      }))
    } else {
      promises.push(new Promise((resolve, reject) => {
        resolve(this.data.cover)
      }))
    }

    Promise.all(promises).then(res => {
      const db = wx.cloud.database()
      if (newShelve) {
        db.collection('selected').add({
          data: {
            _id: productId,
            cover: res[2],
            name: this.data.name,
            brief: this.data.brief,
            type: this.data.type,
            video: this.data.type == 'video' ? res[0] : '',
            document: this.data.type == 'video' ? '' : res[1],
            status: 'showing'
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
        db.collection('selected').doc(productId).update({ 
          data: {
            cover: res[2],
            name: this.data.name,
            brief: this.data.brief,
            type: this.data.type,
            video: this.data.type == 'video' ? res[0] : '',
            document: this.data.type == 'video' ? '' : res[1],
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
})