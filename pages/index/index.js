// pages/index.js
Page({
    data: {
        background: ['demo-text-1', 'demo-text-2', 'demo-text-3'],
        indicatorDots: true,
        vertical: false,
        autoplay: false,
        interval: 2000,
        duration: 500,
        step:true,//步进器状态切换
    },
    // 商品详情
    detailtap(){
        wx.navigateTo({
            url: '../detail/detail',
        });
    },
    // 切换代理点
    switchDot(){
        wx.navigateTo({
            url: '../switch/switch',
        });
    }
})