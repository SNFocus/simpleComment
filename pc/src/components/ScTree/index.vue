<template>
    <a-tree draggable :showLine="true" :treeData="treeData" @drop="onDrop" :replaceFields="options" :key="updateId">
      <template slot="custom" slot-scope="item">
        <div class="node-item">
            <a-popover title="编辑" trigger="click" v-model="item.popVisible">
              <template slot="content">
                <input v-model="item.content"  />
              </template>
              <span class="node-title" @click="item.popVisible = !item.popVisible;updateId++">{{ item.content }}</span>
            </a-popover>

            <a-tooltip title="新增同级节点">
                <a-icon type="plus" class="node-action" @click="addData(item, false)" />
            </a-tooltip>
            <a-tooltip title="新增子级节点">
                <a-icon type="plus-circle" class="node-action" @click="addData(item, true)" />
            </a-tooltip>
            <a-tooltip title="删除">
                <a-icon type="delete" class="node-action" @click="delData(item)" />
            </a-tooltip>
        </div>
      </template>
    </a-tree>
</template>
<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'

@Component
export default class ScTree extends Vue {
    @Prop({ default: () => [] }) data !: Array<T>;
    options = { children: 'childs', title: 'content', key: 'key' }
    treeData: Array<T> ;
    baseId = 100;
    updateId = 0;

    created () {
      this.treeData = JSON.parse(JSON.stringify(this.data))
      this.appendSlot(this.treeData)
    }

    appendSlot (data) {
      if (!data) return
      if (Array.isArray(data)) {
        data.forEach(t => this.appendSlot(t))
        return
      }
      data.scopedSlots = { title: 'custom' }
      data.key = this.baseId++
      data.popVisible = false
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
      this.treeData = data
      this.updateData()
    }

    delScopeProp () {
      return JSON.parse(JSON.stringify(
        this.treeData,
        function (k, v) {
          if (k === 'scopedSlots' || k === 'key' || k === 'popVisible') return undefined
          else return v
        }
      ))
    }

    addData (item, addChild): void{
      const node = {
        key: this.baseId++,
        scopedSlots: { title: 'custom' },
        popVisible: false,
        content: '注释列表内容'
      }
      if (addChild) {
        if (!item.childs) {
          item.childs = []
        }
        item.childs.push(node)
      } else {
        this.findNodeByKey(item.key, (item, index, arr) => {
          arr.splice(index + 1, 0, node)
        })
      }
      this.updateData()
    }

    delData (item): void{
      this.findNodeByKey(item.key, (item, index, arr) => {
        arr.splice(index, 1)
      })
      this.updateData()
      // 强制刷新
      this.baseId++
    }

    findNodeByKey (key, func) {
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
      loop(this.treeData, key, func)
    }

    updateData () {
      this.updateId++
      this.$emit('change', this.delScopeProp())
    }
}
</script>

<style lang="scss" scoped>
.node-item {
    .node-title {
        margin-right: 1rem;
    }

    .node-action {
        opacity: 0;
        font-size: 12px;
        padding-left: 4px;
        padding-right: 4px;
        color: $color-tip;
        transition: opacity 0.3s;

        &:hover{
            color: $color-primary;
        }
    }
    &:hover{
        .node-action {
            opacity: 1;
        }
    }
}
</style>
