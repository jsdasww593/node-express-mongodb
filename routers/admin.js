const express = require('express');
const User = require('../models/User');
const Category = require('../models/Categories');
const Content = require('../models/Contents');
const router = express.Router();

router.use((req, res, next) => {
    if (!req.userInfo.isAdmin) {
        res.send('你好,你无权进入后台管理页面');
        return;
    }
    next();
});

router.get('/', (req, res, next) => {
    res.render('admin/index', {
        userInfo: req.userInfo
    });
});

/* 从数据库中读取用户数据 */
router.get('/user', (req, res, next) => {

    /* 
       * limit(number):限制获取数据的条数 
       * skip(number):忽略数据的条数
    */

    /*当前页数*/
    let page = (req.query.page || 1) >> 0,
        /*每页显示数据*/
        limit = 3,
        /*忽略数据的条数*/
        skip = 0,
        /*总页数*/
        pages = 0;

    User.count().then((count) => {

        pages = Math.ceil(count / limit);
        page = Math.min(page, pages);
        page = Math.max(page, 1);
        skip = (page - 1) * limit;

        User.find().limit(limit).skip(skip).then((users) => {
            res.render('admin/user_index', {
                userInfo: req.userInfo,
                users: users,
                count: count,
                limit: limit,
                page: page,
                pages: pages,
                type: 'user'
            });
        });

    });

});

/**
 * 分页首页
 */
router.get('/category', (req, res) => {

    /*当前页数*/
    let page = (req.query.page || 1) >> 0,
        /*每页显示数据*/
        limit = 3,
        /*忽略数据的条数*/
        skip = 0,
        /*总页数*/
        pages = 0;

    Category.count().then((count) => {

        pages = Math.ceil(count / limit);
        page = Math.min(page, pages);
        page = Math.max(page, 1);
        skip = (page - 1) * limit;

        Category.find().sort({ _id: -1 }).limit(limit).skip(skip).then((categories) => {
            res.render('admin/category_index', {
                userInfo: req.userInfo,
                categories: categories,
                count: count,
                limit: limit,
                page: page,
                pages: pages,
                type: 'category'
            });
        });

    });
});

/**
 * 添加分类
 */
router.get('/category/add', (req, res) => {

    res.render('admin/category_add', {
        userInfo: req.userInfo
    });

});

router.post('/category/add', (req, res) => {

    let name = req.body.name || '';

    if (name === '') {
        res.render('admin/error', {
            userInfo: req.userInfo,
            message: '名称不能为空'
        });
        return;
    }

    Category.findOne({
        name: name
    }).then((rs) => {
        if (rs) {
            res.render('admin/error', {
                userInfo: req.userInfo,
                message: '分类已经存在了'
            });
            return Promise.reject();
        } else {
            return new Category({
                name: name
            }).save();
        }
    }).then((newCategory) => {
        res.render('admin/success', {
            userInfo: req.userInfo,
            message: '分类保存成功',
            url: '/admin/category'
        });
    })
});

/**
 * 分类修改
 */
router.get('/category/edit', (req, res) => {

    /* 获取要修改的分类的信息,并且用表单的形式展现出来 */
    let id = req.query.id || '';

    /* 获取要修改的分类信息  */
    Category.findOne({
        _id: id
    }).then((category) => {
        if (!category) {
            res.render('admin/error', {
                userInfo: req.userInfo,
                message: '分类信息不存在'
            });
        } else {
            res.render('admin/category_edit', {
                userInfo: req.userInfo,
                category: category
            });
        }
    });

});

router.post('/category/edit', (req, res) => {

    let id = req.query.id || '',
        name = req.body.name || '';

    Category.findOne({
        _id: id
    }).then((category) => {
        if (!category) {
            res.render('admin/error', {
                userInfo: req.userInfo,
                message: '分类信息不存在'
            });
            return Promise.reject();
        } else {
            if (name === category.name) {
                res.render('admin/success', {
                    userInfo: req.userInfo,
                    message: '修改成功',
                    url: '/admin/category'
                });
                return Promise.reject();
            } else {
                return Category.findOne({
                    _id: { $ne: id },
                    name: name
                });
            }
        }
    }).then((sameCategory) => {
        if (sameCategory) {
            res.render('admin/error', {
                userInfo: req.userInfo,
                message: '数据库中已经存在同名分类'
            });
            return Promise.reject();
        } else {
            return Category.update({
                _id: id
            }, {
                    name: name
                });
        }
    }).then(() => {
        res.render('admin/success', {
            userInfo: req.userInfo,
            message: '修改成功',
            url: '/admin/category'
        });
    })
});


/* 分类删除 */
router.get('/category/delete', (req, res) => {

    let id = req.query.id || '';

    Category.remove({
        _id: id
    }).then(() => {
        res.render('admin/success', {
            userInfo: req.userInfo,
            message: '删除成功',
            url: '/admin/category'
        });
    });

});

/**
 * 内容首页
 */
router.get('/content', (req, res) => {

    /*当前页数*/
    let page = (req.query.page || 1) >> 0,
        /*每页显示数据*/
        limit = 10,
        /*忽略数据的条数*/
        skip = 0,
        /*总页数*/
        pages = 0;

    Content.count().then((count) => {

        pages = Math.ceil(count / limit);
        page = Math.min(page, pages);
        page = Math.max(page, 1);
        skip = (page - 1) * limit;

        Content.find().sort({ _id: -1 }).limit(limit).skip(skip).populate(['category','user']).sort({
            addTime:-1              
        }).then((contents) => {
            res.render('admin/content_index', {
                userInfo: req.userInfo,
                contents: contents,
                count: count,
                limit: limit,
                page: page,
                pages: pages,
                type: 'content'
            });
        });

    });
});

/**
 * 内容添加页面
 */
router.get('/content/add', (req, res) => {

    Category.find().sort({ _id: -1 }).then((categories) => {

        res.render('admin/content_add', {
            userInfo: req.userInfo,
            categories: categories
        });
    });

});

/**
 * 内容保存
 */
router.post('/content/add', (req, res) => {

    if (req.body.category === '') {
        res.render('admin/error', {
            userInfo: req.userInfo,
            message: '内容分类不能为空'
        });
        return;
    } else if (req.body.title === '') {
        res.render('admin/error', {
            userInfo: req.userInfo,
            message: '内容标题不能为空'
        });
        return;
    }

    new Content({
        category: req.body.category,
        title: req.body.title,
        user:req.userInfo._id.toString(),
        description: req.body.description,
        content: req.body.content
    }).save().then((rs) => {
        res.render('admin/success', {
            userInfo: req.userInfo,
            message: '内容保存成功',
            url: '/admin/content'
        });
    });

});

router.get('/content/edit', (req, res) => {

    let id = req.query.id || '',
        categories = [];

    Category.find().then((rs) => {

        categories = rs;

        return Content.findOne({
            _id: id
        }).populate('category');
    }).then((content) => {
        if (!content) {
            res.render('admin/error', {
                userInfo: req.userInfo,
                message: '指定内容不存在'
            });
        } else {
            res.render('admin/content_edit', {
                userInfo: req.userInfo,
                content: content,
                categories: categories
            });
        }
    });
});

/**  
  *保存修改内容 
*/
router.post('/content/edit', (req, res) => {

    let id = req.query.id || '';

    if (req.body.category === '') {
        res.render('admin/error', {
            userInfo: req.userInfo,
            message: '内容分类不能为空'
        });
        return;
    } else if (req.body.title === '') {
        res.render('admin/error', {
            userInfo: req.userInfo,
            message: '内容标题不能为空'
        });
        return;
    }

    Content.update({
        _id: id
    }, {
            category: req.body.category,
            title: req.body.title,
            description: req.body.description,
            content: req.body.content
        }).then(() => {
            res.render('admin/success', {
                userInfo: req.userInfo,
                message: '保存成功',
                url: `/admin/content/edit?id=${id}`
            });
        });
});

/**  
  *内容删除 
*/
router.get('/content/delete', (req, res) => {

    let id = req.query.id || '';

    Content.remove({
        _id: id
    }).then(() => {
        res.render('admin/success', {
            userInfo: req.userInfo,
            message: '删除成功',
            url: '/admin/content'
        });
    });

});


module.exports = router;