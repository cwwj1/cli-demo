/*
 * @Author: lin.cao
 * @Date: 2020-04-26 11:43:33
 * @LastEditTime: 2020-04-30 14:35:33
 * @LastEditors: lin.cao
 * @Description: 全局广播
 * @FilePath: /catalyst_beicang/src/biz/wxmp/common/tool/bus.js
 */
let bus;

export default (Vue) => {
    bus = bus || new Vue();

    Object.defineProperties(bus, {
        on: {
            get() {
                return this.$on;
            },
        },
        off: {
            get() {
                return this.$off;
            },
        },
        once: {
            get() {
                return this.$once;
            },
        },
        emit: {
            get() {
                return this.$emit;
            },
        },
    });

    Vue.bus = bus;
    Object.defineProperty(Vue.prototype, '$bus', {
        get() {
            return bus;
        },
    });
};
