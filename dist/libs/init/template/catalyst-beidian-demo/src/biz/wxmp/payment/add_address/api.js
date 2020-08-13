import {ajax} from '@catalyst/request';
const url = 'https://api.beidian.com/wx_gateway/route.html';


let request = (options) => new Promise((resolve, reject) => ajax({
    url,
    ...options,
    success(resp) {
        if (resp.success) {
            resolve(resp);
        } else {
            reject(resp.message || '请求失败');
        }
    },
    error(err) {
        reject(err);
    },
}));

const fetchAddress = (params) => new Promise((resolve, reject) => ajax({
    url,
    type: 'GET',
    method: 'beibei.user.address.get',
    data: {
        ...params,
    },
    success(resp) {
        if (resp.addresses) {
            resolve(resp);
        } else {
            reject(resp.message || '请求失败');
        }
    },
    error(err) {
        reject(err);
    },
}));

const getRegionData = (params) => new Promise((resolve, reject) => ajax({
    url,
    type: 'POST',
    method: 'beibei.region.nodes.get',
    data: {
        ...params,
    },
    success(resp) {
        if (resp.success) {
            resolve(resp);
        } else {
            reject(resp.message || '请求失败');
        }
    },
    error(err) {
        reject(err);
    },
}));

const updateAddress = (params) => request({
    type: 'POST',
    method: 'beibei.user.address.update',
    data: {
        ...params,
    },
});

const addAddress = (params) => request({
    type: 'POST',
    method: 'beibei.user.address.add',
    data: {
        ...params,
    },
});

const deleteAddress = (aid) => request({
    type: 'POST',
    method: 'beibei.user.address.del',
    data: {
        aid,
    },
});

module.exports = {
    fetchAddress,
    updateAddress,
    addAddress,
    deleteAddress,
    getRegionData,
};
