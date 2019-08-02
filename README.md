# 博客网站-实现简单的注册登录退出
## 大致步骤
- 创建目录结构
- 整合静态页（模板页）
- 路由设计
    - 首页
    - 用户登录
        - 登录页面（get）
        - 登录提交（post）
    - 用户注册
        - 注册页面（get）
        - 注册提交（post）
    - 退出
- 用户注册
    - 处理客户端页面内容（表单控件name，收集表单数据，发气请求）
    - 处理服务端
        - 先获取到客户端提交的信息
        - 操作数据库
            - 如果有错，发送500并发送json数据，err_code：500给客户端服务器出错
            - 如果没错，验证邮箱昵称是否重复
                - 重复，发送200并发送json数据，err_code：1，客户端处理err_code 对应的事件
                - 没重复，发送200并发送json数据，err_code：0，客户端处理err_code 对应的事件
- 用户登录
    - 同用户注册
- 用户退出


## 创建目录结构
- node_modules npm安装的模块插件等
- public 公共资源
    - img
    - css
    - js
    - ... ....
- views 静态页面
- models 数据库的表模型
- app.js 程序入口
- README.md 自述文件
- router.js 路由设计文件
- .gitignore git时选择忽略备份的文件
- package.json npm安装后保存的信息

## 静态页面的处理
因为页面都会有公共的头部和底部，所以我们可以选择将公共的部分抽离，然后挖空，作为页面模板
### art-template 制作模板页面
- 模板页面
    - 先新建登录时的头部html文件（不需要整个html结构，只需要头部页面的html）
        - {{if}}... {{else}}... {{/if}}   表示if条件判断选择要显示的内容
    ```html
        <nav class="navbar navbar-default">
            <div class="container">
                <div class="navbar-header">
                <button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#bs-example-navbar-collapse-1" aria-expanded="false">
                    <span class="sr-only">Toggle navigation</span>
                    <span class="icon-bar"></span>
                    <span class="icon-bar"></span>
                    <span class="icon-bar"></span>
                </button>
                <a class="navbar-brand" href="/">
                    <img width="90px" src="/public/img/logo3.png" alt="">
                </a>
                </div>
                <div class="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
                <form class="navbar-form navbar-left">
                    <div class="form-group">
                    <input type="text" class="form-control" placeholder="Search">
                    </div>
                </form>
                <ul class="nav navbar-nav navbar-right">
                    {{ if user }}
                    <a class="btn btn-default navbar-btn" href="/topics/new">发起</a>
                    <li class="dropdown">
                    <a href="#" class="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false"><img width="20" height="20" src="/public/img/avatar-default.png" alt=""> <span class="caret"></span></a>
                    <ul class="dropdown-menu">
                        <li class="dropdown-current-user">
                        当前登录用户: {{ user.nickname }}
                        </li>
                        <li role="separator" class="divider"></li>
                        <li><a href="#">个人主页</a></li>
                        <li><a href="/settings/profile">设置</a></li>
                        <li><a href="/logout">退出</a></li>
                    </ul>
                    </li>
                    {{ else }}
                    <a class="btn btn-primary navbar-btn" href="/login">登录</a>
                    <a class="btn btn-success navbar-btn" href="/register">注册</a>
                    {{ /if }}
                </ul>
                </div>
            </div>
            </nav>
    ```
    - 再新建未登录时的html文件（同上）
    - 再新建底部html 文件（同上）
    - 然后再新建 home.html 引用上面的子模板作为模板页面（需要完整的html页面结构）
        - {{ block 'name' }}{{ /block }} 表示name名的留空的内容
        - {{ include '子模板路径' }} 表示引入子模板
    ```html
    <!DOCTYPE html>
    <html lang="en">
    <head>
    <meta charset="UTF-8">
    <title>{{block 'title'}}默认标题{{/block}}</title>
    <link rel="stylesheet" href="/node_modules/bootstrap/dist/css/bootstrap.css">
    {{block 'head'}}{{/block}}
    </head>
        <body>
        {{include '../_partials/header.html'}}
        {{block 'body'}}{{/block}}
        {{include '../_partials/footer.html'}}
        <script src="/node_modules/jquery/dist/jquery.js"></script>
        <script src="/node_modules/bootstrap/dist/js/bootstrap.js"></script>
        {{block 'script'}}{{/block}}
        </body>
    </html>
    ```

    - 使用模板创建index.html
        - {{extend './_layouts/home.html'}} 表示导入创建的模板
        - {{block 'title'}}{{'多人博客 - 首页'}}{{/block}} 表示写入之前模板中叫name留空的部分
    ```html
    {{extend './_layouts/home.html'}}

    {{block 'title'}}{{'多人博客 - 首页'}}{{/block}}

    {{block 'body'}}
    <section class="container">
    <ul class="media-list">
        <li class="media">
        <div class="media-left">
            <a href="#">
                <img width="40" height="40" class="media-object" src="/public/img/avatar-default.png" alt="...">
            </a>
        </div>
        <div class="media-body">
            <h4 class="media-heading"><a href="/topics/123">Media heading</a></h4>
            <p>sueysok 回复了问题 • 2 人关注 • 1 个回复 • 187 次浏览 • 2017-10-20 13:45</p>
        </div>
        </li>
    </ul>
    <nav aria-label="Page navigation">
        <ul class="pagination">
        <li>
            <a href="#" aria-label="Previous">
            <span aria-hidden="true">&laquo;</span>
        </a>
        </li>
        <li class="active"><a href="#">1</a></li>
        <li><a href="#">2</a></li>
        <li><a href="#">3</a></li>
        <li><a href="#">4</a></li>
        <li><a href="#">5</a></li>
        <li>
            <a href="#" aria-label="Next">
            <span aria-hidden="true">&raquo;</span>
        </a>
        </li>
        </ul>
    </nav>
    </section>
    {{/block}}
    ```
- 除了首页外，还分别需要login登录页，register注册页面




## 配置app.js入口文件
- Express 快速搭建Node.js的服务器
- body-parser Express框架下用来解析表单post提交的数据（req.body）
- express-session 操作Session的中间件
- art-template,express-art-template 模板引擎
- mongoose 操作MongoDB数据库
- 引入外部router.js路由规则
```js
// 1.1 引包
var express = require('express')
var path = require('path')
var bodyParser = require('body-parser')
var session = require('express-session')

var router = require('./router.js')
// 1.2. 创建服务器应用程序
var app = express()

// 1.3 配置中间件(一定要在挂载路由之前)，挂载路由
// 1.3.1 配置好Express-session，我们可以通过 req.session 来访问和设置Session成员
  // 添加 Session 数据  req.session.foo = 'bar'
  // 访问 Session 数据  req.session.foo
// 默认Session都是内存存储的，服务器一旦重启就会丢失，真正的生产环境会把Session进行持久化存储
app.use(session({
  secret: 'keyboard cat',   //配置加密字符串，会在原来的加密基础上和这个字符串拼起来去加密，提高加密的安全性
  resave: false,
  saveUninitialized: false   // 是否 无论是否使用session，都默认分配一把钥匙
}))

// 1.3.2 配置解析表单 POST 请求体插件（一定要在挂载路由之前）
app.use(bodyParser.urlencoded({extended:false}))
app.use(bodyParser.json())

// 1.3.3 挂载路由
app.use(router)

// 1.3.4 配置模板引擎(其他一些模板引擎： qjs，pug，nunjucks等)
app.engine('html',require('express-art-template'))

// 开发静态资源
app.use('/node_modules/',express.static(path.join(__dirname,'./node_modules/')))
app.use('/public/',express.static(path.join(__dirname,'./public/')))

// 设置静态页面所在的目录，默认就是views
app.set('views',path.join(__dirname,'./views/'))

// 1.3.5 监听服务
app.listen(3000,function(){
    console.log("running 请打开 http://127.0.0.1:3000")
})
```



## 路由设计
|    路径   |  方法  |  get参数  |          post参数         |     是否需要权      |   备注    |
|-----------|-------|-----------|---------------------------|---------------------|------------|
| /         | GET   |           |                           |                     | 渲染首页    |
| /register | GET   |           |                           |                     | 渲染注册页面 |
| /register | POST  |           | email，nickname，password |                     | 处理注册请求 |
| /login    | GET   |           |                           |                     | 渲染注册页面 |
| /login    | POST  |           | email,password            |                     | 处理登录请求 |
| /logot    | GET   |           |                           |                     | 处理退出请求 |

- 根据路由表，在router.js中编写路由规则
```js
// 先引包
var express = require('express')
var router = express.Router()
var User = require('./models/user.js')
var md5 = require('blueimp-md5')

// 默认请求路径显示为首页，渲染的数据从 session 中获取
router.get('/',function(req,res){
    res.render('index.html',{
        user:req.session.user
    })
})

// 请求路径为 /register 渲染注册页面
router.get('/register',function(req,res){
    res.render('register.html')
})

// 请求路径为 /register POST 请求时,提交表单，后台获取处理
router.post('/register',function(req,res){
    // 获取表单数据
    var body = req.body
    // 操作数据库，检查是否存在
    User.findOne({
        $or:[
            {email:body.eamil},
            {nickname:body.nickname}
        ]
    },function(err,data){
        // err 为数据库查找错误
        if(err){
            return res.status(500).json({
                err_code:500,
                message:'internal error'
            })
        }
        // 如果有data数据，表明数据库存在用户
        if(data){
            return res.status(200).json({
                err_code:1,
                message:'email or nickname aleady exists'
            })
        }

        // 如果找不到data，就将注册用户，存入数据库
        // 先将密码进行md5加密
        body.password = md5(md5(body.password))
        new User(body).save(function(err,user){
            // 如果保存失败
            if(err){
                return res.status(500).json({
                    err_code:500,
                    message:'internal error'
                })
            }
            // 保存成功，使用session记录用户的信息，根据发送状态码给前端，因为操作数据库是异步方法，所以后台不能重定向，只能前端根据状态码来跳转页面
            req.session.user = user

            res.status(200).json({
                err_code:0,
                message:'OK'
            })
        })

    })
})


// 请求路径为 /login 时渲染登录页面
router.get('/login',function(req,res){
    res.render('login.html')
})

// 点击退出时，清除session状态即可,因为这里不涉及异步表单提交，所以可以使用重定向来跳转页面
router.get('/logout',function(req,res){
    req.session.user = null
    res.redirect('/login')
})


// 最后导出路由设计
module.exports = router
```

