<template>
  <a-row>
    <a-col :span="12">
      <sc-form-item label="使用文本填充">
        <sc-switch v-model="paddingWithChar" @change="onConfigChange"></sc-switch>
      </sc-form-item>
    </a-col>

    <a-col :span="12">
      <sc-form-item label="填充长度">
        <input type="text" v-model="paddingLenth"  @change="onConfigChange">
      </sc-form-item>
    </a-col>

    <a-col :span="12">
      <sc-form-item label="上下边框">
        <input type="text" v-model="verticalChar"  @change="onConfigChange">
      </sc-form-item>
    </a-col>
    <a-col :span="12">
      <sc-form-item label="左右边框">
        <input type="text" v-model="horizontalChar"  @change="onConfigChange">
      </sc-form-item>
    </a-col>
    <a-col :span="13">
      <sc-form-item label="四角符号">
        <input type="text" v-model="quadrangleChar"  @change="onConfigChange">
      </sc-form-item>
    </a-col>

    <a-col :span="24">
      <sc-form-item label="注释内容">
        <textarea cols="50"  v-model="content"  @change="onConfigChange"></textarea>
      </sc-form-item>
    </a-col>
  </a-row>
</template>
<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import Bus from '@assets/utils/bus.ts'
import { wrapComment } from '@assets/utils/index.ts'

@Component
export default class WrapperForm extends Vue {
  content = ' 在这里写注释 '
  verticalChar = '|'
  horizontalChar = '——'
  quadrangleChar = '+'
  paddingLenth = 6
  paddingWithChar = true

  mounted () {
    this.onConfigChange()
  }

  onConfigChange (): void {
    Bus.$emit('genComment', {
      comment: wrapComment({
        content: this.content,
        verticalChar: this.verticalChar,
        horizontalChar: this.horizontalChar,
        quadrangleChar: this.quadrangleChar,
        paddingLenth: this.paddingLenth,
        paddingWithChar: this.paddingWithChar
      })
    })
  }
}
</script>
