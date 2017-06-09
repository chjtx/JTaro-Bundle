var fs = require('fs-extra')
var path = require('path')
var rollup = require('rollup')
var jtaroModule = require('rollup-plugin-jtaro-module')

/**
 * 扫描目标index.html，从相对源index.html提取需要的文件
 * @param options.origin String 开发版的index
 * @param options.target String 生产版的index
 * @param options.copies Array<String> 不能从目标index扫描到的文件从这里拷贝，元素可为目录或文件，都必须相对源index
 * @param options.rollupPlugins 提供Rollup插件
 * @param options.sourceMap 开启sourceMap
 */
exports.bundle = function (options) {
  // 扫描目标index
  var assets = scanTarget(options.target)
  var originDir = path.dirname(options.origin)
  var targetDir = path.dirname(options.target)

  // 拷贝需要直接拷贝的文件，合并不存在的文件（将文件夹里所有html/js用rollup打包成一个与文件夹同名的js文件）
  copyFiles(assets.concat(options.copies || []), originDir, targetDir, options.rollupPlugins, options.sourceMap)
}

// 生成一个索引文件引入文件夹里所有js后缀文件
exports.index = index

function index (d, n) {
  var paths = fs.readdirSync(path.resolve(d))
  var content = ''
  var f = /(\/|\\)([^\/\\]+)(\/|\\)?$/.exec(d)[2]
  if (!n) n = f + '_index.js'
  var dist = path.resolve(d.replace(/(\/|\\)([^\/\\]+)(\/|\\)?$/, ''), n)
  paths.forEach((item, index) => {
    if (/\.js$/.test(item)) {
      content += 'import p' + index + ' from \'./' + f + '/' + item + '\'\nVue.component(\'pages__' + item.replace('.js', '') + '\', p' + index + ')\n'
    }
  })

  fs.writeFileSync(dist, content)
  return dist
}

function copyFiles (copies, ori, tar, plugins, sourceMap) {
  copies.forEach(f => {
    const oriFile = path.resolve(ori, f)
    const tarFile = path.resolve(tar, f)
    fs.stat(oriFile, (err, s) => {
      if (err) {
        fs.stat(path.dirname(oriFile), (err, s) => {
          if (s.isDirectory()) {
            rollupBundle({
              root: ori,
              src: oriFile.replace(/\.js$/, '/'),
              dest: tarFile,
              plugins: plugins || [],
              sourceMap: !!sourceMap
            })
          }
          if (err) throw err
        })
      } else if (s.isFile() || s.isDirectory()) {
        fs.copy(oriFile, path.resolve(tar, f), err => {
          if (err) throw err
        })
      }
    })
  })
}

function scanTarget (file) {
  var text = fs.readFileSync(path.resolve(file)).toString()
  var paths = []
  text.replace(/(?:(?:href|src)=(?:"|'))([^"']+)(?:"|')/g, (match, p) => {
    paths.push(p)
  })
  return paths
}

function rollupBundle (options) {
  var tempFile = index(options.src, '_jtaro_bundle_' + Date.now() + '.js')

  rollup.rollup({
    entry: tempFile,
    context: 'window',
    plugins: [jtaroModule({
      root: options.root || ''
    })].concat(options.plugins)
  }).then(function (bundle) {
    bundle.write({
      format: 'iife',
      dest: path.resolve(options.dest),
      sourceMap: options.sourceMap
    })
    // 删除临时文件
    fs.unlinkSync(tempFile)
  })
}
