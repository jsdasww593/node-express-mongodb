const express = require('express');
const Category = require('../models/Categories');
const Content = require('../models/Contents');
const router = express.Router();

let data;

/* 处理通用数据 */
router.use((req, res, next) => {

    data = {
        userInfo: req.userInfo,
        categories: [],
    }

    Category.find().then((categories) =>{
         data.categories = categories;
         next();
    });

})

/**
 * 首页
 */
router.get('/', (req, res, next) => {

    data.category = req.query.category || '',
    data.count = 0, 
    data.page = (req.query.page || 1) >> 0,
    data.limit = 5,
    data.pages = 0;

    let where = {};

    if (data.category) {
        where.category = data.category
    }

    Content.where(where).count().then((count) => {

        data.count = count;
        data.pages = Math.ceil(data.count / data.limit);
        data.page = Math.min(data.page, data.pages);
        data.page = Math.max(data.page, 1);
        let skip = (data.page - 1) * data.limit;

        return Content.where(where).find().limit(data.limit).skip(skip).populate(['category', 'user']).sort({
            addTime: -1
        });

    }).then((contents) => {
     
        data.contents = contents;
        res.render('main/index', data);
        
    })

});

router.get('/view', (req, res) => {

    let contentId = req.query.contentid || '';

    Content.findOne({
        _id: contentId
    }).populate('user').then((content) => {

        data.content = content;

        content.views ++;
        content.save();

        res.render('main/view',data);

    });

});

module.exports = router;