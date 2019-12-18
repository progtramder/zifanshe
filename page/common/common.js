const regeneratorRuntime = require("./runtime");

function alert(tilte) {
  wx.showModal({
    content: tilte,
    showCancel: false,
    confirmColor: '#F56C6C',
    confirmText: '知道了'
  })
}

//tabpage 中的onLoad如果因为网络原因加载资源失败的话可以
//通过下拉页面重新调用onLoad, 如果没有异常出现则下拉页面的时候不做
//任何处理
function TabPage(obj) {
  const onLoad = async function (options) {
    try {
      await this.onLoadException(options)
      this.exception = { status: false }
    } catch (err) {
      alert(`${err.errMsg} 请下拉页面重新加载`)
      this.exception = { status: true, data: options }
    }
  }

  const onPullDownRefresh = async function () {
    if (this.exception.status) {
      await this.onLoad(this.exception.data)
    }
    wx.stopPullDownRefresh()
  }

  if (obj.onLoad) {
    obj.onLoadException = obj.onLoad
    obj.onLoad = onLoad
  }
  obj.onPullDownRefresh = onPullDownRefresh
  Page(obj)
}

module.exports = {
  TabPage
};