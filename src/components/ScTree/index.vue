<template>
    <a-tree :defaultExpandAll="true" draggable :showLine="true" :treeData="treeData" @drop="onDrop" :replaceFields="options" :key="updateId">
      <template slot="custom" slot-scope="item">
        <div class="node-item">
            <a-input class="node-title" v-model="item.content" />
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
import { Vue, Component, Prop, Emit } from 'vue-property-decorator'
import { ListItem } from '../../assets/utils/List2Comm'

@Component({
  name: 'sc-tree'
})
export default class ScTree extends Vue {
    @Prop({ default: () => [] }) data !: Array<ListItem>
    options = { children: 'childs', title: 'content', key: 'key' }
    treeData: Array<TreeItem> = JSON.parse(JSON.stringify(this.data))
    baseId = 100
    updateId = 0

    created (): void {
      this.appendSlot(this.treeData)
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    openEditor (ev: Event, item: any) {
      item.popVisible = !item.popVisible
      // this.updateId++
      ev.stopPropagation()
    }

    appendSlot (data: TreeItem | TreeItem[]): void {
      if (!data) return
      if (Array.isArray(data)) {
        (data as TreeItem[]).forEach(t => this.appendSlot(t))
        return
      }
      data.scopedSlots = { title: 'custom' }
      data.key = this.baseId++
      this.$set(data, 'popVisible', false)
      if (Array.isArray(data.childs)) {
        data.childs.forEach(t => this.appendSlot(t))
      }
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onDrop (info: any): void {
      const dropKey: number = info.node.eventKey
      const dragKey: number = info.dragNode.eventKey
      const dropPos: string[] = info.node.pos.split('-')
      const dropPosition = info.dropPosition - Number(dropPos[dropPos.length - 1])
      const loop = (data: TreeItem[], key: number, callback: Function) => {
        data.forEach((item: TreeItem, index: number, arr: TreeItem[]) => {
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
      let dragObj !: TreeItem
      loop(data, dragKey, (item: TreeItem, index: number, arr: TreeItem[]) => {
        arr.splice(index, 1)
        dragObj = item
      })
      if (!info.dropToGap) {
        // Drop on the content
        loop(data, dropKey, (item: TreeItem) => {
          item.childs = item.childs || []
          // where to insert 示例添加到尾部，可以是随意位置
          item.childs.push(dragObj)
        })
      } else if (
        (info.node.childs || []).length > 0 && // Has childs
        info.node.expanded && // Is expanded
        dropPosition === 1 // On the bottom gap
      ) {
        loop(data, dropKey, (item: TreeItem) => {
          item.childs = item.childs || []
          // where to insert 示例添加到尾部，可以是随意位置
          item.childs.unshift(dragObj)
        })
      } else {
        let ar!: TreeItem[]
        let i !: number
        loop(data, dropKey, (item: TreeItem, index: number, arr: TreeItem[]) => {
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
        (k, v) => {
          if (k === 'scopedSlots' || k === 'key' || k === 'popVisible') return undefined
          else return v
        }
      ))
    }

    addData (item: TreeItem, addChild: boolean): void{
      const node: TreeItem = {
        key: this.baseId++,
        scopedSlots: { title: 'custom' },
        popVisible: false,
        content: '注释列表内容'
      }
      if (addChild) {
        if (!Array.isArray(item.childs)) {
          this.$set(item.dataRef, 'childs', [])
        }
        item.dataRef.childs.push(node)
      } else {
        const appendNode = (item: TreeItem, index: number, arr: TreeItem[]) => {
          arr.splice(index + 1, 0, node)
        }
        this.findNodeByKey(item.key, appendNode)
      }
      this.updateData()
    }

    delData (item: TreeItem): void{
      this.findNodeByKey(item.key, (item: TreeItem, index: number, arr: TreeItem[]) => {
        arr.splice(index, 1)
      })
      this.updateData()
      // 强制刷新
      this.baseId++
    }

    findNodeByKey (key: number, func: Function): void {
      const loop: (data: TreeItem[], key: number, callback: Function) => void = (data, key, callback) => {
        data.forEach((item: TreeItem, index: number, arr: TreeItem[]) => {
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

    @Emit('change')
    emitChange () {
      return this.delScopeProp()
    }

    updateData () {
      this.updateId++
      this.emitChange()
    }
}
</script>

<style lang="scss" scoped>
.node-item {
    .node-title {
        margin-right: 1rem;
        border: none;
        padding: 0;
        height: auto;
        width: auto;
        background: transparent !important;
        outline: none !important;
        box-shadow: none;
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
