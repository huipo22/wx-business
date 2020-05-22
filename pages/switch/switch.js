// pages/switch/switch.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    addressInfo: ''
  },
  // 精准定位
  openAddress() {
    wx.chooseLocation({
      success: (result) => {
        this.setData({
          addressInfo: result.address
        })
        getApp().globalData.locationInfo = result.address;
        try {
          wx.setStorageSync('locationInfo', result.address)
        } catch (e) {
          console.log(e)
        }
      },
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (!wx.getStorageSync("locationInfo")) {
      let that = this
      wx.getLocation({
        type: 'wgs84',
        success(res) {
          console.log(res)
          var locationString = res.latitude + "," + res.longitude;
          wx.request({
            url: 'https://apis.map.qq.com/ws/geocoder/v1/',
            data: {
              "key": "FPHBZ-KANCK-XNHJH-AZGYM-LJHE2-YUBUL",
              "location": locationString
            },
            method: 'GET',
            success: function (r) {
              //输出一下位置信息
              console.log('用户位置信息', r.data.result.address);
              //r.data.result.address获得的就是用户的位置信息，将它保存到一个全局变量上
              getApp().globalData.locationInfo = r.data.result.address;
              //这步是将位置信息保存到本地缓存中，key = value的形式
              that.setData({
                addressInfo: r.data.result.address
              })
              try {
                wx.setStorageSync('locationInfo', r.data.result.address)
              } catch (e) {
                console.log(e)
              }
            }
          });
        },
        fail() {
          return
        }
      })
    } else {
      this.setData({
        addressInfo: wx.getStorageSync("locationInfo")
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