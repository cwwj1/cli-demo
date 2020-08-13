<template>
    <view class="barrage">
        <barrage-item
            v-for="(item, xindex) in num"
            :key="xindex"
            :index="xindex"
            :data="data[index]"
            @itemoutofscreen="itemoutofscreen"
        ></barrage-item>
    </view>
</template>

<script>
import barrageItem from './item.vue';

export default ({
    components: {
        barrageItem,
    },
    props: {
        data: {
            type: Array,
            default: () => ([]),
        },
    },
    data() {
        return {
            num: ['', '', ''], // 弹幕数
            index: 0,
        };
    },
    created() {
        this.index = this.num.length;
    },
    methods: {
        itemoutofscreen(data) {
            this.index += 1;
            const dataIndex = this.index % this.data.length;
            data.avator = this.data[dataIndex].avator;
            data.desc = this.data[dataIndex].desc;
        },
    },
});
</script>
<style src="./main.less" lang="less" scoped></style>

