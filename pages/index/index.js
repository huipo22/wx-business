// pages/index.js
Page({
    data: {
        background: ['demo-text-1', 'demo-text-2', 'demo-text-3'],
        indicatorDots: true,
        vertical: false,
        autoplay: false,
        interval: 2000,
        duration: 500
    },
    detailtap(){
        wx.navigateTo({
            url: '../detail/detail',
        });
    }
})