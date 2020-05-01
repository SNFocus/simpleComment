<template>
  <a-row>
    <a-col :span="12">
      <sc-form-item label="边框字符">
        <input type="text" v-model="char"  @change="onConfigChange">
      </sc-form-item>
    </a-col>
    <a-col :span="12">
      <sc-form-item label="Padding长度">
        <input type="text" v-model="padding"  @change="onConfigChange">
      </sc-form-item>
    </a-col>
    <a-col :span="12">
      <sc-form-item label="填充Padding">
        <sc-switch v-model="paddingWithChar" @change="onConfigChange"></sc-switch>
      </sc-form-item>
    </a-col>
    <a-col :span="24">
      <a-col :span="12">
        <sc-form-item label="注释内容">
          <textarea  v-model="content"  @change="onConfigChange"></textarea>
        </sc-form-item>
      </a-col>
    </a-col>
  </a-row>
</template>
<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import Bus from '@assets/utils/bus.ts'
import { wrapComment } from '@assets/utils/index.ts'

@Component
export default class WrapperForm extends Vue {
  content = '在这里写注释'
  char = '/'
  padding = 6
  paddingWithChar = true

  mounted () {
    this.onConfigChange()
  }

  onConfigChange (): void {
    Bus.$emit('genComment', { comment: wrapComment('  ' + this.content + '  ', this.char, this.padding, this.paddingWithChar) })
  }
}
</script>
