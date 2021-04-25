const regeneratorRuntime = require("../../../common/runtime")
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  async onLoad ({consultant, name}) {
    console.log(consultant, name)
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})