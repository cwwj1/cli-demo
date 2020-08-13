<template>
    <div></div>
</template>

<script>
import Vue from 'vue';
// import skynet from '@catalyst/skynet';
import Bus from './biz/wxmp/common/tool/bus';
// 增强小程序生命周期
require('./biz/wxmp/common/tool/pageExtend');
import {userAuthStorage, userInfoStorage} from './biz/wxmp/common/tool/storage';

Vue.use(Bus);
// 该文件App.vue 里面的内容，只是服务于 megalo，不会影响 h5 和 weex
// 因此，可以在该文件中，做一些小程序api的磨平工作
export default {
    onLaunch() {
        // eslint-disable-next-line no-console
        console.log('onLaunch');
    },
    onShow(options) {
        // 把这个放在onshow里的原因是 referrer要随时保持最新
        this.globalData.referrer = options;
    },
    // 在 onError 中全局捕获错误并上报
    onError(e) {
        // 接天网 todo
    },
    // 自定义404页面
    onPageNotFound(res) {
        wx.redirectTo({
            url: '/biz/wxmp/store_home/index',
        });
    },
    onHide() {
        userAuthStorage.remove();
        userInfoStorage.remove();
    },
    globalData() {
        return {
            package: 'wxmp_bd_youtuan',
        };
    },
};
</script>
