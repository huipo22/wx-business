// pages/person/person.js
const app = getApp();
import util from '../../utils/util'
let api = require('../../utils/request').default;
Page({
  data: {
    userData: null,
    one: app.globalData.imgAddress + "/ioc/tuanzhangshenqing.png",
    three: app.globalData.imgAddress + "/ioc/gongying.png",
    four: app.globalData.imgAddress + "/ioc/phone.png",
    Kefu: app.globalData.imgAddress + "/ioc/kefu.png",
    order1: app.globalData.imgAddress + "/ioc/daifukuan.png",
    order2: app.globalData.imgAddress + "/ioc/daipeisong.png",
    order3: app.globalData.imgAddress + "/ioc/daitihuo.png",
    order4: app.globalData.imgAddress + "/ioc/wancheng.png",
    five: app.globalData.imgAddress + "/ioc/more.png",
    smallList: []
  },

  onShow() {
    if (wx.getStorageSync('token')) {
      if (wx.getStorageSync("user")) {
        this.setData({
          userData: wx.getStorageSync("user")
        })
      }
      if (wx.getStorageSync('postId')) {
        api.setDefault({
          post_id: wx.getStorageSync('postId')
        }, {
          "Token": wx.getStorageSync("token"),
          "Device-Type": "wxapp"
        }).then(result => {
          this.setData({
            post: result
          })
          wx.setStorageSync('post', result);
        })
      }
      // 个人中心订单徽章
      api.personOrderInfo({}, {
        Token: wx.getStorageSync('token'),
        "Device-Type": 'wxapp',
      }).then(result => {
        this.setData({
          smallList: result.list
        })
      })
    }

  },
  // 团长申请页面链接
  tuanRequest(){
    wx.navigateTo({
      url:"../tuanRequest/tuanRequest"
    })
  },
  // 切换代理点
  switchDot() {
    wx.navigateTo({
      url: '../switch/switch?postInfo=' + JSON.stringify(this.data.post),
    });
  },
  orderList(e) {
    wx.navigateTo({
      url: '../orderList/orderList?active=' + e.currentTarget.dataset.num,
    })
  },
  callPhone() {
    wx.makePhoneCall({
      phoneNumber: '15735639898'
    })
  },
  // 跳转小程序
  tiaozhuan(){
    util.switchSmall()
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})