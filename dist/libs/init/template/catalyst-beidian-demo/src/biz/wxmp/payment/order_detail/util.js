// 时间格式化
const formatSingleNum = (num) => (num > 9 ? num : `0${num}`);
const formatDate = (timestamp, formatString = 'yyyy.MM.dd hh:mm:ss') => {
    const date = new Date(timestamp);
    const yyyy = date.getFullYear();
    const MM = formatSingleNum(date.getMonth() + 1);
    const dd = formatSingleNum(date.getDate());
    const hh = formatSingleNum(date.getHours());
    const mm = formatSingleNum(date.getMinutes());
    const ss = formatSingleNum(date.getSeconds());
    const dateFormat = {
        yyyy,
        MM,
        dd,
        hh,
        mm,
        ss,
    };
    for (let key in dateFormat) {
        let val = dateFormat[key];
        formatString = formatString.replace(key, val);
    }
    return formatString;
};

const getSize = (link = '') => {
    let size = {
        width: 0,
        height: 28,
    };
    const match = link.match(/(\d+)x(\d+)/);
    if (match && match.length) {
        const originWidth = match[1] || 1;
        const originHeight = match[2] || 1;
        size = {
            width: 28 / originHeight * originWidth,
            height: 28,
        };
    }
    return size;
};

const timeFormat = ((secTime, format) => {
    let date = new Date(secTime * 1000);
    let dateObj = {
        'M+': date.getMonth() + 1,
        'd+': date.getDate(),
        'h+': date.getHours(),
        'm+': date.getMinutes(),
        's+': date.getSeconds(),
        'q+': Math.floor((date.getMonth() + 3) / 3),
        'S+': date.getMilliseconds(),
    };
    // RegExp.$1 代表第一个括号里面的
    if (/(y+)/i.test(format)) {
        format = format.replace(RegExp.$1, (`${date.getFullYear()}`).substr(4 - RegExp.$1.length));
    }
    // 遍历月份，日期，时，分，秒;
    // 数字date[k]<10,在前面加0;
    for (let k in dateObj) {
        if (new RegExp(`(${k})`).test(format)) {
            format = format.replace(RegExp.$1, (dateObj[k] < 10 ? `0${dateObj[k]}` : dateObj[k]));
        }
    }

    return format;
});

const actions = [
    {
        type: 'trade_pay', // 付款
        gmt_payed_end: 1560412193, // 最后付款时间
    },
    {
        type: 'trade_cancel', // 订单取消
    },
    {
        type: 'trade_change_address', // 修改地址-no use
    },
    {
        type: 'trade_go_shipment', // 查看物流
        shipment_id: 591456113, // 物流id
    },
    {
        type: 'trade_confirm', // 确认收货
    },
    {
        type: 'trade_delete', // 删除订单
    },
];
const orderStatus = [
    // 待付款 https://h0.beicdn.com/open201924/0edd10ffd8afd911_450x270.png
    // 待发货 https://h0.beicdn.com/open201924/1599e7737b14bbd4_450x270.png
    // 待收货 https://h0.beicdn.com/open201924/f9bb2500ac88c209_450x270.png
    // 交易完成 https://h0.beicdn.com/open201924/0676ad46e77292bb_450x270.png
    // 交易关闭 https://h0.beicdn.com/open201924/06467670963d3773_450x273.png
    // 交易关闭，已退款
    {
        img: ' https://h0.beicdn.com/open201924/06467670963d3773_450x273.png',
        status: -1,
        desc: '交易关闭',
    },
    {
        img: ' https://h0.beicdn.com/open201924/0edd10ffd8afd911_450x270.png',
        status: 1,
        desc: '等待付款',
    },
    {
        img: 'https://h0.beicdn.com/open201924/1599e7737b14bbd4_450x270.png',
        status: 2,
        desc: '等待掌柜发货',
    },
    {
        img: 'https://h0.beicdn.com/open201924/f9bb2500ac88c209_450x270.png',
        status: 3,
        desc: '掌柜已发货',
    },
    {
        img: 'https://h0.beicdn.com/open201924/0676ad46e77292bb_450x270.png',
        status: 4,
        desc: '交易完成，已签收',
    },
    {
        img: ' https://h0.beicdn.com/open201924/06467670963d3773_450x273.png',
        status: -2,
        desc: '交易关闭，已退款',
    },
];
const getQueryString = (name) => {
    // eslint-disable-next-line prefer-template
    let reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
    let rSearch = window.location.search.substr(1).match(reg);
    return rSearch !== null ? unescape(rSearch[2]) : null;
};
const reasonList = [
    {
        type: 1,
        desc: '买错了',
    },
    {
        type: 2,
        desc: '不想买了',
    },
    {
        type: 3,
        desc: '信息填写错误，重新下单',
    },
    {
        type: 4,
        desc: '重复购买',
    },
    {
        type: 5,
        desc: '支付遇到问题',
    },
    {
        type: 6,
        desc: '其他原因',
    },
];
export default {
    formatDate,
    actions,
    getQueryString,
    orderStatus,
    reasonList,
    timeFormat,
    getSize,
};
