<template>
  <div class="custom">
    <a-row :gutter="16">
      <a-col :span="8" v-for="item in customComments" :key="item.id">
        <section class="card">
          <div class="card__title">
            <div class="card__info">
              快捷键 : {{item.shortCuts.join(' + ')}}
            </div>
            <div class="actions">
              <a-icon type="edit" class="action-item" @click="onEdit(item)" />
              <a-icon type="delete" class="action-item" @click="onDelete(item)"/>
              <a-icon type="zoom-in" class="action-item" @click="onPreview(item)" />
              <a-icon type="copy" class="action-item" @click="copyData(item.comment)" />
            </div>
          </div>
          <pre class="card__comment">{{item.comment}}</pre>
        </section>
      </a-col>
      <section class="add-btn" @click="modalVisible = true">
        <a-icon type="plus" class="icon"  />
      </section>
    </a-row>
    <a-modal
      title="添加/修改"
      style="top: 40px;"
      v-model="modalVisible"
      @ok="setCustomConf"
      width="700px"
      @cancel="onCancel" >
      <a-input-group compact style="margin: .5rem  0 1rem ;">
        <a-select v-model="editComm.shortCuts[0]">
          <a-select-option value="Ctrl">
            Ctrl
          </a-select-option>
          <!-- <a-select-option value="Shift">
            Shift
          </a-select-option>
          <a-select-option value="Alt">
            Alt
          </a-select-option> -->
        </a-select>
        <a-input v-model="editComm.shortCuts[1]" style="width: 50%;" placeholder="可输入快捷键" :maxLength="1" />
      </a-input-group>
       <a-textarea v-model="editComm.comment" placeholder="自定义注释" :auto-size="{ minRows: 15, maxRows: 25 }" />
    </a-modal>

    <a-modal v-model="previewVisible" okText="Copy" @ok="copyData">
      <pre>{{editComm.comment}}</pre>
    </a-modal>
  </div>
</template>
<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import { copyData } from '@assets/utils'
declare interface CustomComm {
  id: number | null;
  comment: string;
  shortCuts: string[];
}

@Component({})
export default class Custom extends Vue {
  customComments: CustomComm[]
  modalVisible = false
  previewVisible = false
  editComm: CustomComm = {
    id: null,
    comment: '',
    shortCuts: ['Ctrl', '']
  }

  created () {
    this.customComments = window._customComments || JSON.parse(localStorage.getItem('customComments') || '[]')
  }

  /**
   * 设置用户自定义注释模板
   */
  setCustomConf () {
    if (!this.editComm.id) {
      const lastComm = this.customComments[this.customComments.length - 1]
      if (lastComm && lastComm.id) {
        this.editComm.id = lastComm.id + 1
      } else {
        this.editComm.id = 1
      }
      this.customComments.push(Object.assign({}, this.editComm))
    } else {
      const index = this.customComments.findIndex(t => t.id === this.editComm.id)
      this.customComments[index] = Object.assign({}, this.editComm)
    }
    window._customComments = this.customComments
    localStorage.setItem('customComments', JSON.stringify(this.customComments))
    this.modalVisible = false
  }

  onEdit (item: CustomComm) {
    this.editComm = Object.assign({}, item)
    this.modalVisible = true
  }

  onDelete (item: CustomComm) {
    const index = this.customComments.findIndex(t => t.id === item.id)
    this.customComments.splice(index, 1)
    this.$forceUpdate()
    localStorage.setItem('customComments', JSON.stringify(this.customComments))
  }

  onPreview (item: CustomComm) {
    this.editComm = Object.assign({}, item)
    this.previewVisible = true
  }

  copyData (comment: string) {
    copyData(comment || this.editComm.comment)
    this.$message.success('您的注释已经复制到剪贴板啦！')
    this.modalVisible = false
  }

  onCancel () {
    this.editComm = {
      id: null,
      comment: '',
      shortCuts: ['Ctrl', '']
    }
  }
}
</script>
<style lang="scss" scoped>
.custom{
  width: 100%;
  height: 100%;
  padding: 1rem;
  position: relative;
}
.card{
  width: 100%;
  height: 45vh;
  background: white;
  box-shadow: $shadow;
  position: relative;
  overflow: hidden;
  .card__comment{
    padding: 6px;
    width: 100%;
    height: 100%;
    overflow: auto;
  }

  &:hover{
    .card__title{
      top: 0;
      .card__info{
        opacity: 1;
      }
    }
  }

  .card__title{
    position: absolute;
    width: 100%;
    height: 60px;
    left: 0;
    top: -100%;
    color: white;
    background: rgba($color: #000000, $alpha: .5);
    transition: top .5s;
    .card__info{
      width: 100%;
      padding: 6px;
      opacity: 0;
      transition: opacity .3s .2s;
    }
    .actions{
      padding: 0 6px;
      .action-item{
        cursor: pointer;
        font-size: 16px;
        margin-right: 1rem;
        &:hover{
          transform: scale(1.3);
        }
      }
    }
  }
}
.add-btn{
  position: fixed;
  bottom: 20px;
  right: 20px;
  width: 42px;
  height: 42px;
  background: #4caf50;
  color: white;
  box-shadow: $shadow;
  border-radius: 50%;
  cursor: pointer;
  @include flex-center;
  .icon{
    font-size: 22px;
  }
}
</style>
