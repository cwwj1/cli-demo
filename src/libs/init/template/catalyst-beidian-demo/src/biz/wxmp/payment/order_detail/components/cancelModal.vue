<template>
    <view
        v-if="show"
        class="cancel-modal-wrap">
        <view class="content">
            <view class="note">
                <text class="title">温馨提示：</text>
                <text class="desc">订单取消后，订单金额将原路退回（需1～10个工作日）</text>
            </view>
            <view class="reason-list">
                <text class="title">请选择取消订单原因：</text>
                <view
                    v-for="(reasonItem, reasonIndex) in reasonList"
                    :key="reasonIndex"
                    class="item-container"
                    @click.stop="selectCurrentReason(reasonIndex)">
                    <text class="text">
                        {{ reasonItem.desc }}
                    </text>
                    <text :class="[(selectedReason === reasonIndex) ? 'select-radio' : 'default-radio']"></text>
                </view>
            </view>
            <view class="bottom-btns">
                <text class="cancle-btn btn" @click.stop="closeDialog()">取消</text>
                <text class="save-btn btn" @click.stop="saveCancel()">确定</text>
            </view>
        </view>
    </view>
</template>

<style lang="less">
    .cancel-modal-wrap {
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
            border-radius: 26cpx;
            width: 630cpx;
            height: 938cpx;
            background-color: #fff;
            .note {
                height: 148cpx;
                padding: 32cpx 24cpx;
                text-align: left;
                background: #FFF2E6;
                box-sizing: border-box;
                .title {
                    font-size: 28cpx;
                    color: #99521F;
                    font-weight: bold;
                }
                .desc {
                    margin-top: 16cpx;
                    font-size: 24cpx;
                    color: #B36B47;
                    white-space: nowrap;
                }
            }
            .reason-list {
                padding: 0 24cpx;
                height: 582cpx;
                overflow-y: scroll;
                box-sizing: border-box;
                .title {
                    height: 100cpx;
                    line-height: 100cpx;
                    font-size: 32cpx;
                    color: #333;
                    font-weight: bold;
                    text-align: left;
                }
                .item-container {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    height: 88cpx;
                    border-bottom: 1px solid rgba(0,0,0,0.08);
                    .text {
                        font-size: 32cpx;
                    }
                    .default-radio {
                        background: url(https://h0.beicdn.com/open201925/c95460dd328cb31d_60x60.png) center center no-repeat;
                        width: 40cpx;
                        height: 40cpx;
                        background-size: 100% 100%;
                    }
                    .select-radio {
                        background: url(https://h0.beicdn.com/open201925/2b3386885bf523df_60x60.png) center center no-repeat;
                        width: 40cpx;
                        height: 40cpx;
                        background-size: 100% 100%;
                    }
                }
            }
            .bottom-btns {
                height: 208cpx;
                display: flex;
                justify-content: center;
                align-items: center;
                .btn {
                    width: 270cpx;
                    height: 88cpx;
                    line-height: 88cpx;
                    margin-right: 24cpx;
                    font-size: 32cpx;
                    text-align: center;
                    border-radius: 44cpx;
                    border: 1px solid #FF1940;
                }
                .cancle-btn{
                    color: #FF1940;
                }
                .save-btn{
                    background: #FF1940;
                    color: #fff;
                }
            }
        }
    }
</style>

<script>
import toast from '@catalyst/toast';
export default {
    props: {
        show: {
            type: Boolean,
            default: false,
        },
        reasonList: {
            type: Array,
            default: Array,
        },
    },
    data() {
        return {
            selectedReason: 0,
        };
    },
    methods: {
        // 关闭弹框
        closeDialog() {
            this.$emit('closeCancelDialog');
        },
        // 选择当前原因
        selectCurrentReason(index) {
            this.selectedReason = index;
        },
        // 确定取消订单
        saveCancel() {
            if (this.reasonList && this.reasonList[this.selectedReason]) {
                this.$emit('saveTradeTurnBack', this.reasonList[this.selectedReason].type);
            } else {
                toast('请选择原因～');
                return;
            }
        },
    },
};
</script>
