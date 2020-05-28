// pages/cart/cart.js
const app = getApp()
import util from '../../utils/util'
let api = require('../../utils/request').default;
Page({

    /**
     * 页面的初始数据
     */
    data: {
        imgAddress: app.globalData.imgAddress,
        carts: [],
        totalMoney: 0,
        postInfo: ''
    },
    // 结算事件
    endTap() {
        let carts = this.data.carts;
        const chooseList = carts.map((obj) => {
            return {
                goods_id: obj.goods_id,
                present_price: obj.present_price,
                num: obj.num,
                shopping_id: obj.id
            }
        })
        api.createOrder(
            chooseList, {
                "Token": wx.getStorageSync("token"),
                "Device-Type": 'wxapp',
                "content-type": "application/json"
            }).then((result) => {
            wx.navigateTo({
                url: "../settle/settle?data=" + JSON.stringify(result),
            })
        })
    },
    onChange(e) {
        console.log(e)
    },
    // 购物车删除
    cartDelete(shoppingId, index, e) {
        api.cartDelete({
            shopping_id: shoppingId
        }, {
            "Token": wx.getStorageSync("token"),
            "Device-Type": "wxapp"
        }).then((result) => {
            wx.showToast({
                title: '删除商品成功',
                icon: 'none',
                duration: 1500
            });
            const carts = this.data.carts;
            util.arrayRemoveItem(carts, carts[index])
            util.queryCart()
            this.getTotalPrice()
        })
    },
    // 加减接口
    cartOption(e, carts, index, num) {
        api.cartAction({
            action: e.target.id,
            shopping_id: carts[index].id,
            goods_id: carts[index].goods_id
        }, {
            "Token": wx.getStorageSync("token"),
            "Device-Type": "wxapp"
        }).then((res) => {
            carts[index].num = num
            this.setData({
                carts: carts
            })
            util.queryCart()
            this.getTotalPrice()
        })
    },

    // 商品增加或减少
    quantityChange(e) {
        const index = e.currentTarget.dataset.index;
        let carts = this.data.carts;
        let num = carts[index].num;
        let shoppingId = carts[index].id
        let that = this;
        if (e.target.id == 'dec') {
            if (num == 1) {
                wx.showModal({
                    content: '确定删除商品?',
                    success(res) {
                        if (res.confirm) {
                            that.cartDelete(shoppingId, index);
                        } else if (res.cancel) {
                            return
                        }
                    }
                })
                return
            } else {
                num -= 1
                this.cartOption(e, carts, index, num)
            }
        } else if (e.target.id == 'inc') {
            num += 1
            this.cartOption(e, carts, index, num)
        }
    },
    // 计算总价函数
    getTotalPrice() {
        let carts = this.data.carts; // 获取购物车列表
        let total = 0;
        for (let i = 0; i < carts.length; i++) { // 循环列表得到每个数据
            total += carts[i].num * carts[i].present_price; // 所有价格加起来
        }
        this.setData({ // 最后赋值到data中渲染到页面
            carts: carts,
            totalMoney: total.toFixed(2)
        });
    },
    // 获取购物车数据
    cartQuery() {
        let that = this
        api.cartIndex({
            shop_id: app.globalData.shopId
        }, {
            "Token": wx.getStorageSync("token"),
            "Device-Type": "wxapp"
        }).then((result) => {
            // 查询购物车
            util.queryCart()
            that.setData({
                carts: result
            })
            that.getTotalPrice(); // 重新获取总价
        })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {},
    /**
     * 生命周期函数--监听页面显示
     */

    onShow: function () {
        //查询购物车数据
        this.cartQuery()
        this.setData({
            postInfo: wx.getStorageSync("postInfo")
        })
    },
    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    }
})