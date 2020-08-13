import request from 'src/biz/wxmp/common/tool/request';

// 订单列表
const fetchData = (params = {}) => request({
    method: 'beidian.tools.store.wxmp.home.get',
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
