<template>
  <div class="type-pane">
    <div
      v-for="type in myBaseTypes"
      :key="type.icon"
      class="type-card"
      :class="{active: typeKey==type.key}"
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
import { Component, Vue, Watch, PropSync } from 'vue-property-decorator'
import { navConfig, NavItemIF } from '@assets/config/baseConfig'

@Component
export default class TypePane extends Vue {
    typeKey !: string;
    myBaseTypes: NavItemIF[] | undefined;

    created (): void {
      if (typeof navConfig !== 'undefined') {
        this.myBaseTypes = (navConfig as NavItemIF[]).find((t: NavItemIF) => t.key === 'base').typeList
      }
    }

    /**
 * 改变全局注释类型
 * @param {NavItemIF} type - 注释类型
 */
    changeType (type: NavItemIF): void {
      this.$router.push(`/base/${type.key}`)
    }

    @Watch('$route.path', { immediate: true })
    onPathChange (path: string): void{
      const paths = path.split('/').slice(1)
      if (paths.length > 1 && paths[0] === 'base') {
        this.typeKey = paths[1]
        this.$forceUpdate()
      }
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
