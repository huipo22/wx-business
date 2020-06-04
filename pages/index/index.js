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
        autoplay: false,
        interval: 2000,
        duration: 500,
        activeArea: null, //活动区域分类
        imgAddress: app.globalData.imgAddress,
        shareFlag: false,
        imgUrls: [], //轮播图,
        scrollLeft: 0,
        flag: true,
    },
    // 异步创建海报
    onCreatePoster() {
        console.log(this.data.code)
        // setData配置数据
        this.setData({
            posterConfig: {
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
                }, ],
                texts: [{
                        x: 113,
                        y: 61,
                        baseLine: 'middle',
                        text: String(this.data.postInfo.user_true_name) + '-' + String(this.data.postInfo.user_phone),
                        fontSize: 32,
                        color: '#fff',
                    },
                    {
                        x: 30,
                        y: 113,
                        baseLine: 'top',
                        text: String(this.data.postInfo.user_address),
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
                        url: String(this.data.code),
                    },

                ]

            },
        }, () => {
            Poster.create(true, this);
        });
        this.setData({
            showSave: true,
            shareFlag: false
        })
    },
    // 创建海报成功
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
    // 创建海报失败
    onPosterFail(err) {
        console.error(err + "请重新生成");
        console.log(err)
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
    onShow() {
        if (wx.getStorageSync('postId')) {
            api.setDefault({
                post_id: wx.getStorageSync('postId')
            }, {
                "Token": wx.getStorageSync("token"),
                "Device-Type": "wxapp"
            }).then(result => {
                this.setData({
                    postInfo: result
                })
                wx.setStorageSync('post', result);
            })
        }
        //明天的时间
        var day3 = new Date();
        day3.setTime(day3.getTime() + 24 * 60 * 60 * 1000);
        var s3 = (day3.getMonth() + 1) + "月" + day3.getDate() + "日";
        this.setData({
            tomorrowDay: s3
        })
    },
    onLoad() {
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
            this.createCode()
        }).then(() => {
            // util.queryCart()
        }).then(() => {
            this.activeType()
        })
    },
    onReady() {},
    // 下载图片
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
    // 保存图片
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
    // 关闭海报
    closeHaibao() {
        this.setData({
            showSave: false
        })
    },
    // 创建二维码
    createCode() {
        // 生成团长信息二维码
        api.createCode({
            post_id: wx.getStorageSync('postId')
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