<template>
    <view class="page-wrap">
        <!-- <top-nav
            class="top-nav-ref"
            :option="titleOption">
        </top-nav> -->
        <top-nav
            class="top-nav-ref"
            :title="'订单详情'">
        </top-nav>
        <!-- 顶部提示 -->
        <!-- <view v-if="tradeOrdeDetailTradeWarning" class="order-notice">
            {{ tradeOrdeDetailTradeWarning }}
        </view> -->
        <!-- 订单状态 -->
        <view :class="['status', status.className]">
            <text class="text">{{ status.text }}</text>
        </view>
        <!-- 物流信息 -->
        <view v-if="shipment && shipment.lastDetail" class="shipment" @click="lookShipDetailInfo">
            <image class="logo" src="http://h0.beicdn.com/open202033/2d4772d4d327f4e3_48x48.png"></image>
            <view>
                <view class="last-detail">{{ shipment.lastDetail }}</view>
                <view class="time">{{ shipment.time }}</view>
            </view>
            <image class="arrow" src="http://h0.beicdn.com/open202030/a76dd0846e46b78d_30x30.png"></image>
        </view>
        <!-- 收货地址 -->
        <view v-if="receiver && receiver.show" class="receiver flex-center">
            <image class="logo" src="http://h0.beicdn.com/open202033/6debeb4813e5153f_48x48.png"></image>
            <view>
                <view class="r1 flex-center">
                    <text class="name">{{ receiver.name }}</text>
                    <text class="phone">{{ receiver.phone }}</text>
                </view>
                <view class="address">{{ receiver.address }}</view>
            </view>
        </view>
        <!--商品区块-->
        <view class="goods">
            <view class="title">
                <text class="text" :style="{color: goods.color ? goods.color : ''}">
                    {{ goods.brand_info }}
                </text>
            </view>
            <!-- 商品信息 -->
            <view class="items">
                <view
                    v-for="(item, index) in goods.items"
                    :key="index"
                    :class="['item']">
                    <view class="flex-center">
                        <view class="img-wrapper">
                            <image class="item-image" :src="item.img"></image>
                        </view>
                        <view class="items-content">
                            <view class="item-title">
                                {{ item.title }}
                            </view>
                            <view class="sku flex-center">
                                <text class="sku-desc">
                                    {{ item.sku }}
                                </text>
                                <text class="sku-num">
                                    x{{ item.num }}
                                </text>
                            </view>
                            <view class="money"><text class="price">¥{{ item.price }}</text></view>
                        </view>
                    </view>
                </view>
            </view>
            <!-- 金额明细 -->
            <view class="expenses">
                <view v-for="(item, index) in goods.expenses" :key="index" class="row">
                    <view class="expense-left">
                        <image
                            v-if="item.leftIcon"
                            :style="{width: item.iconSize.width +'rpx', height: item.iconSize.height +'rpx'}"
                            :src="item.leftIcon"
                            class="expense-left-icon">
                        </image>
                        <text class="key">{{ item.key }}</text>
                    </view>
                    <text class="value">{{ item.value }}</text>
                </view>
            </view>
        </view>
        <!-- 店铺主页 & 联系店主 -->
        <view class="action-wrap flex-center">
            <view class="action-shop action-item flex-center" @click="goStore">
                <image src="http://h0.beicdn.com/open202033/a9a80b0b23a4aa0a_32x32.png" class="icon"></image>
                <text class="desc">店铺主页</text>
            </view>
            <view class="action-line"></view>
            <view class="action-contact action-item flex-center" @click="contactClicked">
                <image src="http://h0.beicdn.com/open202033/7158cc274a06098c_32x32.png" class="icon"></image>
                <text class="desc">联系店主</text>
            </view>
        </view>
        <!--订单信息-->
        <view class="order">
            <view class="row flex-center">
                订单编号：<text class="value">{{ oid }}</text>
                <text class="copy">复制</text>
            </view>
            <view class="row flex-center">下单时间：<text class="value">{{ createTime }}</text></view>
            <view v-if="payTime" class="row flex-center">支付时间：<text class="value">{{ payTime }}</text></view>
        </view>

        <!-- 联系掌柜浮层 -->
        <contact-popup
            :show="showContact"
            :user-info="storeContactInfo"
            @close="closeContact">
        </contact-popup>
    </view>
</template>

<style src="./index.less" lang="less"></style>

<script>
// import mock from './mock';
import {fetchData, storeContact} from './api';
import {timeFormat, getSize} from './util';

import topNav from 'src/biz/wxmp/common/components/topNav.vue';
import contactPopup from 'src/biz/wxmp/common/components/contactPopup.vue';
import {login, checkLogin} from 'src/biz/wxmp/common/tool/login';

import toast from '@catalyst/toast';
import statistics from '@catalyst/statistics';


let formatForTime = 'yyyy-MM-dd hh:mm';

export default {
    filters: {
        // formatImg160(val) {
        //     return convert(val, '160x160');
        // },
        money(val) {
            if (!val) {
                return 0;
            }
            return (val / 100).toFixed(2);
        },
    },
    components: {
        topNav,
        contactPopup,
    },
    data() {
        return {
            oid: '',
            orderIndex: '', // 订单列表页传递过来的序号
            tradeOrdeDetailTradeWarning: '',
            status: {},
            shipment: {},
            receiver: {},
            goods: {
                items: [],
                expenses: [],
                brand_info: {},
                color: '',
            },
            createTime: '',
            payTime: '',
            storeContactInfo: {},
            showContact: false,
            storeCode: '',
            shopId: '',
            titleOption: {
                title: '订单详情',
            },
        };
    },
    onLoad(params) {
        this.oid = params.oid || '659056906384290660';
        this.orderIndex = params.index || '';
        this.storeCode = params.storeCode || wx.getStorageSync('storeCode') || '';
        this.shopId = params.shopId || wx.getStorageSync('shopId') || '';

        checkLogin((isLogin) => {
            if (isLogin) {
                this.getOrderData();
            } else {
                login(() => {
                    this.getOrderData();
                });
            }
        });
        this.$bus.on('authorized', () => {
            this.getOrderData();
        });
    },
    // 小程序转发事件
    onShareAppMessage(options) {
        let shareInfo = {};
        if (options.from === 'button') {
            // 来自页面内转发按钮
            shareInfo.title = '宝贝已发货，请您确认收货';
            shareInfo.imageUrl = this.newItemCell[0].goodsInfo[0].image;
        }
        return {
            title: shareInfo.title,
            imageUrl: shareInfo.imageUrl,
        };
    },
    methods: {
        getOrderData(type) {
            fetchData({
                oid: this.oid || 659056906384290660,
            }).then((resp) => {
                if (!resp.oid) {
                    toast('获取订单信息异常');
                    return;
                }
                this.formatData(resp);
            })
                .catch((e) => {
                    console.warn(e);
                });

            // let data = mock;
            // console.log('data', data);
            // this.formatData(data);
        },
        // 数据处理
        // eslint-disable-next-line complexity
        formatData(data, type) {
            this.tradeOrdeDetailTradeWarning = data.trade_order_detail_trade_warning;
            this.goods = {
                items: [],
                expenses: [],
                brand_info: data.brand_info,
                color: data.presell_text_color || 0,
            };
            // switch (data.status) {
            //     case 'WAIT_FOR_PAY':
            //         this.status.className = 'waitForPay';
            //         this.status.needTimer = true;
            //         break;
            //     case 'WAIT_FOR_SHIPPING':
            //         this.status.className = 'waitForShipping';
            //         break;
            //     case 'WAIT_FOR_GROUP':
            //         this.status.className = 'waitForGroup';
            //         break;
            //     case 'WAIT_FOR_RECEIVING':
            //         this.status.className = 'waitForReceiving';
            //         break;
            //     case 'DONE':
            //         if (!data.is_rate) {
            //             this.status.className = 'signed';
            //         } else {
            //             this.status.className = 'done';
            //         }
            //         break;
            //     case 'CLOSE':
            //         this.status.className = 'close';
            //         break;
            //     default:
            //         this.status.className = 'done';
            // }
            this.status.text = data.status_text;
            if (data.shipments && data.shipments.length && data.shipments[0].last_detail) {
                this.shipment = {
                    // href: `/pages/trade/shipment/index?order_id=${data.oid}&shipment_id=${data.shipments[0].shipment_id}&shop_id=${this.data.shopId}`,
                    lastDetail: data.shipments[0].last_detail.desc,
                    time: timeFormat(data.shipments[0].last_detail.create, formatForTime),
                };
            }
            // if (data.shipments && data.shipments.length) {
            //     this.shipments = [];
            //     this.shipments.forEach((ele, index) => {
            //         this.shipments[index] = ele.shipment_id;
            //     });
            // }
            this.receiver.name = data.receiver_name;
            this.receiver.phone = data.receiver_phone;
            this.receiver.address = data.receiver_address;
            this.receiver.show = data.receiver_name && data.receiver_phone && data.receiver_address;
            this.goods.title = data.seller_profile.nick;
            (data.order_items || []).forEach((em, index) => {
                let rtn = {
                    buttons: [],
                };
                this.goods.items.push(rtn);
                rtn.img = em.img;
                rtn.title = em.title;
                rtn.title_icons = em.title_icons;
                rtn.sku = em.sku_properties;
                rtn.price = (em.price / 100).toFixed(2);
                rtn.num = em.num;
                rtn.can_apply_aftersale = em.can_apply_aftersale;
                rtn.show_aftersale = em.show_aftersale;
                rtn.aftersale = em.aftersale;
                if (rtn.can_apply_aftersale) {
                    // 可售后
                    rtn.show_after_type = 2;
                } else if (rtn.show_aftersale) {
                    // 售后详情
                    rtn.show_after_type = 1;
                } else {
                    // 不显示
                    rtn.show_after_type = 0;
                }
                rtn.oiid = em.oiid;
                if (em.expensive_button_text) {
                    rtn.expensive = 1;
                    rtn.expensiveText = em.expensive_button_text;
                }
                rtn.supply = em.supply;
            });
            (data.expenses || []).forEach((em, index) => {
                let title = '';
                if (em.key !== 'reduction_promotion') {
                    title = typeof em.title === 'undefined' ? em.key : em.title;
                }
                this.goods.expenses.push({
                    leftIcon: em.left_icon,
                    iconSize: getSize(em.left_icon),
                    key: title,
                    value: em.value,
                });
            });
            this.oid = data.oid;
            this.createTime = timeFormat(data.gmt_create, formatForTime);
            this.payTime = data.gmt_payed && data.gmt_payed > 0 ? timeFormat(data.gmt_payed, formatForTime) : false;
        },
        lookShipDetailInfo() {
            // const shipmentId = this.lastShipmentInfo.id ? this.lastShipmentInfo.id : '';
            // const oid = this.oid;
            // navigator.push(`/biz/wxmp/payment/shipment/index?oid=${encodeURIComponent(oid)}&shipmentId=${encodeURIComponent(shipmentId)}`);
        },
        goStore() {
            wx.navigateTo({
                url: `/biz/wxmp/store_home/index?storeCode=${this.storeCode}`,
            });
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
        copyOrderId(oid) {
            this.sendLog('click', '分店_订单详情_复制订单号');
            wx.setClipboardData({
                data: oid,
                success() {
                    wx.getClipboardData({
                        success(res) {
                            console.log(res.data);
                        },
                    });
                },
            });
        },
        closeQrDialog() {
            this.isShowQrCode = false;
        },
        sendLog(et, name) {
            statistics.sendLog({
                et,
                json: {
                    block_name: name,
                    uid_view: this.uidView, // 用户视角，参数值： 店长、买家
                    agent_code: this.fatherUidView, // 掌柜UID视角，参数值： 店长、贝仓VIP
                },
            });
        },
    },
};
</script>
