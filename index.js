var fs = require('fs')
var path = require('path')

exports.bundle = function (options) {
  // 遍历demos/jroll_demo/pages里的js文件路径创建bundle.js
  var paths = fs.readdirSync(path.resolve(options.src))
  var content = ''

  paths.forEach((item, index) => {
    if (/\.js$/.test(item)) {
      content += 'import p' + index + ' from \'./pages/' + item + '\'\nVue.component(\'pages__' + item.replace('.js', '') + '\', p' + index + ')\n'
    }
  })
  fs.writeFileSync(path.resolve(options.dest), content)
}
