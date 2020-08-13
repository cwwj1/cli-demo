<template>
    <view
        v-if="item && item.avatar"
        :class="['marquee-wrap', isShow ? 'animation-fade':'']">
        <image class="avatar" :src="item.avatar"></image>
        <text class="desc">{{ item.text }}</text>
    </view>
</template>

<script>
export default {
    data() {
        return {
            item: {},
            isShow: false,
            interval: null,
        };
    },
    beforeDestroy() {
        this.interval = null;
    },
    methods: {
        init(data) {
            const length = data.length;
            let index = 0;
            this.item = {
                avatar: data[index].avatar,
                text: data[index].sell_title,
            };
            const run = () => {
                this.interval = setInterval(() => {
                    if (index === length) {
                        index = 0;
                    }
                    const target = data[index];
                    this.item = {
                        avatar: target.avatar,
                        text: target.sell_title,
                    };
                    this.isShow = true;
                    index += 1;
                    setTimeout(() => {
                        this.isShow = false;
                    }, 3000);
                }, 4000);
            };
            run();
        },
    },
};
</script>

<style lang="less">
.marquee-wrap {
    position: fixed;
    left: 24cpx;
    top: 40cpx;
    display: flex;
    flex-direction: row;
    align-items: center;
    width: 342cpx;
    height: 48cpx;
    background: rgba(0,0,0,0.60);
    border-radius: 24cpx;
    opacity: 0;
    &.show {
        opacity: 1;
    }
    &.hide {
        opacity: 0;
    }
    .avatar {
        width: 44cpx;
        height: 44cpx;
        border-radius: 44cpx;
        margin-left: 2cpx;
        margin-right: 12cpx;
    }
    .desc {
        font-size: 24cpx;
        color: #FFFFFF;
        white-space: nowrap;
        word-break: break-all;
        text-overflow: ellipsis;
        overflow: hidden;
    }
}

.animation-fade {
    animation: 5s fade;
}

@keyframes fade {
    0% {
        opacity: 0;
    }
    20% {
        opacity: 1;
    }
    40% {
        opacity: 1;
    }
    60% {
        opacity: 0;
    }
    100% {
        opacity: 0;
    }
}
</style>
