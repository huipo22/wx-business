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
//活动区域
let activeArea = (data) => {
    return new Promise((resolve, reject) => {
        resolve(apiRequest(apiList.activeArea, 'post', data))
    })
}
// 活动分类
let activeList = (data) => {
    return new Promise((resolve, reject) => {
        resolve(apiRequest(apiList.activeList, 'get', data))
    })
}
// 商品详情
let detail = (data) => {
    return new Promise((resolve, reject) => {
        resolve(apiRequest(apiList.detail, 'get', data))
    })
}
// 微信登录
let wxLogin = (data, header) => {
    return new Promise((resolve, reject) => {
        resolve(apiRequest(apiList.wxLogin, 'post', data, header))
    })
}
// 添加购物车
let cartAdd = (data, header) => {
    return new Promise((resolve, reject) => {
        resolve(apiRequest(apiList.cartAdd, 'post', data, header))
    })
}
// 查询购物车
let cartIndex = (data, header) => {
    return new Promise((resolve, reject) => {
        resolve(apiRequest(apiList.cartIndex, 'get', data, header))
    })
}
// 购物车删除
let cartDelete = (data, header) => {
    return new Promise((resolve, reject) => {
        resolve(apiRequest(apiList.cartDelete, 'post', data, header))
    })
}
// 购物车数量查询
let cartNum = (data, header) => {
    return new Promise((resolve, reject) => {
        resolve(apiRequest(apiList.cartNum, 'get', data, header))
    })
}
// 购物车加减
let cartAction = (data, header) => {
    return new Promise((resolve, reject) => {
        resolve(apiRequest(apiList.cartAction, 'post', data, header))
    })
}
// 创建订单
let createOrder = (data, header) => {
    return new Promise((resolve, reject) => {
        resolve(apiRequest(apiList.createOrder, 'post', data, header))
    })
}
// 自提点列表
let locationList = (data, header) => {
    return new Promise((resolve, reject) => {
        resolve(apiRequest(apiList.locationList, 'get', data, header))
    })
}
// 支付
let wxpay = (data, header) => {
    return new Promise((resolve, reject) => {
        resolve(apiRequest(apiList.wxpay, 'post', data, header))
    })
}
// 默认自提点
let setDefault=(data, header) => {
    return new Promise((resolve, reject) => {
        resolve(apiRequest(apiList.setDefault, 'post', data, header))
    })
}
//手机号授权
let phoneGet = (data, header) => {
    return new Promise((resolve, reject) => {
        resolve(apiRequest(apiList.phoneGet, 'post', data, header))
    })
}
// 获取订单
let getOrder = (data, header) => {
    return new Promise((resolve, reject) => {
        resolve(apiRequest(apiList.getOrder, 'post', data, header))
    })
}
// 取消订单
let orderRefund = (data, header) => {
    return new Promise((resolve, reject) => {
        resolve(apiRequest(apiList.orderRefund, 'post', data, header))
    })
}
// 个人中心徽章
let personOrderInfo = (data, header) => {
    return new Promise((resolve, reject) => {
        resolve(apiRequest(apiList.personOrderInfo, 'get', data, header))
    })
}
//最后需要将具体调用的函数暴露出，给具体业务调用
export default {
    activeArea: activeArea,
    activeList: activeList,
    detail:detail,
    wxLogin:wxLogin,
    cartAdd: cartAdd,
    cartIndex: cartIndex,
    cartDelete: cartDelete,
    cartNum: cartNum,
    cartAction:cartAction,
    createOrder:createOrder,
    locationList:locationList,
    wxpay:wxpay,
    setDefault:setDefault,
    phoneGet:phoneGet,
    getOrder:getOrder,
    orderRefund:orderRefund,
    personOrderInfo:personOrderInfo
}