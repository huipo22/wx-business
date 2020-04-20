// pages/settlement/settlement.js
const utils = require("../../utils/util.js");
import md5 from '../../utils/md5.js';
let app = getApp();
let api = require('../../utils/request').default;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    date: utils.formatDate(new Date()),
    time: utils.formatTime(new Date()),
    settleData: null,
    resource: app.globalData.resource,
    parmsData: null,
    remark: null, //b备注
    show: false,
    radio: '', //1 县城内 2 县城外
    pickerShow: false,
    SMshow: false,
    columns: [],
    selectPerson: null,
    settlePrice: null,
  },
  // 选择县城内外
  onChange(event) {
    this.setData({
      radio: event.detail,
      SMshow: true
    });
    if (event.detail == 2) {
      this.setData({
        pickerShow: true,
      })
    } else {
      this.setData({
        pickerShow: false,
        selectPerson: null,
        settlePrice: this.data.settleData.price
      })
    }
  },
  // 说明关闭
  SMclose() {
    this.setData({
      SMshow: false
    });
  },
  // 选中picker
  pickerChange(event) {
    const {
      picker,
      value,
      index
    } = event.detail;
    const result = this.data.result;
    const data = this.data.settleData
    const settlement = data.price - data.express_price
    this.setData({
      selectPerson: result[index],
      settlePrice: settlement,
    })
  },
  // picker 确认
  confirm(event) {
    const {
      picker,
      value,
      index
    } = event.detail;
    const result = this.data.result;
    const data = this.data.settleData
    const settlement = data.price - data.express_price
    this.setData({
      selectPerson: result[index],
      pickerShow: false,
      settlePrice: settlement,
    })
  },
  // picker 关闭
  cancel(e) {
    this.setData({
      pickerShow: false
    })
  },
  // 切换地址
  address() {
    wx.navigateTo({
      url: '../selectAddress/selectAddress'
    });

  },
  // 提交事件
  submitTap() {
    let settResult = this.data.settleData;
    if (!this.data.radio) {
      wx.showToast({
        title: '请选择配送方式',
        icon: 'none',
        duration: 1500,
        mask: false,
      });
      return
    } else if (!settResult.address_info && !this.data.parmsData) {
      wx.showToast({
        title: '请选择收货地址',
        icon: 'none',
        duration: 1500,
        mask: false,
        imgList: []
      });

    } else {
      // 地址
      let addressId = null
      if (settResult.address_info !== null) {
        addressId = settResult.address_info.id
      } else if (this.data.parmsData !== null) {
        addressId = this.data.parmsData.id
      } else {
        addressId = null
      }
      // 价格
      let Price;
      if (!this.data.settlePrice) {
        Price = settResult.price
      } else {
        Price = this.data.settlePrice
      }
      // 代理点
      let postId;
      if (this.data.selectPerson) {
        postId = this.data.selectPerson.id
      } else {
        postId = 0
      }
      // 支付接口
      api.wxpay({
        order_id: settResult.order_id,
        address_id: addressId,
        price: Price,
        remark: this.data.remark,
        post_id: postId
      }, {
        "Token": wx.getStorageSync("token"),
        "Device-Type": "wxapp"
      }).then((res) => {
        const result = res.data.data;
        let that = this;
        let paySign = md5.hexMD5('appId=' + result.appid + '&nonceStr=' + result.nonce_str + '&package=' + result.prepay_id + '&signType=MD5&timeStamp=' + result.timeStamp + "&key=n4iif00GHIAS8CFx4XxvWNNfYogZVDbg").toUpperCase();
        wx.requestPayment({
          'timeStamp': result.timeStamp + "",
          'nonceStr': result.nonce_str,
          'package': result.prepay_id,
          'signType': 'MD5',
          'paySign': paySign,
          success(res) {
            console.log('调用支付接口成功', res)
            wx.showModal({
              title: '提示消息',
              content: '是否推送物流信息',
              success(res) {
                if (res.confirm) {
                  console.log('用户点击确定')
                  wx.requestSubscribeMessage({
                    tmplIds: ['_KSK07-1whvjJpj29L55_wnsyi3L68c7EuynLX1fctM'],
                    success(res) {
                      console.log(res)
                      if (res['_KSK07-1whvjJpj29L55_wnsyi3L68c7EuynLX1fctM'] == 'accept') {
                        console.log('已授权接收订阅消息')
                        api.wxActivity({
                          temp_id: '_KSK07-1whvjJpj29L55_wnsyi3L68c7EuynLX1fctM',
                          order_id: settResult.order_id
                        }, {
                          "Token": wx.getStorageSync("token"),
                          "Device-Type": "wxapp"
                        }).then(res => {
                          if (res.data.code == 1) {
                            console.log(res + "订阅成功")
                          }
                        })
                      }
                    }
                  })
                  wx.redirectTo({
                    url: '../orderList/orderList?active=2'
                  })
                } else if (res.cancel) {
                  console.log('用户点击取消')
                }
              }
            })
           
          },
          fail(res) {
            console.log('调用支付接口fail', res)
            wx.redirectTo({
              url: '../orderList/orderList?active=1'
            })
          }
        })
      })
    }
  },
  // 商品清单show
  showPopup() {
    this.setData({
      show: true
    });
  },
  // 商品清单false
  onClose() {
    this.setData({
      show: false
    });
  },
  // 自提点电话
  phoneCall(e) {
    const phone = e.currentTarget.dataset.phone;
    wx.makePhoneCall({
      phoneNumber: phone, //仅为示例，并非真实的电话号码
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {},

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    let option = utils.getCurrentPageArgs();
    const data = JSON.parse(option.data)
    this.setData({
      settleData: data,
      settlePrice: data.price
    })
    const imgList = this.data.settleData.goods_info.map((obj) => {
      return obj.goods_img
    })
    this.setData({
      imgList: imgList
    })
    if (wx.getStorageSync("switchData")) {
      this.setData({
        parmsData: wx.getStorageSync("switchData")
      })
    };
    // 自提点list
    api.personList().then(res => {
      if (res.data.code == 1) {
        const list = res.data.data.map(obj => {
          return obj.user_address
        })
        this.setData({
          result: res.data.data,
          columns: list
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