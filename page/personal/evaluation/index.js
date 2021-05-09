const regeneratorRuntime = require("../../common/runtime")
const { alert } = require("../../common/common")
const app = getApp()
Page({
  async onLoad() {
     let openId = app.getOpenId()
     const db = wx.cloud.database()
     const res = await db.collection('consultant').doc(openId).get()
     this.setData({
       openId: openId,
       name: res.data.name
     })
  },
  async watchReport() {
    const openId = this.data.openId
    const db = wx.cloud.database()
    const res = await db.collection('evaluation').where({consultant: openId}).get()
    const selfEvaluated = () => {
      for (let d of res.data) {
        if (d._openid == openId) {
          return true
        }
      }
      return false
    }
    if (res.data.length < 5 || !selfEvaluated()) {
      alert('测评报告必须完成自评以及至少4份他人测评的基础上才能生成')
    } else {
      wx.navigateTo({
        url: `eval-report/index?consultant=${this.data.openId}&name=${this.data.name}`,
      })
    }
  },

  onShareAppMessage(res) {
    const title = `${this.data.name}邀请您测评`
    return {
      title,
      path: `/page/personal/evaluation/eval/index?consultant=${this.data.openId}&name=${this.data.name}`,
      imageUrl: '/image/evaluation.jpg'
    }
  },
})