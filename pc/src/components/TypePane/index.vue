<template>
  <div class="type-pane">
    <div
      v-for="type in myBaseTypes"
      :key="type.icon"
      class="type-card"
      :class="{active: syncedTypeKey==type.key}"
      @click="changeType(type)"
    >
      <a-icon
        :type="type.icon"
        class="icon"
      />
      <span class="text">{{ type.label }}</span>
    </div>
  </div>
</template>
<script lang="ts">
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Component, Prop, Vue, Watch, PropSync } from 'vue-property-decorator'
import { navConfig, TypeItemIF, NavItemIF } from '@assets/config/baseConfig'

@Component
export default class TypePane extends Vue {
    @Prop(String) readonly activeNavKey !: string;
    @PropSync('activeTypeKey', { type: String }) syncedTypeKey !: string;
    NAV_LIST: NavItemIF[] = navConfig

    get myBaseTypes (): TypeItemIF[] {
      return this.NAV_LIST.find((t: TypeItemIF) => t.key === this.activeNavKey).typeList
    }

    /**
 * 改变全局注释类型
 * @param {TypeItemIF} type - 注释类型
 */
    changeType (type: TypeItemIF): void {
      this.syncedTypeKey = type.key
      this.$emit('change')
    }
}
</script>

<style lang="scss" scoped>
.type-pane {
  height: 38%;
  padding: 24px;
  border-radius: $radius;
  background: $bg-light;
  border-top-right-radius: 0;
}

.type-card {
  width: 25%;
  max-width: 140px;
  padding: 10px;
  height: 50%;
  float: left;
  border: 4px solid $bg-light;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-around;

  .icon {
    font-size: $icon-size;
  }

  &.active {
    @extend .icon-card__hover;
  }

  &:hover {
    @extend .icon-card__hover;
  }
}
</style>
