<template>
  <a-row>
    <a-col :span="12">
      <sc-form-item :label="'字符比'">
           <input type="text" v-model.number="charRatio" @change="ev => onCharRatioChange">
       </sc-form-item>
       <span class="tip">中英文字符在实际宽度上存在差异，目前默认 中文: 英文 = 1 : 1.83</span>
    </a-col>
  </a-row>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { getCharRatio } from '@assets/utils'
@Component
export default class SettingForm extends Vue {
  charRatio: number = getCharRatio()

  onCharRatioChange () {
    localStorage.charRatio = +this.charRatio
    window.charRatio = +this.charRatio
  }
}
</script>
<style lang="scss" scoped>
.tip{
  color: $color-tip;
  font-size: 12px;
  margin-left: 2rem;
  line-height: 12px;
}
</style>
