const data = {
    success: true,
    message: '',
    data: {
        tabList: [
            {
                key: 'all',
                value: '全部',
            }, {
                key: 'waitForPay',
                value: '待付款',
            }, {
                key: 'waitForSend',
                value: '待发货',
            }, {
                key: 'waitForRecevie',
                value: '待收货',
            }, {
                key: 'done',
                value: '已完成',
            },
        ],
        orderList: [
            {
                header: {
                    right: '果果家WOMEN小店',
                    left: '交易完成',
                },
                itemList: [
                    {
                        iid: 1111111,
                        skuId: 3333333,
                        title: '可丽金健肤喷雾150ml男女保湿定妆深层滋润敏感肌补水养护爽肤水',
                        skuDesc: '通用，L号',
                        price: 18800,
                        num: 2,
                    },
                    {
                        iid: 22222222,
                        skuId: 3333333,
                        title: '可丽金健肤喷雾150ml男女保湿定妆深层滋润敏感肌补水养护爽肤水',
                        skuDesc: '通用，L号',
                        price: 18800,
                        num: 2,
                    },
                ],
                summary: {
                    sum: 4,
                    totalPayment: 37600,
                    reduction: 300,
                },
                btnList: [],
            },
        ],
    },
};

export default {
    data,
};
