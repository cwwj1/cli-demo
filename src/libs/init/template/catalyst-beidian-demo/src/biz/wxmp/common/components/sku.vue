<template>
    <view>
        <slot
            :sku-map="skuPropsMap"
            :sku-nums="skuNums"
            :sku-desc="skuDesc"
            :selected-sku="selectedSku"></slot>
        <view v-if="isShow" class="sku-wrap-mask" @click="close">
            <view class="content" @click.stop>
                <view class="sku-top">
                    <image
                        v-if="skuData && skuData.skuImg"
                        class="sku-img"
                        :src="skuData.skuImg | format320"></image>
                    <view class="detail-wrap">
                        <view v-if="!selectedSku.sku_id" class="price-wrap">
                            <text class="unit">&yen;</text>
                            <text class="now-price">{{ skuData.price }}</text>
                            <text v-if="skuData.originPrice" class="old-price">￥{{ skuData.originPrice | money }}</text>
                        </view>
                        <view v-else class="price-wrap">
                            <text class="unit">&yen;</text>
                            <text class="now-price">{{ selectedSku.price | money }}</text>
                            <text class="old-price">￥{{ selectedSku.origin_price | money }}</text>
                        </view>
                        <view class="desc">
                            {{ !selectedSku.sku_id ? `请选择${skuDesc}` : `已选：${selectedSku.name}` }}
                        </view>
                    </view>
                    <image src="https://h0.beicdn.com/open201924/d47e203c665db09a_60x60.png" class="close" @click="close"></image>
                </view>
                <view class="sku-area">
                    <view
                        v-for="(sku, index) in skuPropsMap"
                        :key="index"
                        class="sku-box">
                        <view class="flex-between">
                            <text class="sku-name">{{ sku.name }}</text>
                            <text
                                v-if="sku.hasSize"
                                class="size-table"
                                @click="goToProductSizeTable">
                                查看尺码表
                            </text>
                        </view>
                        <view
                            v-if="sku.items && sku.items.length"
                            class="sku-items">
                            <view
                                v-for="(item, idx) in sku.items"
                                :key="idx"
                                class="sku-item"
                                :class="{active: item.status == 1, out: item.status == -1}"
                                @click="choseSku(item)">
                                <text>{{ item.name }}</text>
                            </view>
                        </view>
                    </view>
                    <view
                        :class="['sku-operation', isIpx ? 'ipx' : '']">
                        <text class="num-desc">购买数量</text>
                        <view class="operation">
                            <view :class="['subtract', skuNum === 1 ? 'isOne':'']" @click="subtract('skuNum')">
                                <view class="subtract-icon"></view>
                            </view>
                            <view
                                class="num"
                                @click="showChangeSkuNumPopup">
                                {{ skuNum }}
                            </view>
                            <view class="add" @click="add('skuNum')">
                                <view class="plus">
                                    <view class="subtract-icon"></view>
                                    <view class="subtract-icon plus"></view>
                                </view>
                            </view>
                        </view>
                    </view>
                </view>
                <view
                    :class="['buy-now-wrap', isIpx ? 'ipx-btn' : '', skuData.isSoldOut ? 'out' : '']"
                    @click="addCart">
                    <view class="buy-now">
                        <text>{{ btnText }}</text>
                    </view>
                </view>
            </view>
            <!-- 修改购买数量弹窗 -->
            <view
                v-if="isShowPopup"
                class="popup-mask"
                @click.stop>
                <view class="popup-content">
                    <text class="title">修改购买数量</text>
                    <view class="operation">
                        <view :class="['subtract', skuNum === 1 ? 'isOne':'']" @click="subtract('inputNum')">
                            <view class="subtract-icon"></view>
                        </view>
                        <input
                            v-model="inputNum"
                            type="number"
                            class="num" />
                        <view class="add" @click="add('inputNum')">
                            <view class="plus">
                                <view class="subtract-icon"></view>
                                <view class="subtract-icon plus"></view>
                            </view>
                        </view>
                    </view>
                    <view class="btns">
                        <view
                            class="btn btn-cancel"
                            @click="isShowPopup=false;">
                            取消
                        </view>
                        <view
                            class="btn btn-sure"
                            @click="changeSkuNum">
                            确定
                        </view>
                    </view>
                </view>
            </view>
        </view>
    </view>
</template>

<script>
import _ from 'underscore';
import toast from '@catalyst/toast';
import {convert} from '@catalyst/image-convert';
import formatPrice from '../tool/formatPrice';
import {needSafeArea} from '../tool/tool';
import request from '../tool/request';

export default {
    filters: {
        money(val) {
            return formatPrice(val, 'auto');
        },
        format320(val) {
            return convert(val, '320x320');
        },
    },
    props: {
        isShow: {
            type: Boolean,
            default: false,
        },
        btnText: {
            type: String,
            default: '跟团买',
        },
    },
    data() {
        return {
            skuIdMap: {},
            skuKvMap: {},
            skuStockMap: {},
            skuPropsMap: {},
            selectedPropsList: [],
            productSizes: [],
            productSizeDetailUrl: '',
            cacheValid: {},
            selectedSku: {},
            imgs: {},
            skuData: {},
            skuNums: 0,
            skuNum: 1,
            inputNum: 1,
            skuDesc: '',
            isSingleSku: false,
            isIpx: needSafeArea(),
            isShowPopup: false,
        };
    },
    methods: {
        // skuData必传参数
        // price/originPrice/iid/isSoldOut/skuImg/shopId/offerCode
        handleData(skuArea, skuData, imgs) {
            const {
                skuIdMap,
                skuKvMap,
                skuStockMap,
                productSizes,
                productSizeDetailUrl,
            } = skuArea;
            this.skuData = skuData;
            this.skuIdMap = skuIdMap;
            this.skuKvMap = skuKvMap;
            this.skuStockMap = skuStockMap;
            this.productSizes = productSizes;
            this.productSizeDetailUrl = productSizeDetailUrl;
            this.isSingleSku = this.checkIsSingleSku();
            this.skuPropsMap = {};
            this.selectedPropsList = [];
            this.imgs = imgs;
            this.skuDesc = '';
            this.skuNums = Object.keys(this.skuStockMap).length;
            this.cacheValid = {};
            this.selectedSku = {};
            this.skuNum = 1;
            this.handleSku();
        },
        checkIsSingleSku() {
            return _.without(_.map(_.toArray(this.skuStockMap), (item) => item.stock), 0).length === 1;
        },
        handleSku() {
            _.each(this.skuStockMap, (value, key) => {
                let props = _.map(_.compact(key.split('v')), Number);
                this.skuStockMap[key].props = props;
                this.skuStockMap[key].name = '';
                _.each(props, (item) => {
                    this.skuStockMap[key].name += `${this.skuKvMap[`v${item}`]} `;
                });
                // 是否只有一个可选sku 若有库存 则默认选中
                if (this.isSingleSku && this.skuStockMap[key].stock !== 0) {
                    this.selectedPropsList = this.skuStockMap[key].props;
                }
            });
            this.calculate();
        },
        calculate() {
            let id;
            let propUnSelected = [];
            this.skuDesc = '';
            _.each(this.skuIdMap, (map, key) => {
                id = null;
                // 未被选中的属性
                propUnSelected = _.reject(this.selectedPropsList, (v) =>
                    _.find(map, (_item) => {
                        if (_item * 1 === v * 1) {
                            id = v;
                            return true;
                        }
                        return false;
                    })
                );
                let items = [];
                for (let k in map) {
                    let skuId = map[k];
                    let status = 0;
                    if (skuId * 1 === id * 1) {
                        status = 1;
                    } else if (this.checkStock([skuId].concat(propUnSelected))) {
                        // 没有被选中且库存不为0的属性 样式正常显示
                        if (map.length === 1) {
                            status = 1;
                            this.selectedPropsList.push(skuId);
                        } else {
                            status = 0;
                        }
                    } else {
                        // 没有库存的属性
                        status = -1;
                    }
                    items.push({
                        id: skuId,
                        name: this.skuKvMap[`v${skuId}`],
                        propName: this.skuKvMap[`k${key}`],
                        status,
                    });
                }
                this.$set(this.skuPropsMap, key, {
                    name: this.skuKvMap[`k${key}`],
                    id: key,
                    items,
                    hasSize: this.hasSize(key),
                });
                this.skuDesc += `${this.skuKvMap[`k${key}`]} `;
            });
            this.selectedSku = this.getSelected(this.selectedPropsList) || {};
            // 父组件可能需要显示已选sku信息
            this.$emit('getSelectedSku', this.selectedSku);
        },
        checkStock(props) {
            let key = this.getMapKey(props);
            if (typeof this.cacheValid[key] !== 'undefined') {
                return this.cacheValid[key];
            }
            this.cacheValid[key] = _.find(this.skuStockMap, (_sku) =>
                ((_sku.stock > 0) &&
                _.every(props, (prop) =>
                    _.indexOf(_sku.props, prop) > -1))
            );
            return this.cacheValid[key];
        },
        getSelected(props) {
            let target = {};
            let key = this.getMapKey(props);
            if (this.skuStockMap[key] && (this.skuStockMap[key].stock > 0)) {
                target = this.skuStockMap[key];
            }
            return target;
        },
        getMapKey(props) {
            let key = '';
            _.each(this.skuIdMap, (map) => {
                _.each(props, (prop) => {
                    let item = _.find(map, (value) => +value === +prop);
                    if (item) {
                        key = `${key}v${item}`;
                    }
                });
            });
            return key;
        },
        // 选中和取消选中
        choseSku(item) {
            let status = +item.status;
            if (status === 1) {
                // 被选中状态
                this.removeSkuProp(item.id);
            } else if (status === 0) {
                if (this.imgs[item.id]) {
                    this.skuData.skuImg = this.imgs[item.id];
                }
                // 可选状态
                this.addSkuProp(item.id);
            } else {
                toast(`该${item.propName}已抢光`);
            }
        },
        addSkuProp(id) {
            const key = +id;
            // 相同规格下同组的规格id集合
            const group = _.find(this.skuIdMap, (list) =>
                _.indexOf(list, key) > -1);
            if (typeof group === 'undefined') {
                throw new Error('不存在的key');
            }

            // 删除相同规格下的其他id
            this.selectedPropsList = _.difference(this.selectedPropsList, group);
            this.selectedPropsList.push(key);
            this.calculate();
        },
        removeSkuProp(id) {
            this.selectedPropsList = _.without(this.selectedPropsList, id);
            this.calculate();
        },
        close() {
            this.$emit('close');
        },
        add(target) {
            this[target] += 1;
        },
        subtract(target) {
            if (this[target] <= 1) {
                toast('不能少于1个哟');
                return;
            }
            this[target] -= 1;
        },
        addCart() {
            let skuId = this.selectedSku.sku_id;
            if (!skuId) {
                toast(`请选择${this.skuDesc}`);
                return;
            }
            if (this.skuData.isSoldOut) {
                toast(`已售罄`);
                return;
            }
            const addCartParams = {
                iid: this.skuData.iid,
                sku_id: skuId,
                check_shipping: 1,
                pay_direct: true,
                num: this.skuNum,
                pay_direct_type: 11,
            };
            request({
                type: 'POST',
                method: 'beibei.cart.add',
                data: {
                    ...addCartParams,
                },
            }).then((resp) => {
                if (resp.success) {
                    this.goPay(resp);
                    return;
                }
                toast(resp.message);
            })
                .catch((e) => {
                    toast(e);
                });
        },
        goPay(data) {
            let url = `/biz/wxmp/trade/index?cart_ids=${data.cart_id}&nums=${this.skuNum}&pay_direct=1&shop_id=${this.skuData.shopId}`;
            if (this.skuData.offerCode) {
                url += `&offer_code=${encodeURIComponent(this.skuData.offerCode)}`;
            }
            wx.navigateTo({
                url,
            });
        },
        // 判断是否有尺码表
        hasSize(kid) {
            if (!this.productSizes.length) {
                return false;
            }
            let vid = +this.productSizes[0].vid;
            if (this.skuIdMap[kid].indexOf(vid) > -1) {
                return true;
            }
            return false;
        },
        goToProductSizeTable() {
            if (!this.productSizeDetailUrl) {
                return;
            }
            let url = encodeURIComponent(this.productSizeDetailUrl);
            wx.navigateTo({
                url: `/biz/wxmp/tool_page/wxmp_webview/index?url=${url}`,
            });
        },
        showChangeSkuNumPopup() {
            this.inputNum = this.skuNum;
            this.isShowPopup = true;
        },
        changeSkuNum() {
            this.skuNum = this.inputNum;
            this.isShowPopup = false;
        },
    },
};
</script>
<style lang="less">
.sku-wrap-mask {
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background: rgba(0,0,0,0.60);
    z-index: 999;
    .content {
        position: absolute;
        bottom: 0;
        left: 0;
        width: 750cpx;
        background: #fff;
        border-radius: 12cpx 12cpx 0 0;
        box-sizing: border-box;
        .sku-top {
            display: flex;
            align-items: center;
            padding: 24cpx;
            box-sizing: border-box;
            .sku-img {
                display: block;
                width: 196cpx;
                height: 196cpx;
                border-radius: 8cpx;
                margin-right: 24cpx;
            }
            .detail-wrap {
                flex: 1;
                display: flex;
                flex-direction: column;
                justify-content: flex-end;
                height: 196cpx;
                .price-wrap {
                    display: flex;
                    align-items: baseline;
                    .unit {
                        font-size: 32cpx;
                        color: #E31436;
                        font-weight: 600;
                    }
                    .now-price {
                        position: relative;
                        top: 2cpx;
                        margin: 0 8cpx 0 2cpx;
                        font-size: 52cpx;
                        font-weight: 600;
                        color: #E31436;
                    }
                    .old-price {
                        font-size: 24cpx;
                        color: #666;
                        text-decoration: line-through;
                    }
                }
                .desc {
                    font-size: 26cpx;
                    color: #333;
                    margin-top: 24cpx;
                    max-width: 420cpx;
                    white-space: nowrap;
                    text-overflow: ellipsis;
                    overflow: hidden;
                }
            }
            .close {
                position: absolute;
                top: 24cpx;
                right: 24cpx;
                width: 40cpx;
                height: 40cpx;
            }
        }
        .sku-area {
            padding: 24cpx 0 24cpx 24cpx;
            max-height: 700cpx;
            overflow: scroll;
            box-sizing: border-box;
            .sku-box {
                margin-bottom: 24cpx;
                .sku-name {
                    font-size: 28cpx;
                    color: #888;
                    line-height: 34cpx;
                }
                .size-table {
                    margin-right: 24rpx;
                    font-size: 24cpx;
                    color: #E31436;
                }
                .sku-items {
                    display: flex;
                    flex-wrap: wrap;
                    padding: 24cpx 0;
                    border-bottom: 1px solid rgba(0, 0, 0, 0.08);
                    .sku-item {
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        min-width: 150cpx;
                        margin: 0 24cpx 24cpx 0;
                        padding: 0 42cpx;
                        font-size: 26cpx;
                        color: #333;
                        height: 52cpx;
                        background: #F5F5F5;
                        border-radius: 26cpx;
                        box-sizing: border-box;
                        &.active {
                            color: #E31436;
                            background: rgba(250,20,58,0.08);
                            border: 1cpx solid #E31436;
                        }
                        &.out {
                            background: #F5F5F5;
                            color: #CDCFD0;
                        }
                    }
                }
            }
            .sku-operation {
                display: flex;
                align-items: center;
                justify-content: space-between;
                height: 80cpx;
                padding: 0 24cpx 100cpx 0;
                &.ipx {
                    padding: 0 24cpx 134cpx 0;
                }
                .num-desc {
                    font-size: 28cpx;
                    color: #666;
                    line-height: 36cpx;
                }
                .operation {
                    display: flex;
                    .subtract {
                        width: 66cpx;
                        height: 60cpx;
                        background: #F0F1F2;
                        border-radius: 4cpx 0 0 4cpx;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        &.isOne {
                            background: #F8F9F9;
                            .subtract-icon {
                                background: #D8D8D8;
                            }
                        }
                    }
                    .num {
                        width: 76cpx;
                        height: 60cpx;
                        background: #F0F1F2;
                        margin-left: 2cpx;
                        margin-right: 2cpx;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        font-size: 32cpx;
                        color: #333333;
                        font-weight: bold;
                    }
                    .add {
                        width: 66cpx;
                        height: 60cpx;
                        background: #F0F1F2;
                        border-radius: 0 4cpx 4cpx 0;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                    }
                    .subtract-icon {
                        background: rgba(42,50,61,0.60);
                        width: 24cpx;
                        height: 4cpx;
                        &.plus {
                            transform: rotate(90deg);
                            margin-top: -4cpx;
                        }
                    }
                }
            }
        }
        .buy-now-wrap {
            display: flex;
            justify-content: center;
            align-items: center;
            position: fixed;
            left: 0;
            bottom: 0;
            z-index: 11;
            width: 750cpx;
            height: 96cpx;
            background: #E31436;
            &.ipx-btn {
                padding-bottom: 34cpx;
            }
            &.out {
                background: #b8b8b8;
            }
        }
        .buy-now {
            font-size: 36cpx;
            color: #FFF;
        }
    }
    .popup-mask {
        position: fixed;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        background: rgba(0,0,0,0.60);
        z-index: 999;
        .popup-content {
            display: flex;
            flex-direction: column;
            align-items: center;
            position: absolute;
            top: 50%;
            left: 50%;
            width: 620cpx;
            padding: 42cpx 24cpx;
            transform: translate(-50%, -50%);
            border-radius: 12cpx;
            background: #fff;
            box-sizing: border-box;
            .title {
                font-weight: 600;
                font-size: 32cpx;
                color: #2e2e33;
            }
            .operation {
                display: flex;
                margin-top: 36cpx;
                .subtract {
                    width: 88cpx;
                    height: 88cpx;
                    background: #F0F1F2;
                    border-radius: 4cpx 0 0 4cpx;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    &.isOne {
                        background: #F8F9F9;
                        .subtract-icon {
                            background: #D8D8D8;
                        }
                    }
                }
                .num {
                    width: 176cpx;
                    height: 88cpx;
                    line-height: 88cpx;
                    text-align: center;
                    margin: 0 2cpx;
                    font-size: 32cpx;
                    color: #333;
                    background: #F0F1F2;
                    font-weight: bold;
                }
                .add {
                    width: 88cpx;
                    height: 88cpx;
                    background: #F0F1F2;
                    border-radius: 0 4cpx 4cpx 0;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                .subtract-icon {
                    background: rgba(42,50,61,0.60);
                    width: 24cpx;
                    height: 4cpx;
                    &.plus {
                        transform: rotate(90deg);
                        margin-top: -4cpx;
                    }
                }
            }
            .btns {
                margin-top: 36cpx;
                display: flex;
                align-items: center;
                .btn {
                    width: 242cpx;
                    height: 88cpx;
                    font-size: 32cpx;
                    text-align: center;
                    line-height: 88cpx;
                    border-radius: 12cpx;
                    &.btn-cancel {
                        color: #e31436;
                        border: 1px solid rgba(227,20,54,.8);
                    }
                    &.btn-sure {
                        margin-left: 32cpx;
                        color: #fff;
                        background: #e31436;
                    }
                }
            }
        }
    }
}
</style>
