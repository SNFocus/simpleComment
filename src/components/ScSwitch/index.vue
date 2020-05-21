<template>
    <div class="sc-switch-wrapper">
        <div class="switch-item" :class="{active: checked}" @click="onSwitchChange(true)">{{trueText}}</div>
        <div class="switch-item" :class="{active: !checked}" @click="onSwitchChange(false)">{{falseText}}</div>
        <!-- 占位元素 防止wrapper高度崩塌 -->
        <div class="switch-item place" >{{trueText}}</div>
    </div>
</template>
<script lang="ts">
import { Vue, Component, Model, Prop } from 'vue-property-decorator'

@Component({
  name: 'sc-switch'
})
export default class ScSwitch extends Vue {
    @Prop({ default: 'Yes' }) readonly trueText !: string;
    @Prop({ default: 'No' }) readonly falseText !: string;
    @Prop({ default: 'default' }) readonly size !: string;
    @Model('change', { type: Boolean }) readonly checked!: boolean;

    onSwitchChange (val: boolean): void{
      this.$emit('change', val)
    }
}
</script>

<style lang="scss" scoped>
$switch-item-transition: transform 1s ease-in-out, z-index 1s  ease-in-out;
.sc-switch-wrapper{

    > .switch-item{
            width: 90px;
            padding: 6px 10px;
            font-size: 12px;
            text-align: center;
            line-height: 18px;
            color: white;
            position: absolute;
            box-shadow: $shadow;
            cursor: pointer;
            z-index: 9;
            transition: $switch-item-transition;
            background: $color-info;

            &.active{
                z-index: 99;
                background: $color-success;
            }

            &.place{
                position: static;
                visibility: hidden;
            }
    }

    &:hover{
         .switch-item.active {
            transform: translateX(80%);
            transition: $switch-item-transition;
            z-index: 1;
        }
        .switch-item:not(.active) {
            transform: translateX(-20%);
            transition: $switch-item-transition;
        }
    }
}

</style>
