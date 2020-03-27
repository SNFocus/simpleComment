<template>
    <div>template</div>
</template>
<script lang="ts">
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Component, Prop, Vue } from 'vue-property-decorator'
import CONFIG from './config'

@Component
export default class BaseTemplate extends Vue {
    config = CONFIG;
}
</script>
