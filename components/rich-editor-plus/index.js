// components/xing-editor.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
  },

  /**
   * 组件的初始数据
   */
  data: {
    nodeList: [],
  },

  attached: function () {
    const { windowHeight } = wx.getSystemInfoSync();
    this.setData({
      windowHeight,
    })
  },
  /**
   * 组件的方法列表
   */
  methods: {
    addText: function (e) {
      const index = e.currentTarget.dataset.index;
      const node = {
        type: 'text',
        content: ''
      }
      let nodeList = this.data.nodeList;
      nodeList.splice(index + 1, 0, node);
      this.setData({
        nodeList
      })
      this.triggerEvent("changed", nodeList);
    },
    /**
     * 事件：添加图片
     */
    addImage: function (e) {
      const index = e.currentTarget.dataset.index;
      wx.chooseImage({
        success: res => {
          let nodeListTemp = []
          res.tempFilePaths.forEach((e) => {
            const node = {
              type: 'image',
              src: e
            }
            nodeListTemp.push(node)
          })
          let nodeList = this.data.nodeList;
          nodeList.splice(index + 1, 0, ...nodeListTemp);
          this.setData({
            nodeList
          })
          this.triggerEvent("changed", nodeList);
        },
      })
    },

    addVideo: function (e) {
      const index = e.currentTarget.dataset.index;
      wx.chooseVideo({
        sourceType: ['album'],
        success: res => {
          const node = {
            type: 'video',
            src: res.tempFilePath
          }
          let nodeList = this.data.nodeList;
          nodeList.splice(index + 1, 0, node);
          this.setData({
            nodeList
          })
          this.triggerEvent("changed", nodeList);
        },
      })
    },

    onTextInput(e) {
      const index = e.currentTarget.dataset.index;
      let nodeList = this.data.nodeList;
      nodeList[index].content = e.detail.value
    },

    imageTap(e) {
      const imgPath = e.currentTarget.dataset.imgpath
      let imgPaths = []
      imgPaths.push(imgPath)
      wx.previewImage({
        urls: imgPaths,
        current: imgPath
      })
    },

    /**
     * 事件：删除节点
     */
    deleteNode: function (e) {
      const index = e.currentTarget.dataset.index;
      let nodeList = this.data.nodeList;
      nodeList.splice(index, 1);
      this.setData({
        nodeList,
      })
      this.triggerEvent("changed", nodeList);
    },

    init(nodeList) {
      this.setData({
        nodeList
      })
    },
  }
})
