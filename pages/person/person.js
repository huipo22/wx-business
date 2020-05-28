// pages/person/person.js
const app = getApp();
import util from '../../utils/util'
let api = require('../../utils/request').default;
Page({
  data: {
    userData: null,
    tuanInfo: app.globalData.imgAddress + "/ioc/tuanzhangxinxi.png",
    tuanReq: app.globalData.imgAddress + "/ioc/tuanzhangshenqing.png",
    oneKefu: app.globalData.imgAddress + "/ioc/yijianfankui.png",
    Kefu: app.globalData.imgAddress + "/ioc/kefu.png",
    order1: app.globalData.imgAddress + "/ioc/daifukuan.png",
    order2: app.globalData.imgAddress + "/ioc/daipeisong.png",
    order3: app.globalData.imgAddress + "/ioc/daitihuo.png",
    order4: app.globalData.imgAddress + "/ioc/wancheng.png",
    smallList: []
  },

  onShow() {
    if (wx.getStorageSync("userData")) {
      this.setData({
        userData: JSON.parse(wx.getStorageSync("userData"))
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
  },

  orderList(e) {
    wx.navigateTo({
      url: '../orderList/orderList?active=' + e.currentTarget.dataset.num,
    })
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})