<template>
    <view
        v-if="show"
        class="own-cancel-modal-wrap">
        <view class="content">
            <image class="avatar" :src="data.avatar"></image>
            <text class="nick">
                {{ data.nick }}
            </text>
            <image class="qrCode" :src="data.qrCode"></image>
            <text class="tips">长按识别二维码</text>
            <text class="tips-cancel">请联系掌柜取消订单哦</text>
            <image
                class="close-dialog"
                src="https://h0.beicdn.com/open202014/e4beff9e19e9ac3a_66x66.png"
                @click="closeDialog"></image>
        </view>
    </view>
</template>

<style lang="less">
    .own-cancel-modal-wrap {
        position: fixed;
        top: 0;
        left: 0;
        width: 750cpx;
        height: 100%;
        background: rgba(0, 0, 0, 0.6);
        z-index: 101;
        .content {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            text-align: center;
            width: 540cpx;
            height: 593cpx;
            background-color: #fff;
            border-radius: 26cpx;
            .avatar {
                display: block;
                margin: -55cpx auto auto auto;
                width: 110cpx;
                height: 110cpx;
                border-radius: 50%;
            }
            .nick {
                font-size: 32cpx;
                color: #3D3D3D;
                font-weight: 700;
                margin-top: 12cpx;
            }
            .qrCode {
                width: 260cpx;
                height: 260cpx;
                margin: 40cpx auto 0;
            }
            .tips {
                font-size: 28cpx;
                color: #3D3D3D;
                margin-top: 24cpx;
            }
            .tips-cancel {
                font-size: 32cpx;
                color: #999;
                margin-top: 24cpx;
            }
            .close-dialog {
                position: absolute;
                top: 24cpx;
                right: 24cpx;
                width: 40cpx;
                height: 40cpx;
            }
        }
    }
</style>

<script>
export default {
    props: {
        show: {
            type: Boolean,
            default: true,
        },
        data: {
            type: Object,
            default: Object,
        },
    },
    methods: {
        // 关闭弹框
        closeDialog() {
            this.$emit('closeOwnCancelDialog');
        },
    },
};
</script>
