import request from 'src/biz/wxmp/common/tool/request';
// 订单列表
const fetchData = (params = {}) => request({
    method: 'beidian.trade.order.get',
    data: {
        ...params,
    },
});


export default {
    fetchData,
};
