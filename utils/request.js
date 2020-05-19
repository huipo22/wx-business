import apiList from './apiList' //  引入apiList.js文件

const apiRequest = (url, method, data, header) => { //接收所需要的参数，如果不够还可以自己自定义参数
    let promise = new Promise(function (resolve, reject) {
        wx.request({
            url: url,
            data: data ? data : null,
            method: method,
            header: header ? header : {
                'content-type': 'application/x-www-form-urlencoded'
            },
            success: function (res) {
                if (res.statusCode == 500) {
                    wx.showToast({
                        title: '数据错误',
                        icon: "none",
                        duration: 1200,
                    })
                } else {
                    switch (res.data.code) {
                        case 1:
                            //接口调用成功
                            resolve(res.data.data); //根据业务需要resolve接口返回的json的数据
                            break;
                        case 10001:
                            wx.showModal({
                                title: '提示',
                                content: '您未登录,是否登录',
                                success(res) {
                                    if (res.confirm) {
                                        console.log('用户点击确定')
                                        wx.navigateTo({
                                            url: '../login/login'
                                        });
                                    } else if (res.cancel) {
                                        console.log('用户点击取消')
                                    }
                                }
                            })

                            break;
                        default:
                            wx.showToast({
                                title: res.data.msg,
                                icon: "none",
                                duration: 1200
                            })
                            break;
                    }
                }

            },
            fail: function (res) {
                console.log(res)
                // fail调用接口失败
                reject({
                    errormsg: '网络错误,请稍后重试',
                    code: -1
                });
            }
        })
    });
    return promise; //注意，这里返回的是promise对象
}

//最后需要将具体调用的函数暴露出，给具体业务调用
export default {
   
}