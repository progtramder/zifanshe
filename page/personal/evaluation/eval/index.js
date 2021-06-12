const regeneratorRuntime = require("../../../common/runtime")
const { alert } = require("../../../common/common")

function initModel(subject) {
  let model = {
    '自我认知能力': [
      {
        factor: '思维能力',
        definition: '通过分析、归纳、概括、抽象、比较、具体化和系统化等一系列过程，对感性材料进行加工并转化为理性认识来解决问题的能力',
        subItem: [
          {demention: 'subject有战略思维和全局视角，凡事看大趋势，抓大放小', score: 0},
          {demention: 'subject总是展现开放的思维，乐意接纳他人的意见', score: 0},
          {demention: 'subject面对任务擅长考虑流程、细节，喜欢研究专业的、有深度的事物和内容', score: 0},
          {demention: 'subject总是有创意的、有很多新点子的', score: 0}
        ]
      },
      {
        factor: '结果导向',
        definition: '站在结果的角度去考虑问题，包括在日常工作中表现的能力、态度、实施的过程都以实现既定的结果为思考的前提，以结果为使命',
        subItem: [
          {demention: 'subject做事严谨，仔细认真，特别注重过程和品质', score: 0},
          {demention: 'subject凡事设立目标，擅长组织资源，克服困难达成目标', score: 0},
          {demention: 'subject做事有计划、有步骤、有行动、有结果，是个靠谱的人', score: 0},
          {demention: 'subject喜欢把控局面，控制事情的发展方向', score: 0}
        ]
      },
      {
        factor: '人际能力',
        definition: '衡量一个人与人交往的能力，包括对自我的觉察，对他人的洞察，在对自我管理的基础上对人际关系进行管理，获得良好的人际关系',
        subItem: [
          {demention: 'subject懂得尊重他人，别人说话，从不打断', score: 0},
          {demention: 'subject总是尝试并承担情感风险（引起他人的不悦情绪），甚至在充满焦虑和不确定的因素的时候', score: 0},
          {demention: 'subject喜欢与他人分享自己的想法和感受', score: 0},
          {demention: 'subject总能积极主动与他人沟通，喜欢表达', score: 0},
          {demention: 'subject有高度的人际敏感度，关注他人感受', score: 0}
        ]
      },
      {
        factor: '个性特质',
        definition: '是一个人相对稳定的思想和情绪模式，如进取心、顺从、忠诚、正直、坚韧',
        subItem: [
          {demention: 'subject敢于为自己犯的错误承担责任', score: 0},
          {demention: 'subject总是展现出对自我的觉察，有反思精神', score: 0},
          {demention: 'subject总是展现出个人的正直品质，尊重事实，从不撒谎', score: 0},
          {demention: 'subject对完成一项任务的兴趣远远大于与人打交道的兴趣', score: 0},
          {demention: 'subject能面对变化，能保持冷静，很快适应新的环境、要求和流程', score: 0}
        ]
      },
    ],
    '专业能力': [
      {
        factor: '商业意识',
        definition: '一个人对整体商业环境、资金流动的了解。商业环境包括组织、公司的运作以及发展变化对周围环境的影响',
        subItem: [
          {demention: 'subject对商业环境、市场需求敏锐，能够切实捕捉到市场机会', score: 0},
          {demention: 'subject有经营意识，对任何机会的商务模式、资金流向有很清晰的生意逻辑', score: 0},
          {demention: 'subject总能站在客户的角度思考产品或服务的可行性、体验感、接受度', score: 0},
          {demention: '当提出一个商业概念时，subject能够关注技术实现的可能性，了解技术的最新发展', score: 0}
        ]
      },
      {
        factor: '影响力',
        definition: '制定并实施影响策略，运用适当的人际交往方式和技巧来鼓舞和指导别人，促使主要的利益相关者采取行动，推动共同利益和业务目标的达成',
        subItem: [
          {demention: 'subject总能用使命感去感染他人，清晰的描绘愿景，用各种方法激励他人去实现愿景', score: 0},
          {demention: 'subject有一颗谦卑的心，尊重他人、尊重事实、尊重环境', score: 0},
          {demention: 'subject能以开放的胸怀接纳自己、包容他人，对人、对事表现出应有的格局', score: 0}
        ]
      },
      {
        factor: '目标导向',
        definition: '始终以目标为导向，制定计划并安排优先顺序，合理分配工作任务，确保每个人承担责任，建立和优化工作流程，保证工作顺畅执行，最终拿到结果',
        subItem: [
          {demention: '当接受一个任务时，subject总是能够根据计划、执行、检查和再行动的持续改进循环圈执行', score: 0},
          {demention: 'subject做人做事从不食言，说话算数，言必行，行必果', score: 0},
          {demention: 'subject承诺交付的任何工作、服务从不拖延，总能按质、按量、按时交付', score: 0}
        ]
      },
      {
        factor: '创新思维',
        definition: '当面对任务和挑战时，具有全局视角和未来视角，提出创新的解决思路，尝试研究不同的新颖的方法来处理工作中出现的问题，持续改善或勇于突破',
        subItem: [
          {demention: 'subject总能用全局的视角去看待人、物、事，尝试用不同的组合、新颖的方法创造性的去解决问题', score: 0},
          {demention: 'subject面对任务和挑战，不拘泥于过去的经验，而是总能从未来、更远的视角去思考可能性和解决方案', score: 0},
          {demention: 'subject对任何工作的完成追求完美，总是不断的学习新方法和新技术，持续改进', score: 0}
        ]
      },
      {
        factor: '结构化能力',
        definition: '将工作任务或者难题从多个侧面进行思考，收集资料进行深刻分析，归类整理，分析导致问题出现的原因，系统制定解决方案和行动步骤，看到预期的结果',
        subItem: [
          {demention: 'subject总是能把杂乱无章的信息或资料进行整理、分析和归类', score: 0},
          {demention: 'subject思路清晰，习惯用结构化思维提出问题、分析问题和解决问题', score: 0},
          {demention: '经过洞察分析后，subject总能看到问题的核心并进行提炼总结', score: 0}
        ]
      },
      {
        factor: '团队协作',
        definition: '积极主动采取行动与客户、团队其他成员或建立协作关系，以大团队目标为重，不计较个人和小团队利益，为团队成功作出贡献，通过协作达成共同目标',
        subItem: [
          {demention: 'subject总是积极主动与他人连结，建立可以协作的伙伴关系', score: 0},
          {demention: 'subject在团队合作中，总是以团队目标和利益为重，展现为团队成功作贡献', score: 0}
        ]
      }
    ]
  };
  for (let key in model) {
    for (let i in model[key]) {
      for (let j in model[key][i].subItem) {
        let dem = model[key][i].subItem[j].demention
        model[key][i].subItem[j].demention = dem.replace('subject', subject)
      }
    }
  }
  return model
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
  async onLoad(options) {
    try {
      wx.showNavigationBarLoading()
      //获取评估人的openId
      let res = await wx.cloud.callFunction({ name: 'login' })
      const openId = res.result.OPENID

      let model
      let prelude
      if (openId == options.consultant) {
        model = initModel('我')
        prelude = '您好！欢迎入驻子繁社，并自愿进行独立顾问能力测评！本测评是基于子繁咨询独家开发的独立顾问能力模型而研发的测评工具，仅作为您想成为独立顾问的能力评价参考！测评分两个部分，自我评估和他人评估。他人评估部分请邀请熟悉您的四位工作伙伴进行评估。'
      } else {
        if (options.gender == 1) {
          model = initModel('他')
        } else if (options.gender == 2) {
          model = initModel('她')
        } else {
          model = initModel('TA')
        }
        prelude = `您好！欢迎您进入独立顾问能力测评小程序！邀请您为您的伙伴${options.name}进行独立顾问能力评估！感谢您的支持！`
      }

      //检查是否已经评估过
      const db = wx.cloud.database();
      res = await db.collection('evaluation').where({
        _openid: openId,
        consultant: options.consultant
      }).get()

      const docId = res.data.length == 0 ? '' : res.data[0]._id
      const result = res.data.length == 0 ? model : res.data[0].result

      this.setData({
        evalId: docId,
        consultant: options.consultant,
        result,
        prelude,
        choices: ['非常不符合', '不符合', '有点儿不符合', '不好说', '有点儿符合', '符合', '非常符合']
      })
      wx.setNavigationBarTitle({
        title: options.name + '顾问的测评',
      })

      //处理因为网络问题引起的问题
      this.exception = {status: false}
    } catch(err) {
      //异常发生后需要重新加载页面，所以保存好options
      this.exception = {status: true, data: options}
      alert('网络异常，请下拉页面重新加载')
    } finally {
      wx.hideNavigationBarLoading()
    }
  },

  async onPullDownRefresh() {
    if (this.exception.status) {
      await this.onLoad(this.exception.data)
    }
    wx.stopPullDownRefresh()
  },

  async submitEval() {
    const result = this.data.result
    for (let a in result) {
      for (let d of result[a]) {
        for (let e of d.subItem) {
          if (e.score == 0) {
            alert(`请选择<${d.factor}>的选项`)
            return
          }
        }
      }
    }

    try {
      wx.showLoading()
      const db = wx.cloud.database();
      if (this.data.evalId == '') {
        //如果没有评估过则添加字段
        await db.collection('evaluation').add({
          data: {
            result: this.data.result,
            consultant: this.data.consultant,
          }
        })
      } else {
        //修改原有字段
        await db.collection('evaluation').doc(this.data.evalId).update({
          data: {
            result: this.data.result
          }
        })
      }

      wx.showModal({
        content: '提交成功',
        showCancel: false,
        confirmColor: '#F56C6C',
        success: (res) => {
          wx.switchTab({
            url: '/page/main/index',
          })
        }
      })
    } catch(err) {
      alert('网络异常')
      console.log(err)
    } finally {
      wx.hideLoading()
    }
  },

  radioChange(e) {
    const indexString = e.currentTarget.dataset.index
    const part = e.currentTarget.dataset.part
    const indices = indexString.split('-')
    const factorIndex = Number(indices[0])
    const subIndex = Number(indices[1])
    const evalIndex = Number(e.detail.value)
  
    console.log(evalIndex)
    this.data.result[part][factorIndex].subItem[subIndex].score = evalIndex + 1
  }
})