<template>
  <div class="template-pane normal-padding ">
    <!-- <table class="table">
      <thead>
        <th v-for="(head, index) in tableHeader" :key="index" class="table__header" >
            {{head}}
        </th>
      </thead>
      <tbody>
        <tr v-for="(row, idx) in tableData" :key="idx" class="table__row" >
          <td class="table__cell" v-for="(cell, cidx) in row" :key="cidx" >
              {{cell}}
          </td>
        </tr>
      </tbody>
    </table> -->
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import Table2Comm from '@assets/utils/Table2Comm'
import List2Comm from '@assets/utils/List2Comm'

@Component
export default class TableInput extends Vue {
  created () {
    console.log(new List2Comm().genComment())
  }
}
</script>

<style lang="scss" scoped>
.template-pane {
  width: 46%;
  border-radius: $radius;
  background: $bg-color;
}

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
