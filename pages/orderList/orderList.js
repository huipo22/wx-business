// pages/orderList/orderList.js
let app = getApp();
const util = require('../../utils/util')
import md5 from '../../utils/md5.js';
let api = require('../../utils/request').default;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderActive: 1,
    orderListTab: [{
        name: 1,
        title: "待付款"
      },
      {
        name: 2,
        title: "待发货"
      },
      {
        name: 3,
        title: "待收货"
      },
      {
        name: 4,
        title: "已完成"
      },
      {
        name: 5,
        title: "已退款"
      },
    ],
    loadFlag: true,
    resourse: app.globalData.resource,
    orderListData: [],
    goodList: [],
    evenPrice: '',
  },
  // 加载订单数据
  loadOrdernData(status) {
    this.setData({
      loadFlag: true
    })
    api.getOrder({
      shop_id: app.globalData.shopId,
      status: status
    }, {
      Token: wx.getStorageSync('token'),
      "Device-Type": 'wxapp',
    }).then((res) => {
      if (res.data.code == 1) {
        this.setData({
          orderListData: res.data.data,
          loadFlag: false
        })
      }
    })
  },
  // 订单选项卡改变事件
  orderChange(event) {
    const status = event.detail.name
    console.log(status)
    this.setData({
      orderActive: status
    })
    this.loadOrdernData(status)
  },
  // 取消
  cancel(e) {
    let that = this
    wx.showModal({
      title: '提示',
      content: '是否取消该订单',
      success(res) {
        if (res.confirm) {
          api.orderRefund({
            order_id: Number(e.target.id),
            shop_id: app.globalData.shopId
          }, {
            "Token": wx.getStorageSync("token"),
            "Device-Type": "wxapp"
          }).then((res) => {
            if (res.data.code == 1) {
              wx.showToast({
                title: '订单已取消',
                icon: 'success',
                duration: 2000
              })
              console.log(that.data.orderActive)
              that.loadOrdernData(that.data.orderActive)
            } else {
              wx.showToast({
                title: res.data.msg,
                icon: 'none',
                duration: 2000
              })
            }
          })

        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  // 付款
  pay(e) {
    console.log(e)
    let order = e.target.dataset.order
    let that = this
    // return;
    api.wxpay({
      order_id: order.id,
      address_id: order.add_id,
      price: order.pay_price,
      post_id: order.post_id,
      remark: ''
    }, {
      "Token": wx.getStorageSync("token"),
      "Device-Type": "wxapp"
    }).then((res) => {
      console.log(res)
      const result = res.data.data
      let paySign = md5.hexMD5('appId=' + result.appid + '&nonceStr=' + result.nonce_str + '&package=' + result.prepay_id + '&signType=MD5&timeStamp=' + result.timeStamp + "&key=n4iif00GHIAS8CFx4XxvWNNfYogZVDbg").toUpperCase();
      wx.requestPayment({
        'timeStamp': result.timeStamp + "",
        'nonceStr': result.nonce_str,
        'package': result.prepay_id,
        'signType': 'MD5',
        'paySign': paySign,
        success(res) {
          console.log('调用支付接口成功', res)
          that.setData({
            orderActive: 2,
          })
          that.loadOrdernData(2)

        },
        fail(res) {
          console.log('调用支付接口fail', res)
          // that.setData({
          //   orderActive: 1,
          // })
          // that.loadOrdernData(1)
        }
      })
    })
  },
  // 退款
  backPay(e) {
    console.log(e)
    let that = this
    wx.showModal({
      title: '提示',
      content: '是否需要退款',
      success(res) {
        if (res.confirm) {
          api.orderRefund({
            order_id: Number(e.target.id),
            shop_id: app.globalData.shopId
          }, {
            "Token": wx.getStorageSync("token"),
            "Device-Type": "wxapp"
          }).then((res) => {
            if (res.data.code == 1) {
              that.setData({
                orderList: res.data.data
              })
              wx.showModal({
                title: '提示',
                content: '退款成功',
                showCancel: false,
                success(res) {
                  if (res.confirm) {
                    that.setData({
                      orderActive: 5,
                    })
                    that.loadOrdernData(5)
                  }
                }
              })
            }
          })

        } else if (res.cancel) {
          console.log('用户点击取消');
          return
        }
      }
    })
  },
  goodLink(e) {
    const id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../goodDetail/goodDetail?goodId=' + id,
    })
  },
  showPopup(e) {
    console.log(e)
    const index = e.currentTarget.dataset.index
    this.setData({
      show: true,
      goodList: this.data.orderListData[index].goods_info,
      evenPrice: this.data.orderListData[index].pay_price
    });
  },
  onClose() {
    this.setData({
      show: false,
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    this.loadOrdernData(1)
    if (options.active) {
      this.setData({
        orderActive: Number(options.active)
      })
      // this.loadOrdernData(Number(options.active))
    } else {
      // this.loadOrdernData(1)
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
    var pages = getCurrentPages(); //页面指针数组
    console.log(pages)
    var prepage = pages[pages.length - 1]; //上一页面指针
    console.log(prepage)
    if (prepage.route == "pages/orderList/orderList") {
      wx.reLaunch({
        url: '../person/person',
      });
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