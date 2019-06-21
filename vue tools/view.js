/**
 * 创建页面模块
 * npm run view custom/fundOne/fileName
 *
 * fs Node.js内置的文件系统模块
 * process.cwd() 返回运行当前脚本的工作目录的路径
 * fs.readFileSync() 同步读取文件
 *
 */

var fs = require('fs')
var _arguments = process.argv.splice(2)
var _path = process.cwd() + '/src/views/' + _arguments[0] + '/'
var _index = _arguments[0].lastIndexOf('/')
var fileName = _arguments[0].substring(_index).split('/')[1] // 要创建的文件的文件名
var filesName = process.cwd() + '/src/views/' + _arguments[0].substring(0, _index) + '/' // 在当前脚本的工作目录下 views 文件夹的路径
var files = fs.readdirSync(filesName) // views 下的所有文件名，数组
var _slashIndex = _arguments[0].split('/').length
var _stylLink = ''
for (var ind = 0; ind <= _slashIndex; ind++) {
  _stylLink = _stylLink + '../'
}

init(_path, fileName)

function init (_local, _fileName) { // 如果文件夹重名，则阻止创建
  if (!_fileName) {
    console.log('请输入文件名称 =======')
    return
  }
  for (var i in files) {
    if (files[i] === _fileName) {
      console.log(`${_fileName}文件夹已存在 , 请更换名称`)
      return
    }
  }

  try {
    fs.mkdir(_local, function (e) {
      console.log('文件夹创建成功')
      var _path = _local
      makeFile(_path, fileName, '.vue')
      makeFile(_path, fileName, '.styl')
      makeFile(_path, fileName, 'Service.js')
      makeFile(_path, fileName, 'Router.js')
    })
  } catch (error) {
    console.error('============ 文件夹创建失败,请重试~')
  }
}

function makeFile (path, fileName, type) {
  try {
    var _creatFileName = type === 'Service.js' ? fileName : 'index'
    // var _creatFileName = 'index'
    fs.createWriteStream(path + _creatFileName + type)

    fs.open(path + _creatFileName + type, 'w', function (err, fd) {
      var index = fileName.lastIndexOf('/')
      var useName = index != -1 ? fileName.substring(index + 1) : fileName
      var _Upname = useName.substring(0, 1).toUpperCase() + useName.substring(1), insertContent = ''
      switch (type) {
        case '.vue':
          insertContent =
`<template>
  <div class="${useName}ViewSty">
     ${useName}
  </div>
</template>

<script>
import './index.styl'
import ${useName}Service from './${useName}Service.js'
// import { mapActions } from 'vuex'

export default {
  data () {
    return {
      pageData: null
    }
  },
  computed: {

  },
  filters: { // 局部过滤器，可filters/partFilters里定义 或 在此调用

  },
  components: {

  },
  methods: {
    // ...mapActions([
    //   'editTitle',
    //   'removeTitle'
    // ]),
    init (params) {
      this.UTILS.alert('加载中...', 8 * 1000)
      ${useName}Service.init(params).then(res => {
        this.UTILS.hide()
        if (res.code === 20000) {
          this.pageData = res.result
          // this.editTitle(res.result.title)
          // console.log('接口返回参数-----', this.pageData)
        }
      })
    }
  },
  created () {

  },
  mounted () {

  },
  beforeDestroy () {
    // this.removeTitle()
  }
}
</script>
`
          break
        case 'Service.js':
          insertContent =
`import extendsApi from 'services/extendsApi'

class ${_Upname}Api extends extendsApi {
  constructor () {
    super()
    this.initUrl = ''
  }
  // 请求方式：sendGet sendPost sendAll,第三个参数baseUrl可选：passport trade,而post 有第四个参数可选requestPayload
  init (params) {
    return this.sendGet(this.initUrl, params).then(res => {
      return res.data
    })
  }
}

export default new ${_Upname}Api()
`
          break
        case 'Router.js':
          insertContent =
`
export default {
  path: '/${fileName}',
  name: '${fileName}',
  component: () => import('../${fileName}'),
  meta: {
    checkLogin: false, // 是否需要登录验证
    title: '',
    keepAlive: false, // 需要缓存的组件
    showHeader: true,
    headerColor: '', // header 颜色
    BanToReutrn: false // 禁止返回上一页
  }
}
`
          break
        case '.styl':
          insertContent =
`@import '${_stylLink}stylus/commit.styl'

.${useName}ViewSty
  font-size: .25rem
`
          break
        default:
          insertContent = ''
          break
      }
      var buf = new Buffer(insertContent)
      fs.write(fd, buf, 0, buf.length, 0, function (err, written, buffer) {})
    })

    console.log(fileName + type + '创建成功')
  } catch (error) {
    console.error('============' + fileName + type + '创建失败~')
  }
}
