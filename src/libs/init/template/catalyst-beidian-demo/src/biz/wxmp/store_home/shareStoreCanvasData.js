/**
 * 分享店铺主页数据
 */
const substr = (str, start, end) => {
    let string = Array.from(str).slice(start, end)
        .join('');
    return string;
};
const CanvasData = {
    getBackgroundCanvasData() {
        return {
            src: 'https://h0.beicdn.com/open202032/79d8d37bc07816a0_444x358.png',
            width: 420,
            height: 358,
            x: 0,
            y: 0,
            type: 'image',
        };
    },
    // 商品标题
    getShopTitleCanvasData() {
        let {data} = this.canvasData;
        let title = data.title;
        const text = title && title.length >= 20 ? `${substr(title, 0, 20)}.....` : title;
        return {
            type: 'text',
            text,
            x: 20 / 2,
            y: 24 / 2,
            // align: 'center',
            color: '#666666',
            size: 20,
        };
    },
    getSymbolCanvasData() {
        return {
            type: 'text',
            text: '¥',
            x: 12,
            y: 64,
            color: '#E31436',
            size: 20,
        };
    },
    getPriceCanvasData() {
        let {data} = this.canvasData;
        let price = data.price;
        return {
            type: 'text',
            text: price,
            x: 24,
            y: 54,
            color: '#E31436',
            size: 30,
        };
    },
    // getViewNumCanvasData() {
    //     let {data} = this.canvasData;
    //     let viewNum = data.viewNum;
    //     return {
    //         type: 'text',
    //         text: `${viewNum}人在查看`,
    //         x: 290,
    //         y: 64,
    //         color: '#555555',
    //         size: 16,
    //     };
    // },
    getOriginPriceCanvasData() {
        let {data} = this.canvasData;
        let originPrice = String(data.originPrice);
        let price = String(data.price);
        let len = price.length * 16;
        return {
            type: 'text',
            text: `¥${originPrice}`,
            x: len + 36,
            y: 66,
            color: '#999999',
            size: 16,
        };
    },
    // 删除线
    getOriginPriceLineCanvasData() {
        let {data} = this.canvasData;
        let price = String(data.price);
        let originPrice = String(data.originPrice);
        let len = price.length * 16;
        let width = originPrice.length * 16;
        return {
            type: 'line',
            y: 74,
            x: 36 + len,
            width,
            height: 1,
            color: '#999999',
        };
    },
    getImg1CanvasData() {
        let {data} = this.canvasData;
        let imgs = data.imgs;
        let img = imgs[0];
        return {
            src: img,
            width: 130,
            height: 130,
            x: 12 / 2,
            y: 200 / 2,
            type: 'image',
        };
    },
    getImg2CanvasData() {
        let {data} = this.canvasData;
        let imgs = data.imgs;
        let img = imgs[1];
        return {
            src: img,
            width: 130,
            height: 130,
            x: 142,
            y: 200 / 2,
            type: 'image',
        };
    },
    getImg3CanvasData() {
        let {data} = this.canvasData;
        let imgs = data.imgs;
        let img = imgs[2];
        return {
            src: img,
            width: 130,
            height: 130,
            x: 282,
            y: 200 / 2,
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
const _shopTitle = 'shopTitle';
const _symbol = 'symbol';
const _price = 'price';
// const _viewNum = 'viewNum';
const _originPrice = 'originPrice';
const _originPriceLine = 'originPriceLine'; // 原价删除线
const _img1 = 'img1';
const _img2 = 'img2';
const _img3 = 'img3';

// 常态海报图描述
const normalDescriptions = [
    _background,
    _shopTitle,
    _symbol,
    _price,
    // _viewNum,
    _originPrice,
    _originPriceLine,
    _img1,
    _img2,
    _img3,
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
