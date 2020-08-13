/**
 * 单品卡片
 * 样式参考 http://h0.beicdn.com/open202033/a57713009f681287_457x493.png
 */
import {format160, format640} from '@catalyst/image-convert';

const CanvasData = {
    // 小程序卡片宽高比 5：4
    getBackgroundCanvasData() {
        return {
            src: 'https://h0.beicdn.com/open202033/762bea9c2b500882_468x414.jpg',
            width: 750 / 2,
            height: 600 / 2,
            x: 0,
            y: 0,
            type: 'image',
        };
    },
    // 头像
    getAvatarCanvasData() {
        return {
            src: format160(this.canvasData.avatar),
            y: 0,
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
            text: this.canvasData.nickName,
            x: 40,
            y: 4,
            color: '#555555',
            size: 22,
        };
    },
    // xx人查看
    getViewNumCanvasData() {
        let viewNum = this.canvasData.viewNum;
        return {
            type: 'text',
            text: `${viewNum}人跟团`,
            x: 750 / 2,
            y: 4,
            color: '#555555',
            size: 22,
            align: 'right',
        };
    },
    getImgCanvasData() {
        return {
            radius: 12 / 2,
            y: 90 / 2,
            x: 0,
            width: 750 / 2,
            height: 370 / 2,
            imgWidth: 750 / 2,
            imgHeight: 750 / 2, // 图片为正方形，为了裁剪传imgWidth/imgHeight(此处宽度填满)
            type: 'box',
            color: '#f2f4f6',
            src: format640(this.canvasData.img),
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
const _img = 'img';

// 常态海报图描述
const normalDescriptions = [
    _background,
    _avatar,
    _nickName,
    _viewNum,
    _img,
];

// 根据传入数据获取描述顺序
const getOrderByData = (data) => {
    let canvasDescriptions;
    canvasDescriptions = normalDescriptions;
    return canvasDescriptions;
};
const getCanvasConfig = (data, ctx) => {
    // test data
    // data = {
    //     avatar: 'https://h0.beicdn.com/open202026/8be283fb0d4165b1_90x90.png',
    //     nickName: '西风几时',
    //     viewNum: '64',
    //     img: 'https://d1.beicdn.com/upload/item/2007/06/22216816370000_800x800.jpg',
    // };
    // end
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
