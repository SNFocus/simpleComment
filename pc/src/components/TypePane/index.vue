<template>
  <div class="type-pane">
    <div
      v-for="type in myBaseTypes"
      :key="type.icon"
      class="type-card"
      :class="{active: activeType==type.key}"
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
import { Component, Prop, Vue, Watch } from 'vue-property-decorator'
import { baseTypes, BaseTypes, TypeItem } from '@assets/config/baseConfig'
import { State, Mutation } from 'vuex-class'

@Component
export default class TypePane extends Vue {
  @State('activeNav') activeNav: string;
  @State('activeType') activeType: string;
  @Mutation('changeType') changeActiveType;

  readonly name: string = 'type-pane';
  myBaseTypes: BaseTypes = baseTypes;

  private created (): void {
    if (!this.activeType) {
      this.changeActiveType(Object.keys(this.myBaseTypes)[0])
    }
  }

  changeType (type: TypeItem) {
    this.changeActiveType(type.key)
  }
}
</script>

<style lang="scss" scoped>
.type-pane {
  height: 38%;
  padding: 24px;
  border-radius: $radius;
  background: $bg-color;
  border-top-right-radius: 0;
}

.type-card {
  width: 25%;
  max-width: 140px;
  padding: 10px;
  height: 50%;
  float: left;
  border: 4px solid $bg-color;
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
