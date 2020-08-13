<template>
    <view class="content">
        <top-nav
            class="top-nav-ref"
            :title="pageTitle">
        </top-nav>
        <view class="page-container">
            <view class="page-content">
                <view class="info-line">
                    <view class="input-box name">
                        <input
                            v-model="addressDialog.name"
                            v-fix-input-dir
                            type="text"
                            placeholder="请输入收货人姓名" />
                    </view>
                </view>
                <view class="info-line">
                    <view class="input-box tel">
                        <input
                            v-model="addressDialog.tel"
                            v-fix-input-dir
                            type="tel"
                            placeholder="请输入手机号码"
                            @focus="clearTel" />
                    </view>
                </view>
                <view class="info-line">
                    <label class="info-label">所在地区</label>
                    <picker
                        class="area-choose"
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
                            请选择
                            <img src="http://h0.beicdn.com/open201909/098b34a907a5d295_45x45.png" alt="" class="right-arrow" />
                        </view>
                    </picker>
                </view>

                <view class="info-line">
                    <textarea
                        v-model="addressDialog.detail"
                        v-fix-input-dir
                        class="detail"
                        type="text"
                        placeholder="请输入详细地址（5-120个字）"
                        @input="detailInput">
                    </textarea>
                    <img
                        v-if="showClearBtn"
                        class="del-icon"
                        src="https://h0.beicdn.com/open202033/e5077672ca2d5a38_40x40.png"
                        @click.stop="delDetail" />
                </view>
                <view class="info-line">
                    <label class="info-label">设置默认地址</label>
                    <switch :checked="addressDialog.is_default" @change="switchChange"></switch>
                </view>
            </view>
            <view class="dialog-btn" @click="confirmAddress"><text>保存并使用</text></view>
        </view>
    </view>
</template>
<script>
import {login, checkLogin} from 'src/biz/wxmp/common/tool/login';
import {toast} from '@catalyst/modal';
// import storage from '@catalyst/storage';
// import fixInputDir from '../../../common/vue/directives/fixInputDir';
import api from './api';
import topNav from 'src/biz/wxmp/common/components/TopNav.vue';
// let requesting = false; // 是否正在请求
/* eslint-disable */
export default {
    components: {
        topNav,
    },
    data() {
        return {
            type: 'add', // 类型，编辑或者新增
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
            aid: '',
            nowAddress: {},
            hasSelectedRegion: false, // 是否选择过省市区
            provinceArr: [], // 选择的全部数据 数组
            customRegions: [],
            customIndex: [], // 选择的地址级联的三列 索引
            pageTitle: '',
            showClearBtn: false,
        };
    },
    onLoad(query) {
        this.type = query.type;
        this.aid = query.aid;
        this.pageTitle = query.type === 'edit'? '编辑地址': '新增地址';
        this.showClearBtn = query.type === 'edit'? true: false;
        checkLogin((isLogin) => {
            if (isLogin) {
                this.init();
            } else {
                login(() => {
                    this.init();
                });
            }
        });
    },
    mounted() {
    },
    computed: {},
    methods: {
        init() {
            // 初始化地址
            this.hasSelectedRegion = false;
            this.customRegions = [];
            this.provinceArr = [];
            if (this.type === 'edit' && this.aid){
                api.fetchAddress({
                    aid: this.aid,
                }).then((res) => {
                    let {name, mobile, province, city, area, address, is_default: isDefault} = res.addresses[0];
                    this.addressDialog = {
                        type: 'edit',
                        name,
                        tel: mobile,
                        addressIds: [province, city, area],
                        region: '',
                        detail: address,
                        is_default: isDefault,
                        region: `${res.addresses[0].province_text} ${res.addresses[0].city_text} ${res.addresses[0].area_text}`,
                    };
                    this.hasSelectedRegion = true;
                })
            }
            this.getOriRegions(1);
        },
        getRegion(id) {
            return api.fetchRegion({
                parent_id: id,
            });
        },
        switchChange(e) {
            this.addressDialog.is_default = e.detail.value;
        },
        // 编辑 或 新增 地址
        confirmAddress() {
            if (this.verifyInput()) {
                if (this.addressDialog.type === 'add') {
                    api.addAddress({
                        name: this.addressDialog.name,
                        tel: this.addressDialog.tel,
                        province: this.addressDialog.addressIds[0],
                        city: this.addressDialog.addressIds[1],
                        area: this.addressDialog.addressIds[2],
                        address: this.addressDialog.detail,
                        is_default: this.addressDialog.is_default,
                    })
                        .then((resp) => {
                            toast('添加成功');
                            wx.navigateBack();
                            this.$bus.emit('command', 'refresh');
                        })
                        .catch(this.handleErr);
                } else {
                    api.updateAddress({
                        aid: this.aid,
                        name: this.addressDialog.name,
                        tel: this.addressDialog.tel,
                        province: this.addressDialog.addressIds[0],
                        city: this.addressDialog.addressIds[1],
                        area: this.addressDialog.addressIds[2],
                        address: this.addressDialog.detail,
                        is_default: this.addressDialog.is_default,
                    })
                        .then((resp) => {
                            toast('更新成功');
                            wx.navigateBack();
                            this.$bus.emit('command', 'refresh');
                        })
                        .catch(this.handleErr);
                }
            }
        },
        verifyInput() {
            let msg = '';
            if (!this.addressDialog.name) {
                msg = msg || '请输入姓名';
            }
            if (!this.addressDialog.tel) {
                msg = msg || '请输入手机号';
            }
            if (!this.addressDialog.addressIds.length) {
                msg = msg || '请选择地区';
            }
            if (!this.addressDialog.detail) {
                msg = msg || '请输入详细地址';
            }
            if (msg) {
                this.handleErr(msg);
                return false;
            }
            return true;
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
        // 手机号获取焦点时清空数据
        clearTel() {
            if (this.addressDialog.tel) {
                this.addressDialog.tel = '';
            }

        },
        // 清空详细地址
        delDetail(e) {
            this.addressDialog.detail = '';
            this.showClearBtn = false;
        },
        // 输入详细地址
        detailInput(e) {
            if (e.detail.value) {
                this.showClearBtn = true;
            } else {
                this.showClearBtn = false;
            }
        },
        handleErr(e) {
            wx.showToast({
                title: e || e.message || e.msg || '请求失败，稍后再试～',
                icon: 'none',
                duration: 2000
            })
        },
    },
    directives: {
        // fixInputDir,
    },
};
</script>
<style src="./index.less" lang="less"></style>

