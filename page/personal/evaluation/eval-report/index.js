const regeneratorRuntime = require("../../../common/runtime")
let Charts = require('../../../common/wxcharts.js');

let model
function clone() {
  return JSON.parse(JSON.stringify(model));
}
function average(evals) {
  const len = evals.length
  let r = clone(model)
  for (let key in model) {
    for (let i in model[key]) {
      for (let j in model[key][i].subItem) {
        r[key][i].subItem[j].score = 0
        evals.forEach(v => {
          r[key][i].subItem[j].score += v[key][i].subItem[j].score
        })
        r[key][i].subItem[j].score = (r[key][i].subItem[j].score / len).toFixed(1)
      }
    }
  }
  return r
}
function diff(selfEval, aveEval) {
  let r = clone(model)
  for (let key in model) {
    for (let i in model[key]) {
      for (let j in model[key][i].subItem) {
        r[key][i].subItem[j].score = (selfEval[key][i].subItem[j].score - 
          aveEval[key][i].subItem[j].score).toFixed(1)
      }
    }
  }
  return r
}
function normalize(ev) {
  for (let key in ev) {
    for (let i in ev[key]) {
      let ave = 0
      let subItem = ev[key][i].subItem
      subItem.forEach(v => {
        ave += Number(v.score)
      })
      ev[key][i].average = (ave / subItem.length).toFixed(1)
    }
  }
  return ev
}

function showRadar(cavasId, selfEval, aveEval, refEval) {
  new Charts({
    animation: true,
    canvasId: cavasId,
    type: 'column',
    dataPointShape: false,
    categories: selfEval.map(v => {
      return v.factor;
    }),
    series: [{
      name: '自评',
      data: selfEval.map(v => {
        return v.average;
      }),
      color: '#657492',
    }, {
      name: '同伴',
      data: aveEval.map(v => {
        return v.average;
      }),
      color: '#719742',
    }, {
      name: '参考评分',
      data: refEval.map(v => {
        return v.average;
      }),
      color: '#9B9689',
    }],
    width: 320,
    height: 220,
    yAxis: {
      max: 7,
      min: 0
    }
  });
}
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
    let all = []
    wx.showNavigationBarLoading()
    try {
      const db = wx.cloud.database();
      while(1) {
        let res = await db.collection('evaluation').skip(all.length).limit(20).get()
        all.push(...res.data)
        if (res.data.length < 20) break
      }
    } finally {
      wx.hideNavigationBarLoading()
    }

    let selfEval = all.filter(v => {
      if (v._openid == consultant) {
        return true
      }
    })[0].result
    
    let allEval = []
    all.forEach(v => {
      allEval.push(v.result)
    })
    let groupEval = []
    all.forEach(v => {
      if (v.consultant == consultant && v._openid != consultant) {
        groupEval.push(v.result)
      }
    })
    model = selfEval
    //同伴平均评分
    let aveEval = average(groupEval);
    //参考平均评分
    let refEval = average(allEval);
    //自评和同伴评分的差值
    let diffEval = diff(selfEval, aveEval)

    selfEval = normalize(selfEval)
    aveEval = normalize(aveEval)
    refEval = normalize(refEval)
    this.selectComponent("#overview_chart1").init(selfEval, aveEval, refEval)
    this.selectComponent("#overview_chart2").init(selfEval, aveEval, refEval)
    
    this.setData({
      name,
      consultant,
      selfEval,
      aveEval,
      refEval,
      diffEval,
    })
    wx.setNavigationBarTitle({
      title: name + "顾问的测评报告",
    })
    showRadar('canvas_radar1', selfEval['自我认知能力'], aveEval['自我认知能力'], refEval['自我认知能力'])
    showRadar('canvas_radar2', selfEval['专业能力'], aveEval['专业能力'], refEval['专业能力'])
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    const title = `${this.data.name}顾问的测评报告`
    return {
      title,
      path: `/page/personal/evaluation/eval-report/index?name=${this.data.name}&consultant=${this.data.consultant}`,
    }
  }
})