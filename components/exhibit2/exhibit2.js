Component({
  /**
   * 组件的属性列表
   * 用于组件自定义设置
   */
  properties: {
    url: {
      type: String,
      value: ''
    },
    imgpath: {
      type: String,
      value: ''
    },
    title: {
      type: String,
      value: ''
    },
    body: {
      type: String,
      value: ''
    },
    footer: {
      type: String,
      value: ''
    },
    candelete: {
      type: String,
      value: 'false'
    },
  },

  data: {
    deleting: false
  },

  methods: {
    deleteItem(e) {
      this.triggerEvent("delete");
    },

    itemTap(e) {
      if (this.data.deleting) {
        this.setData({
          deleting: false
        })
      }
    },

    longPress(e) {
      if (this.data.candelete == 'true') {
        this.setData({
          deleting: true
        })
      }
    },

    itemTouchEnd() {
      if (!this.data.deleting) {
        wx.navigateTo({
          url: this.data.url
        })
      }
    },

    reset() {
      if (this.data.deleting) {
        this.setData({
          deleting: false
        })
      }
    },
    isDeleting() {
      return this.data.deleting
    }
  }
})