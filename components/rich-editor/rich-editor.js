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
              name: 'img',
              attrs: {
                src: e,
              },
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

    init(imgList) {
      let nodeList = []
      imgList.forEach((e) => {
        const node = {
          name: 'img',
          attrs: {
            src: e,
          },
        }
        nodeList.push(node)
      })
      this.setData({
        nodeList
      })
    },
  }
})
