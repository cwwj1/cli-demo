import App from './index.vue';
import MegaloVue from 'vue';

if (ctl.isWeex) {
    App.el = '#app';
    new Vue(App);
} else if (ctl.isWeb) {
    App.el = '#app';
    new Vue(App);
} else if (ctl.isWx) {
    const app = new MegaloVue(App);
    app.$mount();
}

export default {
    config: {
        navigationStyle: 'default',
        navigationBarTitleText: '我的订单',
    },
};
