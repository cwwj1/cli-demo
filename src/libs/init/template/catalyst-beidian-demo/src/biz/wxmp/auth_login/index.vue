<template>
    <view class="content">
        <top-nav
            :title="'授权登录'">
        </top-nav>
        <image class="logo" src="https://h0.beicdn.com/open202019/54cb0b609fe57664_180x180.png"></image>
        <text v-if="type === 'avatar'" class="title">申请获取您的公开信息</text>
        <text v-if="type === 'avatar'" class="subtitle">（包含头像，昵称等）</text>
        <button
            v-if="canIUse && type === 'avatar'"
            class="authorize-btn"
            open-type="getUserInfo"
            @getuserinfo="getuserinfo">
            微信授权登录
        </button>
        <button
            v-else-if="canIUse && type === 'tel'"
            class="authorize-btn"
            open-type="getPhoneNumber"
            @getPhoneNumber="getPhoneNumber">
            微信手机号授权登录
        </button>
        <text v-else class="authorize-btn">请升级微信版本</text>
    </view>
</template>

<script>
import {loginDirectly, wxLogin} from 'src/biz/wxmp/common/tool/login';
import topNav from 'src/biz/wxmp/common/components/topNav.vue';
import {userInfoStorage} from 'src/biz/wxmp/common/tool/storage';

export default {
    components: {
        topNav,
    },
    data() {
        return {
            name: '掌柜云小店',
            canIUse: wx.canIUse('button.open-type.getUserInfo'),
            type: '',
            code: '',
        };
    },
    created() {
        this.type = this.$mp && this.$mp.options && this.$mp.options.type;
        this.init();
    },
    methods: {
        async init() {
            this.code = await wxLogin();
        },
        getuserinfo(e) {
            if (e.detail.userInfo) {
                const {encryptedData, iv} = e.detail;
                let params = {
                    encrypt_data: encryptedData,
                    iv,
                    register_type: 1,
                    is_avatar_authorization: 1,
                    code: this.code,
                };
                wx.showLoading({
                    title: '正在登陆...',
                    mask: true,
                });
                try {
                    loginDirectly((needTel) => {
                        wx.hideLoading();
                        if (needTel) {
                            this.type = 'tel';
                            return;
                        }
                        this.$bus.emit('authorized');
                        wx.navigateBack();
                    }, {
                        data: params,
                    });
                } catch (err) {
                    console.warn(err);
                    wx.hideLoading();
                }
            } else {
                // 拒绝
                this.$bus.emit('authorizedFail');
            }
        },
        async getPhoneNumber(e) {
            this.code = await wxLogin();
            const {encryptedData, iv} = e.detail;
            if (!encryptedData || !iv) {
                return;
            }
            let params = {
                encrypt_data: encryptedData,
                iv,
                register_type: 1,
                code: this.code,
                user_info: userInfoStorage.get(),
            };
            wx.showLoading({
                title: '正在登陆...',
                mask: true,
            });
            try {
                loginDirectly(() => {
                    wx.hideLoading();
                    this.$bus.emit('authorized');
                    wx.navigateBack();
                }, {
                    data: params,
                });
            } catch (err) {
                console.warn(err);
                wx.hideLoading();
            }
        },
    },
};
</script>

<style src="./index.less" lang="less"></style>
