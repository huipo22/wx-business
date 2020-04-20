// pages/editAddress/editAddress.js
const app = getApp();
import util from '../../utils/util'
let api = require('../../utils/request').default;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userData: null,
    id: null,
    // province: null,
    // city: null,
    // county: null,
    name: null,
    mobile: null,
    address: null,
    region: ["山西省", "运城市", "稷山县"],
    flag: false
  },
  getPhoneNumber(e) {
    // console.log(e.detail.errMsg)
    // console.log(e.detail.iv)
    // console.log(e.detail.encryptedData)
    if (e.detail.errMsg == "getPhoneNumber:ok")
      api.phoneGet({
        sessionKey: wx.getStorageSync('sessionKey'),
        encrypted_data: e.detail.encryptedData,
        iv: e.detail.iv
      }, {}).then(res => {
        // console.log(res)
        if (res.data.code == 1) {
          wx.setStorageSync('userPhone', res.data.msg.phoneNumber);
          this.setData({
            mobile: res.data.msg.phoneNumber,
            flag: false,
          })
        }
      })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //收货地址 页面传来的参数
    if (wx.getStorageSync("userPhone")) {
      this.setData({
        flag: false,
        mobile: wx.getStorageSync("userPhone")
      })
    } else {
      this.setData({
        flag: true
      })
    }
    if (Object.keys(options).length == 0) {
      return
    } else {
      let Address = JSON.parse(options.addressInfo)
      this.setData({
        flag: false,
        id: Address.id,
        province: Address.province,
        city: Address.city,
        county: Address.county,
        name: Address.name,
        mobile: Address.mobile,
        address: Address.address,
        // region: [Address.province, Address.city, Address.county],
      })
    }
  },
  // name
  nameChange(e) {
    console.log(e)
    this.setData({
      name: e.detail
    })
  },
  // mobile
  mobileChange(e) {
    this.setData({
      mobile: e.detail
    })
  },
  // region
  bindRegionChange: function (e) {
    // console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      region: e.detail.value
    })
  },
  // address
  addressChange(e) {
    this.setData({
      address: e.detail
    })
  },
  // save
  saveTap(e) {
    // add address
    const addressId = e.currentTarget.dataset.id
    if (addressId == null) {
      api.addAddress({
        name: this.data.name,
        mobile: this.data.mobile,
        address: this.data.address,
        province: this.data.region[0],
        city: this.data.region[1],
        county: this.data.region[2]
      }, {
        "Token": wx.getStorageSync("token"),
        "Device-Type": 'wxapp',
      }).then((res) => {
        if (res.data.code == 1) {
          wx.showToast({
            title: '保存成功',
            duration: 1500,
            success: () => {
              // wx.redirectTo({
              //   url: '../address/address',
              // });
              wx.navigateBack({
                delta: 1
              });
            },
          });
        } else if (res.data.code == 0) {
          wx.showToast({
            title: res.data.msg,
            icon: 'none',
            duration: 2000
          })
        }
      })
    } else {
      // update adress
      api.updateAddress({
        id: addressId,
        name: this.data.name,
        mobile: this.data.mobile,
        address: this.data.address,
        province: this.data.region[0],
        city: this.data.region[1],
        county: this.data.region[2]
      }, {
        "Token": wx.getStorageSync("token"),
        "Device-Type": 'wxapp',
      }).then(res => {
        if (res.data.code == 1) {
          wx.showToast({
            title: '保存成功',
            duration: 1500,
            success: (result) => {
              wx.navigateTo({
                url: '../address/address',
              });
            },
          });
        }
      })
    }
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
    if (wx.getStorageSync("userData")) {
      this.setData({
        userData: JSON.parse(wx.getStorageSync("userData"))
      })
    }
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