# JTaro-Bundle

为JTaro服务的打包脚本，将整个文件夹所有js文件（Vue页面组件）合并到一个文件并创建Vue组件

```js
// nodejs
var jtaroBundle = require('jtaro-bundle')
jtaroBundle({
  src: 'src/pages',  // 源目录
  dest: 'src/pages.js'  // 目标文件
})
```
