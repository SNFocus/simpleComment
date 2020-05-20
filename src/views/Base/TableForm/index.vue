<template>
  <div >
    <!-- 表格输入  Table不支持overflow -->
    <div class="table-wrapper">
        <table class="table">
        <thead>
            <th v-for="(head, index) in tableHeader" :key="index" class="table__header" >
                <input v-model="tableHeader[index]" type="text" @change="dataChange">
                <a-button type="link" size="small" class="delBtn" @click="delData('col', index)">删除</a-button>
            </th>
            <th></th>
        </thead>
        <tbody>
            <tr v-for="(row, idx) in tableBody" :key="idx" class="table__row" >
            <td class="table__cell" v-for="(cell, cidx) in row" :key="cidx" >
                <input v-model="tableBody[idx][cidx]" type="text" @change="dataChange">
            </td>
            <td style="position: relative;">
                <a-button type="link" size="small" class="delBtn"  @click="delData('row', idx)">删除</a-button>
            </td>
            </tr>
        </tbody>
        </table>
    </div>

    <!-- 表格配置 -->
    <!-- 增加行 增加列 行分隔符号 列分隔符号  最大宽度 包裹方式-->
    <a-divider orientation="left"><a-icon  type="setting" /> &nbsp;设置</a-divider>
    <div class="actions-box">
        <!-- 表格 宽高 设置 -->
        <div class="actions" style="padding-left: 12px;margin-bottom: 24px;">
            <a-button type="primary" icon="line" @click="addRow">增加行</a-button>
            <a-button type="primary" icon="info" style="margin-left: 1.5rem;" @click="addCol">增加列</a-button>
        </div>
        <a-row>
          <a-col :span="12">
            <sc-form-item :label="'行分隔符'">
                <input type="text" v-model="horiTemplate" @change="ev => onConfigChange(ev.currentTarget.value, 'horiTemplate')">
            </sc-form-item>
          </a-col>
          <a-col :span="12">
            <sc-form-item :label="'列分隔符'">
                <input type="text" v-model="verticalTemplate" @change="ev => onConfigChange(ev.currentTarget.value, 'verticalTemplate')">
            </sc-form-item>
          </a-col>
          <a-col :span="12">
            <sc-form-item :label="'四角字符'">
                <input type="text" v-model="quadrangleChar" @change="ev => onConfigChange(ev.currentTarget.value, 'quadrangleChar')">
            </sc-form-item>
          </a-col>
          <a-col :span="12">
          <!-- 单元格 设置 -->
            <sc-form-item :label="'最大宽度'">
                <input type="text" v-model.number="maxCellWidth" @change="ev => onConfigChange(ev.currentTarget.value, 'maxCellWidth')">
            </sc-form-item>
          </a-col>
        </a-row>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { Table2Comm, Table2CommUtil } from '@assets/utils/Table2Comm.ts'
import Bus from '@assets/utils/bus'

@Component
export default class TableForm extends Vue {
  tableUtil: Table2CommUtil = new Table2Comm()
  tableHeader: string[] = ['header1', 'header2', 'header3']
  tableBody: string[][] =[
    ['comment1', 'comment2', 'comment3'],
    ['comment1', 'comment3', 'comment3'],
    ['comment1', 'comment2', 'comment3'],
    ['comment1', 'comment2', 'comment3']
  ]

  horiTemplate: string
  verticalTemplate: string
  quadrangleChar: string
  maxCellWidth: number

  created (): void {
    this.horiTemplate = this.tableUtil.horiTemplate
    this.quadrangleChar = this.tableUtil.quadrangleChar
    this.verticalTemplate = this.tableUtil.verticalTemplate
    this.maxCellWidth = this.tableUtil.maxCellWidth
    this.dataChange()
  }

  /**
   * 配置或内容有变动，重新生成注释展示数据
   */
  dataChange (): void {
    this.tableUtil.setData(this.genTableData())
    Bus.$emit('genComment', this.tableUtil.genComment())
  }

  /**
 * 生成TableUtil工具类所需表格数据
 * @returns 包含表头表格数据——二维数组
 */
  genTableData (): string[][] {
    const res: string[][] = [this.tableHeader.concat()]
    this.tableBody.forEach((row: string[]) => {
      res.push(row.concat())
    })
    return res
  }

  /**
 * 配置被修改的回调
 * @param { Number | String } val 配置的值
 * @param { String } key 配置的属性
 */
  onConfigChange (val: number | string, key: string): void {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (this as any).tableUtil[key] = val
    this.dataChange()
  }

  /**
 * 添加一行表格数据
 */
  addRow (): void{
    this.tableBody.push(new Array(this.tableHeader.length).fill('comment'))
    this.dataChange()
  }

  /**
 * 添加一列表格数据
 */
  addCol (): void{
    const index: number = this.tableHeader.length
    this.tableHeader.push('header' + index)
    this.tableBody.forEach(t => t.push('comment' + index))
    this.dataChange()
  }

  /**
 * 删除表格数据， 按行或列
 * @param {String} type 指明删除行还是列
 * @param {number} index 删除的行或列的索引
 */
  delData (type: string, index: number) {
    const isCol: boolean = type === 'col'
    if (isCol) {
      this.tableHeader.splice(index, 1)
      this.tableBody.forEach((row: string[]) => {
        row.splice(index, 1)
      })
    } else {
      this.tableBody.splice(index, 1)
    }
    this.dataChange()
  }
}
</script>

<style lang="scss" scoped>

.table-wrapper{
    width: 100%;
    max-height: 280px;
    overflow: auto;
    text-align: center;
    .table {
        margin: auto;
        .delBtn{
            font-size: 12px;
            position: absolute;
            top: -1rem;
            right: 0;
            visibility: hidden;
            transition: top .8s, right 1.5s;
        }

        .table__header{
            padding: 8px 10px;
            background: #fafafa;
            position: relative;
            border: 1px solid $border-color;

            > input{
                all: unset;
                transition: border-left .5s, padding-left .5s;
                width: 100px;
                box-sizing: border-box;

                &:hover, &:focus{
                    border-left: 4px solid #479EFF;
                    padding-left: 4px;
                }
            }

            &:hover{
                .delBtn{
                    visibility: visible;
                    top: 0;
                }
            }
        }

        .table__row {
            .table__cell {
            padding: 8px 12px;
            word-break: break-all;
            border: 1px solid $border-color;

            > input{
                all: unset;
                transition: border-left .5s, padding-left .5s;
                width: 100px;
                box-sizing: border-box;
                &:hover, &:focus{
                    border-left: 4px solid #479EFF;
                    padding-left: 4px;
                }
            }
            }
            .delBtn{
                top: 20%;
                right: -2rem;
            }

            &:hover{
                .delBtn{
                    right: 0;
                    visibility: visible;
                }
            }
        }
    }
}
.actions-box{
    padding: 16px 0;

    .actions{
        display: flex;
        margin-bottom: 10px;

        ::v-deep  .sc-input-box{
            flex: 1;
        }
    }
}
</style>
