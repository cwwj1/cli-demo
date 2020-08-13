<template>
    <view
        v-if="show"
        class="contact-popup-wrap"
        @click="close">
        <view
            class="popup"
            @click.stop>
            <image
                class="avatar"
                :src="userInfo.avatar | format160"></image>
            <image
                class="close"
                src="https://h0.beicdn.com/open201924/d47e203c665db09a_60x60.png"
                @click="close"></image>
            <text class="nickName">{{ userInfo.nickName }}</text>
            <template v-if="userInfo.storeQrcode">
                <text class="tip">点击二维码>>长按保存>>微信内识别</text>
                <text class="tip">可进行问题咨询～</text>
                <image
                    :src="userInfo.storeQrcode"
                    class="qr"
                    @click="previewImage(userInfo.storeQrcode)"></image>
            </template>
            <template v-else>
                <text class="tip">还未公开微信二维码</text>
                <text class="tip">请复制微信号添加好友联系我</text>
                <image
                    src="https://h0.beicdn.com/open202033/674fcd4c108edea3_360x360.png"
                    class="qr"></image>
            </template>
            <view class="wx flex-center">
                <text class="desc">{{ userInfo.wx ? `微信号：${userInfo.wx}` : '暂无微信号' }}</text>
                <view
                    class="copy-btn flex-center"
                    @click="copy(userInfo.wx)">
                    <text>复制</text>
                </view>
            </view>
            <slot></slot>
        </view>
    </view>
</template>

<script>
import {convert} from '@catalyst/image-convert';
export default {
    filters: {
        format160(val) {
            return convert(val, '160x160');
        },
    },
    props: {
        show: {
            type: Boolean,
            default: false,
        },
        userInfo: {
            type: Object,
            default: () => ({
                avatar: '', // 头像
                nickName: '',
                storeQrcode: [],
                wx: '',
            }),
        },
    },
    methods: {
        copy(data) {
            wx.setClipboardData({
                data,
            });
        },
        previewImage(url) {
            if (!url) {
                return;
            }
            wx.previewImage({
                current: url,
                urls: [url],
            });
        },
        close() {
            this.$emit('close');
        },
    },
};
</script>

<style lang="less">
.contact-popup-wrap {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, .6);
    z-index: 999;
    .flex-center {
        display: flex;
        align-items: center;
        justify-content: center;
    }
    .popup {
        display: flex;
        flex-direction: column;
        align-items: center;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 600cpx;
        padding: 92cpx 40cpx 48cpx 40cpx;
        background: #fff;
        box-sizing: border-box;
        border-radius: 12cpx;
        .avatar {
            position: absolute;
            top: 0;
            left: 50%;
            width: 120cpx;
            height: 120cpx;
            border: 3cpx solid #FFF;
            border-radius: 50%;
            transform: translate3d(-50%, -50%, 0);
            background-color: #fff;
        }
        .close {
            position: absolute;
            right: 24cpx;
            top: 24cpx;
            width: 40cpx;
            height: 40cpx;
        }
        .nickName {
            font-size: 36cpx;
            font-weight: 600;
            color: #333;
            line-height: 42cpx;
            margin-bottom: 32cpx;
        }
        .tip {
            font-size: 28cpx;
            color: #333;
            line-height: 42cpx;
        }
        .qr {
            width: 240cpx;
            height: 240cpx;
            margin-top: 24cpx;
        }
        .wx {
            margin-top: 24cpx;
            .desc {
                font-size: 28cpx;
                color: #3D3D3D;
            }
            .copy-btn {
                margin-left: 12cpx;
                width: 80cpx;
                height: 40cpx;
                text-align: center;
                border: 1px solid rgba(227,20,54,0.60);
                border-radius: 20cpx;
                font-size: 24cpx;
                color: #E31436;
            }
        }
    }
}
</style>
