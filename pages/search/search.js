// pages/search/search.js
const app = getApp();
const util = require('../../utils/util')
Page({
  data: {
    goodList: null,
    resourse: app.globalData.resource,
    inputVal:'',
    noneFlag:false,
  },
  inputTyping: function (e) {
    console.log(e)
    //搜索数据
    wx.request({
      url: app.globalData.host + '/api/goods/goods/search',
      method: 'GET',
      data: {
        shop_id: app.globalData.shopId,
        goods_name: e.detail,
        page: 1
      },
      success: (res) => {
        if (res.data.code == 1) {
          this.setData({
            goodList: res.data.data,
          })
        }
      },
    })
    this.setData({
      inputVal: e.detail
    });
  },
  // 商品链接
  goodSelect(e) {
    wx.navigateTo({
      url: '../goodDetail/goodDetail?goodId=' + e.currentTarget.dataset.goodid,
    })
  },
  // 加载更多
  loadMore() {
    let that = this;
    const oldData = that.data.goodsList;
    wx.request({
      url: app.globalData.host + '/api/goods/goods/index',
      data: {
        shop_id: app.globalData.shopId,
        goods_name: that.data.inputVal,
        page: app.globalData.page + 1,
      },
      method: 'GET',
      success: (result) => {
        if (result.data.code == 1) {
          that.setData({
            goodsList: oldData.concat(result.data.data),
            noneFlag:false,
          })
        } else {
          this.setData({
            noneFlag:true
          })
        }
      },
    });
  },
   // 添加购物车
   addCart(e) {
    util.addCart(e, app, util.queryCart)
  },
  // 商品链接
  goodSelect(e) {
    wx.navigateTo({
      url: '../goodDetail/goodDetail?goodId=' + e.currentTarget.dataset.goodid,
    })
  },
  onShow(){
    
  },
    /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})