<template>
    <view class="content">
        <top-nav
            class="top-nav-ref"
            :title="'地址管理'">
        </top-nav>
        <view class="page-container">
            <view class="address-list">
                <view
                    v-for="(item, index) in addressList"
                    :key="index"
                    class="address-item"
                    @click="addressCardClick(item)">
                    <view class="info">
                        <view class="receive-info">
                            <view class="name">{{ item.name }}</view>
                            <view class="tel">{{ item.mobile }}</view>
                        </view>
                        <view class="address-info">
                            <span v-if="item.is_default" class="default">[默认地址]</span>
                            {{ item.province_text + item.city_text + item.area_text + item.address }}
                        </view>
                    </view>

                    <view class="operate">
                        <view class="operate-edit btn" @click.stop="editAddress(item)">
                            <text>编辑</text>
                        </view>
                        <view class="operate-delete btn" @click.stop="deleteAddress(item)">
                            <text>删除</text>
                        </view>
                    </view>
                </view>
            </view>
            <view class="bottom-layer">
                <view class="btn add-btn" @click="addAddress">
                    <text class="">添加新地址</text>
                </view>
                <!-- <view class="btn import-btn" @click="importWxAddress">
                    <text class="">导入微信地址</text>
                </view> -->
            </view>
            <view v-if="addressDialog.show" class="dialog-layer">
                <view class="edit-dialog">
                    <view class="icon-close" @click="addressDialog.show = false"></view>
                    <view class="dialog-title">
                        <text>{{ addressDialog.type === 'add' ? '添加地址' : '编辑地址' }}</text>
                    </view>
                    <view class="dialog-content">
                        <view class="info-line">
                            <view class="input-box name">
                                <input
                                    v-model="addressDialog.name"
                                    v-fix-input-dir
                                    type="text"
                                    placeholder="姓名" />
                            </view>
                            <view class="input-box tel">
                                <input
                                    v-model="addressDialog.tel"
                                    v-fix-input-dir
                                    type="tel"
                                    placeholder="手机号码" />
                            </view>
                        </view>
                        <picker
                            class="area-choose info-line"
                            mode="multiSelector"
                            :range="customRegions"
                            range-key="name"
                            :value="customIndex"
                            @change="customRegionChange"
                            @columnchange="customRegionColChange"
                        >
                            <view v-if="hasSelectedRegion" class="picker picker-text">
                                {{ addressDialog.region }}
                            </view>
                            <view v-else class="picker picker-text">
                                请选择 省/市/区
                                <img src="http://h0.beicdn.com/open201909/098b34a907a5d295_45x45.png" alt="" class="right-arrow" />
                            </view>
                        </picker>

                        <view class="info-line">
                            <input
                                v-model="addressDialog.detail"
                                v-fix-input-dir
                                class="detail"
                                type="text"
                                placeholder="请填写详细街道地址" />
                        </view>
                    </view>
                    <view class="dialog-btn" @click="confirmAddress"><text>确认</text></view>
                </view>
            </view>
        </view>
    </view>
</template>
<script>
import {login, checkLogin} from 'src/biz/wxmp/common/tool/login';
import {toast, confirm} from '@catalyst/modal';
// import storage from '@catalyst/storage';
// import fixInputDir from '../../../common/vue/directives/fixInputDir';
import api from './api';
import topNav from 'src/biz/wxmp/common/components/TopNav.vue';
let requesting = false; // 是否正在请求
// import {lists} from './mock';
/* eslint-disable */
export default {
    components: {
        topNav,
    },
    data() {
        return {
            statusFrom: '', // 地址来源
            addressList: [],
            addressDialog: {
                show: false,
                type: 'add',
                name: '',
                tel: '',
                addressIds: [],
                region: '',
                detail: '',
                is_default: false,
            },
            nowAddress: {},
            pageInfo: {
                page: 1,
                pageSize: 40,
                hasMore: false,
            },
            hasSelectedRegion: false, // 是否选择过省市区
            provinceArr: [], // 选择的全部数据 数组
            customRegions: [],
            customIndex: [], // 选择的地址级联的三列 索引
            titleOption: {
                title: '地址管理',
            },
        };
    },
    onLoad(query) {
        this.statusFrom = query.statusFrom;
        checkLogin((isLogin) => {
            if (isLogin) {
                this.getAddressList();
            } else {
                login(() => {
                    this.getAddressList();
                });
            }
        });
        this.$bus.on('authorized', () => {
            this.getAddressList();
        });
        this.$bus.on('command', (data) => {
            if (data === 'refresh') {
                console.log('refresh');
                this.reGetAddressList();
            }
        });
    },
    mounted() {
    },
    computed: {},
    methods: {
        getAddressList() {
            requesting = true;
            api.fetchAddress({
                page: this.pageInfo.page,
                page_size: this.pageInfo.pageSize,
            })
                .then((resp) => {
                    requesting = false;
                    this.addressList = [...this.addressList, ...resp.addresses];
                    this.pageInfo.hasMore = resp.count > resp.page * resp.page_size;
                    // 没有地址的兜底逻辑
                    if (!this.addressList.length && this.statusFrom === 'trade') {
                        this.importWxAddress();
                    }
                })
                .catch((e) => {
                    requesting = false;
                    this.handleErr(e);
                });
        },
        // 从微信导入地址
        importWxAddress() {
            let that = this;
            if (wx.chooseAddress) {
                wx.chooseAddress({
                    success(res) {
                        const {
                            userName,
                            // nationalCode,
                            detailInfo,
                            telNumber,
                        } = res;
                        const area = res.nationalCode;
                        const province = parseInt(area / 10000) * 10000;
                        const city = parseInt(area / 100) * 100;

                        api.addAddress({
                            name: userName,
                            tel: telNumber,
                            province,
                            city,
                            area,
                            address: detailInfo,
                        })
                            .then((resp) => {
                                this.reGetAddressList();
                            })
                            .catch(that.handleErr);
                    },
                    fail(res) {
                        console.log(res); // eslint-disable-line no-console
                    },
                });
            } else {
                this.handleErr('当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试');
            }
        },
        reGetAddressList() {
            this.pageInfo.page = 1;
            this.addressList = [];
            this.getAddressList();
        },
        getRegion(id) {
            return api.fetchRegion({
                parent_id: id,
            });
        },
        setDefault(item) {
            return api.updateAddress({
                aid: item.aid,
                name: item.name,
                tel: item.mobile,
                province: item.province,
                city: item.city,
                area: item.area,
                address: item.address,
                is_default: 1,
            })
                .then((resp) => {
                    this.addressList.forEach((address) => {
                        address.is_default = false;
                    });
                    item.is_default = true;
                })
                .catch(this.handleErr);
        },
        addressCardClick(item) {
            // 不是结算页面过来的暂不处理
            if (this.statusFrom !== 'trade') {
                return;
            } else {
                // 需要存储aid
                this.$bus.emit('address_id', item.aid);
                wx.navigateBack();
            }
        },
        editAddress(item) {
            wx.navigateTo({
                url: `/biz/wxmp/payment/add_address/index?type=edit&aid=${item.aid}`
            });
            
        },
        addAddress() {
            wx.navigateTo({
                url: `/biz/wxmp/payment/add_address/index?type=add`
            });
        },
        deleteAddress(item) {
            this.nowAddress = item;
            confirm({
                    title: '删除地址',
                    message: '删除后将不能恢复，是否确认删除？',
                    okTitle: '删除',
                    cancelTitle: '取消',
                }, (val) => {
                    if (val) {
                        api.deleteAddress(item.aid)
                            .then((resp) => {
                                toast('操作成功！');
                                this.reGetAddressList();
                            })
                            .catch((e) => {
                                console.log('操作失败');
                            });
                    }
                });
        },
        // 点击确认按钮 绑定选择的三列索引
        customRegionChange(e) {
            // toDo 比对下之前的数据
            const { value } = e.detail;
            this.customIndex = value;

            const provinceId = this.customRegions[0][this.customIndex[0]].id;
            const cityId = this.customRegions[1][this.customIndex[1]].id;
            const areaId = this.customRegions[2][this.customIndex[2]].id;

            const provinceName = this.customRegions[0][this.customIndex[0]].name;
            const cityName = this.customRegions[1][this.customIndex[1]].name;
            const areaName = this.customRegions[2][this.customIndex[2]].name;
            
            // if (!this.hasSelectedRegion) {
            this.addressDialog.addressIds = [];
            this.addressDialog.addressIds.push(provinceId, cityId, areaId);
            this.addressDialog.region = `${provinceName} ${cityName} ${areaName}`;
            this.hasSelectedRegion = true;
            // }
        },
        // 改变列值 需要拉取下级数据
        customRegionColChange(e) {
            const { column, value } = e.detail;
            const { customRegions } = this;
            const id = customRegions[column][value].id;
            this.getChangeRegion(column, value, id);
        },
        // 拉取下级数据
        getChangeRegion(column, value, id) {
            const self = this;
            api.getRegionData({
                parent_id: id,
            })
                .then((data) => {
                    if (data.success) {
                        const arr = [...self.customRegions];
                        if (column === 0) {
                            arr[1] = data.region_lists;
                            let indexArr = [...self.customIndex];
                            indexArr[0] = value;
                            indexArr[1] = 0;
                            this.customIndex = indexArr;
                            this.customRegions = arr;
                            self.getChangeRegion(1, 0, data.region_lists[0].id);
                        } else if (column === 1) {
                            arr[2] = data.region_lists;
                            let indexArr = [...self.customIndex];
                            indexArr[1] = value;
                            indexArr[2] = 0;
                            this.customIndex = indexArr;
                        } else if (column === 2) {
                            let indexArr = [...self.customIndex];
                            indexArr[2] = value;
                            this.customIndex = indexArr;
                        }
                        this.customRegions = arr;
                    }
                })
                .catch((e) => {
                    requesting = false;
                    this.handleErr(e);
                });
        },
        // 获取省份
        getOriRegions(id) {
            this.customIndex = [];
            api.getRegionData({
                parent_id: id,
            })
                .then((data) => {
                    this.provinceArr[0] = data.region_lists;

                    let _provinceId = this.addressDialog.addressIds[0] || this.provinceArr[0][0].id;
                    return this.getOriRegions2(_provinceId);
                })
                .catch((e) => {
                    requesting = false;
                    this.handleErr('网络错误，稍后再试');
                });
        },
        // 获取市
        getOriRegions2(id) {
            api.getRegionData({
                parent_id: id,
            })
                .then((data) => {
                    this.provinceArr[1] = data.region_lists;

                    let _cityId = this.addressDialog.addressIds[1] || this.provinceArr[1][0].id;
                    return this.getOriRegions3(_cityId);
                })
                .catch((e) => {
                    requesting = false;
                    this.handleErr('网络错误，稍后再试');
                });
        },
        // 获取区
        getOriRegions3(id, areaId) {
            api.getRegionData({
                parent_id: id,
            })
                .then((data) => {
                    this.provinceArr[2] = data.region_lists;
                    this.customRegions = this.provinceArr;

                    let provinceIdx = '';
                    this.provinceArr[0].forEach((itm,idx) => {
                        if(itm.id == this.addressDialog.addressIds[0]) {
                            provinceIdx = idx;
                        }
                    });

                    let cityIdx = '';
                    this.provinceArr[1].forEach((itm,idx) => {
                        if(itm.id == this.addressDialog.addressIds[1]) {
                            cityIdx = idx;
                        }
                    });

                    let areaIdx = '';
                    this.provinceArr[2].forEach((itm,idx) => {
                        if(itm.id == this.addressDialog.addressIds[2]) {
                            areaIdx = idx;
                        }
                    });

                    if (this.customIndex.length !== 3) {
                        this.customIndex = [];
                        this.customIndex.push(0 ,0 ,0);
                    }
                    this.$nextTick(() => {
                        this.customIndex = [];
                        this.customIndex.push(provinceIdx ,cityIdx ,areaIdx);
                    })
                })
                .catch((e) => {
                    requesting = false;
                    this.handleErr('网络错误，稍后再试');
                });
        },
        // 加载更多
        onReachBottom() {
            this.loadMore();
        },
        loadMore() {
            if (requesting || !this.pageInfo.hasMore) {
                return;
            }
            this.pageInfo.page += 1;
            this.getAddressList();
        },
        handleErr(e) {
            wx.showToast({
                title: e || e.message || e.msg || '请求失败，稍后再试～',
                icon: 'none',
                duration: 2000
            })
        },
    },
    onUnload() {
        this.$bus.off('command');
    },
    directives: {
        // fixInputDir,
    },
};
</script>
<style src="./index.less" lang="less"></style>

