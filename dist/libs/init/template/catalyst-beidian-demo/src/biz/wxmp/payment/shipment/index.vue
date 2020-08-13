<template>
    <view class="root app-container">
        <top-nav
            class="top-nav-ref"
            :title="'物流详情'">
        </top-nav>
        <!-- 2-5之间tab -->
        <view v-if="logisticsList.length > 1 && logisticsList.length < 6" class="type-tabs">
            <view
                v-for="(logisticItem, logisticsIndex) in logisticsList"
                :key="logisticsIndex"
                class="type-tab"
                :class="[logisticsIndex === currentLogisticIndex ? 'active': '', 'lessFive']"
                @click="handleLogistic(logisticsIndex)">
                <view class="logistic-title">
                    {{ logisticItem.title }}
                </view>
            </view>
        </view>
        <!-- 超出5个包裹要滚动 -->
        <scroll-view v-if="logisticsList.length > 6" class="type-tabs" scroll-x>
            <view
                v-for="(logisticItem, logisticsIndex) in logisticsList"
                :key="logisticsIndex"
                class="type-tab"
                :class="[logisticsIndex === currentLogisticIndex ? 'active': '', 'moreFive']"
                @click="handleLogistic(logisticsIndex)">
                <view class="logistic-title">
                    {{ logisticItem.title }}
                </view>
            </view>
        </scroll-view>
        <!-- 快递状态 -->
        <view v-if="logistics.status" class="shipment-logistics">
            <view class="status">
                {{ logistics.status }}
            </view>
            <view v-if="logistics.desc" class="desc">
                {{ logistics.desc }}
            </view>
        </view>
        <!-- 物流类型 -->
        <view class="logistic-type">
            <view class="lf">
                <view class="logistic-name">{{ company }}</view>
                <view class="logistic-order">
                    <text>运单编号：{{ outSid==='无' ? '暂无物流轨迹' : outSid }}</text>
                    <view
                        v-if="outSid!=='无' && outSid"
                        class="copy-order-id J_copy_btn"
                        @click="copyOrderId(outSid)">
                        复制
                    </view>
                </view>
            </view>
            <view
                v-if="companyPhones"
                :href="`tel:${companyPhones}`"
                class="lr"
                @click="makePhoneCall(companyPhones)">
                <image class="phone" src="//h0.beicdn.com/open201924/f052bd34103770f1_96x96.png"></image>
            </view>
        </view>

        <!-- 物流信息 -->
        <view class="logistic-info">
            <view class="title">
                物流信息
                <text class="title-desc">本服务由{{ company }}提供</text>
            </view>
            <view class="shipment-items">
                <view
                    v-for="(shipItem,shipIndex) in shipmentDetails"
                    :key="shipIndex"
                    :class="['shipment-item', shipItem.class]">
                    <view class="shipment-place" v-html="shipItem.desc"></view>
                    <view class="shipment-time">
                        {{ shipItem.create }}
                    </view>
                </view>
            </view>
        </view>
    </view>
</template>
<script>
import {logisticsStatusDesc} from './util';
import {convert} from '@catalyst/image-convert';
import {login, checkLogin} from 'src/biz/wxmp/common/tool/login';
import {fetchLogisticData} from './api';
import topNav from 'src/biz/wxmp/common/components/topNav.vue';
// import {shipData}  from './mock.js';
let padZero = function (t) {
    if (t < 10) {
        t = `0${t}`;
    }
    return t;
};
export default {
    components: {
        topNav,
    },
    data() {
        return {
            orderItems: [], // 商品信息
            shipmentDetails: [], // 物流信息
            company: '',
            outSid: '', // 运单编号
            companyPhones: '',
            shipmentCheckcode: '',
            shipmentAddress: {},
            logisticsList: [],
            logistics: {
                status: '',
                desc: '',
            },
            currentLogisticIndex: 0,
            pageParams: {
                company: '',
                outSid: '', // 运单编号
            },
            styleTab: {},
            shareInfo: {
                isFirstEnter: false,
            },
            titleOption: {
                title: '物流详情',
            },
        };
    },
    watch: {
        currentLogisticIndex(newVal) {
            this.pageParams.outSid = this.logisticsList[newVal].outSid;
            this.pageParams.company = this.logisticsList[newVal].company;
            this.getData();
        },
    },
    onLoad(query) {
        this.oid = (query && decodeURIComponent(query.oid)) || '';
        this.shipmentId = (query && decodeURIComponent(query.shipmentId)) || '';
        if (!this.oid && !this.shipmentId) {
            this.note('缺少必要的参数~');
            return;
        }
        this.shareInfo.isFirstEnter = true;
        checkLogin((isLogin) => {
            if (isLogin) {
                this.getData();
            } else {
                login(() => {
                    this.getData();
                });
            }
        });
        this.$bus.on('authorized', () => {
            this.getData();
        });
    },
    onShareAppMessage(options) {
        return {
            title: `宝贝已乘${this.shareInfo.company || ''}快递朝您狂奔`,
            imageUrl: this.shareInfo.shareIcon,
            queryObj: {
                shipmentd: encodeURIComponent(this.shipmentId),
                oid: encodeURIComponent(this.oid),
            },
        };
    },
    methods: {
        note(title) {
            wx.showToast({
                title,
                icon: 'none',
                duration: 2000,
            });
        },
        getData() {
            let params = {
                oid: this.oid,
                shipment_id: this.shipmentId,
            };
            if (this.pageParams.outSid) {
                params.out_sid = this.pageParams.outSid;
            }
            if (this.pageParams.company) {
                params.company = this.pageParams.company;
            }
            fetchLogisticData(params).then((resp) => {
                if (resp) {
                    this.formatData(resp);
                } else {
                    this.note('请求失败');
                }
            })
                .catch((e) => {
                    this.note(e.message || e.error_msg || '请求失败');
                });
        },
        formatData(resp) {
            console.log('formatData', resp);
            if (resp.order_items && resp.order_items.length > 0) {
                resp.order_items.forEach((goodItem) => {
                    goodItem.img = goodItem.img ? convert(goodItem.img, '200') : '';
                    goodItem.price = goodItem.price ? (Number(goodItem.price) / 100).toFixed(2) : '';
                });
            }
            this.orderItems = resp.order_items && resp.order_items.length > 0 ? resp.order_items : [];
            this.company = resp.company;
            // 收货地址
            this.shipmentAddress = {
                address: '',
                phone: '',
                title: '',
            };
            if (resp.receiverInfo) {
                this.shipmentAddress = {
                    address: resp.receiverInfo.address,
                    phone: resp.receiverInfo.phone,
                    title: resp.receiverInfo.title,
                };
            }
            resp.shipment_details.forEach((shipmentItem, shipmentIndex) => {
                shipmentItem.class = '';
                let t = new Date(shipmentItem.create * 1000);
                shipmentItem.create = `${t.getFullYear()}年${padZero(t.getMonth() + 1)}月${padZero(t.getDate())}日` +
                        ` ${padZero(t.getHours())}:${padZero(t.getMinutes())}`;
                let statusIndex = -1;
                for (let i = 0; i < logisticsStatusDesc.length; i++) {
                    if (logisticsStatusDesc[i].type === shipmentItem.status) {
                        statusIndex = i;
                        break;
                    }
                }
                // 最新数据：字体绿色
                if (shipmentIndex === 0) {
                    shipmentItem.class = 'current';
                }
                if (statusIndex === -1) {
                    shipmentItem.statusDesc = '';
                } else {
                    shipmentItem.statusDesc = shipmentItem.status === 0 ? '' : logisticsStatusDesc[statusIndex].desc;
                    shipmentItem.class = `${shipmentItem.class} ${logisticsStatusDesc[statusIndex].class}`;
                }
                // 匹配手机号码
                shipmentItem.desc = this.matchPhoneNum(shipmentItem.desc, resp.out_sid);
            });
            // if (resp.logistics_notice) {
            //     resp.shipment_details.unshift({
            //         topTime: '',
            //         bottomTime: '',
            //         statusDesc: '',
            //         desc: resp.logistics_notice,
            //         class: 'notice',
            //     });
            // }
            // 快递状态
            this.logistics.status = resp.logistics_status_text;
            // this.logistics.desc = slowLogisticsNotice2.desc || '';

            this.logisticsList = resp.logistics_list && resp.logistics_list.length ? resp.logistics_list : [];
            this.shipmentDetails = resp.shipment_details;
            this.outSid = resp.out_sid ? resp.out_sid : '';
            this.companyPhones = resp.company_phones && resp.company_phones.length > 0 ? resp.company_phones[0] : '';
            if (this.shareInfo.isFirstEnter) {
                let firstShipmentDetail = '暂无物流信息';
                if (resp.logistics_notice && resp.shipment_details.length > 1) {
                    firstShipmentDetail = resp.shipment_details[1].desc;
                } else if (resp.shipment_details.length > 0) {
                    firstShipmentDetail = resp.shipment_details[0].desc;
                }
                this.shareInfo = {
                    isFirstEnter: false,
                    company: (this.company || '').replace('快递', ''),
                    shareDesc: firstShipmentDetail,
                    shareIcon: this.orderItems.length > 0 ? this.orderItems[0].img : '',
                };
            }
        },
        matchPhoneNum(desc, outsid) {
            let regx = /([0-9-－]{11,})/g;
            let phone = desc.match(regx);
            if (phone && phone.length) {
                phone.forEach((item) => {
                    if (item !== outsid) {
                        desc = desc.replace(item, `<a class="tel-blue" href="tel:${item}">${item}</a>`);
                    }
                });
            }
            return desc;
        },
        // 复制订单编号
        copyOrderId(data) {
            wx.setClipboardData({
                data,
            });
        },
        handleLogistic(idx) {
            this.currentLogisticIndex = idx;
        },
        // 快递电话
        makePhoneCall(tel) {
            wx.makePhoneCall({
                phoneNumber: tel,
            });
        },
    },
};
</script>
<style src="./index.less" lang="less"></style>

