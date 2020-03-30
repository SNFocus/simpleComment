<template>
  <div class="template-pane normal-padding ">
      {{activeTypeKey}}
      {{activeNavKey}}
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
// import Table2Comm from '@assets/utils/Table2Comm'
import List2Comm from '@assets/utils/List2Comm'
@Component
export default class UiPane extends Vue {
     @Prop(String) readonly activeNavKey !: string;
    @Prop(String) activeTypeKey !: string;

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

</style>
