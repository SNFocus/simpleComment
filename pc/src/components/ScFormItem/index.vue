<template>
    <div class="sc-input-box" :class="{showLine: showUnderLine}">
        <div class="label" >
            {{label}}
        </div>
        <div class="input-wrapper">
            <span class="dot"></span>
            <span style="padding:4px;"></span>
            <slot ></slot>
            <div class="underline" ></div>
            <div class="sideline" ></div>
        </div>
    </div>
</template>
<script lang="ts">
import { Vue, Prop, Component } from 'vue-property-decorator'
@Component
export default class ScFormItem extends Vue {
    @Prop(String) readonly label !: string ;
    @Prop({ default: true }) readonly showUnderLine !: string ;
}
</script>

<style lang="scss">
.showLine > .input-wrapper > {
  input:focus,
  textarea:focus {
    ~ .sideline {
        height: 100%;
        box-shadow: $shadow;
    }

    + .underline {
        right: 100% !important;
    }
  }
}

.sc-input-box:hover {
    .sideline {
         height: 100%;
         box-shadow: $shadow;
    }
}
</style>

<style lang="scss" scoped>
//
$input-bg: #ECECEC;
.sc-input-box {
    padding: 10px 16px;
    position: relative;

    .label{
        @include ellipsis;
        max-width: 5rem;
    }

    .input-wrapper{
        display: flex;
        align-items: center;
        line-height: 26px;
        min-height: 30px;
        .dot{
            padding: 6px;
            display: inline-block;
            background: #FF5722;
            transition: border-radius 1s;
        }

        .underline{
            height: 3px;
            position: absolute;
            bottom: 0;
            left: 66%;
            right: 34%;
            background: #4caf50;
            transition: left .3s, right .5s;
        }

        .sideline{
            width: 3px;
            height: 0;
            position: absolute;
            left:0;
            bottom: 0;
            background: #4caf50;
            transition: height .5s;
        }
        .sc-input {
            all: unset;
            background-color: $bg-light;
            border-radius: 2px;
            width: 100%;
            padding-left: 10px;
            transition: width 1s;
        }
    }

    &:hover{
        .dot{
            border-radius: 50%;
        }
    }

    &.showLine:hover{
        .underline{
            left: 0;
            right: 40%;
            box-shadow: $shadow;
        }
    }

}
</style>
