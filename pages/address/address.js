// pages/address/address.js
const app = getApp()
import util from '../../utils/util'
let api = require('../../utils/request').default;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    addressList: [],
  },
  // 地址列表加载
  readyData() {
    let that = this;
    api.addressList({}, {
      "Token": wx.getStorageSync("token"),
      "Device-Type": 'wxapp',
    }).then((res) => {
      if (res.data.code == 1) {
        that.setData({
          addressList: res.data.data
        })
      }
    })
  },
  // 默认地址
  radioTap(e) {
    let that = this
    const addressId = e.currentTarget.dataset.id
    api.defaultAddress({
      id: addressId
    }, {
      "Token": wx.getStorageSync("token"),
      "Device-Type": 'wxapp',
    }).then((res) => {
      if (res.data.code == 1) {
        wx.showToast({
          title: '设置成功',
          icon: 'none',
          duration: 1500,
        });
        that.readyData()
      }
    })
  },
  // 删除地址
  deleteTap(e) {
    let that = this;
    const addressId = e.currentTarget.dataset.id
    wx.showModal({
      title: '提示',
      content: '确认删除改收获地址?',
      success(res) {
        if (res.confirm) {
          api.deleteAddress({
            id: addressId
          }, {
            "Token": wx.getStorageSync("token"),
            "Device-Type": 'wxapp',
          }).then((res) => {
            if (res.data.code == 1) {
              that.readyData()
            }
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  // 编辑地址
  editTap(e) {
    // console.log(e)
    const addressInfo = e.currentTarget.dataset.info
    wx.navigateTo({
      url: '../editAddress/editAddress?addressInfo=' + JSON.stringify(addressInfo),
    })
  },
  // 添加新地址
  newAddress() {
    wx.navigateTo({
      url: '../editAddress/editAddress',
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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
    this.readyData()
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
    wx.switchTab({
      url: '../person/person',
    });
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