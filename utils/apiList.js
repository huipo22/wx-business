let host = 'https://shop.jishanhengrui.com' // 设置API接口的ip地址和端口
let apiList = {
    activeArea:host+"/api/goods/goods/parent_category",//活动分类
    activeList:host+"/api/goods/Categories/subCategories",//活动列表
    detail:host+"/api/goods/goods/goods_detail",//商品详情
}

module.exports = apiList; //暴露出来