// pages/index.js
const app = getApp();
import util from '../../utils/util'
let api = require('../../utils/request').default;
Page({
    data: {
        background: ['demo-text-1', 'demo-text-2', 'demo-text-3'],
        indicatorDots: true,
        vertical: false,
        autoplay: false,
        interval: 2000,
        duration: 500,
        step: true, //步进器状态切换
        activeArea: null, //活动区域分类
        todayDate: null, //预售时间
        tomorrowDate: null, //提货时间
        imgAddress: app.globalData.imgAddress
    },
    // 商品详情
    detailtap(e) {
        const goodId=e.currentTarget.dataset.goodid;
        wx.navigateTo({
            url: '../detail/detail?goodId='+goodId,
        });
    },
    // 切换代理点
    switchDot() {
        wx.navigateTo({
            url: '../switch/switch',
        });
    },
    // 加入购物车
    addCart(e){
        const goodId=e.currentTarget.dataset.goodid
        console.log(goodId)
    },
    // 活动切换
    activeTap(e){
        const cateId=e.currentTarget.dataset.cateid;
        this.setData({
            active: cateId,
          })
        this.loadActiveList(cateId)
    },
    loadActiveList(activeId) {
        // 活动列表
        api.activeList({
            category_id: activeId
        }).then(result => {
            this.setData({
                activeList: result
            })
        })
    },
    onLoad() {
        //今天的时间
        var day2 = new Date();
        day2.setTime(day2.getTime());
        var s2 = (day2.getMonth() + 1) + "月" + day2.getDate() + "日";
        //明天的时间
        var day3 = new Date();
        day3.setTime(day3.getTime() + 24 * 60 * 60 * 1000);
        var s3 = (day3.getMonth() + 1) + "月" + day3.getDate() + "日";
        this.setData({
            todayDate: s2,
            tomorrowDate: s3
        })
        // 活动分类
        api.activeArea({
            shop_id: app.globalData.shopId
        }).then(result => {
            this.setData({
                activeArea: result,
                active:result[0].id
            })
            // 加载第一个活动数据
            this.loadActiveList(result[0].id)
        })
    },
})