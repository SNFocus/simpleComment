<template>
  <div class="template-pane normal-padding ">
      <component v-bind:is="currentCmp" v-on="$listeners"></component>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
// import Table2Comm from '@assets/utils/Table2Comm'
// import List2Comm from '@assets/utils/List2Comm'
// import TableForm from '@components/TableForm'

@Component({
  components: {
    'table-form': function (resolve) {
    // 这个特殊的 `require` 语法将会告诉 webpack
    // 自动将你的构建代码切割成多个包，这些包
    // 会通过 Ajax 请求加载
      require(['@components/TableForm'], resolve)
    },
    'list-form': function (resolve) {
      require(['@components/ListForm'], resolve)
    }
  }
})
export default class UiPane extends Vue {
    @Prop(String) readonly activeNavKey !: string;
    @Prop(String) activeTypeKey !: string;
    currentCmp = 'list-form'

    created () {
    //   console.log(new List2Comm().genComment())
    }
}
</script>

<style lang="scss" scoped>
.template-pane {
  width: 48%;
  border-radius: $radius;
  background: $bg-light;
}

</style>
