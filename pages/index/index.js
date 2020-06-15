// pages/index.js
const app = getApp();
import util from '../../utils/util'
let api = require('../../utils/request').default;
import Poster from '../../dist/miniprogram_dist/poster/poster';
Page({
    data: {
        background: ['demo-text-1', 'demo-text-2', 'demo-text-3'],
        indicatorDots: true,
        vertical: false,
        autoplay: true,
        interval: 4000,
        duration: 1000,
        activeArea: null, //活动区域分类
        imgAddress: app.globalData.imgAddress,
        shareFlag: false,
        imgUrls: [], //轮播图,
        scrollLeft: 0,
        flag: true,
    },

    // 异步创建海报
    onCreatePoster() {
        // this.createCode()
        console.log(this.data.code + '33333333')
        let codeR = this.data.code
        if (wx.getStorageSync('postId') !== '') {
            // setData配置数据
            this.setData({
                posterConfig: {
                    width: 765,
                    height: 1400,
                    backgroundColor: '#000',
                    debug: false,
                    pixelRatio: 1.5,
                    texts: [{
                            x: 210,
                            y: 1440,
                            baseLine: 'middle',
                            text: String(this.data.postInfo.user_true_name) + '-' + String(this.data.postInfo.user_phone),
                            fontSize: 26,
                            color: '#000',
                            zIndex: 9999999
                        },
                        // {
                        //     x: 0,
                        //     y: 1000,
                        //     baseLine: 'middle',
                        //     text: String(this.data.code),
                        //     fontSize: 20,
                        //     color: '#000',
                        //     zIndex: 9999999
                        // },
                        // {
                        //     x: 80,
                        //     y: 1200,
                        //     baseLine: 'middle',
                        //     text: String(wx.getStorageSync('postId')),
                        //     fontSize: 40,
                        //     color: '#000',
                        //     zIndex: 9999999
                        // },
                        {
                            x: 210,
                            y: 1500,
                            baseLine: 'middle',
                            text: String(this.data.postInfo.user_address),
                            fontSize: 26,
                            color: '#000',
                            zIndex: 9999999
                        },

                    ],
                    images: [
                        // {
                        //     width: 80,
                        //     height: 80,
                        //     x: 120,
                        //     y: 150,
                        //     zIndex: 999,
                        //     borderRadius: 80,
                        //     url: 'https://shop.jishanhengrui.com/upload/' + this.data.postInfo.avatar
                        // },
                        {
                            width: 725,
                            height: 1500,
                            // width: 375,
                            // height: 812,
                            x: 20,
                            y: 100,
                            borderRadius: 62,
                            url: "https://shop.jishanhengrui.com/upload/ioc/haibao.png",
                        },
                        {
                            width: 200,
                            height: 200,
                            // x: 520,
                            x: 480,
                            y: 1372,
                            // borderRadius: 140,
                            url: String(codeR),
                        },

                    ]

                },
            }, () => {
                Poster.create();
            });
            wx.showLoading({
                title: '生成海报中...',
            });
            this.setData({
                shareFlag: false
            })
        } else {
            let that = this
            wx.showToast({
                title: '无团长信息',
                icon: 'none',
                duration: 2000,
                success: function () {
                    that.setData({
                        shareFlag: false
                    })
                }
            })

            return
        }

    },
    // 创建海报成功
    onPosterSuccess(e) {
        const {
            detail
        } = e;
        console.log(e)
        wx.previewImage({
            current: detail,
            urls: [detail],
            complete: function () {
                wx.hideLoading();
            }
        })
    },
    // 创建海报失败
    onPosterFail(err) {
        if (!wx.getStorageSync('postId')) {

        }
        console.error(err);
        console.log(err)
    },
    // 团长招募
    zhaomu() {
        wx.makePhoneCall({
            phoneNumber: '15735639898'
        })
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
            url: '../switch/switch?postInfo=' + JSON.stringify(this.data.postInfo),
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
        let _this = this
        var query = wx.createSelectorQuery(); //创建节点查询器
        query.select('#id' + cateId).boundingClientRect(); //选择id='#item-' + selectedId的节点，获取节点位置信息的查询请求
        query.select('#tab').boundingClientRect(); //获取滑块的位置信息
        //获取滚动位置
        query.select('#tab').scrollOffset(); //获取页面滑动位置的查询请求
        query.exec(function (res) {
            console.log("res:", res)
            _this.setData({
                scrollLeft: res[2].scrollLeft + res[0].left + res[0].width / 2 - res[1].width / 2
            });
        });
    },
    // 活动列表
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
    // 活动分类
    activeType() {
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
    tiaozhuan() {
        util.switchSmall()
    },
    onShow() {
        if (wx.getStorageSync('postId')) {
            api.setDefault({
                post_id: Number(wx.getStorageSync('postId'))
            }, {
                "Token": wx.getStorageSync("token"),
                "Device-Type": "wxapp"
            }).then(result => {
                this.setData({
                    postInfo: result
                })
                wx.setStorageSync('post', result);
                this.createCode(result.id)
            }).then(() => {
                this.getPull()
            }).then(() => {})
        } else {
            this.createCode(wx.getStorageSync('post').id)
        }
        this.getPull()
        //明天的时间
        var day3 = new Date();
        day3.setTime(day3.getTime() + 24 * 60 * 60 * 1000);
        var s3 = (day3.getMonth() + 1) + "月" + day3.getDate() + "日";
        this.setData({
            tomorrowDay: s3,
            postInfo: wx.getStorageSync('post'),
        })
    },
    onLoad(options) {
        console.log(options)
        if (options.scene) {
            var scene = decodeURIComponent(options.scene);
            const postId = scene.split('=')[1]
            // const postId = options.query.post_id
            wx.setStorageSync('postId', Number(postId));
        }
        let me = this;
        const query = wx.createSelectorQuery();
        query.select("#tab").boundingClientRect(function (res) {
            me.data.tabTop = res.bottom + res.height
        }).exec()
        api.wheel({
            shop_id: app.globalData.shopId
        }).then((result) => {
            this.setData({
                imgUrls: result
            })
        }).then(() => {
            // this.createCode()
        }).then(() => {
            this.take()
            // util.queryCart()
        }).then(() => {
            this.activeType()
        }).then(() => {
            this.getPull()
        })
    },
    // 弹幕消息
    getPull() {
        this.setData({
            pullShow: false
        })
        if (wx.getStorageSync('token')) {
            api.getPull({}, {
                Token: wx.getStorageSync('token'),
                "Device-Type": 'wxapp',
            }).then((result) => {
                this.setData({
                    msgList: result,
                    pullShow: true
                })
            })
        }
    },

    // 通告栏
    take() {
        api.globalPhone({
            shop_id: app.globalData.shopId
        }).then((result) => {
            this.setData({
                take: result.take,
            })
        })
    },
    onReady() {},
    // 创建二维码
    createCode(postId) {
        console.log(postId)
        // 生成团长信息二维码
        api.createCode({
            post_id: postId
        }).then(result => {
            this.setData({
                code: this.data.imgAddress + result
            })
        })
    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    },
    // 页面滚动吸顶
    onPageScroll(e) {
        let me = this;
        //tab的吸顶效果
        console.log(e.scrollTop > me.data.tabTop)
        if (e.scrollTop > me.data.tabTop) {
            if (me.data.tabFix) {
                return
            } else {
                me.setData({
                    tabFix: 'Fixed'
                })
            }
        } else {
            me.setData({
                tabFix: ''
            })
        }
    },
})