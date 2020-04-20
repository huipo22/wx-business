let host = 'https://hr.jishanhengrui.com' // 设置API接口的ip地址和端口
// let host = 'https://test.jishanhengrui.com' // 设置API接口的ip地址和端口
let apiList = {
    platform: host + "/api/goods/shop/service", //平台服务
    wheel: host + "/api/goods/shop/wheels", //轮播图
    typeGoods: host + "/api/goods/goods/type_goods", //首页分类
    globalPhone: host + "/api/home", //全局手机号
    category: host + "/api/goods/Categories", // 分类接口
    categoryList: host + "/api/goods/Categories/subCategories", //分类详情
    goodsList: host + "/api/goods/goods/index", //商品列表
    goodDetail: host + "/api/goods/goods/goods_detail", //商品详情,
    homeCategory: host + "/api/goods/goods/parent_category", //首页分类
    subCategories: host + "/api/goods/categories/subCategories", //子分类及商品
    cartAdd: host + "/api/goods/shopcar/add", //添加购物车
    cartIndex: host + "/api/goods/shopcar/index", //购物车查询
    cartDelete: host + "/api/goods/shopcar/remove", //购物车删除
    cartNum: host + "/api/goods/shopcar/get_sum", //查询购物车数量
    cartAction: host + "/api/goods/shopcar/action", //购物车加减
    createOrder: host + "/api/goods/order/test_create_order", //创建订单
    goodSub: host + "/api/goods/goods/goods_good", //商品推荐
    getOrder: host + "/api/goods/order/order_status", //获取订单
    orderRefund: host + "/api/goods/order/order_refund", //取消订单
    addressList: host + "/api/goods/address/list_address", //地址列表
    defaultAddress: host + "/api/goods/address/default_address", //默认地址
    deleteAddress: host + "/api/goods/address/delete_address", //删除地址
    addAddress: host + "/api/goods/address/add_address", //新增地址
    updateAddress: host + "/api/goods/address/update_address", //更改地址
    wxLogin: host + "/api/wxapp/public/login", //微信登录后台
    personOrderInfo: host + "/api/home/index/statistical", //个人中心订单徽章
    wxActivity:host+"/api/home/index/send_work",//订阅消息
    goodType:host+"/api/goods/goods/good_type",//活动类型
    goodGoods:host+"/api/goods/goods/good_goods",//活动分类下的商品
    phoneGet:host+"/api/wxapp/public/phone",//手机号授权
    personList:host+"/api/goods/order/post_list",//代收点
    wxpay:host+"/api/goods/order/test_wxapp_pay",//支付
}

module.exports = apiList; //暴露出来