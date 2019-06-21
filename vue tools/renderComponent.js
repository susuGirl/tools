var fs = require('fs');
var _arguments = process.argv.splice(2)
var fileName = ''
var _url = ''

if (_arguments.length === 1) {
  _url = `/src/components/businessComponents/`
  fileName = _arguments[0] // 要创建的文件的文件名
} else if (_arguments.length === 0) {
  return console.log(`请正确输入命令：
  业务组件 npm run render name
  纯组件 npm run render p name`)
} else {
  _url = `/src/components/${_arguments[0] === 'p' ? 'pureComponents' : 'businessComponents'}/`
  fileName = _arguments[1] // 要创建的文件的文件名
}

var _path = process.cwd() + _url + fileName + '/';
var filesName = process.cwd() + _url // 在当前脚本的工作目录下 components 文件夹的路径
var files = fs.readdirSync(filesName) // components 下的所有文件名，数组
init(_path , fileName)


function init(_local , _fileName){ // 如果文件夹重名，则阻止创建
  if (!_fileName) {
    console.log('请输入文件名称 =======');
    return;
  }
  for (var i in files) {
    if(files[i] == _fileName){
      console.log(`${_fileName}文件夹已存在 , 请更换名称`);
      return;
    }
  }
  
  try {
    
    fs.mkdir(_local, function(e){
      console.log('文件夹创建成功');
      var _path = _local;
      makeFile(_path , fileName , '.vue');
      makeFile(_path , fileName , '.styl');
    })    
    
  } catch (error) {
    console.error('============ 文件夹创建失败,请重试~');
  }

}

function makeFile(path , fileName , type){
  try {
    fs.createWriteStream(path + 'index' + type);

    fs.open(path + 'index' + type, "w", function (err, fd) {
      var index = fileName.lastIndexOf('/') , insertContent = '';
      var useName = index != -1 ? fileName.substring(index + 1) : fileName;
      var upperCaseName = ''
      var _useName = useName
      if (useName.indexOf('-') > -1) { // 组件以 短横线分隔命名
        upperCaseName = useName
        let arr = []
        useName.split('-').forEach((o, ind) => {
          if (ind === 0) {
            arr.push(o)
          } else {
            arr.push(o.substring(0, 1).toUpperCase() + o.substring(1))
          }
        })
        _useName = arr.join('') // 栗子：将 demo-com 改成 demoCom
      } else { // 组件以 首字母大写命名
        upperCaseName = useName.substring(0, 1).toUpperCase() + useName.substring(1)
      }
        switch (type) {
          case '.vue':
            insertContent = 
`<script>
import './index.styl'

export default {
  name: '${upperCaseName}', // 组件名称
  globalComponent: false, // 是否要全局注册该组件
  props: {},

  data () {
    return {

    }
  },
  computed: {

  },
  components: {

  },
  methods: {

  },
  created () {

  },
  mounted () {

  },
  beforeDestroy () {

  },
  render () {
    return (
      <div class="${_useName}RenSty">
        ${useName}
      </div>
    )
  }
}
</script>
`;
            break;
          case '.styl':
            insertContent = 
`// @import '../../../stylus/commit.styl'

.${_useName}RenSty
  font-size: .25rem
`
          break;
          default:
            insertContent = '';
          break;
        }
        var buf = new Buffer(insertContent);
        fs.write(fd,buf,0,buf.length,0,function(err,written,buffer){});
    })

    console.log(fileName + type + '创建成功~');
  } catch (error) {
    console.error('============' + fileName + type + '创建失败~');
  }
  
}