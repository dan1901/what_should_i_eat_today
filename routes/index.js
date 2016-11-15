var express = require('express');
var router = express.Router();
var article_model = require('../model/furniture').furniture;

global.g_query = [];
global.title = 'GaGoo Wiki';
/* GET home page. */
router.get('/', function(req, res) {
  //console.log(req.body);
    article_model.count().exec(function (count_error, count_result) {
        if (count_error) {
            console.error(count_error);
            res.render('error',{
               message:count_error,
                error:{status:400,
                    stack: count_error
                }
            });
        }
        else {
            res.render('index', {
                title: title,
                tab1: '가구찾기',
                tab2: '가구등록하기',
                total_count: count_result,
                data: [],
                page_count:1
            });
        }
    });
});



router.get('/search', function (req, res) {
    console.log(req.query.data);
    var data = req.query.data;
    var query = [];
    var page = 0;
    if (req.query.page) {
        page = req.query.page - 1;
    }
    for (key in data) {
        console.log(data[key]);
        if (data[key].category || data[key].name || data[key].width || data[key].height_length || data[key].height) {
            console.log(key, data[key], null);
            query.push(data[key]);
        }
    }
    if (query.length) {
        console.log('global');
        g_query = query;
        console.log({query: g_query});
    }
    article_model.count().exec(function (count_error, count_result) {
        if(count_error){
            console.error(count_error);
            res.render('error',{
                message:count_error,
                error:{status:400,
                    stack: count_error
                }
            });
        }
        else {
            article_model.find({$and: g_query}, {
                _id: false,
                __v: false
            }).sort({_id: -1}).skip(page).limit(20).exec(function (find_error, find_result) {
                if (find_error) {
                    console.error(find_error);
                    res.render('error',{
                        message:find_error,
                        error:{status:400,
                            stack: find_error
                        }
                    });
                } else {
                    //console.log(find_result);
                    var count = (find_result.length % 20) || 0;

                    res.render('index', {
                        title: title,
                        tab1: '가구찾기',
                        tab2: '가구등록하기',
                        total_count: count_result,
                        data: find_result,
                        page_count: count
                    });
                }
            });
        }
    });

});

router.post('/add', function (req, res) {
    console.log(req.body);
    var conv_obj = new article_model({
        category: req.body.category,
        name: req.body.name,
        width: parseInt(req.body.width),
        height_length: parseInt(req.body.height_length),
        height:parseInt(req.body.height),
        price: parseInt(req.body.price),
        image:req.body.image,
        url:req.body.url
    });
    conv_obj.save(function (gagu_add_error) {
        if(gagu_add_error){
            console.error(gagu_add_error)

        }else {
            console.log('save success');
        }

    });
});


module.exports = router;
