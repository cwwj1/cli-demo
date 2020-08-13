<template>
    <view class="page-wrap">
        <!-- 顶部地址管理区域 -->
        <view
            v-if="memberInfo && memberInfo.avatar"
            class="header-wrap flex-between">
            <view class="left-wrap flex-center">
                <image
                    v-if="memberInfo.avatar"
                    :src="memberInfo.avatar | formatImg160"
                    placeholder="https://h0.beicdn.com/open201918/0ab49db2491da2c2_180x180.png"
                    class="avatar"></image>
                <text class="nick line1">{{ memberInfo.nick }}</text>
            </view>
            <view class="right-wrap flex-center" @click="goAddress">
                <text>地址管理</text>
                <image src="https://h0.beicdn.com/open201932/51f2567816afb2a4_30x30.png" class="icon-arrow"></image>
            </view>
        </view>
        <!-- 导航条 -->
        <view class="tabbar-wrap flex-around" :style="{top: navHeight}">
            <view
                v-for="(item, index) in category"
                :key="index"
                :class="['item', index === currentStatus ? 'active' : '']"
                @click="onChangeTab(index)">
                <text>
                    {{ item.name }}
                </text>
            </view>
        </view>
        <!-- 列表 -->
        <view
            v-for="(item, index) in [1,2,3,4,5,6,7,8]"
            :key="index"
            class="item-wrap">
            <view class="top-wrap flex-between">
                <view class="left-wrap flex">
                    <!-- <text class="store-name">果果家WOMEN小店</text> -->
                    <image
                        src="https://h0.beicdn.com/open202026/8be283fb0d4165b1_90x90.png"
                        placeholder="https://h0.beicdn.com/open201918/0ab49db2491da2c2_180x180.png"
                        class="avatar"></image>
                    <view class="flex-column">
                        <view class="flex">
                            <text class="name line1">VinciWang</text>
                            <text class="buy">购买</text>
                        </view>
                        <text class="time">2020-08-02 13:27</text>
                    </view>
                </view>
                <text class="order-status">交易完成</text>
            </view>
            <view class="middle-wrap flex">
                <image
                    class="item-img"
                    src="https://d1.beicdn.com/upload/item/2007/06/22216816370000_800x800.jpg!640x640.jpg"></image>
                <view class="right-wrap">
                    <text class="title line2">可丽金健肤喷雾150ml男女保湿定妆深层滋润敏感肌补水养护爽肤水可丽金健肤喷雾150ml男女保湿定妆深层滋润敏感肌补水养护爽肤水</text>
                    <text class="size line1">通用，L号</text>
                    <view class="flex-between">
                        <text class="price">￥188.00</text>
                        <text class="num">X2</text>
                    </view>
                </view>
            </view>
            <view class="bottom-wrap flex-column-between">
                <view class="box flex-end">
                    <text class="num">共1件商品</text>
                    <view class="total flex">
                        <text>总计: </text>
                        <text class="value">￥376.00</text>
                    </view>
                    <text class="discount">(优惠：¥-3.00)</text>
                </view>
                <view class="box flex-end">
                    <view class="btn flex-center">再次购买</view>
                    <view class="btn flex-center red">评价</view>
                </view>
            </view>
        </view>
    </view>
</template>

<script>
import {convert} from '@catalyst/image-convert';
export default {
    filters: {
        formatImg160(val) {
            return convert(val, '160x160');
        },
    },
    data() {
        return {
            memberInfo: {
                avatar: 'https://h0.beicdn.com/open202026/8be283fb0d4165b1_90x90.png',
                nick: '西风几时',
            },
            category: [
                {
                    name: '全部',
                    key: 'all',
                    status: 0,
                },
                {
                    name: '待付款',
                    key: 'pay',
                    status: 1,
                },
                {
                    name: '待发货',
                    key: 'delivery',
                    status: 2,
                },
                {
                    name: '待收货',
                    key: 'receive',
                    status: 3,
                },
                {
                    name: '已完成',
                    key: 'rate',
                    status: 4,
                },
            ],
            currentStatus: 0,
        };
    },
    methods: {
        goAddress() {

        },
        onChangeTab() {

        },
    },
};
</script>
<style src="./index.less" lang="less"></style>
