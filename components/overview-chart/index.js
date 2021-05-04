// components/overview-chart/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    part: {
      type: String,
      value: ""
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    self: [],
    group: [],
    reference: []
  },
  /**
   * 组件的方法列表
   */
  methods: {
    init(self, group, reference) {
      let part = this.properties.part
      this.setData({
        self: self[part],
        group: group[part],
        reference: reference[part]
      })
    }
  }
})
