<template>
    <view :class="['page-wrap', isIpx ? 'ipx-page' : '']">
        <!-- 顶部banner轮播 -->
        <view class="banner-wrap">
            <swiper
                class="swiper"
                circular="true"
                @change="changeBanner">
                <swiper-item
                    v-for="(img, index) in detailImgs"
                    :key="index"
                    class="item flex-center">
                    <image
                        class="img"
                        :src="img | format640"
                        lazy-load></image>
                </swiper-item>
            </swiper>
            <view class="indicator-wrap flex-center">
                <text class="text">{{ curBannerIndex }}/{{ detailImgs.length }}</text>
            </view>
            <marquee ref="marquee"></marquee>
        </view>
        <!-- 特卖 -->
        <view :class="['sale-wrap', 'flex-between', !isBegin ? 'pre' : '']">
            <view class="left-wrap">
                <text class="unit">&yen;</text>
                <template v-if="targetSku && targetSku.sku_id">
                    <text class="price">{{ targetSku.price | money }}</text>
                    <text class="o-price">&yen;{{ targetSku.origin_price | money }}</text>
                </template>
                <template v-else>
                    <text class="price">{{ price }}</text>
                    <text class="o-price">&yen;{{ originPrice }}</text>
                </template>
            </view>
            <view
                v-if="!hiddenCountdown && !isOver"
                class="right-wrap">
                <text class="countdown-title">{{ isBegin ? '距离跟团结束仅剩' : '距离跟团开始仅剩' }}</text>
                <count-down
                    :interval="100"
                    :time="countdownTime">
                    <view
                        slot-scope="{data}"
                        class="countdown-wrap flex-center">
                        <template v-if="data.dd !== '00'">
                            <view class="block flex-center">
                                <text class="time">{{ data.dd }}</text>
                            </view>
                            <text class="text">天</text>
                        </template>
                        <view class="block flex-center">
                            <text class="time">{{ data.hh }}</text>
                        </view>
                        <text class="text">:</text>
                        <view class="block flex-center">
                            <text class="time">{{ data.mm }}</text>
                        </view>
                        <text class="text">:</text>
                        <view class="block special flex-center">
                            <text class="time">{{ data.ss }}.{{ data.ms }}</text>
                        </view>
                    </view>
                </count-down>
            </view>
        </view>
        <!-- 商品主标题 -->
        <view class="title-wrap">
            <text class="text line2">{{ title | filterText }}</text>
        </view>
        <sku
            ref="sku"
            :is-show="isSkuShowDialog"
            :btn-text="btnText"
            @getSelectedSku="getSelectedSku"
            @close="closeSku">
            <view
                slot-scope="{skuMap, skuNums, skuDesc, selectedSku}"
                class="outer-sku-wrap">
                <!-- 外部sku选择区域 -->
                <view class="top-wrap flex-between">
                    <text class="title line1">
                        {{ !selectedSku.sku_id ? `请选择 ${skuDesc}` : `已选：${selectedSku.name}` }}
                    </text>
                    <view
                        class="flex"
                        @click="showSku">
                        <text class="sku-num">共{{ skuNums }}种规格</text>
                        <image class="icon-more" src="https://h0.beicdn.com/open202029/1516d93e8c59c8b0_24x24.png"></image>
                    </view>
                </view>
                <view class="bottom-area">
                    <view
                        v-for="(sku, index) in skuMap"
                        :key="index"
                        class="chose-wrap flex">
                        <text class="sku-label">{{ sku.name }}</text>
                        <view
                            v-for="(item, idx) in sku.items"
                            :key="idx"
                            class="sku-name flex"
                            :class="{active: item.status == 1, out: item.status == -1}"
                            @click="choseSku(item)">
                            <text>{{ item.name }}</text>
                        </view>
                    </view>
                </view>
            </view>
        </sku>
        <!-- 图文详情 -->
        <view class="detail-wrap">
            <view class="top-wrap flex-center">
                <view class="decoration-line"></view>
                <text class="text">图文详情</text>
                <view class="decoration-line"></view>
            </view>
            <view class="main-wrap flex-columu-center">
                <block
                    v-for="(item, index) in detail"
                    :key="index">
                    <image
                        v-if="item.type === 'image'"
                        class="img"
                        mode="widthFix"
                        :src="item.image.image | format640"></image>
                </block>
            </view>
        </view>
        <!-- 底部按钮 -->
        <view :class="['footer-wrap', 'flex', isIpx ? 'ipx-footer' : '']">
            <button
                class="btn-block flex-columu-center"
                hover-class="none"
                @click="goHome">
                <image class="icon" src="https://h0.beicdn.com/open202032/a7d46b7cf0afe76f_44x44.png"></image>
                <text class="text">店铺</text>
            </button>
            <button
                class="btn-block flex-columu-center"
                hover-class="none"
                @click="isShowContactPopup = true">
                <image class="icon" src="https://h0.beicdn.com/open202032/2970d2787c69dcb5_44x44.png"></image>
                <text class="text">联系店主</text>
            </button>
            <button
                class="btn-block no-border flex-columu-center"
                hover-class="none"
                open-type="share">
                <image class="icon" src="https://h0.beicdn.com/open202032/a03ce0046f56ba88_44x44.png"></image>
                <text class="text">分享</text>
            </button>
            <view
                :class="['btn-normal', 'flex-center', isBegin ? '' : 'pre', isOver || isSoldOut ? 'over' : '']"
                @click="showSku">
                <text class="text">{{ isBegin ? btnText : `${startTime}开抢` }}</text>
            </view>
        </view>
        <contact-popup
            :show="isShowContactPopup"
            :user-info="userInfo"
            @close="closeContact">
            <button
                class="btn-contact-share flex-center"
                hover-class="none"
                open-type="share">
                <text class="text">分享此商品给店主</text>
            </button>
        </contact-popup>
        <!-- 海报图 -->
        <canvas-paint
            :config="canvasData"
            :width="375"
            :height="300"
            @created="onHandlePosterCreated">
        </canvas-paint>
    </view>
</template>
<script>
import countDown from '../common/components/countDown';
import marquee from '../common/components/marquee';
import sku from '../common/components/sku';
import contactPopup from '../common/components/contactPopup';
import canvasPaint from '../common/components/canvasPaint/index';
import {parse} from '@catalyst/httpurl';
import toast from '@catalyst/toast';
import {convert, format640} from '@catalyst/image-convert';
import {checkLogin, login} from 'src/biz/wxmp/common/tool/login';
import {needSafeArea} from '../common/tool/tool';
import formatPrice from '../common/tool/formatPrice';
import formatCanvasData from '../common/canvasData/item';
import {getItem, getItemStock, getItemDetail, getToast} from './api';
export default {
    filters: {
        // 过滤贝店文案
        filterText(val) {
            return val && val.replace(/贝店/g, '');
        },
        money(val) {
            return formatPrice(val, 'auto');
        },
        format640(val) {
            return format640(val);
        },
    },
    components: {
        countDown,
        marquee,
        sku,
        contactPopup,
        canvasPaint,
    },
    data() {
        return {
            iid: '',
            shopId: '',
            isSoldOut: false,
            curBannerIndex: 1,
            mainImg: '',
            detailImgs: [],
            skuImgs: [],
            title: '',
            price: '',
            originPrice: '',
            detail: [], // 图文详情
            isBegin: true, // 特卖已开始
            isOver: false, // 特卖已结束
            startTime: '',
            countdownTime: 0,
            isIpx: needSafeArea(),
            isSkuShowDialog: false, // 展示sku选择浮层
            skuArea: {},
            skuData: {},
            targetSku: {},
            canvasData: {},
            hiddenCountdown: true, // 是否隐藏倒计时
            isShowContactPopup: false, // 是否展示联系掌柜浮层
            userInfo: {},
            shareImg: '',
            btnText: '',
            status: 1, // 商品状态 1：正常状态 2：未开始 3：已结束 4：商品暂不支持购买 5：站外不可直接下单
        };
    },
    created() {
        let params = parse().query || {};
        this.iid = params.iid;
        this.shopId = params.shopId;
        checkLogin(() => {
            this.initPage();
        });
    },
    onShareAppMessage(event) {
        this.closeContact();
        let path = `/biz/wxmp/detail/index?iid=${this.iid}&shopId=${this.shopId}`;
        return {
            title: this.title,
            path,
            imageUrl: this.shareImg,
        };
    },
    methods: {
        initPage() {
            this.getPageData();
            setTimeout(() => {
                // 延迟访问
                this.marquee();
            }, 2000);
        },
        getPageData() {
            Promise.all([this.getItem(), this.getItemStock()])
                .then((resp) => this.handleData(resp))
                .then(() => this.getItemDetail())
                .then((resp) => {
                    const shopInfo = resp.shop_info || {};
                    this.userInfo = {
                        avatar: convert(shopInfo.avatar, '160x160'),
                        nickName: shopInfo.seller_nick,
                        storeQrcode: shopInfo.wechat_qrcode,
                        wx: shopInfo.wechat_id,
                    };
                    const storeWxmpInfo = resp.store_wxmp_info || {};
                    this.btnText = storeWxmpInfo.btn_text;
                    this.status = storeWxmpInfo.status; // 商品状态 1：正常状态 2：未开始 3：已结束 4：商品暂不支持购买 5：站外不可直接下单
                    this.draw(resp.seller_count_num);
                    this.skuData.offerCode = shopInfo.offer_code || '';
                    this.$refs.sku.handleData(this.skuArea, this.skuData, this.skuImgs);
                })
                .catch(() => {
                    toast('网络错误');
                });
        },
        getItem() {
            return new Promise((resolve, reject) => {
                getItem(this.iid)
                    .then((resp) => {
                        resolve(resp);
                    })
                    .catch((e) => {
                        reject(e);
                    });
            });
        },
        getItemStock() {
            return new Promise((resolve, reject) => {
                getItemStock({
                    iid: this.iid,
                })
                    .then((resp) => {
                        resolve(resp);
                    })
                    .catch((e) => {
                        reject(e);
                    });
            });
        },
        getItemDetail() {
            return new Promise((resolve, reject) => {
                getItemDetail({
                    shop_id: this.shopId,
                    iid: this.iid,
                })
                    .then((resp) => {
                        resolve(resp);
                    })
                    .catch((e) => {
                        reject(e);
                    });
            });
        },
        handleData(resp) {
            const itemData = resp && resp[0]; // 静态接口数据
            const stockData = resp && resp[1]; // 动态接口数据
            Object.assign(itemData, stockData);
            this.title = itemData.title;
            this.price = itemData.region_price;
            this.mainImg = itemData.main_img;
            this.originPrice = formatPrice(itemData.origin_price, 'auto');
            this.detailImgs = itemData.detail_imgs; // banner轮播
            this.detail = itemData.detail_wxmp; // 图文详情
            this.isSoldOut = itemData.has_sold_out; // 是否售罄
            this.handleCountDown(itemData);
            this.handleSku(itemData);
        },
        handlePreData(data) {
            if (!this.isBegin) {
                const begin = data.gmt_begin * 1000;
                const beginTime = new Date(begin);
                const curDate = new Date().getDate();
                const month = beginTime.getMonth() + 1;
                const date = beginTime.getDate();
                const hour = beginTime.getHours();
                if (date === curDate) {
                    this.startTime = `今日${hour}点`;
                } else if ((date - curDate) === 1) {
                    this.startTime = `明日${hour}点`;
                } else {
                    this.startTime = `${month}月${date}日${hour}点`;
                }
            }
        },
        handleCountDown(data) {
            const now = new Date() / 1000;
            this.hiddenCountdown = data.hidden_countdown;
            this.isBegin = data.gmt_begin < now;
            this.isOver = data.gmt_end < now;
            this.countdownTime = this.isBegin ? data.gmt_end : data.gmt_begin;
            this.handlePreData(data);
        },
        handleSku(data) {
            this.skuArea = {
                skuIdMap: data.sku_id_map,
                skuKvMap: data.sku_kv_map,
                skuStockMap: data.sku_stock_map,
                productSizes: data.product_sizes,
                productSizeDetailUrl: data.product_size_detail_url,
            };
            this.skuData = {
                price: data.region_price,
                originPrice: data.origin_price,
                iid: data.iid,
                shopId: this.shopId,
                offerCode: '',
                isSoldOut: this.isSoldOut,
                skuImg: convert(data.main_img, '320x320'),
            };
            this.skuImgs = data.imgs;
        },
        showSku() {
            const cb = () => {
                if (!this.isBegin) {
                    toast(`${this.startTime}开抢哦，敬请期待`);
                    return;
                }
                if (this.isSoldOut) {
                    toast('已售罄');
                    return;
                }
                if (+this.status === 2) {
                    toast(`活动未开始`);
                    return;
                }
                if (+this.status === 3 || this.isOver) {
                    toast(`活动已结束`);
                    return;
                }
                if (+this.status === 4) {
                    toast(`商品暂不支持购买`);
                    return;
                }
                if (+this.status === 5) {
                    // 暂不支持小程序在线支付
                    this.isShowContactPopup = true;
                    return;
                }
                this.isSkuShowDialog = true;
            };
            checkLogin((isLogin) => {
                if (isLogin) {
                    cb();
                } else {
                    // 触发主动授权
                    login(() => {
                        cb();
                    });
                    this.$bus.on('authorized', () => {
                        this.getPageData();
                    });
                }
            });
        },
        marquee() {
            getToast({
                shop_id: this.shopId,
                iid: this.iid,
            })
                .then((resp) => {
                    const {success, sale_info: saleInfo} = resp;
                    if (success && saleInfo) {
                        const {infos} = saleInfo;
                        this.$refs.marquee.init(infos);
                    }
                })
                .catch((e) => {
                    console.warn(e);
                });
        },
        draw(sellerCountNum) {
            this.canvasData = formatCanvasData({
                avatar: convert(this.userInfo.avatar, '160x160'),
                nickName: this.userInfo.nickName,
                viewNum: sellerCountNum,
                img: convert(this.mainImg, '320x320'),
            });
        },
        onHandlePosterCreated({path}) {
            this.shareImg = path;
        },
        changeBanner(event) {
            const {current} = event && event.detail;
            this.curBannerIndex = current + 1;
        },
        choseSku(item) {
            this.$refs.sku.choseSku(item);
            this.showSku();
        },
        getSelectedSku(target) {
            this.targetSku = target;
        },
        closeSku(e) {
            this.isSkuShowDialog = false;
        },
        // 跳转店铺首页
        goHome() {
            wx.navigateTo({
                url: `/biz/wxmp/store_home/index`,
            });
        },
        closeContact() {
            this.isShowContactPopup = false;
        },
    },
};
</script>
<style src="./index.less" lang="less"></style>

