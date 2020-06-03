let host = 'https://shop.jishanhengrui.com' // 设置API接口的ip地址和端口
let apiList = {
    activeArea:host+"/api/goods/goods/parent_category",//活动分类
    activeList:host+"/api/goods/Categories/subCategories",//活动列表
    detail:host+"/api/goods/goods/goods_detail",//商品详情,
    wxLogin: host + "/api/wxapp/public/login", //微信登录后台
    cartAdd: host + "/api/goods/shopcar/add", //添加购物车
    cartIndex: host + "/api/goods/shopcar/index", //购物车查询
    cartDelete: host + "/api/goods/shopcar/remove", //购物车删除
    cartNum: host + "/api/goods/shopcar/get_sum", //查询购物车数量
    cartAction: host + "/api/goods/shopcar/action", //购物车加减
    createOrder: host + "/api/goods/order/create_order", //创建订单
    locationList:host+"/api/home/index/get_location",//自提点列表
    wxpay:host+"/api/goods/order/wxapp_pay",//支付
    setDefault:host+"/api/home/index/set_post",//设置默认自提点
    phoneGet:host+"/api/wxapp/public/phone",//手机号授权
    getOrder: host + "/api/goods/order/order_status", //获取订单
    orderRefund: host + "/api/goods/order/order_refund", //取消订单
    personOrderInfo: host + "/api/home/index/statistical", //个人中心订单徽章
    wheel: host + "/api/goods/shop/wheels", //轮播图
    createCode:host+"/api/home/index/create_code",
}

module.exports = apiList; //暴露出来