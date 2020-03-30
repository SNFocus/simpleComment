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
        <a-menu-item v-for="(item, key) in navConfig" :key="key">
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
            content
          </div>
          <type-pane :navType="current[0]"></type-pane>
        </div>
        <table-input></table-input>
      </a-layout-content>
    </a-layout>
  </a-layout>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator'
import { navConfig, navKeys } from '@assets/config/baseConfig'
import TypePane from '@components/TypePane'
import TableInput from '@components/TableInput'
import { State, Mutation } from 'vuex-class'

@Component({
  components: {
    [TypePane.name]: TypePane,
    [TableInput.name]: TableInput
  }
})
export default class Home extends Vue {
    public readonly navConfig = navConfig
    public isCollapsed = true
    public current: string[] = [navKeys.CUSTOM]

    @State('activeNav') activeNavKey: string;
    @Mutation('changeNav') onNavChange: (payload: string) => void;

    private created (): void {
      if (!this.activeNavKey) {
        this.onNavChange(this.current[0])
      }
    }

    @Watch('current')
    onCurrentChange (val: string[]): void {
      this.onNavChange(val[0])
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
  margin-right: 2%;
  margin-bottom: 2%;
  padding: 24px;
  background: $bg-color;
  height: 60%;
  box-shadow: $card-shadow;
  border-radius: $radius;
}

.template-pane {
  width: 40%;
  padding-right: 0;
  border-radius: $radius;
  background: $bg-color;
}
</style>
