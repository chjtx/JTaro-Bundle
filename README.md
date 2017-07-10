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
| target | \<String\> | Y | 生产目录的index.html模板 |
| copies | \<Array\> | N | 直接拷贝的文件（夹） |
| rollupPlugins | \<Array\> | N | 参考 [Rollup JavaScript-API#plugins](https://github.com/rollup/rollup/wiki/JavaScript-API#plugins) |
| sourceMap | \<Boolean\> | N | 默认为false，是否开启sourceMap |
| callback | \<Function\> | N | 打包完成后执行的回调 |

示例：

```js
// nodejs
var jtaroBundle = require('jtaro-bundle')
var uglify = require('rollup-plugin-uglify')
var babel = require('rollup-plugin-babel')

jtaroBundle.bundle({
  origin: 'dev/index.html',  // 开发目录的index.html
  target: 'pro/index_template.html',  // 生产目录的index.html模板
  copies: ['./data.json', './assets'],  // 直接拷贝的文件（夹）
  // 自定义使用rollup打包时使用的插件
  // uglify不能压缩ES6语法，所以babel要放在uglify前面
  rollupPlugins: [babel({
    include: './dev/pages/*.js', // 相对于该脚本文件（请注意区分与jtaro-module的babel插件路径）
    presets: [
      [
        'es2015',
        {
          'modules': false
        }
      ]
    ]
  },
    uglify()],
  sourceMap: true,
  callback: function () {
    console.log('打包完成')
  }
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

### v0.3.0 (2017-07-10)

- 添加回调函数，打包完成后可执行回调
- 添加创建带时间戳路径的index.html文件用于清除缓存，因此原index.html模板文件要修改为index_template.html

### v0.2.6 (2017-06-09)

- 修复工程目录路径带`.`报错的问题

### v0.2.5 (2017-05-19)

- 更新依赖`rollup-plugin-jtaro-module@0.2.0`

### v0.2.4 (2017-05-16)

- 更新依赖`rollup-plugin-jtaro-module@0.1.0`

### v0.2.3 (2017-05-04)

- 更新依赖`rollup-plugin-jtaro-module@0.0.7`

### v0.2.2 (2017-05-02)

- 补充修复windows下index方法解释`\`反斜杠路径错误的问题

### v0.2.1 (2017-05-01)

- 修复windows下index方法解释`\`反斜杠路径错误的问题

### v0.2.0 (2017-03-21)

- 新增index方法，用于将文件夹里所有js文件索引到一个js文件里，给rollup.js提供入口

### v0.1.2 (2017-03-13)

- 添加sourceMap选项

### v0.1.1 (2017-02-28)

- 添加rollupPlugins选项