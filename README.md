# 博客

## path 核心模块
操作路径
- path.basename('路径','[要去除的后缀名]')
获取指定路径的文件名
path.basename('c:/a/b/index.js','.js')

- path.dirname('路径)
获取文件的路径目录

- path.extname('路径)
获取文件的扩展名

- path.parse('路径')
获取到以上信息

- path.join('路径')
拼接路径，避免手动拼接造成的错误路径
path.join('c:/a','b')
得到的结果：c:\\a\\b

## Node 中的其他（非模块）成员
在每个模块中，除了require，exports等模块相关API之外，还有两个特殊的成员
- __dirname 可以动态的用来获取当前文件模块所属目录的绝对路径
- __filename    可以动态的获取当前文件的绝对路径
在文件操作中，使用相对路径是不可靠的，因为在node中文件操作路径被设计为相对执行node命令所处的路径，为了解决这个问题，只需要将相对路径变为绝对路径
- 模块中的路径标识和这里的路径没有关系，不受影响（相对于当前文件模块，不受执行node命令所处路径影响）
```js
var fs = require('fs')
var path = require('path')
// F:\jsxx\node.js\基础
console.log(__dirname)
// F:\jsxx\node.js\基础\10-filename和dirname.js
console.log(__filename)
// ./data/a.txt 是相对于 执行 node 命令所处的终端路径
// 一旦执行 node 命令的终端路径改变，就会查找失败
// 文件操作中，相对路径的设计就是相对执行 node 命令所处的路径
// fs.readFile('./data/a.txt','utf8',function(err,data){
//     if(err){
//         throw err
//     }
//     console.log(data)
// })

// 使用绝对路径就能解决这个问题了，但将文件给别人时，写死的绝对路径就会产生错误
// fs.readFile('F:/jsxx/node.js/基础/data/a.txt','utf8',function(err,data){
//     if(err){
//         throw err
//     }
//     console.log(data)
// })

// 因此，使用动态的绝对路径就能保证不会出错
// fs.readFile(__dirname+'/data/a.txt','utf8',function(err,data){
//     if(err){
//         return console.log(err)
//     }
//     console.log(data)
// })

// 为了防止手动拼接产生的错误，就可以使用path.join来解决
fs.readFile(path.join(__dirname,'./data/a.txt'),'utf8',function(err,data){
    if(err){
        return console.log(err)
    }
    console.log(data)
})
```
