<template>
    <view v-if="showCanvas">
        <canvas
            :canvas-id="canvasId"
            :style="{'width' : width + 'px', 'height': height + 'px'}"
            style="position:fixed; top: -999px; left: -999px;"
        >
        </canvas>
    </view>
</template>

<script>
/**
 * canvas绘制图片组件封装
 * 使用如下：
 * 传递所需参数，其中config表示此canvas的基础信息
 * 通过绑定相应事件接收绘制完成的文件path。
 */
import {
    drawPoster,
    canvasToTempFilePath,
    saveFile,
    onlineImageToLocalImage,
    measureText,
    getUUID,
} from './utils';

export default {
    props: {
        // 原数据
        config: {
            type: Array,
            default: [],
        },
        // 是否需要保存为本地文件
        useSave: {
            type: Boolean,
            default: false,
        },
        width: Number,
        height: Number,
        // 需要处理图片下载失败的异常情况,如果为false，则可以绑定error事件进行监听异常情况
        failover: {
            type: Boolean,
            default: true,
        },
    },
    data() {
        return {
            // 生成一个随机id
            canvasId: `${getUUID()}`,
            showCanvas: false,
        };
    },
    watch: {
        config(val) {
            console.log('watch config', val);
            this._startTask(val);
        },
    },
    methods: {
        _getContext() {
            return Megalo.createCanvasContext(this.canvasId, this);
        },
        _measureText(text, size) {
            return measureText(this._getContext(), text, size);
        },
        _startTask(renderData) {
            this.showCanvas = true;
            const onLineMap = this._getOnLineImgMap(renderData);
            // 先将外部图片资源下载到本地，再进行绘制。
            return onlineImageToLocalImage(onLineMap)
                .then((pathMap) => {
                    Object.keys(pathMap).forEach((key) => {
                        renderData[key].image = pathMap[key];
                        if (!pathMap[key] && !this.failover) {
                            throw new Error('失败');
                        }
                    });
                })
                .then(() => this._startDraw(renderData))
                .then(() => this._transferTempFile())
                .then((res) => this._handleFile(res))
                .catch((e) => this._handleError(e));
        },
        // 开始绘制
        _startDraw(renderData) {
            return drawPoster({
                ctx: this._getContext(),
                data: renderData,
                width: this.width,
                height: this.height,
            });
        },
        // 将canvas转为临时文件
        _transferTempFile() {
            return canvasToTempFilePath({
                canvasId: this.canvasId,
            }, this._getContext());
        },
        // 处理生成的文件
        _handleFile({tempFilePath}) {
            this.$emit('created', {
                path: tempFilePath,
            });
            if (this.useSave) {
                saveFile(tempFilePath)
                    .then(({savedFilePath}) => {
                        this.$emit('saved', {
                            path: savedFilePath,
                        });
                    })
                    .catch((e) => {
                        console.warn(e);
                    });
            }
        },
        _handleError(e) {
            this.$emit('error');
        },
        // 资源文件提取
        _getOnLineImgMap(renderData) {
            // 匹配需要下载图片的绘制描述类型，目前image和box两种类型需要下载图片
            const pattDownLoadImage = /image|box/;
            const map = {};
            renderData.forEach((item, index) => {
                if (item && pattDownLoadImage.test(item.type) && item.src) {
                    map[index] = item.src;
                }
            });
            return map;
        },
    },
};
</script>
