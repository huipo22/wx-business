// pages/detail/detail.js
const app = getApp();
import util from '../../utils/util'
let api = require('../../utils/request').default;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    autoplay: false,
    duration: 500,
    detailData: null,
    imgAddress: app.globalData.imgAddress,
    tomorrowDay: null,
    rich: null,
    count: null,
    cartInfo: 0,
    flag: false, //页面是否加载完成
    isflag: false, //是否可以购买
    pannelShow: false, //遮罩层是否显示,
    goodnum: 1, //商品数量默认1
  },

  /**
   * 生命周期函数--监听页面加载
   */
  // 首页链接
  homeLink() {
    wx.switchTab({
      url: '/pages/index/index',
    });
  },
  // 购车车链接
  cartLink() {
    wx.switchTab({
      url: '/pages/Ccart/Ccart',
    });
  },
  // 关闭遮罩层
  closePannel() {
    this.setData({
      pannelShow: false
    })
  },
  // 购物数量更改
  onChange(event) {
    this.setData({
      goodnum: event.detail
    })
  },
  // 立即购买
  endTap(e) {
    if (this.data.pannelShow) {
      var obj = this.data.detailData;
      api.createOrder(
        [{
          goods_id: obj.id,
          present_price: obj.present_price,
          num: this.data.goodnum,
        }], {
          "Token": wx.getStorageSync("token"),
          "Device-Type": 'wxapp',
          "content-type": "application/json"
        }).then((result) => {
        wx.navigateTo({
          url: "../settle/settle?data=" + JSON.stringify(result),
        })

      })
    } else {
      this.setData({
        pannelShow: true
      })
    }
  },
  // 加入购物车
  addCart(e) {
    let goodId = e.currentTarget.dataset.goodid;
    api.cartAdd({
      goods_id: goodId,
      shop_id: app.globalData.shopId
    }, {
      Token: wx.getStorageSync('token'),
      "Device-Type": 'wxapp',
    }).then((result) => {
      wx.showToast({
        title: '加入购物车成功',
        icon: "none",
        duration: 1000
      })
      // 查询购物车
      util.queryCart(this)
      this.cartQ(app)
    })
  },
  onLoad: function (options) {
    //明天的时间
    var day3 = new Date();
    day3.setTime(day3.getTime() + 24 * 60 * 60 * 1000);
    var s3 = (day3.getMonth() + 1) + "月" + day3.getDate() + "日";
    this.setData({
      tomorrowDay: s3
    })
    const goodId = options.goodId;
    api.detail({
      goods_id: goodId
    }).then(result => {
      let rich = result.goods_detail.replace(/\<p><img/gi, '<img class="richImg" ')
      let count = new Date(result.pt_start_time * 1000).getTime() + result.pt_houres * 3600 * 1000
      // 倒计时
      let nowTime = new Date().getTime()
      // 结束时间
      let endTime = new Date(count).getTime()
      this.setData({
        detailData: result,
        rich: rich,
        count: endTime - nowTime,
        flag: true
      })
      if ((endTime - nowTime <= 0)) {
        this.setData({
          isflag: true
        })
      } else {
        this.setData({
          isflag: false
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  // 查询购物车
  cartQ(app) {
    let that = this;
    api.cartNum({
      shop_id: app.globalData.shopId
    }, {
      Token: wx.getStorageSync('token'),
      "Device-Type": 'wxapp',
    }).then((result) => {
      that.setData({
        cartInfo: result.sum
      })
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    if (wx.getStorageSync('token')) {
      // 查询购物车数量
      this.cartQ(app)
    }
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    if (wx.getStorageSync('token')) {
      util.queryCart()
    }
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    if (wx.getStorageSync('token')) {
      util.queryCart()
    }
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