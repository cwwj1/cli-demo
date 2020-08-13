<template>
    <view v-if="isShow" :style="itemStyle" :class="['barrage-item', 'animation', sppedClass]">
        <image class="avator" :src="data.avator"></image>
        <text class="text">
            {{ data.desc }}
        </text>
    </view>
</template>

<script>
const px = (val) => {
    if (ctl.isWeb) {
        return `${val / 46.875}rem`;
    }
    return `${val}rpx`;
};
export default ({
    props: {
        data: {
            type: Object,
            default: () => ({}),
        },
        index: {
            type: Number,
            default: 0,
        },
    },
    data() {
        return {
            isShow: false,
            itemStyle: {
                left: px(750),
                top: px((Math.random() * 40) - 20),
            },
            speedClass: '',
        };
    },
    created() {
        const randomTime = Math.ceil(Math.random() * 5) + 3;
        this.sppedClass = `a${randomTime}`;
        setTimeout(() => {
            this.isShow = true;
            setInterval(() => {
                this.$emit('itemoutofscreen', this.data);
                this.itemStyle.top = px((Math.random() * 40) - 20);
            }, 1000 * randomTime);
        }, this.index * 2000);
    },
});
</script>
<style src="./item.less" lang="less" scoped></style>
