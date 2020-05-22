// pages/person/person.js
const app = getApp();
import util from '../../utils/util'
let api = require('../../utils/request').default;
Page({
  data: {

  },

  onShow() {
    wx.navigateTo({
      url: '../login/login',
  });
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