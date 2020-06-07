let api = require('./request').default;
const formatDate = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  return [year, month, day].map(formatNumber).join('/')
}
const formatTime = date => {
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()
  return [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

// 删除数组中某一项
const arrayRemoveItem = (arr, delVal) => {
  if (arr instanceof Array) {
    var index = arr.indexOf(delVal);
    if (index > -1) {
      return arr.splice(index, 1);
    }
  }
}

const login = () => {
  wx.login({
    success: res => {
      let wxCode = res.code;
      wx.getUserInfo({
        success(res) {
          let wxData = res;
          api.wxLogin({
            code: wxCode,
            encrypted_data: wxData.encryptedData,
            iv: wxData.iv,
            raw_data: wxData.rawData,
            signature: wxData.signature
          }, {
            'AppId': 'wx283539c233d7f39e' // 默认值
          }).then((result) => {
            // 存缓存 token sessionKey
            wx.setStorageSync('token', result.token)
            wx.setStorageSync('sessionKey', result.sessionKey)
            if (result.user.post_id) {
              wx.setStorageSync('postId', result.user.post_id)
            }
            wx.setStorageSync('user', result.user)
            api.setDefault({
              post_id: wx.getStorageSync('postId')
            }, {
              "Token": wx.getStorageSync("token"),
              "Device-Type": "wxapp"
            }).then(result => {
              wx.setStorageSync('post', result);
            })
            // 查询购物车
            queryCart()
            // 授权完返回上一页
            var pages = getCurrentPages();
            if (pages.length !== 1) {
              let beforePage = pages[pages.length - 2];
              wx.navigateBack({
                delta: 1,
                success: function () {
                  if (beforePage.route == 'pages/index/index') {
                    beforePage.onShow() //这个函数式调用接口的函数
                  }
                }
              });
            }
          })
        }
      })
    }
  })
}
const switchSmall = () => {
  wx.navigateToMiniProgram({
    appId: 'wx1c2c5d708d0c4ea9',
    path: '',
    envVersion: 'release', // 打开正式版
    success(res) {
      // 打开成功
    },
    fail: function (err) {
      console.log(err);
    }
  })
}
// 加入购物车接口
const addCart = (e) => {
  const app = getApp();
  let goodId = e.currentTarget.dataset.goodid;
  api.cartAdd({
    goods_id: goodId,
    shop_id: app.globalData.shopId
  }, {
    Token: wx.getStorageSync('token'),
    "Device-Type": 'wxapp',
  }).then((result) => {
    wx.showToast({
      title: '加入购物车成功',
      icon: "none",
      duration: 1000
    })
    // 查询购物车徽章
    queryCart()
  })
}
// tab 购物车徽章
const queryCart = () => {
  const app = getApp();
  api.cartNum({
    shop_id: app.globalData.shopId,
  }, {
    Token: wx.getStorageSync('token'),
    "Device-Type": 'wxapp',
  }).then((result) => {
    // 购物车右上角数量
    let sum = result.sum;
    if (sum !== 0) {
      wx.setTabBarBadge({
        index: 1,
        text: String(sum)
      })
    } else {
      wx.removeTabBarBadge({
        index: 1,
      });
    }
  })
}
// 购物车tab链接
const cartLink = () => {
  wx.switchTab({
    url: '../Ccart/Ccart',
  })
}
// 页面参数
const getCurrentPageArgs = () => {
  const pages = getCurrentPages();
  const currentPage = pages[pages.length - 1];
  const url = currentPage.route;
  const options = currentPage.options;
  return options
}

module.exports = {
  formatDate: formatDate,
  formatTime: formatTime,
  arrayRemoveItem: arrayRemoveItem,
  login: login,
  addCart: addCart,
  cartLink: cartLink,
  queryCart: queryCart,
  getCurrentPageArgs: getCurrentPageArgs,
  switchSmall: switchSmall
}