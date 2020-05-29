// pages/index.js
const app = getApp();
import util from '../../utils/util'
let api = require('../../utils/request').default;
import Poster from '../../dist/miniprogram_dist/poster/poster';
let postInfo = wx.getStorageSync("postInfo")
const posterConfig = {
    jdConfig: {
        width: 750,
        height: 1100,
        backgroundColor: '#000',
        debug: true,
        pixelRatio: 1,
        blocks: [{
                width: 690,
                height: 500,
                x: 30,
                y: 183,
                borderWidth: 2,
                borderColor: '#fff',
                borderRadius: 20,
            },

        ],
        texts: [{
                x: 113,
                y: 61,
                baseLine: 'middle',
                text: postInfo.user_true_name,
                fontSize: 32,
                color: '#fff',
            },
            {
                x: 30,
                y: 113,
                baseLine: 'top',
                text: postInfo.user_address,
                fontSize: 38,
                color: '#fff',
            },
            {
                x: 360,
                y: 750,
                baseLine: 'top',
                text: '长按识别小程序码',
                fontSize: 38,
                color: '#fff',
            },

        ],
        images: [{
                width: 80,
                height: 80,
                x: 30,
                y: 30,
                borderRadius: 62,
                url: "https://shop.jishanhengrui.com/upload/admin/20200526/9fb20871d438a991a733976deeb73571.jpg",
            },

            {
                width: 200,
                height: 200,
                x: 92,
                y: 700,
                url: "https://shop.jishanhengrui.com/upload/admin/20200526/9fb20871d438a991a733976deeb73571.jpg",
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
        imgUrls: [], //轮播图
    },
    onCreatePoster() {
        // setData配置数据
        this.setData({
            posterConfig: posterConfig.jdConfig
        }, () => {
            Poster.create();
        });
        this.setData({
            showSave: true,
            shareFlag: false
        })
        console.log(Poster)
    },
    onPosterSuccess(e) {
        const {
            detail
        } = e;
        // wx.previewImage({
        //     current: detail,
        //     urls: [detail]
        // })
        this.setData({
            aImg: detail
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
            postInfo: wx.getStorageSync("postInfo")
        })
        this.wheel()
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
    downloadfile() {
        var that = this;
        wx.saveImageToPhotosAlbum({
            filePath: that.data.aImg,
            success(res) {
                wx.showToast("保存至相册成功")
                wx.previewImage({
                    current: that.data.aImg,
                    urls: [that.data.aImg]
                })
            },
            fail() {
                wx.showToast("保存至相册失败")
            }
        })
    },
    saveImg() {
        var that = this;
        wx.getSetting({
            success(res) {
                wx.hideLoading();
                if (!res.authSetting['scope.writePhotosAlbum']) {
                    //请求授权
                    wx.authorize({
                        scope: 'scope.writePhotosAlbum',
                        success() {
                            //获得授权，开始下载
                            that.downloadfile()
                        },
                        fail() {
                            wx.showModal({
                                title: '',
                                content: '保存到系统相册需要授权',
                                confirmText: '授权',
                                success(res) {
                                    if (res.confirm) {
                                        wx.openSetting({
                                            success(res) {
                                                if (res.authSetting['scope.writePhotosAlbum'] === true) {
                                                    that.downloadfile()
                                                }
                                            }
                                        })
                                    }
                                },
                                fail() {
                                    wx.showToast({
                                        title: '打开设置页失败',
                                        icon: 'none',
                                    })
                                }
                            })
                        }
                    })
                } else {
                    //已有授权
                    that.downloadfile()
                }
            },
            fail() {
                wx.hideLoading();
                wx.showToast({
                    title: '获取授权失败',
                    icon: 'none',
                })
            }
        })
    },
    // 轮播图
    wheel() {
        const that = this;
        api.wheel({
            shop_id: app.globalData.shopId
        }).then((result) => {
            that.setData({
                imgUrls: result
            })
        })
    },
})