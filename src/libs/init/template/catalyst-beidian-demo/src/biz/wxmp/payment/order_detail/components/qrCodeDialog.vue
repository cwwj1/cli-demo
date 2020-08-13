<template>
    <view
        v-if="show"
        class="qr-code-wrap">
        <view class="content">
            <image
                class="close-logo"
                src="https://h0.beicdn.com/open201924/d47e203c665db09a_60x60.png"
                @click="closeDialog()"></image>
            <template v-if="shareUser">
                <image class="avatar" :src="shareUser.avatar | formatImg160"></image>
                <text class="user-nick">{{ shareUser.nick }}</text>
                <image
                    class="qr-img"
                    :src="shareUser.wxQrcode || '//h0.beicdn.com/open201924/2e70f7eb44b714e8_390x390.png'"
                    @click="previewImg(shareUser.wxQrcode)"></image>
                <text class="text">{{ shareUser.wxQrcode ? '点击二维码>>长按保存>>微信内识别' : '暂无二维码' }}</text>
            </template>
        </view>
    </view>
</template>

<style lang="less">
    .qr-code-wrap {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.8);
        z-index: 101;
        .content {
            position: absolute;
            top: 50%;
            left: 50%;
            width: 540cpx;
            height: 570cpx;
            padding-top: 70cpx;
            transform: translate(-50%, -50%);
            text-align: center;
            background: #FFF;
            border-radius: 26cpx;
            box-sizing: border-box;
            .close-logo {
                position: absolute;
                top: 24cpx;
                right: 24cpx;
                width: 40cpx;
                height: 40cpx;
            }
            .avatar {
                display: block;
                position: absolute;
                left: 50%;
                top: -56cpx;
                width: 110cpx;
                height: 110cpx;
                border: 4cpx solid #FFF;
                border-radius: 50%;
                background: url(//h0.beicdn.com/open201918/0ab49db2491da2c2_180x180.png) no-repeat;
                background-size: 100% 100%;
                transform: translateX(-50%);
            }
            .user-nick {
                font-size: 32cpx;
                color: #3D3D3D;
                margin: 16cpx auto 40cpx;
                font-weight: bold;
            }
            .qr-img {
                display: block;
                width: 260cpx;
                height: 260cpx;
                margin: 0 auto;
            }
            .text {
                font-size: 26cpx;
                margin-top: 30cpx;
                color: #3D3D3D;
            }
        }
    }
</style>

<script>
import {convert} from '@catalyst/image-convert';
export default {
    filters: {
        formatImg160(val) {
            return convert(val, '160x160');
        },
    },
    props: {
        show: {
            type: Boolean,
            default: false,
        },
        shareUser: {
            type: Object,
            default: Object,
        },
    },
    methods: {
        // 关闭弹框
        closeDialog() {
            this.$emit('closeQrDialog');
        },
        previewImg(url) {
            if (!url) {
                return;
            }
            wx.previewImage({
                current: url,
                urls: [url],
            });
        },
    },
};
</script>

