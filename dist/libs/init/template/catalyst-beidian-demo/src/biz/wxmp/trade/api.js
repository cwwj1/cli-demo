import request from 'src/biz/wxmp/common/tool/request';

// let _request = (options) => request({
//     url: 'https://api.beidian.com/wx_gateway/route.html?_airborne_channel=xretail',
//     ...options,
// });

const fetchTradeConfirm = (params) => request({
    type: 'POST',
    method: 'beibei.trade.confirm',
    data: {
        ...params,
    },
});

// const fetchTradeStatus = (tid) => _request({
//     type: 'GET',
//     method: 'beibei.trade.status.get',
//     data: {
//         tid,
//     },
// });

const fetchTradeCreate = (params) => request({
    type: 'POST',
    method: 'beibei.trade.create',
    data: {
        ...params,
    },
});

const fetchTradePay = (params) => request({
    type: 'POST',
    method: 'beibei.h5.trade.pay',
    data: {
        ...params,
    },
});

const fetchCartUpdate = (params) => request({
    type: 'POST',
    method: 'beibei.cart.update',
    data: {
        ...params,
    },
});

// todo add 上一页面调用
const cartAdd = (params = {}) => request({
    type: 'POST',
    method: 'beibei.cart.add',
    data: {
        ...params,
    },
});
// const cartAdd = (params = {}) => request({
//     method: 'beidian.tools.store.contact',
//     data: {
//         ...params,
//     },
// });
export default {
    fetchTradeConfirm,
    // fetchTradeStatus,
    fetchTradeCreate,
    fetchTradePay,
    fetchCartUpdate,
    cartAdd,
};
