// pages/settle/settle.js
const app = getApp();
import util from '../../utils/util'
let api = require('../../utils/request').default;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderInfo: null,
    imgAddress: app.globalData.imgAddress,
    pName: '',
    pPhone: ''
  },
  // 收货人名字
  nameBlur(e) {
    let name = e.detail.value
    this.setData({
      pName: name
    })
  },
  // 收货人手机号
  phoneBlur(e) {
    let phone = e.detail.value
    this.setData({
      pPhone: phone
    })
  },
  // 结算事件
  btnTap(){
    const settResult=this.data.orderInfo
    api.wxpay({
      order_id: settResult.order_id,
      address_id: addressId,
      price: Price,
      remark: this.data.remark,
      postId:wx.getStorageSync("postInfo".id),//自提点id
      name:this.data.pName,//本人姓名
      phone:this.data.pPhone,//本人手机
    }, {
      "Token": wx.getStorageSync("token"),
      "Device-Type": "wxapp"
    }).then((result) => {})
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