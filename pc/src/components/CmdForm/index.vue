<template functional>
    <div>
      <a-divider orientation="left">说明</a-divider>
        <ul>
          <li><span class="bold">标识头: </span> 指明注释类型，目前仅又文件(@file)和函数(@func)</li>
          <li><span class="bold">元数据: </span> 注释标签 例如@param 等同于 -p @returns 等同于 -r</li>
          <li><span class="bold">定界符: </span> .. => (两个英文句号)指明每个元数据字符串的结束位置/li>
          <li><span class="bold">示例格式: </span> @func -d.根据id获取学生信息.. -p.string.number. ID - 学生ID.. -r.Student...</li>
        </ul>

        <a-divider orientation="left">函数</a-divider>
        <div>
          <div>格式： @func -d.desc.. -p.type.tpye.desc.. -r.type.desc..</div>
          <div>注意： desc可以没有 但desc前的 . 必须作为占位</div>
          <ul>
            <li><span class="bold">desc: </span> -d</li>
            <li><span class="bold">@param: </span> -p</li>
            <li><span class="bold">@returns: </span> -r</li>
          </ul>
        </div>
        <a-divider orientation="left">文件</a-divider>
        <div>
          <div>格式： @file -d.desc.. -v.version.. -a.author..</div>
          <ul>
            <li><span class="bold">desc: </span> -d</li>
            <li><span class="bold">@Version: </span> -v</li>
            <li><span class="bold">@Author: </span> -a</li>
            <li><span class="bold">@LastEditTime: </span> 自动生成</li>
            <li><span class="bold">@LastEditors: </span> 自动生成</li>
          </ul>
        </div>
    </div>
</template>
<style lang="scss" scoped>
.bold{
  font-weight: bold;
}
</style>
