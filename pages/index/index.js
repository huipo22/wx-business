// pages/index.js
const app = getApp();
import util from '../../utils/util'
let api = require('../../utils/request').default;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    resource: app.globalData.resource, //图片域名
    cateList: null, //left
    rightList: null, //right
    loadFlag: true,
    scrollTop: 0,
    categoryId: null,
    goodIndex: 0,
    page: 1,
    cateId: null,
    noneFlag: false,
  },

  // left click
  leftClick(e) {
    let categoryId = e.currentTarget.dataset.num;
    let index = e.currentTarget.dataset.index
    this.setData({
      noneFlag: false
    })
    this.loadList(categoryId, index)
  },
  // 商品链接
  goodSelect(e) {
    wx.navigateTo({
      url: '../goodDetail/goodDetail?goodId=' + e.currentTarget.dataset.goodid,
    })
  },
  // 添加购物车
  addCart(e) {
    util.addCart(e, app, util.queryCart)
  },
  // 加载更多
  loadMore(e) {
    let categoryId = this.data.categoryId;
    const oldData = this.data.rightList;
    var pp = this.data.page + 1
    api.subCategories({
      category_id: categoryId,
      page: pp
    }).then((res) => {
      if (res.data.code == 1) {
        if (res.data.data == 0) {
          this.setData({
            noneFlag: true
          })
        } else {
          this.setData({
            rightList: oldData.concat(res.data.data),
            page: pp,
            noneFlag: false,
          })
        }
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 默认
    api.homeCategory({
      shop_id: app.globalData.shopId
    }).then((res) => {
      if (res.data.code == 1) {
        this.setData({
          cateList: res.data.data,
        })
        this.loadList(res.data.data[this.data.goodIndex].id, this.data.goodIndex)
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {},
  // 加载右侧数据
  loadList(categoryId, index) {
    this.setData({
      loadFlag: true
    })
    api.subCategories({
      category_id: categoryId,
      page: 1
    }).then((res) => {
      if (res.data.code == 1) {
        this.setData({
          loadFlag: false,
          goodIndex: index,
          categoryId: categoryId,
          page: 1,
          rightList: res.data.data
        })
      }
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
  onUnload: function () {},

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