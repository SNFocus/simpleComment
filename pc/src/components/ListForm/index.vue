
<script lang="tsx">
import { Vue, Component } from 'vue-property-decorator'
import { List2Comm, List2CommUtil, ListItem } from '@assets/utils/List2Comm'
import ScTree from '@components/ScTree'

@Component
export default class ListForm extends Vue {
    tabSize: number|string ;
    rowDivider: string;
    showDivider: boolean;
    isOrdered: boolean;
    treeData !: ListItem[];
    listUtil: List2CommUtil ;

    created (): void {
      this.listUtil = new List2Comm()
      this.tabSize = this.listUtil.tabSize
      this.rowDivider = this.listUtil.rowDivider
      this.isOrdered = this.listUtil.isOrdered
      this.treeData = this.listUtil.data
      this.dataChange()
    }

    /**
     * 生成配置面板布局
     */
    genConfigLayout (): JSX.Element {
      return (
        <div class="actions-box">
          <a-divider orientation="left"> <a-icon type="setting" /> &nbsp;设置</a-divider>
          <a-row>
            <a-col span="12">
              <sc-form-item label="显示分隔线" showUnderLine={false}>
                <sc-switch v-model={this.showDivider} onChange={this.onShowDividerChange}></sc-switch>
              </sc-form-item>
            </a-col>
            <a-col span="12">
              <sc-form-item label="列表类型" showUnderLine={false} >
                <sc-switch v-model={this.isOrdered} trueText="有序" falseText="无序" onChange={this.onOrderTypeChange}></sc-switch>
              </sc-form-item>
            </a-col>
            <a-col span="12">
              <sc-form-item label="分隔符">
                <input
                  type="text"
                  v-model={this.rowDivider}
                  onChange={event => this.onConfigChange(event.currentTarget.value, 'rowDivider')}
                />
              </sc-form-item>
            </a-col>
            <a-col span="12">
              <sc-form-item label="缩进">
                <input
                  type="text"
                  v-model={this.tabSize}
                  onChange={event => this.onConfigChange(event.currentTarget.value, 'tabSize')}
                />
              </sc-form-item>
            </a-col>
          </a-row>
        </div>
      )
    }

    drawListTree (data: ListItem[]): JSX.Element | undefined {
      if (!data) return
      return (
        <div class="list-wrapper">
          { data.map((d) => {
            return (
              <div class="list-item">
                {d.content}
                {
                  d.childs && d.childs.length && this.drawListTree(d.childs)
                }
              </div>
            )
          })}
        </div>
      )
    }

    genListTreeLayout (): JSX.Element {
      return (
        <div class="list-form-wrapper">
          <ScTree data={this.treeData} onChange={this.onTreeDataChange} />
        </div>
      )
    }

    onTreeDataChange (data): void {
      this.treeData = data
      this.$forceUpdate()
    }

    getRenderContent () {
      return (
        <div>
          {this.genListTreeLayout()}
          {this.genConfigLayout()}
        </div>
      )
    }

    onOrderTypeChange (val: boolean): void {
      this.onConfigChange(val, 'isOrdered')
      // tsx 中 @Model v-model 没有刷新数据
      this.$forceUpdate()
    }

    onShowDividerChange (val: boolean): void{
      this.onConfigChange(val, 'showDivider')
      // tsx 中 @Model v-model 没有刷新数据
      this.$forceUpdate()
    }

    /**
     * 配置或内容有变动，重新生成注释展示数据
     */
    dataChange (): void {
      this.$emit('genComment', this.listUtil.genComment())
    }

    /**
     * 配置被修改的回调
     * @params {Number|String} val 配置的值
     * @params {String} key 配置的属性
     */
    onConfigChange (val: number | string | boolean, key: string): void {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (this as any).listUtil[key] = val
      this.dataChange()
    }

    render () {
      return this.getRenderContent()
    }
}
</script>

<style lang="scss" scoped>
.list-form-wrapper{
    border: 1px solid #e5e5e5;
    height: 50vh;
    width: 100%;
    overflow-y: auto;
    overflow-x: hidden;
    padding: 12px;

    .list-wrapper{

        .list-item{
            padding: 4px 12px;
            padding-right: 0;
            margin-top: 4px;
            margin-bottom: 4px;
            border: 1px solid #e5e5e5;
        }
    }
}
</style>
