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
                //接口调用成功
                resolve(res); //根据业务需要resolve接口返回的json的数据
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
//平台服务
let platfromServe = (data) => {
    return new Promise((resolve, reject) => {
        resolve(apiRequest(apiList.platform, 'get', data))
    })
}
// 轮播图
let wheel = (data) => {
    return new Promise((resolve, reject) => {
        resolve(apiRequest(apiList.wheel, 'get', data))
    })
}
// 首页分类
let typeGoods = (data) => {
    return new Promise((resolve, reject) => {
        resolve(apiRequest(apiList.typeGoods, 'get', data))
    })
}
// 全局手机号
let globalPhone = (data) => {
    return new Promise((resolve, reject) => {
        resolve(apiRequest(apiList.globalPhone, 'get', data))
    })
}
// 分类接口
let category = (data) => {
    return new Promise((resolve, reject) => {
        resolve(apiRequest(apiList.category, 'get', data))
    })
}
// 分类详情
let categoryList = (data) => {
    return new Promise((resolve, reject) => {
        resolve(apiRequest(apiList.categoryList, 'get', data))
    })
}
// 商品列表
let goodsList = (data) => {
    return new Promise((resolve, reject) => {
        resolve(apiRequest(apiList.goodsList, 'get', data))
    })
}
// 商品详情
let goodDetail = (data) => {
    return new Promise((resolve, reject) => {
        resolve(apiRequest(apiList.goodDetail, 'get', data))
    })
}
// 商品详情
let homeCategory = (data) => {
    return new Promise((resolve, reject) => {
        resolve(apiRequest(apiList.homeCategory, 'get', data))
    })
}
// 子分类及商品
let subCategories = (data) => {
    return new Promise((resolve, reject) => {
        resolve(apiRequest(apiList.subCategories, 'get', data))
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
// 好物推荐
let goodSub = (data, header) => {
    return new Promise((resolve, reject) => {
        resolve(apiRequest(apiList.goodSub, 'get', data, header))
    })
}
let getOrder = (data, header) => {
    return new Promise((resolve, reject) => {
        resolve(apiRequest(apiList.getOrder, 'post', data, header))
    })
}
let orderRefund = (data, header) => {
    return new Promise((resolve, reject) => {
        resolve(apiRequest(apiList.orderRefund, 'post', data, header))
    })
}
let addressList = (data, header) => {
    return new Promise((resolve, reject) => {
        resolve(apiRequest(apiList.addressList, 'get', data, header))
    })
}
let defaultAddress = (data, header) => {
    return new Promise((resolve, reject) => {
        resolve(apiRequest(apiList.defaultAddress, 'post', data, header))
    })
}
let deleteAddress = (data, header) => {
    return new Promise((resolve, reject) => {
        resolve(apiRequest(apiList.deleteAddress, 'post', data, header))
    })
}
let addAddress = (data, header) => {
    return new Promise((resolve, reject) => {
        resolve(apiRequest(apiList.addAddress, 'post', data, header))
    })
}
let updateAddress = (data, header) => {
    return new Promise((resolve, reject) => {
        resolve(apiRequest(apiList.updateAddress, 'post', data, header))
    })
}
let wxLogin = (data, header) => {
    return new Promise((resolve, reject) => {
        resolve(apiRequest(apiList.wxLogin, 'post', data, header))
    })
}
let personOrderInfo = (data, header) => {
    return new Promise((resolve, reject) => {
        resolve(apiRequest(apiList.personOrderInfo, 'get', data, header))
    })
}
let wxActivity = (data, header) => {
    return new Promise((resolve, reject) => {
        resolve(apiRequest(apiList.wxActivity, 'post', data, header))
    })
}
let goodType = (data, header) => {
    return new Promise((resolve, reject) => {
        resolve(apiRequest(apiList.goodType, 'get', data, header))
    })
}
let goodGoods = (data, header) => {
    return new Promise((resolve, reject) => {
        resolve(apiRequest(apiList.goodGoods, 'get', data, header))
    })
}
let phoneGet = (data, header) => {
    return new Promise((resolve, reject) => {
        resolve(apiRequest(apiList.phoneGet, 'post', data, header))
    })
}
let personList=(data, header) => {
    return new Promise((resolve, reject) => {
        resolve(apiRequest(apiList.personList, 'post', data, header))
    })
}
let wxpay=(data, header) => {
    return new Promise((resolve, reject) => {
        resolve(apiRequest(apiList.wxpay, 'post', data, header))
    })
}
//最后需要将具体调用的函数暴露出，给具体业务调用
export default {
    platfromServe: platfromServe,
    wheel: wheel,
    typeGoods: typeGoods,
    globalPhone: globalPhone,
    category: category,
    categoryList: categoryList,
    goodDetail: goodDetail,
    homeCategory: homeCategory,
    subCategories: subCategories,
    cartAdd: cartAdd,
    cartIndex: cartIndex,
    cartDelete: cartDelete,
    cartNum: cartNum,
    cartAction: cartAction,
    createOrder: createOrder,
    goodSub: goodSub,
    getOrder: getOrder,
    orderRefund,
    orderRefund,
    addressList: addressList,
    defaultAddress: defaultAddress,
    deleteAddress: deleteAddress,
    addAddress: addAddress,
    updateAddress: updateAddress,
    wxLogin: wxLogin,
    personOrderInfo: personOrderInfo,
    wxActivity: wxActivity,
    goodType: goodType,
    goodGoods: goodGoods,
    phoneGet: phoneGet,
    personList:personList,
    wxpay:wxpay,
}