// 1.引包
var express = require('express')
var path = require('path')

// 2. 创建服务器应用程序
var app = express()

// 配置模板引擎(其他一些模板引擎： qjs，pug，nunjucks等)
app.engine('html',require('express-art-template'))

// 3.1 开放静态资源
// app.use('/public/',express.static('./public/'))
// app.use('/node_modules',express.static('./node_modules/'))
app.use('/public/',express.static(path.join(__dirname,'/public/')))
app.use('/node_modules',express.static(path.join(__dirname,'./node_modules/')))

// 这里默认就是views目录，这里再次设置方便以后想修改时再修改
app.set('views',path.join(__dirname,'./views/'))

app.get('/',function(req,res){
  res.render('index.html',{
    name:"张三"
  })
})



app.listen(3000,function(){
  console.log("running 请打开 http://127.0.0.1:3000")
})
