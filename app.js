// 1.引包
var express = require('express')
var path = require('path')
var bodyParser = require('body-parser')
var session = require('express-session')

var router = require('./router.js')

// 2. 创建服务器应用程序
var app = express()

// 在Express框架中，默认不支持 Session 和 Cookie
// 但是我们可以使用第三方中间件：express-session 来解决
// 1.安装 npm i express-session -s
// 2.引包
// 3.配置(一定要在挂载路由之前)
// 4.配置好后，我们可以通过 req.session 来访问和设置Session成员
  // 添加 Session 数据  req.session.foo = 'bar'
  // 访问 Session 数据  req.session.foo
// 默认Session都是内存存储的，服务器一旦重启就会丢失，真正的生产环境会把Session进行持久化存储
app.use(session({
  secret: 'keyboard cat',   //配置加密字符串，会在原来的加密基础上和这个字符串拼起来去加密，提高加密的安全性
  resave: false,
  saveUninitialized: false   // 是否 无论是否使用session，都默认分配一把钥匙
}))

// 配置解析表单 POST 请求体插件（一定要在挂载路由之前）
app.use(bodyParser.urlencoded({extended:false}))
app.use(bodyParser.json())

// 将路由挂载到app
app.use(router)

// 配置模板引擎(其他一些模板引擎： qjs，pug，nunjucks等)
app.engine('html',require('express-art-template'))



// 3.1 开放静态资源
// app.use('/public/',express.static('./public/'))
// app.use('/node_modules',express.static('./node_modules/'))
app.use('/public/',express.static(path.join(__dirname,'/public/')))
app.use('/node_modules',express.static(path.join(__dirname,'./node_modules/')))

// 这里默认就是views目录，这里再次设置方便以后想修改时再修改
app.set('views',path.join(__dirname,'./views/'))

// app.get('/',function(req,res){
//   res.render('index.html',{
//     name:"张三"
//   })
// })


// 配置一个处理404的中间件(注意顺序)
app.use(function(req,res){
  res.render('404.html')
}) 

  

// 配置全局错误处理中间件
// 跳到这个中间件的方法是： app.get('/',funvtion(req,res,next){fs.readFile('./README.md',function(err,data){if(err){next(err)})}})
// app.use(function(err,req,res,next){
//   res.status(500).send('error')
// })

app.listen(3001,function(){
  console.log("running 请打开 http://127.0.0.1:3001")
})
