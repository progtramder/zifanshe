Component({
  options: {
    multipleSlots: true // 启用多slot支持
  },
  /**
   * 组件的属性列表
   * 用于组件自定义设置
   */
  properties: {
    tabs: {
      type: Array,
      value: []
    },
    adjustIndex: {
      type: Number,
      value: 4
    }
  },

  data: {
    winHeight: "",//窗口高度
    currentTab: 0, //预设当前项的值
    scrollLeft: 0, //tab标题的滚动条位置
  },

  attached: function () {
    //  高度自适应
    const { windowHeight, windowWidth } = wx.getSystemInfoSync();
    this.setData({
      winHeight: windowHeight * 750 / windowWidth - 90,
    })
  },

  methods: {
    // 滚动切换标签样式
    switchTab: function (e) {
      this.setData({
        currentTab: e.detail.current
      });
      this.triggerEvent("change", e.detail.current);
      this.adjust();
    },
    // 点击标题切换当前页时改变样式
    swichNav: function (e) {
      var curTab = e.target.dataset.current;
      if (this.data.currentTab != curTab) {
        this.setData({
          currentTab: curTab
        })
        this.triggerEvent("change", curTab);
      }
    },
    //判断当前滚动超过一屏时，设置tab标题滚动条。
    adjust: function () {
      if (this.data.currentTab > this.properties.adjustIndex) {
        this.setData({
          scrollLeft: 300
        })
      } else {
        this.setData({
          scrollLeft: 0
        })
      }
    }
  }
})