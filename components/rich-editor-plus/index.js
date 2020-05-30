Component({
  /**
   * 组件的属性列表
   */
  properties: {
    locker: {
      type: String,
      value: 'false'
    },
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
      this.triggerEvent("add", nodeList);
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
          this.triggerEvent("add", nodeList);
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
            locker: false,
            src: res.tempFilePath
          }
          let nodeList = this.data.nodeList;
          nodeList.splice(index + 1, 0, node);
          this.setData({
            nodeList
          })
          this.triggerEvent("add", nodeList);
        },
      })
    },

    addDocument(e) {
      const suffix = (file) => {
        let suffix = file.match(/\.\w+$/)
        if (suffix) return suffix[0]
        return ''
      }

      const index = e.currentTarget.dataset.index;
      wx.chooseMessageFile({
        count: 1,
        type: 'file',
        success: res => {
          const tempFilePath = res.tempFiles[0].path
          const tempFileName = res.tempFiles[0].name
          let node
          const sfx = suffix(tempFilePath)
          if (sfx.match('pdf') || sfx.match('ppt') || sfx.match('xls') || sfx.match('doc')) {
            node = {
              type: 'document',
              locker: false,
              src: tempFilePath
            }
            let nodeList = this.data.nodeList;
            nodeList.splice(index + 1, 0, node);
            this.setData({
              nodeList
            })
            this.triggerEvent("add", nodeList);
          } else {
            wx.showModal({
              content: '文档格式不支持',
              showCancel: false,
              confirmColor: '#F56C6C',
              confirmText: '知道了'
            })
          }
        }
      })
    },
    onTextInput(e) {
      const index = e.currentTarget.dataset.index;
      let nodeList = this.data.nodeList;
      nodeList[index].content = e.detail.value
    },

    imageTap(e) {
      let imgPaths = []
      imgPaths.push(e.currentTarget.dataset.imgpath)
      wx.previewImage({
        urls: imgPaths,
        current: imgPaths[0]
      })
    },

    documentTap(e) {
      const docPath = e.currentTarget.dataset.docpath
      //云上的文件需先下载
      if (docPath.match(/^cloud:\/\//)) {
        wx.showLoading({
          title: '正在下载文件',
        })
        wx.cloud.downloadFile({
          fileID: docPath,
          success: function (res) {
            wx.openDocument({
              filePath: res.tempFilePath,
            })
          },
          fail: function (res) {
            console.log(res);
          },
          complete: function () {
            wx.hideLoading()
          }
        })
      } else {
        wx.openDocument({
          filePath: docPath
        })
      }
    },
    /**
     * 事件：删除节点
     */
    deleteNode: function (e) {
      const index = e.currentTarget.dataset.index;
      let nodeList = this.data.nodeList;
      const nodes = nodeList.splice(index, 1);
      this.setData({
        nodeList,
      })
      this.triggerEvent("delete", { nodeList, node: nodes[0] });
    },

    lock: function (e) {
      //toggle the locker
      const index = e.currentTarget.dataset.index;
      let nodeList = this.data.nodeList;
      const locker = nodeList[index].locker
      nodeList[index].locker = locker ? false : true
      this.setData({
        nodeList,
      })
    },

    init(nodeList) {
      this.setData({
        nodeList
      })
    },
  }
})
