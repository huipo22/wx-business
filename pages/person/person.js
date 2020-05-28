// pages/person/person.js
const app = getApp();
import util from '../../utils/util'
let api = require('../../utils/request').default;
Page({
  data: {
    userData:null,
    tuanInfo:app.globalData.imgAddress+"/ioc/tuanzhangxinxi.png",
    tuanReq:app.globalData.imgAddress+"/ioc/tuanzhangshenqing.png",
    oneKefu:app.globalData.imgAddress+"/ioc/yijianfankui.png",
    Kefu:app.globalData.imgAddress+"/ioc/kefu.png",
    order1:app.globalData.imgAddress+"/ioc/daifukuan.png",
    order2:app.globalData.imgAddress+"/ioc/daipeisong.png",
    order3:app.globalData.imgAddress+"/ioc/daitihuo.png",
    order4:app.globalData.imgAddress+"/ioc/wancheng.png",
  },

  onShow() {
    if (wx.getStorageSync("userData")) {
      this.setData({
        userData: JSON.parse(wx.getStorageSync("userData"))
      })
    }
  },
  listTap() {
    wx.navigateTo({
      url: '../orderList/orderList',
    });
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})