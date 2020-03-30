<template>
  <div class="template-pane normal-padding ">
    <table class="table">
      <thead>
        <th v-for="(head, index) in tableHeader" :key="index" class="table__header" >
            {{head}}
        </th>
      </thead>
      <tbody>
        <tr v-for="(row, idx) in tableBody" :key="idx" class="table__row" >
          <td class="table__cell" v-for="(cell, cidx) in row" :key="cidx" >
              {{cell}}
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { Table2Comm, Table2CommUtil } from '@assets/utils/Table2Comm'

@Component
export default class UiPane extends Vue {
  tableUtil: Table2CommUtil = new Table2Comm()
  tableHeader: number[] = [];
  tableBody: number[] = []
  created (): void {
    this.tableHeader = this.tableUtil.tableData[0]
    this.tableBody = this.tableUtil.tableData.slice(1)
  }
}
</script>

<style lang="scss" scoped>
.table {
  width: 100%;
  .table__header{
      padding: 8px 10px;
  }
  .table__row {
    .table__cell {
      border-bottom: 1px solid #aaa;
      padding: 8px 12px;
      word-break: break-all;
    }
  }
}
</style>
