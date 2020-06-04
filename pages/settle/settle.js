// pages/settle/settle.js
const app = getApp();
import util from '../../utils/util'
import md5 from '../../utils/md5.js';
let api = require('../../utils/request').default;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderInfo: null,
    imgAddress: app.globalData.imgAddress,
    pName: '',
    pPhone: '',
    flag: false,
  },
  getPhoneNumber(e) {
    if (e.detail.errMsg == "getPhoneNumber:ok")
      api.phoneGet({
        sessionKey: wx.getStorageSync('sessionKey'),
        encrypted_data: e.detail.encryptedData,
        iv: e.detail.iv
      }, {}).then(result => {
        wx.setStorageSync('user_phone', result.phoneNumber);
        this.setData({
          pPhone: result.phoneNumber,
          flag: false,
        })
      })
  },
  // 收货人名字
  nameBlur(e) {
    let name = e.detail.value
    this.setData({
      pName: name
    })
    wx.setStorageSync('user_name', that.data.pName)
  },
  // 收货人手机号
  phoneBlur(e) {
    let phone = e.detail.value
    this.setData({
      pPhone: phone
    })
    wx.setStorageSync('user_phone', that.data.pPhone)
  },
  // 结算事件
  btnTap() {
    const settResult = this.data.orderInfo
    api.wxpay({
      order_id: settResult.order_id,
      price: settResult.price,
      post_id: wx.getStorageSync("post").id, //自提点id
      user_name: this.data.pName, //本人姓名
      user_phone: this.data.pPhone, //本人手机
    }, {
      "Token": wx.getStorageSync("token"),
      "Device-Type": "wxapp"
    }).then((result) => {
      let that = this
      let paySign = md5.hexMD5('appId=' + result.appid + '&nonceStr=' + result.nonce_str + '&package=' + result.prepay_id + '&signType=MD5&timeStamp=' + result.timeStamp + "&key=n4iif00GHIAS8CFx4XxvWNNfYogZVDbg").toUpperCase();
      wx.requestPayment({
        'timeStamp': result.timeStamp + "",
        'nonceStr': result.nonce_str,
        'package': result.prepay_id,
        'signType': 'MD5',
        'paySign': paySign,
        success(res) {
          console.log('调用支付接口成功', res)

          wx.redirectTo({
            url: '../orderList/orderList?active=2'
          })
        },
        fail(res) {
          console.log('调用支付接口fail', res)
          wx.redirectTo({
            url: '../orderList/orderList?active=1'
          })
        }
      })
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      orderInfo: JSON.parse(options.data)
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.setData({
      post: wx.getStorageSync('post')
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})