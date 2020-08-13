<template>
    <view class="btn-wrap">
        <view
            class="left-float-btn-wrap"
            :style="{bottom: bottom +'rpx'}">
            <!-- 回我的店 -->
            <view
                v-if="showBackHome"
                class="back-btn"
                @click="goTo(`/biz/wxmp/store_home/index?storeCode=${backToSelfStoreCode}`,'回我的店')">
                <image
                    src="https://h0.beicdn.com/open202027/064f4779f4cf6974_24x24.png"
                    class="back-btn-logo"></image>
                <text>回我的店</text>
            </view>
        </view>
        <view
            class="right-float-btn-wrap">
            <!-- 我的/订单/首页 -->
            <view
                v-if="btnList && btnList.length"
                class="btns-wrap">
                <view
                    v-for="(btn, index) in btnList"
                    :key="index"
                    class="float-wrap"
                    @click="goTo(btn.target, btn.text)">
                    <image
                        class="float-icon"
                        :src="btn.icon"></image>
                    <text class="text">{{ btn.text }}</text>
                    <view
                        v-if="index !== btnList.length"
                        class="float-icon-spacer"></view>
                </view>
            </view>
        </view>
    </view>
</template>
<script>
export default {
    props: {
        showBackHome: {
            type: Boolean,
            default: false,
        },
        backToSelfStoreCode: {
            type: String,
            default: '',
        },
        bottom: {
            type: Number,
            default: 75,
        },
        btnList: {
            type: Array,
            default: () => ({}),
        },
    },
    methods: {
        // 避免有各页面打点需求 跳转方法不在此处实现
        goTo(target, text) {
            this.$emit('goToTarget', target, text);
        },
    },
};
</script>
<style lang="less">
.btn-wrap {
    position: relative;
}
.left-float-btn-wrap {
    position: fixed;
    z-index: 9;
    left: 0;
    bottom: 90cpx;
    .back-btn {
        display: flex;
        align-items: center;
        flex-direction: row;
        justify-content: flex-start;
        background-image: linear-gradient(90deg, #FA143A 0%, #E31436 100%);
        box-shadow: 0 4cpx 4cpx 0 rgba(255,25,64,0.20);
        border-radius: 0 30cpx 30cpx 0;
        width: 142cpx;
        height: 48cpx;
        font-size: 24cpx;
        color: #FFF;
        .back-btn-logo {
            display: block;
            width: 32cpx;
            height: 32cpx;
            margin-right: 4cpx;
        }
    }
}
.right-float-btn-wrap {
    position: fixed;
    z-index: 9;
    right: 24cpx;
    bottom: 30cpx;
    .btns-wrap {
        width: 90cpx;
        border-radius: 90cpx;
        background: rgba(255,255,255,0.90);
        border: 1px solid rgba(0,0,0,0.30);
        box-shadow: 0 0 10cpx 0 rgba(0,0,0,0.08);
        overflow: hidden;
        .float-wrap {
            position: relative;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            width: 90cpx;
            height: 90cpx;
            .float-icon {
                display: block;
                width: 40cpx;
                height: 40cpx;
            }
            .text {
                margin-top: 4cpx;
                font-size: 18cpx;
                color: #000;
                text-align: center;
                line-height: 18cpx;
            }
            .float-icon-spacer {
                position: absolute;
                margin: auto;
                width: 54cpx;
                height: 2cpx;
                background: rgba(0, 0, 0, .08);
                left: 50%;
                transform: translateX(-50%);
                bottom: 0;
            }
        }
    }
}
</style>
