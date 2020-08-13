<template>
    <view class="content">
        <text>222</text>
        <img
            src="http://h0.beicdn.com/open202003/c908f28d5fca0583_566x976.png"
            style="position: absolute;width: 361px;"
        />
        <barrage :data="barrageData"></barrage>
    </view>
</template>

<script>
import barrage from './barrage2/main.vue';

const barrageData = [];
for (let i = 0; i < 66; i++) {
    barrageData.push({
        avator: 'http://h0.beicdn.com/open201927/a1545ae5abeb2a96_400x400.png',
        desc: `Catalyst第${i + 1}次祝大家鼠年快乐`,
    });
}

export default ({
    el: '#app',
    components: {
        barrage,
    },
    data() {
        return {
            barrageData,
        };
    },
    methods: {
        sendLog() {
            // eslint-disable-next-line no-console
            console.log('1111');
        },
    },
});
</script>
<style src="./index.less" lang="less" scoped></style>
