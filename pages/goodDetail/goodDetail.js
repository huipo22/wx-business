// pages/goodDetail/goodDetail.js
const app = getApp();
import util from '../../utils/util'
let api = require('../../utils/request').default;

Page({
  data: {
    resourse: app.globalData.resource, //图片域名
    goodDetailData: null, //购物车数据
    isCartTrue: false, //弹出框
    indicatorDots: true, //小点
    indicatorColor: "white", //指示点颜色
    activeColor: "coral", //当前选中的指示点颜色
    autoplay: false, //是否自动轮播
    interval: 1500, //间隔时间
    duration: 400, //滑动时间
    rich: '',
    cartInfo: 0,
  },
  onShow() {
    // 查询购物车数量
    this.cartQ(app)
  },

  onLoad(options) {
    let that = this;
    // 商品详情数据请求
    api.goodDetail({
      goods_id: options.goodId
    }).then((res) => {
      if (res.data.code == 1) {
        let rich = res.data.data.goods_detail.replace(/\<p><img/gi, '<img class="richImg" ')
        that.setData({
          goodDetailData: res.data.data,
          rich: rich
        })
      }
    })

  },
  // 购物车链接
  cartLink() {
    util.cartLink()
  },
  cartQ(app) {
    let that = this;
    api.cartNum({
      shop_id: app.globalData.shopId
    }, {
      Token: wx.getStorageSync('token'),
      "Device-Type": 'wxapp',
    }).then((res) => {
      if (res.data.code == 1) {
        that.setData({
          cartInfo: res.data.data.sum
        })
      }
    })
  },
  // 添加购物车
  addCart(e) {
    let goodId = e.currentTarget.dataset.goodid;
    api.cartAdd({
      goods_id: goodId,
      shop_id: app.globalData.shopId
    }, {
      Token: wx.getStorageSync('token'),
      "Device-Type": 'wxapp',
    }).then((res) => {
      if (res.data.code == 1) {
        wx.showToast({
          title: '加入购物车成功',
          icon: "none",
          duration: 1000
        })
        api.cartNum({
          shop_id: app.globalData.shopId,
        }, {
          Token: wx.getStorageSync('token'),
          "Device-Type": 'wxapp',
        }).then((res) => {
          if (res.data.code == 1) {
            // 购物车右上角数量
            let sum = res.data.data.sum;
            let that = this;
            if (sum !== 0) {
              wx.setTabBarBadge({
                index: 2,
                text: String(sum)
              })
              that.setData({
                cartInfo: sum
              })
            } else {
              wx.removeTabBarBadge({
                index: 2,
              });
            }
          }
        })
      } else if (res.data.code == 10001) {
        wx.navigateTo({
          url: '../login/login'
        })
      } else {
        wx.showToast({
          title: res.data.msg,
          icon: "none",
          duration: 1200
        })
      }
    })

  },
  // 点击预览图片
  previewImage(e) {
    const current = e.target.dataset.src;
    let imgUrls = [];
    const imgList = this.data.goodDetailData.banners;
    for (let i in imgList) {
      let allSrc = this.data.resourse + imgList[i].url
      imgUrls.push(allSrc)
    }
    wx.previewImage({
      current: current,
      urls: imgUrls,
    })
  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    util.queryCart(app)
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    util.queryCart(app)
  },
    /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})