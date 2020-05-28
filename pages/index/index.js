// pages/index.js
const app = getApp();
import util from '../../utils/util'
let api = require('../../utils/request').default;
const posterConfig = {
    jdConfig: {
        width: 750,
        height: 1000,
        backgroundColor: '#fff',
        debug: false,
        pixelRatio: 1,
        blocks: [{
                width: 690,
                height: 808,
                x: 30,
                y: 183,
                borderWidth: 2,
                borderColor: '#f0c2a0',
                borderRadius: 20,
            },
            {
                width: 634,
                height: 74,
                x: 59,
                y: 770,
                backgroundColor: '#fff',
                opacity: 0.5,
                zIndex: 100,
            },
        ],
        texts: [{
                x: 113,
                y: 61,
                baseLine: 'middle',
                text: '伟仔',
                fontSize: 32,
                color: '#8d8d8d',
            },
            {
                x: 30,
                y: 113,
                baseLine: 'top',
                text: '发现一个好物，推荐给你呀',
                fontSize: 38,
                color: '#080808',
            },
            {
                x: 92,
                y: 810,
                fontSize: 38,
                baseLine: 'middle',
                text: '标题标题标题标题标题标题标题标题标题',
                width: 570,
                lineNum: 1,
                color: '#8d8d8d',
                zIndex: 200,
            },
            {
                x: 59,
                y: 895,
                baseLine: 'middle',
                text: [{
                        text: '2人拼',
                        fontSize: 28,
                        color: '#ec1731',
                    },
                    {
                        text: '¥99',
                        fontSize: 36,
                        color: '#ec1731',
                        marginLeft: 30,
                    }
                ]
            },
            {
                x: 522,
                y: 895,
                baseLine: 'middle',
                text: '已拼2件',
                fontSize: 28,
                color: '#929292',
            },
            {
                x: 59,
                y: 945,
                baseLine: 'middle',
                text: [{
                        text: '商家发货&售后',
                        fontSize: 28,
                        color: '#929292',
                    },
                    {
                        text: '七天退货',
                        fontSize: 28,
                        color: '#929292',
                        marginLeft: 50,
                    },
                    {
                        text: '运费险',
                        fontSize: 28,
                        color: '#929292',
                        marginLeft: 50,
                    },
                ]
            },
            {
                x: 360,
                y: 1065,
                baseLine: 'top',
                text: '长按识别小程序码',
                fontSize: 38,
                color: '#080808',
            },
            {
                x: 360,
                y: 1123,
                baseLine: 'top',
                text: '超值好货一起拼',
                fontSize: 28,
                color: '#929292',
            },
        ],
        images: [{
                width: 62,
                height: 62,
                x: 30,
                y: 30,
                borderRadius: 62,
                url:"https://shop.jishanhengrui.com/upload/admin/20200526/9fb20871d438a991a733976deeb73571.jpg",
            },
            {
                width: 634,
                height: 634,
                x: 59,
                y: 210,
                url:"https://shop.jishanhengrui.com/upload/admin/20200526/9fb20871d438a991a733976deeb73571.jpg",
            },
            {
                width: 220,
                height: 220,
                x: 92,
                y: 1020,
                url:"https://shop.jishanhengrui.com/upload/admin/20200526/9fb20871d438a991a733976deeb73571.jpg",
            },
           
        ]

    },
}
Page({
    data: {
        background: ['demo-text-1', 'demo-text-2', 'demo-text-3'],
        indicatorDots: true,
        vertical: false,
        autoplay: false,
        interval: 2000,
        duration: 500,
        activeArea: null, //活动区域分类
        todayDate: null, //预售时间
        tomorrowDate: null, //提货时间
        imgAddress: app.globalData.imgAddress,
        addressInfo: null,
        shareFlag: false,
        posterConfig: posterConfig.jdConfig,
    },
    onPosterSuccess(e) {
        const {
            detail
        } = e;
        wx.previewImage({
            current: detail,
            urls: [detail]
        })
    },
    onPosterFail(err) {
        console.error(err);
    },
    // 商品详情
    detailtap(e) {
        const goodId = e.currentTarget.dataset.goodid;
        wx.navigateTo({
            url: '../detail/detail?goodId=' + goodId,
        });
    },
    // 是否显示分享区域
    shareBtn() {
        this.setData({
            shareFlag: true
        })
    },
    // 关闭分享区域
    cancelShare() {
        this.setData({
            shareFlag: false
        })
    },
    // 切换代理点
    switchDot() {
        wx.navigateTo({
            url: '../switch/switch',
        });
    },
    // 加入购物车
    addCart(e) {
        util.addCart(e)
    },
    // 活动切换
    activeTap(e) {
        let cateId = e.currentTarget.dataset.cateid;
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
    onShow() {
        this.setData({
            addressInfo: wx.getStorageSync("postInfo")
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
                active: result[0].id
            })
            // 加载第一个活动数据
            this.loadActiveList(result[0].id)
        })
    },
    onReady() {},
})