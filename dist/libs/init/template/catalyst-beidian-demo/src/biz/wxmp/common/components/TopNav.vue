<template>
    <view id="top-nav" class="_top_nav_container" :style="{'height': translate ? 'auto':`${navTopHeight}px`}">
        <!-- 默认样式 -->
        <view
            v-if="!showTranslate"
            class="top-nav"
            :class="fadeIn"
            :style="{'background-image': backgroundImage, 'background-color': backgroundColor}">
            <view class="top-nav__status-bar" :style="{'height': `${statusBarHeight}px`}"></view>
            <view class="top-nav__nav-bar" :style="{'height': `${navBarHeight}px`}">
                <!-- 左侧按钮 -->
                <view class="top-nav__btn-box">
                    <view
                        v-if="!isTab && showBackBtn"
                        class="top-nav__back-btn-wrapper"
                        @click="navigateBack">
                        <view class="top-nav__back-btn"></view>
                    </view>
                    <view
                        v-if="!isTab && showHomeBtn"
                        class="top-nav__home-btn-wrapper"
                        @click="goIndex">
                        <image class="top-nav__home-btn" src="http://h0.beicdn.com/open201915/4c51de395fa07e95_44x44.png"></image>
                    </view>
                </view>
                <!-- 文字标题 -->
                <view v-if="titleType === 'text'" class="top-nav__title" :style="{'color': titleColor}">{{ title }}</view>
                <!-- logo 标题 -->
                <image
                    v-if="titleType === 'logo'"
                    class="top-nav__title"
                    :src="logoSrc"
                    :style="{'width': `${logoWidth}rpx`, 'height': `${logoHeight}rpx`}">
                </image>
                <!-- tab 标题 -->
                <view v-if="titleType === 'tab'" class="top-nav__title-tab-wrapper">
                    <view
                        v-for="(item, index) in titleTabs"
                        :key="index"
                        class="top-nav__title-tab"
                        :class="{'active': activeTabIndex === index }"
                        @click="tabClick(index)">
                        <text>{{ item }}</text>
                    </view>
                </view>
                <!-- slot -->
                <template v-if="titleType === 'slot'">
                    <slot></slot>
                </template>
            </view>
        </view>

        <!-- 沉浸样式 -->
        <view v-if="showTranslate" class="top-nav">
            <view class="top-nav__status-bar" :style="{'height': `${statusBarHeight}px`}"></view>
            <view class="top-nav__nav-bar" :style="{'height': `${navBarHeight}px`}">
                <view
                    v-if="!isTab && showBackBtn"
                    class="top-nav__back-btn-circle"
                    @click="navigateBack">
                    <view class="top-nav__back-btn-arrow"></view>
                </view>
            </view>
        </view>
    </view>
</template>

<script >
const DEFAULT_NAVBAR_HEIGHT = 44; // 默认 nav bar 高度
const DEFAULT_STATUSBAR_HEIGHT = 20; // 默认 status bar 高度

let statusBarHeight; // 状态栏高度
let navBarHeight; // 导航栏高度

// 获取状态栏高度
const getStatusBarHeight = () => {
    // 如果已经缓存了，则用
    if (statusBarHeight) {
        return statusBarHeight;
    }
    try {
        const systemInfo = wx.getSystemInfoSync();
        statusBarHeight = systemInfo.statusBarHeight;
        return statusBarHeight;
    } catch (error) {
        return DEFAULT_STATUSBAR_HEIGHT;
    }
};
    // 获取胶囊按钮布局信息
const getMenuButtonRect = () => {
    // 基础库 2.1.0 以上
    if (wx && wx.getMenuButtonBoundingClientRect) {
        try {
            return wx.getMenuButtonBoundingClientRect();
        } catch (error) {
            return {};
        }
    }
    return {};
};

export default {
    props: {
        titleType: {
            type: String,
            default: 'text',
        },
        title: {
            type: String,
            default: '标题',
        },
        titleColor: {
            type: String,
            default: '#000',
        },
        logoSrc: {
            type: String,
            default: '',
        },
        logoWidth: {
            type: Number,
            default: 88,
        },
        logoHeight: {
            type: Number,
            default: 44,
        },
        titleTabs: {
            type: Array,
            default: ['标题1', '标题2'],
        },
        backgroundImage: {
            type: String,
            default: '',
            // default: 'linear-gradient(90deg, #FF335C 0%, #FF1940 100%)',
        },
        backgroundColor: {
            type: String,
            default: '#fff',
        },
        indexPath: {
            type: String,
            default: '/biz/wxmp/store/home/index',
        },
        isTab: {
            type: Boolean,
            default: false,
        },
        showBackBtn: {
            type: Boolean,
            default: true,
        },
        showHomeBtn: {
            type: Boolean,
            default: false,
        },
        translate: {
            type: Boolean,
            default: false,
        },
    },
    data() {
        return {
            showTranslate: false, // 显示默认样式的导航
            activeTabIndex: 0,
            fadeIn: '',
            statusBarHeight: 0,
            navBarHeight: 0,
            navTopHeight: 0,
        };
    },
    mounted() {
        this.showTranslate = this.translate;
        // 计算高度
        this._calculateHeight();
        // 渲染标题 tabs
        this._renderTitleTabs();
    },
    methods: {
        _calculateHeight() {
            let _statusBarHeight = getStatusBarHeight();
            let _menuButtonRect = getMenuButtonRect() || {};
            const {height, top} = _menuButtonRect;
            if (top) {
                const navBarPadding = top - _statusBarHeight;
                navBarHeight = navBarHeight || ((navBarPadding * 2) + height);
            } else {
                navBarHeight = DEFAULT_NAVBAR_HEIGHT;
            }
            this.statusBarHeight = _statusBarHeight;
            this.navBarHeight = navBarHeight;
            this.navTopHeight = _statusBarHeight + navBarHeight;
        },
        _renderTitleTabs() {
            if (!this.useTitleTab) {
                return;
            }
            if (!this.titleTabs.length) {
                throw new Error('导航栏标题 tabs 不能为空数组！请检查组件属性 titleTabs');
            }
        },
        navigateBack() {
            this.$emit('navigateback');
            // 如果页面栈只有一个，跳到首页
            // let pages = getCurrentPages();
            // if (pages.length === 1) {
            //     wx.switchTab({
            //         url: this.indexPath,
            //         fail: () => {
            //             wx.redirectTo({
            //                 url: this.indexPath,
            //                 fail: (e) => {
            //                     throw e;
            //                 },
            //             });
            //         },
            //     });
            // } else {
            // }
            wx.navigateBack();
        },
        goIndex() {
            this.$emit('goindex');
            wx.switchTab({
                url: this.indexPath,
                fail: () => {
                    wx.redirectTo({
                        url: this.indexPath,
                        fail: (e) => {
                            throw e;
                        },
                    });
                },
            });
        },
        tabClick(index) {
            this.$emit('navtabchange', {
                index,
            });
            if (index !== this.activeTabIndex) {
                this.activeTabIndex = index;
            }
        },
    },
};

</script>

<style lang="less">
@base:46.875rem;

.top-nav {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 999;
    background-size: 100%;

    &.fade-in {
        opacity: 0;
        animation: fade-in .3s linear;
    }

    &__nav-bar {
        display: flex;
        align-items: center;
        justify-content: center;
        position: relative;
    }

    &__title {
        max-width: 300rpx;
        font-size: 32rpx;
        font-weight: 600;
        overflow: hidden;
        white-space: nowrap;
        word-break: break-all;
        text-overflow: ellipsis;

    }

    &__title-tab-wrapper {
        display: flex;
        align-items: center;
        justify-content: center;
        height: 100%;
    }

    &__title-tab {
        display: flex;
        align-items: center;
        justify-content: center;
        position: relative;
        height: 100%;
        padding: 0 20rpx;
        font-size: 30rpx;

        &.active {
            color: #ff1a1a;
        }

        &.active::before {
            content: '';
            position: absolute;
            left: 50%;
            bottom: 4px;
            width: 50%;
            height: 2px;
            border-radius: 2rpx;
            transform: translateX(-50%);
            background: #ff1a1a;
        }
    }

    &__btn-box {
        position: absolute;
        left: 0;
        top: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        height: 100%;
    }

    &__back-btn-wrapper {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 70rpx;
        height: 100%;
    }

    &__back-btn {
        width: 22rpx;
        height: 22rpx;
        margin-top: 2rpx;
        margin-left: 8rpx;
        border-top: 2px solid #000;
        border-left: 2px solid #000;
        transform: rotateZ(-45deg);
    }

    &__home-btn-wrapper {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 70rpx;
        height: 100%;
    }

    &__home-btn {
        width: 44rpx;
        height: 44rpx;
    }

    &__back-btn-circle {
        display: flex;
        align-items: center;
        justify-content: center;
        position: absolute;
        left: 24rpx;
        top: 50%;
        transform: translateY(-50%);
        width: 60rpx;
        height: 60rpx;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.60);
        border: 1px solid rgba(0, 0, 0, 0.08);

        &.hover {
            background: rgba(0, 0, 0, 0.18);
        }
    }

    &__back-btn-arrow {
        width: 18rpx;
        height: 18rpx;
        margin-left: 8rpx;
        border-top: 1px solid #000;
        border-left: 1px solid #000;
        transform: rotate(-45deg);
    }
}

@keyframes fade-in {
    0% {
        opacity: 0;
    }
    100% {
        opacity: 1;
    }
}
</style>
