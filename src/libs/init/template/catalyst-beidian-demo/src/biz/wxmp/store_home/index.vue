<template>
    <view v-if="requestEnd" class="page-wrap">
        <list
            :finished="!hasMore && storeItemList && storeItemList.length > 0"
            class="page-content flex-col-center"
            @loadmore="loadmore">
            <template slot="header">
                <view class="top-nav">
                    <image
                        src="//h0.beicdn.com/open202032/ed511156665cb176_750x128.png"
                        class="top-nav-bg">
                    </image>
                </view>
            </template>
            <cell>
                <!-- 头像&昵称&分享图标 -->
                <view class="top-block">
                    <view class="user-info flex-center flex-start">
                        <view class="user-info-left">
                            <image
                                :src="userInfo.avatar"
                                class="user-avatar"
                                placeholder="https://h0.beicdn.com/open202016/9fe462c08da7e563_320x320.png">
                            </image>
                            <view class="nick-wrap">
                                <view class="user-nick-wrap">
                                    <text class="user-nick">
                                        {{ userInfo.storeName }}
                                    </text>
                                </view>
                                <view
                                    v-if="userType === 4"
                                    class="user-welcome-desc">
                                    {{ userInfo.storeDesc }}
                                </view>
                            </view>
                        </view>
                        <view class="flex-center">
                            <view
                                v-if="userType === 3"
                                class="contact-shop-wrap flex-col-center"
                                @click="contactClicked">
                                <image
                                    src="//h0.beicdn.com/open202032/33c06e258f246693_44x44.png"
                                    class="share-icon">
                                </image>
                                <text class="share-shop-text">联系我</text>
                            </view>
                            <button
                                open-type="share"
                                data-type="store"
                                class="button share-shop-wrap flex-col-center"
                                @click="shareShop">
                                <image
                                    src="//h0.beicdn.com/open202032/f8b09f3ef5c1ceeb_44x44.png"
                                    class="share-icon">
                                </image>
                                <text class="share-shop-text">分享友团</text>
                            </button>
                        </view>
                    </view>
                    <!-- 公告 -->
                    <view
                        v-if="userType === 3"
                        class="store-introduce">
                        <text class="introduce">{{ userInfo.storeDesc || '暂无公告' }}</text>
                    </view>
                </view>
            </cell>
            <cell v-if="userType === 4" class="content-wrap">
                <!-- 访客&订单&销售 -->
                <view
                    class="income-wrap flex-center">
                    <view class="income-item flex-col-center">
                        <!-- <view class="point"></view> -->
                        <text class="income-item-num">
                            {{ storeMainStatistic.todayVisitNum }}
                        </text>
                        <text class="income-block-desc">今日访客</text>
                    </view>
                    <view class="income-item flex-col-center">
                        <!-- <view class="point"></view> -->
                        <text class="income-item-num">
                            {{ storeMainStatistic.todayOrderNum }}
                        </text>
                        <text class="income-block-desc">今日订单</text>
                    </view>
                    <view class="income-item flex-col-center">
                        <!-- <view class="point"></view> -->
                        <text class="income-item-num">
                            {{ storeMainStatistic.todaySaleNum }}
                        </text>
                        <text class="income-block-desc">今日销售(元)</text>
                    </view>
                </view>
            </cell>
            <!-- 商品列表 -->
            <template v-if="storeItemList && storeItemList.length">
                <cell
                    v-for="(item, index) in storeItemList"
                    :key="index"
                    class="item-wrap">
                    <good-item
                        :item="item"
                        :user-type="userType"
                        :can-buyer="canBuyer"
                        @share="shareItem"
                        @goDetail="goDetail"
                    >
                    </good-item>
                </cell>
            </template>
            <!-- todo 未登录 -->
            <template v-else-if="userType === 1 ">
                <cell>
                    <view class="empty-wrap flex-col-center">
                        <image
                            class="empty-img"
                            src="https://h0.beicdn.com/open202033/b7390bc016e46b0b_200x200.png">
                        </image>
                        <text class="empty-txt">
                            登录后可查看店铺信息
                        </text>
                        <text class="empty-btn" @click="login">
                            登录
                        </text>
                    </view>
                </cell>
            </template>
            <!-- todo 无数据 -->
            <template v-else-if="storeItemList && !storeItemList.length">
                <cell>
                    <view class="empty-wrap flex-col-center">
                        <image
                            class="empty-img"
                            src="https://h0.beicdn.com/open202033/b7390bc016e46b0b_200x200.png">
                        </image>
                        <text class="empty-txt">
                            暂无商品信息
                        </text>
                        <!-- <text class="empty-btn" @click="login">
                            登录
                        </text> -->
                    </view>
                </cell>
            </template>
        </list>
        <!-- 联系掌柜浮层 -->
        <contact-popup
            :show="showContact"
            :user-info="storeContactInfo"
            @close="closeContact">
        </contact-popup>
        <!-- 悬浮按钮 -->
        <left-float-btn
            :show-back-home="showBackHome"
            :back-to-self-store-code="backToSelfStoreCode"
            :btn-list="floatBtnList"
            @goToTarget="goTarget">
        </left-float-btn>
        <!--canvas-->
        <canvas-paint
            :config="canvasData"
            :width="420"
            :height="337"
            @created="onHandleCanvasImgCreated"
        >
        </canvas-paint>
    </view>
</template>

<script>
import GoodItem from './components/GoodItem.vue';
import leftFloatBtn from 'src/biz/wxmp/common/components/leftFloatBtn.vue';
import canvasPaint from 'src/biz/wxmp/common/components/canvasPaint/index.vue';
import contactPopup from 'src/biz/wxmp/common/components/contactPopup.vue';

import shareStoreCanvasData from './shareStoreCanvasData.js';
// import shareItemCanvasData from './shareItemCanvasData.js';
import shareItemCanvasData from '../common/canvasData/item';
import {fetchData, storeContact} from './api.js';

import {getUrlParams} from 'src/biz/wxmp/common/tool/tool';
import formatPrice from 'src/biz/wxmp/common/tool/formatPrice';
import {login, checkLogin} from 'src/biz/wxmp/common/tool/login';

// import {format200} from '@catalyst/image-convert';

export default {
    components: {
        GoodItem,
        leftFloatBtn,
        canvasPaint,
        contactPopup,
    },
    filters: {
        // format200(val) {
        //     return format200(val);
        // },
    },
    data() {
        return {
            userType: 3, // 用户类型[4:卖家（店主） 3:买家 2:登录无店铺信息 1:未登录无店铺信息]
            storeCode: '',
            shopId: '', // 店铺id
            isLogin: false,
            // 顶部用户和店铺信息
            userInfo: {
                storeDesc: '', // 店铺描述
                storeName: '', // 店铺昵称
                avatar: '', // 店铺头像
            },
            page: 1,
            pageSize: 10,
            hasMore: false,
            loading: false,
            requestEnd: false,
            storeMainStatistic: {
                todayVisitNum: 0, // 访客数
                todayOrderNum: 0, // 订单数
                todaySaleNum: 0, // 销售额
            },
            showOrderBtn: false, // 是否透出订单按钮
            canBuyer: true, // 是否可以购买，true:跟团买，false:我想买（点击出现联系弹窗）
            showBackHome: false, // 是否透出返回我的店按钮
            backToSelfStoreCode: '', // showBackHome true时，返回自身的StoreCode
            storeItemList: [],
            showContact: false,
            storeQrcode: 'https://h0.beicdn.com/open202029/d1eb505027ef0314_260x260.png',
            shareStoreImg: '',
            shareItemImg: '',
            canvasType: 'store',
            canvasData: [],
            storeContactInfo: {},
        };
    },
    computed: {
        floatBtnList() {
            let array = [];
            if (this.showOrderBtn) {
                array = [
                    {
                        icon: 'https://h0.beicdn.com/open202027/62b5ba667f4fe2f7_32x32.png', text: '订单', target: '/biz/wxmp/payment/my_orders/index',
                    },
                ];
            }
            return array;
        },
    },
    onLoad(params) {
        if (params.q) {
            // 普通二维码扫码进
            const urlParams = getUrlParams(decodeURIComponent(params.q));
            this.storeCode = urlParams.storeCode;
        } else {
            this.storeCode = params.storeCode || wx.getStorageSync('storeCode');
        }
        // 小程序二维码
        if (!this.agentId && this.$mp.options && this.$mp.options.scene) {
            let scene = decodeURIComponent(this.$mp.options.scene); // 'storeCode=XXXX'
            this.storeCode = scene.replace('storeCode=', '');
        }
        wx.setStorageSync('storeCode', this.storeCode);
        // 首页静默登录
        checkLogin((isLogin) => {
            this.isLogin = isLogin;
            this.getData();
        });
    },
    mounted() {
        // eslint-disable-next-line no-console
        // this.init();
    },
    onShareAppMessage(options) {
        let type = '';
        let item = '';
        if (options && options.target && options.target.dataset) {
            type = options.target.dataset.type;
            item =  options.target.dataset.item;
        }
        if (type === 'item') {
            // 通过Promise解决，图片shareItemImg异步生成，onShareAppMessage同步方法
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    resolve({
                        title: item.title,
                        path: `/biz/wxmp/detail/index?iid=${item.iid}&storeCode=${this.storeCode}&shopId=${this.shopId}`,
                        imageUrl: this.shareItemImg,
                    });
                }, 1000);
            });
        } else if (type === 'store') {
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    let {shareStoreImg} =  wx.getStorageSync('shareStoreImg');
                    this.shareStoreImg = shareStoreImg;
                    resolve({
                        title: '给你推荐一个性价比超高的团购~',
                        path: `biz/wxmp/store_home/index?storeCode=${this.storeCode}`,
                        imageUrl: this.shareStoreImg,
                    });
                }, 1000);
            });
        }
        // 默认分享店铺
        return {
            title: '给你推荐一个性价比超高的团购~',
            imageUrl: this.shareStoreImg || 'https://h0.beicdn.com/open202033/bcd707622e28a33e_444x358.png',
            path: `biz/wxmp/store_home/index?storeCode=${this.storeCode}`,
        };
    },
    destroyed() {},
    methods: {
        getData() {
            this.loading = true;
            fetchData({
                page: this.page,
                pageSize: this.pageSize,
                storeCode: this.storeCode || '018mgRhiO9eAEYqWrQ2VLsfWBt9',
                // testUid: 112408993,
                // testUid: 123456,
            })
                .then((res) => {
                    this.loading = false;
                    this.requestEnd = true;
                    if (res.success) {
                        let data = res.data;
                        this.userType = data.userType;
                        // todo
                        // this.userType = 1;
                        this.userInfo = data.userInfo;
                        this.canBuyer = data.canBuyer;
                        this.hasMore = data.hasMore;
                        this.page = data.page;
                        this.pageSize = data.pageSize;
                        this.shopId = data.shopId;
                        wx.setStorageSync('storeCode', this.storeCode);
                        wx.setStorageSync('shopId', this.shopId);
                        this.showBackHome = data.showBackHome;
                        this.backToSelfStoreCode = data.backToSelfStoreCode;
                        this.showOrderBtn = data.showOrderBtn;
                        // todo
                        // this.showOrderBtn = true;
                        // data.storeItemList = [];
                        this.storeItemList = this.storeItemList.concat(this.formatList(data.storeItemList || []));
                        // 初始化小程序分享卡片
                        this.initShareCard();
                    }
                })
                .catch(() => {
                    this.loading = false;
                    this.requestEnd = true;
                    //
                });
        },
        formatList(list) {
            if (!list.length) {
                return [];
            }
            let temp = [];
            list.forEach((item, idx) => {
                item.imgs.forEach((img) => {
                    img = `${img}!320x320.jpg`;
                });
                item.originPrice = formatPrice(item.originPrice);
                item.price = formatPrice(item.price);
                temp.push(item);
            });
            return temp;
        },
        contactClicked() {
            storeContact({
                shopId: this.shopId,
            })
                .then((res) => {
                    if (res.success) {
                        this.storeContactInfo = res.data;
                        this.storeContactInfo.nickName = res.data.mainDesc;
                        this.storeContactInfo.storeQrcode = res.data.qrcodeImg;
                        this.storeContactInfo.wx = res.data.wxID;
                        this.showContact = true;
                    }
                })
                .catch(() => {
                    //
                });
        },
        closeContact() {
            this.showContact = false;
        },
        previewImage(urls) {
            wx.previewImage({
                current: urls[0],
                urls,
            });
        },
        copyOrderId(data) {
            wx.setClipboardData({
                data,
            });
        },
        shareShop() {
            if (!this.shareStoreImg) {
                this.initShareCard();
            }
        },
        shareItem(item) {
            this.canvasType = 'item';
            // 海报图数据
            let canvasData = {
                avatar: this.userInfo.avatar,
                nickName: this.userInfo.storeName,
                viewNum: item.viewNum || '200',
                img: item.imgs[0],
            };
            this.canvasData = shareItemCanvasData(canvasData);
            console.log('this.canvasData', this.canvasData);
        },
        goDetail(item) {
            wx.navigateTo({
                url: `/biz/wxmp/detail/index?iid=${item.iid}&storeCode=${this.storeCode}&shopId=${this.shopId}`,
            });
        },
        // 登录
        login() {
            // 触发主动授权
            login(() => {
                // todo
            });
            this.$bus.on('authorized', () => {
                // todo
            });
        },
        // 悬浮按钮
        goTarget(target, text) {
            if (text) {
                // 打点
            }
            // 已有登录态
            if (this.isLogin) {
                wx.navigateTo({
                    url: target,
                });
            } else {
                // 触发主动授权
                login(() => {
                    wx.navigateTo({
                        url: target,
                    });
                });
                this.$bus.on('authorized', () => {
                    wx.navigateTo({
                        url: target,
                    });
                });
            }
        },
        // 初始化小程序分享卡片
        initShareCard() {
            this.canvasType = 'store';
            // 海报图数据
            let canvasData = {
                data: this.storeItemList && this.storeItemList[0],
            };
            this.canvasData = shareStoreCanvasData(canvasData);
        },
        /**
         * canvas绘图
         */
        onHandleCanvasImgCreated({path}) {
            if (this.canvasType === 'item') {
                this.shareItemImg = path;
            } else {
                this.shareStoreImg = path;
                // 是否有必要存？
                wx.setStorageSync('shareStoreImg', {
                    shareStoreImg: this.shareStoreImg,
                });
            }
        },
        loadmore() {
            console.log('loadmore');
            if (this.hasMore && !this.loading) {
                this.page += 1;
                this.getData();
            }
        },
    },
};
</script>
<style src="./index.less" lang="less"></style>

