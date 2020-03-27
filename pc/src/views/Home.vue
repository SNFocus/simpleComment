<template>
  <a-layout id="components-layout-demo-responsive">
    <a-layout-sider v-model="isCollapsed" collapsible @collapse="onCollapse">
      <div class="logo" @click="isCollapsed = !isCollapsed">
        {{ isCollapsed ? "SC" : "SComment" }}
      </div>
      <a-menu theme="dark" mode="inline" :defaultSelectedKeys="['4']">
        <a-menu-item key="1">
          <a-icon type="heart" />
          <span class="nav-text">常用</span>
        </a-menu-item>
        <a-menu-item key="2">
          <a-icon type="shop" />
          <span class="nav-text">模板库</span>
        </a-menu-item>
        <a-menu-item key="3">
          <a-icon type="smile" />
          <span class="nav-text">颜文字</span>
        </a-menu-item>
        <a-menu-item key="4">
          <a-icon type="layout" />
          <span class="nav-text">基础类型</span>
        </a-menu-item>
      </a-menu>
    </a-layout-sider>
    <a-layout>
      <!-- <a-layout-header :style="{ background: '#fff', padding: 0 }" /> -->
      <a-layout-content :style="{ margin: '24px 16px 0' }">
        <div class="content-pane" >
          content
        </div>
        <div class="template-pane"></div>
      </a-layout-content>
      <a-layout-footer style="textAlign: center" >Ant Design ©2018 Created by Ant UED</a-layout-footer>
    </a-layout>
  </a-layout>
</template>

<script>
export default {
  data () {
    return {
      isCollapsed: true
    }
  },
  methods: {
    onCollapse (collapsed, type) {
      console.log(collapsed, type)
    }
  }
}
</script>

<style lang="scss" scoped>

#components-layout-demo-responsive{
  height: 100%;
  .logo {
    height: 32px;
    background: rgba(255, 255, 255, 0.2);
    margin: 16px;
    color: white;
    line-height: 32px;
    padding-left: 10px;
    cursor: pointer;
  }
}

.content-pane{
  padding: 24px;
  background: #fff;
  height: 50%
}

.template-pane{
  height: 50%;
  padding: 24px;
}
</style>
