/**
 * 分享店铺主页数据
 */

const CanvasData = {
    getBackgroundCanvasData() {
        return {
            src: 'http://h0.beicdn.com/open202032/13c6dcf985559224_468x433.png',
            width: 420,
            height: 358,
            x: 0,
            y: 0,
            type: 'image',
        };
    },
    getAvatarCanvasData() {
        return {
            src: 'http://h0.beicdn.com/open202026/8be283fb0d4165b1_90x90.png',
            y: 8,
            x: 0,
            width: 32,
            height: 32,
            radius: 1,
            type: 'image',
        };
    },
    // 昵称
    getNickNameCanvasData() {
        return {
            type: 'text',
            text: '丽子琴的团',
            x: 40,
            y: 12,
            color: '#666666',
            size: 20,
        };
    },
    getViewNumCanvasData() {
        let {item} = this.canvasData;
        let viewNum = item.viewNum;
        return {
            type: 'text',
            text: `${viewNum}人查看`,
            x: 320,
            y: 16,
            color: '#555555',
            size: 16,
        };
    },
    getImg1CanvasData() {
        let {item} = this.canvasData;
        let imgs = item.imgs;
        let img = imgs[0];
        return {
            src: img,
            width: 420,
            height: 220,
            x: 0,
            y: 50,
            type: 'image',
        };
    },
    setData(data) {
        this.canvasData = data;
    },
    getData(key) {
        let prop = `get${key[0].toUpperCase()}${key.slice(1)}CanvasData`;
        let handle = this[prop];
        return handle && handle.call(this);
    },
};

// 所有绘制笔画的最小元素
const _background = 'background';
const _avatar = 'avatar';
const _nickName = 'nickName';
const _viewNum = 'viewNum';
const _img1 = 'img1';

// 常态海报图描述
const normalDescriptions = [
    _background,
    _avatar,
    _nickName,
    _viewNum,
    _img1,
];

// 根据传入数据获取描述顺序
const getOrderByData = (data) => {
    let canvasDescriptions;
    canvasDescriptions = normalDescriptions;
    return canvasDescriptions;
};
const getCanvasConfig = (data, ctx) => {
    CanvasData.setData(data);
    let order = getOrderByData(data);

    let config = [];
    order.forEach((key) => {
        let obj = CanvasData.getData(key);
        if (obj instanceof Array) {
            config = config.concat(obj);
        } else {
            config.push(obj);
        }
    });
    return config;
};

export default getCanvasConfig;
