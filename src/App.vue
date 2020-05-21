<template>
  <div id="app">
    <a-layout id="components-layout-demo-responsive">
    <a-layout-sider
      v-model="isCollapsed"
      collapsible
    >
      <div
        class="logo"
        @click="isCollapsed = !isCollapsed" >
        {{ isCollapsed ? "SC" : "SComment" }}
      </div>
      <a-menu
        theme="dark"
        mode="inline"
        :selectedKeys="selectedKeys" >
        <a-menu-item v-for="(item) in navConfig" :key="item.key">
          <router-link :to="'/' + item.key">
            <a-icon :type="item.icon" />
            <span class="nav-text">{{ item.label }}</span>
          </router-link>
        </a-menu-item>
      </a-menu>
    </a-layout-sider>
    <a-layout>
      <!-- <a-layout-header :style="{ background: '#fff', padding: 0 }" /> -->
      <a-layout-content style="overflow: hidden; display: flex;">
        <keep-alive>
            <router-view v-if="$route.meta.keepAlive"></router-view>
        </keep-alive>
        <router-view v-if="!$route.meta.keepAlive"></router-view>
      </a-layout-content>
    </a-layout>
  </a-layout>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator'
import { navConfig, NavItemIF } from '@assets/config/baseConfig'
// import { State, Mutation } from 'vuex-class'
declare interface Point {
  x: number;
  y: number;
}
@Component
export default class Home extends Vue {
    readonly navConfig: NavItemIF[] = navConfig
    // 控制侧边栏折叠
    isCollapsed = true
    selectedKeys = ['base']

    mounted (): void {
      this.$nextTick(() => {
        this.selectedKeys = [this.$route.path.split('/')[1]]
      })
    }

    @Watch('isCollapsed')
    onCollapsed () {
      setTimeout(() => {
        console.log(document.querySelector('.ant-layout-sider'))
        window.siderWidth = (document.querySelector('.ant-layout-sider') as HTMLDivElement).clientWidth || 0
      }, 500)
    }

    /**
     * 解决刷新页面后 无法准确定位菜单问题
     */
    @Watch('$route.path')
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onPathChange (path: any) {
      const getType = () => path.split('/')[1]
      if (getType() !== this.selectedKeys[0]) {
        this.selectedKeys = [getType()]
      }
    }
}
</script>
<style lang="scss">
.ant-modal {
    top: 40px;
}
</style>
<style lang="scss" scoped>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: $color-dark;
  width: 100vw;
  height: 100vh;
}
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
  ::v-deep .ant-layout-sider-trigger{
    background: $bg-dark;
  }

  .ant-layout-sider,
  .ant-menu-dark {
    background: $bg-dark;
  }
}
</style>
