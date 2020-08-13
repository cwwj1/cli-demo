<template>
    <view class="page-wrap">
        <top-nav
            :title="titleOption.title">
        </top-nav>
        <view id="wrapper" class="wrapper">
            <!-- 地址 -->
            <view class="address-box" @click="goAddress">
                <image
                    class="location-icon"
                    src="http://h0.beicdn.com/open202032/26c0f7554149ad08_64x64.png"></image>
                <view v-if="adressInfo && adressInfo.name" class="location-body">
                    <view class="address-main">
                        <text class="name">{{ adressInfo.name }}</text>
                        <text class="tel">{{ adressInfo.mobile }}</text>
                    </view>
                    <text class="address">
                        {{ adressInfo.province_text }}
                        {{ adressInfo.city_text }}
                        {{ adressInfo.area_text }}
                        {{ adressInfo.address }}
                    </text>
                </view>
                <view v-else class="no-address">您当前还没有地址，赶快添加吧！</view>
                <image
                    class="arrow-icon"
                    src="http://h0.beicdn.com/open202033/c404d7512a3fbe29_24x24.png"></image>
            </view>
            <!-- 优惠 -->
            <view v-if="payVipDiscount" class="section-wrap">
                <view class="vip-discount" :style="'background-image: url(' + payVipDiscount.bg_img + ')'">
                    <view class="align-center">
                        <image class="vip-left-icon" :src="payVipDiscount.left_icon"></image>
                        <view class="vip-title">
                            {{ payVipDiscount.title }}
                        </view>
                        <view class="question-img-container" @click="showVipTips">
                            <image class="question-img" src="http://h0.beicdn.com/open201948/5e7c890cc3b906b8_24x24.png"></image>
                        </view>
                    </view>
                    <view class="vip-desc">
                        <text>{{ payVipDiscount.desc }}</text>
                        <text v-if="payVipDiscount.tip_text" class="discount-desc">{{ payVipDiscount.tip_text }}</text>
                    </view>
                </view>
            </view>
            <!-- 商品信息 -->
            <view class="order-box">
                <view
                    v-for="ci in resp.cart_items"
                    :key="ci.event_id"
                    class="order-box-bd"
                >
                    <view
                        v-for="item in ci.items"
                        :key="item.img"
                        class="row order-itemlist"
                    >
                        <view class="order-item">
                            <image class="order-img" :src="item.img"></image>
                            <view class="order-info">
                                <view class="order-info-title">
                                    {{ item.title }}
                                </view>
                                <view class="order-info-sku_props">
                                    {{ item.sku_props }}
                                    <view class="order-buy-nums">
                                        <text class="order-nums-text">
                                            x{{ item.num }}
                                        </text>
                                    </view>
                                </view>
                                <view class="order-item-price">
                                    <text>¥</text>
                                    <text class="order-item-priceInt">{{ item.priceInt }}</text>
                                    <text class="order-item-priceDec">{{ item.priceDec }}</text>
                                </view>
                            </view>
                        </view>
                        <view class="order-num-wrap">
                            <view class="order-num-title">购买数量：</view>
                            <view
                                class="order-num-left"
                                :class="item.leftBtn"
                                :data-ban="item.leftBtn"
                                @click="reduceNums"
                            >
                                -
                            </view>
                            <view class="order-num-text" @click="changeNum(item)">{{ item.num }}</view>
                            <view class="order-num-right" @click="plusNums">+</view>
                        </view>
                    </view>
                </view>
            </view>
            <!-- 金额信息 -->
            <view v-if="resp.expenses_v2" class="order-box-ft">
                <view>
                    <view
                        v-for="(expense) in resp.expenses_v2"
                        :key="expense.key"
                        class="order-mj"
                    >
                        <view class="expense-left-block">
                            <text v-if="!expense.highlighted" :class="['order-text',hasDiscount ? 'order-text-gold' : '']">
                                {{ expense.key }}
                                <i v-if="hasOverseaFee"></i>
                            </text>
                        </view>
                        <text v-if="!expense.highlighted" class="order-val">{{ expense.value }}</text>
                        <view v-else class="order-val-red">
                            {{ expense.key }}
                            <text class="order-val-bold">{{ expense.value }}</text>
                        </view>
                    </view>
                </view>
            </view>
            <!-- 底部信息 -->
            <view class="gopay-bar">
                <view class="gopay">
                    <view class="pay-info">
                        <view class="pay-num">{{ resp.total_payment_text }}</view>
                        <view class="pay-tips">{{ resp.paybar_promotion_text }}</view>
                    </view>
                    <a href="javascript:;" class="gopay-new-btn" bindtap="goPay">支付订单</a>
                </view>
            </view>
        </view>
        <!-- 优惠信息弹窗 -->
        <page-mask v-if="vipTipsShow">
            <view class="vip-tips-outter">
                <view class="vip-tips-container">
                    <view class="vip-modal-header">
                        <text class="vip-modal-title">{{ payVipDiscount.detail.title }}</text>
                    </view>
                    <view class="vip-modal-content">
                        <view
                            v-for="(item) in payVipDiscount.detail.detail"
                            :key="item"
                            class="vip-modal-item"
                        >
                            {{ item }}
                        </view>
                    </view>
                    <button class="vip-close-btn" @click="closeVipModal">确定</button>
                </view>
            </view>
        </page-mask>
        <!-- 修改数量弹窗 -->
        <page-mask v-if="changeNumShow">
            <view class="change-num-wrap">
                <view class="change-num">
                    <view class="change-num-title">修改购买数量</view>
                    <view class="change-num-inputnum">
                        <view class="inputnum-reduce-btn">
                            <image
                                src="//h0.beicdn.com/open201942/0769a3f8f08546ab_25x25.png"
                                class="inputnum-img"
                                @click="reduceNums('mask')"></image>
                        </view>
                        <input class="inputnum-input" type="number" :value="tempNum" />
                        <view class="inputnum-add-btn">
                            <image
                                src="//h0.beicdn.com/open201942/6ca0197c49ce56fb_24x24.png"
                                class="inputnum-img"
                                @click="plusNums('mask')"></image>
                        </view>
                    </view>
                    <view class="btn-groups">
                        <view class="btn-item cancel-btn" @click="closeChangeNum(item)">取消</view>
                        <view class="btn-item ensure-btn" @click="closeChangeNum(item, 'ensure')">确定</view>
                    </view>
                </view>
            </view>
        </page-mask>
    </view>
</template>
<script>

import {login, checkLogin} from 'src/biz/wxmp/common/tool/login';
import api from './api';
import {ArrayUtils} from './util';
import topNav from '../common/components/TopNav';
// import mock from './mock';

export default {
    components: {
        topNav,
    },
    filters: {},
    data() {
        return {
            query: '',
            is_back: false,
            can_plus_reduce: true,
            resp: {},
            param_package: '',
            showCouponList: false, // 显示选择贝币
            shop_id: 0,
            cart_ids: 0,
            group_code: 1,
            nums: 1,
            pay_direct_type: 11,
            show_cancel_coupon: false, // 显示隐藏贝币券的叉,
            isAreaLimit: false,
            remark: {},
            brandCoupons: [], // 使用的优惠券
            isPaying: false,
            Status: {
                // 总计（优惠后金额，包括运费、税费、运费的税费）
                allFee: 0,
                // 商品优惠后总价格
                totalPrice: 0,
                // 是否使用贝壳
                pointUse: false,
                // 贝壳量
                point_fee: 0,
                // 是否使用余额
                balanceUse: false,
                // 余额支付的加密校验码
                balance_sign: '',
                // 余额
                balance: 0,
                // 余额后端
                cash_balance_cost: 0,
                // 使用的现金券面值
                coupon: 0,
                // 现金券的码
                couponSN: '',
                // 最终支付金额
                endFee: 0,
                // 支付订单显示的文案
                total_payment_text: '',
                // 已购卡用户的会员卡优惠金额
                cardFee: 0,
                cardUse: true,
                // 付款类型
                bank_id: 'alipay',
                // 手机号
                tel: '',
                addressModal: null,
            },
            payVipDiscount: false, // vip优惠模块
            vipTipsShow: false,
            changeNumShow: false,
            tempNum: '',
            acticityModalShow: false,
            activityModalData: {},
            titleOption: {
                title: '结算',
            },
            adressInfo: '',
        };
    },
    computed: {},
    onLoad(query) {
        this.query = query;
        checkLogin((isLogin) => {
            if (isLogin) {
                this.init();
            } else {
                login(() => {
                    this.init();
                });
            }
        });
        this.$bus.on('authorized', () => {
            this.init();
        });
        this.$bus.on('address_id', (addressId) => {
            // todo 确认 aid 请求的地址
            let aid = addressId;
            console.log('接收到 addressId ', aid);
            // todo 需测试
            this.confirmDirect((resp) => {
                this.handler(resp);
            });
        });
        // mock
        // this.resp = mock.extends_obj;
        // this.handler(this.resp);
    },
    // 只要返回当前页面，该方法就会被执行
    onShow() {
        if (this.is_back) {
            this.Status.myPayConfirm((resp) => {
                this.handler(resp);
            });
        }
    },
    mounted() {},
    onShareAppMessage(options) {},
    destroyed() {},
    methods: {
        init() {
            let e = this.query;
            // console.log('init 中 query 参数====', e);
            this.shop_id = e.shop_id || 0;
            // this.cart_ids = e._cart_id || [];
            this.cart_ids = e.cart_ids || [];
            this.nums = e.nums || [];
            this.group_code = e.group_code || '';
            this.pay_direct_type = e.pay_direct_type || '';
            this.param_package = e.pay_direct_type === '13' ? '&package=yuerbao_h5' : '';
            // 普通商品直接支付
            if (e.pay_direct && this.cart_ids) {
                // console.log('直接支付');
                // let tempData =
                // {
                //     iid: 50262163,
                //     sku_id: 489258942,
                //     check_shipping: 1,
                //     pay_direct: true,
                //     pay_direct_type: 11,
                //     num: 1,
                //     method: 'beibei.cart.add',
                // };
                // api.cartAdd(tempData).then((res) => {
                //     if (res.success) {
                //         this.confirmDirect((resp) => {
                //             this.handler(resp);
                //         });
                //     }
                // })
                //     .catch((err) => {
                //         console.warn(err);
                //     });
                this.confirmDirect((resp) => {
                    this.handler(resp);
                });
            // 拼团的商品，可以直接使用pay_direct确认订单
            } else if (this.cart_ids) {
                // console.log('拼团');
                this.confirmPintuan((resp) => {
                    this.handler(resp);
                });
            // 正常商品确认订单
            } else {
                // console.log('加购');
                let selectedData = wx.getStorageSync('cart_list') || {};
                this.brandCoupons = e.coupon ? e.coupon.split('_') : [];
                this.confirmNormal(this.brandCoupons, selectedData, this.handler);
            }
        },
        getSize(link = '') {
            let size = {
                width: 0,
                height: 28,
            };
            const match = link.match(/(\d+)x(\d+)/);
            if (match.length) {
                const originWidth = match[1] || 1;
                const originHeight = match[2] || 1;
                size = {
                    width: 28 / originHeight * originWidth,
                    height: 28,
                };
            }
            return size;
        },
        // 处理订单商品信息
        renderOrderItemlist(resp) {
            if (!resp.cart_items || resp.cart_items.length === 0) {
                location.href = 'page/order/mine/index';
                return;
            }
            let shippingFeeMap = resp.shipping_fee_map;
            let shippingTaxFeeMap = resp.shipping_tax_fee_map;
            // 按照专场渲染
            resp.cart_items.forEach((mart) => {
                let xj = 0;
                // nums = 0,
                let martShippingFee = shippingFeeMap[mart.event_id] ? parseInt(shippingFeeMap[mart.event_id]) : 0;

                mart.shipping_fee = martShippingFee;

                mart.items.forEach((item) => {
                    let tempPrice = (item.price / 100).toString().split('.');
                    item.priceInt = tempPrice[0];
                    item.priceDec = tempPrice[1] ? `.${tempPrice[1]}` : '';
                    // 补0
                    item.priceDec = item.priceDec.length === 2 ? `${item.priceDec}0` : item.priceDec;

                    // 专场所有的商品价格
                    xj = xj + (item.price * (parseInt(item.num)));

                    // 格式化商品价格
                    item.price = parseInt(item.price) / 100;

                    // 按钮类名
                    item.leftBtn = item.num * 1 === 1 ? 'ban' : '';
                    // item.showNum = (fromPage === 'cart' || item.is_change_num !== 1) ? 'hidden' : '';
                    // 专场商品数量
                    // nums += parseInt(item.num);
                });

                // 运费有税费 则加上运费税费
                if (shippingTaxFeeMap &&
                shippingTaxFeeMap[mart.event_id] &&
                shippingTaxFeeMap[mart.event_id] > 0 &&
                mart.tax_fee > 0) {
                    mart.tax_fee = mart.tax_fee + parseInt(shippingTaxFeeMap[mart.event_id]);
                }

                // 满减满折优惠
                if (mart.promotion_fee) {
                    xj = xj - mart.promotion_fee;
                }
                // 活动优惠
                if (mart.activity_discount_fee) {
                    xj = xj - mart.activity_discount_fee;
                }
                // 专场品牌红包，小计
                if (mart.coupon_brand_status === 4) {
                    xj = xj - mart.coupon_brand_fee;
                }
                // 运费
                xj = xj + martShippingFee;
                // 有税费 则加上税费
                if (mart.tax_fee && mart.tax_fee > 0) {
                    xj = xj + mart.tax_fee;
                }
                xj = (xj / 100).toFixed(2);
                mart.xj = xj;
            });
            // 处理最后的总的信息
            resp.expenses_v2.forEach((el) => {
                el.hasDiscount = false;
                if (el.key.indexOf('进口税') === -1) {
                    el.hasOverseaFee = true;
                }
                if (el.key.indexOf('VIP') > -1) {
                    el.hasDiscount = true;
                }
                // if (el.highlighted) {
                //     el.show_class = 'order-zj-val';
                // }
                if (el.left_icon) {
                    el.left_icon_size = this.getSize(el.left_icon);
                }
            });

            // 处理 优惠券
            this.renderCoupon(resp);
        },
        // 渲染现金券
        renderCoupon(resp) {
            let coupons = resp.coupons;
            // 不可使用券
            let naCoupons = resp.naCoupons;

            resp.couponMsg = coupons.length > 0 ? `${coupons.length}张可用` : '暂无可用';

            if (resp.Status && resp.Status.coupon && resp.Status.couponSN) {
                resp.couponMsg = `(-¥${resp.Status.coupon / 100})`;
            }

            // 遍历不可用券，添加标识
            if (naCoupons) {
                naCoupons.forEach((ele) => {
                    ele.cant_use = 'cant-use';
                });
                coupons = coupons.concat(naCoupons);
            }
            coupons.forEach((el) => {
                // update by LYZ 2015-10-16
                if (el.applicable_category === '全场通用') {
                    el.status_class = 'coupon';
                } else {
                    el.status_class = 'brand';
                }
                // end update
                el.start_time = this.getFormatTime(el.start_time);
                el.end_time = this.getFormatTime(el.end_time);

                let currentUnix = new Date() / 1000;
                if (currentUnix < parseInt(el.start_time)) { // coupon未开始
                    el.status = '0';
                    el.status_desc = '未开始';
                }
            });

            resp.coupons = coupons;
        },
        // 工具方法
        getFormatNum(num) {
            if (num < 10) {
                return `0${num}`;
            }
            return num;
        },
        getFormatTime(seconds) {
            let time = new Date(parseInt(`${seconds}000`));
            return `${time.getFullYear()}.${this.getFormatNum(time.getMonth() + 1)}.${this.getFormatNum(time.getDate())
            } ${this.getFormatNum(time.getHours())}:${this.getFormatNum(time.getMinutes())}`;
        },
        showAreaModal({
            isAreaLimit,
            isNoAddress,
            showMsg,
        }) {
            let text1 = '对不起，由于商家原因，此商品在你选择地址所在区域无法发货，您可以使用其它地址购买。';
            let text2 = isNoAddress ? '请填写收货人地址' : '地址出现异常，请更改地址';
            let msg = isAreaLimit ? text1 : text2;
            if (showMsg) {
                msg = showMsg;
            }

            wx.showModal({
                title: '提示',
                content: msg,
                success: (res) => {
                    if (res.confirm) {
                        if (showMsg) {
                            // wx.navigateBack();
                        } else {
                            this.goAddress();
                        }
                    }
                },
            });
        },
        showModalAndBack(msg) {
            wx.showModal({
                title: '提示',
                content: String(msg) || '未知名错误',
                showCancel: false,
                success: () => {
                    // wx.navigateBack();
                },
            });
        },
        // 跳转地址页
        goAddress() {
            this.is_back = true;
            wx.navigateTo({
                url: `/biz/wxmp/payment/address/index?statusFrom=trade`,
            });
        },
        // 订单支付
        goPay() {
            this.is_back = false;
            // 防止重复点击
            if (this.isPaying) {
                return;
            }
            // 先判断是否有地址
            if (!this.adressInfo || !this.adressInfo.aid) {
                this.showAreaModal({
                    isNoAddress: true,
                });
                return;
            }
            // 特定地区才发货
            if (this.isAreaLimit) {
                this.showAreaModal({
                    isAreaLimit: true,
                });
                return;
            }
            this.isPaying = true;
            // 数据
            let data = {
                invoice_type: 0,
                remark: JSON.stringify(this.remark), // 商品留言
                coupon_id: this.Status.couponSN || '', // 使用贝币的优惠券
                mf_coupon_id: (this.resp.manfan && this.resp.manfan.length) ? this.resp.manfan[0].serial_id : '',
                sign: this.resp.sign,
                // 需要使用的余额
                balance: this.Status.cash_balance_cost,
                payment: this.Status.endFee, // 最终支付的价格
                balance_sign: '', // 使用余额支付的标志
                point_fee: this.Status.pointUse && this.Status.point_fee ? this.Status.point_fee : 0, // 贝壳
                shipping_fee: this.resp.total_shipping_fee, // 总的运费
                cart_ids: (this.cart_ids instanceof Array) ? this.cart_ids.join(',') : this.cart_ids, // 商品的id
                nums: (this.nums instanceof Array) ? this.nums.join(',') : this.nums, // 商品的数量
                ts: this.resp.ts,
                bank_id: 'weixin', // 支付方式
                my_coupon_brand_ids: this.brandCoupons.join(','),
                use_club_card: 0, // 是否使用会员卡  Number(Status.cardUse).toString()
                biz_data: this.shop_id,
                member_card_confirm: confirm || 0, // 0 默认不使用会员卡，据说在海外购的情况下是另一个含义
            };

            // 购买贝贝会员卡时，由于是虚拟商品所以不需要发货地址，所以当新用户没有填写收货地址并且购买贝贝会员卡时，需要做一下逻辑判断
            if (this.adressInfo) {
                data.aid = this.adressInfo.aid;
            }

            // 拼团直接支付
            if (this.group_code) {
                data.group_code = this.group_code;
            } else if (this.pay_direct_type) {
                data.pay_direct = true;
                data.pay_direct_type = this.pay_direct_type;
            } else {
                data.pay_direct = false;
            }
            this.tradeCreate(data, (res) => {
                if (res.success) {
                    const sign = res.sign;

                    const tradePayCallback = (resp) => {
                        let tempData = {};
                        if (!resp.success) {
                            // todo 支付失败去订单页面
                            wx.redirectTo({
                                url: `/pages/order/mine/index?shop_id=${this.shop_id}`,
                            });
                        } else {
                            tempData = Object.assign({}, JSON.parse(resp.data));

                            tempData.success = () => {
                                // todo 去支付成功页面
                                wx.redirectTo({
                                    url: `/biz/wxmp/payment/pay_success/index?oid=${res.tid}`,
                                });
                            };
                            tempData.fail = () => {
                                // todo 取消支付  去订单页面
                                wx.redirectTo({
                                    url: '/pages/order/mine/index?type=trade&status=wait_for_pay',
                                });
                            };
                            wx.requestPayment(tempData);
                        }
                    };

                    this.tradePay(sign, tradePayCallback);
                } else {
                    this.isPaying = false;

                    if (parseInt(res.err_code) === 200) {
                        this.showModalAndBack('订单创建失败，请下载贝店APP');
                        // 特定地区才发货
                    } else if (res.data === 'shipping_deny') {
                        // const context = this;
                        wx.showModal({
                            title: '提示',
                            content: '对不起，由于商家原因，此商品在你选择地址所在区域无法发货，您可以使用其它地址购买。',
                            success: (result) => {
                                if (result.confirm) {
                                    this.goAddress();
                                }
                            },
                        });
                    } else {
                        wx.showToast({
                            title: res.message || res.err_msg,
                            icon: 'none',
                        });
                    }
                }
            });
            // 打点方法先注释了
            // log({
            //     block_name: '支付订单',
            //     item_id: (this.cart_ids instanceof Array) ? this.cart_ids.join(',') : this.cart_ids,
            // });
        },
        tradeCreate(data, cb) {
            wx.showToast({
                title: '订单创建中',
                icon: 'loading',
            });
            api.fetchTradeCreate(data)
                .then((res) => {
                    cb(res.data);
                })
                .catch((res) => {
                    wx.showToast({
                        title: res.message || res.err_msg || '订单创建失败~',
                        icon: 'none',
                        duration: 2000,
                    });
                });
        },
        tradePay(sign, callback) {
            wx.login({
                success(res) {
                    api.fetchTradePay({
                        sign,
                        param: JSON.stringify({
                            wxpay: {
                                code: res.code,
                            },
                        }),
                    })
                        .then((payResp) => {
                            wx.hideToast();
                            callback(payResp.data);
                        })
                        .catch((error) => {
                            console.log(error);
                        });
                },
            });
        },
        // 减少商品数量
        reduceNums(e) {
            // console.log('reduceNums 中 e.currentTarget.dataset.ban =', e.currentTarget.dataset.ban);
            if (e.currentTarget.dataset.ban === 'ban' || this.nums === 1) {
                return;
            }
            // 弹窗
            if (e === 'mask') {
                if (this.tempNum === 1) {
                    return;
                }
                this.tempNum -= 1;
            }
            if (this.can_plus_reduce) {
                this.can_plus_reduce = false;
                this.tradeUpdate('reduce').then((res) => {
                    if (res.success) {
                        this.nums -= 1;
                        this.Status.myPayConfirm((data) => {
                            this.handler(data);
                        });
                    } else {
                        wx.showToast({
                            title: res.message || res.err_msg || '请求出错啦〜',
                            icon: 'none',
                            duration: 2000,
                        });
                    }
                })
                    .catch((err) => {
                        console.log(err);
                    });
            }
        },
        // 增加商品数量
        plusNums(type) {
            // console.log('plusNums');
            if (this.can_plus_reduce) {
                this.can_plus_reduce = false;
                this.tradeUpdate('plus').then((res) => {
                    if (res.success) {
                        this.nums += 1;
                        this.Status.myPayConfirm((data) => {
                            this.handler(data);
                        });
                    } else {
                        wx.showToast({
                            title: res.message || res.err_msg || '请求出错啦〜',
                            icon: 'none',
                            duration: 2000,
                        });
                    }
                })
                    .catch((err) => {
                        console.log(err);
                    });
            }
        },
        // 增加或减少商品数量时候 请求的接口
        tradeUpdate(type) {
            let payDirect;
            if (this.group_code || this.pay_direct) {
                payDirect = 1;
            }
            return new Promise((resolve, reject) => {
                api.fetchCartUpdate({
                    cart_id: this.cart_ids,
                    num: type === 'plus' ? (this.nums * 1) + 1 : (this.nums * 1) - 1,
                    pay_direct: payDirect,
                }).then((res) => {
                    if (res.data && !res.data.success) {
                        this.can_plus_reduce = true;
                    }
                    resolve(res.data);
                })
                    .catch((error) => {
                        reject(error.data);
                    });
            });
        },
        sendCoupon(sn, value) {
            this.show_cancel_coupon = true;
            this.showCouponList = false;
            this.Status.coupon = value || 0;
            this.Status.couponSN = sn;
            this.Status.myPayConfirm((resp) => {
                resp.Status = {};
                resp.Status.coupon = value;
                resp.Status.couponSN = sn;
                this.handler(resp, 2);
                if (!sn && !value) {
                    this.show_cancel_coupon = false;
                }
            });
        },
        // 请求接口
        payConfirm(data, callback) {
            data.coupon_id = this.Status.couponSN || '';
            api.fetchTradeConfirm(data).then((resp) => {
                let respData = resp.data && (resp.data.extends_obj || resp.data);
                this.can_plus_reduce = true;
                if (resp.success && respData) {
                    let tempData = resp.data;
                    typeof callback === 'function' && callback(tempData);

                    this.Status.total_payment_text = tempData.total_payment_text; // 总计文案显示
                    this.Status.cash_balance_cost = tempData.cash_balance_cost; // 余额字段 不需要自己算
                    this.Status.endFee = tempData.payment; // 最终结算价格 使用后端返回的payment字段
                    this.resp = tempData;
                } else {
                    if (resp.data && resp.data.data === 'shipping_deny') {
                        this.showAreaModal({
                            isAreaLimit: true,
                        });
                        return;
                    }
                    this.showModalAndBack(resp.err_msg || resp.error_msg || resp.message || '请求出错啦〜');
                    return;
                }
            })
                .catch((resp) => {
                    this.can_plus_reduce = true;
                    this.showModalAndBack(resp.err_msg || resp.error_msg || resp.message || '请求出错啦〜');
                });
        },
        // 拼团 confirmPintuan  直接从商品详情进入这里
        confirmPintuan(callback) {
            this.Status.myPayConfirm = (myCallback, data) => {
                this.payConfirm(Object.assign({
                    immediate: true,
                    pay_direct: true,
                    pay_direct_type: 11,
                    check_shipping: 1,
                    cart_ids: this.cart_ids,
                    group_code: this.group_code,
                    nums: this.nums || 1,
                    biz_data: this.shop_id,
                }, data), myCallback);
            };
            this.Status.myPayConfirm((resp) => {
                callback(resp);
            });
        },
        // 直接支付
        confirmDirect(callback) {
            this.Status.myPayConfirm = (myCallback, data) => {
                this.payConfirm(Object.assign({
                    immediate: true,
                    pay_direct: true,
                    pay_direct_type: this.pay_direct_type || 11,
                    check_shipping: 1,
                    cart_ids: this.cart_ids,
                    nums: this.nums || 1,
                    biz_data: this.shop_id,
                }, data), myCallback);
            };
            this.Status.myPayConfirm((resp) => {
                callback(resp);
            });
        },
        // 普通商品确认订单  ---购物车进入
        confirmNormal(brandCoupons, selectedData, callback) {
            // 购物车id 和 数量
            ArrayUtils.each(selectedData, (cartArr) => {
                cartArr.forEach((cart) => {
                    this.cart_ids.push(cart.cartId);
                    this.nums.push(cart.num);
                });
            });
            this.Status.myPayConfirm = (myCallback, data) => {
                this.payConfirm(Object.assign({
                    immediate: false,
                    check_shipping: 1,
                    cart_ids: this.cart_ids.join(','),
                    my_coupon_brand_ids: brandCoupons.join(','),
                    // nums: this.nums.join(','),
                    nums: this.nums,
                    biz_data: this.shop_id,
                }, data), myCallback);
            };
            this.Status.myPayConfirm((resp) => {
                callback(resp);
            });
        },
        // vip相关逻辑
        handlerVip(res = {}) {
            const payVipDiscount = res.pay_vip_discount || false;
            if (payVipDiscount) {
                payVipDiscount.title_color =
                    payVipDiscount.title_color && payVipDiscount.title_color.toString(16);
                payVipDiscount.desc_color =
                    payVipDiscount.desc_color && payVipDiscount.desc_color.toString(16);
            }
            // 年货节大促相关代码，后续删除
            let payAllowance = (res.pay_allowance && res.pay_allowance.properties) || null;
            if (payAllowance) {
                payAllowance.text_color = payAllowance.text_color && payAllowance.text_color.toString(16);
                payAllowance.right_icon = payAllowance.right_icon || 'http://h0.beicdn.com/open201952/5432dfd9b8ef41be_24x24.png';
            }
            this.payVipDiscount = payVipDiscount;
            this.payAllowance = payAllowance;
        },
        // handler 入口函数
        handler(resp, type) {
            // 如果是海外商品 直接报错
            for (let temp = 0; temp < resp.cart_items.length; temp++) {
                if (resp.cart_items[temp].event_type.indexOf('oversea') > -1) {
                    this.showModalAndBack('小程序暂不支持跨境商品购买，可前往贝店App购买');
                    return;
                }
            }
            this.Status.balance = resp.cash_balance;
            this.Status.point_fee = resp.point_fee;

            if (!resp.cart_items || resp.cart_items.length === 0) {
                this.showModalAndBack('确认订单失败，返回上一页');
                return;
            }

            // 不支持微信支付
            if (!resp.pay_methods || resp.pay_methods.indexOf('weixin') === -1) {
                this.showModalAndBack('此商品不支持微信支付');
                return;
            }

            // 处理数据 包括地址显示、券展示、商品详情
            this.renderOrderItemlist(resp);
            this.handlerVip(resp);
            if (resp.default_address) {
                this.adressInfo = resp.default_address;
            } else if (!resp.is_hidden_address) {
                this.showAreaModal({
                    isNoAddress: true,
                });
            }

            // 默认选中券（例如团长免单券）
            if (resp.coupons && resp.coupons.length && type !== 2) {
                let arr = resp.coupons.filter((el) => parseInt(el.selected) === 1);
                if (arr && arr.length) {
                    this.sendCoupon(arr[0].serial_number, arr[0].denominations);
                }
            }
        },
        showVipTips() {
            this.vipTipsShow = true;
        },
        closeVipModal() {
            this.vipTipsShow = false;
        },
        // 显示修改数量弹窗
        changeNum(item) {
            // console.log('changeNum', item);
            this.tempNum = item.num;
            this.changeNumShow = true;
        },
        closeChangeNum(item, type) {
            this.changeNumShow = false;
            if (type === 'ensure') {
                // todo 调用接口进行处理
            }
        },
        onUnload() {
            this.$bus.off('address_id');
        },
    },
};
</script>
<style src="./index.less" lang="less"></style>

