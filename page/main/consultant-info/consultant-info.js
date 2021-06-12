const regeneratorRuntime = require('../../common/runtime')
const app = getApp()
Page({
  data: {
    apply: false,
    avatar: '',
    name: '',
    phoneNumber: '',
    wxNumber: '',
    introduction: '',
    introImage: '',
    specialty: '',
    occupation: '',
    dream: '',
    motto: '',
    product: '',
    referral: '',
    zifanCourse: 'yes'
  },

  onLoad(opts) {
    let title = '我是顾问'
    if (opts.apply) {
      this.setData({
        apply: true
      })
      title = '顾问入驻'
    } 
    
    wx.setNavigationBarTitle({
      title
    })

    wx.showNavigationBarLoading()
    const db = wx.cloud.database();
    db.collection('consultant').doc(app.getOpenId()).get().then(res => {
      wx.hideNavigationBarLoading()
      let data = res.data
      let avatar = data.avatar
      if (avatar.match(/^https:\/\//)) {
        //兼容老版本，如果原来注册的顾问用的是微信头像那么替换成最新的头像
        avatar = app.getUserInfo().avatarUrl
      }
      this.setData({
        status: data.status,
        avatar,
        name: data.name,
        phoneNumber: data.phoneNumber,
        wxNumber: data.wxNumber,
        introduction: data.introduction,
        introImage: data.introImage ? data.introImage : '',
        specialty: data.specialty ? data.specialty : '',
        occupation: data.occupation ? data.occupation : '',
        dream: data.dream ? data.dream : '',
        motto: data.motto ? data.motto : '',
        product: data.product ? data.product : '',
        referral: data.referral ? data.referral : '',
        zifanCourse: data.zifanCourse ? data.zifanCourse : 'yes'
      })
    }).catch((res) => {
      wx.hideNavigationBarLoading()
      this.setData({
        avatar: app.getUserInfo().avatarUrl
      })
    });
  },

  getName(e) {
    this.data.name = e.detail.value
  },
  getPhoneNumber(e) {
    this.data.phoneNumber = e.detail.value
  },
  getWxNumber(e) {
    this.data.wxNumber = e.detail.value
  },
  getIntroduction(e) {
    this.data.introduction = e.detail.value
  },
  getSpecialty(e) {
    this.data.specialty = e.detail.value
  },
  getOccupation(e) {
    this.data.occupation = e.detail.value
  },
  getDream(e) {
    this.data.dream = e.detail.value
  },
  getMotto(e) {
    this.data.motto = e.detail.value
  },
  getProduct(e) {
    this.data.product = e.detail.value
  },
  getReferral(e) {
    this.data.referral = e.detail.value
  },
  radioChange(e) {
    this.data.zifanCourse = e.detail.value
  },
  changeAvatar() {
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: (res) => {
        let imagePath = res.tempFilePaths[0]
        this.setData(
          {
            avatar: imagePath
          }
        )
      }
    })
  },

  checkCompletion() {
    //这里为了兼容已有顾问，因此只检查基本信息
    if (this.data.status == 'approved') {
      if (this.data.name == '' || this.data.phoneNumber == '' ||
        this.data.wxNumber == '' || this.data.introduction == '') {
          return false
        }
        return true
    }

    if (this.data.name == '' || this.data.phoneNumber == '' ||
      this.data.wxNumber == '' || this.data.introduction == '' || 
      this.data.specialty == '' || this.data.occupation == '' || 
      this.data.dream == '' || this.data.motto == '' || 
      this.data.product == '' || this.data.referral == '') {
      return false
    }
    return true
  },
  submit() {
    if (!this.checkCompletion()) {
      this.alert('请完整填写内容')
      return
    }

    wx.showLoading()
    Promise.all([this.uploadAvatar(), this.uploadIntroImage()]).then(res => {
      this.saveToDb(res)
    }).catch(err => {
      console.log(err)
      wx.hideLoading()
      this.alert('文件上传失败，请检查网络')
    })
  },

  saveToDb(imagePath) {
    const db = wx.cloud.database();
    db.collection('consultant').add({
      data: {
        _id: app.getOpenId(),
        avatar: imagePath[0],
        name: this.data.name,
        phoneNumber: this.data.phoneNumber,
        wxNumber: this.data.wxNumber,
        introduction: this.data.introduction,
        introImage: imagePath[1],
        specialty: this.data.specialty,
        occupation: this.data.occupation,
        dream: this.data.dream,
        motto: this.data.motto,
        product: this.data.product,
        referral: this.data.referral,
        zifanCourse: this.data.zifanCourse,
        grade: 0,
        gender: app.getUserInfo().gender,
        status: 'verifying'
      },
      success: (res) => {
        wx.showModal({
          content: '提交成功，请耐心等待审核通过',
          showCancel: false,
          confirmColor: '#F56C6C',
          success: (res) => {
            if (this.data.apply) {
              wx.switchTab({
                url: '../../personal/index',
              })
            }
          }
        })
      },
      fail: (err) => {
        console.log(err)
        this.alert('数据库写入失败，请检查网络')
      },
      complete: () => {
        wx.hideLoading()
      }
    })
  },

  save() {
    if (!this.checkCompletion()) {
      this.alert('请完整填写内容')
      return
    }

    wx.showLoading()
    Promise.all([this.uploadAvatar(), this.uploadIntroImage()]).then(res => {
      this.updateToDb(res)
    }).catch(err => {
      console.log(err)
      wx.hideLoading()
      this.alert('文件上传失败，请检查网络')
    })
  },

  updateToDb(imagePath) {
    const db = wx.cloud.database();
    db.collection('consultant').doc(app.getOpenId()).update({
      data: {
        avatar: imagePath[0],
        name: this.data.name,
        phoneNumber: this.data.phoneNumber,
        wxNumber: this.data.wxNumber,
        introduction: this.data.introduction,
        introImage: imagePath[1],
        specialty: this.data.specialty,
        occupation: this.data.occupation,
        dream: this.data.dream,
        motto: this.data.motto,
        product: this.data.product,
        referral: this.data.referral,
        zifanCourse: this.data.zifanCourse
      },
      success: (res) => {
        wx.showModal({
          content: '保存成功',
          showCancel: false,
          confirmColor: '#F56C6C'
        })
      },
      fail: (err) => {
        console.log(err)
        this.alert('数据库写入失败，请检查网络')
      },
      complete: () => {
        wx.hideLoading()
      }
    })
  },

  addIntroImage() {
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: (res) => {
        let imagePath = res.tempFilePaths[0]
        this.setData(
          {
            introImage: imagePath
          }
        )
      }
    })
  },

  uploadWechatAvatar(avatarUrl) {
    return new Promise((resolve, reject) => {
      wx.downloadFile({
        url: avatarUrl,
        success(res) {
          if (res.statusCode === 200) {
            wx.cloud.uploadFile({
              cloudPath: `image/avatar/${app.getOpenId()}-${new Date().getMilliseconds()}.jpg`,
              filePath: res.tempFilePath,
              success: result => {
                resolve(result.fileID)
              },
              fail: err => {
                reject(err)
              },
            })
          } else {
            reject({ errMsg: `http error: ${res.statusCode}`})
          }
        },
        fail: (err) => {
          reject(err)
        }
      })
    })
  },
  uploadAvatar() {
    let imagePath = this.data.avatar
    //如果已经是云上的路径，那么没有必要上传文件
    if (imagePath.match(/^cloud:\/\//)) {
      return new Promise((resolve, reject) => {
        resolve(imagePath)
      })
    } else if (imagePath.match(/^https:\/\//)) {
      //如果是微信头像那么保存到云上
      return this.uploadWechatAvatar(imagePath)
    } else {
      return new Promise((resolve, reject) => {
        wx.cloud.uploadFile({
          cloudPath: `image/avatar/${app.getOpenId()}-${new Date().getMilliseconds()}.jpg`,
          filePath: imagePath,
          success: res => {
            resolve(res.fileID)
          },
          fail: err => {
            reject(err)
          },
        })
      })
    }
  },

  uploadIntroImage() {
    let imagePath = this.data.introImage
    //如果已经是云上的路径，那么没有必要上传文件
    if (imagePath.match(/^cloud:\/\//) || imagePath == '') {
      return new Promise((resolve, reject) => {
        resolve(imagePath)
      })
    } else {
      return new Promise((resolve, reject) => {
        wx.cloud.uploadFile({
          cloudPath: `image/introduction/${app.getOpenId()}-${new Date().getMilliseconds()}`,
          filePath: imagePath,
          success: res => {
            resolve(res.fileID)
          },
          fail: err => {
            reject(err)
          },
        })
      })
    }
  },

  deleteIntroImage() {
    this.setData({
      introImage: ''
    })
  },

  alert(tilte) {
    wx.showModal({
      content: tilte,
      showCancel: false,
      confirmColor: '#F56C6C'
    })
  }
})