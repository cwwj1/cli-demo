// 时间格式化
const formatSingleNum = (num) => (num > 9 ? num : `0${num}`);
export const formatDate = (timestamp, formatString = 'yyyy.MM.dd hh:mm:ss') => {
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

export const logisticsStatusDesc = [
    // {
    //     type: -1,
    //     desc: '无物流',
    // },
    {
        type: 0,
        desc: '运输中',
        class: 'lnc',
    },
    {
        type: 1,
        desc: '已揽件',
        class: '',
    },
    // {
    //     type: 2,
    //     desc: '疑难',
    // },
    {
        type: 3,
        desc: '已签收',
        class: 'receive',
    },
    {
        type: 5,
        desc: '派送中',
        class: '',
    },
];
export const dayList = {
    todayStart: new Date(new Date().toLocaleDateString()).getTime(),
    todayEnd: new Date(new Date().toLocaleDateString()).getTime() + (24 * 60 * 60 * 1000) - 1, // 今天
    ye_start: new Date(new Date().toLocaleDateString()).getTime() - (24 * 60 * 60 * 1000), // 昨天
    ye_end: new Date(new Date().toLocaleDateString()).getTime() - 1,
};
