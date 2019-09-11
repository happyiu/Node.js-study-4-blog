var mongoose = require('mongoose')
mongoose.connect('mongodb://i_blog_owner:1234@127.0.0.1:29999/blog',{useMongoClient:true})
var Schema = mongoose.Schema

var userSchema = new Schema({
  email:{
    type:String, 
    required:true
  },
  nickname:{
    type:String,
    required:true
  },
  password:{
    type:String,
    required:true
  },
  created_time:{
    type:Date,
    //注意：这里不能写 Date.now() 因为会即刻调用
    // 这里直接给了 Date.now 方法，当你去 new Model时，会调用Date.now 的方法
    default: Date.now
  },
  last_modified_time:{
    type:Date,
    default: Date.now
  },
  avatar:{
    type:String,
    default:'/public/img/avatar-default.png'
  },
  bio:{
    type:String,
    default:''
  },
  gender:{
    type:Number,
    enum:[-1,0,1],
    default:-1
  },
  brithday:{
    type:Date
  },
  status:{
    type:Number,
    // 0 没有权限限制
    // 1 不可以评论
    // 2 不可以登录
    enum:[1,2],
    default:0
  }
})


module.exports = mongoose.model('User',userSchema)
