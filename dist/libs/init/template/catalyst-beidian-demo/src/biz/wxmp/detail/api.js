import request from 'src/biz/wxmp/common/tool/request';

// 获取页面信息
const getItem = (iid) => request({
    url: `https://sapi.beidian.com/item/detail/v1-${iid}.html`,
});

const getItemStock = (params) => request({
    type: 'GET',
    method: 'beidian.item.stock.get',
    data: {
        ...params,
    },
});

const getItemDetail = (params) => request({
    type: 'GET',
    method: 'beidian.item.detail.dynamic',
    data: {
        ...params,
    },
});

const getToast = (params) => request({
    type: 'GET',
    method: 'beidian.item.toast.get',
    data: {
        ...params,
    },
});

export default {
    getItem,
    getItemStock,
    getItemDetail,
    getToast,
};
