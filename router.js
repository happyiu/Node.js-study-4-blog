var express = require('express')
var router = express.Router()
var User = require('./models/user.js')
var md5 = require('blueimp-md5')

router.get('/',function(req,res){
  res.render('index.html',{
    user:req.session.user
  })


})

router.get('/login',function(req,res){
  res.render('login.html') 
})

router.post('/login',function(req,res){
  // 获取表单数据
  var body = req.body
  // 查询数据库 用户名密码是否正确
  User.findOne({
      email: body.email,
      password:md5(md5(body.password))
  },function(err,user){
    if(err){
      return res.status(500).json({
        err_code:500,
        message:'Internal error'
      })
    }

    if(!user){
      return res.status(200).json({
        err_code:1,
        message:'Emal or password is invaild'
      })
    } 
    
    // 用户存在，登录成功，使用Session记录登录状态
    req.session.user = user
    return res.status(200).json({
      err_code:0,
      message:'OK'
    })
      
    



  })
})

router.get('/register',function(req,res){
  res.render('register.html')
})

router.post('/register',function(req,res){
  // 1.获取表单提交的数据
  var body = req.body
  // 2.操作数据库
    // 判断用户是否存在
  User.findOne({
    // 或 条件查询
    $or:[
      {
        email:body.email
      },
      {
        nickname:body.nickname
      }
    ]
  },function(err,data){
    if(err){
      return res.status(500).json({
        err_code:500,
        message:'Internal error'
      })
    }
    if(data){
      //邮箱，昵称已存在
      return res.status(200).json({
        err_code:1,
        message:'Email or nickname aleady exists'
      })
    }
    // 对密码 进行 md5 重复加密
    body.password = md5(md5(body.password))
    // Express 提供了一个响应方法，该方法接受一个对象作为参数，它会自动帮你把对象转为字符串再发送给浏览器
    new User(body).save(function(err,user){
      if(err){
        return res.status(500).json({
          err_code:500,
          message:'Internal error'
        })
      }

      // 注册成功，使用Session记录用户的登录状态
      req.session.user = user

      res.status(200).json({
        err_code:0,
        message:'OK'
      })

    })
  })
})
 
router.get('/logout',function(req,res){
  // 清除登录状态
  req.session.user = null
  // (因为直接点退出触发a链接，是同步的)重定向到登录页
  res.redirect('/login')
})

module.exports = router
