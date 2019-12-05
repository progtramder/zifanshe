const app = getApp()
module.exports = {
  category: [
    {
      id: 'strategy-consultant',
      imageSrc: '/image/od.jpg',
      name: '战略顾问'
    }, {
      id: 'hr-consultant',
      imageSrc: '/image/hr.jpg',
      name: 'HR顾问'
    }, {
      id: 'coach-consultant',
      imageSrc: '/image/coach.jpg',
      name: '教练服务'
    }, 
    {
      id: 'sales-consultant',
      imageSrc: '/image/sales.jpg',
      name: '营销顾问'
    },
    {
      id: 'finance-consultant',
      imageSrc: '/image/finance.jpg',
      name: '财务顾问'
    },
    {
      id: 'internet-consultant',
      imageSrc: '/image/internet.jpg',
      name: '互联网+顾问'
    },
    {
      id: 'it-consultant',
      imageSrc: '/image/it.jpg',
      name: 'IT顾问'
    },
    {
      id: 'operation-consultant',
      imageSrc: '/image/operation.jpg',
      name: '运营顾问'
    },
  ],
  updateRedDot: updateRedDot,
  updateRedDotAdmin: updateRedDotAdmin
};

function hasNewOrder() {
  const db = wx.cloud.database();
  return new Promise((resolve, reject) => {
            db.collection('order').where({
              _openid: app.getOpenId(),
              status: 0
            }).count().then((res) => {
              resolve(res.total > 0)
            })
        })
}
function hasNewMessage() {
  const db = wx.cloud.database();
  return new Promise((resolve, reject) => {
          db.collection('message').where({
            _id: app.getOpenId()
          }).get().then((res) => {
            if (res.data.length) {
              resolve(res.data[0].unread)
            } else {
              resolve(false)
            }
          })
        })
}
function hasNewComment() {
  const db = wx.cloud.database();
  return new Promise((resolve, reject) => {
          db.collection('comment').where({
            _id: app.getOpenId()
          }).get().then((res) => {
            if (res.data.length) {
              resolve(res.data[0].unread)
            } else {
              resolve(false)
            }
          })
        })
}
function hasNewVerifying() {
  const db = wx.cloud.database();
  return new Promise((resolve, reject) => {
          db.collection('consultant').where({
            status: 'verifying'
          }).count().then((res) => {
            resolve(res.total > 0)
          })
        })
}

function updateRedDot(hostPage) {
  let promise = Promise.all([hasNewMessage(), 
    hasNewComment(), hasNewOrder()])
  promise.then(res => {
    if (hostPage) {
      hostPage.setData({
        newMessage: res[0],
        newComment: res[1],
        newOrder: res[2]
      })
    }
    if (res[0]|| res[1]|| res[2]) {
      wx.showTabBarRedDot({index: 2})
    } else {
      wx.hideTabBarRedDot({index: 2})
    }
  })
}

function updateRedDotAdmin(hostPage) {
  let promise = Promise.all([hasNewVerifying(), hasNewMessage(), 
    hasNewComment(), hasNewOrder()])
  promise.then(res => {
    if (hostPage) {
      hostPage.setData({
        newVerifying: res[0],
        newMessage: res[1],
        newComment: res[2],
        newOrder: res[3]
      })
    }
    if (res[0]|| res[1]|| res[2]|| res[3]) {
      wx.showTabBarRedDot({index: 2})
    } else {
      wx.hideTabBarRedDot({index: 2})
    }
  })
}
