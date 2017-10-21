const express = require('express');
const User = require('../models/User');
const Content = require('../models/Contents');
const router = express.Router();

let responseDate;

router.use((req, res, next) => {
    responseDate = {
        code: 0,
        message: ''
    }

    next();
});

/**
 * 注册逻辑
 * 1.用户名不能为空
 * 2.密码不能为空
 * 3.两次输入密码必须一致
 * 4.用户名是否已注册(数据库查询)
 */
router.post('/user/register', (req, res) => {
    let username = req.body.username,
        password = req.body.password,
        repassword = req.body.repassword;

    if (username.length < 5 || username.length > 10) {
        responseDate.code = 1;
        responseDate.message = '用户名必须在5~10位之间';
        res.json(responseDate);
        return;
    } else if (password.length < 8 || password.length > 12) {
        responseDate.code = 2;
        responseDate.message = '密码必须在8~12位之间';
        res.json(responseDate);
        return;
    } else if (password !== repassword) {
        responseDate.code = 3;
        responseDate.message = '两次密码输入不一致';
        res.json(responseDate);
        return;
    }

    User.findOne({
        username: username,
    }).then((userInfo) => {
        if (userInfo) {
            responseDate.code = 4;
            responseDate.message = '用户名已经被注册了';
            res.json(responseDate);
            return Promise.reject();
        }
        return new User({
            username: username,
            password: password
        }).save();
    }).then((newUserInfo) => {
        responseDate.message = '注册成功';
        res.json(responseDate);
    });
});

/* 登录 */
router.post('/user/login', (req, res) => {
    let username = req.body.username,
        password = req.body.password;

    if (username === '' || password === '') {
        responseDate.code = 1;
        responseDate.message = '用户名和密码不能为空';
        res.json(responseDate);
        return;
    }

    User.findOne({
        username: username,
        password: password
    }).then((userInfo) => {
        if (!userInfo) {
            responseDate.code = 2;
            responseDate.message = '用户名或密码错误';
            res.json(responseDate);
            return;
        }
        responseDate.message = '登录成功';
        responseDate.userInfo = {
            _id: userInfo._id,
            username: userInfo.username
        }
        req.cookies.set('userInfo', JSON.stringify({
            _id: userInfo._id,
            username: userInfo.username
        }));
        res.json(responseDate);
        return;
    })
});

router.get('/user/logout', (req, res) => {
    req.cookies.set('userInfo', null);
    responseDate.message = '退出';
    res.json(responseDate);
});

/**
 * 获取指定文章的评论
 */
router.get('/comment', (req, res) => {
    let contentId = req.query.contentId || '';

    Content.findOne({
        _id: contentId
    }).then((content) => {
        responseDate.data = content.comments;
        res.json(responseDate);
    });
});

/**
 * 评论提交
 */
router.post('/comment/post', (req, res) => {

    let contentId = req.body.contentId || '';
    let postData = {
        username: req.userInfo.username,
        postTime: new Date(),
        content: req.body.content
    };

    Content.findOne({
        _id: contentId
    }).then((content) => {
        content.comments.push(postData);
        return content.save();
    }).then((newContent) => {
        responseDate.message = '评论成功';
        responseDate.data = newContent;
        res.json(responseDate);
    });
});

module.exports = router;