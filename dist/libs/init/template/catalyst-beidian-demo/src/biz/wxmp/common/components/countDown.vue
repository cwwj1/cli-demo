<!--
 * @Author: yuxue.yang
 * @Description: countdown组件 适用所有场景
 * @Date: 2019-08-28 14:27:01
 * @LastEditors: yuxue.yang
 * @LastEditTime: 2019-09-03 13:37:34
 -->
<!--
// demo 根据模板直接显示文案
<countdown
    tpl='{dd}:{hh}:{mm}:{ss}'
    :time="demoTime"
    @cdOnComplete="onCompleted">
</countdown>
// 返回需要的模板数据，样式完全自定义
<countdown
    :interval="100"
    :time="TIME">
    <view class="demo-wrap" slot-scope="{data}">
        <text class="demo-border">{{data.s}}</text>
        <text class="demo-dot">秒</text>
    </view>
</countdown>
</view>
-->
<template>
    <view>
        <view v-if="tpl">
            <text v-if="completed && finishText">
                {{ finishText }}
            </text>
            <text v-else>
                {{ timeStr }}
            </text>
        </view>
        <slot :data="countDownData"></slot>
    </view>
</template>
<script>
// 定义常量
const TIME = {
    D: 24 * 60 * 60 * 1000,
    H: 60 * 60 * 1000,
    M: 60 * 1000,
    S: 1000,
    MS: 1000 / 10,
};
export default {
    props: {
        // 时间戳
        time: {
            type: Number,
            default: new Date().getTime() + 1000,
        },
        // 倒计时的间隔,单位为"毫秒"
        interval: {
            type: Number,
            default: 1000,
        },
        // 开始倒计时单位
        maxDot: {
            type: String,
            default: 'd',
        },
        // 模板 任意组合 重复代表需要补0 {dd}:{hh}:{mm}:{ss}
        tpl: {
            type: String,
            default: '',
        },
        finishText: {
            type: String,
            default: '',
        },
    },
    data: () => ({
        NOW_DATE: new Date().getTime(),
        completed: false,
        timeStr: '',
    }),
    computed: {
        tplData() {
            return this.tpl ?
                this.tpl.match(/{(dd|d|hh|h|mm|m|ss|s|ms|msms)}/g) : [''];
        },
        countDownData() {
            const timeSpacing = (this.time * 1000) - this.NOW_DATE;
            // 倒计时结束了
            if (timeSpacing < 0) {
                if (this.completed === false) {
                    this.$emit('cdOnComplete');
                }
                // 避免出现负数倒计时情况
                return this.handleCountDownData(0);
            }
            return this.handleCountDownData(timeSpacing);
        },
    },
    mounted() {
        setInterval(() => {
            this.NOW_DATE = new Date().getTime();
        }, this.interval);
    },
    methods: {
        // 默认从天开始倒计时
        dayCountDown(timeSpacing) {
            /* eslint-disable id-length */
            const {
                D, H, M, S, MS,
            } = TIME;
            const d = Math.floor(timeSpacing / D);
            const h = Math.floor((timeSpacing - (d * D)) / H);
            const m = Math.floor((timeSpacing - (d * D) - (h * H)) / M);
            const s = Math.floor((timeSpacing - (d * D) - (h * H)) % M / S);
            const ms = Math.floor((timeSpacing - (d * D) - (h * H) - (m * M)) % S / MS);
            return {
                d, dd: this.strFormat(d),
                h, hh: this.strFormat(h),
                m, mm: this.strFormat(m),
                s, ss: this.strFormat(s),
                ms, msms: this.strFormat(ms),
            };
        },
        // 最大单位倒计时计算
        totalCountDown(timeSpacing, maxDot) {
            // 不支持ms作为最大单位
            return Math.floor(timeSpacing / TIME[maxDot.toUpperCase().slice(0, 1)]);
        },
        // 整理倒计时数据
        handleCountDownData(timeSpacing) {
            if (!timeSpacing) {
                this.completed = true;
            }
            const index = this.tplData[0].replace(/[{}]/g, '');
            const maxDot = this.tpl ? index : this.maxDot;
            const maxDotData = this.totalCountDown(timeSpacing, maxDot);
            const countDownData = this.dayCountDown(timeSpacing);
            // 处理最大单位
            if (this.tpl) {
                countDownData[index] = index.length === 2 ? this.strFormat(maxDotData) : maxDotData;
                // 拼装结果
                this.timeStr = this.tpl.replace(
                    /{(dd|d|hh|h|mm|m|ss|s|ms|msms)}/g,
                    (t) => countDownData[t.replace(/[{}]/g, '')]
                );
            } else {
                countDownData[this.maxDot] = maxDotData;
                countDownData[this.maxDot + this.maxDot] = this.strFormat(maxDotData);
            }
            return countDownData;
        },
        strFormat(str) {
            return str < 10 ? `0${str}` : str;
        },
    },
};
</script>
