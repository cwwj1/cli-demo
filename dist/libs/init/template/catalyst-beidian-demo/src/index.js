import App from './App';
import Vue from 'vue';

// import Vuex from 'vuex';
import VHtmlPlugin from '@megalo/vhtml-plugin';

// Vue.use(Vuex);
Vue.use(VHtmlPlugin);

const app = new Vue(App);

app.$mount();

export default {
    config: {
        window: {
            backgroundTextStyle: 'light',
            navigationBarBackgroundColor: '#fff',
            navigationStyle: 'custom',
            navigationBarTitleText: 'WeChat',
            navigationBarTextStyle: 'black',
        },
        pages: [
            'biz/wxmp/store_home/index', // 店铺首页
            'biz/wxmp/detail/index', // 商详
            'biz/wxmp/trade/index', // 结算
            'biz/wxmp/auth_login/index', // 授权中间页
        ],
        subPackages: [
            {
                root: 'biz/wxmp/payment',
                pages: [
                    'shipment/index', // 物流详情
                    'address/index', // 地址管理
                    'add_address/index', // 新增地址
                    'order_detail/index', // 订单详情
                    'order_list/index', // 订单列表
                    'pay_success/index', // 支付成功
                ],
            },
            {
                root: 'biz/wxmp/tool_page',
                pages: ['wxmp_webview/index'],
            },
        ],
    },
};
