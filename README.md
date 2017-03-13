# JTaro-Bundle

为JTaro服务的打包脚本

## 作用

- 根据index.html的href和src属性提取需要的文件
- 将整个文件夹所有第一层js文件（Vue页面组件）合并到一个文件并创建Vue组件
- 直接拷贝指定文件（夹）

## 安装

```bash
npm install -D jtaro-bundle
```

## 用法

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

## 选项

| 键 | 值 | 必填 | 备注 |
|:--:|:--:|:--:|:--:|
| origin | \<String\> | Y | 开发目录的index.html |
| target | \<String\> | Y | 生产目录的index.html |
| copies | \<Array\> | N | 直接拷贝的文件（夹） |
| rollupPlugins | \<Array\> | N | 参考 [Rollup JavaScript-API#plugins](https://github.com/rollup/rollup/wiki/JavaScript-API#plugins) |
| sourceMap | \<Boolean\> | N | 默认为false，是否开启sourceMap |

## LOG

### v0.1.2 (2017-03-13)

- 添加sourceMap选项

### v0.1.1 (2017-02-28)

- 添加rollupPlugins选项