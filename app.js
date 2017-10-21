/**
 * 应用程序的启动（入口）文件
 */
const express = require('express');
const swig = require('swig');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const Cookies = require('cookies');
const User = require('./models/User');
const app = express();

/**
 * 静态文件托管
 */
app.use('/public', express.static(__dirname + '/public'));

/**
 * 定义当前应用所使用的模板引擎
 * 第一个参数:模板引擎的名称,同时也是模板文件的后缀
 * 第二个参数:表示用于解析处理模板内容的方法
 */
app.engine('html', swig.renderFile);

/**
 * 设置模板文件存放的目录,第一个参数必须是views,第二个参数表示用文件存放的位置
 */
app.set('views', './views');

/**
 * 注册所使用的模板引擎,第一个参数必须是 view engine,第二个参数和app.engine中定义的模板引擎名称必须是一致的
 */
app.set('view engine', 'html');

/**
 * 在开发过程中,需要取消模板缓存
 */
swig.setDefaults({ cache: false });

/**
 * bodyParser设置
 */
app.use(bodyParser.urlencoded({ extended: true }));

/* cookies设置 */
app.use((req, res, next) => {
    req.cookies = new Cookies(req, res);
    /* 解析用户登录的cookies信息 */
    req.userInfo = {};
    if (req.cookies.get('userInfo')) {
        try {
            req.userInfo = JSON.parse(req.cookies.get('userInfo'));
            User.findById(req.userInfo._id).then((userInfo) => {
                req.userInfo.isAdmin = Boolean(userInfo.isAdmin);
                next();
            });
        } catch (e) {
            next();
        }
    } else {
        next();
    }
});

/**
 * 根据不同的功能划分模块
 */
app.use('/admin', require('./routers/admin'));
app.use('/api', require('./routers/api'));
app.use('/', require('./routers/main'));

mongoose.connect('mongodb://localhost:27018/blog', { useMongoClient: true }, (erro) => {
    if (erro) {
        console.log('失败');
    } else {
        console.log('成功');
        app.listen(8081);
    }
});