# JTaro-Bundle

为JTaro服务的打包脚本

## 安装

```bash
npm install -D jtaro-bundle
```

## 方法

### bundle

- 根据index.html的href和src属性提取需要的文件
- 将整个文件夹所有第一层js文件（Vue页面组件）合并到一个文件并创建Vue组件
- 直接拷贝指定文件（夹）

选项：

| 键 | 值 | 必填 | 备注 |
|:--:|:--:|:--:|:--:|
| origin | \<String\> | Y | 开发目录的index.html |
| target | \<String\> | Y | 生产目录的index.html |
| copies | \<Array\> | N | 直接拷贝的文件（夹） |
| rollupPlugins | \<Array\> | N | 参考 [Rollup JavaScript-API#plugins](https://github.com/rollup/rollup/wiki/JavaScript-API#plugins) |
| sourceMap | \<Boolean\> | N | 默认为false，是否开启sourceMap |

示例：

```js
// nodejs
var jtaroBundle = require('jtaro-bundle')
var uglify = require('rollup-plugin-uglify')

jtaroBundle.bundle({
  origin: 'dev/index.html',  // 开发目录的index.html
  target: 'pro/index.html',  // 生产目录的index.html
  copies: ['./data.json', './assets']  // 直接拷贝的文件（夹）
  rollupPlugins: [uglify()],  // 自定义使用rollup打包时使用的插件
  sourceMap: true
})
```

### index

用于将文件夹里所有js文件索引到一个js文件里，给rollup.js提供入口

`require('jtaro-bundle').index(path[, name])`

- path 必须，要提取索引的目录
- name 可选，索引文件的名称，如果不填，默认为`<目录名> + _index.js`

```js
var jtaroBundle = require('jtaro-bundle')
jtaroBundle.index('dev/pages/')
// jtaroBundle.index('dev/pages/', 'myIndex.js') // 自定义文件名
```

将会生成`dev/pages.js`文件，`dev/pages.js`文件内容类似如下形式，引入js并创建Vue组件

```js
import p2 from './pages/detail.js'
Vue.component('pages__detail', p2)
import p4 from './pages/home.js'
Vue.component('pages__home', p4)
import p8 from './pages/reply.js'
Vue.component('pages__reply', p8)
```

## LOG

### v0.2.0 (2017-03-21)

- 新增index方法，用于将文件夹里所有js文件索引到一个js文件里，给rollup.js提供入口

### v0.1.2 (2017-03-13)

- 添加sourceMap选项

### v0.1.1 (2017-02-28)

- 添加rollupPlugins选项