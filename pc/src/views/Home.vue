<template>
  <a-layout id="components-layout-demo-responsive">
    <a-layout-sider
      v-model="isCollapsed"
      collapsible
    >
      <div
        class="logo"
        @click="isCollapsed = !isCollapsed"
      >
        {{ isCollapsed ? "SC" : "SComment" }}
      </div>
      <a-menu
        theme="dark"
        mode="inline"
        v-model="current"
      >
        <a-menu-item v-for="(item) in navConfig" :key="item.key">
          <a-icon :type="item.icon" />
          <span class="nav-text">{{ item.label }}</span>
        </a-menu-item>
      </a-menu>
    </a-layout-sider>
    <a-layout>
      <!-- <a-layout-header :style="{ background: '#fff', padding: 0 }" /> -->
      <a-layout-content :style="{ margin: '24px 16px 16px', display: 'flex' }">
        <div style="flex: 1;">
          <div class="content-pane">
            <div>
                <svg xmlns="http://www.w3.org/2000/svg" width="54" height="14" viewBox="0 0 54 14"><g fill="none" fill-rule="evenodd" transform="translate(1 1)"><circle cx="6" cy="6" r="6" fill="#FF5F56" stroke="#E0443E" stroke-width=".5"></circle><circle cx="26" cy="6" r="6" fill="#FFBD2E" stroke="#DEA123" stroke-width=".5"></circle><circle cx="46" cy="6" r="6" fill="#27C93F" stroke="#1AAB29" stroke-width=".5"></circle></g></svg>
                <div class="actions">
                     <a-tooltip>
                        <template slot="title">
                            复制到剪贴板
                        </template>
                        <a-icon type="copy" />
                    </a-tooltip>

                </div>
            </div>
            <pre>{{comment}}</pre>
          </div>
          <type-pane :activeNavKey="activeNavKey" :activeTypeKey.sync="activeTypeKey"></type-pane>
        </div>
        <ui-pane :activeNavKey="activeNavKey" :activeTypeKey="activeTypeKey" @genComment="getComment"></ui-pane>
      </a-layout-content>
    </a-layout>
  </a-layout>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator'
import { navConfig, NavItemIF } from '@assets/config/baseConfig'
import TypePane from '@components/TypePane'
import UiPane from '@components/UiPane'
// import { State, Mutation } from 'vuex-class'
@Component({
  components: {
    [TypePane.name]: TypePane,
    [UiPane.name]: UiPane
  }
})
export default class Home extends Vue {
    readonly navConfig: NavItemIF[] = navConfig
    isCollapsed = true;
    current: string[] = ['baseType'];
    activeNavKey = '';
    activeTypeKey = '';
    comment = ''

    created (): void {
      this.reloadGlobalKeys()
    }

    reloadGlobalKeys () {
      this.activeNavKey = this.current[0]
      this.activeTypeKey = this.navConfig.find(t => t.key === this.activeNavKey).typeList[0].key
    }

    getComment (data: string): void{
      this.comment = data
    }

    @Watch('current')
    onCurrentChange (): void {
      this.reloadGlobalKeys()
    }
}
</script>

<style lang="scss" scoped>
#components-layout-demo-responsive {
  height: 100%;
  .logo {
    height: 32px;
    cursor: pointer;
    margin: 16px;
    color: white;
    line-height: 32px;
    text-align: center;
    background: rgba(255, 255, 255, 0.2);
  }
}

.content-pane {
  color: $color-light;
  height: 60%;
  margin-right: 2%;
  margin-bottom: 2%;
  padding: 24px;
  background: $bg-dark;
  box-shadow: $card-shadow;
  border-radius: $radius;
  overflow: auto;

  .actions{
      float: right;
      cursor: pointer;
      &:hover{
          color: $hover-bg-color;
      }
  }
}

</style>
