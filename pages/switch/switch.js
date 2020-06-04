// pages/switch/switch.js
const app = getApp();
import util from '../../utils/util'
let api = require('../../utils/request').default;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    addressInfo: '',
    locationList: [],
    imgAddress: app.globalData.imgAddress,
    postInfo: '',
  },
  // 精准定位
  openAddress() {
    wx.chooseLocation({
      success: (result) => {
        console.log(result)
        this.setData({
          addressInfo: result.address
        })
        getApp().globalData.locationInfo = result.address;
        try {
          wx.setStorageSync('locationInfo', result.address)
          wx.setStorageSync('locationName', result.name)
          var locationString = result.latitude + "," + result.longitude;
          wx.setStorageSync('locationString', locationString)
        } catch (e) {
          console.log(e)
        }
      },
    });
  },
  // 设为默认地址
  setDefault(e) {
    let addressId = e.currentTarget.dataset.addressid;
    wx.setStorageSync('postId', addressId)
    wx.navigateBack({
      delta: 1
    });
  },
  // 登录链接
  linkLogin() {
    wx.navigateTo({
      url: '../login/login',
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  // 获取授权地理位置
  defaultAddress() {
    if (!wx.getStorageSync("locationInfo")) {
      let that = this
      wx.getLocation({
        type: 'wgs84',
        success(res) {
          console.log(res)
          var locationString = res.latitude + "," + res.longitude;
          wx.setStorageSync('locationString', locationString)
          wx.request({
            url: 'https://apis.map.qq.com/ws/geocoder/v1/',
            data: {
              "key": "FPHBZ-KANCK-XNHJH-AZGYM-LJHE2-YUBUL",
              "location": locationString
            },
            method: 'GET',
            success: function (r) {
              //输出一下位置信息
              console.log(r)
              // console.log('用户位置信息', r.data.result.address);
              //r.data.result.address获得的就是用户的位置信息，将它保存到一个全局变量上
              getApp().globalData.locationInfo = r.data.result.address;
              //这步是将位置信息保存到本地缓存中，key = value的形式
              that.setData({
                addressInfo: r.data.result.address
              })
              try {
                wx.setStorageSync('locationInfo', r.data.result.address)
                that.getLocation()
              } catch (e) {
                console.log(e)
              }
            }
          });
        },
        fail() {
          wx.getSetting({
            success: function (res) {
              if (!res.authSetting['scope.userLocation']) {
                wx.showModal({
                  title: '',
                  content: '请允许e刻宅送获取您的定位',
                  confirmText: '授权',
                  success: function (res) {
                    if (res.confirm) {
                      wx.openSetting();
                    } else {
                      console.log('get location fail');
                    }
                  }
                })
              } else {
                //用户已授权，但是获取地理位置失败，提示用户去系统设置中打开定位
                wx.showModal({
                  title: '',
                  content: '请在系统设置中打开定位服务',
                  confirmText: '确定',
                  success: function (res) {}
                })
              }
            }
          })
          return
        }
      })
    } else {
      this.setData({
        addressInfo: wx.getStorageSync("locationInfo")
      })
    }
  },
  onLoad: function (options) {
    if (options) {
      this.setData({
        postInfo: JSON.parse(options.postInfo),
        addressInfo: wx.getStorageSync('locationInfo')
      })
    }
  },
  // 自提点列表
  getLocation() {
    api.locationList({
      from: wx.getStorageSync('locationString')
    }, {
      "Token": wx.getStorageSync("token"),
      "Device-Type": "wxapp"
    }).then(result => {
      this.setData({
        locationList: result
      })
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
    if (wx.getStorageSync("locationInfo")) {
      this.getLocation()
    } else {
      this.defaultAddress()
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