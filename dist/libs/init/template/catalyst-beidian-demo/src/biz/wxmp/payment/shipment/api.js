import request from 'src/biz/wxmp/common/tool/request';


// 获取店铺信息
export const fetchLogisticData = (params) => request({
    type: 'GET',
    method: 'beibei.shipment.get.v2',
    data: {
        ...params,
    },
});
