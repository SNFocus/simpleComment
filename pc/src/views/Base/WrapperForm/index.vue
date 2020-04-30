<template>
  <a-row>
    <a-col :span="12">
      <sc-form-item label="注释内容">
        <textarea  v-model="content"  @change="onConfigChange"></textarea>
      </sc-form-item>
    </a-col>
    <a-col :span="12">
      <sc-form-item label="边框字符">
        <input type="text" v-model="char"  @change="onConfigChange">
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
  content = ''
  char = ''

  onConfigChange (): void {
    Bus.$emit('genComment', { comment: wrapComment(this.content, this.char) })
  }
}
</script>
