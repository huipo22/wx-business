// pages/person/person.js
const app = getApp();
import util from '../../utils/util'
let api = require('../../utils/request').default;
Page({
  data: {
    userData: null,
    smallList:[]
  },
  // 我的订单
  orderList: function (e) {
    wx.navigateTo({
      url: '../orderList/orderList?active=' + e.currentTarget.dataset.num,
    })
  },
  // 收货地址
  addressTap: function () {
    wx.navigateTo({
      url: '../address/address',
    })
  },
  // 联系我们
  makePhone() {
    wx.makePhoneCall({
      phoneNumber: app.globalData.phone, //仅为示例，并非真实的电话号码
    })
  },

  //商家入驻
  shopsTap() {
    wx.makePhoneCall({
      phoneNumber: '15735639898', //仅为示例，并非真实的电话号码
    })
  },
  // 门店地址位置
  shopAddress(){
    wx.openLocation({
      latitude: 35.607745,
      longitude: 110.996911,
      scale: 18,
      name: 'e刻宅送',
      address: '稷山县育英街外婆饺子宴东e刻宅送',
      success: (result)=>{
        
      },
      fail: ()=>{},
      complete: ()=>{}
    });
  },
  onShow() {
    util.getSetting()
    if (wx.getStorageSync("userData")) {
      this.setData({
        userData: JSON.parse(wx.getStorageSync("userData"))
      })
    }
    // 个人中心订单徽章
    api.personOrderInfo({}, {
      Token: wx.getStorageSync('token'),
      "Device-Type": 'wxapp',
    }).then(res => {
      if (res.data.code == 1) {
        this.setData({
          smallList:res.data.data.list
        })
      }
    })
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})