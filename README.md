* * *
# 项目描述
   一个用node+express+mongodb开发的个人博客.
   
   后台功能部分: 登录 / 注册 / 管理员页面 / 管理用户数据文章和分类数据以及文章的评论、阅读量等.
   
   前台部分: 用ajax请求后台数据并且渲染dom.
   
   适合想入门node并想学习整个前后端交互流程和exoress、mongoose、swig模板引擎在项目中基本使用的初学者.
   
   
# 技术栈
   node / express / mongodb / swig / mongoose / Robo 3T.

# 项目start
   需在根目录新建一个文件夹同步mongodb数据.
   
   下载安装mongodb后,打开cmd,把路径定至文件目录bin下.输入 mongod --dbpath= <你用于存放mongodb数据的文件夹的路径> --port = <指定服务端口号，默认端口27017>.
   
   需下载Robo 3T对数据库进行操作.
   
  最后在项目根目录 cmd 输入命令 node app.js 项目启动.
  
   
  浏览器输入localhost:8081.
