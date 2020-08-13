<template>
    <web-view :src="url"></web-view>
</template>

<script>
import {parse} from '@catalyst/httpurl';

export default {
    data() {
        return {
            url: '',
        };
    },
    created() {
        const {url} = parse().query;
        this.url = decodeURIComponent(url);
    },
};

</script>
