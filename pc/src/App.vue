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
        :defaultSelectedKeys="['base']" >
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
        <router-view />
      </a-layout-content>
    </a-layout>
  </a-layout>
  </div>
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
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
    isCollapsed = true;
}
</script>
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
}
</style>
