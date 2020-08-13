import request from 'src/biz/wxmp/common/tool/request';

// 订单详情
const fetchData = (params = {}) => request({
    method: 'beidian.trade.order.get',
    data: {
        ...params,
    },
});

// 联系掌柜
const storeContact = (params = {}) => request({
    method: 'beidian.tools.store.contact',
    data: {
        ...params,
    },
});


export default {
    fetchData,
    storeContact,
};
