import App from './index.vue';
import MegaloVue from 'vue';

import performance from '@catalyst/statistics/src/performance';

// 下面的代码，是挂载 monitor，这样就可以直接在 三端的代码中，使用 `this.monitor.info('sss') 的方法咯`
if (ctl.isWeex) {
    App.el = '#app';
    new Vue(App);

    performance(13);
} else if (ctl.isWeb) {
    App.el = '#app';
    new Vue(App);

    performance(11);
} else if (ctl.isWx) {
    const app = new MegaloVue(App);
    app.$mount();
}

export default {
    config: {
        navigationBarTitleText: 'Index',
    },
};
