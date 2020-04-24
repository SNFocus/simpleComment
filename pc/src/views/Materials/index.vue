<template>
  <div class="materials-wrapper">
    <div class="materials">
      <a :href="'#' + key" v-for="(value, key) in commentList" :key="key" class="box">
        <pre :data-key="key">{{value}}</pre>
      </a>
    </div>
    <div class="minimap" v-if="mapData.length">
      <pre
      v-for="item in mapData"
      :key="'map'+item.key"
      :style="{transform: 'scale(' + item.scaleRatio + ')'}">{{item.value}}</pre>
    </div>
  </div>
</template>
<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import comments from '@assets/commentStore/recommend.js'
// import html2canvas from 'html2canvas'
@Component
export default class Materials extends Vue {
  commentList = comments
  mapData = []
  MAP_WIDTH = 150

  mounted () {
    document.querySelectorAll('.materials pre').forEach((t: HTMLPreElement) => {
      this.mapData.push({
        key: t.dataset.key,
        scaleRatio: parseInt(t.clientWidth / this.MAP_WIDTH),
        value: this.commentList[t.dataset.key]
      })
    })
  }
}
</script>

<style lang="scss" scoped>
.materials-wrapper{
  height: 100%;
  width: 100%;
  overflow: hidden;
  position: relative;
}
.materials{
  height: 100%;
  width: 100%;
  padding-top: 1rem;
  padding-left: 1rem;
  overflow: auto;
  color: $bg-dark;
  .box{
    width: 48%;
    margin-right: 2%;
    overflow: auto;
    display: inline-block;
    border: 4px dashed #e5e5e5;
    background: $bg-light;
    &:hover{
        box-shadow: $shadow;
    }
    pre{
      float: left;
      margin: 1rem;
    }
  }
}

.minimap{
  width: 150px;
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  overflow: scroll;
}
</style>
