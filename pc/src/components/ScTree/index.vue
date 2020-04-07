<template>
    <a-tree draggable :showLine="true" :treeData="treeData" @drop="onDrop" :replaceFields="options" >
      <template slot="custom">
        <a-button type="primary" class="but_type" style="right:200px;" >新增</a-button>
        <a-button type="primary" class="but_type" >删除</a-button>
      </template>
    </a-tree>
</template>
<script lang="ts">
import { Vue, Component, Model, Prop } from 'vue-property-decorator'

@Component
export default class ScTree extends Vue {
    @Prop({ default: () => [] }) data !: Array<T>;
    options = { children: 'childs', title: 'content', key: 'key' }
    treeData: Array<T> ;
    created () {
      this.treeData = JSON.parse(JSON.stringify(this.data))
      this.appendSlot(this.treData)
    }

    appendSlot (data) {
      if (!data) return
      if (Array.isArray(data)) {
        data.forEach(t => this.appendSlot(t))
        return
      }
      data.scopedSlots = { title: 'custom' }
      if (Array.isArray(data.childs)) {
        data.childs.forEach(t => this.appendSlot(t))
      }
    }

    onDrop (info): void {
      const dropKey: number = info.node.eventKey
      const dragKey: number = info.dragNode.eventKey
      const dropPos = info.node.pos.split('-')
      const dropPosition = info.dropPosition - Number(dropPos[dropPos.length - 1])
      const loop = (data, key, callback) => {
        data.forEach((item, index, arr) => {
          if (item.key === key) {
            return callback(item, index, arr)
          }
          if (item.childs) {
            return loop(item.childs, key, callback)
          }
        })
      }
      const data = [...this.treeData]

      // Find dragObject
      let dragObj
      loop(data, dragKey, (item, index, arr) => {
        arr.splice(index, 1)
        dragObj = item
      })
      if (!info.dropToGap) {
        // Drop on the content
        loop(data, dropKey, item => {
          item.childs = item.childs || []
          // where to insert 示例添加到尾部，可以是随意位置
          item.childs.push(dragObj)
        })
      } else if (
        (info.node.childs || []).length > 0 && // Has childs
        info.node.expanded && // Is expanded
        dropPosition === 1 // On the bottom gap
      ) {
        loop(data, dropKey, item => {
          item.childs = item.childs || []
          // where to insert 示例添加到尾部，可以是随意位置
          item.childs.unshift(dragObj)
        })
      } else {
        let ar
        let i
        loop(data, dropKey, (item, index, arr) => {
          ar = arr
          i = index
        })
        if (dropPosition === -1) {
          ar.splice(i, 0, dragObj)
        } else {
          ar.splice(i + 1, 0, dragObj)
        }
      }
      this.$emit('change', data)
    }
}
</script>

<style lang="scss" scoped>

</style>
