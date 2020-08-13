<template>
    <view
        :hover-class="'navigator-hover'"
        :hover-stay-time="100"
        class="product"
        @click.stop="goDetail(item)">
        <view class="title">
            {{ item.title }}
        </view>
        <!-- 买家 -->
        <view v-if="userType === 3" class="price-wrap">
            <view class="price-left">
                <text class="symbol">¥</text>
                <text class="price">{{ item.price }}</text>
                <text v-if="item.originPrice" class="ori-price">¥{{ item.originPrice }}</text>
            </view>
            <view class="price-right">
                <text v-if="item.viewNum" class="view-wrap">{{ item.viewNum }}人在查看</text>
                <view v-if="item.viewNum " class="line"></view>
                <text v-if="item.buyNum" class="buy-wrap">{{ item.buyNum }}人购买</text>
            </view>
        </view>
        <!-- 卖家 -->
        <view v-if="userType === 4" class="price-wrap">
            <view class="vip-price-left">
                <text class="labal">售价</text>
                <text class="symbol">¥</text>
                <text class="price">{{ item.price }}</text>
                <text class="line">/</text>
                <text class="cms-desc">赚</text>
                <text class="cms">21.8</text>
            </view>
        </view>
        <view class="imgs-wrap">
            <image
                v-for="(img, index) in item.imgs"
                :key="index"
                :src="img | format640"
                lazy-load
                :class="['item-img', `item-img-${index}`]">
            </image>
        </view>
        <view v-if="userType === 3" class="btn-wrap">
            <button
                open-type="share"
                data-type="item"
                :data-item="item"
                class="share-btn"
                @click.stop="shareItem">
                分享
            </button>
            <view v-if="canBuyer" class="buy-btn">跟团买</view>
            <view v-else class="buy-btn">我想买</view>
        </view>
        <view v-if="userType === 4" class="vip-btn-wrap">
            <view class="price-right">
                <text v-if="item.viewNum" class="view-wrap">{{ item.viewNum }}人在查看</text>
                <view v-if="item.viewNum" class="line"></view>
                <text v-if="item.buyNum" class="buy-wrap">{{ item.buyNum }}人购买</text>
            </view>
            <button
                open-type="share"
                data-type="item"
                :data-item="item"
                class="share-btn"
                @click.stop="shareItem">
                <image
                    src="//h0.beicdn.com/open202032/33c06e258f246693_44x44.png"
                    class="share-btn-icon">
                </image>
                <text class="share-btn-desc">分享</text>
            </button>
        </view>
    </view>
</template>

<script>
import {format640} from '@catalyst/image-convert';

export default {
    name: 'GoodItem',
    components: {},
    filters: {
        format640(val) {
            return format640(val);
        },
    },
    props: {
        item: {
            type: Object,
            default: () => ({}),
        },
        userType: {
            type: Number,
            default: () => (0),
        },
        canBuyer: {
            type: Boolean,
            default: () => (true),
        },
    },
    methods: {
        goDetail(item) {
            console.log('goDetail');
            this.$emit('goDetail', item);
        },
        shareItem() {
            this.$emit('share', this.item);
        },
    },
};
</script>

<style lang='less' scoped>

.product {
    position: relative;
    margin-left: 12cpx;
    background: #ffffff;
    width: 678cpx;
    // height: 561cpx;
    border-radius: 20cpx;
    margin-top: 16cpx;
    padding:  24cpx 24cpx 0 24cpx;
}
.title {
    font-size: 32cpx;
    font-weight: 500;
    color: #222222;
    line-height: 44cpx;
    overflow: hidden;
    text-overflow: ellipsis;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    display: -webkit-box;
}
.price-wrap {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: 20cpx;
}
.vip-price-left {
    display: flex;
    align-items: center;
    .labal {
        font-size: 28cpx;
        font-weight: 500;
        color: #E31436;
        line-height: 28cpx;
        margin-right: 4cpx;
    }
    .symbol {
        font-size: 26cpx;
        color: #E31436;
        line-height: 26cpx;
    }
    .price {
        font-size: 40cpx;
        font-weight: 500;
        color: #E31436;
        line-height: 40cpx;
    }
    .line {
        font-size: 24cpx;
        color: #CCCCCC;
        line-height: 30cpx;
        margin: 0 6cpx;
    }
    .cms-desc {
        font-size: 28cpx;
        color: #222222;
        line-height: 28cpx;
        margin-right: 2cpx;
    }
    .cms {
        font-size: 30cpx;
        color: #222222;
        line-height: 30cpx;
    }
}
.price-left {
    display: flex;
    align-items: flex-end;
    .labal {
        font-size: 28cpx;
        font-weight: 500;
        color: #E31436;
        line-height: 28cpx;
    }
    .symbol {
        font-size: 26cpx;
        color: #E31436;
        line-height: 36cpx;
    }
    .price {
        font-size: 40cpx;
        font-weight: 500;
        color: #E31436;
        line-height: 40cpx;
    }
    .ori-price {
        margin-left: 4cpx;
        font-size: 24cpx;
        color: #999;
        line-height: 32cpx;
        text-decoration: line-through;
    }
}
.price-right {
    display: flex;
    align-items: center;
    .view-wrap {
        font-size: 24cpx;
        color: #555555;
        line-height: 24cpx;
    }
    .line {
        width: 1cpx;
        height: 24cpx;
        background: #D8D8D8;
        margin: 0 16cpx;
    }
    .buy-wrap {
        font-size: 24cpx;
        color: #555555;
        line-height: 24cpx;
    }
}

.imgs-wrap {
    margin-top: 22cpx;
    overflow: hidden;
    .item-img {
        width: 223cpx;
        height: 223cpx;
    }
    .item-img-0 {
        border-radius: 8cpx 0 0 8cpx;
    }
    .item-img-1 {
        margin: 0 4cpx;
    }
    .item-img-2 {
        border-radius: 0 8cpx 8cpx 0;
    }
}

.vip-btn-wrap {
    width: 678cpx;
    height: 116cpx;
    display: flex;
    align-items: center;
    justify-content: space-between;
    .share-btn {
        width: 148cpx;
        background-image: linear-gradient(90deg, #FA143A 0%, #E31436 100%)!important;
        border-radius: 30cpx;
        padding: 10cpx 0!important;
        margin: 0!important;
        display: flex;
        align-items: center;
        justify-content: center;
        .share-btn-icon {
            width: 32cpx;
            height: 32cpx;
            margin-right: 8cpx;
        }
        .share-btn-desc {
            font-size: 26cpx;
            color: #FFFFFF;
            line-height: 26cpx;
        }
    }
}

.btn-wrap {
    width: 678cpx;
    height: 116cpx;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    .share-btn {
        width: 108cpx;
        font-size: 26cpx;
        color: #E31436;
        line-height: 26cpx;
        text-align: center;
        padding: 10cpx 0!important;
        margin: 0!important;
        border: 1cpx solid rgba(227,20,54,0.60);
        border-radius: 30cpx;
    }
    .buy-btn {
        width: 134cpx;
        font-size: 26cpx;
        color: #FFFFFF;
        line-height: 26cpx;
        text-align: center;
        padding: 13cpx 0;
        background-image: linear-gradient(90deg, #FA143A 0%, #E31436 100%);
        border-radius: 30cpx;
        margin-left: 24cpx;
    }
}

</style>
