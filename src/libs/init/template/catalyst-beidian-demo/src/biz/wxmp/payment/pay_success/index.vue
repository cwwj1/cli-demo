<template>
    <view class="page-wrap">
        <!-- 标题 -->
        <top-nav
            :title="titleOption.title">
        </top-nav>
        <!-- 提醒字样 -->
        <view class="noteText">
            请不要点击贝店平台以外的网址链接进行售后操作，或向任何人透露银行卡密码信息，谨防受骗。
        </view>
        <!-- 支付成功模块 -->
        <view class="white-wrap">
            <view class="remind">
                <image src="http://h0.beicdn.com/open202017/8a10991250c1ebac_48x48.png" class="remind-img"></image>
                <text class="remind-text">支付成功</text>
            </view>
            <view class="check" @click="goOrder">
                <text class="check-text">查看订单</text>
            </view>
            <!-- 地址模块 -->
            <view class="adress">
                <image src="http://h0.beicdn.com/open202033/17c2f3e2d142f82e_48x48.png" class="adress-icon"></image>
                <view class="adress-content">
                    <view class="adress-user">
                        要个 13234234234
                    </view>
                    <view class="adress-detail">浙江省 杭州市 江干区 九盛路9号东方电子商务园区12幢浙江省 杭州市 江干区 九盛路9号东方电子商务园区12幢</view>
                </view>
            </view>
        </view>
    </view>
</template>

<style src="./index.less" lang="less"></style>

<script>
import topNav from '../../common/components/TopNav';
import api from './api';
// import toast from '@catalyst/toast';

export default {
    components: {
        topNav,
    },
    data() {
        return {
            titleOption: {
                title: '支付结果',
            },
            oid: '',
            adress: {
                name: '',
                tel: '',
                detail: '',
            },
        };
    },
    onLoad(params) {
        this.oid = params.oid;
        this.getAdress();
    },
    mounted() {
    },
    methods: {
        goOrder() {
            wx.redirectTo({
                // todo
                url: `/biz/wxmp/payment/order_list/index?type=all`,
            });
        },
        // 拿到订单对应的地址
        getAdress() {
            api.fetchData({
                oid: this.oid,
            }).then((resp) => {
                if (resp.success && resp.data) {
                    console.log('resp====', resp);
                }
            })
                .catch((e) => {
                    console.warn(e);
                });
        },
    },
};
</script>
